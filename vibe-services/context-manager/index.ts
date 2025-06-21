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
  InitializeRequestSchema,
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

// 導入核心類型和工具
import { 
  Project,
  ClarificationResponse
} from '../../src/core/orchestrator.js';

import {
  createProjectObject,
  DEFAULT_CLARIFICATION_QUESTIONS
} from '../../src/utils/project-utils.js';

import {
  generatePRD,
  generateImplementationPlan
} from '../../src/utils/documentation.js';

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
  private projects: Map<string, Project> = new Map();

  constructor() {
    this.contextDir = join(process.cwd(), '.vibecoding', 'context');
    this.persistentContextFile = join(this.contextDir, 'persistent.json');
    this.sessionContextFile = join(this.contextDir, 'session.json');
    
    this.ensureContextDirectory();
    this.loadPersistentContext();
    this.loadProjects();
    
    // 初始化 Prompt 系統
    this.initializePromptSystem();
  }

  /**
   * 載入項目數據
   */
  private loadProjects(): void {
    try {
      const projectsData = this.persistentContext.get('projects') || {};
      this.projects = new Map(Object.entries(projectsData));
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }

  /**
   * 保存項目數據
   */
  private saveProjects(): void {
    try {
      const projectsData = Object.fromEntries(this.projects);
      this.persistentContext.set('projects', projectsData);
      this.savePersistentContext();
    } catch (error) {
      console.error('Failed to save projects:', error);
    }
  }

  /**
   * 開始項目澄清流程
   */
  async startProjectClarification(projectName: string, initialDescription: string = ''): Promise<{
    projectId: string;
    question: string;
    questionIndex: number;
    totalQuestions: number;
  }> {
    // 創建新項目
    const project = createProjectObject(projectName, initialDescription);
    this.projects.set(project.id, project);
    this.saveProjects();
    
    // 開始會話（如果還沒有）
    if (!this.currentSession) {
      await this.startSession(project.id);
    } else {
      this.currentSession.currentProject = project.id;
      this.saveSessionContext();
    }

    // 記錄開始澄清的對話
    await this.addConversation('system', `開始項目澄清: ${projectName}`, {
      type: 'project_start',
      projectId: project.id
    });

    // 返回第一個澄清問題
    const firstQuestion = DEFAULT_CLARIFICATION_QUESTIONS[0];
    return {
      projectId: project.id,
      question: firstQuestion,
      questionIndex: 0,
      totalQuestions: DEFAULT_CLARIFICATION_QUESTIONS.length
    };
  }

  /**
   * 提供澄清回答
   */
  async provideClarification(
    projectId: string, 
    questionIndex: number, 
    answer: string
  ): Promise<{
    success: boolean;
    nextQuestion?: string;
    nextQuestionIndex?: number;
    isComplete: boolean;
    message: string;
  }> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    // 添加澄清回答
    const clarificationResponse: ClarificationResponse = {
      question: DEFAULT_CLARIFICATION_QUESTIONS[questionIndex],
      answer,
      timestamp: new Date()
    };

    project.clarificationResponses.push(clarificationResponse);
    project.updatedAt = new Date();
    this.projects.set(projectId, project);
    this.saveProjects();

    // 記錄澄清對話
    await this.addConversation('user', answer, {
      type: 'clarification_response',
      projectId,
      questionIndex,
      question: DEFAULT_CLARIFICATION_QUESTIONS[questionIndex]
    });

    // 檢查是否完成所有澄清
    const nextIndex = questionIndex + 1;
    if (nextIndex >= DEFAULT_CLARIFICATION_QUESTIONS.length) {
      return {
        success: true,
        isComplete: true,
        message: `✅ 項目澄清完成！已收集到 ${project.clarificationResponses.length} 個回答。現在可以生成 PRD 和實施計劃。`
      };
    }

    // 返回下一個問題
    const nextQuestion = DEFAULT_CLARIFICATION_QUESTIONS[nextIndex];
    return {
      success: true,
      nextQuestion,
      nextQuestionIndex: nextIndex,
      isComplete: false,
      message: `✅ 回答已記錄。接下來是第 ${nextIndex + 1} 個問題：`
    };
  }

  /**
   * 生成 PRD
   */
  async generateProjectPRD(projectId: string): Promise<string> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    if (project.clarificationResponses.length === 0) {
      throw new Error('No clarification responses available. Please complete the clarification process first.');
    }

    const prd = generatePRD(project);
    
    // 保存 PRD 到項目
    project.prd = prd;
    project.updatedAt = new Date();
    this.projects.set(projectId, project);
    this.saveProjects();

    // 記錄 PRD 生成
    await this.addConversation('system', 'PRD 已生成', {
      type: 'prd_generated',
      projectId
    });

    return prd;
  }

  /**
   * 生成實施計劃
   */
  async generateProjectImplementationPlan(projectId: string): Promise<string> {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    if (project.clarificationResponses.length === 0) {
      throw new Error('No clarification responses available. Please complete the clarification process first.');
    }

    const implementationPlan = generateImplementationPlan(project);
    
    // 保存實施計劃到項目
    project.implementationPlan = implementationPlan;
    project.updatedAt = new Date();
    this.projects.set(projectId, project);
    this.saveProjects();

    // 記錄實施計劃生成
    await this.addConversation('system', '實施計劃已生成', {
      type: 'implementation_plan_generated',
      projectId
    });

    return implementationPlan;
  }

  /**
   * 獲取項目詳情
   */
  getProject(projectId: string): Project | null {
    return this.projects.get(projectId) || null;
  }

  /**
   * 列出所有項目
   */
  listProjects(): Project[] {
    return Array.from(this.projects.values());
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
    name: 'vibecoding-context-manager',
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

// 初始化處理
server.setRequestHandler(InitializeRequestSchema, async (request) => {
  console.error('📡 Received initialize request:', JSON.stringify(request.params, null, 2));
  return {
    protocolVersion: "2024-11-05",
    capabilities: {
      resources: {},
      tools: {},
      prompts: {}
    },
    serverInfo: {
      name: "vibecoding-context-manager",
      version: "1.0.0"
    }
  };
});

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
        name: 'get-context-summary',
        description: 'Get a summary of the current project and session context',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'add-conversation',
        description: 'Add a conversation entry to the current session',
        inputSchema: {
          type: 'object',
          properties: {
            speaker: {
              type: 'string',
              enum: ['user', 'assistant', 'system'],
              description: 'Who is speaking'
            },
            content: {
              type: 'string',
              description: 'The conversation content'
            },
            metadata: {
              type: 'object',
              description: 'Optional metadata for the conversation'
            }
          },
          required: ['speaker', 'content']
        }
      },
      {
        name: 'record-decision',
        description: 'Record an important project decision',
        inputSchema: {
          type: 'object',
          properties: {
            decision: {
              type: 'string',
              description: 'The decision that was made'
            },
            rationale: {
              type: 'string',
              description: 'Why this decision was made'
            },
            impact: {
              type: 'string',
              description: 'What areas this decision impacts'
            },
            service: {
              type: 'string',
              description: 'Which service made this decision'
            }
          },
          required: ['decision', 'rationale', 'impact', 'service']
        }
      },
      {
        name: 'get-relevant-history',
        description: 'Retrieve relevant conversation history based on a query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for relevant history'
            },
            limit: {
              type: 'number',
              default: 10,
              description: 'Maximum number of entries to return'
            }
          },
          required: ['query']
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
        name: 'start-clarification',
        description: 'Start a project clarification process',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: {
              type: 'string',
              description: 'The name of the project'
            },
            initialDescription: {
              type: 'string',
              description: 'Initial description of the project'
            }
          },
          required: ['projectName']
        }
      },
      {
        name: 'provide-clarification',
        description: 'Provide a clarification answer',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The ID of the project'
            },
            questionIndex: {
              type: 'number',
              description: 'The index of the question'
            },
            answer: {
              type: 'string',
              description: 'The answer to the question'
            }
          },
          required: ['projectId', 'questionIndex', 'answer']
        }
      },
      {
        name: 'generate-prd',
        description: 'Generate a project PRD',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The ID of the project'
            }
          },
          required: ['projectId']
        }
      },
      {
        name: 'get-project',
        description: 'Get project details',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The ID of the project'
            }
          },
          required: ['projectId']
        }
      },
      {
        name: 'list-projects',
        description: 'List all projects',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'generate-impl-plan',
        description: 'Generate a project implementation plan',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'The ID of the project'
            }
          },
          required: ['projectId']
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

      case 'get-context-summary': {
        const summary = contextManager.generateContextSummary();
        return {
          content: [
            {
              type: 'text',
              text: summary
            }
          ]
        };
      }

      case 'add-conversation': {
        const parsedArgs = z.object({
          speaker: z.enum(['user', 'assistant', 'system']),
          content: z.string(),
          metadata: z.record(z.any()).optional()
        }).parse(args);
        
        await contextManager.addConversation(parsedArgs.speaker, parsedArgs.content, parsedArgs.metadata);
        return {
          content: [
            {
              type: 'text',
              text: `✅ **對話已記錄**\n\n發言者: ${parsedArgs.speaker}\n內容: ${parsedArgs.content.substring(0, 100)}${parsedArgs.content.length > 100 ? '...' : ''}`
            }
          ]
        };
      }

      case 'record-decision': {
        const parsedArgs = z.object({
          decision: z.string(),
          rationale: z.string(),
          impact: z.string(),
          service: z.string()
        }).parse(args);
        
        await contextManager.recordDecision(parsedArgs);
        return {
          content: [
            {
              type: 'text',
              text: `📝 **決策已記錄**\n\n決策: ${parsedArgs.decision}\n理由: ${parsedArgs.rationale}\n影響: ${parsedArgs.impact}\n服務: ${parsedArgs.service}`
            }
          ]
        };
      }

      case 'get-relevant-history': {
        const parsedArgs = z.object({
          query: z.string(),
          limit: z.number().default(10)
        }).parse(args);
        
        const history = contextManager.getRelevantHistory(parsedArgs.query, parsedArgs.limit);
        return {
          content: [
            {
              type: 'text',
              text: `🔍 **相關歷史記錄**\n\n查詢: ${parsedArgs.query}\n找到 ${history.length} 條記錄:\n\n${history.map(h => `- ${h.speaker}: ${h.content.substring(0, 80)}... (${h.timestamp.toLocaleString()})`).join('\n') || '無相關記錄'}`
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

      case 'start-clarification': {
        const parsedArgs = z.object({ projectName: z.string(), initialDescription: z.string().optional() }).parse(args);
        const result = await contextManager.startProjectClarification(parsedArgs.projectName, parsedArgs.initialDescription);
        return {
          content: [
            {
              type: 'text',
              text: `🚀 **項目澄清已啟動**\n\n項目ID: ${result.projectId}\n問題: ${result.question}\n問題索引: ${result.questionIndex}\n總問題數: ${result.totalQuestions}`
            }
          ]
        };
      }

      case 'provide-clarification': {
        const parsedArgs = z.object({ projectId: z.string(), questionIndex: z.number(), answer: z.string() }).parse(args);
        const result = await contextManager.provideClarification(parsedArgs.projectId, parsedArgs.questionIndex, parsedArgs.answer);
        return {
          content: [
            {
              type: 'text',
              text: result.message
            }
          ]
        };
      }

      case 'generate-prd': {
        const parsedArgs = z.object({ projectId: z.string() }).parse(args);
        const prd = await contextManager.generateProjectPRD(parsedArgs.projectId);
        return {
          content: [
            {
              type: 'text',
              text: `🎯 **PRD 已生成**\n\n${prd}`
            }
          ]
        };
      }

      case 'get-project': {
        const parsedArgs = z.object({ projectId: z.string() }).parse(args);
        const project = contextManager.getProject(parsedArgs.projectId);
        if (project) {
          return {
            content: [
              {
                type: 'text',
                text: `🎯 **項目詳情**\n\n${JSON.stringify(project, null, 2)}`
              }
            ]
          };
        } else {
          throw new McpError(ErrorCode.InvalidRequest, 'Project not found');
        }
      }

      case 'list-projects': {
        const projects = contextManager.listProjects();
        return {
          content: [
            {
              type: 'text',
              text: `🎯 **項目列表**\n\n${projects.map(p => `- ${p.name} (${p.id})`).join('\n') || '暫無項目'}`
            }
          ]
        };
      }

      case 'generate-impl-plan': {
        const parsedArgs = z.object({ projectId: z.string() }).parse(args);
        const plan = await contextManager.generateProjectImplementationPlan(parsedArgs.projectId);
        return {
          content: [
            {
              type: 'text',
              text: `📋 **實施計劃已生成**\n\n${plan}`
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
  console.error('🔧 Available tools: start-session, add-conversation, record-decision, get-context-summary, get-relevant-history, get-ai-insight, start-clarification, provide-clarification, generate-prd, generate-impl-plan, get-project, list-projects');
  
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 