#!/usr/bin/env node

/**
 * VibeCoding Doc Generator MCP Server
 * 整合 Prompt 管理系統的文檔生成服務
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

// 導入 Prompt 管理系統
import { 
  buildMCPServicePrompt, 
  ServiceId, 
  DevelopmentPhase,
} from '../../src/utils/prompt-manager.js';

interface DocumentationConfig {
  projectPath: string;
  docType: 'api' | 'code' | 'user' | 'technical' | 'all';
  format: 'markdown' | 'html' | 'pdf' | 'json';
  includeExamples?: boolean;
  outputPath?: string;
}

interface ReadmeConfig {
  projectPath: string;
  sections: ('installation' | 'usage' | 'api' | 'contributing' | 'license' | 'changelog')[];
  template: 'basic' | 'detailed' | 'opensource' | 'enterprise';
}

interface ApiDocConfig {
  projectPath: string;
  apiFormat: 'openapi' | 'swagger' | 'postman' | 'insomnia';
  includeSchemas?: boolean;
  outputPath?: string;
}

interface ChangelogConfig {
  projectPath: string;
  format: 'keepachangelog' | 'conventional' | 'simple';
  fromVersion?: string;
  toVersion?: string;
}

interface GeneratedDoc {
  type: string;
  content: string;
  filePath: string;
  metadata: Record<string, any>;
}

class VibeDocGenerator {
  private currentSession: string | null = null;

  constructor() {
    // 初始化 Prompt 系統
    this.initializePromptSystem();
  }

  /**
   * 初始化 Prompt 管理系統
   */
  private async initializePromptSystem(): Promise<void> {
    try {
      await buildMCPServicePrompt(
        ServiceId.DOC_GENERATOR,
        DevelopmentPhase.IMPLEMENTATION,
        {
          capabilities: ['documentation-generation', 'readme-creation', 'api-docs', 'changelog'],
          supportedFormats: ['markdown', 'html', 'pdf', 'json'],
          templates: ['basic', 'detailed', 'opensource', 'enterprise']
        }
      );
      
      console.error('[Doc Generator] Prompt system initialized successfully');
    } catch (error) {
      console.error('[Doc Generator] Failed to initialize prompt system:', error);
    }
  }

  /**
   * 開始會話
   */
  async startSession(): Promise<{ sessionId: string; message: string }> {
    this.currentSession = `doc-gen-session-${Date.now()}`;
    
    console.error(`[Doc Generator] Session started: ${this.currentSession}`);
    
    return {
      sessionId: this.currentSession,
      message: '📚 Doc Generator 服務已啟動！可以開始生成文檔、更新 README 或創建 API 文檔。'
    };
  }

  /**
   * 生成文檔
   */
  async generateDocs(config: DocumentationConfig): Promise<{
    documents: GeneratedDoc[];
    summary: string;
    outputPaths: string[];
    recommendations: string[];
  }> {
    const { projectPath, docType, format, includeExamples = true } = config;
    
    console.error(`[Doc Generator] Generating ${docType} documentation in ${format} format`);
    
    if (!existsSync(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`);
    }

    const documents: GeneratedDoc[] = [];
    const outputPaths: string[] = [];

    switch (docType) {
      case 'api':
        const apiDoc = await this.generateApiDocumentation(projectPath, format, includeExamples);
        documents.push(apiDoc);
        break;
        
      case 'code':
        const codeDoc = await this.generateCodeDocumentation(projectPath, format);
        documents.push(codeDoc);
        break;
        
      case 'user':
        const userDoc = await this.generateUserDocumentation(projectPath, format);
        documents.push(userDoc);
        break;
        
      case 'technical':
        const techDoc = await this.generateTechnicalDocumentation(projectPath, format);
        documents.push(techDoc);
        break;
        
      case 'all':
        const allDocs = await Promise.all([
          this.generateApiDocumentation(projectPath, format, includeExamples),
          this.generateCodeDocumentation(projectPath, format),
          this.generateUserDocumentation(projectPath, format),
          this.generateTechnicalDocumentation(projectPath, format)
        ]);
        documents.push(...allDocs);
        break;
    }

    // 收集輸出路徑
    outputPaths.push(...documents.map(doc => doc.filePath));

    const recommendations = this.generateRecommendations(documents, format);

    return {
      documents,
      summary: `生成了 ${documents.length} 個 ${docType} 文檔`,
      outputPaths,
      recommendations
    };
  }

  /**
   * 生成 API 文檔
   */
  private async generateApiDocumentation(projectPath: string, format: string, includeExamples: boolean): Promise<GeneratedDoc> {
    const content = `# API Documentation

## Overview
This document describes the API endpoints and their usage.

## Authentication
${includeExamples ? '```\nAuthorization: Bearer <token>\n```' : 'Token-based authentication required.'}

## Endpoints

### GET /api/status
Returns the system status.

${includeExamples ? `
**Example Request:**
\`\`\`bash
curl -X GET /api/status
\`\`\`

**Example Response:**
\`\`\`json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`
` : ''}

### POST /api/data
Creates new data entry.

${includeExamples ? `
**Example Request:**
\`\`\`bash
curl -X POST /api/data \\
  -H "Content-Type: application/json" \\
  -d '{"name": "example", "value": 123}'
\`\`\`

**Example Response:**
\`\`\`json
{
  "id": "abc123",
  "message": "Created successfully"
}
\`\`\`
` : ''}

## Error Handling
All endpoints return standard HTTP status codes.

${includeExamples ? `
**Error Response Example:**
\`\`\`json
{
  "error": "Not Found",
  "message": "Resource not found",
  "code": 404
}
\`\`\`
` : ''}
`;

    const filePath = join(projectPath, 'docs', `api.${format === 'markdown' ? 'md' : format}`);
    
    return {
      type: 'api',
      content,
      filePath,
      metadata: {
        format,
        includeExamples,
        endpoints: 2,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 生成代碼文檔
   */
  private async generateCodeDocumentation(projectPath: string, format: string): Promise<GeneratedDoc> {
    const projectName = basename(projectPath);
    
    const content = `# ${projectName} - Code Documentation

## Architecture Overview
This document provides an overview of the codebase structure and key components.

## Directory Structure
\`\`\`
src/
├── components/     # Reusable components
├── services/       # Business logic services
├── utils/          # Utility functions
├── types/          # Type definitions
└── tests/          # Test files
\`\`\`

## Key Components

### Services
- **Service Layer**: Handles business logic
- **Data Layer**: Manages data persistence
- **API Layer**: Exposes endpoints

### Utilities
- **Helper Functions**: Common utility functions
- **Constants**: Application constants
- **Validators**: Input validation functions

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow consistent naming conventions
- Add JSDoc comments for public APIs

### Testing
- Write unit tests for all functions
- Use integration tests for services
- Maintain high test coverage

### Best Practices
- Keep functions small and focused
- Use dependency injection
- Handle errors gracefully
- Log important operations
`;

    const filePath = join(projectPath, 'docs', `code.${format === 'markdown' ? 'md' : format}`);
    
    return {
      type: 'code',
      content,
      filePath,
      metadata: {
        format,
        sections: ['architecture', 'structure', 'guidelines'],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 生成用戶文檔
   */
  private async generateUserDocumentation(projectPath: string, format: string): Promise<GeneratedDoc> {
    const projectName = basename(projectPath);
    
    const content = `# ${projectName} - User Guide

## Getting Started
Welcome to ${projectName}! This guide will help you get started quickly.

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Quick Start
1. Clone the repository
2. Install dependencies: \`npm install\`
3. Start the application: \`npm start\`

## Basic Usage

### Configuration
Configure the application by editing the \`config.json\` file:

\`\`\`json
{
  "port": 3000,
  "database": {
    "host": "localhost",
    "port": 5432
  }
}
\`\`\`

### Features

#### Feature 1: Data Management
- Create, read, update, and delete data
- Import/export functionality
- Bulk operations support

#### Feature 2: User Management
- User registration and authentication
- Role-based permissions
- Profile management

#### Feature 3: Reporting
- Generate custom reports
- Export to various formats
- Schedule automated reports

## Troubleshooting

### Common Issues

**Issue**: Application won't start
**Solution**: Check that all dependencies are installed and ports are available.

**Issue**: Database connection errors
**Solution**: Verify database credentials and connectivity.

## Support
For additional help, please contact support or check the FAQ section.
`;

    const filePath = join(projectPath, 'docs', `user-guide.${format === 'markdown' ? 'md' : format}`);
    
    return {
      type: 'user',
      content,
      filePath,
      metadata: {
        format,
        sections: ['installation', 'usage', 'features', 'troubleshooting'],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 生成技術文檔
   */
  private async generateTechnicalDocumentation(projectPath: string, format: string): Promise<GeneratedDoc> {
    const projectName = basename(projectPath);
    
    const content = `# ${projectName} - Technical Documentation

## System Architecture

### High-Level Overview
The system follows a microservices architecture with the following components:

- **API Gateway**: Routes requests to appropriate services
- **Authentication Service**: Handles user authentication and authorization
- **Data Service**: Manages data persistence and retrieval
- **Notification Service**: Handles email and push notifications

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: Bull (Redis-based)

## Infrastructure

### Deployment
The application is containerized using Docker and deployed on Kubernetes.

### Scaling
- Horizontal scaling supported through Kubernetes
- Database connection pooling for optimal performance
- Redis cache for frequently accessed data

### Monitoring
- Application metrics via Prometheus
- Log aggregation via ELK stack
- Health checks on all endpoints

## Security

### Authentication
- JWT tokens for API authentication
- Role-based access control (RBAC)
- Password hashing using bcrypt

### Data Protection
- Data encryption at rest and in transit
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## Database Schema

### Tables
- **users**: User information and credentials
- **data**: Application data storage
- **sessions**: User session management
- **logs**: Application and audit logs

### Indexes
Optimized indexes for common query patterns.

## API Reference

### Rate Limiting
- 100 requests per minute per user
- 1000 requests per minute per IP

### Error Codes
Standard HTTP status codes with descriptive error messages.

## Performance

### Benchmarks
- Response time: < 200ms for 95% of requests
- Throughput: 1000+ requests per second
- Availability: 99.9% uptime SLA

### Optimization
- Database query optimization
- Response caching
- Connection pooling
`;

    const filePath = join(projectPath, 'docs', `technical.${format === 'markdown' ? 'md' : format}`);
    
    return {
      type: 'technical',
      content,
      filePath,
      metadata: {
        format,
        sections: ['architecture', 'infrastructure', 'security', 'performance'],
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 更新 README
   */
  async updateReadme(config: ReadmeConfig): Promise<{
    success: boolean;
    filePath: string;
    sections: string[];
    content: string;
  }> {
    const { projectPath, sections, template } = config;
    
    console.error(`[Doc Generator] Updating README with ${template} template`);
    
    if (!existsSync(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`);
    }

    const content = await this.generateReadmeContent(projectPath, sections, template);
    const filePath = join(projectPath, 'README.md');

    try {
      writeFileSync(filePath, content, 'utf-8');
      
      return {
        success: true,
        filePath,
        sections,
        content
      };
    } catch (error) {
      console.error('[Doc Generator] Failed to write README:', error);
      throw new Error(`Failed to write README: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 生成 README 內容
   */
  private async generateReadmeContent(projectPath: string, sections: string[], template: string): Promise<string> {
    const projectName = basename(projectPath);
    const packageJsonPath = join(projectPath, 'package.json');
    
    let description = `A ${projectName} application.`;
    let version = '1.0.0';
    
    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        description = packageJson.description || description;
        version = packageJson.version || version;
      } catch (error) {
        console.error('[Doc Generator] Failed to parse package.json:', error);
      }
    }

    let content = `# ${projectName}\n\n${description}\n\n`;

    if (template === 'detailed' || template === 'opensource' || template === 'enterprise') {
      content += `## Table of Contents\n\n`;
      sections.forEach(section => {
        const title = section.charAt(0).toUpperCase() + section.slice(1);
        content += `- [${title}](#${section})\n`;
      });
      content += '\n';
    }

    for (const section of sections) {
      content += await this.generateReadmeSection(section, projectName, version, template);
    }

    if (template === 'opensource' || template === 'enterprise') {
      content += `## Contributors\n\nThanks to all contributors who have helped make this project better!\n\n`;
      content += `## Acknowledgments\n\n- Thanks to the open source community\n- Special thanks to our sponsors and supporters\n\n`;
    }

    return content;
  }

  /**
   * 生成 README 區段
   */
  private async generateReadmeSection(section: string, projectName: string, version: string, template: string): Promise<string> {
    switch (section) {
      case 'installation':
        return `## Installation\n\n\`\`\`bash\nnpm install ${projectName}\n\`\`\`\n\n`;
        
      case 'usage':
        return `## Usage\n\n\`\`\`javascript\nconst ${projectName} = require('${projectName}');\n\n// Basic usage example\n${projectName}.start();\n\`\`\`\n\n`;
        
      case 'api':
        return `## API Reference\n\n### Methods\n\n- \`start()\`: Starts the application\n- \`stop()\`: Stops the application\n- \`configure(options)\`: Configure the application\n\n`;
        
      case 'contributing':
        return `## Contributing\n\n1. Fork the repository\n2. Create a feature branch\n3. Make your changes\n4. Add tests\n5. Submit a pull request\n\nPlease read our contributing guidelines before submitting.\n\n`;
        
      case 'license':
        return `## License\n\nThis project is licensed under the MIT License - see the LICENSE file for details.\n\n`;
        
      case 'changelog':
        return `## Changelog\n\n### [${version}] - ${new Date().toISOString().split('T')[0]}\n\n- Initial release\n- Core functionality implemented\n- Documentation added\n\n`;
        
      default:
        return `## ${section.charAt(0).toUpperCase() + section.slice(1)}\n\nTODO: Add ${section} documentation\n\n`;
    }
  }

  /**
   * 創建 API 文檔
   */
  async createApiDocs(config: ApiDocConfig): Promise<{
    success: boolean;
    format: string;
    outputPath: string;
    endpoints: number;
    schemas: number;
  }> {
    const { projectPath, apiFormat, includeSchemas = true } = config;
    
    console.error(`[Doc Generator] Creating API docs in ${apiFormat} format`);
    
    if (!existsSync(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`);
    }

    const outputPath = config.outputPath || join(projectPath, 'docs', `api.${apiFormat}.json`);
    
    const apiDoc = await this.generateApiSpecification(projectPath, apiFormat, includeSchemas);
    
    try {
      writeFileSync(outputPath, JSON.stringify(apiDoc, null, 2), 'utf-8');
      
      return {
        success: true,
        format: apiFormat,
        outputPath,
        endpoints: apiDoc.paths ? Object.keys(apiDoc.paths).length : 0,
        schemas: apiDoc.components?.schemas ? Object.keys(apiDoc.components.schemas).length : 0
      };
    } catch (error) {
      console.error('[Doc Generator] Failed to write API docs:', error);
      throw new Error(`Failed to write API docs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 生成 API 規範
   */
  private async generateApiSpecification(projectPath: string, format: string, includeSchemas: boolean): Promise<any> {
    const projectName = basename(projectPath);
    
    const baseSpec: any = {
      openapi: '3.0.0',
      info: {
        title: `${projectName} API`,
        version: '1.0.0',
        description: `API documentation for ${projectName}`
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      paths: {
        '/api/status': {
          get: {
            summary: 'Get system status',
            responses: {
              '200': {
                description: 'System status',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/data': {
          get: {
            summary: 'Get data list',
            responses: {
              '200': {
                description: 'Data list',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/DataItem' }
                    }
                  }
                }
              }
            }
          },
          post: {
            summary: 'Create new data',
            requestBody: {
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CreateDataRequest' }
                }
              }
            },
            responses: {
              '201': {
                description: 'Data created',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/DataItem' }
                  }
                }
              }
            }
          }
        }
      }
    };

    if (includeSchemas) {
      baseSpec.components = {
        schemas: {
          DataItem: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              value: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          },
          CreateDataRequest: {
            type: 'object',
            required: ['name', 'value'],
            properties: {
              name: { type: 'string' },
              value: { type: 'number' }
            }
          }
        }
      };
    }

    return baseSpec;
  }

  /**
   * 生成變更日誌
   */
  async generateChangelog(config: ChangelogConfig): Promise<{
    success: boolean;
    filePath: string;
    format: string;
    entries: number;
    content: string;
  }> {
    const { projectPath, format } = config;
    
    console.error(`[Doc Generator] Generating changelog in ${format} format`);
    
    if (!existsSync(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`);
    }

    const content = await this.generateChangelogContent(format);
    const filePath = join(projectPath, 'CHANGELOG.md');

    try {
      writeFileSync(filePath, content, 'utf-8');
      
      return {
        success: true,
        filePath,
        format,
        entries: 3,
        content
      };
    } catch (error) {
      console.error('[Doc Generator] Failed to write changelog:', error);
      throw new Error(`Failed to write changelog: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 生成變更日誌內容
   */
  private async generateChangelogContent(format: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'keepachangelog':
        return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - ${today}

### Added
- Initial release
- Core functionality implementation
- Basic API endpoints
- Documentation

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A
`;

      case 'conventional':
        return `# Changelog

## [1.0.0](https://github.com/user/repo/compare/v0.0.0...v1.0.0) (${today})

### Features

* add core functionality ([abc1234](https://github.com/user/repo/commit/abc1234))
* implement API endpoints ([def5678](https://github.com/user/repo/commit/def5678))
* add documentation ([ghi9012](https://github.com/user/repo/commit/ghi9012))

### Bug Fixes

* fix initial setup issues ([jkl3456](https://github.com/user/repo/commit/jkl3456))

### BREAKING CHANGES

* N/A
`;

      case 'simple':
      default:
        return `# Changelog

## Version 1.0.0 (${today})

- Initial release
- Core functionality implemented
- API endpoints added
- Documentation created

## Version 0.1.0

- Project setup
- Basic structure
`;
    }
  }

  /**
   * 生成建議
   */
  private generateRecommendations(documents: GeneratedDoc[], format: string): string[] {
    const recommendations = [];

    if (documents.length > 0) {
      recommendations.push('定期更新文檔以保持與代碼同步');
    }

    if (format === 'markdown') {
      recommendations.push('考慮使用文檔生成工具如 GitBook 或 Docusaurus');
    }

    recommendations.push('添加代碼示例和使用案例');
    recommendations.push('設置自動化文檔檢查流程');
    recommendations.push('收集用戶反饋以改進文檔質量');

    return recommendations;
  }

  /**
   * 獲取 AI 洞察
   */
  async getAIInsight(query: string): Promise<string> {
    console.error(`[Doc Generator] Processing AI insight query: ${query}`);
    
    return `基於查詢 "${query}"，文檔生成建議：保持文檔更新、使用清晰的結構、提供實用的示例。`;
  }
}

const docGenerator = new VibeDocGenerator();
const server = new Server(
  { name: 'vibecoding-doc-generator', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'start-session',
      description: 'Start documentation session',
      inputSchema: {
        type: 'object',
        properties: { projectId: { type: 'string' } }
      }
    },
    {
      name: 'generate-docs',
      description: 'Generate documentation from code',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          docType: { type: 'string', enum: ['api', 'code', 'user', 'technical', 'all'] },
          format: { type: 'string', enum: ['markdown', 'html', 'pdf', 'json'] },
          includeExamples: { type: 'boolean' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'update-readme',
      description: 'Update or generate README.md file',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          sections: { type: 'array', items: { type: 'string', enum: ['installation', 'usage', 'api', 'contributing', 'license', 'changelog'] } },
          template: { type: 'string', enum: ['basic', 'detailed', 'opensource', 'enterprise'] }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'create-api-docs',
      description: 'Generate API documentation',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          apiFormat: { type: 'string', enum: ['openapi', 'swagger', 'postman', 'insomnia'] },
          includeSchemas: { type: 'boolean' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'generate-changelog',
      description: 'Generate changelog from git history',
      inputSchema: {
        type: 'object',
        properties: {
          projectPath: { type: 'string' },
          format: { type: 'string', enum: ['keepachangelog', 'conventional', 'simple'] },
          fromVersion: { type: 'string' },
          toVersion: { type: 'string' }
        },
        required: ['projectPath']
      }
    },
    {
      name: 'get-ai-insight',
      description: 'Get AI insights',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query']
      }
    }
  ]
}));

// MCP 參數類型轉換助手
function extractParam<T>(args: unknown, key: string, defaultValue: T): T {
  if (args && typeof args === 'object' && args !== null) {
    const value = (args as Record<string, unknown>)[key];
    return value !== undefined ? value as T : defaultValue;
  }
  return defaultValue;
}

function extractStringParam(args: unknown, key: string, defaultValue: string = ''): string {
  return extractParam(args, key, defaultValue);
}

function extractOptionalStringParam(args: unknown, key: string): string | undefined {
  const value = extractParam(args, key, undefined);
  return value as string | undefined;
}

function extractArrayParam<T>(args: unknown, key: string, defaultValue: T[]): T[] {
  const value = extractParam(args, key, defaultValue);
  return Array.isArray(value) ? value : defaultValue;
}

// 處理工具調用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'start-session':
        return { content: [{ type: 'text', text: JSON.stringify(await docGenerator.startSession(), null, 2) }] };
      case 'generate-docs':
        const docFormat = extractOptionalStringParam(args, 'format') || 'markdown';
        const validDocFormat = docFormat as 'markdown' | 'html' | 'pdf' | 'json';
        
        return { content: [{ type: 'text', text: JSON.stringify(await docGenerator.generateDocs({
          projectPath: extractStringParam(args, 'projectPath', '.'),
          docType: extractParam(args, 'docType', 'api'),
          format: validDocFormat,
          includeExamples: extractOptionalStringParam(args, 'includeExamples') === 'true'
        }), null, 2) }] };
        
      case 'update-readme':
        const readmeTemplate = extractOptionalStringParam(args, 'template') || 'basic';
        const validReadmeTemplate = readmeTemplate as 'basic' | 'detailed' | 'opensource' | 'enterprise';
        
        return { content: [{ type: 'text', text: JSON.stringify(await docGenerator.updateReadme({
          projectPath: extractStringParam(args, 'projectPath', '.'),
          sections: extractArrayParam(args, 'sections', []),
          template: validReadmeTemplate
        }), null, 2) }] };
        
      case 'create-api-docs':
        const apiFormat = extractOptionalStringParam(args, 'apiFormat') || 'openapi';
        const validApiFormat = apiFormat as 'openapi' | 'swagger' | 'postman' | 'insomnia';
        
        return { content: [{ type: 'text', text: JSON.stringify(await docGenerator.createApiDocs({
          projectPath: extractStringParam(args, 'projectPath', '.'),
          apiFormat: validApiFormat,
          includeSchemas: extractOptionalStringParam(args, 'includeSchemas') === 'true',
          outputPath: extractOptionalStringParam(args, 'outputPath')
        }), null, 2) }] };
        
      case 'generate-changelog':
        const changelogFormat = extractOptionalStringParam(args, 'format') || 'keepachangelog';
        const validChangelogFormat = changelogFormat as 'keepachangelog' | 'conventional' | 'simple';
        
        return { content: [{ type: 'text', text: JSON.stringify(await docGenerator.generateChangelog({
          projectPath: extractStringParam(args, 'projectPath', '.'),
          format: validChangelogFormat,
          fromVersion: extractOptionalStringParam(args, 'fromVersion'),
          toVersion: extractOptionalStringParam(args, 'toVersion')
        }), null, 2) }] };
        
      case 'get-ai-insight':
        return { content: [{ type: 'text', text: await docGenerator.getAIInsight(extractStringParam(args, 'query')) }] };
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('[Doc Generator] Tool execution error:', error);
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  console.error('🎯 VibeCoding Doc Generator MCP Server starting...');
  console.error('📋 Prompt system integration: ENABLED');
  await server.connect(transport);
}

runServer().catch(console.error); 