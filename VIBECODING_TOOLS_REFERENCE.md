# VibeCoding 完整工具參考手冊

> **AI 驅動的對話式開發框架 - 鉅細靡遺的完整工具說明**

本手冊提供 VibeCoding 系統所有 **34 個工具** 的詳細說明，包括新的**簡潔指令系統**和完整的 MCP 工具參考。

## 📊 系統概覽

- **🎯 服務數量**: 6 個專業化 MCP 服務
- **🛠️ 工具總數**: 34 個專業工具
- **⚡ 簡潔指令**: 26 個常用簡潔指令 (減少 77% 輸入量)
- **🔄 向後相容**: 完整指令仍可使用
- **📈 建構狀態**: ✅ 全部服務已編譯並測試通過

## 📚 目錄

- [🆕 簡潔指令系統 (推薦)](#-簡潔指令系統-推薦)
- [📋 完整 MCP 工具列表](#-完整-mcp-工具列表)
- [🛠️ 詳細工具說明](#-詳細工具說明)
- [💡 使用範例](#-使用範例)
- [🎯 工作流程指南](#-工作流程指南)
- [🔧 工具參數詳解](#-工具參數詳解)

---

## 🆕 簡潔指令系統 (推薦)

> **77% 更短的指令！** 基於 UX 研究重新設計的直觀指令系統

### 🎯 核心指令 (Context Manager)

| 簡潔指令 | 對應完整指令 | 功能說明 |
|---------|-------------|----------|
| `@vibe start "專案名"` | `@vibecoding-context-manager start-clarification` | 開始新專案澄清 |
| `@vibe ask "回答"` | `@vibecoding-context-manager provide-clarification` | 回答澄清問題 |
| `@vibe prd` | `@vibecoding-context-manager generate-prd` | 生成產品需求文檔 |
| `@vibe plan` | `@vibecoding-context-manager generate-impl-plan` | 生成實施計劃 |
| `@vibe context` | `@vibecoding-context-manager get-context-summary` | 獲取上下文摘要 |
| `@vibe history` | `@vibecoding-context-manager get-relevant-history` | 查詢相關歷史 |

### 💻 開發指令 (Code Generator)

| 簡潔指令 | 對應完整指令 | 功能說明 |
|---------|-------------|----------|
| `@vibe code "需求"` | `@vibecoding-code-generator generate-code` | 生成代碼 |
| `@vibe comp "組件"` | `@vibecoding-code-generator generate-code --codeType component` | 生成組件 |
| `@vibe api "API"` | `@vibecoding-code-generator generate-code --codeType api` | 生成 API |
| `@vibe service "服務"` | `@vibecoding-code-generator generate-code --codeType service` | 生成服務 |
| `@vibe util "工具"` | `@vibecoding-code-generator generate-code --codeType utility` | 生成工具函數 |
| `@vibe review "代碼"` | `@vibecoding-code-generator code-review` | 代碼審查 |
| `@vibe refactor "代碼"` | `@vibecoding-code-generator refactor-code` | 重構代碼 |

### 🧪 測試指令 (Test Validator)

| 簡潔指令 | 對應完整指令 | 功能說明 |
|---------|-------------|----------|
| `@vibe test` | `@vibecoding-test-validator run-tests` | 執行測試 |
| `@vibe mock "代碼"` | `@vibecoding-code-generator generate-tests` | 生成測試 |
| `@vibe cover` | `@vibecoding-test-validator validate-coverage` | 檢查覆蓋率 |
| `@vibe report` | `@vibecoding-test-validator generate-test-report` | 生成測試報告 |
| `@vibe perf` | `@vibecoding-test-validator performance-test` | 性能測試 |

### 📦 依賴指令 (Dependency Tracker)

| 簡潔指令 | 對應完整指令 | 功能說明 |
|---------|-------------|----------|
| `@vibe deps` | `@vibecoding-dependency-tracker analyze-dependencies` | 分析依賴 |
| `@vibe scan` | `@vibecoding-dependency-tracker security-scan` | 安全掃描 |
| `@vibe update` | `@vibecoding-dependency-tracker update-dependencies` | 更新依賴 |
| `@vibe vuln` | `@vibecoding-dependency-tracker check-vulnerabilities` | 檢查漏洞 |

### 📚 文檔指令 (Doc Generator)

| 簡潔指令 | 對應完整指令 | 功能說明 |
|---------|-------------|----------|
| `@vibe doc` | `@vibecoding-doc-generator generate-docs` | 生成文檔 |
| `@vibe readme` | `@vibecoding-doc-generator update-readme` | 更新 README |
| `@vibe apidoc` | `@vibecoding-doc-generator create-api-docs` | 生成 API 文檔 |
| `@vibe changelog` | `@vibecoding-doc-generator generate-changelog` | 生成變更日誌 |

### 🚀 部署指令 (Deployment Manager)

| 簡潔指令 | 對應完整指令 | 功能說明 |
|---------|-------------|----------|
| `@vibe deploy` | `@vibecoding-deployment-manager deploy-service` | 部署服務 |
| `@vibe monitor` | `@vibecoding-deployment-manager setup-monitoring` | 設定監控 |
| `@vibe alert` | `@vibecoding-deployment-manager configure-alerts` | 配置警報 |
| `@vibe rollback` | `@vibecoding-deployment-manager rollback-deployment` | 回滾部署 |

> **📖 詳細指令設計說明**：查看 [VIBECODING_COMMAND_REDESIGN.md](VIBECODING_COMMAND_REDESIGN.md) 了解完整的指令重新設計原理和用法。

---

## 📋 完整 MCP 工具列表

VibeCoding 系統包含 **6 個專業化 MCP 服務**，總共提供 **34 個專業工具**：

### 🎯 Context Manager (上下文管理) - 12 個工具
1. `start-session` - 開始新會話
2. `get-context-summary` - 獲取上下文摘要  
3. `add-conversation` - 添加對話記錄
4. `record-decision` - 記錄重要決策
5. `get-relevant-history` - 查詢相關歷史
6. `get-ai-insight` - 獲取 AI 智能建議
7. `start-clarification` - 開始項目澄清 ⭐
8. `provide-clarification` - 提供澄清回答 ⭐
9. `generate-prd` - 生成產品需求文檔 ⭐
10. `generate-impl-plan` - 生成實施計劃 ⭐
11. `get-project` - 獲取項目詳情 ⭐
12. `list-projects` - 列出所有項目 ⭐

### ⚡ Code Generator (代碼生成) - 6 個工具  
1. `start-session` - 開始新會話
2. `generate-code` - 生成代碼 ⭐
3. `refactor-code` - 重構代碼 ⭐
4. `generate-tests` - 生成測試代碼 ⭐
5. `code-review` - 代碼審查 ⭐
6. `get-ai-insight` - 獲取 AI 建議

### 📦 Dependency Tracker (依賴追蹤) - 6 個工具
1. `start-session` - 開始新會話
2. `analyze-dependencies` - 分析依賴關係 ⭐
3. `security-scan` - 安全漏洞掃描 ⭐
4. `update-dependencies` - 更新依賴版本 ⭐
5. `check-vulnerabilities` - 檢查特定套件漏洞 ⭐
6. `get-ai-insight` - 獲取 AI 建議

### 🧪 Test Validator (測試驗證) - 6 個工具
1. `start-session` - 開始新會話
2. `run-tests` - 執行測試套件 ⭐
3. `generate-test-report` - 生成測試報告 ⭐
4. `validate-coverage` - 驗證測試覆蓋率 ⭐
5. `performance-test` - 執行性能測試 ⭐
6. `get-ai-insight` - 獲取 AI 建議

### 📚 Doc Generator (文檔生成) - 6 個工具
1. `start-session` - 開始新會話
2. `generate-docs` - 生成文檔 ⭐
3. `update-readme` - 更新 README 文件 ⭐
4. `create-api-docs` - 創建 API 文檔 ⭐
5. `generate-changelog` - 生成變更日誌 ⭐
6. `get-ai-insight` - 獲取 AI 建議

### 🚀 Deployment Manager (部署管理) - 6 個工具
1. `start-session` - 開始新會話
2. `deploy-service` - 部署服務 ⭐
3. `setup-monitoring` - 設置監控 ⭐
4. `configure-alerts` - 配置警報 ⭐
5. `rollback-deployment` - 回滾部署 ⭐
6. `get-ai-insight` - 獲取 AI 建議

**⭐ 標記的工具** 為核心功能工具，其他為通用輔助工具。

---

## 🛠️ 詳細工具說明

### 🎯 Context Manager 詳細工具

#### `start-clarification` ⭐
**功能**：開始項目澄清流程
**參數**：
```json
{
  "projectName": "string (必填)",
  "initialDescription": "string (可選)"
}
```
**用途**：啟動 7 問澄清流程，系統性收集項目需求

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe start "任務管理系統"

# 📝 完整指令 (仍可使用)
@vibecoding-context-manager start-clarification --projectName "任務管理系統" --initialDescription "為中小企業開發的協作平台"
```

**預期回應**：
```
🚀 項目澄清已啟動

項目ID: proj_abc123
第 1 個問題 (共 7 個)：
這個專案主要解決什麼問題？請詳細描述目標用戶和他們遇到的痛點。
```

#### `provide-clarification` ⭐
**功能**：提供澄清回答
**參數**：
```json
{
  "projectId": "string (必填)",
  "questionIndex": "number (必填)",
  "answer": "string (必填)"
}
```

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe ask "主要解決中小企業團隊任務分配不清、進度追蹤困難的問題"

# 📝 完整指令 (仍可使用)
@vibecoding-context-manager provide-clarification --projectId "proj_abc123" --questionIndex 0 --answer "答案內容"
```

#### `generate-prd` ⭐
**功能**：生成產品需求文檔
**參數**：
```json
{
  "projectId": "string (必填)"
}
```

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe prd

# 📝 完整指令 (仍可使用)
@vibecoding-context-manager generate-prd --projectId "proj_abc123"
```

**預期回應**：生成完整的 PRD 文檔，包含：
- 專案概述和目標
- 用戶角色和使用場景
- 功能需求和優先級
- 技術約束和非功能需求
- 成功指標和驗收標準

#### `generate-impl-plan` ⭐
**功能**：生成實施計劃
**參數**：
```json
{
  "projectId": "string (必填)"
}
```

#### `get-project` ⭐
**功能**：獲取項目詳情
**參數**：
```json
{
  "projectId": "string (必填)"
}
```

#### `list-projects` ⭐
**功能**：列出所有項目
**參數**：
```json
{}
```

---

### ⚡ Code Generator 詳細工具

#### `generate-code` ⭐
**功能**：生成代碼
**參數**：
```json
{
  "requirements": "string (必填)",
  "language": "string (必填)",
  "framework": "string (可選)",
  "codeType": "component|service|api|utility|model (可選)"
}
```

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦) - 會自動判斷類型
@vibe code "用戶註冊 API，包含郵箱驗證和 JWT"
@vibe comp "任務卡片組件，顯示標題、狀態、截止日期"
@vibe api "RESTful API for CRUD operations"

# 📝 完整指令 (仍可使用)
@vibecoding-code-generator generate-code --requirements "用戶註冊 API" --language "typescript" --framework "express" --codeType "api"
```

**預期回應**：生成完整代碼，包含：
- 功能完整的實現
- 適當的類型定義
- 錯誤處理邏輯
- 註解和文檔

#### `refactor-code` ⭐
**功能**：重構現有代碼
**參數**：
```json
{
  "code": "string (必填)",
  "refactorType": "performance|readability|structure|security (必填)",
  "targetPattern": "string (可選)"
}
```

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe refactor "function slowFunction() { /* 複雜代碼 */ }"

# 📝 完整指令 (仍可使用)
@vibecoding-code-generator refactor-code --code "原始代碼" --refactorType "performance"
```

#### `generate-tests` ⭐
**功能**：生成測試代碼
**參數**：
```json
{
  "code": "string (必填)",
  "testType": "unit|integration|e2e (必填)",
  "framework": "string (可選)"
}
```

#### `code-review` ⭐
**功能**：自動代碼審查
**參數**：
```json
{
  "code": "string (必填)",
  "focusAreas": "['security', 'performance', 'maintainability', 'best-practices'] (可選)"
}
```

---

### 📦 Dependency Tracker 詳細工具

#### `analyze-dependencies` ⭐
**功能**：分析項目依賴
**參數**：
```json
{
  "projectPath": "string (必填)",
  "packageManager": "npm|yarn|pnpm|pip|poetry|composer (可選)",
  "analyzeType": "all|direct|dev|peer|optional (可選)"
}
```

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe deps

# 📝 完整指令 (仍可使用)
@vibecoding-dependency-tracker analyze-dependencies --projectPath "." --packageManager "npm" --analyzeType "all"
```

**預期回應**：詳細分析報告，包含：
- 依賴樹結構
- 版本衝突檢測
- 未使用的依賴
- 安全漏洞提醒

#### `security-scan` ⭐
**功能**：安全漏洞掃描
**參數**：
```json
{
  "projectPath": "string (必填)",
  "severity": "low|moderate|high|critical (可選)",
  "includeDevDeps": "boolean (可選)"
}
```

#### `update-dependencies` ⭐
**功能**：更新依賴版本
**參數**：
```json
{
  "projectPath": "string (必填)",
  "updateType": "patch|minor|major|security (可選)",
  "dryRun": "boolean (可選)"
}
```

#### `check-vulnerabilities` ⭐
**功能**：檢查特定套件漏洞
**參數**：
```json
{
  "packageName": "string (必填)",
  "ecosystem": "npm|pypi|maven|nuget|composer (必填)",
  "version": "string (可選)"
}
```

---

### 🧪 Test Validator 詳細工具

#### `run-tests` ⭐
**功能**：執行測試套件
**參數**：
```json
{
  "projectPath": "string (必填)",
  "testType": "unit|integration|e2e|all (可選)",
  "pattern": "string (可選)",
  "watch": "boolean (可選)"
}
```

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe test          # 執行所有測試
@vibe test unit     # 只執行單元測試
@vibe cover         # 檢查覆蓋率

# 📝 完整指令 (仍可使用)
@vibecoding-test-validator run-tests --projectPath "." --testType "all"
```

#### `generate-test-report` ⭐
**功能**：生成測試報告
**參數**：
```json
{
  "projectPath": "string (必填)",
  "format": "html|json|xml|lcov (可選)",
  "includeMetrics": "boolean (可選)"
}
```

#### `validate-coverage` ⭐
**功能**：驗證測試覆蓋率
**參數**：
```json
{
  "projectPath": "string (必填)",
  "threshold": {
    "lines": "number",
    "functions": "number",
    "branches": "number",
    "statements": "number"
  },
  "failOnThreshold": "boolean (可選)"
}
```

#### `performance-test` ⭐
**功能**：性能測試
**參數**：
```json
{
  "projectPath": "string (必填)",
  "testSuite": "string (可選)",
  "iterations": "number (可選)",
  "warmup": "boolean (可選)"
}
```

---

### 📚 Doc Generator 詳細工具

#### `generate-docs` ⭐
**功能**：生成項目文檔
**參數**：
```json
{
  "projectPath": "string (必填)",
  "docType": "api|code|user|technical|all (可選)",
  "format": "markdown|html|pdf|json (可選)",
  "includeExamples": "boolean (可選)"
}
```

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe doc           # 生成所有文檔
@vibe readme        # 更新 README
@vibe apidoc        # 生成 API 文檔

# 📝 完整指令 (仍可使用)
@vibecoding-doc-generator generate-docs --projectPath "." --docType "all" --format "markdown"
```

#### `update-readme` ⭐
**功能**：更新 README 文件
**參數**：
```json
{
  "projectPath": "string (必填)",
  "template": "basic|detailed|opensource|enterprise (可選)",
  "sections": "['installation', 'usage', 'api', 'contributing', 'license'] (可選)"
}
```

#### `create-api-docs` ⭐
**功能**：創建 API 文檔
**參數**：
```json
{
  "projectPath": "string (必填)",
  "apiFormat": "openapi|swagger|postman|insomnia (可選)",
  "includeSchemas": "boolean (可選)",
  "outputPath": "string (可選)"
}
```

#### `generate-changelog` ⭐
**功能**：生成變更日誌
**參數**：
```json
{
  "projectPath": "string (必填)",
  "format": "keepachangelog|conventional|simple (可選)",
  "fromVersion": "string (可選)",
  "toVersion": "string (可選)"
}
```

---

### 🚀 Deployment Manager 詳細工具

#### `deploy-service` ⭐
**功能**：部署服務
**參數**：
```json
{
  "projectPath": "string (必填)",
  "environment": "development|staging|production (必填)",
  "platform": "docker|kubernetes|heroku|vercel|aws|gcp|azure (可選)",
  "buildCommand": "string (可選)",
  "envVars": "object (可選)"
}
```

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe deploy        # 部署到預設環境
@vibe monitor       # 設置監控
@vibe rollback      # 回滾部署

# 📝 完整指令 (仍可使用)
@vibecoding-deployment-manager deploy-service --projectPath "." --environment "staging" --platform "docker"
```

#### `setup-monitoring` ⭐
**功能**：設置監控
**參數**：
```json
{
  "projectPath": "string (必填)",
  "monitoringType": "basic|advanced|enterprise (可選)",
  "services": "['prometheus', 'grafana', 'elk', 'datadog', 'newrelic'] (可選)",
  "alertChannels": "['email', 'slack', 'webhook', 'sms'] (可選)"
}
```

#### `configure-alerts` ⭐
**功能**：配置警報
**參數**：
```json
{
  "projectPath": "string (必填)",
  "alertRules": "object[] (可選)",
  "channels": "string[] (可選)"
}
```

#### `rollback-deployment` ⭐
**功能**：回滾部署
**參數**：
```json
{
  "projectPath": "string (必填)",
  "environment": "development|staging|production (必填)",
  "version": "string (可選)",
  "reason": "string (可選)"
}
```

---

### 🔄 通用工具說明

每個服務都包含以下通用工具：

#### `start-session`
**功能**：開始新的開發會話
**參數**：
```json
{
  "projectId": "string (可選)"
}
```
**用途**：初始化服務會話，準備處理後續請求

#### `get-ai-insight`
**功能**：獲取 AI 智能建議
**參數**：
```json
{
  "query": "string (必填)"
}
```
**用途**：針對特定問題獲取 AI 驅動的智能建議和最佳實踐

**📝 通用使用範例**：
```bash
# 任何服務都可以提供 AI 洞察
@vibecoding-context-manager get-ai-insight --query "如何改善團隊協作流程？"
@vibecoding-code-generator get-ai-insight --query "React 性能優化最佳實踐"
@vibecoding-test-validator get-ai-insight --query "如何提高測試覆蓋率？"
```

---

## 💡 使用範例

### 🎯 完整開發流程範例

#### 範例：開發一個部落格系統

```bash
# 1. 開始項目澄清
@vibe start "個人部落格系統"

# 2. 逐步回答澄清問題 (7個問題)
@vibe ask "為個人創作者提供簡潔的文章發布和管理平台"
@vibe ask "文章編輯、分類管理、評論系統、SEO 優化"
@vibe ask "React + Node.js + PostgreSQL"
# ... 繼續回答剩餘 4 個問題

# 3. 生成 PRD 和實施計劃
@vibe prd
@vibe plan

# 4. 開始代碼開發
@vibe api "用戶認證 API，支援註冊、登入、JWT 驗證"
@vibe api "文章 CRUD API，支援 Markdown 內容"
@vibe comp "文章編輯器組件，支援 Markdown 預覽"
@vibe comp "文章列表組件，支援分頁和搜尋"

# 5. 代碼審查和重構
@vibe review "剛生成的用戶認證 API 代碼"
@vibe refactor "優化文章查詢性能"

# 6. 生成測試
@vibe mock "用戶認證 API 代碼"
@vibe test

# 7. 檢查依賴和安全
@vibe deps
@vibe scan

# 8. 生成文檔
@vibe doc
@vibe readme
@vibe apidoc

# 9. 部署
@vibe deploy
@vibe monitor
```

### ⚡ 快速原型範例 (30分鐘 MVP)

```bash
# 1. 快速澄清 (5分鐘)
@vibe start "待辦事項 App"
@vibe ask "個人任務管理，簡單易用"
@vibe ask "新增、編輯、刪除、完成標記"
@vibe ask "React + 本地存儲"
@vibe ask "一週內完成"
@vibe ask "用戶友好的介面"
@vibe ask "任務完成率統計"
@vibe ask "每日活躍用戶 100 人"

# 2. 快速開發 (15分鐘)
@vibe prd
@vibe comp "待辦清單組件，支援新增、編輯、刪除"
@vibe comp "任務項組件，支援完成狀態切換"
@vibe util "本地存儲工具函數"

# 3. 快速測試和部署 (10分鐘)
@vibe mock "所有組件代碼"
@vibe test
@vibe deploy
```

### 🏢 企業級專案範例

```bash
# 1. 詳細需求分析
@vibe start "企業級 ERP 系統"
# ... 詳細回答所有澄清問題

# 2. 架構設計
@vibe prd
@vibe plan

# 3. 模組化開發
@vibe api "用戶權限管理系統"
@vibe api "庫存管理 API"
@vibe api "財務報表 API"
@vibe service "數據同步服務"
@vibe service "報表生成服務"

# 4. 全面測試
@vibe test unit
@vibe test integration
@vibe cover
@vibe perf

# 5. 安全檢查
@vibe scan
@vibe vuln
@vibe review "所有 API 代碼"

# 6. 文檔生成
@vibe doc
@vibe apidoc
@vibe changelog

# 7. 企業級部署
@vibe deploy staging
@vibe monitor
@vibe alert
```

---

## 🎯 工作流程指南

### 📋 推薦的開發流程

#### 階段 1: 需求澄清 (Discovery)
```bash
@vibe start "專案名稱"
# 回答 7 個系統化澄清問題
@vibe ask "每個問題的詳細回答"
@vibe prd
@vibe plan
```

#### 階段 2: 設計架構 (Design)
```bash
@vibe code "系統架構和核心模組"
@vibe api "主要 API 端點設計"
@vibe service "關鍵服務邏輯"
```

#### 階段 3: 實現開發 (Implementation)
```bash
@vibe comp "UI 組件開發"
@vibe util "工具函數實現"
@vibe review "代碼審查"
@vibe refactor "性能優化"
```

#### 階段 4: 測試驗證 (Validation)
```bash
@vibe mock "生成測試代碼"
@vibe test "執行測試套件"
@vibe cover "檢查覆蓋率"
@vibe perf "性能測試"
```

#### 階段 5: 部署發布 (Deployment)
```bash
@vibe deps "檢查依賴"
@vibe scan "安全掃描"
@vibe doc "生成文檔"
@vibe deploy "部署服務"
@vibe monitor "設置監控"
```

### 🚀 不同情境的最佳實踐

#### 🎯 適合新手開發者
- 使用簡潔指令 (`@vibe`) 降低學習門檻
- 從完整澄清流程開始建立良好習慣
- 重點使用代碼審查工具學習最佳實踐

#### ⚡ 適合快速原型
- 簡化澄清流程，重點回答核心問題
- 使用代碼生成快速建立 MVP
- 專注核心功能，後續迭代優化

#### 🏢 適合企業開發
- 完整執行所有澄清問題
- 重點使用安全掃描和代碼審查
- 建立完整的測試和文檔流程

#### 🎓 適合學習和教育
- 比較簡潔指令和完整指令的差異
- 使用 AI 洞察工具學習最佳實踐
- 練習完整的軟體開發生命週期

---

## 🔧 工具參數詳解

### 🎯 Context Manager 特殊功能

#### 澄清問題系統
VibeCoding 使用 7 個結構化問題收集需求：
1. **問題定義**: 專案解決什麼問題？
2. **核心功能**: 最重要的 3-5 個功能？
3. **技術偏好**: 偏好的技術棧？
4. **時程預算**: 預期完成時間和資源？
5. **用戶體驗**: UI/UX 需求和限制？
6. **技術約束**: 性能、安全、相容性要求？
7. **成功指標**: 如何衡量專案成功？

#### PRD 生成結構
- **專案概述**: 目標、願景、價值主張
- **用戶分析**: 目標用戶、使用場景、用戶故事
- **功能需求**: 詳細功能清單、優先級
- **非功能需求**: 性能、安全、可用性
- **技術架構**: 推薦技術棧、架構圖
- **開發計劃**: 里程碑、時程、資源分配
- **驗收標準**: 可測量的成功指標

### ⚡ Code Generator 支援範圍

#### 支援的程式語言
- **JavaScript/TypeScript**: React, Vue, Angular, Node.js
- **Python**: FastAPI, Django, Flask, ML 框架
- **Java**: Spring Boot, 微服務架構
- **Go**: 高性能後端服務
- **Rust**: 系統級程式設計

#### 支援的代碼類型
- **component**: UI 組件 (React, Vue, Angular)
- **service**: 後端服務邏輯
- **api**: RESTful API 端點
- **utility**: 工具函數和輔助模組
- **model**: 數據模型和 ORM 定義

#### 重構類型詳解
- **performance**: 演算法優化、緩存策略、資料庫查詢優化
- **readability**: 命名改善、註解添加、代碼結構優化
- **structure**: 設計模式應用、關注點分離、模組化重構
- **security**: 輸入驗證、權限檢查、安全最佳實踐

### 🧪 Test Validator 測試策略

#### 測試類型說明
- **unit**: 單元測試，測試個別函數和組件
- **integration**: 整合測試，測試模組間互動
- **e2e**: 端到端測試，測試完整用戶流程

#### 覆蓋率門檻建議
- **入門專案**: Lines: 60%, Functions: 70%
- **商業專案**: Lines: 80%, Functions: 85%
- **關鍵系統**: Lines: 90%, Functions: 95%

### 📦 Dependency Tracker 安全等級

#### 漏洞嚴重性等級
- **low**: 建議修復，非緊急
- **moderate**: 應儘快修復
- **high**: 需要立即關注
- **critical**: 必須立即修復

#### 更新策略說明
- **patch**: 只更新修復版本 (1.0.1 → 1.0.2)
- **minor**: 更新功能版本 (1.0.x → 1.1.x)
- **major**: 更新主版本 (1.x.x → 2.x.x)
- **security**: 只更新安全修復

### 📚 Doc Generator 文檔類型

#### 文檔格式支援
- **markdown**: 通用文檔格式
- **html**: 網頁瀏覽格式
- **pdf**: 正式文檔格式
- **json**: 結構化數據格式

#### API 文檔格式
- **openapi**: OpenAPI 3.0 規範
- **swagger**: Swagger 2.0 格式
- **postman**: Postman Collection
- **insomnia**: Insomnia 工作區

### 🚀 Deployment Manager 平台支援

#### 支援的部署平台
- **docker**: 容器化部署
- **kubernetes**: 容器編排
- **heroku**: PaaS 平台
- **vercel**: 前端部署
- **aws/gcp/azure**: 雲端平台

#### 監控服務整合
- **prometheus**: 指標收集
- **grafana**: 視覺化儀表板
- **elk**: 日誌分析
- **datadog**: 全方位監控
- **newrelic**: 應用性能監控

---

## 📊 系統狀態和版本資訊

### ✅ 當前系統狀態
- **建構狀態**: ✅ 全部 6 個服務編譯成功
- **提示系統**: ✅ 21 個提示組件運作正常
- **工具總數**: 34 個工具全部可用
- **簡潔指令**: 26 個簡潔指令映射完成

### 🔄 最近更新內容
- **程式碼優化**: 修復路徑導入問題，提升編譯穩定性
- **類型安全**: 加強 MCP 參數類型檢查和轉換
- **錯誤處理**: 改善錯誤處理機制和用戶回饋
- **性能提升**: 優化 AI 提示載入和處理速度

### 📈 後續規劃
- **更多語言支援**: 增加 C#, PHP, Ruby 支援
- **IDE 整合**: 深度整合 VSCode, WebStorm 等 IDE
- **團隊協作**: 支援多人協作和專案共享
- **企業功能**: 權限管理、審計日誌、合規檢查

---

## 📞 獲取幫助

### 🔍 故障排除
- **服務無法啟動**: 檢查 Node.js 版本 >= 18.0.0
- **工具無回應**: 重新建構 `npm run build`
- **路徑錯誤**: 使用絕對路徑配置 MCP 服務
- **權限問題**: 在 Windows 上以管理員身分執行

### 📚 相關文檔
- **[IDE 設定指南](IDE_SETUP_GUIDE.md)**: 詳細的 IDE 配置說明
- **[MCP 設定指南](MCP_SETUP_GUIDE.md)**: MCP 服務設定說明
- **[指令重設計說明](VIBECODING_COMMAND_REDESIGN.md)**: 簡潔指令設計理念
- **[專案結構說明](folder_structure.md)**: 完整的專案組織架構

### 💬 社群支援
- **GitHub Issues**: [vibecoding/issues](https://github.com/vibecoding/issues)
- **討論區**: [GitHub Discussions](https://github.com/vibecoding/discussions)
- **Wiki**: [VibeCoding Wiki](https://github.com/vibecoding/wiki)

---

**🎉 恭喜！您現在擁有 VibeCoding 系統的完整工具掌握能力！**

> **💡 小提示**: 從簡潔指令開始，逐步探索更多進階功能。記住，每個工具都可以提供 AI 洞察來幫助您更好地使用它們！

**⭐ 立即開始**: `@vibe start "你的第一個專案"` 