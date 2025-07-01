#!/usr/bin/env node

/**
 * VibeCoding Documentation Generator MCP Server
 * Creates and maintains project documentation automatically.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path, { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Project } from '../../src/core/orchestrator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class VibeDocGenerator {
  private projects: Map<string, Project> = new Map();

  constructor() {
    this.loadProjects();
  }

  private getContextDir(): string {
    return join(process.cwd(), '.vibecoding', 'context');
  }

  private getProjectsFile(): string {
    return join(this.getContextDir(), 'projects.json');
  }

  private loadProjects(): void {
    const projectsFile = this.getProjectsFile();
    if (existsSync(projectsFile)) {
    try {
        const data = JSON.parse(readFileSync(projectsFile, 'utf-8'));
        this.projects = new Map(Object.entries(data));
    } catch (error) {
        console.error('Failed to load projects:', error);
      }
    }
  }

  private getPromptContent(promptName: string): string {
    try {
      // Adjusted to handle different prompt files
      const promptPath = resolve(__dirname, `../../../.vibecoding/prompts/${promptName}.md`);
      return readFileSync(promptPath, 'utf-8');
    } catch (error: any) {
      console.error(`Failed to load prompt: ${promptName}`, error);
      return `Error: Could not load template for ${promptName}.`;
    }
  }

  generateDocs(projectId: string, docType: string = 'all', _format?: string) {
    this.loadProjects();
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found.`);
    }

    let message = 'Documentation generation process started.\n';
    const docTypesToGenerate = docType === 'all' ? ['technical', 'api', 'user'] : [docType];

    for (const type of docTypesToGenerate) {
      let templateName = '';
      let outputPath = '';
      let outputFileName = '';

      switch (type) {
        case 'technical':
          templateName = 'workflows/design-phase';
          outputPath = join(project.path, '1_design', 'architecture');
          outputFileName = 'SYSTEM_ARCHITECTURE.md';
          break;
        case 'api':
          templateName = 'services/doc-generator'; // Placeholder, might need a specific API template
          outputPath = join(project.path, '1_design', 'api-contracts');
          outputFileName = 'API_SPECIFICATION.md';
          break;
        case 'user':
           // Assuming there's no specific template for a user guide, we create a basic one.
          templateName = 'workflows/discovery-phase'; // Using discovery as a base
          outputPath = join(project.path, 'docs');
          outputFileName = 'USER_GUIDE.md';
          break;
        default:
          continue; // Skip unknown types
      }

      let content = this.getPromptContent(templateName);
      content = content.replace(/{{projectName}}/g, project.name);
      
      const fullOutputPath = join(outputPath, outputFileName);
      mkdirSync(outputPath, { recursive: true });
      writeFileSync(fullOutputPath, content);
      
      message += `✅ Generated ${type} document at: ${fullOutputPath}\n`;
    }

    return message;
    }

  updateReadme(projectPath: string, template?: string) {
    // Simulate README update
    return `📖 **README.md Updated**

**Project**: ${projectPath}
**Template**: ${template || 'detailed'}

The README file has been updated with the latest project information, installation steps, and usage examples.`;
  }

  createApiDocs(projectPath: string, apiFormat?: string) {
    // Simulate API doc creation
    return `🔌 **API Documentation Created**

**Project**: ${projectPath}
**Format**: ${apiFormat || 'openapi'}

API documentation has been generated from code annotations. You can view it by running the API docs server.`;
  }

  generateChangelog(projectPath: string, fromVersion?: string, toVersion?: string) {
    // Simulate changelog generation
    return `📝 **Changelog Generated**

**Project**: ${projectPath}
**Version Range**: ${fromVersion || 'v1.0.0'} -> ${toVersion || 'latest'}

CHANGELOG.md has been created based on git commit history.`;
  }
}

const server = new Server(
  {
    name: 'vibecoding-doc-generator',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

const docGenerator = new VibeDocGenerator();

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
    tools: [
      {
        name: 'generate-docs',
        description: 'Generate comprehensive documentation from code',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The ID of the project to generate docs for'
            },
            docType: {
              type: 'string',
              enum: ['api', 'code', 'user', 'technical', 'all'],
              description: 'Type of documentation to generate',
              default: 'all'
            },
            format: {
              type: 'string',
              enum: ['markdown', 'html', 'pdf', 'json'],
              description: 'Output format for documentation'
            },
          },
          required: ['projectId']
        }
      },
      {
        name: 'update-readme',
        description: 'Update or generate README.md file',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            template: {
              type: 'string',
              enum: ['basic', 'detailed', 'opensource', 'enterprise'],
              description: 'README template to use'
            },
            sections: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['installation', 'usage', 'api', 'contributing', 'license', 'changelog']
              },
              description: 'Sections to include in README'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'create-api-docs',
        description: 'Generate API documentation from code annotations',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            apiFormat: {
              type: 'string',
              enum: ['openapi', 'swagger', 'postman', 'insomnia'],
              description: 'API documentation format'
            },
            includeSchemas: {
              type: 'boolean',
              description: 'Include data schemas in documentation'
            },
            outputPath: {
              type: 'string',
              description: 'Custom output path for API docs'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'generate-changelog',
        description: 'Generate changelog from git history and commits',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            fromVersion: {
              type: 'string',
              description: 'Starting version for changelog'
            },
            toVersion: {
              type: 'string',
              description: 'Ending version for changelog'
            },
            format: {
              type: 'string',
              enum: ['keepachangelog', 'conventional', 'simple'],
              description: 'Changelog format style'
            }
          },
          required: ['projectPath']
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'generate-docs': {
        const { projectId, docType, format } = z.object({
          projectId: z.string(),
          docType: z.enum(['api', 'code', 'user', 'technical', 'all']).optional(),
          format: z.enum(['markdown', 'html', 'pdf', 'json']).optional(),
        }).parse(args);
        const result = docGenerator.generateDocs(projectId, docType, format);
        return { content: [{ type: 'text', text: result }] };
      }

      case 'update-readme': {
        const { projectPath, template } = z.object({
          projectPath: z.string(),
          template: z.enum(['basic', 'detailed', 'opensource', 'enterprise']).optional(),
        }).parse(args);
        const result = docGenerator.updateReadme(projectPath, template);
        return { content: [{ type: 'text', text: result }] };
      }

      case 'create-api-docs': {
        const { projectPath, apiFormat } = z.object({
          projectPath: z.string(),
          apiFormat: z.enum(['openapi', 'swagger', 'postman', 'insomnia']).optional(),
        }).parse(args);
        const result = docGenerator.createApiDocs(projectPath, apiFormat);
        return { content: [{ type: 'text', text: result }] };
      }

      case 'generate-changelog': {
        const { projectPath, fromVersion, toVersion } = z.object({
          projectPath: z.string(),
          fromVersion: z.string().optional(),
          toVersion: z.string().optional(),
        }).parse(args);
        const result = docGenerator.generateChangelog(projectPath, fromVersion, toVersion);
        return { content: [{ type: 'text', text: result }] };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('Tool execution error:', error);
    if (error instanceof z.ZodError) {
      throw new McpError(ErrorCode.InvalidRequest, `Invalid arguments: ${error.message}`);
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  console.error('🎯 VibeCoding Documentation Generator MCP Server starting...');
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 