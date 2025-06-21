# 🎯 VibeCoding IDE 設定完全指南

> **超詳細設定指南，讓任何人都能輕鬆設定 VibeCoding 到各種 MCP Host**

## 📋 目錄
- [🚀 快速設定（推薦）](#-快速設定推薦)
- [💻 Cursor IDE 設定](#-cursor-ide-設定)
- [🤖 Claude Desktop 設定](#-claude-desktop-設定)
- [📝 VSCode 設定](#-vscode-設定)
- [🔧 其他 MCP Host 設定](#-其他-mcp-host-設定)
- [⚙️ 客製化設定選項](#-客製化設定選項)
- [🎯 實際使用範例](#-實際使用範例)
- [🔍 故障排除](#-故障排除)

---

## 🚀 快速設定（推薦）

### ⚡ 前置準備

#### 1. 確保系統需求
```bash
# 1. 檢查 Node.js 版本 (必須 >= 18.0.0)
node --version

# 2. 檢查 npm 版本
npm --version

# 3. 確認專案已建構
cd /path/to/your/vibeCoding-template
npm install && npm run build

# 4. 驗證服務檔案存在
ls -la dist/vibe-services/*/index.js
```

#### 2. 取得你的專案路徑
```bash
# 在 vibeCoding-template 目錄中執行
pwd
# 記下這個路徑，稍後設定時會用到
```

### 🎯 選擇你的 MCP Host

根據你使用的開發環境，選擇對應的設定方式：

| MCP Host | 適用場景 | API 金鑰需求 | 推薦度 |
|----------|----------|-------------|--------|
| **Cursor IDE** | 日常開發、代碼編輯 | ❌ 不需要 (內建 LLM) | ⭐⭐⭐⭐⭐ |
| **Claude Desktop** | AI 對話、需求分析 | ✅ 需要 | ⭐⭐⭐⭐ |
| **VSCode** | 傳統開發環境 | ✅ 需要 | ⭐⭐⭐ |
| **其他工具** | 特殊需求 | 視情況而定 | ⭐⭐ |

---

## 💻 Cursor IDE 設定

> **💡 重要優勢**：Cursor 有內建 LLM，**無需額外 API 金鑰**！詳見 [Cursor MCP 專用說明](CURSOR_MCP_CLARIFICATION.md)

### 📍 設定檔位置

| 系統 | 設定檔路徑 |
|------|-----------|
| **Windows** | `C:\Users\{用戶名}\AppData\Roaming\Cursor\User\settings.json` |
| **macOS** | `~/Library/Application Support/Cursor/User/settings.json` |
| **Linux** | `~/.config/Cursor/User/settings.json` |

### 🔧 詳細設定步驟

#### 步驟 1: 開啟設定檔
```bash
# Windows PowerShell
code "$env:APPDATA\Cursor\User\settings.json"

# macOS Terminal
code "~/Library/Application Support/Cursor/User/settings.json"

# Linux Terminal
code ~/.config/Cursor/User/settings.json
```

#### 步驟 2: 加入 VibeCoding MCP 設定

**🔥 推薦設定（使用 Cursor 內建 LLM）**：
```json
{
  "mcp.servers": {
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
  },
  
  "vibecoding.enabled": true,
  "vibecoding.defaultProvider": "cursor"
}
```

**⚠️ 重要**：請將 `/path/to/your/vibeCoding-template/` 替換為你的實際專案路徑

**具體路徑範例**：

**Windows**：
```json
"args": ["C:\\Users\\YourName\\Projects\\vibeCoding-template\\dist\\vibe-services\\context-manager\\index.js"]
```

**macOS/Linux**：
```json
"args": ["/Users/YourName/Projects/vibeCoding-template/dist/vibe-services/context-manager/index.js"]
```

#### 步驟 3: 重啟 Cursor

#### 步驟 4: 驗證設定
1. 重啟 Cursor IDE
2. 開啟任何專案
3. 在聊天面板中測試指令：

**🆕 簡潔指令** (推薦)：
```bash
@vibe start "測試項目"    # 開始新項目
```

**📝 完整指令** (仍可使用)：
```bash
@vibecoding-context-manager start-session
```

4. 如果看到回應，表示設定成功！

### 🎨 Cursor 進階客製化

#### AI 對話偏好
```json
{
  "vibecoding.cursor": {
    "useBuiltinLLM": true,
    "contextSharing": true,
    "inlineGeneration": true,
    "chatIntegration": true
  }
}
```

#### 代碼生成偏好
```json
{
  "vibecoding.cursor.codeGeneration": {
    "autoImports": true,
    "useTypeScript": true,
    "preferFunctionalComponents": true,
    "generateTests": true
  }
}
```

---

## 🤖 Claude Desktop 設定

> **📋 適合場景**：需求分析、項目澄清、深度 AI 對話

### 📍 設定檔位置

| 系統 | 設定檔路徑 |
|------|-----------|
| **Windows** | `C:\Users\{用戶名}\AppData\Roaming\Claude\claude_desktop_config.json` |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Linux** | `~/.config/claude/claude_desktop_config.json` |

### 🔧 詳細設定步驟

#### 步驟 1: 創建或編輯設定檔
```bash
# Windows PowerShell
notepad "$env:APPDATA\Claude\claude_desktop_config.json"

# macOS Terminal  
open -a TextEdit "~/Library/Application Support/Claude/claude_desktop_config.json"

# Linux Terminal
nano ~/.config/claude/claude_desktop_config.json
```

#### 步驟 2: 加入完整的 VibeCoding 設定
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "你的_ANTHROPIC_金鑰",
        "VIBECODING_LOG_LEVEL": "info"
      }
    },
    "vibecoding-code-generator": {
      "command": "node", 
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/code-generator/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "你的_ANTHROPIC_金鑰"
      }
    },
    "vibecoding-dependency-tracker": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/dependency-tracker/index.js"]
    },
    "vibecoding-test-validator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/test-validator/index.js"]
    },
    "vibecoding-doc-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/doc-generator/index.js"]
    },
    "vibecoding-deployment-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/deployment-manager/index.js"]
    }
  }
}
```

#### 步驟 3: 重啟 Claude Desktop

#### 步驟 4: 測試連接
在 Claude Desktop 中輸入：
```
請使用 VibeCoding Context Manager 開始一個新的開發會話
```

---

## 📝 VSCode 設定

> **🔧 適合場景**：傳統開發環境、需要豐富擴展生態

### 📍 設定檔位置

| 系統 | 設定檔路徑 |
|------|-----------|
| **Windows** | `C:\Users\{用戶名}\AppData\Roaming\Code\User\settings.json` |
| **macOS** | `~/Library/Application Support/Code/User/settings.json` |
| **Linux** | `~/.config/Code/User/settings.json` |

### 🔧 詳細設定步驟

#### 步驟 1: 安裝 MCP 擴展
1. 打開 VSCode
2. 按 `Ctrl+Shift+X` 打開擴展面板
3. 搜尋 "Model Context Protocol" 或 "MCP"
4. 安裝官方 MCP 擴展

#### 步驟 2: 編輯 settings.json
按 `Ctrl+Shift+P`，輸入 "Preferences: Open Settings (JSON)"：

```json
{
  "mcp.servers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "env": {
        "OPENAI_API_KEY": "你的_OPENAI_金鑰"
      }
    },
    "vibecoding-code-generator": {
      "command": "node", 
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/code-generator/index.js"],
      "env": {
        "OPENAI_API_KEY": "你的_OPENAI_金鑰"
      }
    },
    "vibecoding-dependency-tracker": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/dependency-tracker/index.js"]
    },
    "vibecoding-test-validator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/test-validator/index.js"]
    },
    "vibecoding-doc-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/doc-generator/index.js"]
    },
    "vibecoding-deployment-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/deployment-manager/index.js"]
    }
  },
  
  "vibecoding.vscode.enabled": true,
  "vibecoding.vscode.autoTrigger": true,
  "vibecoding.vscode.inlineCompletions": true
}
```

---

## 🔧 其他 MCP Host 設定

### 🌟 Cline / Continue

#### 設定檔位置
```
專案根目錄/.cline_mcp_config.json
```

#### 設定內容
```json
{
  "mcpServers": {
    "vibecoding-context-manager": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js"],
      "capabilities": {
        "conversation": true,
        "codeGeneration": true,
        "testing": true
      }
    },
    "vibecoding-code-generator": {
      "command": "node",
      "args": ["/path/to/your/vibeCoding-template/dist/vibe-services/code-generator/index.js"]
    }
  }
}
```

### 🔨 WebStorm / IntelliJ

#### 設定位置
```
IDE Settings > Tools > External Tools
```

#### 新增外部工具
- **Name**: VibeCoding Context Manager
- **Program**: `node`
- **Arguments**: `/path/to/your/vibeCoding-template/dist/vibe-services/context-manager/index.js`
- **Working Directory**: `$ProjectFileDir$`

### 🌐 Open WebUI / 其他 MCP 兼容工具

#### 通用 MCP 設定格式
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

---

## ⚙️ 客製化設定選項

### 🎯 AI 提供者設定

#### 基本 AI 設定
```json
{
  "vibecoding.ai": {
    "defaultProvider": "cursor",              // "cursor" | "openai" | "anthropic" | "gemini"
    "fallbackProvider": "template",          // 當 AI 不可用時的備用方案
    "model": "gpt-4",                        // 模型名稱
    "temperature": 0.7,                      // 創意度 (0-1)
    "maxTokens": 4000,                       // 最大 token 數
    "timeout": 30000                         // 超時時間 (毫秒)
  }
}
```

#### 多提供者設定
```json
{
  "vibecoding.ai.providers": {
    "openai": {
      "model": "gpt-4",
      "temperature": 0.7,
      "maxTokens": 4000
    },
    "anthropic": {
      "model": "claude-3-sonnet",
      "temperature": 0.6,
      "maxTokens": 8000
    },
    "cursor": {
      "useBuiltin": true,
      "fallbackToExternal": false
    }
  }
}
```

### 🔄 工作流程客製化

#### 開發階段設定
```json
{
  "vibecoding.workflow": {
    "phases": [
      "discovery",
      "design", 
      "implementation",
      "testing",
      "deployment"
    ],
    "autoPhaseDetection": true,
    "phaseTransitionPrompts": true,
    "milestoneTracking": true
  }
}
```

#### 代碼生成偏好
```json
{
  "vibecoding.codeGeneration": {
    "style": "functional",                   // "functional" | "oop" | "mixed"
    "includeTypes": true,                    // TypeScript 類型註解
    "includeComments": true,                 // 包含註解
    "includeTests": "auto",                  // "always" | "never" | "auto"
    "errorHandling": "comprehensive",        // "basic" | "comprehensive"
    "optimization": "readability"           // "performance" | "readability" | "size"
  }
}
```

---

## 🎯 實際使用範例

### 📋 完整開發流程示範

#### 1. 項目啟動 (使用 Context Manager)

**🆕 簡潔指令** (推薦)：
```bash
# 開始新會話
@vibe start "任務管理 API"

# 回答澄清問題
@vibe ask "主要解決團隊任務分配和進度追蹤的問題"

# 生成 PRD
@vibe prd
```

**📝 完整指令** (仍可使用)：
```bash
# 開始新會話
@vibecoding-context-manager start-session

# 開始項目澄清
@vibecoding-context-manager start-clarification
# 參數：
{
  "projectName": "任務管理 API",
  "initialDescription": "為團隊協作開發的 RESTful API"
}

# 回答澄清問題（重複 7 次）
@vibecoding-context-manager provide-clarification
# 參數：
{
  "projectId": "proj_abc123",
  "questionIndex": 0,
  "answer": "主要解決團隊任務分配和進度追蹤的問題"
}

# 生成 PRD
@vibecoding-context-manager generate-prd
# 參數：
{
  "projectId": "proj_abc123"
}
```

#### 2. 代碼開發 (使用 Code Generator)

**🆕 簡潔指令** (推薦)：
```bash
# 生成 API 代碼
@vibe api "用戶認證系統，包含註冊、登入、JWT token 驗證"

# 代碼審查
@vibe review "[剛才生成的代碼]"

# 生成測試
@vibe mock "[API 代碼]"
```

**📝 完整指令** (仍可使用)：
```bash
# 生成 API 代碼
@vibecoding-code-generator generate-code
# 參數：
{
  "requirements": "用戶認證系統，包含註冊、登入、JWT token 驗證",
  "language": "typescript",
  "framework": "express",
  "codeType": "api"
}

# 代碼審查
@vibecoding-code-generator code-review
# 參數：
{
  "code": "[剛才生成的代碼]",
  "focusAreas": ["security", "performance"]
}

# 生成測試
@vibecoding-code-generator generate-tests
# 參數：
{
  "code": "[API 代碼]",
  "testType": "unit",
  "framework": "jest"
}
```

#### 3. 質量保證 (使用 Test Validator 和 Dependency Tracker)

**🆕 簡潔指令** (推薦)：
```bash
# 執行測試
@vibe test

# 檢查測試覆蓋率
@vibe cover

# 安全掃描
@vibe scan
```

**📝 完整指令** (仍可使用)：
```bash
# 執行測試
@vibecoding-test-validator run-tests
# 參數：
{
  "projectPath": ".",
  "testType": "all"
}

# 檢查測試覆蓋率
@vibecoding-test-validator validate-coverage
# 參數：
{
  "projectPath": ".",
  "threshold": {
    "lines": 80,
    "functions": 85,
    "branches": 75,
    "statements": 80
  }
}

# 安全掃描
@vibecoding-dependency-tracker security-scan
# 參數：
{
  "projectPath": ".",
  "severity": "high",
  "includeDevDeps": false
}
```

#### 4. 文檔和部署 (使用 Doc Generator 和 Deployment Manager)

**🆕 簡潔指令** (推薦)：
```bash
# 生成 API 文檔
@vibe apidoc

# 更新 README
@vibe readme

# 部署到測試環境
@vibe deploy
```

**📝 完整指令** (仍可使用)：
```bash
# 生成 API 文檔
@vibecoding-doc-generator create-api-docs
# 參數：
{
  "projectPath": ".",
  "apiFormat": "openapi",
  "includeSchemas": true
}

# 更新 README
@vibecoding-doc-generator update-readme
# 參數：
{
  "projectPath": ".",
  "template": "detailed",
  "sections": ["installation", "usage", "api", "contributing"]
}

# 部署到測試環境
@vibecoding-deployment-manager deploy-service
# 參數：
{
  "projectPath": ".",
  "environment": "staging",
  "platform": "docker"
}
```

### 💡 常用工具組合

#### 快速原型開發

**🆕 簡潔指令** (推薦)：
```bash
# 1. 項目澄清
@vibe start "快速原型"

# 2. 生成核心代碼
@vibe code "基本 CRUD API"

# 3. 生成測試
@vibe mock "[生成的代碼]"

# 4. 快速部署
@vibe deploy
```

**📝 完整指令** (仍可使用)：
```bash
# 1. 項目澄清
@vibecoding-context-manager start-clarification --projectName "快速原型"

# 2. 生成核心代碼
@vibecoding-code-generator generate-code --requirements "基本 CRUD API" --language "typescript"

# 3. 生成測試
@vibecoding-code-generator generate-tests --code "[生成的代碼]" --testType "unit"

# 4. 快速部署
@vibecoding-deployment-manager deploy-service --environment "development"
```

#### 代碼質量檢查流程

**🆕 簡潔指令** (推薦)：
```bash
# 1. 代碼審查
@vibe review "[代碼內容]"

# 2. 安全掃描
@vibe scan

# 3. 測試覆蓋率檢查
@vibe cover
```

**📝 完整指令** (仍可使用)：
```bash
# 1. 代碼審查
@vibecoding-code-generator code-review --focusAreas "['security', 'performance']"

# 2. 安全掃描
@vibecoding-dependency-tracker security-scan --severity "moderate"

# 3. 測試覆蓋率檢查
@vibecoding-test-validator validate-coverage --threshold "{'lines': 80}"
```

---

## 🔍 故障排除

### ❌ 常見問題和解決方案

#### 問題 1: MCP 服務無法啟動
```bash
# 檢查 Node.js 版本 (必須 >= 18.0.0)
node --version

# 檢查服務檔案是否存在
ls -la /path/to/your/vibeCoding-template/dist/vibe-services/*/index.js

# 重新建構服務
cd /path/to/your/vibeCoding-template
npm run build
```

#### 問題 2: 路徑配置錯誤
**症狀**：服務無法找到或啟動失敗

**解決方案**：
```bash
# 1. 確認實際路徑
cd /path/to/your/vibeCoding-template
pwd

# 2. 檢查檔案權限
chmod +x dist/vibe-services/*/index.js

# 3. 測試單個服務
node dist/vibe-services/context-manager/index.js
```

#### 問題 3: API 金鑰問題
**症狀**：外部 AI 服務無法使用

**解決方案**：
```bash
# 測試 OpenAI 金鑰
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.openai.com/v1/models

# 測試 Anthropic 金鑰
curl -H "x-api-key: YOUR_API_KEY" https://api.anthropic.com/v1/models
```

#### 問題 4: 不同 MCP Host 的相容性問題

**Cursor IDE**：
- ✅ 完全支援，建議使用內建 LLM
- 🔧 如果有問題，檢查 settings.json 格式

**Claude Desktop**：
- ✅ 原生 MCP 支援
- 🔧 確保 claude_desktop_config.json 格式正確

**VSCode**：
- ⚠️ 需要安裝 MCP 擴展
- 🔧 檢查擴展是否正確載入

### 🔧 診斷工具

#### 自動診斷腳本
```bash
# 執行完整系統診斷
cd /path/to/your/vibeCoding-template
npm run test:prompts

# 檢查特定服務
npm run mcp:context-manager
```

#### 手動檢查清單
- [ ] Node.js >= 18.0.0
- [ ] 專案已正確建構 (`npm run build`)
- [ ] 服務檔案存在且可執行
- [ ] 路徑配置正確
- [ ] API 金鑰有效（如果使用外部服務）
- [ ] MCP Host 已重啟
- [ ] 防火牆未阻擋連接

### 📞 尋求協助

如果還是無法解決問題：

1. **📋 收集資訊**
   ```bash
   # 生成診斷報告
   cd /path/to/your/vibeCoding-template
   npm run test:prompts > debug.txt 2>&1
   ```

2. **📚 查看文檔**
   - [完整工具參考](VIBECODING_TOOLS_REFERENCE.md)
   - [Cursor 專用說明](CURSOR_MCP_CLARIFICATION.md)
   - [MCP 設定指南](MCP_SETUP_GUIDE.md)

3. **🐛 提交 Issue**
   - 前往：https://github.com/vibecoding/issues
   - 附上 debug.txt 檔案
   - 說明你的作業系統和 MCP Host 版本

---

## 🎉 設定完成檢查

執行以下步驟確認設定成功：

### ✅ 基本功能測試
```bash
# 1. 測試 Context Manager
@vibecoding-context-manager start-session

# 2. 測試 Code Generator  
@vibecoding-code-generator generate-code --requirements "Hello World" --language "javascript"

# 3. 測試 AI 洞察
@vibecoding-context-manager get-ai-insight --query "如何開始一個新專案？"
```

### ✅ 完整流程測試
```bash
# 1. 項目澄清
@vibecoding-context-manager start-clarification --projectName "測試專案"

# 2. 代碼生成
@vibecoding-code-generator generate-code --requirements "簡單 API" --language "typescript"

# 3. 測試生成
@vibecoding-code-generator generate-tests --code "[生成的代碼]" --testType "unit"
```

看到所有測試都返回正確回應，就表示設定成功！🎊

---

**🚀 現在你可以開始享受 AI 驅動的對話式開發體驗了！**

### 📚 下一步推薦閱讀
- **[完整工具參考手冊](VIBECODING_TOOLS_REFERENCE.md)** - 了解所有可用工具
- **[Cursor MCP 專用說明](CURSOR_MCP_CLARIFICATION.md)** - Cursor 用戶必讀
- **[MCP 設定指南](MCP_SETUP_GUIDE.md)** - 深度配置說明 