# VibeCoding System 🚀

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/vibecoding/vibecoding-template) [![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/vibecoding-system) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![GitHub issues](https://img.shields.io/github/issues/vibecoding/vibecoding-template.svg)](https://github.com/vibecoding/vibecoding-template/issues)

> **Conversation-Driven Development Framework for Rapid MVP/POC Creation**

VibeCoding transforms traditional software development into an AI-guided, natural dialogue experience. Build MVPs and POCs rapidly through intelligent conversation with specialized MCP services.

## 📋 Table of Contents
- [🚀 Quick Start](#-quick-start)
- [🌟 Features](#-features)
- [📦 Installation](#-installation)
- [💻 Basic Usage](#-basic-usage)
- [🔧 API Reference](#-api-reference)
- [🤝 Integrations](#-integrations)
- [📖 Complete Setup Guides](#-complete-setup-guides)
- [🏗️ Architecture](#-architecture)
- [⚙️ Configuration](#-configuration)
- [🎯 Advanced Usage](#-advanced-usage)
- [🤝 Contributing](#-contributing)

## 🚀 Quick Start

### 🔥 一鍵自動設定 (最簡單)
```bash
# 在專案目錄中執行
cd vibeCoding-template
npm install && npm run build

# 驗證安裝
npm run test:prompts
# Expected: 🎉 FULLY OPERATIONAL - All prompts are ready!
```

### Via Git Clone (推薦)
```bash
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibeCoding-template
npm install && npm run build
```

### 30-Second Demo
```bash
# 1. Clone and setup
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibeCoding-template
npm install && npm run build

# 2. Verify all services are working
npm run test:prompts

# 3. Check MCP services
npm run mcp:context-manager
# Press Ctrl+C to exit after verification
```

## 🌟 Features

### 🎯 **Core Capabilities**
- **🗣️ Conversation-Driven Development**: Build software through natural AI conversations
- **🤖 6 Specialized MCP Services**: Each service handles specific development aspects
- **📋 Multi-Phase Workflow**: Structured progression from discovery to deployment
- **🎭 AI Prompt System**: 14 specialized prompts ensure consistent AI behavior
- **🧠 Knowledge Accumulation**: Automatic capture of patterns and solutions

### 🔧 **AI-Powered Services**
- **📋 Context Manager**: Maintains persistent context across development sessions
- **⚡ Code Generator**: AI-driven code generation with template fallback
- **📦 Dependency Tracker**: Smart dependency analysis and security scanning  
- **🧪 Test Validator**: Automated test generation and quality analysis
- **📚 Doc Generator**: Intelligent documentation creation
- **🚀 Deployment Manager**: Automated CI/CD and infrastructure setup

### 💡 **Technical Highlights**
- **Multi-Provider AI Support**: OpenAI, Anthropic, Gemini, Local models
- **MCP Protocol Integration**: Seamless compatibility with MCP clients
- **Phase-Aware Workflows**: Dynamic AI guidance for each development stage
- **Template System**: Rich template library with AI enhancement
- **Hot Configuration**: Runtime provider switching without restart

### 🆕 **New in This Version**
- **Enhanced Project Management**: Complete project lifecycle with clarification process
- **Auto-Documentation Generation**: PRD and implementation plans from conversations
- **Improved Type System**: Robust TypeScript interfaces for all components
- **Fixed MCP Services**: All 6 services now fully functional and deployable

## 📦 Installation

### Prerequisites
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **AI Provider API Keys**: OpenAI, Anthropic, or Gemini (optional for basic usage)

### Install from Source
```bash
# Clone and install
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibeCoding-template
npm install

# Build all services
npm run build

# Validate system
npm run test:prompts
```

### Configure AI Providers (Optional)
```bash
# Copy environment template (if it exists)
cp .env.example .env

# Edit your API keys
vim .env
```

Example `.env`:
```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4

# Anthropic Configuration  
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-3-sonnet

# Gemini Configuration
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-pro
```

## 💻 Basic Usage

### Project Structure Overview
After installation, your project will have this structure:
```
vibeCoding-template/
├── .vibecoding/           # VibeCoding configuration & prompts
├── 0_discovery/           # Requirements gathering
├── 1_design/             # System architecture
├── 2_implementation/     # Source code
├── 3_validation/         # Testing & quality
├── 4_deployment/         # Deployment configs
├── vibe-services/        # MCP services source code
├── dist/                 # Compiled MCP services
└── knowledge-base/       # Patterns & solutions
```

### Using MCP Services in Your IDE

#### Step 1: Build the Services
```bash
npm run build
```

#### Step 2: Configure Your IDE
See the [Complete Setup Guides](#-complete-setup-guides) section below for detailed IDE-specific instructions.

#### Step 3: Start Using Services

##### 🆕 **簡潔指令** (推薦)
```bash
# 🎯 項目管理
@vibe start "我的項目"      # 開始新項目
@vibe ask "答案"           # 回答澄清問題
@vibe prd                 # 生成 PRD

# 💻 代碼開發
@vibe code "登入功能"      # 生成代碼
@vibe api "用戶註冊"       # 生成 API
@vibe fix "代碼"          # 重構代碼

# 🧪 測試執行
@vibe test               # 執行測試
@vibe cover              # 檢查覆蓋率

# 🚀 部署管理
@vibe deploy             # 部署服務
```

##### 📝 **完整指令** (仍可使用)
```bash
@vibecoding-context-manager start-clarification
@vibecoding-code-generator generate-code
@vibecoding-test-validator run-tests
```

> **💡 新指令系統**：我們重新設計了指令，平均減少 77% 的輸入量！查看 [指令重新設計文檔](VIBECODING_COMMAND_REDESIGN.md) 了解更多。

### Project Clarification Process

#### 🆕 **簡潔指令** (推薦)
```bash
# 開始項目澄清
@vibe start "任務管理系統"
# 提供結構化問題來收集需求

# 回答澄清問題
@vibe ask "主要解決團隊協作和任務追蹤問題"
# 系統引導完成 7 個標準澄清問題

# 澄清完成後生成 PRD
@vibe prd
# 創建全面的產品需求文檔
```

#### 📝 **完整指令** (仍可使用)
```bash
# Start project clarification in your IDE
@vibecoding-context-manager start-clarification
# Provides structured questions to gather requirements

# Provide clarification responses
@vibecoding-context-manager provide-clarification
# System guides through 7 standard clarification questions

# Generate PRD after clarification
@vibecoding-context-manager generate-prd
# Creates comprehensive Product Requirements Document
```

## 🔧 API Reference

### Context Management Service

#### `start-clarification`
Start a new project with guided clarification process.

```json
{
  "projectName": "Task Management API",
  "initialDescription": "RESTful API for task management with user authentication"
}
```

#### `provide-clarification`
Provide answers to clarification questions.

```json
{
  "projectId": "project-abc123",
  "questionIndex": 0,
  "answer": "Helps teams organize and track their daily tasks efficiently"
}
```

#### `generate-prd`
Generate Product Requirements Document from clarifications.

#### `generate-impl-plan`
Generate detailed implementation plan.

#### `store-context`
Store conversation or project context for persistence across sessions.

```json
{
  "contextType": "conversation",
  "data": {
    "userRequirement": "Build a task management API",
    "preferences": ["TypeScript", "Express", "PostgreSQL"]
  },
  "metadata": {
    "phase": "discovery",
    "priority": "high"
  }
}
```

### Code Generation Service

#### `generate-code`
Generate code using AI or template-based approach.

```json
{
  "language": "typescript",
  "framework": "express", 
  "description": "RESTful API for user authentication with JWT",
  "requirements": [
    "POST /auth/login endpoint",
    "POST /auth/register endpoint",
    "JWT token validation middleware"
  ],
  "providerId": "openai"
}
```

### Other Services
- **Dependency Tracker**: `analyze-dependencies`, `security-scan`, `update-dependencies`
- **Test Validator**: `run-tests`, `validate-coverage`, `performance-test`
- **Doc Generator**: `generate-docs`, `create-api-docs`, `generate-changelog`
- **Deployment Manager**: `deploy-service`, `setup-monitoring`, `rollback-deployment`

## 🤝 Integrations

> **💡 需要詳細設定步驟？** 查看 [📖 IDE 設定完全指南](IDE_SETUP_GUIDE.md) 獲得包含設定檔位置、完整範例和故障排除的詳細說明！

### Claude Desktop
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"]
    },
    "vibecoding-code-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/code-generator/index.js"]
    }
  }
}
```

### Cursor IDE

> **💡 好消息！** Cursor 內建 LLM，無需額外 API 金鑰就能使用 VibeCoding！詳見 [完整說明](CURSOR_MCP_CLARIFICATION.md)

```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"]
    },
    "vibecoding-code-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/code-generator/index.js"]
    }
  }
}
```

**Windows 路徑範例**:
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["C:\\Users\\YourName\\Projects\\vibeCoding-template\\dist\\vibe-services\\context-manager\\index.js"]
    }
  }
}
```

**macOS/Linux 路徑範例**:
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/Users/YourName/Projects/vibeCoding-template/dist/vibe-services/context-manager/index.js"]
    }
  }
}
```

### VSCode (with MCP Extension)
```json
{
  "mcp.servers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"]
    }
  }
}
```

## 📚 文檔導航

### 🎯 設定指南（按順序閱讀）
1. **[IDE 設定完全指南](IDE_SETUP_GUIDE.md)** - 主要設定文檔，支援所有 MCP Host
2. **[Cursor MCP 專用說明](CURSOR_MCP_CLARIFICATION.md)** - Cursor 用戶必讀，API 金鑰需求說明
3. **[MCP 設定指南](MCP_SETUP_GUIDE.md)** - 深度配置和故障排除
4. **[部署指南](DEPLOY_MCP_GUIDE.md)** - 生產環境部署

### 🛠️ 工具參考
- **[完整工具參考手冊](VIBECODING_TOOLS_REFERENCE.md)** - 所有 34+ 工具的詳細說明和範例
- **[簡潔指令系統](VIBECODING_COMMAND_REDESIGN.md)** - 🆕 基於 UX 的全新指令設計，減少 77% 輸入量
- **[MCP 配置範例集合](mcp-config-examples.json)** - 🆕 各種場景的完整配置範例

### 🏗️ 專案結構
- **[資料夾結構說明](folder_structure.md)** - 專案架構和檔案組織

### 📋 文檔連貫性說明

**🔗 設定路徑一致性**：
- 所有文檔使用統一的路徑格式：`/path/to/your/vibeCoding-template/dist/vibe-services/{service}/index.js`
- 支援 Windows (`C:\Users\...`) 和 macOS/Linux (`/Users/...`) 的具體範例
- 移除了所有硬編碼的 `D:\` 路徑

**🎯 MCP Host 支援**：
- **Cursor IDE**：內建 LLM，無需 API 金鑰（推薦）
- **Claude Desktop**：原生 MCP 支援，需要 API 金鑰
- **VSCode**：需要 MCP 擴展，需要 API 金鑰
- **其他工具**：通用 MCP 配置格式

**🛠️ 工具名稱統一**：
- `start-clarification`（不是 start-project-clarification）
- `generate-prd`（不是 generate-project-prd）
- `generate-impl-plan`（不是 generate-project-implementation-plan）

**📝 範例完整性**：
- 每個專屬工具都有詳細的使用範例
- 包含參數範例和預期回應
- 提供完整的開發流程示範

## 📖 Complete Setup Guides

### 🎯 新手必讀文檔
- **[IDE 設定完全指南](IDE_SETUP_GUIDE.md)** - 超詳細的 IDE 設定說明，適合任何技能水平
- **[Cursor MCP 說明](CURSOR_MCP_CLARIFICATION.md)** - Cursor 用戶專用，解釋為什麼不需要額外 API 金鑰
- **[MCP 服務設置指南](MCP_SETUP_GUIDE.md)** - 完整的 MCP 服務配置說明
- **[部署完成指南](DEPLOY_MCP_GUIDE.md)** - 確認所有服務已正確部署

### 📋 系統需求
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **操作系統**: Windows 10/11, macOS, Linux
- **記憶體**: >= 4GB RAM
- **硬碟空間**: >= 1GB

### 📚 **完整文檔集**
- **[VIBECODING_TOOLS_REFERENCE.md](VIBECODING_TOOLS_REFERENCE.md)** - 🆕 完整工具參考手冊，包含所有 6 個服務的詳細工具列表
- **[IDE_SETUP_GUIDE.md](IDE_SETUP_GUIDE.md)** - 詳細的 IDE 整合指南，適用於所有平台
- **[CURSOR_MCP_CLARIFICATION.md](CURSOR_MCP_CLARIFICATION.md)** - Cursor 專用設定和 API 金鑰說明
- **[MCP_SETUP_GUIDE.md](MCP_SETUP_GUIDE.md)** - MCP 服務配置和故障排除
- **[DEPLOY_MCP_GUIDE.md](DEPLOY_MCP_GUIDE.md)** - 部署完成驗證指南
- **[folder_structure.md](folder_structure.md)** - 項目結構和文件組織說明

### ⚡ 5 分鐘快速體驗
```bash
# 1. Clone 專案
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibeCoding-template

# 2. 安裝和建構
npm install && npm run build

# 3. 驗證系統
npm run test:prompts

# 4. 配置你的 IDE (參考上面的 Integrations 部分)
# 5. 開始使用 VibeCoding！
```

## 🏗️ Architecture

### Core System
```
VibeCoding MCP Server
├── 📋 Context Manager       → Persistent conversation & project state
├── ⚡ Code Generator       → AI-powered code generation  
├── 📦 Dependency Tracker  → Smart dependency management
├── 🧪 Test Validator      → Automated testing & quality
├── 📚 Doc Generator       → Intelligent documentation
└── 🚀 Deployment Manager → CI/CD & infrastructure automation
```

### AI Prompt System
Located in `.vibecoding/prompts/`, this system provides intelligent guidance:

- **Core Prompts** (3): System identity, conversation style, collaboration rules
- **Service Prompts** (6): Specialized prompts for each MCP service  
- **Workflow Prompts** (5): Phase-specific development guidance
- **Dynamic Loading**: Adapts to current project phase and context

### Development Phases
```
0_discovery/     → Requirement gathering and clarifications
1_design/        → Architecture and API design
2_implementation/→ Source code and tests
3_validation/    → Test reports and quality metrics
4_deployment/    → Deployment configurations
knowledge-base/  → Patterns, solutions, and retrospectives
```

### 🎯 為什麼所有服務都有 start-session 和 get-ai-insight？

基於 **智能協作機制** 的設計理念：

#### 1. **統一的會話管理** (`start-session`)
- **🔄 上下文連續性**：確保每個服務都能接入同一個開發會話
- **📊 狀態同步**：所有服務都能訪問相同的項目狀態和決策記錄
- **🤝 服務協作**：不同服務可以在同一個會話中無縫協作

#### 2. **統一的 AI 洞察系統** (`get-ai-insight`)
- **🧠 智能建議**：每個服務都能基於當前上下文提供專業的 AI 建議
- **📈 階段感知**：根據開發階段提供相應建議
- **🎯 專業化回應**：雖然是共同工具，但每個服務會根據自己的專業領域提供不同的洞察

這種設計確保了：
- ✅ **一致性**：所有服務都有統一的基礎操作
- ✅ **專業性**：每個服務在自己領域內提供專業建議
- ✅ **協作性**：服務間可以無縫協作和信息共享
- ✅ **可擴展性**：新增服務只需實作基礎接口即可整合

## ⚙️ Configuration

### vibe.config.json
```json
{
  "version": "1.0.0",
  "projectName": "your-project",
  "services": {
    "contextManager": {
      "enabled": true,
      "persistentStorage": ".vibecoding/context"
    },
    "codeGenerator": {
      "aiProvider": "openai",
      "model": "gpt-4",
      "temperature": 0.7
    }
  },
  "workflow": {
    "phases": ["discovery", "design", "implementation", "validation", "deployment"],
    "autoProgressTracking": true
  },
  "prompts": {
    "enabled": true,
    "cachingEnabled": true,
    "dynamicLoading": true
  }
}
```

### AI Provider Support Matrix
| Provider | Code Gen | Refactor | Test Gen | Docs | Status |
|----------|----------|----------|----------|------|--------|
| OpenAI   | ✅        | ✅        | ✅        | ✅    | Stable |
| Anthropic| ✅        | ✅        | ✅        | ✅    | Stable |
| Gemini   | ✅        | ✅        | ✅        | ✅    | Stable |
| Local    | ⚠️        | ⚠️        | ⚠️        | ⚠️    | Beta   |
| Template | ✅        | ⚠️        | ✅        | ✅    | Stable |

## 🎯 Advanced Usage

### Custom Prompt Development
```bash
# Test prompt system
npm run test:prompts

# Validate service prompts
node scripts/test-prompts.js
```

### Multi-Service Usage
```bash
# Build all services
npm run build

# Test individual services
npm run mcp:context-manager
npm run mcp:code-generator
npm run mcp:dependency-tracker
npm run mcp:test-validator
npm run mcp:doc-generator
npm run mcp:deployment-manager
```

### Docker Deployment
```bash
# Build Docker image
docker build -t vibecoding-system .

# Run with environment variables
docker run -i --rm \
  -e OPENAI_API_KEY=your_key \
  -e ANTHROPIC_API_KEY=your_key \
  vibecoding-system
```

### Performance Benchmarks
- **Project Initialization**: < 30 seconds
- **Code Generation**: 2-15 seconds (depending on complexity)
- **Context Loading**: < 1 second
- **Documentation Generation**: 5-30 seconds
- **Test Generation**: 3-20 seconds

## 🧪 Testing & Validation

```bash
# Validate prompt system
npm run test:prompts

# Test service integration
npm run test:service-prompts

# Build and verify all services
npm run build

# Test individual MCP services
npm run mcp:context-manager
# Press Ctrl+C to exit after verification
```

## 🔍 Troubleshooting

### Common Issues

**Q: VibeCoding 初始化失敗**
```bash
# 檢查 Node.js 版本
node --version  # 應該 >= 18.0.0

# 清除 npm 緩存
npm cache clean --force

# 重新安裝
npm install
```

**Q: MCP 伺服器無法啟動**
```bash
# 確保已建構服務
npm run build

# 檢查建構檔案是否存在
ls -la dist/vibe-services/

# 測試特定服務
npm run mcp:context-manager
```

**Q: Prompt 系統問題**
```bash
# 驗證 Prompt 系統完整性
npm run test:prompts

# 檢查 Prompt 文件
ls -la .vibecoding/prompts/

# 重新建構
npm run build
```

**Q: 路徑配置問題**
```bash
# 確認專案路徑
pwd

# 使用絕對路徑
# Windows: C:\Users\YourName\Projects\vibeCoding-template\dist\...
# macOS/Linux: /Users/YourName/Projects/vibeCoding-template/dist/...
```

### 獲取幫助
- 📖 **完整文檔**: [docs.vibecoding.com](https://docs.vibecoding.com)
- 💬 **社群支援**: [discord.gg/vibecoding](https://discord.gg/vibecoding)  
- 🐛 **問題回報**: [github.com/vibecoding/issues](https://github.com/vibecoding/issues)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone repository
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibeCoding-template

# Install dependencies
npm install

# Build services
npm run build

# Run tests
npm run test:prompts
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🚀 現在你可以開始享受 AI 驅動的對話式開發體驗了！** 