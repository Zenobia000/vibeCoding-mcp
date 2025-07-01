# VibeCoding MCP 工具完整參考手冊

## 📋 目錄

1. [工具總覽](#工具總覽)
2. [簡潔指令對照表](#簡潔指令對照表)  
3. [Context Manager - 專案上下文管理](#context-manager---專案上下文管理)
4. [Code Generator - 代碼生成器](#code-generator---代碼生成器)
5. [Test Validator - 測試驗證器](#test-validator---測試驗證器)
6. [Dependency Tracker - 依賴追蹤器](#dependency-tracker---依賴追蹤器)
7. [Doc Generator - 文檔生成器](#doc-generator---文檔生成器)
8. [Deployment Manager - 部署管理器](#deployment-manager---部署管理器)
9. [完整工作流程範例](#完整工作流程範例)

---

## 🛠️ 工具總覽

VibeCoding MCP 提供 6 個核心 AI 工具，涵蓋完整的軟體開發流程：

| 工具 | 功能 | 簡潔指令 |
|------|------|----------|
| **Context Manager** | 專案澄清、需求管理 | `@vibe start`, `@vibe prd` |
| **Code Generator** | 智能代碼生成 | `@vibe code`, `@vibe comp` |
| **Test Validator** | 測試執行與驗證 | `@vibe test`, `@vibe cover` |
| **Dependency Tracker** | 依賴分析與安全掃描 | `@vibe deps`, `@vibe scan` |
| **Doc Generator** | 文檔自動生成 | `@vibe doc`, `@vibe readme` |
| **Deployment Manager** | 部署與監控 | `@vibe deploy`, `@vibe monitor` |

---

## 🚀 簡潔指令對照表

### 🎯 開發階段對照

| 階段 | 簡潔指令 | 完整指令 | 說明 |
|------|----------|----------|------|
| **Discovery** | `@vibe start "專案名稱"` | `@vibecoding-context-manager start-clarification` | 開始專案澄清 |
| | `@vibe ask "回答內容"` | `@vibecoding-context-manager provide-clarification` | 回答澄清問題 |
| | `@vibe prd` | `@vibecoding-context-manager generate-prd` | 生成產品需求文檔 |
| **Design** | `@vibe plan` | `@vibecoding-context-manager generate-impl-plan` | 生成實施計劃 |
| | `@vibe arch "架構描述"` | `@vibecoding-code-generator generate-code --codeType="service"` | 生成系統架構 |
| **Implementation** | `@vibe code "功能描述"` | `@vibecoding-code-generator generate-code` | 生成代碼 |
| | `@vibe comp "組件名稱"` | `@vibecoding-code-generator generate-code --codeType="component"` | 生成組件 |
| | `@vibe api "API 描述"` | `@vibecoding-code-generator generate-code --codeType="api"` | 生成 API |
| **Validation** | `@vibe test` | `@vibecoding-test-validator run-tests` | 執行測試 |
| | `@vibe cover` | `@vibecoding-test-validator validate-coverage` | 檢查覆蓋率 |
| | `@vibe perf` | `@vibecoding-test-validator performance-test` | 性能測試 |
| **Deployment** | `@vibe deploy` | `@vibecoding-deployment-manager deploy-service` | 部署應用 |
| | `@vibe monitor` | `@vibecoding-deployment-manager setup-monitoring` | 設定監控 |

---

## 🎯 Context Manager - 專案上下文管理

### 功能概述
管理專案的生命週期，從需求澄清到文檔生成，**現已簡化為基於工作目錄的上下文管理**。

### 🛠️ 可用工具

#### 1. start-clarification - 開始專案澄清
**功能**: 啟動結構化的專案需求澄清流程
**簡潔指令**: `@vibe start "專案名稱"`

**完整指令格式**:
```json
{
  "tool": "vibecoding-context-manager",
  "function": "start-clarification",
  "parameters": {
    "projectName": "string (必填)",
    "initialDescription": "string (可選)"
  }
}
```

**使用範例**:
```bash
# 簡潔指令
@vibe start "個人理財規劃工具"

# 完整指令  
@vibecoding-context-manager start-clarification --projectName "個人理財規劃工具" --initialDescription "幫助用戶制定投資策略"
```

#### 2. provide-clarification - 提供澄清回答
**功能**: 回答 AI 提出的澄清問題
**簡潔指令**: `@vibe ask "回答內容"`

**完整指令格式**:
```json
{
  "tool": "vibecoding-context-manager", 
  "function": "provide-clarification",
  "parameters": {
    "questionIndex": "number (必填)",
    "answer": "string (必填)"
  }
}
```

**使用範例**:
```bash
# 簡潔指令
@vibe ask "主要解決個人投資決策困難的問題"

# 完整指令
@vibecoding-context-manager provide-clarification --questionIndex 0 --answer "主要解決個人投資決策困難的問題"
```

#### 3. generate-prd - 生成產品需求文檔
**功能**: 根據澄清結果生成完整的 PRD
**簡潔指令**: `@vibe prd`

**完整指令格式**:
```json
{
  "tool": "vibecoding-context-manager",
  "function": "generate-prd",
  "parameters": {}
}
```

**使用範例**:
```bash
# 簡潔指令
@vibe prd

# 完整指令
@vibecoding-context-manager generate-prd
```

#### 4. generate-impl-plan - 生成實施計劃
**功能**: 生成詳細的技術實施計劃
**簡潔指令**: `@vibe plan`

**完整指令格式**:
```json
{
  "tool": "vibecoding-context-manager",
  "function": "generate-impl-plan", 
  "parameters": {}
}
```

**使用範例**:
```bash
# 簡潔指令
@vibe plan

# 完整指令
@vibecoding-context-manager generate-impl-plan
```

### 📁 輸出文件對應

| 指令 | 輸出位置 | 說明 |
|------|----------|------|
| `start-clarification` | `.vibecoding/context/current-project.json` | 專案上下文狀態 |
| `provide-clarification` | `.vibecoding/context/current-project.json` | 澄清回答記錄 |
| `generate-prd` | `0_discovery/requirements/PRODUCT_REQUIREMENTS_DOCUMENT.md` | 產品需求文檔 |
| `generate-impl-plan` | `1_design/IMPLEMENTATION_PLAN.md` | 技術實施計劃 |

---

## 💻 Code Generator - 代碼生成器

### 功能概述
基於需求和規格，智能生成高品質的代碼。

### 🛠️ 可用工具

#### 1. generate-code - 生成代碼
**功能**: 根據需求生成各種類型的代碼
**簡潔指令**: `@vibe code "功能描述"`

**完整指令格式**:
```json
{
  "tool": "vibecoding-code-generator",
  "function": "generate-code", 
  "parameters": {
    "requirements": "string (必填)",
    "language": "string (必填)",
    "codeType": "component|service|api|utility|model (可選)",
    "framework": "string (可選)"
  }
}
```

**使用範例**:
```bash
# 簡潔指令
@vibe code "用戶登入功能，包含 JWT 認證"
@vibe comp "用戶個人資料編輯頁面"
@vibe api "用戶管理 REST API"

# 完整指令
@vibecoding-code-generator generate-code --requirements "用戶登入功能" --language "typescript" --codeType "component" --framework "react"
```

#### 2. refactor-code - 代碼重構
**功能**: 優化現有代碼的品質和性能
**簡潔指令**: `@vibe refactor "重構目標"`

#### 3. generate-tests - 生成測試
**功能**: 為現有代碼生成測試用例
**簡潔指令**: `@vibe gentest "測試類型"`

#### 4. code-review - 代碼審查
**功能**: 自動化代碼審查和建議
**簡潔指令**: `@vibe review "代碼內容"`

---

## 🧪 Test Validator - 測試驗證器

### 功能概述
執行各種測試並驗證代碼品質。

### 🛠️ 可用工具

#### 1. run-tests - 執行測試
**功能**: 執行指定類型的測試套件
**簡潔指令**: `@vibe test`

**完整指令格式**:
```json
{
  "tool": "vibecoding-test-validator",
  "function": "run-tests",
  "parameters": {
    "projectPath": "string (必填)",
    "testType": "unit|integration|e2e|all (可選)", 
    "pattern": "string (可選)",
    "watch": "boolean (可選)"
  }
}
```

#### 2. validate-coverage - 驗證測試覆蓋率
**功能**: 檢查並驗證測試覆蓋率
**簡潔指令**: `@vibe cover`

#### 3. performance-test - 性能測試
**功能**: 執行性能測試和基準測試
**簡潔指令**: `@vibe perf`

---

## 📦 Dependency Tracker - 依賴追蹤器

### 功能概述
分析專案依賴關係並進行安全掃描。

### 🛠️ 可用工具

#### 1. analyze-dependencies - 分析依賴
**功能**: 分析專案的依賴關係
**簡潔指令**: `@vibe deps`

#### 2. security-scan - 安全掃描
**功能**: 掃描依賴的安全漏洞
**簡潔指令**: `@vibe scan`

---

## 📚 Doc Generator - 文檔生成器

### 功能概述
從代碼和註解自動生成各種文檔。

### 🛠️ 可用工具

#### 1. generate-docs - 生成文檔
**功能**: 生成完整的專案文檔
**簡潔指令**: `@vibe doc`

#### 2. update-readme - 更新 README
**功能**: 更新或生成 README 文件
**簡潔指令**: `@vibe readme`

---

## 🚀 Deployment Manager - 部署管理器

### 功能概述
管理應用的部署、監控和維運。

### 🛠️ 可用工具

#### 1. deploy-service - 部署服務
**功能**: 部署應用到指定環境
**簡潔指令**: `@vibe deploy`

#### 2. setup-monitoring - 設定監控
**功能**: 配置監控和日誌系統
**簡潔指令**: `@vibe monitor`

---

## 🎯 完整工作流程範例

### Discovery Phase - 需求發現
```bash
# 開始專案澄清
@vibe start "個人理財規劃工具"

# 回答 7 個澄清問題
@vibe ask "主要解決個人投資決策困難的問題"
# ... 繼續回答其他問題

# 生成 PRD
@vibe prd
```

### Design Phase - 系統設計  
```bash
# 生成實施計劃
@vibe plan

# 設計系統架構
@vibe arch "微服務架構，React + Node.js + PostgreSQL"

# 設計 API
@vibe api "用戶管理和投資組合管理 API"
```

### Implementation Phase - 代碼實現
```bash
# 生成核心代碼
@vibe code "用戶認證系統，支援 JWT"
@vibe comp "投資組合儀表板頁面"
@vibe api "投資建議推薦 API"

# 代碼審查
@vibe review "[您的代碼內容]"
```

### Validation Phase - 測試驗證
```bash
# 執行測試
@vibe test

# 檢查覆蓋率
@vibe cover

# 性能測試
@vibe perf

# 安全掃描
@vibe scan
```

### Deployment Phase - 部署上線
```bash
# 部署到測試環境
@vibe deploy

# 設定監控
@vibe monitor

# 生成文檔
@vibe doc
```

---

## 💡 最佳實踐

### 工作流程建議
1. **按順序執行**: 遵循 Discovery → Design → Implementation → Validation → Deployment 的順序
2. **及時記錄**: 每個階段的重要決策都會自動記錄在對應資料夾
3. **持續迭代**: 根據測試結果和用戶反饋持續改進

### 指令使用技巧
- **優先使用簡潔指令**: `@vibe` 指令更直觀易用
- **完整指令用於精確控制**: 需要特定參數時使用完整的 MCP 工具指令
- **善用上下文**: 基於工作目錄的上下文管理，無需記憶複雜的 ID

---

*VibeCoding 讓 AI 驅動的開發變得簡單高效！* 🚀 