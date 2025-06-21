# 🎯 VibeCoding Prompt 系統使用指南

## 📋 概述

VibeCoding 的 Prompt 管理系統確保所有 MCP 服務都遵循一致的行為準則和對話風格。每個服務在初始化時會載入對應的 prompts，形成完整的行為指導。

## 🎛️ 系統架構

```
.vibecoding/prompts/
├── core/                        # 核心系統 prompts
│   ├── system-identity.md       # ✅ 系統身份和理念
│   ├── conversation-style.md    # ✅ 對話風格指南
│   └── collaboration-rules.md   # ✅ 服務協作規則
├── services/                    # 各服務專用 prompts
│   ├── context-manager.md       # ✅ 上下文管理服務
│   ├── code-generator.md        # ✅ 代碼生成服務
│   ├── dependency-tracker.md    # ✅ 依賴追蹤服務
│   ├── test-validator.md        # ✅ 測試驗證服務
│   ├── doc-generator.md         # ✅ 文檔生成服務
│   └── deployment-manager.md    # ✅ 部署管理服務
└── workflows/                   # 工作流 prompts
    ├── discovery-phase.md       # ✅ 需求探索階段
    ├── design-phase.md          # ✅ 設計階段
    ├── implementation-phase.md  # ✅ 實現階段
    ├── validation-phase.md      # ✅ 驗證階段
    └── deployment-phase.md      # ✅ 部署階段
```

## 🚀 在 MCP 服務中使用 Prompt 系統

### 1. 基本使用方式

```typescript
import { 
  buildMCPServicePrompt, 
  ServiceId, 
  DevelopmentPhase 
} from '../../src/utils/prompt-manager.js';

class MyMCPService {
  private servicePrompt: string = '';

  async initialize() {
    // 載入服務專用的完整 prompt
    this.servicePrompt = await buildMCPServicePrompt(
      ServiceId.CODE_GENERATOR,  // 服務ID
      DevelopmentPhase.IMPLEMENTATION,  // 當前階段（可選）
      {
        // 自定義上下文（可選）
        projectType: 'web-application',
        techStack: 'React + Node.js'
      }
    );
    
    console.log('Service prompt loaded:', this.servicePrompt);
  }
}
```

### 2. 動態階段切換

```typescript
class ContextAwareService {
  private promptManager = new PromptManager();
  
  async updatePhase(newPhase: DevelopmentPhase) {
    // 重新載入 prompt 以適應新階段
    const updatedPrompt = await buildMCPServicePrompt(
      ServiceId.CONTEXT_MANAGER,
      newPhase,
      this.getCurrentProjectContext()
    );
    
    this.servicePrompt = updatedPrompt;
    console.log(`Prompt updated for phase: ${newPhase}`);
  }
}
```

### 3. 服務協作時的 Prompt 共享

```typescript
class CodeGeneratorService {
  async generateCode(requirements: string) {
    // 獲取自己的 prompt
    const myPrompt = await buildMCPServicePrompt(ServiceId.CODE_GENERATOR);
    
    // 獲取協作服務的角色信息
    const testValidatorRole = await getServiceRolePrompt(ServiceId.TEST_VALIDATOR);
    
    // 組合 prompts 進行協作
    const collaborationPrompt = `
${myPrompt}

## 🤝 協作服務信息
### Test Validator 服務角色
${testValidatorRole}

請在生成代碼的同時考慮測試需求。
`;
    
    // 使用組合後的 prompt 進行代碼生成
    return this.performCodeGeneration(collaborationPrompt, requirements);
  }
}
```

## 📊 實際應用示例

### Context Manager 服務整合

```typescript
// vibe-services/context-manager/index.ts 中的實現
class VibeContextManager {
  private servicePrompt: string = '';

  async initializePromptSystem(): Promise<void> {
    try {
      // 載入完整的服務 prompt
      this.servicePrompt = await buildMCPServicePrompt(
        ServiceId.CONTEXT_MANAGER,
        this.getCurrentPhase(),
        {
          projectContext: this.getProjectContext(),
          sessionActive: !!this.currentSession
        }
      );
      
      console.error('[Context Manager] Prompt system initialized');
    } catch (error) {
      // 降級處理
      this.servicePrompt = 'VibeCoding 上下文管理服務基本 prompt';
    }
  }

  async getAIInsight(query: string): Promise<string> {
    // 使用載入的 prompt 提供一致的 AI 回應
    const context = {
      query,
      servicePrompt: this.servicePrompt,
      projectContext: this.getProjectContext()
    };
    
    // 基於 prompt 生成回應
    return this.generateAIResponse(context);
  }
}
```

### 服務初始化時的 Prompt 驗證

```typescript
class MCPServiceBase {
  async initialize() {
    // 驗證 prompt 系統
    const validation = await promptManager.validatePrompts();
    
    if (!validation.valid) {
      console.warn('Prompt validation issues:', validation.errors);
      // 使用降級 prompts 或提醒用戶
    }
    
    // 載入服務 prompt
    await this.loadServicePrompt();
  }
}
```

## 🎯 Prompt 組合策略

### 完整 Prompt 結構

當你調用 `buildMCPServicePrompt` 時，系統會自動組合以下部分：

```
📋 最終組合的 Prompt:

1. 🎯 系統身份和核心理念
   ├── VibeCoding 的核心使命
   ├── 設計理念和價值觀
   └── 行為準則

2. 🎪 對話風格指南
   ├── 溫和專業的語氣
   ├── 結構化回應格式
   └── 表情符號使用規範

3. 🤝 服務協作規則
   ├── 統一體驗原則
   ├── 資訊共享機制
   └── 協作最佳實踐

4. 🛠️ 服務專用職責
   ├── 核心功能定義
   ├── 工作原則
   └── 響應風格

5. 📋 當前階段工作流程 (可選)
   ├── 階段特定指導
   ├── 關鍵任務
   └── 協作重點

6. 🔧 自定義上下文 (可選)
   └── 項目特定信息
```

## 🔄 動態 Prompt 更新

### 即時更新服務 Prompt

```typescript
// 當項目階段變更時
async onPhaseChange(newPhase: DevelopmentPhase) {
  // 清除舊的 prompt 緩存
  await promptManager.reloadServicePrompt(ServiceId.CONTEXT_MANAGER);
  
  // 載入新階段的 prompt
  await this.initializePromptSystem();
  
  // 通知其他服務階段變更
  await this.broadcastPhaseChange(newPhase);
}

// 當項目上下文更新時
async onContextUpdate(newContext: ProjectContext) {
  // 重新組合 prompt 包含新的上下文
  this.servicePrompt = await buildMCPServicePrompt(
    ServiceId.CONTEXT_MANAGER,
    this.getCurrentPhase(),
    { projectContext: newContext }
  );
}
```

## 📝 自定義 Prompt 添加

### 為特定項目創建自定義 Prompt

```typescript
// 1. 創建項目專用的 prompt 文件
// .vibecoding/prompts/custom/my-project-context.md

// 2. 在服務中載入自定義 prompt
class CustomizedService {
  async initializeWithCustomPrompts() {
    const basePrompt = await buildMCPServicePrompt(ServiceId.CODE_GENERATOR);
    const customPrompt = await promptManager.loadPrompt('custom/my-project-context.md');
    
    this.servicePrompt = `${basePrompt}\n\n## 📋 項目專用指導\n${customPrompt}`;
  }
}
```

## 🧪 測試和驗證

### Prompt 系統測試

```bash
# 驗證所有 prompts 是否正確載入
npm run test:prompts

# 檢查 prompt 組合是否正確
npm run validate:prompt-combinations

# 測試服務 prompt 載入
npm run test:service-prompts
```

### 開發時調試

```typescript
// 開發環境下顯示完整 prompt
if (process.env.NODE_ENV === 'development') {
  console.log('=== SERVICE PROMPT ===');
  console.log(this.servicePrompt);
  console.log('=== END PROMPT ===');
}
```

## 💡 最佳實踐

### 1. Prompt 版本管理
- 所有 prompt 文件都應納入版本控制
- 重要變更時更新 prompt 版本號
- 保留 prompt 變更歷史記錄

### 2. 性能優化
- 使用 prompt 緩存避免重複載入
- 只在必要時重新組合 prompt
- 考慮 prompt 大小對性能的影響

### 3. 錯誤處理
- 提供降級 prompt 機制
- 記錄 prompt 載入錯誤
- 在 prompt 缺失時給出清晰提示

### 4. 測試覆蓋
- 為每個服務測試 prompt 載入
- 驗證 prompt 組合的正確性
- 測試動態 prompt 更新功能

---

**🎉 現在你的 MCP 服務已經具備了智能的 Prompt 系統！**

所有服務都會遵循 VibeCoding 的核心理念，提供一致、專業、智能的對話式開發體驗。✨ 