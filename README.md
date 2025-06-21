# VibeCoding System 🚀

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/vibecoding/vibecoding-template) [![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/vibecoding-system) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Conversation-Driven Development Framework for Rapid MVP/POC Creation**

**VibeCoding 將傳統軟體開發轉換為 AI 引導的自然對話體驗。透過與專業 MCP 服務的智能對話，快速建構 MVP 和 POC。**

## 🚀 30 秒快速開始

```bash
# 1. 複製並設定
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibeCoding-template
npm install && npm run build

# 2. 驗證系統
npm run test:prompts
# 預期輸出: 🎉 FULLY OPERATIONAL - All prompts are ready!

# 3. 配置你的 IDE (參考下方 IDE 設定)
# 4. 開始使用！
```

## 🌟 核心亮點

### ⚡ **革命性指令系統**
- **🆕 簡潔指令**: `@vibe start "專案名"` - 平均減少 77% 輸入量
- **🔄 向後相容**: 完整指令仍可使用
- **🧠 智能對話**: 自然語言驅動的開發流程

### 🤖 **6 個專業 MCP 服務**
| 服務 | 功能 | 簡潔指令 |
|------|------|----------|
| 📋 Context Manager | 專案澄清與上下文管理 | `@vibe start`, `@vibe prd` |
| ⚡ Code Generator | AI 驅動的代碼生成 | `@vibe code`, `@vibe api` |
| 📦 Dependency Tracker | 智能依賴分析 | `@vibe deps`, `@vibe scan` |
| 🧪 Test Validator | 自動化測試生成 | `@vibe test`, `@vibe cover` |
| 📚 Doc Generator | 智能文檔創建 | `@vibe doc`, `@vibe readme` |
| 🚀 Deployment Manager | CI/CD 與基礎設施自動化 | `@vibe deploy`, `@vibe monitor` |

### 💡 **技術優勢**
- **多 AI 提供者支援**: OpenAI, Anthropic, Gemini, 本地模型
- **階段感知工作流**: 動態 AI 指導適應開發階段
- **模板系統**: 豐富模板庫配合 AI 增強
- **熱配置**: 運行時切換提供者無需重啟

## 🎯 立即開始使用

### 🔧 IDE 設定 (選擇一個)

#### **Cursor IDE** (推薦 - 內建 LLM，無需 API 金鑰)
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"]
    }
  }
}
```
> 📖 **詳細說明**: [Cursor MCP 專用指南](CURSOR_MCP_CLARIFICATION.md)

#### **Claude Desktop**
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node", 
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"]
    }
  }
}
```

#### **其他 IDE**
> 📖 **完整設定指南**: [IDE 設定完全指南](IDE_SETUP_GUIDE.md) - 支援 VSCode, WebStorm 等

### 🎮 基本使用流程

```bash
# 🎯 1. 開始新專案
@vibe start "任務管理系統"
# 系統提供 7 個結構化問題收集需求

# 🗨️ 2. 回答澄清問題  
@vibe ask "主要解決團隊協作和任務追蹤問題"
# 引導完成所有澄清問題

# 📋 3. 生成 PRD
@vibe prd
# 自動創建全面的產品需求文檔

# 💻 4. 開始開發
@vibe code "用戶認證系統"
@vibe api "任務 CRUD 接口"

# 🧪 5. 測試與部署
@vibe test
@vibe deploy
```

## 📚 完整文檔導航

### 🎯 **設定指南** (按順序閱讀)
1. **[IDE 設定完全指南](IDE_SETUP_GUIDE.md)** - 主要設定文檔，支援所有 MCP Host
2. **[Cursor MCP 專用說明](CURSOR_MCP_CLARIFICATION.md)** - Cursor 用戶必讀
3. **[MCP 設定指南](MCP_SETUP_GUIDE.md)** - 深度配置和故障排除
4. **[部署指南](DEPLOY_MCP_GUIDE.md)** - 生產環境部署

### 🛠️ **工具與指令參考**
- **[完整工具參考手冊](VIBECODING_TOOLS_REFERENCE.md)** - 所有 34+ 工具的詳細說明
- **[簡潔指令系統設計](VIBECODING_COMMAND_REDESIGN.md)** - UX 驅動的指令重設計
- **[MCP 配置範例集合](mcp-config-examples.json)** - 各種場景的配置範例

### 🏗️ **架構與進階**
- **[專案結構說明](folder_structure.md)** - 專案架構和檔案組織
- **[API 參考文檔](#-api-reference)** - 完整 API 說明
- **[架構設計](#-architecture)** - 系統架構詳解

## 🏗️ 系統架構

### 核心服務架構
```
VibeCoding MCP Server
├── 📋 Context Manager       → 持久化對話與專案狀態
├── ⚡ Code Generator       → AI 驅動的代碼生成  
├── 📦 Dependency Tracker  → 智能依賴管理
├── 🧪 Test Validator      → 自動化測試與品質分析
├── 📚 Doc Generator       → 智能文檔創建
└── 🚀 Deployment Manager → CI/CD 與基礎設施自動化
```

### AI 提示系統
位於 `.vibecoding/prompts/`，提供智能指導：
- **核心提示** (3): 系統身份、對話風格、協作規則
- **服務提示** (6): 每個 MCP 服務的專業提示  
- **工作流提示** (5): 階段特定的開發指導
- **動態載入**: 適應當前專案階段和上下文

### 開發階段
```
0_discovery/     → 需求收集和澄清
1_design/        → 架構和 API 設計
2_implementation/→ 源代碼和測試
3_validation/    → 測試報告和品質指標
4_deployment/    → 部署配置
knowledge-base/  → 模式、解決方案和回顧
```

## 🔧 API Reference

### Context Manager 核心 API
```typescript
// 開始專案澄清
start-clarification(projectName: string, initialDescription?: string)

// 提供澄清回答
provide-clarification(projectId: string, questionIndex: number, answer: string)

// 生成 PRD
generate-prd(projectId: string)

// 生成實施計劃
generate-impl-plan(projectId: string)
```

### 其他服務 API
- **Code Generator**: `generate-code`, `code-review`, `refactor-code`
- **Dependency Tracker**: `analyze-dependencies`, `security-scan`, `update-dependencies`
- **Test Validator**: `run-tests`, `validate-coverage`, `performance-test`
- **Doc Generator**: `generate-docs`, `create-api-docs`, `generate-changelog`
- **Deployment Manager**: `deploy-service`, `setup-monitoring`, `rollback-deployment`

> 📖 **完整 API 文檔**: [工具參考手冊](VIBECODING_TOOLS_REFERENCE.md)

## ⚙️ 配置與客製化

### 系統需求
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **操作系統**: Windows 10/11, macOS, Linux
- **記憶體**: >= 4GB RAM

### AI 提供者配置
```bash
# 環境變數設定
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key
```

### 進階配置
- **多環境配置**: 開發、測試、生產環境分離
- **團隊協作設定**: 共享配置和最佳實踐
- **企業級部署**: 安全性和擴展性考量

> 📖 **完整配置指南**: [MCP 設定指南](MCP_SETUP_GUIDE.md)

## 🔍 故障排除

### 常見問題快速修復
```bash
# Q: 初始化失敗
npm cache clean --force && npm install

# Q: MCP 服務無法啟動  
npm run build && npm run test:prompts

# Q: 路徑配置問題
# 使用絕對路徑，確認 dist/ 目錄存在
```

### 獲取幫助
- 📖 **完整故障排除**: [IDE 設定指南](IDE_SETUP_GUIDE.md#故障排除)
- 💬 **社群支援**: [GitHub Issues](https://github.com/vibecoding/vibecoding-template/issues)
- 🐛 **錯誤回報**: [GitHub Issues](https://github.com/vibecoding/vibecoding-template/issues/new)

## 🤝 Contributing

我們歡迎貢獻！請查看 [Contributing Guide](CONTRIBUTING.md) 了解詳情。

### 開發設定
```bash
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibeCoding-template
npm install && npm run build
npm run test:prompts
```

## 📝 License

本專案採用 MIT License - 詳見 [LICENSE](LICENSE) 文件。

---

**🚀 現在開始享受 AI 驅動的對話式開發體驗！**

> **💡 提示**: 新用戶建議從 [IDE 設定完全指南](IDE_SETUP_GUIDE.md) 開始，逐步體驗 VibeCoding 的強大功能。 