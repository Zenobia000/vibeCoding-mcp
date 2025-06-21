# 🎯 Cursor + VibeCoding MCP：API 金鑰需求說明

## 📋 **核心問題解答**

**Q: 使用 Cursor 進行 VibeCoding MCP 服務時，需要額外的 LLM 供應商金鑰嗎？**

**A: 大部分情況下不需要！Cursor 內建的 LLM 就足夠了。**

---

## 🤖 **兩種運作模式**

### ✅ **模式一：Cursor 內建 LLM（推薦）**

```json
{
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"]
      // 注意：沒有 env 區塊，不需要額外 API 金鑰
    }
  },
  
  "vibecoding.defaultProvider": "cursor",  // 使用 Cursor 內建 LLM
  "vibecoding.enabled": true,
  "vibecoding.conversationMode": true
}
```

**🎯 工作原理：**
- Cursor 透過 MCP 協議調用 VibeCoding 服務
- VibeCoding 接收 Cursor 的指令和上下文
- 回應透過 MCP 返回給 Cursor
- Cursor 的內建 LLM 處理實際的 AI 生成

### ⚙️ **模式二：外部 LLM API（可選）**

```json
{
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"],
      "env": {
        "OPENAI_API_KEY": "你的金鑰",
        "VIBECODING_PROVIDER": "openai"
      }
    }
  },
  
  "vibecoding.defaultProvider": "openai"  // 直接調用 OpenAI
}
```

**🎯 使用情境：**
- 需要特定的 AI 模型（如 GPT-4 Turbo）
- 想要獨立的 API 配額控制
- 需要特殊的模型參數調整

---

## 🔧 **推薦的 Cursor 設定**

### 📝 **最簡設定（無需 API 金鑰）**

```json
{
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"]
    }
  },
  
  // VibeCoding 基本設定
  "vibecoding.enabled": true,
  "vibecoding.conversationMode": true,
  "vibecoding.defaultProvider": "cursor",
  
  // 工作流程設定
  "vibecoding.workflow.autoPhaseDetection": true,
  "vibecoding.workflow.enableSmartSuggestions": true,
  
  // UI 設定
  "vibecoding.ui.showProgressBar": true,
  "vibecoding.ui.theme": "auto"
}
```

### 🎨 **Cursor 專用客製化**

```json
{
  // Cursor 特有的 VibeCoding 整合
  "vibecoding.cursor": {
    "useBuiltinLLM": true,           // 使用 Cursor 內建 LLM
    "contextSharing": true,          // 與 Cursor 共享上下文
    "inlineGeneration": true,        // 內聯代碼生成
    "chatIntegration": true          // 整合到 Cursor 聊天面板
  },
  
  // 代碼生成偏好
  "vibecoding.cursor.codeGeneration": {
    "autoImports": true,
    "useTypeScript": true,
    "preferFunctionalComponents": true,
    "generateTests": true
  }
}
```

---

## 🎯 **何時需要 API 金鑰？**

### ✅ **不需要 API 金鑰的情況**
- ✅ 基本對話式開發
- ✅ 代碼生成和重構
- ✅ 專案架構建議
- ✅ 測試生成
- ✅ 文檔生成
- ✅ 使用 Cursor 內建的模型就足夠

### 🔑 **需要 API 金鑰的情況**
- 🎯 想使用特定的 AI 模型（如 Claude-3-Opus）
- 🎯 需要更高的 API 配額限制
- 🎯 想要獨立的成本控制
- 🎯 需要特殊的模型參數調整
- 🎯 企業級的 API 使用政策

---

## 📊 **性能比較**

| 模式 | 延遲 | 成本 | 模型選擇 | 設定複雜度 |
|------|------|------|----------|-----------|
| **Cursor 內建** | 🟢 低 | 🟢 包含在 Cursor 訂閱 | 🟡 受限於 Cursor | 🟢 簡單 |
| **外部 API** | 🟡 中等 | 🟡 額外費用 | 🟢 完全自由 | 🟡 中等 |

---

## 🚀 **實際設定步驟**

### 步驟 1: 最簡設定（推薦新手）

1. **編輯 Cursor settings.json**:
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

2. **重啟 Cursor**

3. **測試功能**:
   - 在聊天中輸入：`@vibecoding 幫我創建一個 React 組件`
   - 應該能正常工作，無需任何 API 金鑰

### 步驟 2: 如果想使用外部 API（可選）

1. **取得 API 金鑰**（如 OpenAI）

2. **更新設定**:
```json
{
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"],
      "env": {
        "OPENAI_API_KEY": "你的實際金鑰",
        "VIBECODING_PROVIDER": "openai"
      }
    }
  },
  "vibecoding.defaultProvider": "openai"
}
```

---

## 🔍 **如何確認當前使用的模式？**

### 檢查命令
```bash
# 檢查 VibeCoding 狀態
npx vibecoding-system status

# 檢查 AI 提供者設定
npx vibecoding-system config show --provider
```

### 預期輸出
```bash
# Cursor 內建模式
🤖 AI Provider: cursor (built-in)
📊 Status: Ready
🔑 API Keys: Not required

# 外部 API 模式  
🤖 AI Provider: openai
📊 Status: Connected
🔑 API Keys: ✅ Valid
```

---

## 💡 **最佳實踐建議**

### 🥇 **推薦給新手**
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

**優點：**
- ✅ 設定簡單，無需管理 API 金鑰
- ✅ 成本包含在 Cursor 訂閱中
- ✅ 與 Cursor 整合度最高
- ✅ 延遲最低

### 🥈 **推薦給進階用戶**
```json
{
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"],
      "env": {
        "OPENAI_API_KEY": "${OPENAI_API_KEY}",
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}",
        "VIBECODING_PROVIDER": "auto"  // 自動選擇最佳提供者
      }
    }
  },
  "vibecoding.defaultProvider": "auto",
  "vibecoding.fallbackProvider": "cursor"
}
```

**優點：**
- ✅ 最大靈活性
- ✅ 可以使用最新的 AI 模型
- ✅ 有 Cursor 作為備用方案
- ✅ 成本和性能可控

---

## 🎉 **總結**

### 🔥 **簡單答案**
**不需要！** 使用 Cursor 內建的 LLM 就能充分體驗 VibeCoding 的所有功能。

### 🎯 **完整答案**
- **新手**: 直接用 Cursor 內建 LLM，無需額外設定
- **進階**: 可選擇外部 API 獲得更多控制權
- **企業**: 建議使用外部 API 以符合政策要求

### 📝 **設定檔最簡版本**
```json
{
  "mcp.servers": {
    "vibecoding": {
      "command": "npx",
      "args": ["vibecoding-system", "mcp"]
    }
  },
  "vibecoding.enabled": true
}
```

**🚀 就這樣！重啟 Cursor 就能開始使用了！** 