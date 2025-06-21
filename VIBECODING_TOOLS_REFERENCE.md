# 🛠️ VibeCoding 工具完整參考手冊

> **完整的 MCP 工具列表和使用說明**

## 🚀 **新！簡潔指令系統**

**重大更新**：我們重新設計了指令系統，讓指令更簡潔易記！

### **指令長度對比**
| 舊指令 | 新指令 | 減少 |
|--------|--------|------|
| `@vibecoding-context-manager generate-prd` | `@vibe prd` | 78% |
| `@vibecoding-code-generator generate-code` | `@vibe code` | 76% |
| `@vibecoding-dependency-tracker analyze-dependencies` | `@vibe deps` | 81% |

### **快速指令參考**
```bash
# 🎯 項目管理
@vibe start "項目名"    # 開始新項目
@vibe ask "答案"       # 回答澄清問題
@vibe prd             # 生成 PRD
@vibe plan            # 生成實施計劃

# 💻 代碼開發
@vibe code "需求"      # 生成代碼
@vibe api "描述"       # 生成 API
@vibe fix "代碼"       # 重構代碼
@vibe review "代碼"    # 代碼審查

# 🧪 測試執行
@vibe test            # 執行測試
@vibe cover           # 檢查覆蓋率
@vibe mock "代碼"      # 生成測試

# 📦 依賴管理
@vibe deps            # 分析依賴
@vibe scan            # 安全掃描
@vibe update          # 更新依賴

# 📚 文檔生成
@vibe doc             # 生成文檔
@vibe readme          # 更新 README
@vibe changelog       # 生成變更日誌

# 🚀 部署管理
@vibe deploy          # 部署服務
@vibe monitor         # 設置監控
@vibe rollback        # 回滾部署
```

> **📖 詳細指令設計說明**：查看 [VIBECODING_COMMAND_REDESIGN.md](VIBECODING_COMMAND_REDESIGN.md) 了解完整的指令重新設計原理和用法。

---

## 📋 目錄
- [🎯 Context Manager 工具](#-context-manager-工具)
- [💻 Code Generator 工具](#-code-generator-工具)
- [📦 Dependency Tracker 工具](#-dependency-tracker-工具)
- [🧪 Test Validator 工具](#-test-validator-工具)
- [📚 Doc Generator 工具](#-doc-generator-工具)
- [🚀 Deployment Manager 工具](#-deployment-manager-工具)
- [🔄 通用工具說明](#-通用工具說明)

---

## 🎯 Context Manager 工具

> **專責**：項目管理、會話管理、需求澄清、PRD 生成

### 🔧 專屬工具

#### `start-clarification`
**功能**：開始項目澄清流程
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
@vibe start "項目名稱"

# 📝 完整指令 (仍可使用)
@vibecoding-context-manager start-clarification
```
**參數範例**：
```json
{
  "projectName": "任務管理系統",
  "initialDescription": "為中小企業團隊開發的協作管理平台"
}
```
**預期回應**：
```
🚀 項目澄清已啟動

項目ID: proj_abc123
第 1 個問題 (共 7 個)：
這個專案主要解決什麼問題？請詳細描述目標用戶和他們遇到的痛點。
```

#### `provide-clarification`
**功能**：提供澄清回答
```json
{
  "projectId": "string (必填)",
  "questionIndex": "number (必填)",
  "answer": "string (必填)"
}
```
**用途**：回答澄清問題，推進需求收集進度

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe ask "答案內容"

# 📝 完整指令 (仍可使用)
@vibecoding-context-manager provide-clarification
```
**參數範例**：
```json
{
  "projectId": "proj_abc123",
  "questionIndex": 0,
  "answer": "主要解決中小企業團隊任務分配不清、進度追蹤困難的問題。目標用戶是 10-50 人的團隊領導和成員，他們常常因為溝通不暢導致專案延期。"
}
```
**預期回應**：
```
✅ 回答已記錄

第 2 個問題 (共 7 個)：
這個專案的核心功能有哪些？請列出 3-5 個最重要的功能。
```

#### `generate-prd`
**功能**：生成項目 PRD
```json
{
  "projectId": "string (必填)"
}
```
**用途**：基於澄清回答自動生成產品需求文檔

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe prd

# 📝 完整指令 (仍可使用)
@vibecoding-context-manager generate-prd
```
**參數範例**：
```json
{
  "projectId": "proj_abc123"
}
```
**預期回應**：生成完整的 PRD 文檔，包含：
- 專案概述和目標
- 用戶角色和使用場景
- 功能需求和優先級
- 技術約束和非功能需求
- 成功指標和驗收標準

#### `generate-impl-plan`
**功能**：生成實施計劃
```json
{
  "projectId": "string (必填)"
}
```
**用途**：創建詳細的項目實施計劃和時程

#### `get-project`
**功能**：獲取項目詳情
```json
{
  "projectId": "string (必填)"
}
```
**用途**：查看完整項目信息和當前狀態

#### `list-projects`
**功能**：列出所有項目
```json
{}
```
**用途**：顯示所有管理中的項目列表

#### `add-conversation`
**功能**：添加對話記錄
```json
{
  "speaker": "user|assistant|system (必填)",
  "content": "string (必填)",
  "metadata": "object (可選)"
}
```
**用途**：記錄重要對話內容到會話歷史

#### `record-decision`
**功能**：記錄重要決策
```json
{
  "decision": "string (必填)",
  "rationale": "string (必填)",
  "impact": "string (必填)",
  "service": "string (必填)"
}
```
**用途**：記錄關鍵技術或業務決策

#### `get-relevant-history`
**功能**：查詢相關歷史記錄
```json
{
  "query": "string (必填)",
  "limit": "number (預設: 10)"
}
```
**用途**：基於語義搜索查找相關的歷史對話

#### `get-context-summary`
**功能**：獲取項目上下文摘要
```json
{}
```
**用途**：生成當前項目和會話的綜合摘要

---

## 💻 Code Generator 工具

> **專責**：代碼生成、重構、架構設計

### 🔧 專屬工具

#### `generate-code`
**功能**：生成代碼
```json
{
  "requirements": "string (必填)",
  "language": "string (必填)",
  "framework": "string (可選)",
  "codeType": "component|service|api|utility|model (可選)"
}
```
**用途**：基於需求生成高質量代碼

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe code "需求描述"

# 📝 完整指令 (仍可使用)
@vibecoding-code-generator generate-code
```
**參數範例 1 - API 端點**：
```json
{
  "requirements": "創建用戶註冊 API，包含郵箱驗證、密碼加密、JWT token 生成",
  "language": "typescript",
  "framework": "express",
  "codeType": "api"
}
```
**參數範例 2 - React 組件**：
```json
{
  "requirements": "創建任務卡片組件，顯示任務標題、狀態、截止日期，支持拖拽",
  "language": "typescript",
  "framework": "react",
  "codeType": "component"
}
```
**預期回應**：生成完整的代碼檔案，包含：
- 完整的函數/組件實現
- 適當的類型定義
- 錯誤處理邏輯
- 基本的註解說明

#### `refactor-code`
**功能**：重構現有代碼
```json
{
  "code": "string (必填)",
  "refactorType": "performance|readability|structure|security (必填)",
  "targetPattern": "string (可選)"
}
```
**用途**：改善代碼質量和可維護性

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe fix "代碼內容"        # 通用重構
@vibe speed "代碼內容"      # 性能優化
@vibe clean "代碼內容"      # 可讀性提升

# 📝 完整指令 (仍可使用)
@vibecoding-code-generator refactor-code
```
**參數範例 - 性能優化**：
```json
{
  "code": "function processUsers(users) { return users.map(u => users.filter(x => x.department === u.department).length > 5 ? u : null).filter(Boolean); }",
  "refactorType": "performance",
  "targetPattern": "避免重複計算，使用緩存"
}
```
**預期回應**：重構後的代碼，包含：
- 性能優化的實現
- 詳細的改進說明
- 性能提升的量化分析

#### `generate-tests`
**功能**：生成測試代碼
```json
{
  "code": "string (必填)",
  "testType": "unit|integration|e2e (必填)",
  "framework": "string (可選)"
}
```
**用途**：為現有代碼生成對應測試案例

#### `code-review`
**功能**：自動代碼審查
```json
{
  "code": "string (必填)",
  "focusAreas": "['security', 'performance', 'maintainability', 'best-practices'] (可選)"
}
```
**用途**：提供專業的代碼審查建議

---

## 📦 Dependency Tracker 工具

> **專責**：依賴管理、安全掃描、版本控制

### 🔧 專屬工具

#### `analyze-dependencies`
**功能**：分析項目依賴
```json
{
  "projectPath": "string (必填)",
  "packageManager": "npm|yarn|pnpm|pip|poetry|composer (可選)",
  "analyzeType": "all|direct|dev|peer|optional (可選)"
}
```
**用途**：深度分析項目依賴關係和潛在問題

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe deps

# 📝 完整指令 (仍可使用)
@vibecoding-dependency-tracker analyze-dependencies
```
**參數範例**：
```json
{
  "projectPath": ".",
  "packageManager": "npm",
  "analyzeType": "all"
}
```
**預期回應**：詳細的依賴分析報告，包含：
- 依賴樹結構
- 版本衝突檢測
- 未使用的依賴
- 安全漏洞提醒
- 更新建議

#### `security-scan`
**功能**：安全漏洞掃描
```json
{
  "projectPath": "string (必填)",
  "severity": "low|moderate|high|critical (可選)",
  "includeDevDeps": "boolean (可選)"
}
```
**用途**：掃描依賴中的已知安全漏洞

#### `update-dependencies`
**功能**：更新依賴版本
```json
{
  "projectPath": "string (必填)",
  "updateType": "patch|minor|major|security (可選)",
  "dryRun": "boolean (可選)"
}
```
**用途**：智能更新依賴到兼容的最新版本

#### `check-vulnerabilities`
**功能**：檢查特定套件漏洞
```json
{
  "packageName": "string (必填)",
  "ecosystem": "npm|pypi|maven|nuget|composer (必填)",
  "version": "string (可選)"
}
```
**用途**：檢查特定套件的安全狀態

---

## 🧪 Test Validator 工具

> **專責**：測試執行、覆蓋率分析、質量保證

### 🔧 專屬工具

#### `run-tests`
**功能**：執行測試套件
```json
{
  "projectPath": "string (必填)",
  "testType": "unit|integration|e2e|all (可選)",
  "pattern": "string (可選)",
  "watch": "boolean (可選)"
}
```
**用途**：執行項目測試並提供詳細報告

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe test              # 執行所有測試
@vibe test unit         # 只執行單元測試
@vibe cover             # 檢查覆蓋率

# 📝 完整指令 (仍可使用)
@vibecoding-test-validator run-tests
```
**參數範例 1 - 執行所有測試**：
```json
{
  "projectPath": ".",
  "testType": "all"
}
```
**參數範例 2 - 只執行單元測試**：
```json
{
  "projectPath": "./src",
  "testType": "unit",
  "pattern": "*.test.ts",
  "watch": false
}
```
**預期回應**：測試執行報告，包含：
- 測試通過/失敗統計
- 執行時間分析
- 覆蓋率報告
- 失敗測試的詳細信息

#### `generate-test-report`
**功能**：生成測試報告
```json
{
  "projectPath": "string (必填)",
  "format": "html|json|xml|lcov (可選)",
  "includeMetrics": "boolean (可選)"
}
```
**用途**：生成詳細的測試執行報告

#### `validate-coverage`
**功能**：驗證測試覆蓋率
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
**用途**：檢查測試覆蓋率是否達到要求

#### `performance-test`
**功能**：性能測試
```json
{
  "projectPath": "string (必填)",
  "testSuite": "string (可選)",
  "iterations": "number (可選)",
  "warmup": "boolean (可選)"
}
```
**用途**：執行性能基準測試

---

## 📚 Doc Generator 工具

> **專責**：文檔生成、API 文檔、用戶手冊

### 🔧 專屬工具

#### `generate-docs`
**功能**：生成項目文檔
```json
{
  "projectPath": "string (必填)",
  "docType": "api|code|user|technical|all (可選)",
  "format": "markdown|html|pdf|json (可選)",
  "includeExamples": "boolean (可選)"
}
```
**用途**：從代碼自動生成綜合文檔

**📝 使用範例**：
```bash
# 🆕 簡潔指令 (推薦)
@vibe doc               # 生成所有文檔
@vibe readme            # 更新 README
@vibe apidoc            # 生成 API 文檔

# 📝 完整指令 (仍可使用)
@vibecoding-doc-generator generate-docs
```
**參數範例 1 - 生成 API 文檔**：
```json
{
  "projectPath": ".",
  "docType": "api",
  "format": "markdown",
  "includeExamples": true
}
```
**參數範例 2 - 生成完整文檔**：
```json
{
  "projectPath": "./src",
  "docType": "all",
  "format": "html",
  "includeExamples": true
}
```
**預期回應**：生成的文檔包含：
- API 端點文檔
- 代碼註解文檔
- 使用範例
- 架構說明

#### `update-readme`
**功能**：更新 README 文件
```json
{
  "projectPath": "string (必填)",
  "template": "basic|detailed|opensource|enterprise (可選)",
  "sections": "['installation', 'usage', 'api', 'contributing', 'license', 'changelog'] (可選)"
}
```
**用途**：生成或更新項目 README.md

#### `create-api-docs`
**功能**：創建 API 文檔
```json
{
  "projectPath": "string (必填)",
  "apiFormat": "openapi|swagger|postman|insomnia (可選)",
  "includeSchemas": "boolean (可選)",
  "outputPath": "string (可選)"
}
```
**用途**：從代碼註解生成 API 文檔

#### `generate-changelog`
**功能**：生成變更日誌
```json
{
  "projectPath": "string (必填)",
  "format": "keepachangelog|conventional|simple (可選)",
  "fromVersion": "string (可選)",
  "toVersion": "string (可選)"
}
```
**用途**：從 Git 歷史生成變更日誌

---

## 🚀 Deployment Manager 工具

> **專責**：部署管理、CI/CD、基礎設施

### 🔧 專屬工具

#### `deploy-service`
**功能**：部署應用服務
```json
{
  "projectPath": "string (必填)",
  "environment": "development|staging|production (必填)",
  "platform": "docker|kubernetes|heroku|vercel|aws|gcp|azure (可選)",
  "buildCommand": "string (可選)",
  "envVars": "object (可選)"
}
```
**用途**：部署應用到指定環境

**📝 使用範例**：
```bash
@vibecoding-deployment-manager deploy-service
```
**參數範例 1 - Docker 部署**：
```json
{
  "projectPath": ".",
  "environment": "staging",
  "platform": "docker",
  "buildCommand": "npm run build",
  "envVars": {
    "NODE_ENV": "staging",
    "API_URL": "https://api-staging.example.com"
  }
}
```
**參數範例 2 - Vercel 部署**：
```json
{
  "projectPath": "./frontend",
  "environment": "production",
  "platform": "vercel",
  "envVars": {
    "NEXT_PUBLIC_API_URL": "https://api.example.com"
  }
}
```
**預期回應**：部署狀態報告，包含：
- 部署進度和狀態
- 部署 URL 和訪問信息
- 健康檢查結果
- 回滾指令（如果需要）

#### `setup-monitoring`
**功能**：設置監控系統
```json
{
  "projectPath": "string (必填)",
  "monitoringType": "basic|advanced|enterprise (可選)",
  "services": "['prometheus', 'grafana', 'elk', 'datadog', 'newrelic'] (可選)",
  "alertChannels": "['email', 'slack', 'webhook', 'sms'] (可選)"
}
```
**用途**：配置應用監控和警報系統

#### `configure-alerts`
**功能**：配置警報規則
```json
{
  "projectPath": "string (必填)",
  "alertRules": [
    {
      "metric": "string",
      "threshold": "number",
      "severity": "low|medium|high|critical"
    }
  ],
  "channels": "string[] (可選)"
}
```
**用途**：設置系統監控警報

#### `rollback-deployment`
**功能**：回滾部署
```json
{
  "projectPath": "string (必填)",
  "environment": "development|staging|production (必填)",
  "version": "string (可選)",
  "reason": "string (可選)"
}
```
**用途**：回滾到之前的部署版本

---

## 🔄 通用工具說明

### 每個服務都包含的工具

#### `start-session`
**功能**：開始新的開發會話
```json
{
  "projectId": "string (可選)"
}
```
**用途**：初始化會話，同步項目上下文

#### `get-ai-insight`
**功能**：獲取 AI 智能建議
```json
{
  "query": "string (必填)"
}
```
**用途**：基於當前上下文提供專業建議

---

## 🎯 使用模式和最佳實踐

### 🚀 典型開發流程

#### 1. 項目啟動
```bash
# 1. 開始會話
@vibecoding-context-manager start-session

# 2. 項目澄清
@vibecoding-context-manager start-clarification --projectName "我的項目"

# 3. 回答澄清問題 (重複 7 次)
@vibecoding-context-manager provide-clarification --projectId "proj_xxx" --questionIndex 0 --answer "..."

# 4. 生成 PRD
@vibecoding-context-manager generate-prd --projectId "proj_xxx"
```

#### 2. 設計和開發
```bash
# 1. 生成代碼
@vibecoding-code-generator generate-code --requirements "用戶認證系統" --language "typescript"

# 2. 代碼審查
@vibecoding-code-generator code-review --code "..." --focusAreas "['security', 'performance']"

# 3. 生成測試
@vibecoding-code-generator generate-tests --code "..." --testType "unit"
```

#### 3. 質量保證
```bash
# 1. 執行測試
@vibecoding-test-validator run-tests --projectPath "." --testType "all"

# 2. 檢查覆蓋率
@vibecoding-test-validator validate-coverage --projectPath "." --threshold "{'lines': 80}"

# 3. 安全掃描
@vibecoding-dependency-tracker security-scan --projectPath "." --severity "high"
```

#### 4. 文檔和部署
```bash
# 1. 生成文檔
@vibecoding-doc-generator generate-docs --projectPath "." --docType "all"

# 2. 部署應用
@vibecoding-deployment-manager deploy-service --projectPath "." --environment "staging"

# 3. 設置監控
@vibecoding-deployment-manager setup-monitoring --projectPath "." --monitoringType "basic"
```

### 💡 工具組合建議

#### 代碼生成 + 測試
```bash
# 生成代碼並立即創建測試
@vibecoding-code-generator generate-code --requirements "API 端點" --language "typescript"
@vibecoding-code-generator generate-tests --code "[生成的代碼]" --testType "unit"
```

#### 安全檢查流程
```bash
# 完整安全檢查
@vibecoding-dependency-tracker security-scan --projectPath "." --severity "moderate"
@vibecoding-code-generator code-review --code "[代碼]" --focusAreas "['security']"
```

#### 文檔化流程
```bash
# 完整文檔生成
@vibecoding-doc-generator update-readme --projectPath "." --template "detailed"
@vibecoding-doc-generator create-api-docs --projectPath "." --apiFormat "openapi"
@vibecoding-doc-generator generate-changelog --projectPath "."
```

---

## 📚 進階使用技巧

### 🔍 上下文感知
- 所有工具都會自動共享項目上下文
- 使用 `record-decision` 記錄重要決策供其他工具參考
- `get-relevant-history` 可幫助查找相關的歷史決策

### 🤖 AI 協作
- 每個服務的 `get-ai-insight` 都會提供專業領域的建議
- 結合多個服務的建議來做出更好的決策
- 使用自然語言描述需求，AI 會自動選擇最佳工具

### 📊 質量監控
- 定期使用 `security-scan` 檢查安全狀態
- 設置 `validate-coverage` 確保測試覆蓋率
- 使用 `performance-test` 監控性能回歸

### 🔄 持續改進
- 記錄每次重構的原因和結果
- 使用 `generate-changelog` 追蹤項目演進
- 定期更新文檔保持同步

---

**🎯 這個工具參考手冊涵蓋了所有 VibeCoding 服務的完整功能。建議收藏此文檔以便快速查找所需工具！** 