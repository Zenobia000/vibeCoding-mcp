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
- [📖 **新手必讀：IDE 設定完全指南**](IDE_SETUP_GUIDE.md) ⭐
- [💻 **Cursor 用戶專用：API 金鑰說明**](CURSOR_MCP_CLARIFICATION.md) 🔥
- [🏗️ Architecture](#-architecture)
- [⚙️ Configuration](#-configuration)
- [🎯 Advanced Usage](#-advanced-usage)
- [🤝 Contributing](#-contributing)

## 🚀 Quick Start

### 🔥 一鍵自動設定 (最簡單)
```bash
# 自動安裝並設定所有 IDE
npm run setup

# 或
npx vibecoding-system setup --auto-detect-ide
```

### Via NPX (推薦)
```bash
# Initialize new project
npx vibecoding-system init --name "my-awesome-app"

# Verify installation
npm run test:prompts
# Expected: 🎉 FULLY OPERATIONAL - All prompts are ready!

# Start conversation-driven development
npx vibecoding-system chat
```

> **🆕 新手用戶？** 查看 [📖 IDE 設定完全指南](IDE_SETUP_GUIDE.md) 獲得超詳細的設定說明！

### Via Git Clone
```bash
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibecoding-template
npm install && npm run build:all
```

### 30-Second Demo
```bash
# 1. Create project
mkdir task-api && cd task-api
npx vibecoding init --name "task-api"

# 2. Start AI conversation
npx vibecoding chat
# Tell the system: "I need a task management REST API with user authentication"

# 3. Check generated structure
ls -la
# Result: Complete project structure with 5 development phases
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

## 📦 Installation

### Prerequisites
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **AI Provider API Keys**: OpenAI, Anthropic, or Gemini (optional)

### Install Globally
```bash
npm install -g vibecoding-system
```

### Install from Source
```bash
# Clone and install
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibecoding-template
npm install

# Build all services
npm run build:all

# Validate system
npm run test:prompts
npm run test:service-prompts
```

### Configure AI Providers
```bash
# Copy environment template
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

### Project Initialization
```bash
# Create new project
vibecoding init --name "my-project" --description "My awesome application"

# Project structure created:
my-project/
├── .vibecoding/           # VibeCoding configuration & prompts
├── 0_discovery/           # Requirements gathering
├── 1_design/             # System architecture
├── 2_implementation/     # Source code
├── 3_validation/         # Testing & quality
├── 4_deployment/         # Deployment configs
└── knowledge-base/       # Patterns & solutions
```

### Conversation-Driven Development
```bash
# Start intelligent conversation
vibecoding chat

# Example conversation:
🤖: "What would you like to build today?"
👤: "A task management API with user authentication"

🤖: "Great! Let me help you design this. What authentication method do you prefer?"
👤: "JWT tokens with bcrypt password hashing"

🤖: "Perfect! I'll generate an Express.js API with JWT middleware..."
```

### Code Generation
```bash
# Generate API code
vibecoding generate api --framework express --ai openai

# Generate React frontend
vibecoding generate frontend --framework react

# Generate tests
vibecoding test generate --type unit --coverage
```

### Project Management
```bash
# Check project status
vibecoding status

# Generate documentation
vibecoding docs --type api

# Deploy configuration
vibecoding deploy --platform docker
```

## 🔧 API Reference

### Context Management Service

#### `store_context`
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

#### `get_ai_insight`
Get AI-powered insights based on current context and query.

### Code Generation Service

#### `generate_code`
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
- **Dependency Tracker**: `analyze_dependencies`, `scan_vulnerabilities`, `update_dependencies`
- **Test Validator**: `generate_tests`, `analyze_coverage`, `validate_quality`
- **Doc Generator**: `generate_docs`, `create_api_docs`, `export_docs`
- **Deployment Manager**: `generate_docker_config`, `create_ci_pipeline`, `setup_monitoring`

## 🤝 Integrations

> **💡 需要詳細設定步驟？** 查看 [📖 IDE 設定完全指南](IDE_SETUP_GUIDE.md) 獲得包含設定檔位置、完整範例和故障排除的詳細說明！

### Claude Desktop
```json
{
  "mcpServers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"]
    }
  }
}
```

### Cursor IDE

> **💡 好消息！** Cursor 內建 LLM，無需額外 API 金鑰就能使用 VibeCoding！詳見 [完整說明](CURSOR_MCP_CLARIFICATION.md)

```json
{
  "mcp.servers": {
    "vibecoding": {
      "command": "npx", 
      "args": ["vibecoding-system", "mcp"]
    }
  },
  "vibecoding.enabled": true,
  "vibecoding.defaultProvider": "cursor"
}
```

### VSCode (with MCP Extension)
```json
{
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"]
    }
  }
}
```

### Cline / Continue
```json
{
  "mcpServers": {
    "vibecoding": {
      "command": "vibecoding-system",
      "args": ["mcp"]
    }
  }
}
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
# Create custom prompt
vibecoding prompt create --service code-generator --name custom-prompt

# Test prompt effectiveness
vibecoding prompt test --prompt-id custom-prompt

# Deploy to production
vibecoding prompt deploy --prompt-id custom-prompt
```

### Multi-Project Management
```bash
# Switch between projects
vibecoding workspace switch project-name

# Clone project structure
vibecoding clone --template project-a --name project-b

# Sync context across projects
vibecoding context sync --from project-a --to project-b
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

# Run all tests
npm test

# End-to-end testing
npm run test:e2e
```

## 🔍 Troubleshooting

### Common Issues

**Q: VibeCoding initialization fails**
```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Clear npm cache and reinstall
npm cache clean --force && npm install
```

**Q: Prompt System issues**
```bash
# Validate prompt system
npm run test:prompts

# Check specific service prompt
node scripts/test-prompts.js

# Reload prompt cache
vibecoding service restart --prompt-reload
```

**Q: AI provider connection fails**
```bash
# Check API keys
vibecoding config show

# Test connection
curl -I https://api.openai.com

# Reset configuration
vibecoding config reset
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone repository
git clone https://github.com/vibecoding/vibecoding-template.git

# Install dependencies
npm install

# Set up development environment
npm run dev:setup

# Run development suite
npm run dev
```

## 📄 License

MIT - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **📖 Complete Documentation**: [docs.vibecoding.dev](https://docs.vibecoding.dev)
- **💬 Community Support**: [discord.gg/vibecoding](https://discord.gg/vibecoding)  
- **🐛 Issue Tracker**: [GitHub Issues](https://github.com/vibecoding/vibecoding-template/issues)
- **📦 NPM Package**: [vibecoding-system](https://www.npmjs.com/package/vibecoding-system)
- **🔧 MCP Protocol**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)

---

**Built with ❤️ by the VibeCoding Team**  
*Transforming Development, One Conversation at a Time* 🚀 