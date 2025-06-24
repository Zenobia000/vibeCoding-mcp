# VibeCoding System 🚀

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/vibecoding/vibecoding-template) [![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/vibecoding-system) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Conversation-Driven Development Framework for Rapid MVP/POC Creation**

**VibeCoding 將傳統軟體開發轉換為 AI 引導的自然對話體驗。透過與專業 MCP 服務的智能對話，快速建構 MVP 和 POC。**
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
## 🚀 完整初始化流程

### 📦 步驟 1: 系統安裝與設定

```bash
# 1. 複製 VibeCoding 模板
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibeCoding-template

# 2. 安裝依賴並建構系統
npm install && npm run build

# 3. 驗證系統狀態
npm run vibecoding status
# 預期輸出: ✅ All VibeCoding services are enabled

# 4. 測試提示系統
npm run test:prompts
# 預期輸出: 🎉 FULLY OPERATIONAL - All prompts are ready!
```

### 🏗️ 步驟 2: 建立你的專案資料夾

```bash
# 建立新專案目錄 (在任何位置)
mkdir my-awesome-project
cd my-awesome-project

# 初始化專案結構 (可選，VibeCoding 會自動建立)
mkdir -p {src,tests,docs,config}

# 初始化 git (推薦)
git init
echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
echo ".env" >> .gitignore

# 建立基本 package.json (可選，VibeCoding 可協助生成)
npm init -y
```

### ⚙️ 步驟 3: 配置 IDE 與 MCP 連接

#### **Cursor IDE** (推薦 - 無需 API 金鑰)
1. 開啟 Cursor IDE 設定檔：
   ```bash
   # Windows
   code "$env:APPDATA\Cursor\User\settings.json"
   
   # macOS  
   code "~/Library/Application Support/Cursor/User/settings.json"
   
   # Linux
   code ~/.config/Cursor/User/settings.json
   ```

2. 添加 VibeCoding MCP 設定：
   ```json
   {
     "mcpServers": {
       "vibecoding-context-manager": {
         "command": "node",
         "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
         "description": "VibeCoding 上下文管理服務"
       }
     },
     "vibecoding.enabled": true,
     "vibecoding.defaultProvider": "cursor"
   }
   ```

3. **重要**: 將 `/path/to/your/vibeCoding-template/` 替換為你的實際路徑

#### **Claude Desktop**
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node", 
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "你的_ANTHROPIC_金鑰"
      }
    }
  }
}
```
#### **其他 IDE**
> 📖 **完整設定指南**: [IDE 設定完全指南](IDE_SETUP_GUIDE.md) - 支援 VSCode, WebStorm 等

> 📖 **詳細說明**: [Cursor MCP 專用指南](CURSOR_MCP_CLARIFICATION.md)
### 🎯 步驟 4: 開始你的第一個 VibeCoding 專案

```bash
# 在你的專案資料夾中，使用 Cursor 或 Claude Desktop
# 輸入以下指令開始：

# 🆕 簡潔指令 (推薦)
@vibe start "我的專案名稱"

# 📝 完整指令 (向後相容)
@vibecoding-context-manager start-clarification
```

### ✅ 步驟 5: 驗證設定成功

在你的 IDE 中測試以下指令：

```bash
# 測試基本連接
@vibe start "測試專案"

# 如果看到類似以下回應，表示設定成功：
# 🚀 項目澄清已啟動
# 項目ID: proj_xxxxx
# 問題: 請描述這個專案的主要目標和預期解決的問題？
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





### 🎮 完整開發工作流程

#### 🏗️ 在你的專案資料夾中開始

```bash
# 進入你的專案目錄
cd my-awesome-project

# 開啟 Cursor IDE 或其他已配置的 MCP Host
code .  # 或 cursor .
```

#### 📋 Phase 1: 專案澄清與需求收集

```bash
# 🎯 1. 開始新專案澄清
@vibe start "任務管理系統"
# 系統提供 7 個結構化問題收集需求

# 🗨️ 2. 逐一回答澄清問題
@vibe ask "主要解決團隊協作和任務追蹤問題"
# 系統會引導你完成所有 7 個澄清問題

# 📋 3. 生成產品需求文檔 (PRD)
@vibe prd
# 自動創建全面的產品需求文檔並保存到專案中
```

#### 🏗️ Phase 2: 設計與架構

```bash
# 📐 4. 生成實施計劃
@vibe plan
# 基於 PRD 生成詳細的技術實施計劃

# 🏛️ 5. 設計系統架構
@vibe arch "微服務架構，使用 Node.js + Express + MongoDB"
# 生成架構圖和技術選型說明
```

#### 💻 Phase 3: 開發實作

```bash
# 🚀 6. 開始代碼開發
@vibe code "用戶認證系統，包含註冊、登入、JWT 驗證"
@vibe api "任務 CRUD 接口，支援建立、讀取、更新、刪除"

# 🔄 7. 代碼審查與重構
@vibe review "[剛生成的代碼]"
@vibe refactor "提升性能和可讀性"
```

#### 🧪 Phase 4: 測試與驗證

```bash
# 🧪 8. 生成測試代碼
@vibe test
@vibe mock "[API 代碼]"

# 📊 9. 檢查測試覆蓋率
@vibe cover
# 驗證代碼品質和測試覆蓋率
```

#### 🚀 Phase 5: 部署與監控

```bash
# 📚 10. 生成文檔
@vibe doc
@vibe readme

# 🚀 11. 部署應用
@vibe deploy
# 自動設定 CI/CD 流程並部署到雲端平台
```

#### 🎯 快速原型模式 (30 分鐘 MVP)

```bash
# 一鍵式快速開發流程
@vibe start "快速原型"        # 2 分鐘澄清
@vibe prd                     # 1 分鐘生成 PRD  
@vibe code "核心功能"         # 10 分鐘開發
@vibe test                    # 5 分鐘測試
@vibe deploy                  # 12 分鐘部署
# 🎉 30 分鐘完成 MVP！
```



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

#### ❌ 初始化相關問題

```bash
# Q1: VibeCoding 系統初始化失敗
npm cache clean --force && npm install && npm run build

# Q2: npm run vibecoding status 指令無法執行
# 確保在 vibeCoding-template 目錄中執行
cd /path/to/your/vibeCoding-template
npm run vibecoding status

# Q3: MCP 服務無法啟動  
npm run build && npm run test:prompts

# Q4: 找不到 dist/ 目錄
# 重新建構系統
npm run build
ls -la dist/vibe-services/  # 確認服務檔案存在
```

#### ❌ 專案設定相關問題

```bash
# Q5: 在專案資料夾中無法使用 @vibe 指令
# 確保 IDE 已正確配置 MCP 設定，並重啟 IDE

# Q6: 路徑配置問題 - 找不到 VibeCoding 服務
# 使用絕對路徑，確認 dist/ 目錄存在
# Windows 範例: "C:\\Users\\YourName\\vibeCoding-template\\dist\\vibe-services\\context-manager\\index.js"
# macOS/Linux 範例: "/Users/YourName/vibeCoding-template/dist/vibe-services/context-manager/index.js"

# Q7: 專案資料夾結構問題
# VibeCoding 會自動創建需要的資料夾，但你也可以手動建立：
mkdir -p {0_discovery,1_design,2_implementation,3_validation,4_deployment}
```

#### ❌ IDE 配置相關問題

```bash
# Q8: Cursor IDE 無法識別 @vibe 指令
# 1. 檢查 settings.json 格式是否正確 (不能有註解)
# 2. 重啟 Cursor IDE
# 3. 確認 mcpServers 配置正確

# Q9: Claude Desktop 連接失敗
# 1. 檢查 claude_desktop_config.json 格式
# 2. 確認 API 金鑰設定正確
# 3. 重啟 Claude Desktop

# Q10: 權限問題 (Windows)
# 以管理員身分執行 PowerShell，設定執行政策：
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 獲取幫助
- 📖 **完整故障排除**: [IDE 設定指南](IDE_SETUP_GUIDE.md#故障排除)
- 💬 **社群支援**: [GitHub Issues](https://github.com/vibecoding/vibecoding-template/issues)
- 🐛 **錯誤回報**: [GitHub Issues](https://github.com/vibecoding/vibecoding-template/issues/new)

## 🤝 Contributing

我們歡迎貢獻！請查看 [Contributing Guide](CONTRIBUTING.md) 了解詳情。

## 📝 License

本專案採用 MIT License - 詳見 [LICENSE](LICENSE) 文件。

## ✅ 設定完成檢查清單

在開始使用 VibeCoding 之前，請確認以下項目：

### 🔧 系統設定檢查
- [ ] **Node.js >= 18.0.0** (`node --version`)
- [ ] **VibeCoding 已下載並建構** (`npm run build` 成功)
- [ ] **系統狀態正常** (`npm run vibecoding status` 顯示 ✅)
- [ ] **提示系統運作** (`npm run test:prompts` 顯示 🎉)

### 📁 專案設定檢查  
- [ ] **專案資料夾已建立** (`mkdir my-project && cd my-project`)
- [ ] **Git 初始化** (`git init` 和 `.gitignore` 設定)
- [ ] **IDE 已開啟專案** (`code .` 或 `cursor .`)

### ⚙️ IDE 配置檢查
- [ ] **MCP 設定檔已修改** (settings.json 或 claude_desktop_config.json)
- [ ] **VibeCoding 路徑正確** (使用絕對路徑)
- [ ] **IDE 已重啟** (重啟後配置才生效)
- [ ] **測試指令成功** (`@vibe start "測試"` 有回應)

### 🎯 準備開始開發
- [ ] **選擇開發模式**:
  - 📋 **完整流程**: 從需求澄清開始 (`@vibe start "專案名"`)
  - ⚡ **快速原型**: 30 分鐘 MVP 模式
  - 💻 **直接開發**: 跳過澄清，直接生成代碼

---

**🚀 現在開始享受 AI 驅動的對話式開發體驗！**

### 📚 推薦學習路徑
1. **新手**: [IDE 設定完全指南](IDE_SETUP_GUIDE.md) → 完成一個簡單專案
2. **進階**: [完整工具參考手冊](VIBECODING_TOOLS_REFERENCE.md) → 探索所有功能
3. **專家**: [架構設計文檔](#-architecture) → 客製化和擴展

> **💡 提示**: 遇到問題？查看上方的 [🔍 故障排除](#-故障排除) 或參考 [GitHub Issues](https://github.com/vibecoding/vibecoding-template/issues) 