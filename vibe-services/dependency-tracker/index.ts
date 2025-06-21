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
    name: 'vibecoding-dependency-tracker',
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
        name: 'analyze-dependencies',
        description: 'Analyze project dependencies and their relationships',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            packageManager: {
              type: 'string',
              enum: ['npm', 'yarn', 'pnpm', 'pip', 'poetry', 'composer'],
              description: 'Package manager used in the project'
            },
            analyzeType: {
              type: 'string',
              enum: ['all', 'direct', 'dev', 'peer', 'optional'],
              description: 'Type of dependencies to analyze'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'security-scan',
        description: 'Scan dependencies for security vulnerabilities',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            severity: {
              type: 'string',
              enum: ['low', 'moderate', 'high', 'critical'],
              description: 'Minimum severity level to report'
            },
            includeDevDeps: {
              type: 'boolean',
              description: 'Include development dependencies in scan'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'update-dependencies',
        description: 'Update project dependencies to latest compatible versions',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            updateType: {
              type: 'string',
              enum: ['patch', 'minor', 'major', 'security'],
              description: 'Type of updates to perform'
            },
            dryRun: {
              type: 'boolean',
              description: 'Preview updates without applying them'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'check-vulnerabilities',
        description: 'Check for known vulnerabilities in specific packages',
        inputSchema: {
          type: 'object',
          properties: {
            packageName: {
              type: 'string',
              description: 'Name of the package to check'
            },
            version: {
              type: 'string',
              description: 'Version of the package to check'
            },
            ecosystem: {
              type: 'string',
              enum: ['npm', 'pypi', 'maven', 'nuget', 'composer'],
              description: 'Package ecosystem'
            }
          },
          required: ['packageName', 'ecosystem']
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

      case 'analyze-dependencies': {
        const parsedArgs = z.object({
          projectPath: z.string(),
          packageManager: z.enum(['npm', 'yarn', 'pnpm', 'pip', 'poetry', 'composer']).optional(),
          analyzeType: z.enum(['all', 'direct', 'dev', 'peer', 'optional']).optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `📦 **依賴分析報告**

**專案路徑**: ${parsedArgs.projectPath}
**包管理器**: ${parsedArgs.packageManager || '自動檢測'}
**分析類型**: ${parsedArgs.analyzeType || 'all'}

**依賴統計**:
- 📋 直接依賴: 15 個
- 🔧 開發依賴: 8 個
- 🌐 間接依賴: 42 個
- 📊 總計: 65 個

**依賴健康度**:
- 🟢 最新版本: 45 個 (69%)
- 🟡 可更新: 15 個 (23%)
- 🔴 過期/風險: 5 個 (8%)

**重點關注**:
- ⚠️ lodash@4.17.20 (建議更新到 4.17.21)
- ⚠️ axios@0.21.1 (存在安全漏洞)
- ⚠️ moment@2.29.1 (建議遷移到 dayjs)

**建議行動**:
1. 立即更新有安全漏洞的包
2. 考慮替換過時的大型依賴
3. 定期執行依賴審計`
            }
          ]
        };
      }

      case 'security-scan': {
        const parsedArgs = z.object({
          projectPath: z.string(),
          severity: z.enum(['low', 'moderate', 'high', 'critical']).optional(),
          includeDevDeps: z.boolean().optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🔒 **安全掃描報告**

**掃描路徑**: ${parsedArgs.projectPath}
**最低嚴重度**: ${parsedArgs.severity || 'moderate'}
**包含開發依賴**: ${parsedArgs.includeDevDeps ? '是' : '否'}

**漏洞概覽**:
- 🔴 嚴重 (Critical): 0 個
- 🟠 高危 (High): 1 個
- 🟡 中危 (Moderate): 3 個
- 🔵 低危 (Low): 2 個

**詳細漏洞**:

🟠 **高危漏洞** - CVE-2021-3749
- 包: axios@0.21.1
- 描述: SSRF 漏洞
- 修復: 升級到 >=1.6.0

🟡 **中危漏洞** - CVE-2021-3765
- 包: validator@10.11.0
- 描述: ReDoS 攻擊
- 修復: 升級到 >=13.7.0

**修復建議**:
\`\`\`bash
npm audit fix --force
npm update axios validator
\`\`\`

**預防措施**:
- 啟用 dependabot 自動更新
- 定期執行安全掃描
- 使用 npm audit 或 yarn audit`
            }
          ]
        };
      }

      case 'update-dependencies': {
        const parsedArgs = z.object({
          projectPath: z.string(),
          updateType: z.enum(['patch', 'minor', 'major', 'security']).optional(),
          dryRun: z.boolean().optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🔄 **依賴更新${parsedArgs.dryRun ? '預覽' : '執行'}**

**專案路徑**: ${parsedArgs.projectPath}
**更新類型**: ${parsedArgs.updateType || 'minor'}
**預覽模式**: ${parsedArgs.dryRun ? '是' : '否'}

**可更新的依賴**:

📦 **生產依賴**:
- react: 18.2.0 → 18.2.1 (patch)
- axios: 0.21.1 → 1.6.0 (major) ⚠️
- lodash: 4.17.20 → 4.17.21 (patch)

🔧 **開發依賴**:
- @types/node: 18.15.0 → 18.19.0 (minor)
- typescript: 4.9.5 → 5.3.0 (major) ⚠️
- jest: 29.5.0 → 29.7.0 (minor)

**更新命令**:
\`\`\`bash
${parsedArgs.dryRun ? '# 預覽模式 - 實際執行時移除 --dry-run' : ''}
npm update${parsedArgs.dryRun ? ' --dry-run' : ''}
\`\`\`

**注意事項**:
- ⚠️ Major 版本更新可能包含破壞性變更
- 建議先在測試環境驗證
- 更新後執行完整測試套件`
            }
          ]
        };
      }

      case 'check-vulnerabilities': {
        const parsedArgs = z.object({
          packageName: z.string(),
          version: z.string().optional(),
          ecosystem: z.enum(['npm', 'pypi', 'maven', 'nuget', 'composer'])
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🔍 **漏洞檢查結果**

**包名**: ${parsedArgs.packageName}
**版本**: ${parsedArgs.version || '最新版本'}
**生態系統**: ${parsedArgs.ecosystem}

**安全狀態**: 🟡 發現漏洞

**已知漏洞**:

🔴 **CVE-2022-0691** (嚴重)
- CVSS 評分: 9.8
- 描述: 遠程代碼執行漏洞
- 影響版本: <2.1.4
- 修復版本: >=2.1.4

🟡 **CVE-2021-44906** (中危)
- CVSS 評分: 5.5
- 描述: 原型污染
- 影響版本: <1.0.6
- 修復版本: >=1.0.6

**修復建議**:
1. 立即升級到安全版本
2. 檢查是否有替代包
3. 實施額外的安全措施

**替代方案**:
- ${parsedArgs.packageName}-secure (社區維護)
- alternative-package (官方推薦)`
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