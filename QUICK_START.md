# 🚀 VibeCoding 快速開始指南

VibeCoding 是一個革命性的**對話驅動開發框架**，讓你通過自然語言對話快速創建 MVP/POC。

## 📋 系統要求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **操作系統**: Windows 10/11, macOS, Linux
- **記憶體**: >= 4GB RAM
- **硬碟空間**: >= 1GB

## ⚡ 快速安裝

### 1. 下載 VibeCoding
```bash
git clone https://github.com/your-org/vibecoding-template.git
cd vibecoding-template
```

### 2. 安裝依賴
```bash
npm install
npm run build:all
```

### 3. 驗證安裝
```bash
npm run vibecoding --version
# 應該顯示: VibeCoding - Rapid MVP/POC Development through Conversation

# 🆕 驗證 Prompt 系統
npm run test:prompts
# 應該顯示: 🎉 FULLY OPERATIONAL - All prompts are ready!
```

## 🎯 5 分鐘快速體驗

### 步驟 1: 創建新項目
```bash
mkdir my-awesome-app
cd my-awesome-app

# 初始化 VibeCoding 項目
npx vibecoding init --name "awesome-app" --description "我的第一個 VibeCoding 應用"
```

### 步驟 2: 查看項目結構
```
my-awesome-app/
├── .vibecoding/           # VibeCoding 核心配置
├── 0_discovery/           # 需求探索階段  
├── 1_design/             # 系統設計階段
├── 2_implementation/     # 代碼實現階段
├── 3_validation/         # 測試驗證階段
├── 4_deployment/         # 部署配置階段
├── knowledge-base/       # 知識庫
└── README.md
```

### 步驟 3: 開始對話式開發
```bash
npx vibecoding chat
```

### 步驟 4: 檢查項目狀態
```bash
npx vibecoding status
```

## 🎭 AI Prompt 系統 🆕

VibeCoding 配備了完整的 AI 指導系統，確保所有服務提供一致、專業的開發協助：

```bash
# 檢查 Prompt 系統狀態
npm run test:prompts

# 驗證服務 Prompt 整合
npm run test:service-prompts

# 檢查 Prompt 完整性
npm run validate:prompts
```

**🎯 Prompt 系統特色:**
- 📁 **14 個專業 Prompt 文件** - 涵蓋所有服務和工作流程
- 🎯 **階段感知** - 根據開發階段動態調整 AI 行為  
- 🤝 **服務協作** - 確保所有 MCP 服務智能協作
- 💡 **一致體驗** - 統一的對話風格和專業水準

## 🔧 核心功能演示

### 💬 對話式需求分析
```bash
# 啟動智能對話
vibecoding chat

# 系統會問你：
# 🤖: "你想開發什麼類型的應用？"
# 💬: "我想開發一個任務管理 API"

# 🤖: "這個 API 需要哪些核心功能？"  
# 💬: "用戶註冊、任務 CRUD、優先級管理"
```

### 🏗️ 自動代碼生成
```bash
# 基於對話生成 Express API
vibecoding generate api --framework express

# 生成 React 前端
vibecoding generate frontend --framework react
```

### 📦 智能依賴管理
```bash
# 自動分析依賴
vibecoding deps scan

# 檢查安全漏洞
vibecoding deps audit

# 更新過期套件
vibecoding deps update
```

### 🧪 自動測試生成
```bash
# 生成單元測試
vibecoding test generate --type unit

# 生成 API 整合測試
vibecoding test generate --type integration

# 執行所有測試
vibecoding test run
```

### 📚 自動文檔生成
```bash
# 生成 API 文檔
vibecoding docs generate --type api

# 生成架構文檔
vibecoding docs generate --type architecture
```

### 🚀 一鍵部署配置
```bash
# 生成 Docker 配置
vibecoding deploy docker

# 生成 Kubernetes 配置
vibecoding deploy k8s

# 生成 CI/CD 流水線
vibecoding deploy cicd --provider github-actions
```

## 📖 實際使用範例

### 範例 1: REST API 快速開發

```bash
# 1. 創建項目
vibecoding init --name "task-api"

# 2. 對話式設計
vibecoding chat
# 告訴系統: "我需要一個任務管理 REST API，支援用戶註冊和任務 CRUD"

# 3. 自動生成代碼
vibecoding generate api --framework express
vibecoding generate tests --framework jest

# 4. 生成部署配置
vibecoding deploy docker
vibecoding deploy k8s --env production

# 5. 檢查結果
vibecoding status
vibecoding docs generate
```

### 範例 2: 全端應用開發

```bash
# 1. 創建全端項目
vibecoding init --name "todo-app"

# 2. 對話式需求分析
vibecoding chat
# 描述: "我需要一個 Todo 應用，包含 React 前端和 Node.js 後端"

# 3. 生成前後端代碼
vibecoding generate fullstack --frontend react --backend express

# 4. 自動配置數據庫
vibecoding db setup --type postgresql

# 5. 生成測試
vibecoding test generate --coverage

# 6. 部署到雲端
vibecoding deploy cloud --provider aws
```

## 🛠️ 進階配置

### 自定義 AI 模型
```javascript
// .vibecoding/config/vibe.config.json
{
  "services": {
    "codeGenerator": {
      "aiProvider": "anthropic",
      "model": "claude-3-sonnet",
      "temperature": 0.7
    }
  }
}
```

### 自定義模板
```bash
# 創建自定義代碼模板
vibecoding template create --name "my-api-template"

# 使用自定義模板
vibecoding generate --template my-api-template
```

### 工作流自定義
```javascript
// 自定義開發階段
{
  "workflow": {
    "phases": [
      "discovery",
      "design", 
      "prototype",     // 自定義階段
      "implementation",
      "testing",       // 自定義階段
      "deployment"
    ]
  }
}
```

## 🔍 故障排除

### 常見問題

**Q: VibeCoding 初始化失敗**
```bash
# 檢查 Node.js 版本
node --version  # 應該 >= 18.0.0

# 清除 npm 緩存
npm cache clean --force

# 重新安裝
npm install
```

**Q: 服務無法啟動**
```bash
# 檢查端口占用
netstat -nlp | grep :3000

# 重新構建所有服務
npm run build:all

# 檢查服務狀態
vibecoding service status
```

**Q: 代碼生成失敗**
```bash
# 檢查 AI 服務配置
vibecoding config show

# 重置配置
vibecoding config reset

# 檢查網絡連接
curl -I https://api.anthropic.com
```

**Q: Prompt 系統問題** 🆕
```bash
# 驗證 Prompt 系統完整性
npm run test:prompts

# 檢查特定服務 Prompt
node scripts/test-prompts.js

# 重新載入 Prompt 緩存
vibecoding service restart --prompt-reload
```

### 獲取幫助

- 📖 **完整文檔**: [docs.vibecoding.com](https://docs.vibecoding.com)
- 💬 **社群支援**: [discord.gg/vibecoding](https://discord.gg/vibecoding)  
- 🐛 **問題回報**: [github.com/vibecoding/issues](https://github.com/vibecoding/issues)
- 📧 **聯繫我們**: support@vibecoding.com

## 🎉 恭喜！

你已經成功設置了 VibeCoding！現在可以：

1. ✅ **創建新項目**: `vibecoding init`
2. ✅ **開始對話開發**: `vibecoding chat`  
3. ✅ **生成代碼**: `vibecoding generate`
4. ✅ **自動化測試**: `vibecoding test`
5. ✅ **一鍵部署**: `vibecoding deploy`

**下一步**: 嘗試創建你的第一個 VibeCoding 應用！

---

*VibeCoding - 讓開發回歸對話的本質* 🚀 