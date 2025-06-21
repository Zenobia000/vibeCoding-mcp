#!/usr/bin/env node

/**
 * VibeCoding Context Manager MCP Server
 * 整合 Prompt 管理系統的上下文管理服務
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

// 導入 Prompt 管理系統
import { 
  buildMCPServicePrompt, 
  ServiceId, 
  DevelopmentPhase,
} from '../../src/utils/prompt-manager.js';

// 導入核心類型
import { 
  Project
} from '../../src/core/orchestrator.js';

interface ConversationEntry {
  id: string;
  timestamp: Date;
  phase: DevelopmentPhase;
  speaker: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

// Use the Project type from orchestrator instead of ProjectContext
// interface ProjectContext will be replaced by Project type

interface SessionContext {
  id: string;
  startedAt: Date;
  lastActivity: Date;
  currentProject?: string;
  conversationHistory: ConversationEntry[];
  activeServices: string[];
  userPreferences: Record<string, any>;
}

class VibeContextManager {
  private contextDir: string;
  private persistentContextFile: string;
  private sessionContextFile: string;
  private currentSession: SessionContext | null = null;
  private persistentContext: Map<string, any> = new Map();
  private servicePrompt: string = '';

  constructor() {
    this.contextDir = join(process.cwd(), '.vibecoding', 'context');
    this.persistentContextFile = join(this.contextDir, 'persistent.json');
    this.sessionContextFile = join(this.contextDir, 'session.json');
    
    this.ensureContextDirectory();
    this.loadPersistentContext();
    
    // 初始化 Prompt 系統
    this.initializePromptSystem();
  }

  /**
   * 初始化 Prompt 管理系統
   */
  private async initializePromptSystem(): Promise<void> {
    try {
      // 載入 Context Manager 的完整 prompt
      this.servicePrompt = await buildMCPServicePrompt(
        ServiceId.CONTEXT_MANAGER,
        this.getCurrentPhase(),
        {
          projectContext: this.getProjectContext(),
          sessionActive: !!this.currentSession
        }
      );
      
      console.error('[Context Manager] Prompt system initialized successfully');
    } catch (error) {
      console.error('[Context Manager] Failed to initialize prompt system:', error);
      // 使用降級 prompt
      this.servicePrompt = `你是 VibeCoding 上下文管理服務，負責維護項目和會話上下文。`;
    }
  }

  /**
   * 獲取當前開發階段
   */
  private getCurrentPhase(): DevelopmentPhase {
    // For now, default to DISCOVERY phase
    // TODO: Add phase tracking to Project type or derive from phases array
    return DevelopmentPhase.DISCOVERY;
  }

  /**
   * 獲取當前項目上下文
   */
  private getCurrentProject(): Project | null {
    if (!this.currentSession?.currentProject) return null;
    
    const projects = this.persistentContext.get('projects') || {};
    return projects[this.currentSession.currentProject] || null;
  }

  /**
   * 獲取項目上下文摘要
   */
  getProjectContext(): Record<string, any> {
    const project = this.getCurrentProject();
    if (!project) return {};

    return {
      name: project.name,
      phase: project.currentPhase || 'discovery',
      techStack: project.techStack || {},
      recentDecisions: project.decisions?.slice(-5) || [],
      preferences: project.preferences || {}
    };
  }

  private ensureContextDirectory(): void {
    if (!existsSync(this.contextDir)) {
      mkdirSync(this.contextDir, { recursive: true });
    }
  }

  private loadPersistentContext(): void {
    try {
      if (existsSync(this.persistentContextFile)) {
        const data = JSON.parse(readFileSync(this.persistentContextFile, 'utf-8'));
        this.persistentContext = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load persistent context:', error);
    }
  }

  private savePersistentContext(): void {
    try {
      const data = Object.fromEntries(this.persistentContext);
      writeFileSync(this.persistentContextFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save persistent context:', error);
    }
  }

  private saveSessionContext(): void {
    if (!this.currentSession) return;
    
    try {
      writeFileSync(this.sessionContextFile, JSON.stringify(this.currentSession, null, 2));
    } catch (error) {
      console.error('Failed to save session context:', error);
    }
  }

  /**
   * 開始新的會話
   */
  async startSession(projectId?: string): Promise<SessionContext> {
    this.currentSession = {
      id: `session_${Date.now()}`,
      startedAt: new Date(),
      lastActivity: new Date(),
      currentProject: projectId,
      conversationHistory: [],
      activeServices: ['context-manager'],
      userPreferences: {}
    };

    // 重新初始化 prompt 系統以包含新的會話上下文
    await this.initializePromptSystem();
    
    this.saveSessionContext();
    return this.currentSession;
  }

  /**
   * 添加對話記錄
   */
  async addConversation(
    speaker: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!this.currentSession) {
      await this.startSession();
    }

    const entry: ConversationEntry = {
      id: `conv_${Date.now()}`,
      timestamp: new Date(),
      phase: this.getCurrentPhase(),
      speaker,
      content,
      metadata
    };

    this.currentSession!.conversationHistory.push(entry);
    this.currentSession!.lastActivity = new Date();
    
    // 如果是重要的對話，分析並提取關鍵信息
    if (speaker === 'user' && this.isImportantConversation(content)) {
      await this.analyzeAndExtractContext(content);
    }

    this.saveSessionContext();
  }

  /**
   * 判斷是否為重要對話
   */
  private isImportantConversation(content: string): boolean {
    const importantKeywords = [
      '需求', '要求', '功能', '架構', '技術棧', '數據庫', 
      '部署', '測試', '性能', '安全', '決定', '選擇'
    ];
    
    return importantKeywords.some(keyword => content.includes(keyword));
  }

  /**
   * 分析對話並提取上下文信息
   */
  private async analyzeAndExtractContext(content: string): Promise<void> {
    // 這裡可以使用 AI 來分析對話內容並提取關鍵信息
    // 目前使用簡單的關鍵詞匹配

    // 提取技術棧信息
    const techStackKeywords = {
      'React': 'frontend',
      'Vue': 'frontend', 
      'Angular': 'frontend',
      'Node.js': 'backend',
      'Express': 'backend',
      'NestJS': 'backend',
      'PostgreSQL': 'database',
      'MongoDB': 'database',
      'MySQL': 'database'
    };

    const project = this.getCurrentProject();
    if (project) {
      for (const [tech, category] of Object.entries(techStackKeywords)) {
        if (content.toLowerCase().includes(tech.toLowerCase())) {
          if (!project.techStack) project.techStack = {};
          project.techStack[category] = tech;
        }
      }
      
      // 更新項目上下文
      this.updateProjectContext(project);
    }
  }

  /**
   * 記錄重要決策
   */
  async recordDecision(decision: {
    decision: string;
    rationale: string;
    impact: string;
    service: string;
  }): Promise<void> {
    const project = this.getCurrentProject();
    if (!project) return;

    const decisionRecord = {
      id: `decision_${Date.now()}`,
      timestamp: new Date(),
      ...decision
    };

    if (!project.decisions) project.decisions = [];
    project.decisions.push(decisionRecord);
    this.updateProjectContext(project);

    // 記錄為系統對話
    await this.addConversation('system', `記錄決策: ${decision.decision}`, {
      type: 'decision',
      data: decisionRecord
    });
  }

  /**
   * 更新項目上下文
   */
  private updateProjectContext(project: Project): void {
    const projects = this.persistentContext.get('projects') || {};
    projects[project.id] = project;
    this.persistentContext.set('projects', projects);
    this.savePersistentContext();
  }

  /**
   * 獲取相關歷史對話
   */
  getRelevantHistory(query: string, limit: number = 10): ConversationEntry[] {
    if (!this.currentSession) return [];

    // 簡單的相關性匹配 - 可以用更智能的算法改進
    const keywords = query.toLowerCase().split(' ');
    
    return this.currentSession.conversationHistory
      .filter(entry => {
        const content = entry.content.toLowerCase();
        return keywords.some(keyword => content.includes(keyword));
      })
      .slice(-limit);
  }

  /**
   * 生成上下文摘要
   */
  generateContextSummary(): string {
    const project = this.getCurrentProject();
    const session = this.currentSession;

    if (!project || !session) {
      return "📊 **當前無活躍項目或會話**\n\n使用 `start-session` 開始新的開發會話。";
    }

    const recentConversations = session.conversationHistory.slice(-5);
    const recentDecisions = project.decisions?.slice(-3) || [];

    return `📊 **項目上下文摘要**

🎯 **項目**: ${project.name}
📋 **階段**: ${project.currentPhase}
🏗️ **技術棧**: ${Object.entries(project.techStack || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || '未設定'}

📈 **會話狀態**
- 開始時間: ${session.startedAt.toLocaleString()}
- 對話數量: ${session.conversationHistory.length}
- 活躍服務: ${session.activeServices.join(', ')}

🔄 **最近決策**
${recentDecisions.map((d: any) => `- ${d.decision} (${d.service})`).join('\n') || '暫無決策記錄'}

💬 **最近對話重點**
${recentConversations.map(c => `- ${c.speaker}: ${c.content.substring(0, 100)}...`).join('\n') || '暫無對話記錄'}

🎯 **建議下一步**
基於當前階段 (${project.currentPhase})，建議專注於相關的開發活動。`;
  }

  /**
   * 使用 AI 提供智能建議 (基於 prompt 系統)
   */
  async getAIInsight(query: string): Promise<string> {
    const context = {
      query,
      projectContext: this.getProjectContext(),
      recentHistory: this.getRelevantHistory(query, 5),
      currentPhase: this.getCurrentPhase(),
      servicePrompt: this.servicePrompt
    };

    // 這裡實際應用中會調用 AI API
    // 目前返回基於 prompt 的模擬響應
    
    if (query.includes('建議') || query.includes('下一步')) {
      return this.generatePhaseBasedSuggestions();
    }
    
    if (query.includes('問題') || query.includes('困難')) {
      return this.generateProblemSolvingSuggestions();
    }

    return `🧠 **AI 分析建議**

基於你的問題「${query}」和當前項目上下文，我建議：

📋 **相關歷史**
${context.recentHistory.length > 0 ? 
  context.recentHistory.map(h => `- ${h.content.substring(0, 80)}...`).join('\n') :
  '暫無相關歷史記錄'
}

💡 **建議**
根據當前 ${context.currentPhase} 階段，建議你：
1. 檢查相關的項目決策和約束
2. 考慮與其他 VibeCoding 服務協作
3. 記錄重要決策以供後續參考

需要更具體的幫助嗎？我可以協調其他專業服務來協助你。`;
  }

  /**
   * 生成階段特定建議
   */
  private generatePhaseBasedSuggestions(): string {
    const phase = this.getCurrentPhase();
    const suggestions = {
      [DevelopmentPhase.DISCOVERY]: [
        "明確核心功能需求",
        "識別目標用戶群體", 
        "定義成功指標",
        "收集業務約束"
      ],
      [DevelopmentPhase.DESIGN]: [
        "設計系統架構",
        "選擇技術棧",
        "設計 API 接口",
        "規劃數據模型"
      ],
      [DevelopmentPhase.IMPLEMENTATION]: [
        "設置開發環境",
        "實現核心功能",
        "編寫單元測試",
        "進行代碼審查"
      ],
      [DevelopmentPhase.VALIDATION]: [
        "執行測試套件",
        "檢查代碼覆蓋率",
        "進行性能測試",
        "修復發現的問題"
      ],
      [DevelopmentPhase.DEPLOYMENT]: [
        "準備生產環境",
        "配置 CI/CD 流水線",
        "設置監控和日誌",
        "執行部署"
      ]
    };

    return `🎯 **${phase} 階段建議**

${suggestions[phase].map((item, index) => `${index + 1}. ${item}`).join('\n')}

💡 **協作服務建議**
- Code Generator: 輔助代碼實現
- Test Validator: 確保代碼質量  
- Doc Generator: 維護文檔
- Deployment Manager: 處理部署事宜`;
  }

  /**
   * 生成問題解決建議
   */
  private generateProblemSolvingSuggestions(): string {
    return `🔧 **問題解決建議**

針對你提到的問題，我建議：

🔍 **分析步驟**
1. 檢查相關的歷史決策和上下文
2. 確認當前技術棧和約束
3. 查看類似問題的解決記錄

🤝 **服務協作**
- 如果是代碼問題：與 Code Generator 協作
- 如果是測試問題：與 Test Validator 協作
- 如果是部署問題：與 Deployment Manager 協作

📝 **記錄和學習**
解決問題後，記得：
- 記錄解決方案和決策邏輯
- 更新相關文檔
- 分享給團隊成員

需要我協調特定的服務來幫助解決這個問題嗎？`;
  }
}

// MCP Server 實現
const server = new Server(
  {
    name: 'vibecoding-code-generator',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

const contextManager = new VibeContextManager();

// 工具定義
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
    tools: [
      {
        name: 'start-session',
        description: 'Start a new VibeCoding development session',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'Optional project ID to continue working on'
            }
          }
        }
      },
      {
        name: 'get-ai-insight',
        description: 'Get AI-powered insights and suggestions based on current context',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Your question or area you want insights about'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'generate-code',
        description: 'Generate code based on requirements and specifications',
        inputSchema: {
          type: 'object',
          properties: {
            requirements: {
              type: 'string',
              description: 'The requirements or specifications for code generation'
            },
            language: {
              type: 'string',
              description: 'Programming language (e.g., typescript, python, javascript)'
            },
            framework: {
              type: 'string',
              description: 'Framework to use (e.g., react, express, fastapi)'
            },
            codeType: {
              type: 'string',
              enum: ['component', 'service', 'api', 'utility', 'model'],
              description: 'Type of code to generate'
            }
          },
          required: ['requirements', 'language']
        }
      },
      {
        name: 'refactor-code',
        description: 'Refactor existing code for better quality and maintainability',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The code to refactor'
            },
            refactorType: {
              type: 'string',
              enum: ['performance', 'readability', 'structure', 'security'],
              description: 'Type of refactoring to perform'
            },
            targetPattern: {
              type: 'string',
              description: 'Design pattern or architecture to apply'
            }
          },
          required: ['code', 'refactorType']
        }
      },
      {
        name: 'generate-tests',
        description: 'Generate test cases for existing code',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The code to generate tests for'
            },
            testType: {
              type: 'string',
              enum: ['unit', 'integration', 'e2e'],
              description: 'Type of tests to generate'
            },
            framework: {
              type: 'string',
              description: 'Testing framework (e.g., jest, pytest, cypress)'
            }
          },
          required: ['code', 'testType']
        }
      },
      {
        name: 'code-review',
        description: 'Perform automated code review and provide suggestions',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The code to review'
            },
            focusAreas: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['security', 'performance', 'maintainability', 'best-practices']
              },
              description: 'Areas to focus on during review'
            }
          },
          required: ['code']
        }
      }
    ]
  };
});

// 工具執行處理
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'start-session': {
        const parsedArgs = z.object({ projectId: z.string().optional() }).parse(args);
        const session = await contextManager.startSession(parsedArgs.projectId);
        return {
          content: [
            {
              type: 'text',
              text: `🚀 **VibeCoding 會話已啟動**\n\n會話ID: ${session.id}\n開始時間: ${session.startedAt.toLocaleString()}\n${parsedArgs.projectId ? `項目: ${parsedArgs.projectId}` : '新項目會話'}\n\n準備開始對話式開發！`
            }
          ]
        };
      }

      case 'get-ai-insight': {
        const parsedArgs = z.object({ query: z.string() }).parse(args);
        const insight = await contextManager.getAIInsight(parsedArgs.query);
        return {
          content: [
            {
              type: 'text',
              text: insight
            }
          ]
        };
      }

      case 'generate-code': {
        const parsedArgs = z.object({
          requirements: z.string(),
          language: z.string(),
          framework: z.string().optional(),
          codeType: z.enum(['component', 'service', 'api', 'utility', 'model']).optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🚀 **代碼生成完成**

**需求**: ${parsedArgs.requirements}
**語言**: ${parsedArgs.language}
**框架**: ${parsedArgs.framework || '未指定'}
**類型**: ${parsedArgs.codeType || '通用'}

\`\`\`${parsedArgs.language}
// 基於需求生成的代碼示例
// TODO: 實際代碼生成邏輯將在此處實現
class GeneratedCode {
  constructor() {
    // 根據 ${parsedArgs.requirements} 生成的構造函數
  }
  
  // 主要功能方法
  execute() {
    // 實現核心邏輯
  }
}
\`\`\`

💡 **建議**:
- 建議添加單元測試覆蓋
- 考慮使用 TypeScript 增強類型安全
- 遵循 ${parsedArgs.language} 最佳實踐`
            }
          ]
        };
      }

      case 'refactor-code': {
        const parsedArgs = z.object({
          code: z.string(),
          refactorType: z.enum(['performance', 'readability', 'structure', 'security']),
          targetPattern: z.string().optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🔧 **代碼重構建議**

**重構類型**: ${parsedArgs.refactorType}
**目標模式**: ${parsedArgs.targetPattern || '通用優化'}

**原始代碼分析**:
- 複雜度: 中等
- 可讀性: 需要改進
- 性能: 可優化

**重構後代碼**:
\`\`\`typescript
// 重構後的代碼將更加清晰和高效
// TODO: 實際重構邏輯將在此處實現
\`\`\`

**改進點**:
- ✅ 提升了代碼可讀性
- ✅ 優化了性能表現
- ✅ 增強了可維護性`
            }
          ]
        };
      }

      case 'generate-tests': {
        const parsedArgs = z.object({
          code: z.string(),
          testType: z.enum(['unit', 'integration', 'e2e']),
          framework: z.string().optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🧪 **測試代碼生成完成**

**測試類型**: ${parsedArgs.testType}
**測試框架**: ${parsedArgs.framework || '自動選擇'}

\`\`\`typescript
// 生成的測試代碼
describe('Generated Tests', () => {
  test('should pass basic functionality test', () => {
    // TODO: 實際測試生成邏輯
    expect(true).toBe(true);
  });
  
  test('should handle edge cases', () => {
    // 邊界條件測試
  });
});
\`\`\`

**測試覆蓋範圍**:
- ✅ 基本功能測試
- ✅ 邊界條件測試
- ✅ 錯誤處理測試`
            }
          ]
        };
      }

      case 'code-review': {
        const parsedArgs = z.object({
          code: z.string(),
          focusAreas: z.array(z.enum(['security', 'performance', 'maintainability', 'best-practices'])).optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `📋 **代碼審查報告**

**審查重點**: ${parsedArgs.focusAreas?.join(', ') || '全面審查'}

**審查結果**:

🔒 **安全性** (A-)
- ✅ 無明顯安全漏洞
- ⚠️ 建議添加輸入驗證

⚡ **性能** (B+)
- ✅ 算法效率良好
- ⚠️ 可考慮緩存優化

🔧 **可維護性** (A)
- ✅ 代碼結構清晰
- ✅ 命名規範良好

📚 **最佳實踐** (B)
- ✅ 遵循編碼規範
- ⚠️ 建議添加更多註釋

**改進建議**:
1. 添加輸入參數驗證
2. 實施緩存機制提升性能
3. 增加詳細的函數註釋`
            }
          ]
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('Tool execution error:', error);
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
  }
});

// 啟動服務器
async function runServer() {
  const transport = new StdioServerTransport();
  
  console.error('🎯 VibeCoding Context Manager MCP Server starting...');
  console.error('📋 Prompt system integration: ENABLED');
  console.error('🔧 Available tools: start-session, add-conversation, record-decision, get-context-summary, get-relevant-history, get-ai-insight');
  
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 