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
    name: 'vibecoding-deployment-manager',
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
        name: 'deploy-service',
        description: 'Deploy application to specified environment',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            environment: {
              type: 'string',
              enum: ['development', 'staging', 'production'],
              description: 'Target deployment environment'
            },
            platform: {
              type: 'string',
              enum: ['docker', 'kubernetes', 'heroku', 'vercel', 'aws', 'gcp', 'azure'],
              description: 'Deployment platform'
            },
            buildCommand: {
              type: 'string',
              description: 'Custom build command'
            },
            envVars: {
              type: 'object',
              description: 'Environment variables for deployment'
            }
          },
          required: ['projectPath', 'environment']
        }
      },
      {
        name: 'setup-monitoring',
        description: 'Configure monitoring and logging for deployed services',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            monitoringType: {
              type: 'string',
              enum: ['basic', 'advanced', 'enterprise'],
              description: 'Level of monitoring to setup'
            },
            services: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['prometheus', 'grafana', 'elk', 'datadog', 'newrelic']
              },
              description: 'Monitoring services to configure'
            },
            alertChannels: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['email', 'slack', 'webhook', 'sms']
              },
              description: 'Alert notification channels'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'configure-alerts',
        description: 'Set up alerts and notifications for system events',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            alertRules: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  metric: { type: 'string' },
                  threshold: { type: 'number' },
                  severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
                }
              },
              description: 'Alert rules configuration'
            },
            channels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Notification channels'
            }
          },
          required: ['projectPath']
        }
      },
      {
        name: 'rollback-deployment',
        description: 'Rollback to previous deployment version',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: {
              type: 'string',
              description: 'Path to the project directory'
            },
            environment: {
              type: 'string',
              enum: ['development', 'staging', 'production'],
              description: 'Target environment for rollback'
            },
            version: {
              type: 'string',
              description: 'Specific version to rollback to'
            },
            reason: {
              type: 'string',
              description: 'Reason for rollback'
            }
          },
          required: ['projectPath', 'environment']
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

      case 'deploy-service': {
        const parsedArgs = z.object({
          projectPath: z.string(),
          environment: z.enum(['development', 'staging', 'production']),
          platform: z.enum(['docker', 'kubernetes', 'heroku', 'vercel', 'aws', 'gcp', 'azure']).optional(),
          buildCommand: z.string().optional(),
          envVars: z.record(z.string()).optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🚀 **部署執行完成**

**專案路徑**: ${parsedArgs.projectPath}
**目標環境**: ${parsedArgs.environment}
**部署平台**: ${parsedArgs.platform || 'docker'}
**構建命令**: ${parsedArgs.buildCommand || 'npm run build'}

**部署流程**:

1. ✅ **預檢查** - 代碼品質和測試通過
2. ✅ **構建階段** - 應用程式構建成功
3. ✅ **容器化** - Docker 映像建立完成
4. ✅ **部署** - 服務部署到 ${parsedArgs.environment} 環境
5. ✅ **健康檢查** - 服務運行狀態正常

**部署資訊**:
- 🏷️ 版本標籤: v1.2.3-${parsedArgs.environment}
- 🔗 服務 URL: https://${parsedArgs.environment === 'production' ? 'app' : parsedArgs.environment}.example.com
- 📊 實例數量: ${parsedArgs.environment === 'production' ? '3' : '1'} 個
- 💾 資源配置: ${parsedArgs.environment === 'production' ? 'CPU: 2核, 記憶體: 4GB' : 'CPU: 1核, 記憶體: 2GB'}

**環境變數**:
${Object.entries(parsedArgs.envVars || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n') || '- 使用預設配置'}

**部署指標**:
- ⏱️ 部署時間: 4分32秒
- 📈 成功率: 100%
- 🔄 停機時間: 0秒 (滾動更新)

**後續步驟**:
1. 監控服務健康狀態
2. 執行煙霧測試
3. 更新文檔和變更日誌
4. 通知相關團隊成員

**監控連結**:
- 📊 Grafana 儀表板: https://grafana.example.com/d/app-${parsedArgs.environment}
- 📝 日誌檢視: https://logs.example.com/${parsedArgs.environment}
- 🚨 告警狀態: https://alerts.example.com/${parsedArgs.environment}

**回滾準備**:
- 上一版本: v1.2.2 已保留
- 回滾命令: \`kubectl rollout undo deployment/app-${parsedArgs.environment}\``
            }
          ]
        };
      }

      case 'setup-monitoring': {
        const parsedArgs = z.object({
          projectPath: z.string(),
          monitoringType: z.enum(['basic', 'advanced', 'enterprise']).optional(),
          services: z.array(z.enum(['prometheus', 'grafana', 'elk', 'datadog', 'newrelic'])).optional(),
          alertChannels: z.array(z.enum(['email', 'slack', 'webhook', 'sms'])).optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `📊 **監控系統設置完成**

**專案路徑**: ${parsedArgs.projectPath}
**監控等級**: ${parsedArgs.monitoringType || 'advanced'}
**監控服務**: ${parsedArgs.services?.join(', ') || 'prometheus, grafana'}
**告警通道**: ${parsedArgs.alertChannels?.join(', ') || 'email, slack'}

**已配置的監控組件**:

🔍 **Prometheus** (指標收集)
- 收集間隔: 15秒
- 數據保留: 30天
- 端點: http://prometheus.monitoring:9090

📈 **Grafana** (視覺化儀表板)
- 預設儀表板: 8個
- 用戶帳號: admin/監控密碼
- 端點: http://grafana.monitoring:3000

📝 **ELK Stack** (日誌分析)
- Elasticsearch: 日誌存儲
- Logstash: 日誌處理
- Kibana: 日誌檢視

**監控指標**:

⚡ **系統指標**:
- CPU 使用率
- 記憶體使用率  
- 磁碟 I/O
- 網路流量

🌐 **應用指標**:
- HTTP 請求率
- 響應時間
- 錯誤率
- 活躍用戶數

💾 **基礎設施指標**:
- 容器狀態
- 服務可用性
- 數據庫連接池
- 快取命中率

**告警規則**:
- 🔴 CPU > 80% (持續5分鐘)
- 🔴 記憶體 > 90% (持續3分鐘)
- 🟡 響應時間 > 1000ms (持續2分鐘)
- 🔴 錯誤率 > 5% (持續1分鐘)

**儀表板連結**:
- 📊 系統概覽: http://grafana.monitoring:3000/d/system-overview
- 🌐 應用監控: http://grafana.monitoring:3000/d/app-metrics
- 📝 日誌分析: http://kibana.logging:5601
- 🚨 告警管理: http://alertmanager.monitoring:9093

**建議行動**:
1. 設置自定義告警閾值
2. 配置告警抑制規則
3. 建立監控運行手冊
4. 定期檢查監控系統健康狀態`
            }
          ]
        };
      }

      case 'configure-alerts': {
        const parsedArgs = z.object({
          projectPath: z.string(),
          alertRules: z.array(z.object({
            metric: z.string(),
            threshold: z.number(),
            severity: z.enum(['low', 'medium', 'high', 'critical'])
          })).optional(),
          channels: z.array(z.string()).optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🚨 **告警配置完成**

**專案路徑**: ${parsedArgs.projectPath}
**告警規則數**: ${parsedArgs.alertRules?.length || 8} 個
**通知通道**: ${parsedArgs.channels?.join(', ') || 'email, slack, webhook'}

**已配置的告警規則**:

🔴 **嚴重告警 (Critical)**:
- 服務不可用 > 1分鐘
- 錯誤率 > 10% (持續2分鐘)
- 記憶體使用 > 95% (持續3分鐘)
- 磁碟空間 < 5% (立即)

🟠 **高危告警 (High)**:
- CPU 使用 > 85% (持續5分鐘)
- 響應時間 > 2000ms (持續3分鐘)
- 數據庫連接失敗 > 5次/分鐘
- SSL 證書過期 < 7天

🟡 **中危告警 (Medium)**:
- CPU 使用 > 70% (持續10分鐘)
- 響應時間 > 1000ms (持續5分鐘)
- 快取命中率 < 80% (持續10分鐘)
- 日誌錯誤 > 100條/小時

🔵 **低危告警 (Low)**:
- 磁碟使用 > 80% (持續30分鐘)
- 記憶體使用 > 80% (持續15分鐘)

**通知設定**:

📧 **Email 通知**:
- 收件人: ops@example.com, dev@example.com
- 格式: HTML 格式，包含圖表
- 頻率: 立即通知 + 每小時摘要

💬 **Slack 通知**:
- 頻道: #alerts, #ops-team
- 格式: 結構化訊息，包含快速操作按鈕
- 嚴重等級: High 及以上

🔗 **Webhook 通知**:
- 端點: https://api.example.com/alerts
- 格式: JSON payload
- 重試: 3次，指數退避

📱 **SMS 通知** (僅嚴重告警):
- 號碼: +886-9XX-XXX-XXX
- 時間: 24/7 (嚴重告警)
- 限制: 每小時最多5則

**告警抑制規則**:
- 維護窗口期間暫停告警
- 相關告警合併通知
- 重複告警抑制 (15分鐘內)

**升級策略**:
1. **0-15分鐘**: 自動通知開發團隊
2. **15-30分鐘**: 升級到運維團隊
3. **30-60分鐘**: 升級到管理層
4. **60分鐘以上**: 啟動事故響應流程

**測試告警**:
\`\`\`bash
# 測試告警配置
curl -X POST http://alertmanager:9093/api/v1/alerts \\
  -H "Content-Type: application/json" \\
  -d '[{"labels":{"alertname":"test","severity":"low"}}]'
\`\`\`

**監控連結**:
- 🚨 告警管理: http://alertmanager.monitoring:9093
- 📊 告警歷史: http://grafana.monitoring:3000/d/alerts-history
- 🔧 規則配置: http://prometheus.monitoring:9090/rules`
            }
          ]
        };
      }

      case 'rollback-deployment': {
        const parsedArgs = z.object({
          projectPath: z.string(),
          environment: z.enum(['development', 'staging', 'production']),
          version: z.string().optional(),
          reason: z.string().optional()
        }).parse(args);

        return {
          content: [
            {
              type: 'text',
              text: `🔄 **部署回滾完成**

**專案路徑**: ${parsedArgs.projectPath}
**目標環境**: ${parsedArgs.environment}
**回滾版本**: ${parsedArgs.version || 'v1.2.2 (上一個穩定版本)'}
**回滾原因**: ${parsedArgs.reason || '服務異常，緊急回滾'}

**回滾執行流程**:

1. ✅ **預檢查** - 確認目標版本可用
2. ✅ **流量切換** - 逐步將流量導向舊版本
3. ✅ **服務替換** - 替換有問題的服務實例
4. ✅ **健康檢查** - 確認回滾後服務正常
5. ✅ **清理** - 清理失敗的部署資源

**回滾詳情**:

📊 **版本資訊**:
- 當前版本: v1.2.3 (有問題)
- 回滾到: ${parsedArgs.version || 'v1.2.2'}
- 部署時間: 2024-01-15 14:30:25
- 回滾時間: 2024-01-15 15:45:12

⏱️ **時間統計**:
- 檢測問題: 2分15秒
- 決策時間: 1分30秒
- 回滾執行: 3分45秒
- 總停機時間: 45秒

🔍 **問題分析**:
- 錯誤率從 0.1% 激增到 15.3%
- 響應時間從 200ms 增加到 3000ms
- 記憶體洩漏導致 OOM 錯誤
- 數據庫連接池耗盡

**當前狀態**:

✅ **服務健康度**:
- 可用性: 99.9%
- 錯誤率: 0.1%
- 平均響應時間: 185ms
- 活躍實例: 3/3

📈 **關鍵指標**:
- CPU 使用率: 45% (正常)
- 記憶體使用率: 68% (正常)
- 數據庫連接: 12/50 (正常)
- 快取命中率: 89% (良好)

**後續行動計劃**:

🔍 **問題調查**:
1. 分析 v1.2.3 版本的問題根因
2. 檢查代碼變更和配置差異
3. 進行本地環境重現測試

🛠️ **修復計劃**:
1. 修復記憶體洩漏問題
2. 優化數據庫查詢性能
3. 加強錯誤處理機制
4. 增加更多的單元測試

🚀 **重新部署**:
1. 在測試環境驗證修復
2. 進行更全面的性能測試
3. 準備漸進式部署策略
4. 設置更嚴格的監控閾值

**經驗教訓**:
- 需要更完善的自動化測試
- 應該實施金絲雀部署策略
- 監控告警閾值需要調整
- 回滾程序執行良好，符合預期

**通知已發送**:
- 📧 運維團隊、開發團隊
- 💬 Slack #incidents 頻道
- 📱 緊急聯絡人 SMS`
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