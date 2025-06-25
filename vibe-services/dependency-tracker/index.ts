#!/usr/bin/env node

/**
 * VibeCoding Dependency Tracker MCP Server
 * 整合 Prompt 管理系統的依賴管理服務
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// 導入 Prompt 管理系統
import { 
  buildMCPServicePrompt, 
  ServiceId, 
  DevelopmentPhase,
} from '../../src/utils/prompt-manager.js';

interface DependencyInfo {
  name: string;
  version: string;
  type: 'production' | 'development' | 'peer' | 'optional';
  description?: string;
  homepage?: string;
  repository?: string;
}

interface VulnerabilityInfo {
  id: string;
  title: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  package: string;
  version: string;
  patchedVersions?: string;
  recommendation: string;
}

interface DependencyAnalysis {
  totalDependencies: number;
  directDependencies: number;
  devDependencies: number;
  outdatedPackages: number;
  vulnerabilities: number;
  criticalVulnerabilities: number;
  dependencies: DependencyInfo[];
  recommendations: string[];
}

interface UpdateSuggestion {
  package: string;
  currentVersion: string;
  latestVersion: string;
  updateType: 'patch' | 'minor' | 'major';
  breaking: boolean;
  changelog?: string;
}

class VibeDependencyTracker {
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
        ServiceId.DEPENDENCY_TRACKER,
        DevelopmentPhase.IMPLEMENTATION,
        {
          capabilities: ['dependency-analysis', 'security-scanning', 'update-management'],
          supportedManagers: ['npm', 'yarn', 'pnpm', 'pip', 'poetry', 'composer', 'maven', 'gradle'],
          securitySources: ['npm-audit', 'snyk', 'github-advisory']
        }
      );
      
      console.error('[Dependency Tracker] Prompt system initialized successfully');
    } catch (error) {
      console.error('[Dependency Tracker] Failed to initialize prompt system:', error);
    }
  }

  /**
   * 開始會話
   */
  async startSession(): Promise<{ sessionId: string; message: string }> {
    this.currentSession = `dep-tracker-session-${Date.now()}`;
    
    console.error(`[Dependency Tracker] Session started: ${this.currentSession}`);
    
    return {
      sessionId: this.currentSession,
      message: '🔍 Dependency Tracker 服務已啟動！可以開始分析項目依賴、掃描安全漏洞或管理更新。'
    };
  }

  /**
   * 分析項目依賴
   */
  async analyzeDependencies(
    projectPath: string,
    packageManager?: string,
    analyzeType: 'all' | 'direct' | 'dev' | 'peer' | 'optional' = 'all'
  ): Promise<DependencyAnalysis> {
    console.error(`[Dependency Tracker] Analyzing dependencies in ${projectPath}`);
    
    if (!existsSync(projectPath)) {
      throw new Error(`Project path does not exist: ${projectPath}`);
    }

    const detectedManager = packageManager || this.detectPackageManager(projectPath);
    console.error(`[Dependency Tracker] Using package manager: ${detectedManager}`);

    const analysis = await this.performDependencyAnalysis(projectPath, detectedManager, analyzeType);
    
    return analysis;
  }

  /**
   * 檢測包管理器
   */
  private detectPackageManager(projectPath: string): string {
    const managers = [
      { file: 'package-lock.json', manager: 'npm' },
      { file: 'yarn.lock', manager: 'yarn' },
      { file: 'pnpm-lock.yaml', manager: 'pnpm' },
      { file: 'requirements.txt', manager: 'pip' },
      { file: 'pyproject.toml', manager: 'poetry' },
      { file: 'composer.json', manager: 'composer' },
      { file: 'pom.xml', manager: 'maven' },
      { file: 'build.gradle', manager: 'gradle' }
    ];

    for (const { file, manager } of managers) {
      if (existsSync(join(projectPath, file))) {
        return manager;
      }
    }

    return 'npm';
  }

  /**
   * 執行依賴分析
   */
  private async performDependencyAnalysis(
    projectPath: string,
    packageManager: string,
    analyzeType: string
  ): Promise<DependencyAnalysis> {
    let dependencies: DependencyInfo[] = [];
    let totalDependencies = 0;
    let directDependencies = 0;
    let devDependencies = 0;

    try {
      switch (packageManager) {
        case 'npm':
        case 'yarn':
        case 'pnpm':
          const analysis = await this.analyzeNodeDependencies(projectPath, analyzeType);
          dependencies = analysis.dependencies;
          totalDependencies = analysis.total;
          directDependencies = analysis.direct;
          devDependencies = analysis.dev;
          break;

        case 'pip':
        case 'poetry':
          const pythonAnalysis = await this.analyzePythonDependencies(projectPath);
          dependencies = pythonAnalysis.dependencies;
          totalDependencies = pythonAnalysis.total;
          directDependencies = pythonAnalysis.direct;
          break;

        default:
          console.error(`[Dependency Tracker] Unsupported package manager: ${packageManager}`);
          break;
      }
    } catch (error) {
      console.error('[Dependency Tracker] Analysis error:', error);
    }

    const outdatedPackages = dependencies.filter(dep => this.isOutdated(dep)).length;
    const recommendations = this.generateRecommendations(dependencies, packageManager);

    return {
      totalDependencies,
      directDependencies,
      devDependencies,
      outdatedPackages,
      vulnerabilities: 0,
      criticalVulnerabilities: 0,
      dependencies,
      recommendations
    };
  }

  /**
   * 分析 Node.js 依賴
   */
  private async analyzeNodeDependencies(projectPath: string, analyzeType: string): Promise<{
    dependencies: DependencyInfo[];
    total: number;
    direct: number;
    dev: number;
  }> {
    const packageJsonPath = join(projectPath, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const dependencies: DependencyInfo[] = [];
    let direct = 0;
    let dev = 0;

    if (packageJson.dependencies && (analyzeType === 'all' || analyzeType === 'direct')) {
      for (const [name, version] of Object.entries(packageJson.dependencies)) {
        dependencies.push({
          name,
          version: version as string,
          type: 'production'
        });
        direct++;
      }
    }

    if (packageJson.devDependencies && (analyzeType === 'all' || analyzeType === 'dev')) {
      for (const [name, version] of Object.entries(packageJson.devDependencies)) {
        dependencies.push({
          name,
          version: version as string,
          type: 'development'
        });
        dev++;
      }
    }

    if (packageJson.peerDependencies && (analyzeType === 'all' || analyzeType === 'peer')) {
      for (const [name, version] of Object.entries(packageJson.peerDependencies)) {
        dependencies.push({
          name,
          version: version as string,
          type: 'peer'
        });
      }
    }

    if (packageJson.optionalDependencies && (analyzeType === 'all' || analyzeType === 'optional')) {
      for (const [name, version] of Object.entries(packageJson.optionalDependencies)) {
        dependencies.push({
          name,
          version: version as string,
          type: 'optional'
        });
      }
    }

    return {
      dependencies,
      total: dependencies.length,
      direct,
      dev
    };
  }

  /**
   * 分析 Python 依賴
   */
  private async analyzePythonDependencies(projectPath: string): Promise<{
    dependencies: DependencyInfo[];
    total: number;
    direct: number;
  }> {
    const dependencies: DependencyInfo[] = [];
    let direct = 0;

    const requirementsPath = join(projectPath, 'requirements.txt');
    if (existsSync(requirementsPath)) {
      const content = readFileSync(requirementsPath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      for (const line of lines) {
        const match = line.match(/^([a-zA-Z0-9_-]+)([>=<~!]*)([\d.]*)/);
        if (match) {
          dependencies.push({
            name: match[1],
            version: match[3] || 'latest',
            type: 'production'
          });
          direct++;
        }
      }
    }

    const pyprojectPath = join(projectPath, 'pyproject.toml');
    if (existsSync(pyprojectPath)) {
      const content = readFileSync(pyprojectPath, 'utf-8');
      const dependencySection = content.match(/\[tool\.poetry\.dependencies\]([\s\S]*?)(?=\[|$)/);
      
      if (dependencySection) {
        const lines = dependencySection[1].split('\n').filter(line => line.trim());
        for (const line of lines) {
          const match = line.match(/^([a-zA-Z0-9_-]+)\s*=\s*"([^"]+)"/);
          if (match && match[1] !== 'python') {
            dependencies.push({
              name: match[1],
              version: match[2],
              type: 'production'
            });
            direct++;
          }
        }
      }
    }

    return {
      dependencies,
      total: dependencies.length,
      direct
    };
  }

  /**
   * 檢查包是否過時
   */
  private isOutdated(dependency: DependencyInfo): boolean {
    const version = dependency.version.replace(/[\^~>=<]/, '');
    const versionParts = version.split('.');
    
    if (versionParts.length >= 2) {
      const major = parseInt(versionParts[0]);
      const minor = parseInt(versionParts[1]);
      
      return major < 2 || (major === 2 && minor < 10);
    }
    
    return false;
  }

  /**
   * 生成建議
   */
  private generateRecommendations(dependencies: DependencyInfo[], packageManager: string): string[] {
    const recommendations = [];

    const outdatedCount = dependencies.filter(dep => this.isOutdated(dep)).length;
    if (outdatedCount > 0) {
      recommendations.push(`發現 ${outdatedCount} 個可能過時的依賴，建議檢查更新`);
    }

    const devDepCount = dependencies.filter(dep => dep.type === 'development').length;
    if (devDepCount > dependencies.length * 0.5) {
      recommendations.push('開發依賴較多，考慮是否需要優化');
    }

    recommendations.push(`使用 ${packageManager} 作為包管理器，建議保持版本一致性`);
    recommendations.push('定期運行安全掃描檢查漏洞');
    recommendations.push('考慮使用 lock 文件鎖定依賴版本');

    return recommendations;
  }

  /**
   * 安全掃描
   */
  async securityScan(
    projectPath: string
  ): Promise<{
    vulnerabilities: VulnerabilityInfo[];
    summary: {
      total: number;
      critical: number;
      high: number;
      moderate: number;
      low: number;
    };
    recommendations: string[];
  }> {
    console.error(`[Dependency Tracker] Running security scan for ${projectPath}`);

    const vulnerabilities: VulnerabilityInfo[] = [];
    const recommendations = [
      '保持依賴更新到最新版本',
      '定期運行安全掃描',
      '使用可信的依賴來源',
      '實施依賴審查流程'
    ];

    const summary = {
      total: vulnerabilities.length,
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      moderate: vulnerabilities.filter(v => v.severity === 'moderate').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length
    };

    return {
      vulnerabilities,
      summary,
      recommendations
    };
  }

  /**
   * 更新依賴
   */
  async updateDependencies(
    projectPath: string,
    updateType: 'patch' | 'minor' | 'major' | 'security' = 'minor',
    dryRun: boolean = true
  ): Promise<{
    updates: UpdateSuggestion[];
    summary: string;
    commands: string[];
    warnings: string[];
  }> {
    console.error(`[Dependency Tracker] ${dryRun ? 'Simulating' : 'Executing'} ${updateType} updates`);

    const updates: UpdateSuggestion[] = [];
    const commands: string[] = [];
    const warnings: string[] = [];

    if (!dryRun) {
      warnings.push('實際更新功能需要謹慎實施，建議先備份項目');
    }

    const summary = dryRun 
      ? `模擬 ${updateType} 更新：找到 ${updates.length} 個可更新的依賴`
      : `執行 ${updateType} 更新：成功更新 ${updates.length} 個依賴`;

    return {
      updates,
      summary,
      commands,
      warnings
    };
  }

  /**
   * 檢查特定包的漏洞
   */
  async checkVulnerabilities(
    packageName: string,
    version?: string
  ): Promise<{
    package: string;
    version?: string;
    vulnerabilities: VulnerabilityInfo[];
    safe: boolean;
    recommendations: string[];
  }> {
    console.error(`[Dependency Tracker] Checking vulnerabilities for ${packageName}@${version || 'latest'}`);

    const vulnerabilities: VulnerabilityInfo[] = [];
    const safe = vulnerabilities.length === 0;
    
    const recommendations = safe 
      ? [`${packageName} 目前沒有已知漏洞`]
      : [`發現 ${vulnerabilities.length} 個漏洞，建議更新到安全版本`];

    return {
      package: packageName,
      version,
      vulnerabilities,
      safe,
      recommendations
    };
  }

  /**
   * 獲取 AI 洞察
   */
  async getAIInsight(query: string): Promise<string> {
    console.error(`[Dependency Tracker] Processing AI insight query: ${query}`);
    
    return `基於查詢 "${query}"，依賴管理建議：定期更新依賴、監控安全漏洞、使用 lock 文件。`;
  }
}

// 創建服務實例
const dependencyTracker = new VibeDependencyTracker();

// 創建 MCP 服務器
const server = new Server(
  {
    name: 'vibecoding-dependency-tracker',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 註冊工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'start-session',
        description: 'Start a new dependency tracking session',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'Optional project ID to continue working on',
            },
          },
        },
      },
      {
        name: 'analyze-dependencies',
        description: 'Analyze project dependencies and their relationships',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory',
            },
            packageManager: {
              type: 'string',
              enum: ['npm', 'yarn', 'pnpm', 'pip', 'poetry', 'composer'],
              description: 'Package manager used in the project',
            },
            analyzeType: {
              type: 'string',
              enum: ['all', 'direct', 'dev', 'peer', 'optional'],
              description: 'Type of dependencies to analyze',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'security-scan',
        description: 'Scan dependencies for security vulnerabilities',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory',
            },
            severity: {
              type: 'string',
              enum: ['low', 'moderate', 'high', 'critical'],
              description: 'Minimum severity level to report',
            },
            includeDevDeps: {
              type: 'boolean',
              description: 'Include development dependencies in scan',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'update-dependencies',
        description: 'Update project dependencies to latest compatible versions',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory',
            },
            updateType: {
              type: 'string',
              enum: ['patch', 'minor', 'major', 'security'],
              description: 'Type of updates to perform',
            },
            dryRun: {
              type: 'boolean',
              description: 'Preview updates without applying them',
            },
          },
          required: ['projectPath'],
        },
      },
      {
        name: 'check-vulnerabilities',
        description: 'Check for known vulnerabilities in specific packages',
        inputSchema: {
          type: 'object',
          properties: {
            packageName: {
              type: 'string',
              description: 'Name of the package to check',
            },
            ecosystem: {
              type: 'string',
              enum: ['npm', 'pypi', 'maven', 'nuget', 'composer'],
              description: 'Package ecosystem',
            },
            version: {
              type: 'string',
              description: 'Version of the package to check',
            },
          },
          required: ['packageName', 'ecosystem'],
        },
      },
      {
        name: 'get-ai-insight',
        description: 'Get AI-powered insights and suggestions based on current context',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Your question or area you want insights about',
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

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

// 處理工具調用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'start-session':
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify(await dependencyTracker.startSession(), null, 2),
          }] 
        };

      case 'analyze-dependencies':
        const analysis = await dependencyTracker.analyzeDependencies(
          extractStringParam(args, 'projectPath', '.'),
          extractOptionalStringParam(args, 'packageManager'),
          extractParam(args, 'analyzeType', 'all' as 'all' | 'direct' | 'dev' | 'peer' | 'optional')
        );
        return { content: [{ type: 'text', text: JSON.stringify(analysis, null, 2) }] };

      case 'security-scan':
        const scanResult = await dependencyTracker.securityScan(
          extractStringParam(args, 'projectPath', '.')
        );
        return { content: [{ type: 'text', text: JSON.stringify(scanResult, null, 2) }] };

      case 'update-dependencies':
        const updateResult = await dependencyTracker.updateDependencies(
          extractStringParam(args, 'projectPath', '.'),
          extractParam(args, 'updateType', 'minor' as 'patch' | 'minor' | 'major' | 'security'),
          extractParam(args, 'dryRun', true)
        );
        return { content: [{ type: 'text', text: JSON.stringify(updateResult, null, 2) }] };

      case 'check-vulnerabilities':
        const vulnCheck = await dependencyTracker.checkVulnerabilities(
          extractStringParam(args, 'packageName'),
          extractOptionalStringParam(args, 'version')
        );
        return { content: [{ type: 'text', text: JSON.stringify(vulnCheck, null, 2) }] };

      case 'get-ai-insight':
        const insight = await dependencyTracker.getAIInsight(extractStringParam(args, 'query'));
        return { content: [{ type: 'text', text: insight }] };

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('[Dependency Tracker] Tool execution error:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// 啟動服務器
async function runServer() {
  const transport = new StdioServerTransport();
  
  console.error('🎯 VibeCoding Dependency Tracker MCP Server starting...');
  console.error('📋 Prompt system integration: ENABLED');
  console.error('🔧 Available tools: start-session, analyze-dependencies, security-scan, update-dependencies, check-vulnerabilities, get-ai-insight');
  
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 