# VibeCoding System MCP Server

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/vibecoding/vibecoding-template) [![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/vibecoding-system) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![GitHub issues](https://img.shields.io/github/issues/vibecoding/vibecoding-template.svg)](https://github.com/vibecoding/vibecoding-template/issues)

A revolutionary **Conversation-Driven Development** MCP server that transforms traditional software development into an AI-guided, natural dialogue experience. VibeCoding enables rapid MVP/POC creation through intelligent conversation with specialized MCP services.

## Quick Start
- [Features](#features)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Service Configuration](#service-configuration)
- [Integrations](#integrations)
- [CLI Usage](#cli-usage)
- [Docker](#docker)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [Appendix](#appendix)

## Quick Start

### Via NPX (recommended):
```bash
npx vibecoding-system init
```

### Via Git Clone:
```bash
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibecoding-template
npm install && npm run build:all
```

### Configure AI Providers:
```bash
# Copy environment template
cp .env.example .env

# Edit your AI provider keys
vim .env

# Verify installation
npm run test:prompts
```

### Get Help:
```bash
npx vibecoding-system --help
```

## Features

### 🎯 **Core Capabilities**
- **Conversation-Driven Development**: Build software through natural AI conversations
- **6 Specialized MCP Services**: Each service handles specific development aspects
- **Multi-Phase Workflow**: Structured progression from discovery to deployment
- **AI Prompt System**: 14 specialized prompts ensure consistent AI behavior
- **Knowledge Accumulation**: Automatic capture of patterns and solutions

### 🤖 **AI-Powered Services**
- **Context Manager**: Maintains persistent context across development sessions
- **Code Generator**: AI-driven code generation with template fallback
- **Dependency Tracker**: Smart dependency analysis and security scanning
- **Test Validator**: Automated test generation and quality analysis
- **Doc Generator**: Intelligent documentation creation
- **Deployment Manager**: Automated CI/CD and infrastructure setup

### 🔧 **Technical Features**
- **Multi-Provider AI Support**: OpenAI, Anthropic, Gemini, Local models
- **MCP Protocol Integration**: Seamless compatibility with MCP clients
- **Phase-Aware Workflows**: Dynamic AI guidance for each development stage
- **Template System**: Rich template library with AI enhancement
- **Hot Configuration**: Runtime provider switching without restart

## Installation

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **AI Provider API Keys**: OpenAI, Anthropic, or Gemini (optional)

### Install from NPM
```bash
npm install -g vibecoding-system
```

### Install from Source
```bash
# Clone repository
git clone https://github.com/vibecoding/vibecoding-template.git
cd vibecoding-template

# Install dependencies
npm install

# Build all services
npm run build:all

# Run system validation
npm run test:prompts
```

### For Development
```bash
# Development mode with hot reload
npm run dev

# Watch mode for services
npm run watch:services
```

## API Reference

The VibeCoding MCP Server provides the following specialized tools across 6 services:

### Context Management Service

#### `store_context`
Store conversation or project context for persistence across sessions.

**Parameters:**
- `contextType`: Type of context (`conversation`, `project`, `session`)
- `data`: Context data object
- `metadata`: Optional metadata for context organization

**Example:**
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

#### `get_context`
Retrieve stored context based on type and filters.

#### `get_ai_insight`
Get AI-powered insights based on current context and query.

### Code Generation Service

#### `generate_code`
Generate code using AI or template-based approach.

**Parameters:**
- `language`: Programming language (`typescript`, `python`, `javascript`)
- `framework`: Framework to use (`express`, `react`, `fastapi`)
- `description`: Natural language description of code requirements
- `requirements`: Array of specific requirements
- `providerId`: AI provider (`openai`, `anthropic`, `gemini`, `local`, `template`)
- `context`: Additional context for generation

**Example:**
```json
{
  "language": "typescript",
  "framework": "express",
  "description": "RESTful API for user authentication with JWT",
  "requirements": [
    "POST /auth/login endpoint",
    "POST /auth/register endpoint", 
    "JWT token validation middleware",
    "Password hashing with bcrypt"
  ],
  "providerId": "openai",
  "context": {
    "database": "postgresql",
    "authentication": "jwt"
  }
}
```

#### `refactor_code`
Refactor existing code with AI assistance.

#### `generate_from_template`
Generate code from predefined templates.

#### `register_template`
Register new code templates.

### Dependency Tracking Service

#### `analyze_dependencies`
Analyze project dependencies and relationships.

#### `scan_vulnerabilities`
Scan for security vulnerabilities in dependencies.

#### `update_dependencies`
Smart dependency updates with compatibility checking.

### Test Validation Service

#### `generate_tests`
Generate automated tests for code.

#### `analyze_coverage`
Analyze test coverage and suggest improvements.

#### `validate_quality`
Validate code quality against standards.

### Documentation Service

#### `generate_docs`
Generate documentation from code and comments.

#### `create_api_docs`
Create API documentation.

#### `export_docs`
Export documentation in multiple formats.

### Deployment Service

#### `generate_docker_config`
Generate Docker configurations.

#### `create_ci_pipeline`
Create CI/CD pipeline configurations.

#### `setup_monitoring`
Set up monitoring and alerting.

## Service Configuration & Hot Reload

### Configuring AI Providers

Configure provider credentials in two ways:

1. **Environment File**: Create `.env` file with your API keys:
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

2. **Runtime Configuration**: Update provider settings via MCP tools:
```json
{
  "tool": "update_provider_config",
  "arguments": {
    "providerId": "openai",
    "config": {
      "apiKey": "new_key",
      "model": "gpt-4-turbo",
      "temperature": 0.7
    }
  }
}
```

### Hot Reload & Automation

Configuration changes take effect immediately:
- **Seamless Provider Switching**: Change AI providers without restart
- **Dynamic Model Selection**: Switch models based on task complexity
- **Credential Rotation**: Update API keys in real-time
- **Environment Adaptation**: Support CI/CD and cloud deployments

## Integrations

### Claude Desktop
Add to `claude_desktop_config.json`:
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
Add to your Cursor MCP configuration:
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

### Cline / Continue
Add to MCP workflow definitions:
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

## CLI Usage

### Install Globally
```bash
npm install -g vibecoding-system
```

### Command Reference

#### Project Management
```bash
# Initialize new project
vibecoding init --name "my-app" --description "My awesome application"

# Start conversation-driven development
vibecoding chat

# Check project status  
vibecoding status

# Generate project documentation
vibecoding docs --type api
```

#### Service Management
```bash
# Start specific service
vibecoding service start context-manager

# Check service health
vibecoding service health

# Restart all services
vibecoding service restart --all
```

#### Development Workflow
```bash
# Generate code
vibecoding generate api --framework express --ai openai

# Run tests
vibecoding test --coverage

# Deploy configuration
vibecoding deploy --platform docker
```

#### System Management
```bash
# Validate prompt system
vibecoding validate prompts

# Export project configuration
vibecoding export --format json

# System diagnostics
vibecoding diagnose
```

### CLI Options
```bash
vibecoding --help                    # Show all commands
vibecoding init --help               # Show init options
vibecoding generate --help           # Show generation options
```

## Docker

### Building the Docker Image
```bash
# Build from source
docker build -t vibecoding-system .

# Build specific service
docker build -f docker/code-generator.Dockerfile -t vibecoding-code-generator .
```

### Running with Docker
```bash
# Run complete system
docker run -i --rm vibecoding-system

# Run with environment variables
docker run -i --rm \
  -e OPENAI_API_KEY=your_key \
  -e ANTHROPIC_API_KEY=your_key \
  vibecoding-system

# Run specific service
docker run -i --rm vibecoding-code-generator
```

### Docker Compose
```yaml
version: '3.8'
services:
  vibecoding:
    image: vibecoding-system:latest
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./projects:/app/projects
    stdin_open: true
    tty: true
```

## Advanced Usage

### Custom Prompt Development
```bash
# Create custom prompt
vibecoding prompt create --service code-generator --name custom-prompt

# Test prompt effectiveness
vibecoding prompt test --prompt-id custom-prompt

# Deploy prompt to production
vibecoding prompt deploy --prompt-id custom-prompt
```

### Multi-Project Management
```bash
# Switch between projects
vibecoding workspace switch project-name

# Sync context across projects
vibecoding context sync --from project-a --to project-b

# Clone project structure
vibecoding clone --template project-a --name project-b
```

### Integration Development
```bash
# Create custom MCP service
vibecoding create service --name custom-service --template base

# Register external MCP server
vibecoding register mcp --server-url ws://localhost:8080

# Export MCP configuration
vibecoding export mcp-config --format cursor
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before submitting issues or pull requests.

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

### Testing
```bash
# Run all tests
npm test

# Run prompt system tests
npm run test:prompts

# Run service integration tests  
npm run test:services

# Run end-to-end tests
npm run test:e2e
```

## Changelog

All notable changes to this project are documented in [CHANGELOG.md](CHANGELOG.md).

## Appendix

### Useful Links
- [GitHub Repository](https://github.com/vibecoding/vibecoding-template)
- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP specification
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - Testing and debugging tool
- [NPM Package](https://www.npmjs.com/package/vibecoding-system) - Published npm package
- [Documentation](https://docs.vibecoding.dev) - Complete documentation
- [Community Discord](https://discord.gg/vibecoding) - Community support

### System Architecture
```
VibeCoding MCP Server
├── Context Manager       → Persistent conversation & project state
├── Code Generator       → AI-powered code generation  
├── Dependency Tracker  → Smart dependency management
├── Test Validator      → Automated testing & quality
├── Doc Generator       → Intelligent documentation
└── Deployment Manager → CI/CD & infrastructure automation
```

### AI Provider Support Matrix
| Provider | Code Gen | Refactor | Test Gen | Docs | Status |
|----------|----------|----------|----------|------|--------|
| OpenAI   | ✅        | ✅        | ✅        | ✅    | Stable |
| Anthropic| ✅        | ✅        | ✅        | ✅    | Stable |
| Gemini   | ✅        | ✅        | ✅        | ✅    | Stable |
| Local    | ⚠️        | ⚠️        | ⚠️        | ⚠️    | Beta   |
| Template | ✅        | ⚠️        | ✅        | ✅    | Stable |

### Performance Benchmarks
- **Project Initialization**: < 30 seconds
- **Code Generation**: 2-15 seconds (depending on complexity)
- **Context Loading**: < 1 second
- **Documentation Generation**: 5-30 seconds
- **Test Generation**: 3-20 seconds

---

**Built with ❤️ by the VibeCoding Team**  
*Transforming Development, One Conversation at a Time* 🚀 