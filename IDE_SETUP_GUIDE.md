# 🎯 VibeCoding IDE 設定完全指南（新手版）

> **超詳細設定指南，讓任何人都能輕鬆設定 VibeCoding 到各種 IDE**

## 📋 目錄
- [🚀 快速設定（推薦）](#-快速設定推薦)
- [💻 Cursor IDE 設定](#-cursor-ide-設定)
- [🤖 Claude Desktop 設定](#-claude-desktop-設定)
- [📝 VSCode 設定](#-vscode-設定)
- [🔧 其他 IDE 設定](#-其他-ide-設定)
- [⚙️ 客製化設定選項](#-客製化設定選項)
- [🔍 故障排除](#-故障排除)

---

## 🚀 快速設定（推薦）

### ⚡ 超級簡單：一鍵設定 ⭐ **強烈推薦**
```bash
# 在 vibeCoding-template 目錄中執行
npm run setup

# 或使用 npx（任何地方都能執行）
npx vibecoding-system setup --auto-detect-ide
```

**這個腳本會自動：**
- ✅ 檢查系統需求
- ✅ 偵測已安裝的 IDE
- ✅ 安裝 VibeCoding
- ✅ 自動配置所有找到的 IDE
- ✅ 驗證安裝是否成功

### 🚨 如果自動設定失敗

#### 快速檢查清單
```bash
# 1. 檢查 Node.js 版本
node --version
# 必須 >= 18.0.0

# 2. 檢查 npm 權限
npm config get prefix
# 如果有權限問題，設定：npm config set prefix ~/.npm-global

# 3. 清除緩存
npm cache clean --force

# 4. 重新安裝
npm install -g vibecoding-system
```

### 方法二：手動設定（如果自動設定失敗）
繼續往下看各 IDE 的詳細設定步驟 👇

---

## 💻 Cursor IDE 設定

### 📍 設定檔位置

#### Windows
```
C:\Users\你的用戶名\AppData\Roaming\Cursor\User\settings.json
```

#### macOS  
```
~/Library/Application Support/Cursor/User/settings.json
```

#### Linux
```
~/.config/Cursor/User/settings.json
```

### 🔧 詳細設定步驟

#### 步驟 1: 找到設定檔
```bash
# Windows PowerShell
explorer "$env:APPDATA\Cursor\User"

# macOS Terminal
open "~/Library/Application Support/Cursor/User"

# Linux Terminal
nautilus ~/.config/Cursor/User
```

#### 步驟 2: 編輯 settings.json
用任何文字編輯器打開 `settings.json`，加入以下設定：

> **💡 重要提醒：** Cursor 有內建 LLM，大部分情況下不需要額外的 API 金鑰！詳見 [Cursor MCP 說明](CURSOR_MCP_CLARIFICATION.md)

**🔥 最簡設定（推薦新手 - 無需 API 金鑰）：**
```json
{
  // 現有設定保持不變...
  
  // VibeCoding MCP 設定 - 使用 Cursor 內建 LLM
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"]
      // 注意：沒有 env 區塊！
    }
  },
  
  // VibeCoding 基本設定
  "vibecoding.enabled": true,
  "vibecoding.defaultProvider": "cursor",  // 使用 Cursor 內建 LLM
  "vibecoding.conversationMode": true
}
```

**⚙️ 進階設定（可選 - 需要 API 金鑰）：**
```json
{
  // 現有設定保持不變...
  
  // VibeCoding MCP 設定 - 使用外部 API
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"],
      "env": {
        "OPENAI_API_KEY": "你的_OPENAI_金鑰",
        "ANTHROPIC_API_KEY": "你的_ANTHROPIC_金鑰"
      }
    }
  },
  
  // VibeCoding 自動完成設定
  "vibecoding.enabled": true,
  "vibecoding.autoTrigger": true,
  "vibecoding.conversationMode": true,
  
  // AI 提供者偏好設定
  "vibecoding.defaultProvider": "openai",
  "vibecoding.model": "gpt-4",
  "vibecoding.temperature": 0.7,
  
  // 開發工作流設定
  "vibecoding.workflow.autoPhaseDetection": true,
  "vibecoding.workflow.enableSmartSuggestions": true,
  
  // UI 客製化
  "vibecoding.ui.showProgressBar": true,
  "vibecoding.ui.enableNotifications": true,
  "vibecoding.ui.theme": "auto"
}
```

#### 步驟 3: 重啟 Cursor
關閉並重新打開 Cursor IDE

#### 步驟 4: 驗證設定
```bash
# 在 Cursor 的終端機中執行
npx vibecoding-system status
```

### 🎨 Cursor 專用客製化設定

#### AI 對話面板設定
```json
{
  "vibecoding.cursor.chatPanel": {
    "position": "sidebar",        // "sidebar" | "panel" | "floating"
    "width": 400,
    "autoFocus": true,
    "showHistory": true,
    "maxHistoryItems": 50
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
    "includeComments": true,
    "generateTests": true
  }
}
```

#### 快捷鍵設定
在 Cursor 中按 `Ctrl+Shift+P` (或 `Cmd+Shift+P`)，搜尋 "Preferences: Open Keyboard Shortcuts (JSON)"：

```json
[
  {
    "key": "ctrl+shift+v",
    "command": "vibecoding.startConversation",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+g",
    "command": "vibecoding.generateCode",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+t",
    "command": "vibecoding.generateTests",
    "when": "editorTextFocus"
  }
]
```

---

## 🤖 Claude Desktop 設定

### 📍 設定檔位置

#### Windows
```
C:\Users\你的用戶名\AppData\Roaming\Claude\claude_desktop_config.json
```

#### macOS
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Linux
```
~/.config/claude/claude_desktop_config.json
```

### 🔧 詳細設定步驟

#### 步驟 1: 創建或編輯設定檔
```bash
# Windows PowerShell
notepad "$env:APPDATA\Claude\claude_desktop_config.json"

# macOS Terminal  
open -a TextEdit "~/Library/Application Support/Claude/claude_desktop_config.json"

# Linux Terminal
gedit ~/.config/claude/claude_desktop_config.json
```

#### 步驟 2: 加入 VibeCoding 設定
```json
{
  "mcpServers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"],
      "env": {
        "OPENAI_API_KEY": "你的_OPENAI_金鑰",
        "ANTHROPIC_API_KEY": "你的_ANTHROPIC_金鑰",
        "VIBECODING_LOG_LEVEL": "info"
      }
    },
    "vibecoding-context": {
      "command": "npx",
      "args": ["vibecoding-system", "context-manager"],
      "env": {
        "CONTEXT_PERSISTENCE": "true",
        "MAX_CONTEXT_SIZE": "10000"
      }
    }
  },
  
  "vibecoding": {
    "conversationMode": "advanced",
    "autoSaveContext": true,
    "enableSmartSuggestions": true,
    "ui": {
      "showTypeHints": true,
      "enableAutoComplete": true
    }
  }
}
```

#### 步驟 3: 重啟 Claude Desktop

#### 步驟 4: 測試連接
在 Claude Desktop 中輸入：
```
請協助我使用 VibeCoding 創建一個新專案
```

---

## 📝 VSCode 設定

### 📍 設定檔位置

#### Windows
```
C:\Users\你的用戶名\AppData\Roaming\Code\User\settings.json
```

#### macOS
```
~/Library/Application Support/Code/User/settings.json
```

#### Linux
```
~/.config/Code/User/settings.json
```

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
  // 現有設定...
  
  // MCP 伺服器設定
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"],
      "env": {
        "OPENAI_API_KEY": "你的_OPENAI_金鑰"
      }
    }
  },
  
  // VibeCoding 專用設定
  "vibecoding.vscode.enabled": true,
  "vibecoding.vscode.autoTrigger": true,
  "vibecoding.vscode.inlineCompletions": true,
  
  // 工作區設定
  "vibecoding.workspace.autoDetectPhase": true,
  "vibecoding.workspace.projectStructure": "auto",
  
  // AI 協助設定
  "vibecoding.ai.contextAware": true,
  "vibecoding.ai.codeAnalysis": true,
  "vibecoding.ai.smartRefactoring": true
}
```

#### 步驟 3: 工作區設定（可選）
在你的專案根目錄創建 `.vscode/settings.json`：

```json
{
  "vibecoding.project.name": "我的專案",
  "vibecoding.project.type": "web-application",
  "vibecoding.project.framework": "react",
  "vibecoding.project.database": "postgresql",
  
  "vibecoding.development.phase": "implementation",
  "vibecoding.development.autoCommit": false,
  "vibecoding.development.generateDocs": true,
  
  "vibecoding.testing.autoGenerate": true,
  "vibecoding.testing.framework": "jest",
  "vibecoding.testing.coverage": true
}
```

---

## 🔧 其他 IDE 設定

### 🌟 Cline / Continue

#### 設定檔位置
```
專案根目錄/.cline_mcp_config.json
```

#### 設定內容
```json
{
  "mcpServers": {
    "vibecoding": {
      "command": "vibecoding-system",
      "args": ["mcp"],
      "capabilities": {
        "conversation": true,
        "codeGeneration": true,
        "testing": true
      }
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
- **Name**: VibeCoding Chat
- **Program**: `npx`
- **Arguments**: `vibecoding-system chat`
- **Working Directory**: `$ProjectFileDir$`

### 🌐 在線編輯器（Replit, CodePen 等）

#### 環境變數設定
```bash
export VIBECODING_MODE=online
export VIBECODING_API_ENDPOINT=https://api.vibecoding.dev
export OPENAI_API_KEY=你的金鑰
```

---

## ⚙️ 客製化設定選項

### 🎯 核心設定選項

#### AI 提供者設定
```json
{
  "vibecoding.ai": {
    "defaultProvider": "openai",           // "openai" | "anthropic" | "gemini" | "local"
    "fallbackProvider": "template",       // 當 AI 不可用時的備用方案
    "model": "gpt-4",                     // 模型名稱
    "temperature": 0.7,                   // 創意度 (0-1)
    "maxTokens": 4000,                    // 最大 token 數
    "timeout": 30000                      // 超時時間 (毫秒)
  }
}
```

#### 對話行為設定
```json
{
  "vibecoding.conversation": {
    "mode": "interactive",                // "interactive" | "batch" | "auto"
    "language": "繁體中文",               // 對話語言
    "personality": "professional",        // "friendly" | "professional" | "concise"
    "contextMemory": 10,                  // 記住多少輪對話
    "autoSuggestions": true,              // 自動建議
    "explainCode": true                   // 解釋生成的代碼
  }
}
```

#### 開發工作流設定
```json
{
  "vibecoding.workflow": {
    "phases": [                           // 自定義開發階段
      "discovery",
      "design", 
      "implementation",
      "testing",
      "deployment"
    ],
    "autoPhaseDetection": true,           // 自動偵測當前階段
    "phaseTransitionPrompts": true,       // 階段轉換提示
    "milestoneTracking": true             // 里程碑追蹤
  }
}
```

### 🎨 UI/UX 客製化

#### 介面主題設定
```json
{
  "vibecoding.ui": {
    "theme": "auto",                      // "light" | "dark" | "auto"
    "colorScheme": "default",             // "default" | "vibrant" | "minimal"
    "fontSize": 14,                       // 字體大小
    "showAnimations": true,               // 顯示動畫
    "compactMode": false                  // 緊湊模式
  }
}
```

#### 通知設定
```json
{
  "vibecoding.notifications": {
    "enabled": true,
    "sound": true,
    "desktop": true,
    "progressUpdates": true,
    "errorAlerts": true,
    "successMessages": true
  }
}
```

### 🔧 進階功能設定

#### 代碼生成偏好
```json
{
  "vibecoding.codeGeneration": {
    "style": "functional",               // "functional" | "oop" | "mixed"
    "includeTypes": true,                // TypeScript 類型註解
    "includeComments": true,             // 包含註解
    "includeTests": "auto",              // "always" | "never" | "auto"
    "errorHandling": "comprehensive",    // "basic" | "comprehensive"
    "optimization": "readability"       // "performance" | "readability" | "size"
  }
}
```

#### 測試設定
```json
{
  "vibecoding.testing": {
    "framework": "jest",                 // "jest" | "mocha" | "vitest"
    "testStyle": "tdd",                  // "tdd" | "bdd"
    "coverage": {
      "enabled": true,
      "threshold": 80,                   // 覆蓋率門檻
      "includeE2E": true
    },
    "autoRun": "onSave"                  // "onSave" | "onGenerate" | "manual"
  }
}
```

#### 部署設定
```json
{
  "vibecoding.deployment": {
    "platform": "docker",               // "docker" | "kubernetes" | "vercel" | "aws"
    "environment": "production",         // "development" | "staging" | "production"
    "autoOptimize": true,                // 自動優化
    "includeMonitoring": true,           // 包含監控
    "cicd": "github-actions"             // "github-actions" | "gitlab-ci" | "jenkins"
  }
}
```

---

## 🔍 故障排除

### ❌ 常見問題

#### 問題 1: MCP 伺服器無法啟動
```bash
# 檢查 Node.js 版本
node --version
# 應該 >= 18.0.0

# 檢查 VibeCoding 安裝
npx vibecoding-system --version

# 重新安裝
npm uninstall -g vibecoding-system
npm install -g vibecoding-system
```

#### 問題 2: API 金鑰無效
```bash
# 驗證 OpenAI 金鑰
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.openai.com/v1/models

# 驗證 Anthropic 金鑰  
curl -H "x-api-key: YOUR_API_KEY" \
  https://api.anthropic.com/v1/models
```

#### 問題 3: 設定檔找不到
```bash
# 手動創建設定檔目錄
# Windows
mkdir "$env:APPDATA\Cursor\User" -Force

# macOS/Linux
mkdir -p ~/.config/Cursor/User
```

#### 問題 4: IDE 無法連接到 VibeCoding
```bash
# 檢查 MCP 服務狀態
npx vibecoding-system service status

# 重啟所有服務
npx vibecoding-system service restart --all

# 檢查埠號衝突
netstat -an | grep 3000
```

### 🔧 診斷工具

#### 自動診斷
```bash
# 執行完整系統診斷
npx vibecoding-system diagnose

# 檢查特定 IDE 整合
npx vibecoding-system diagnose --ide cursor

# 生成診斷報告
npx vibecoding-system diagnose --output report.txt
```

#### 手動檢查清單
- [ ] Node.js >= 18.0.0
- [ ] npm 套件已正確安裝
- [ ] API 金鑰已設定且有效
- [ ] 設定檔位置正確
- [ ] IDE 已重啟
- [ ] 防火牆未阻擋連接
- [ ] 網路連接正常

### 📞 尋求協助

如果還是無法解決問題：

1. **📋 收集資訊**
   ```bash
   npx vibecoding-system debug-info > debug.txt
   ```

2. **🐛 提交 Issue**
   - 前往：https://github.com/vibecoding/issues
   - 附上 debug.txt 檔案
   - 說明你的操作系統和 IDE 版本

3. **💬 社群支援**
   - Discord：https://discord.gg/vibecoding
   - 論壇：https://community.vibecoding.dev

---

## 🎉 設定完成檢查

執行以下命令確認設定成功：

```bash
# 1. 檢查系統狀態
npx vibecoding-system status

# 2. 測試 AI 連接
npx vibecoding-system test-ai

# 3. 驗證 IDE 整合
npx vibecoding-system test-ide --ide cursor

# 4. 創建測試專案
npx vibecoding-system init --name "test-project" --demo
```

看到全部 ✅ 綠色勾號就表示設定成功！🎊

---

**🚀 現在你可以開始享受 AI 驅動的對話式開發體驗了！** 