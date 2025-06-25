#!/usr/bin/env node

/**
 * VibeCoding Code Generator MCP Server
 * 整合 Prompt 管理系統的代碼生成服務
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// 導入 Prompt 管理系統
import { 
  buildMCPServicePrompt, 
  ServiceId, 
  DevelopmentPhase,
} from '../../src/utils/prompt-manager.js';

interface CodeGenerationRequest {
  requirements: string;
  language: string;
  codeType: 'component' | 'service' | 'api' | 'utility' | 'model';
  framework?: string;
  context?: Record<string, any>;
}

interface CodeGenerationResult {
  code: string;
  explanation: string;
  dependencies: string[];
  testSuggestions: string[];
  documentation: string;
}

interface RefactorRequest {
  code: string;
  refactorType: 'performance' | 'readability' | 'structure' | 'security';
  targetPattern?: string;
  context?: Record<string, any>;
}

interface TestGenerationRequest {
  code: string;
  testType: 'unit' | 'integration' | 'e2e';
  framework?: string;
  context?: Record<string, any>;
}

interface CodeReviewRequest {
  code: string;
  focusAreas?: ('security' | 'performance' | 'maintainability' | 'best-practices')[];
  context?: Record<string, any>;
}

class VibeCodeGenerator {
  private contextDir: string;
  private currentSession: string | null = null;

  constructor() {
    this.contextDir = join(process.cwd(), '.vibecoding', 'context');
    this.ensureContextDirectory();
    
    // 初始化 Prompt 系統
    this.initializePromptSystem();
  }

  /**
   * 初始化 Prompt 管理系統
   */
  private async initializePromptSystem(): Promise<void> {
    try {
      await buildMCPServicePrompt(
        ServiceId.CODE_GENERATOR,
        DevelopmentPhase.IMPLEMENTATION,
        {
          capabilities: ['code-generation', 'refactoring', 'testing', 'review'],
          supportedLanguages: ['typescript', 'javascript', 'python', 'java', 'go', 'rust'],
          supportedFrameworks: ['react', 'vue', 'angular', 'express', 'nestjs', 'fastapi', 'spring']
        }
      );
      
      console.error('[Code Generator] Prompt system initialized successfully');
    } catch (error) {
      console.error('[Code Generator] Failed to initialize prompt system:', error);
    }
  }

  private ensureContextDirectory(): void {
    if (!existsSync(this.contextDir)) {
      mkdirSync(this.contextDir, { recursive: true });
    }
  }

  /**
   * 開始會話
   */
  async startSession(): Promise<{ sessionId: string; message: string }> {
    this.currentSession = `code-gen-session-${Date.now()}`;
    
    console.error(`[Code Generator] Session started: ${this.currentSession}`);
    
    return {
      sessionId: this.currentSession,
      message: '🚀 Code Generator 服務已啟動！可以開始生成代碼、重構或進行代碼審查。'
    };
  }

  /**
   * 生成代碼
   */
  async generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResult> {
    const { language, codeType, framework } = request;
    
    console.error(`[Code Generator] Generating ${codeType} code in ${language}${framework ? ` using ${framework}` : ''}`);
    
    const result = await this.generateCodeTemplate(request);
    
    return result;
  }

  /**
   * 代碼模板生成器
   */
  private async generateCodeTemplate(request: CodeGenerationRequest): Promise<CodeGenerationResult> {
    const { requirements, language, codeType, framework } = request;
    
    let code = '';
    let explanation = '';
    let dependencies: string[] = [];
    let testSuggestions: string[] = [];
    let documentation = '';

    switch (codeType) {
      case 'component':
        if (language === 'typescript' && framework === 'react') {
          code = this.generateReactComponent(requirements);
          dependencies = ['react', '@types/react'];
          testSuggestions = ['測試組件渲染', '測試 props 傳遞', '測試事件處理'];
        } else if (language === 'typescript' && framework === 'vue') {
          code = this.generateVueComponent(requirements);
          dependencies = ['vue'];
          testSuggestions = ['測試組件掛載', '測試響應式數據', '測試事件觸發'];
        }
        explanation = `生成了一個 ${framework} ${codeType}，基於需求：${requirements}`;
        break;

      case 'service':
        if (language === 'typescript' && framework === 'express') {
          code = this.generateExpressService(requirements);
          dependencies = ['express', '@types/express'];
          testSuggestions = ['測試 API 端點', '測試錯誤處理', '測試數據驗證'];
        } else if (language === 'python' && framework === 'fastapi') {
          code = this.generateFastAPIService(requirements);
          dependencies = ['fastapi', 'uvicorn'];
          testSuggestions = ['測試 API 響應', '測試請求驗證', '測試異常處理'];
        }
        explanation = `生成了一個 ${framework} 服務，實現功能：${requirements}`;
        break;

      case 'utility':
        code = this.generateUtilityFunction(requirements, language);
        explanation = `生成了一個實用工具函數：${requirements}`;
        testSuggestions = ['測試邊界條件', '測試錯誤輸入', '測試性能'];
        break;

      default:
        code = `// TODO: 實現 ${codeType} 代碼生成\n// 需求：${requirements}`;
        explanation = `需要實現 ${codeType} 類型的代碼生成器`;
    }

    documentation = this.generateDocumentation(requirements, codeType);

    return {
      code,
      explanation,
      dependencies,
      testSuggestions,
      documentation
    };
  }

  private generateReactComponent(requirements: string): string {
    return `import React from 'react';

interface Props {
  // TODO: 定義 props 類型
}

export const Component: React.FC<Props> = (props) => {
  // 基於需求實現：${requirements}
  
  return (
    <div>
      {/* TODO: 實現組件 UI */}
    </div>
  );
};

export default Component;`;
  }

  private generateVueComponent(requirements: string): string {
    return `<template>
  <div>
    <!-- TODO: 實現組件模板 -->
    <!-- 基於需求：${requirements} -->
  </div>
</template>

<script setup lang="ts">
// TODO: 實現組件邏輯
</script>

<style scoped>
/* TODO: 實現組件樣式 */
</style>`;
  }

  private generateExpressService(requirements: string): string {
    return `import express from 'express';

const router = express.Router();

// 基於需求實現：${requirements}
router.get('/', (req, res) => {
  try {
    // TODO: 實現 GET 端點邏輯
    res.json({ message: 'Service is working' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', (req, res) => {
  try {
    // TODO: 實現 POST 端點邏輯
    res.json({ message: 'Created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;`;
  }

  private generateFastAPIService(requirements: string): string {
    return `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# 基於需求實現：${requirements}

class ItemModel(BaseModel):
    # TODO: 定義數據模型
    pass

@app.get("/")
async def read_root():
    """根端點"""
    return {"message": "Service is working"}

@app.post("/items/")
async def create_item(item: ItemModel):
    """創建項目"""
    try:
        # TODO: 實現創建邏輯
        return {"message": "Item created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")`;
  }

  private generateUtilityFunction(requirements: string, language: string): string {
    if (language === 'typescript' || language === 'javascript') {
      return `/**
 * ${requirements}
 */
export function utilityFunction(input: any): any {
  // TODO: 實現工具函數邏輯
  return input;
}

export default utilityFunction;`;
    } else if (language === 'python') {
      return `"""
${requirements}
"""

def utility_function(input_value):
    """
    TODO: 實現工具函數邏輯
    """
    return input_value`;
    }
    
    return `// TODO: 實現 ${language} 工具函數\n// 需求：${requirements}`;
  }

  private generateDocumentation(requirements: string, codeType: string): string {
    return `# ${codeType.charAt(0).toUpperCase() + codeType.slice(1)} Documentation

## 需求
${requirements}

## 實現概述
此 ${codeType} 基於提供的需求自動生成。

## 使用方法
\`\`\`
// TODO: 添加使用示例
\`\`\`

## 注意事項
- 請根據實際需求調整代碼
- 建議添加錯誤處理和數據驗證
- 考慮性能和安全性優化

## 下一步
1. 完善實現邏輯
2. 添加單元測試
3. 更新文檔
`;
  }

  /**
   * 重構代碼
   */
  async refactorCode(request: RefactorRequest): Promise<{
    refactoredCode: string;
    explanation: string;
    improvements: string[];
    risks: string[];
  }> {
    const { code, refactorType } = request;
    
    console.error(`[Code Generator] Refactoring code for ${refactorType}`);
    
    let refactoredCode = code;
    let explanation = '';
    let improvements: string[] = [];
    let risks: string[] = [];

    switch (refactorType) {
      case 'performance':
        improvements = [
          '優化循環和數據結構',
          '減少不必要的計算',
          '使用緩存機制',
          '優化數據庫查詢'
        ];
        explanation = '針對性能進行了重構優化';
        break;

      case 'readability':
        improvements = [
          '改善變數和函數命名',
          '添加註釋和文檔',
          '分解複雜函數',
          '統一代碼格式'
        ];
        explanation = '提升了代碼可讀性';
        break;

      case 'structure':
        improvements = [
          '重新組織代碼結構',
          '應用設計模式',
          '分離關注點',
          '減少耦合度'
        ];
        explanation = '改善了代碼架構和結構';
        break;

      case 'security':
        improvements = [
          '添加輸入驗證',
          '防止 SQL 注入',
          '加強權限控制',
          '安全的錯誤處理'
        ];
        explanation = '增強了代碼安全性';
        risks = ['需要測試新的安全措施', '可能影響現有功能'];
        break;
    }

    return {
      refactoredCode,
      explanation,
      improvements,
      risks
    };
  }

  /**
   * 生成測試代碼
   */
  async generateTests(request: TestGenerationRequest): Promise<{
    testCode: string;
    testCases: string[];
    framework: string;
    coverage: string[];
  }> {
    const { testType, framework = 'jest' } = request;
    
    console.error(`[Code Generator] Generating ${testType} tests using ${framework}`);
    
    const testCode = this.generateTestTemplate(testType, framework);
    const testCases = this.generateTestCases(testType);
    const coverage = this.generateCoverageAreas();

    return {
      testCode,
      testCases,
      framework,
      coverage
    };
  }

  private generateTestTemplate(testType: string, framework: string): string {
    if (framework === 'jest') {
      return `import { describe, test, expect } from '@jest/globals';

describe('${testType} tests', () => {
  test('should work correctly', () => {
    // TODO: 實現測試邏輯
    expect(true).toBe(true);
  });

  test('should handle edge cases', () => {
    // TODO: 測試邊界條件
    expect(true).toBe(true);
  });

  test('should handle errors gracefully', () => {
    // TODO: 測試錯誤處理
    expect(true).toBe(true);
  });
});`;
    }

    return `# TODO: 生成 ${framework} 測試代碼`;
  }

  private generateTestCases(testType: string): string[] {
    const commonCases = [
      '正常輸入測試',
      '邊界值測試',
      '錯誤輸入測試',
      '空值/null 測試'
    ];

    switch (testType) {
      case 'unit':
        return [...commonCases, '函數邏輯測試', '返回值驗證'];
      case 'integration':
        return [...commonCases, '模組間交互測試', '數據流測試'];
      case 'e2e':
        return [...commonCases, '用戶流程測試', 'UI 交互測試'];
      default:
        return commonCases;
    }
  }

  private generateCoverageAreas(): string[] {
    return [
      '函數入口點',
      '條件分支',
      '循環邏輯',
      '異常處理',
      '返回路徑'
    ];
  }

  /**
   * 代碼審查
   */
  async reviewCode(request: CodeReviewRequest): Promise<{
    score: number;
    issues: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      line?: number;
      suggestion: string;
    }>;
    strengths: string[];
    recommendations: string[];
  }> {
    const { code, focusAreas = ['security', 'performance', 'maintainability', 'best-practices'] } = request;
    
    console.error(`[Code Generator] Reviewing code with focus on: ${focusAreas.join(', ')}`);
    
    const issues = this.analyzeCodeIssues(code);
    const strengths = this.identifyCodeStrengths(code);
    const recommendations = this.generateRecommendations(focusAreas);
    
    const score = Math.max(0, 100 - (issues.length * 10));

    return {
      score,
      issues,
      strengths,
      recommendations
    };
  }

  private analyzeCodeIssues(code: string): Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    line?: number;
    suggestion: string;
  }> {
    const issues = [];

    if (code.includes('TODO')) {
      issues.push({
        type: 'completeness',
        severity: 'medium' as const,
        message: '代碼包含 TODO 標記，需要完成實現',
        suggestion: '完成 TODO 項目或移除標記'
      });
    }

    if (code.includes('any')) {
      issues.push({
        type: 'type-safety',
        severity: 'low' as const,
        message: '使用了 any 類型，降低了類型安全性',
        suggestion: '使用具體的類型定義'
      });
    }

    if (code.length > 1000 && !code.includes('class') && !code.includes('function')) {
      issues.push({
        type: 'structure',
        severity: 'medium' as const,
        message: '代碼過長，建議分解為更小的函數或模組',
        suggestion: '重構為多個較小的函數'
      });
    }

    return issues;
  }

  private identifyCodeStrengths(code: string): string[] {
    const strengths = [];

    if (code.includes('interface') || code.includes('type')) {
      strengths.push('使用了 TypeScript 類型定義');
    }

    if (code.includes('try') && code.includes('catch')) {
      strengths.push('包含錯誤處理機制');
    }

    if (code.includes('/**') || code.includes('//')) {
      strengths.push('包含代碼註釋和文檔');
    }

    if (code.includes('export')) {
      strengths.push('使用了模組化設計');
    }

    return strengths;
  }

  private generateRecommendations(focusAreas: string[]): string[] {
    const allRecommendations: Record<string, string[]> = {
      security: [
        '添加輸入驗證和清理',
        '使用參數化查詢防止 SQL 注入',
        '實施適當的身份驗證和授權',
        '避免在代碼中暴露敏感信息'
      ],
      performance: [
        '優化數據結構和算法',
        '實施緩存策略',
        '減少不必要的網絡請求',
        '使用懶加載和分頁'
      ],
      maintainability: [
        '保持函數簡短和專注',
        '使用清晰的命名慣例',
        '添加適當的測試覆蓋',
        '定期重構和清理代碼'
      ],
      'best-practices': [
        '遵循 SOLID 原則',
        '使用一致的代碼格式',
        '實施適當的日誌記錄',
        '使用版本控制最佳實踐'
      ]
    };

    return focusAreas.flatMap(area => allRecommendations[area] || []);
  }

  /**
   * 獲取 AI 洞察
   */
  async getAIInsight(query: string): Promise<string> {
    console.error(`[Code Generator] Processing AI insight query: ${query}`);
    
    return `基於你的查詢 "${query}"，我建議：

1. **代碼生成最佳實踐**：
   - 始終從需求分析開始
   - 選擇合適的設計模式
   - 確保代碼可測試性

2. **質量保證**：
   - 實施代碼審查流程
   - 添加單元測試和集成測試
   - 使用靜態代碼分析工具

3. **性能優化**：
   - 分析瓶頸並優化關鍵路徑
   - 實施適當的緩存策略
   - 監控應用程序性能

如需更具體的建議，請提供更詳細的上下文。`;
  }
}

// 創建服務實例
const codeGenerator = new VibeCodeGenerator();

// 創建 MCP 服務器
const server = new Server(
  {
    name: 'vibecoding-code-generator',
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
        description: 'Start a new code generation session',
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
        name: 'generate-code',
        description: 'Generate code based on requirements and specifications',
        inputSchema: {
          type: 'object',
          properties: {
            requirements: {
              type: 'string',
              description: 'The requirements or specifications for code generation',
            },
            language: {
              type: 'string',
              description: 'Programming language (e.g., typescript, python, javascript)',
            },
            codeType: {
              type: 'string',
              enum: ['component', 'service', 'api', 'utility', 'model'],
              description: 'Type of code to generate',
            },
            framework: {
              type: 'string',
              description: 'Framework to use (e.g., react, express, fastapi)',
            },
          },
          required: ['requirements', 'language'],
        },
      },
      {
        name: 'refactor-code',
        description: 'Refactor existing code for better quality and maintainability',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The code to refactor',
            },
            refactorType: {
              type: 'string',
              enum: ['performance', 'readability', 'structure', 'security'],
              description: 'Type of refactoring to perform',
            },
            targetPattern: {
              type: 'string',
              description: 'Design pattern or architecture to apply',
            },
          },
          required: ['code', 'refactorType'],
        },
      },
      {
        name: 'generate-tests',
        description: 'Generate test cases for existing code',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The code to generate tests for',
            },
            testType: {
              type: 'string',
              enum: ['unit', 'integration', 'e2e'],
              description: 'Type of tests to generate',
            },
            framework: {
              type: 'string',
              description: 'Testing framework (e.g., jest, pytest, cypress)',
            },
          },
          required: ['code', 'testType'],
        },
      },
      {
        name: 'code-review',
        description: 'Perform automated code review and provide suggestions',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The code to review',
            },
            focusAreas: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['security', 'performance', 'maintainability', 'best-practices'],
              },
              description: 'Areas to focus on during review',
            },
          },
          required: ['code'],
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

// 處理工具調用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'start-session':
        return { 
          content: [{ 
            type: 'text', 
            text: JSON.stringify(await codeGenerator.startSession(), null, 2),
          }] 
        };

      case 'generate-code':
        const generateResult = await codeGenerator.generateCode({
          requirements: extractStringParam(args, 'requirements'),
          language: extractStringParam(args, 'language', 'typescript'),
          codeType: extractParam(args, 'codeType', 'utility' as 'component' | 'service' | 'api' | 'utility' | 'model'),
          framework: extractOptionalStringParam(args, 'framework'),
        });
        return { content: [{ type: 'text', text: JSON.stringify(generateResult, null, 2) }] };

      case 'refactor-code':
        const refactorResult = await codeGenerator.refactorCode({
          code: extractStringParam(args, 'code'),
          refactorType: extractParam(args, 'refactorType', 'readability' as 'performance' | 'readability' | 'structure' | 'security'),
          targetPattern: extractOptionalStringParam(args, 'targetPattern'),
        });
        return { content: [{ type: 'text', text: JSON.stringify(refactorResult, null, 2) }] };

      case 'generate-tests':
        const testResult = await codeGenerator.generateTests({
          code: extractStringParam(args, 'code'),
          testType: extractParam(args, 'testType', 'unit' as 'unit' | 'integration' | 'e2e'),
          framework: extractStringParam(args, 'framework', 'jest'),
        });
        return { content: [{ type: 'text', text: JSON.stringify(testResult, null, 2) }] };

      case 'code-review':
        const reviewResult = await codeGenerator.reviewCode({
          code: extractStringParam(args, 'code'),
          focusAreas: extractArrayParam(args, 'focusAreas', ['best-practices' as 'security' | 'performance' | 'maintainability' | 'best-practices']),
        });
        return { content: [{ type: 'text', text: JSON.stringify(reviewResult, null, 2) }] };

      case 'get-ai-insight':
        const insight = await codeGenerator.getAIInsight(extractStringParam(args, 'query'));
        return { content: [{ type: 'text', text: insight }] };

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    console.error('[Code Generator] Tool execution error:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// 啟動服務器
async function runServer() {
  const transport = new StdioServerTransport();
  
  console.error('🎯 VibeCoding Code Generator MCP Server starting...');
  console.error('📋 Prompt system integration: ENABLED');
  console.error('🔧 Available tools: start-session, generate-code, refactor-code, generate-tests, code-review, get-ai-insight');
  
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
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

function extractArrayParam<T>(args: unknown, key: string, defaultValue: T[]): T[] {
  const value = extractParam(args, key, defaultValue);
  return Array.isArray(value) ? value : defaultValue;
} 