# VibeCoding System Folder Structure

## Root Directory Structure

```
vibeCoding-template/
├── .vibecoding/                    # Core VibeCoding configuration
│   ├── config/                     # Configuration files
│   │   └── vibe.config.json       # Main configuration
│   ├── context/                    # Persistent context storage
│   │   ├── contexts.json          # Context entries
│   │   └── current-project.json   # Current project state
│   ├── conversations/              # Conversation history
│   │   └── *.json                 # Individual conversation files
│   └── prompts/                    # 🆕 AI Prompt System
│       ├── core/                   # Core system prompts (3 files)
│       ├── services/               # Service-specific prompts (6 files)
│       ├── workflows/              # Workflow prompts (5 files)
│       └── README.md              # Prompt system documentation
│
├── vibe-services/                  # MCP Service Collection
│   ├── context-manager/            # Context Management Service
│   │   ├── index.ts               # MCP server implementation
│   │   ├── package.json           # Service dependencies
│   │   └── tsconfig.json          # TypeScript config
│   ├── code-generator/             # Code Generation Service (TBD)
│   ├── dependency-tracker/         # Dependency Tracking Service (TBD)
│   ├── test-validator/             # Testing & Validation Service (TBD)
│   ├── doc-generator/              # Documentation Service (TBD)
│   └── deployment-manager/         # Deployment Service (TBD)
│
├── src/                            # Core Application Source
│   ├── core/                       # Core Components
│   │   └── orchestrator.ts        # VibeCoding Orchestrator
│   ├── services/                   # Service Integration
│   │   └── mcp-integration.ts    # MCP service integration
│   ├── cli/                        # CLI Implementation
│   │   └── index.ts               # CLI commands
│   ├── types/                      # TypeScript Type Definitions
│   └── utils/                      # Utility Functions
│       └── prompt-manager.ts      # 🆕 Prompt Management System
│
├── 0_discovery/                    # Phase 0: Discovery
│   ├── conversations/              # User conversations
│   ├── clarifications/             # Requirement clarifications
│   └── requirements/               # Gathered requirements
│
├── 1_design/                       # Phase 1: Design
│   ├── architecture/               # Architecture documents
│   ├── api-contracts/              # API specifications
│   └── flow-diagrams/              # System flow diagrams
│
├── 2_implementation/               # Phase 2: Implementation
│   ├── src/                        # Source code
│   ├── tests/                      # Test files
│   └── scripts/                    # Utility scripts
│
├── 3_validation/                   # Phase 3: Validation
│   ├── test-reports/               # Test execution reports
│   ├── quality-metrics/            # Code quality metrics
│   └── benchmarks/                 # Performance benchmarks
│
├── 4_deployment/                   # Phase 4: Deployment
│   ├── environments/               # Environment configs
│   ├── ci-cd/                      # CI/CD pipelines
│   └── monitoring/                 # Monitoring configs
│
├── knowledge-base/                 # Knowledge Accumulation
│   ├── patterns/                   # Reusable patterns
│   ├── solutions/                  # Problem solutions
│   └── retrospectives/             # Project retrospectives
│
├── design_templates/               # Original design templates
├── 經驗教訓/                       # Lessons and notes
│   └── Scratchpad.md              # Working notes
│
├── scripts/                        # 🆕 Utility Scripts
│   ├── build-all.ps1              # Build all services
│   └── test-prompts.js             # 🆕 Prompt system validation
│
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── README.md                       # Project documentation
├── IMPLEMENTATION_SUMMARY.md       # Implementation details
├── PROMPT_SYSTEM_USAGE.md          # 🆕 Prompt system guide
├── MCP_PROMPTS_ANSWER.md           # 🆕 MCP prompts explanation
├── .cursorrules                    # Development guidelines
└── development_guideline.md        # Development process guide
```

## File Descriptions

### Configuration Files
- **`.vibecoding/config/vibe.config.json`**: Central configuration for all VibeCoding services
- **`package.json`**: Node.js project configuration and dependencies
- **`tsconfig.json`**: TypeScript compiler options
- **🆕 `.vibecoding/prompts/`**: Complete AI prompt system with 14 prompt files

### Core Components
- **`src/core/orchestrator.ts`**: Main orchestrator that coordinates all services
- **`src/cli/index.ts`**: Command-line interface implementation
- **`src/services/mcp-integration.ts`**: Integration layer for MCP services
- **🆕 `src/utils/prompt-manager.ts`**: Centralized prompt management and loading system

### MCP Services
Each service in `vibe-services/` follows the MCP server pattern:
- Independent TypeScript implementation
- Own package.json for dependencies
- Communicates via MCP protocol
- **🆕 Integrated with AI prompt system for consistent behavior**

### Development Phases
Each numbered directory (0-4) represents a development phase:
- **0_discovery**: Requirement gathering through conversations
- **1_design**: Architecture and API design artifacts
- **2_implementation**: Actual code implementation
- **3_validation**: Testing and quality assurance
- **4_deployment**: Deployment and monitoring setup

### Knowledge Base
Automatically captures and stores:
- **patterns**: Reusable design patterns discovered
- **solutions**: Solutions to common problems
- **retrospectives**: Lessons learned from each project
- **🆕 prompts**: AI behavior guidance and conversation templates

## Usage Flow

1. **Initialize**: `vibecoding init` creates this structure
2. **Develop**: Use `vibecoding chat` to start conversation-driven development
3. **Progress**: System automatically manages phase progression
4. **Knowledge**: Patterns and solutions are captured automatically
5. **Deploy**: Final deployment configurations in phase 4

## Integration Points

- **mcp-vibecoder**: Integrated for structured development workflow
- **PRD-MCP-Server**: Integrated for documentation generation
- **Custom Services**: Easy to add new MCP services in `vibe-services/`
