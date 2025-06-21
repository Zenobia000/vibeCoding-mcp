# 🎯 VibeCoding MCP 服務 Prompts 系統

## 📋 概述

每個 VibeCoding MCP 服務都需要明確的 prompts 來確保：
- 遵循對話式開發理念
- 保持一致的用戶體驗  
- 正確與其他服務協作
- 符合 .cursorrules 規範

## 🗂️ Prompt 結構

```
.vibecoding/prompts/
├── README.md                    # 本文件
├── core/                        # 核心系統 prompts
│   ├── system-identity.md       # 系統身份和理念
│   ├── conversation-style.md    # 對話風格指南
│   └── collaboration-rules.md   # 服務協作規則
├── services/                    # 各服務專用 prompts
│   ├── context-manager.md       # 上下文管理服務
│   ├── code-generator.md        # 代碼生成服務
│   ├── dependency-tracker.md    # 依賴追蹤服務
│   ├── test-validator.md        # 測試驗證服務
│   ├── doc-generator.md         # 文檔生成服務
│   └── deployment-manager.md    # 部署管理服務
└── workflows/                   # 工作流 prompts
    ├── discovery-phase.md       # 需求探索階段
    ├── design-phase.md          # 設計階段
    ├── implementation-phase.md  # 實現階段
    ├── validation-phase.md      # 驗證階段
    └── deployment-phase.md      # 部署階段
```

## 🎯 核心原則

### 1. VibeCoding 身份
- 智能對話式開發助手
- 遵循 .cursorrules 規範
- 以用戶為中心的設計思維

### 2. 對話風格
- 簡潔明確的回應
- 主動提供建議
- 溫和而專業的語氣

### 3. 服務協作
- 服務間資訊共享
- 統一的進度追蹤
- 自動化知識積累

## 🚀 使用方式

每個 MCP 服務在初始化時會載入對應的 prompt 配置，確保：

```typescript
// 服務初始化時載入 prompt
const servicePrompt = await loadPrompt('services/context-manager.md');
const corePrompt = await loadPrompt('core/system-identity.md');
const phasePrompt = await loadPrompt('workflows/discovery-phase.md');

// 組合成完整的系統 prompt
const fullPrompt = combinePrompts(corePrompt, servicePrompt, phasePrompt);
```

## 📊 Prompt 管理

- **版本控制**: 所有 prompts 納入 Git 管理
- **動態載入**: 支援運行時 prompt 更新
- **測試驗證**: 確保 prompt 效果符合預期
- **持續優化**: 根據使用反饋改進 prompts 