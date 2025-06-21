# VibeCoding MCP 服務設置指南

## 📋 **服務概覽**

VibeCoding 系統包含 6 個專業化的 MCP 服務，每個服務負責開發流程中的特定領域：

### 🎯 **核心服務架構**

```
VibeCoding System
├── Context Manager      # 上下文和會話管理
├── Code Generator       # 代碼生成和架構
├── Dependency Tracker   # 依賴管理
├── Test Validator       # 測試和質量保證
├── Doc Generator        # 文檔生成
└── Deployment Manager   # 部署管理
```

## ⚙️ **MCP 配置設置**

### 1. **找到你的 Cursor MCP 配置文件**
```
Windows: C:\Users\{username}\.cursor\mcp.json
macOS: ~/.cursor/mcp.json
Linux: ~/.cursor/mcp.json
```

### 2. **完整的 mcp.json 配置**

將以下配置添加到你的 `mcp.json` 文件中：

```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "description": "VibeCoding 上下文管理服務"
    },
    "vibecoding-code-generator": {
      "command": "node", 
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/code-generator/index.js"],
      "description": "VibeCoding 代碼生成服務"
    },
    "vibecoding-dependency-tracker": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/dependency-tracker/index.js"],
      "description": "VibeCoding 依賴追蹤服務"
    },
    "vibecoding-test-validator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/test-validator/index.js"],
      "description": "VibeCoding 測試驗證服務"
    },
    "vibecoding-doc-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/doc-generator/index.js"],
      "description": "VibeCoding 文檔生成服務"
    },
    "vibecoding-deployment-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/deployment-manager/index.js"],
      "description": "VibeCoding 部署管理服務"
    }
  }
}
```

### 3. **路徑調整說明**

⚠️ **重要**: 請將上述配置中的路徑替換為你的實際項目路徑：

**通用格式**：
```
/path/to/your/vibeCoding-template/dist/vibe-services/{service-name}/index.js
```

**具體範例**：

**Windows**：
```json
"args": ["C:\\Users\\YourName\\Projects\\vibeCoding-template\\dist\\vibe-services\\context-manager\\index.js"]
```

**macOS/Linux**：
```json
"args": ["/Users/YourName/Projects/vibeCoding-template/dist/vibe-services/context-manager/index.js"]
```

## 🔧 **服務工具說明**

### 📊 **Context Manager** (最核心的服務)
**特有工具**:
- `start-clarification` - 開始項目澄清流程
- `provide-clarification` - 提供澄清回答  
- `generate-prd` - 生成項目 PRD
- `generate-impl-plan` - 生成實施計劃
- `get-project` - 獲取項目詳情
- `list-projects` - 列出所有項目

**通用工具** (所有服務都有):
- `start-session` - 開始新的開發會話
- `add-conversation` - 添加對話記錄
- `record-decision` - 記錄重要決策
- `get-context-summary` - 獲取項目上下文摘要
- `get-relevant-history` - 查詢相關歷史記錄
- `get-ai-insight` - 獲取 AI 智能建議

### 🎯 **服務專業化分工**

| 服務 | 專責領域 | 主要用途 |
|------|---------|----------|
| **Context Manager** | 項目管理 | 會話管理、項目澄清、PRD 生成 |
| **Code Generator** | 代碼實現 | 架構設計、代碼生成 |
| **Dependency Tracker** | 依賴管理 | 版本控制、依賴分析 |
| **Test Validator** | 質量保證 | 測試生成、代碼驗證 |
| **Doc Generator** | 文檔維護 | API 文檔、用戶手冊 |
| **Deployment Manager** | 部署運維 | CI/CD、環境配置 |

## 🚀 **使用流程**

### 1. **開始新項目**
```
使用 Context Manager 的 start-clarification 工具
```

### 2. **項目澄清**
```
使用 provide-clarification 工具回答澄清問題
```

### 3. **生成 PRD**
```
使用 generate-prd 工具生成項目需求文檔
```

### 4. **協作開發**
```
根據需要調用其他專業服務的工具
```

## 📝 **驗證設置**

設置完成後，重啟 Cursor，你應該能看到所有 6 個 VibeCoding 服務在 MCP 面板中可用。

## 🔍 **故障排除**

### 問題 1: 服務無法啟動
- 檢查 Node.js 是否已安裝
- 確認文件路徑是否正確
- 檢查 dist 目錄是否存在編譯後的文件

### 問題 2: 工具無法調用
- 確認項目已正確編譯 (`npm run build`)
- 檢查服務日誌輸出
- 重啟 Cursor

### 問題 3: 路徑問題
- 使用絕對路徑
- 在 Windows 上使用雙反斜線 `\\`
- 確保路徑中沒有空格或特殊字符

## 📞 **支援**

如果遇到問題，請檢查：
1. 項目是否已正確編譯
2. Node.js 版本是否兼容
3. 文件權限是否正確
4. MCP 配置語法是否正確

---

## ⚙️ **進階客製化配置**

### 🎯 **環境變數設定**

在 MCP 配置中，你可以為每個服務設定環境變數來客製化行為：

```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "OPENAI_API_KEY": "你的_OPENAI_金鑰",
        "ANTHROPIC_API_KEY": "你的_ANTHROPIC_金鑰",
        "VIBECODING_DEFAULT_PROVIDER": "openai",
        "VIBECODING_LOG_LEVEL": "info",
        "VIBECODING_CONTEXT_PERSISTENCE": "true",
        "VIBECODING_MAX_CONTEXT_SIZE": "10000",
        "VIBECODING_SESSION_TIMEOUT": "3600000"
      }
    },
    "vibecoding-code-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/code-generator/index.js"],
      "env": {
        "OPENAI_API_KEY": "你的_OPENAI_金鑰",
        "VIBECODING_DEFAULT_LANGUAGE": "typescript",
        "VIBECODING_DEFAULT_FRAMEWORK": "react",
        "VIBECODING_CODE_STYLE": "functional",
        "VIBECODING_INCLUDE_TYPES": "true",
        "VIBECODING_INCLUDE_COMMENTS": "true",
        "VIBECODING_INCLUDE_TESTS": "auto",
        "VIBECODING_ERROR_HANDLING": "comprehensive"
      }
    },
    "vibecoding-dependency-tracker": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/dependency-tracker/index.js"],
      "env": {
        "VIBECODING_DEFAULT_PACKAGE_MANAGER": "npm",
        "VIBECODING_SECURITY_SCAN_LEVEL": "moderate",
        "VIBECODING_AUTO_UPDATE": "false",
        "VIBECODING_INCLUDE_DEV_DEPS": "true"
      }
    },
    "vibecoding-test-validator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/test-validator/index.js"],
      "env": {
        "VIBECODING_DEFAULT_TEST_FRAMEWORK": "jest",
        "VIBECODING_TEST_STYLE": "tdd",
        "VIBECODING_COVERAGE_THRESHOLD": "80",
        "VIBECODING_AUTO_RUN_TESTS": "false",
        "VIBECODING_INCLUDE_E2E": "true"
      }
    },
    "vibecoding-doc-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/doc-generator/index.js"],
      "env": {
        "VIBECODING_DEFAULT_DOC_FORMAT": "markdown",
        "VIBECODING_INCLUDE_EXAMPLES": "true",
        "VIBECODING_API_DOC_FORMAT": "openapi",
        "VIBECODING_CHANGELOG_FORMAT": "keepachangelog"
      }
    },
    "vibecoding-deployment-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/deployment-manager/index.js"],
      "env": {
        "VIBECODING_DEFAULT_PLATFORM": "docker",
        "VIBECODING_DEFAULT_ENVIRONMENT": "staging",
        "VIBECODING_AUTO_OPTIMIZE": "true",
        "VIBECODING_INCLUDE_MONITORING": "true",
        "VIBECODING_CICD_PLATFORM": "github-actions"
      }
    }
  }
}
```

### 🔧 **環境變數詳細說明**

#### 🎯 **Context Manager 客製化**
```bash
# AI 提供者設定
VIBECODING_DEFAULT_PROVIDER=openai          # openai | anthropic | gemini | cursor
VIBECODING_FALLBACK_PROVIDER=template       # 備用方案

# 會話管理
VIBECODING_CONTEXT_PERSISTENCE=true         # 是否持久化上下文
VIBECODING_MAX_CONTEXT_SIZE=10000           # 最大上下文大小
VIBECODING_SESSION_TIMEOUT=3600000          # 會話超時時間（毫秒）

# 澄清流程客製化
VIBECODING_CLARIFICATION_QUESTIONS=7        # 澄清問題數量
VIBECODING_AUTO_PROGRESS_TRACKING=true      # 自動進度追蹤

# 日誌設定
VIBECODING_LOG_LEVEL=info                   # debug | info | warn | error
VIBECODING_LOG_FILE=vibecoding.log          # 日誌檔案路徑
```

#### 💻 **Code Generator 客製化**
```bash
# 代碼生成偏好
VIBECODING_DEFAULT_LANGUAGE=typescript      # javascript | typescript | python | java
VIBECODING_DEFAULT_FRAMEWORK=react          # react | vue | angular | express | fastapi
VIBECODING_CODE_STYLE=functional            # functional | oop | mixed

# 代碼品質設定
VIBECODING_INCLUDE_TYPES=true               # 包含類型註解
VIBECODING_INCLUDE_COMMENTS=true            # 包含註解
VIBECODING_INCLUDE_TESTS=auto               # always | never | auto
VIBECODING_ERROR_HANDLING=comprehensive     # basic | comprehensive

# 性能優化
VIBECODING_OPTIMIZATION=readability         # performance | readability | size
VIBECODING_AUTO_IMPORTS=true                # 自動導入
```

#### 📦 **Dependency Tracker 客製化**
```bash
# 套件管理設定
VIBECODING_DEFAULT_PACKAGE_MANAGER=npm      # npm | yarn | pnpm | pip | poetry
VIBECODING_AUTO_UPDATE=false                # 自動更新依賴
VIBECODING_UPDATE_TYPE=minor                # patch | minor | major | security

# 安全掃描設定
VIBECODING_SECURITY_SCAN_LEVEL=moderate     # low | moderate | high | critical
VIBECODING_INCLUDE_DEV_DEPS=true            # 包含開發依賴
VIBECODING_VULNERABILITY_DB=osv             # osv | snyk | github

# 分析設定
VIBECODING_ANALYZE_TYPE=all                 # all | direct | dev | peer | optional
```

#### 🧪 **Test Validator 客製化**
```bash
# 測試框架設定
VIBECODING_DEFAULT_TEST_FRAMEWORK=jest      # jest | mocha | vitest | pytest
VIBECODING_TEST_STYLE=tdd                   # tdd | bdd
VIBECODING_AUTO_RUN_TESTS=false             # 自動執行測試

# 覆蓋率設定
VIBECODING_COVERAGE_THRESHOLD=80            # 覆蓋率門檻（%）
VIBECODING_COVERAGE_LINES=80                # 行覆蓋率
VIBECODING_COVERAGE_FUNCTIONS=85            # 函數覆蓋率
VIBECODING_COVERAGE_BRANCHES=75             # 分支覆蓋率

# 測試類型
VIBECODING_INCLUDE_E2E=true                 # 包含端到端測試
VIBECODING_INCLUDE_INTEGRATION=true         # 包含整合測試
VIBECODING_PERFORMANCE_TESTING=false       # 性能測試
```

#### 📚 **Doc Generator 客製化**
```bash
# 文檔格式設定
VIBECODING_DEFAULT_DOC_FORMAT=markdown      # markdown | html | pdf | json
VIBECODING_INCLUDE_EXAMPLES=true            # 包含範例
VIBECODING_INCLUDE_SCHEMAS=true             # 包含資料結構

# API 文檔設定
VIBECODING_API_DOC_FORMAT=openapi           # openapi | swagger | postman | insomnia
VIBECODING_AUTO_UPDATE_README=true          # 自動更新 README

# 變更日誌設定
VIBECODING_CHANGELOG_FORMAT=keepachangelog  # keepachangelog | conventional | simple
VIBECODING_AUTO_CHANGELOG=false             # 自動生成變更日誌
```

#### 🚀 **Deployment Manager 客製化**
```bash
# 部署平台設定
VIBECODING_DEFAULT_PLATFORM=docker          # docker | kubernetes | heroku | vercel | aws
VIBECODING_DEFAULT_ENVIRONMENT=staging      # development | staging | production
VIBECODING_AUTO_OPTIMIZE=true               # 自動優化

# 監控設定
VIBECODING_INCLUDE_MONITORING=true          # 包含監控
VIBECODING_MONITORING_TYPE=basic            # basic | advanced | enterprise
VIBECODING_ALERT_CHANNELS=email,slack       # 警報通道

# CI/CD 設定
VIBECODING_CICD_PLATFORM=github-actions     # github-actions | gitlab-ci | jenkins
VIBECODING_AUTO_DEPLOY=false                # 自動部署
```

### 🎨 **工具預設值配置**

你也可以通過環境變數設定工具的預設參數，這樣在使用工具時就不需要每次都指定相同的參數：

#### **Context Manager 工具預設值**
```bash
# start-clarification 預設值
VIBECODING_DEFAULT_CLARIFICATION_LANG=zh-TW  # 澄清問題語言

# generate-prd 預設值
VIBECODING_PRD_TEMPLATE=detailed             # basic | detailed | enterprise
VIBECODING_PRD_INCLUDE_WIREFRAMES=false      # 包含線框圖

# generate-impl-plan 預設值
VIBECODING_PLAN_DETAIL_LEVEL=high            # low | medium | high
VIBECODING_PLAN_INCLUDE_TIMELINE=true        # 包含時間線
```

#### **Code Generator 工具預設值**
```bash
# generate-code 預設值
VIBECODING_DEFAULT_CODE_TYPE=component       # component | service | api | utility | model
VIBECODING_DEFAULT_TEMPERATURE=0.7           # AI 創意度 (0-1)
VIBECODING_DEFAULT_MAX_TOKENS=4000           # 最大 token 數

# refactor-code 預設值
VIBECODING_DEFAULT_REFACTOR_TYPE=readability # performance | readability | structure | security

# generate-tests 預設值
VIBECODING_DEFAULT_TEST_TYPE=unit            # unit | integration | e2e
```

### 🔄 **動態配置範例**

#### **多環境配置**
```json
{
  "mcpServers": {
    "vibecoding-dev": {
      "command": "node",
      "args": ["/path/to/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "VIBECODING_ENVIRONMENT": "development",
        "VIBECODING_LOG_LEVEL": "debug",
        "VIBECODING_AUTO_SAVE": "false"
      }
    },
    "vibecoding-prod": {
      "command": "node",
      "args": ["/path/to/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "VIBECODING_ENVIRONMENT": "production",
        "VIBECODING_LOG_LEVEL": "error",
        "VIBECODING_AUTO_SAVE": "true"
      }
    }
  }
}
```

#### **團隊協作配置**
```json
{
  "mcpServers": {
    "vibecoding-team": {
      "command": "node",
      "args": ["/path/to/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "VIBECODING_TEAM_MODE": "true",
        "VIBECODING_SHARED_CONTEXT": "true",
        "VIBECODING_COLLABORATION_SERVER": "https://team.vibecoding.dev",
        "VIBECODING_TEAM_ID": "team-12345"
      }
    }
  }
}
```

#### **企業級配置**
```json
{
  "mcpServers": {
    "vibecoding-enterprise": {
      "command": "node",
      "args": ["/path/to/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "VIBECODING_ENTERPRISE_MODE": "true",
        "VIBECODING_COMPLIANCE_MODE": "true",
        "VIBECODING_AUDIT_LOGGING": "true",
        "VIBECODING_SECURITY_LEVEL": "high",
        "VIBECODING_DATA_RETENTION": "365"
      }
    }
  }
}
```

### 📝 **配置檔案範本**

#### **開發者配置範本**
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}",
        "VIBECODING_DEFAULT_PROVIDER": "openai",
        "VIBECODING_LOG_LEVEL": "info",
        "VIBECODING_DEFAULT_LANGUAGE": "typescript",
        "VIBECODING_CODE_STYLE": "functional",
        "VIBECODING_INCLUDE_TESTS": "auto"
      }
    },
    "vibecoding-code-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/code-generator/index.js"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}",
        "VIBECODING_DEFAULT_FRAMEWORK": "react",
        "VIBECODING_INCLUDE_TYPES": "true",
        "VIBECODING_AUTO_IMPORTS": "true"
      }
    }
  }
}
```

#### **團隊配置範本**
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}",
        "VIBECODING_DEFAULT_PROVIDER": "anthropic",
        "VIBECODING_TEAM_MODE": "true",
        "VIBECODING_SHARED_CONTEXT": "true",
        "VIBECODING_CODE_REVIEW": "mandatory",
        "VIBECODING_DOCUMENTATION": "comprehensive"
      }
    }
  }
}
```

### 🔍 **配置驗證**

設定完成後，你可以使用以下方式驗證配置：

#### **檢查環境變數**
```bash
# 🆕 簡潔指令 (推薦)
@vibe status

# 📝 完整指令 (仍可使用)
@vibecoding-context-manager get-ai-insight --query "顯示當前配置"
```

#### **測試工具預設值**
```bash
# 🆕 簡潔指令 (推薦)
@vibe code "測試組件"
# 應該使用你設定的預設語言和框架

# 📝 完整指令 (仍可使用)
@vibecoding-code-generator generate-code --requirements "測試組件"
```

#### **檢查服務狀態**
```bash
# 🆕 簡潔指令 (推薦) - 檢查所有服務是否正常運作
@vibe status

# 📝 完整指令 (仍可使用) - 逐一檢查每個服務
@vibecoding-context-manager start-session
@vibecoding-code-generator start-session
@vibecoding-dependency-tracker start-session
@vibecoding-test-validator start-session
@vibecoding-doc-generator start-session
@vibecoding-deployment-manager start-session
```

### 🎯 **最佳實踐建議**

1. **使用環境變數檔案**：將敏感資訊（如 API 金鑰）存放在 `.env` 檔案中
2. **分環境配置**：為開發、測試、生產環境使用不同的配置
3. **團隊同步**：使用版本控制管理團隊共用的配置範本
4. **定期更新**：隨著專案發展調整配置參數
5. **備份配置**：重要配置應該有備份機制

### 📚 **更多配置範例**

查看 **[mcp-config-examples.json](mcp-config-examples.json)** 文件，其中包含：

- **🎯 場景特化配置**：React 開發、Node.js API、Python ML 等
- **🏢 環境特定配置**：開發、測試、生產環境
- **👥 團隊協作配置**：共享上下文、代碼審查、企業級安全
- **⚙️ 完整環境變數說明**：所有可用的客製化選項
- **📋 使用指南**：step-by-step 設定流程

這樣的客製化配置讓你可以根據專案需求和團隊偏好，精確調整 VibeCoding 的行為，提供最佳的開發體驗！ 