#!/usr/bin/env node
/**
 * VibeCoding Enhanced Project Structure Creator
 * 🚀 一鍵創建完整的 VibeCoding 增強專案結構
 * 包含專業模板、開發指南、測試策略、部署指南
 */

const fs = require('fs-extra');
const path = require('path');

console.log('🚀 VibeCoding Enhanced Project Structure Creator');
console.log('正在創建完整的專案開發結構...\n');

// 獲取目標目錄（當前目錄）
const projectPath = process.cwd();
const projectName = path.basename(projectPath);

// 📁 完整的專案結構定義（只包含目錄）
const PROJECT_STRUCTURE = {
  // === 開發階段資料夾 ===
  '0_discovery': {
    'conversations': {},
    'clarifications': {},
    'requirements': {}
  },
  
  '1_design': {
    'architecture': {},
    'api-contracts': {},
    'flow-diagrams': {}
  },
  
  '2_implementation': {
    'src': {},
    'tests': {},
    'scripts': {}
  },
  
  '3_validation': {
    'test-reports': {},
    'quality-metrics': {},
    'benchmarks': {}
  },
  
  '4_deployment': {
    'environments': {},
    'ci-cd': {},
    'monitoring': {}
  },
  
  // === 知識庫 ===
  'knowledge-base': {
    'patterns': {},
    'solutions': {},
    'retrospectives': {},
    'decisions': {}
  },
  
  // === VibeCoding 專用文件夾 ===
  '.vibecoding': {
    'conversations': {},
    'decisions': {},
    'insights': {}
  },
  
  // === 專案檔案 ===
  'docs': {},
  'config': {}
};

// 📄 專案模板檔案
const TEMPLATE_FILES = {
  'README.md': `# ${projectName}

## 🚀 專案概述

使用 VibeCoding 系統開發的專案，採用對話驅動開發模式。

## 📋 開發階段

### 🔍 0_discovery - 需求發現
- 專案澄清和需求收集
- 用戶故事定義
- 技術約束分析

### 🎨 1_design - 系統設計  
- 架構設計
- API 規格定義
- 資料庫設計

### 💻 2_implementation - 開發實作
- 源代碼開發
- 單元測試
- 代碼審查

### 🧪 3_validation - 測試驗證
- 功能測試
- 性能測試
- 安全檢查

### 🚀 4_deployment - 部署上線
- 環境配置
- CI/CD 設定
- 監控告警

## 🛠️ VibeCoding 快速開發

\`\`\`bash
# 🆕 簡潔指令 (推薦)
@vibe start "${projectName}"     # 開始專案澄清
@vibe prd                        # 生成產品需求文檔
@vibe code "核心功能"            # 生成代碼
@vibe test                       # 執行測試
@vibe deploy                     # 部署應用

# 📝 完整指令 (專業用戶)
@vibecoding-context-manager start-clarification
@vibecoding-code-generator generate-code
@vibecoding-test-validator run-tests
@vibecoding-deployment-manager deploy-service
\`\`\`

## 📚 開發資源

- **VibeCoding 工具參考**: [VIBECODING_TOOLS_REFERENCE.md](https://github.com/vibecoding/vibecoding-template/blob/main/VIBECODING_TOOLS_REFERENCE.md)
- **IDE 設定指南**: [IDE_SETUP_GUIDE.md](https://github.com/vibecoding/vibecoding-template/blob/main/IDE_SETUP_GUIDE.md)
- **完整開發示範**: [DEMO_FINANCIAL_PLANNER.md](https://github.com/vibecoding/vibecoding-template/blob/main/DEMO_FINANCIAL_PLANNER.md)

## 🎯 快速開始

1. **配置 VibeCoding 環境**（如果尚未配置）
2. **在 Cursor 或 Claude Desktop 中開啟此專案**
3. **使用 \`@vibe start "${projectName}"\` 開始開發**
4. **跟隨 AI 引導完成整個開發流程**

---
*使用 VibeCoding Enhanced Project Creator 自動生成 • [了解更多](https://github.com/vibecoding/vibecoding-template)*`,

  '.gitignore': `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs  
dist/
build/
*.d.ts
*.js
*.js.map

# Keep important JS files (add as needed)
!scripts/*.js
!*.config.js

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
.nyc_output

# Temporary files
tmp/
temp/

# VibeCoding specific
test-project/
debug.txt`,

  'package.json': `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0", 
  "description": "使用 VibeCoding 開發的專案",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "echo \\"請使用 @vibe test 執行測試\\" && exit 1",
    "build": "echo \\"請使用 @vibe code 生成代碼\\" && exit 1",
    "deploy": "echo \\"請使用 @vibe deploy 部署應用\\" && exit 1"
  },
  "keywords": [
    "vibecoding",
    "ai-driven-development",
    "conversation-driven",
    "mvp",
    "poc"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {},
  "vibecoding": {
    "version": "1.0.0",
    "created": "${new Date().toISOString()}",
    "structure": "enhanced"
  }
}`,

  '0_discovery/README.md': `# 📋 Discovery Phase - 需求發現階段

## 🎯 階段目標
- 🔍 收集和澄清專案需求
- 📝 定義專案範圍和目標  
- ⚠️ 識別技術約束和風險
- 👥 了解目標用戶和使用情境

## 🛠️ VibeCoding 工具使用

### 🆕 簡潔指令 (推薦)
\`\`\`bash
# 開始專案澄清
@vibe start "${projectName}"

# 回答澄清問題
@vibe ask "你的回答內容"

# 生成產品需求文檔
@vibe prd

# 獲取 AI 洞察
@vibe insight "如何優化需求收集？"
\`\`\`

### 📝 完整指令 (專業用戶)
\`\`\`bash
# 開始專案澄清流程
@vibecoding-context-manager start-clarification --projectName "${projectName}"

# 提供澄清回答
@vibecoding-context-manager provide-clarification --questionIndex 0 --answer "回答內容"

# 生成 PRD
@vibecoding-context-manager generate-prd
\`\`\`

## 📁 資料夾結構說明

- **conversations/**: 與利害關係人的對話記錄
- **clarifications/**: 需求澄清問題與回答
- **requirements/**: 整理後的需求文檔和用戶故事

## ✅ 完成檢查清單

- [ ] 完成 7 個澄清問題
- [ ] 生成產品需求文檔 (PRD)
- [ ] 定義核心用戶故事
- [ ] 識別技術風險和限制
- [ ] 確定專案成功指標`,

  '1_design/README.md': `# 🎨 Design Phase - 設計階段

## 🎯 階段目標
- 🏗️ 設計系統整體架構
- 📡 定義 API 規格和介面
- 🗄️ 設計資料庫結構
- 🎨 規劃使用者介面

## 🛠️ VibeCoding 工具使用

### 🆕 簡潔指令 (推薦)
\`\`\`bash
# 生成實施計劃
@vibe plan

# 設計系統架構  
@vibe arch "微服務架構，使用 React + Node.js"

# 生成 API 設計
@vibe api "用戶管理和認證系統"

# 資料庫設計
@vibe db "用戶、商品、訂單表結構"
\`\`\`

### 📝 完整指令 (專業用戶)
\`\`\`bash
# 生成實施計劃
@vibecoding-context-manager generate-impl-plan --projectId "xxx"

# 生成代碼架構
@vibecoding-code-generator generate-code --requirements "系統架構" --codeType "service"
\`\`\`

## 📁 資料夾結構說明

- **architecture/**: 系統架構文檔和圖表
- **api-contracts/**: API 規格和合約定義
- **flow-diagrams/**: 系統流程圖和使用者流程

## ✅ 完成檢查清單

- [ ] 完成系統架構設計
- [ ] 定義主要 API 接口
- [ ] 設計資料庫結構
- [ ] 創建系統流程圖
- [ ] 確定技術選型`,

  '2_implementation/README.md': `# 💻 Implementation Phase - 實作階段

## 🎯 階段目標
- 🛠️ 撰寫核心程式碼
- 📡 實作 API 和服務
- 🔗 整合第三方服務
- 🧪 開發單元測試

## 🛠️ VibeCoding 工具使用

### 🆕 簡潔指令 (推薦)
\`\`\`bash
# 生成核心代碼
@vibe code "用戶認證系統"

# 生成 React 組件
@vibe comp "用戶個人資料頁面"

# 生成 API 接口
@vibe api "商品管理 CRUD API"

# 代碼審查
@vibe review "[你的代碼]"

# 重構代碼
@vibe refactor "提升性能和可讀性"
\`\`\`

### 📝 完整指令 (專業用戶)
\`\`\`bash
# 生成代碼
@vibecoding-code-generator generate-code --requirements "功能需求" --language "typescript" --framework "react"

# 代碼審查
@vibecoding-code-generator code-review --code "[代碼內容]" --focusAreas "['security', 'performance']"

# 重構代碼
@vibecoding-code-generator refactor-code --code "[代碼]" --refactorType "performance"
\`\`\`

## 📁 資料夾結構說明

- **src/**: 源代碼檔案
- **tests/**: 測試代碼和測試策略
- **scripts/**: 建構和部署腳本

## ✅ 完成檢查清單

- [ ] 完成核心功能開發
- [ ] 實作所有 API 接口
- [ ] 撰寫單元測試
- [ ] 完成代碼審查
- [ ] 處理錯誤和異常情況`,

  '3_validation/README.md': `# 🧪 Validation Phase - 驗證階段

## 🎯 階段目標
- 🧪 執行各種類型的測試
- 📊 進行代碼品質檢查
- ⚡ 評估系統性能
- 🔒 執行安全性檢查

## 🛠️ VibeCoding 工具使用

### 🆕 簡潔指令 (推薦)
\`\`\`bash
# 執行測試
@vibe test

# 檢查測試覆蓋率
@vibe cover

# 生成測試報告
@vibe report

# 性能測試
@vibe perf "API 負載測試"

# 安全掃描
@vibe scan
\`\`\`

### 📝 完整指令 (專業用戶)
\`\`\`bash
# 執行測試
@vibecoding-test-validator run-tests --projectPath "." --testType "all"

# 驗證覆蓋率
@vibecoding-test-validator validate-coverage --projectPath "." --threshold "{'lines': 80}"

# 性能測試
@vibecoding-test-validator performance-test --projectPath "." --testSuite "api"

# 安全掃描
@vibecoding-dependency-tracker security-scan --projectPath "." --severity "moderate"
\`\`\`

## 📁 資料夾結構說明

- **test-reports/**: 測試執行報告和結果
- **quality-metrics/**: 代碼品質指標和分析
- **benchmarks/**: 性能基準測試結果

## ✅ 完成檢查清單

- [ ] 單元測試覆蓋率 > 80%
- [ ] 整合測試全部通過
- [ ] 性能測試達到要求
- [ ] 安全掃描無高風險漏洞
- [ ] 代碼品質符合標準`,

  '4_deployment/README.md': `# 🚀 Deployment Phase - 部署階段

## 🎯 階段目標
- ⚙️ 配置部署環境
- 🔄 設定 CI/CD 流水線
- 📊 建立監控和日誌
- 🚀 執行正式部署

## 🛠️ VibeCoding 工具使用

### 🆕 簡潔指令 (推薦)
\`\`\`bash
# 配置部署環境
@vibe deploy

# 設定監控
@vibe monitor

# 設定告警
@vibe alert

# 回滾部署
@vibe rollback "v1.0.0"
\`\`\`

### 📝 完整指令 (專業用戶)
\`\`\`bash
# 部署服務
@vibecoding-deployment-manager deploy-service --projectPath "." --environment "production" --platform "docker"

# 設定監控
@vibecoding-deployment-manager setup-monitoring --projectPath "." --monitoringType "advanced"

# 配置告警
@vibecoding-deployment-manager configure-alerts --projectPath "." --channels "['email', 'slack']"

# 回滾部署
@vibecoding-deployment-manager rollback-deployment --projectPath "." --environment "production" --version "v1.0.0"
\`\`\`

## 📁 資料夾結構說明

- **environments/**: 不同環境的配置檔案
- **ci-cd/**: CI/CD 流水線配置
- **monitoring/**: 監控和告警設定

## ✅ 完成檢查清單

- [ ] 配置生產環境
- [ ] 設定 CI/CD 流水線
- [ ] 建立監控儀表板
- [ ] 配置告警規則
- [ ] 完成正式部署
- [ ] 驗證部署成功`,

  // === 模板檔案 ===
  '0_discovery/clarifications/questions_template.md': `# 需求澄清清單

## 🔍 VibeCoding 7 問澄清法

基於 VibeCoding 對話式開發理念，我們使用結構化的 7 問澄清法來深入理解您的需求：

### 🎯 問題 1: 核心問題定義
**這個專案主要解決什麼問題？請描述目標用戶和他們遇到的痛點。**

*範例回答格式：*
> 主要解決中小企業團隊任務分配不清、進度追蹤困難的問題。目標用戶是 10-50 人的團隊領導和成員，他們常常因為溝通不暢導致專案延期。

### 🎯 問題 2: 核心功能範圍  
**這個專案的核心功能有哪些？請列出 3-5 個最重要的功能。**

*範例回答格式：*
> 1. 任務創建和分配管理
> 2. 進度追蹤和狀態更新
> 3. 團隊協作和評論功能
> 4. 專案報告和統計分析

### 🎯 問題 3: 技術偏好和約束
**您對技術選型有什麼偏好或限制？（程式語言、框架、部署方式等）**

*範例回答格式：*
> 偏好使用 React + Node.js，需要支援雲端部署，團隊熟悉 JavaScript 技術棧。

### 🎯 問題 4: 用戶體驗期望
**您希望用戶在使用這個應用時有什麼樣的體驗？**

*範例回答格式：*
> 希望介面簡潔直觀，新用戶 5 分鐘內能上手，支援手機和電腦使用。

### 🎯 問題 5: 規模和性能要求
**預期的用戶規模和性能要求是什麼？**

*範例回答格式：*
> 初期支援 100 個用戶同時使用，頁面載入時間不超過 3 秒。

### 🎯 問題 6: 時程和資源限制
**專案的時間限制和可用資源是什麼？**

*範例回答格式：*
> 希望 3 個月內完成 MVP，有 2-3 名開發人員可投入。

### 🎯 問題 7: 成功標準定義
**如何衡量這個專案的成功？有什麼具體的指標嗎？**

*範例回答格式：*
> 成功標準：團隊任務完成率提升 30%，用戶滿意度達到 4.5/5 分，日活躍用戶達到 80%。

## 📋 澄清完成檢查清單

- [ ] 核心問題和用戶痛點已明確
- [ ] 主要功能範圍已界定
- [ ] 技術約束和偏好已確認
- [ ] 用戶體驗期望已理解
- [ ] 性能和規模要求已確定
- [ ] 時程和資源限制已明確
- [ ] 成功標準已定義

## 🎯 下一步行動

完成澄清後，請使用 \`@vibe prd\` 生成產品需求文檔 (PRD)。

---
*遵循 VibeCoding 對話驅動開發理念，通過結構化提問確保需求的完整性和準確性。*`,

  '0_discovery/requirements/user_stories_template.md': `# 用戶故事文檔

## 🎯 VibeCoding 用戶故事撰寫指南

基於對話式開發的理念，用戶故事是連接用戶需求和技術實現的橋樑。

## 👤 用戶角色定義

### 主要角色 (Primary Personas)
**請根據專案需求定義主要用戶角色**

範例：
- **專案管理者 (Project Manager)**
  - 需要總覽所有任務和進度
  - 負責分配任務和設定截止日期
  - 需要生成報告和統計數據

- **團隊成員 (Team Member)**
  - 查看分配給自己的任務
  - 更新任務狀態和進度
  - 與其他成員協作討論

## 📝 用戶故事撰寫格式

### 標準格式
**作為一個** [用戶角色]，**我希望** [功能描述]，**這樣** [業務價值]。

### 增強格式（推薦）
\`\`\`markdown
## Story: [故事標題]

**作為一個** [用戶角色]
**我希望** [功能描述]  
**這樣** [業務價值]

### 驗收標準 (Acceptance Criteria)
**Given** [前置條件]
**When** [用戶行為]
**Then** [預期結果]

### 定義完成 (Definition of Done)
- [ ] 功能開發完成
- [ ] 單元測試通過
- [ ] 集成測試通過
- [ ] 代碼審查完成
- [ ] 用戶驗收測試通過

### 估算
- **故事點**: [1-13]
- **優先級**: [High/Medium/Low]
- **依賴**: [相關故事或技術依賴]
```

## 🎯 用戶故事範例

### Epic 1: 用戶管理
**目標**: 提供完整的用戶註冊、登入和個人資料管理功能

#### Story 1.1: 用戶註冊
**作為一個** 新用戶
**我希望** 能夠快速註冊帳號
**這樣** 我就能開始使用系統的所有功能

**驗收標準:**
- **Given** 我是新用戶訪問註冊頁面
- **When** 我填寫有效的 email、密碼和基本資訊
- **Then** 系統應該創建我的帳號並發送驗證郵件

**定義完成:**
- [ ] 註冊表單驗證功能完成
- [ ] 郵件驗證機制實現
- [ ] 密碼安全性檢查
- [ ] 用戶資料加密存儲
- [ ] 註冊流程測試完成

**估算**: 5 點 | **優先級**: High

#### Story 1.2: 用戶登入
**作為一個** 註冊用戶
**我希望** 能夠安全地登入系統
**這樣** 我就能訪問我的個人資料和任務

**驗收標準:**
- **Given** 我有有效的帳號
- **When** 我輸入正確的 email 和密碼
- **Then** 系統應該驗證我的身份並導向主頁面

**定義完成:**
- [ ] JWT 認證機制實現
- [ ] 登入狀態持久化
- [ ] 錯誤處理和用戶反饋
- [ ] 安全性測試完成

**估算**: 3 點 | **優先級**: High

## 📊 故事管理

### 優先級分類
- **Must Have (高優先級)**: 核心功能，MVP 必需
- **Should Have (中優先級)**: 重要但非關鍵功能
- **Could Have (低優先級)**: 增值功能，時間允許時實現
- **Won't Have (暫不實現)**: 此版本不考慮的功能

### 故事狀態
- **Backlog**: 待開發
- **In Progress**: 開發中
- **Review**: 代碼審查中
- **Testing**: 測試中
- **Done**: 已完成

## 🔄 持續優化

### 故事回顧
每個 Sprint 結束後，回顧用戶故事的實現情況：
- 哪些故事按時完成？
- 哪些故事遇到了阻礙？
- 驗收標準是否清晰明確？
- 估算是否準確？

### 用戶反饋整合
- 收集真實用戶的使用反饋
- 根據反饋調整現有故事
- 識別新的用戶需求和故事

---
*遵循 VibeCoding 理念：用戶故事不只是需求文檔，更是團隊溝通和協作的工具。*`,

  '1_design/architecture/system_architecture.md': `# 系統架構設計文檔

## 🎯 架構概覽

基於 VibeCoding 設計階段的指導原則，本系統採用現代化的分層架構設計，確保可擴展性、可維護性和高性能。

## 🏗️ 系統架構圖

\\\`\\\`\\\`
┌─────────────────────────────────────┐
│           前端層 (React)              │
├─────────────────────────────────────┤
│           API 閘道層                  │
├─────────────────────────────────────┤
│     業務邏輯層 (Express Services)      │
├─────────────────────────────────────┤
│     資料訪問層 (Repository Pattern)    │
├─────────────────────────────────────┤
│        資料庫層 (PostgreSQL)          │
└─────────────────────────────────────┘
\\\`\\\`\\\`

## 🛠️ 技術棧選擇

### 前端技術
- **框架**: React 18 + TypeScript
- **狀態管理**: Redux Toolkit
- **UI 框架**: Ant Design + Tailwind CSS
- **建構工具**: Vite
- **測試**: Jest + React Testing Library

### 後端技術
- **運行環境**: Node.js 18+
- **Web 框架**: Express.js
- **資料庫**: PostgreSQL 14+
- **緩存**: Redis
- **認證**: JWT + bcrypt
- **API 文檔**: Swagger/OpenAPI

### 基礎設施
- **容器化**: Docker + Docker Compose
- **雲端平台**: AWS/Azure/GCP
- **CI/CD**: GitHub Actions
- **監控**: Prometheus + Grafana
- **日誌**: ELK Stack

## 📊 架構設計原則

### 1. 職責分離 (Separation of Concerns)
- 每層有明確的職責界線
- 避免跨層直接調用
- 使用依賴注入管理組件關係

### 2. 可測試性 (Testability)
- Repository Pattern 封裝資料存取
- 業務邏輯與基礎設施分離
- 支援單元測試和整合測試

### 3. 可擴展性 (Scalability)
- 水平擴展支援
- 微服務架構準備
- 資料庫讀寫分離

### 4. 安全性 (Security)
- API 層統一認證授權
- 資料傳輸加密 (HTTPS)
- 輸入驗證和 SQL 注入防護
- CORS 和 CSRF 保護

## 🔧 關鍵設計決策

### API 設計策略
- RESTful API 設計原則
- 統一的錯誤處理機制
- API 版本管理策略
- 請求限流和快取策略

### 資料庫設計策略
- 正規化設計減少資料冗餘
- 適當的索引優化查詢性能
- 資料備份和災難恢復計劃
- 資料遷移和版本控制

### 前端架構策略
- 組件化設計促進代碼重用
- 狀態管理最佳實踐
- 路由和權限控制
- 性能優化和懶載入

## 📈 性能考量

### 前端性能
- 代碼分割和懶載入
- 圖片優化和 CDN
- 瀏覽器緩存策略
- Bundle 大小優化

### 後端性能
- 資料庫連接池管理
- Redis 緩存策略
- API 回應時間優化
- 非同步處理機制

### 系統監控
- 應用性能監控 (APM)
- 錯誤追蹤和日誌分析
- 系統資源監控
- 用戶體驗監控

## 🔄 部署架構

### 開發環境
- Docker Compose 本地開發
- 熱重載和即時編譯
- 模擬資料和測試工具

### 測試環境
- 自動化部署流水線
- 整合測試和 E2E 測試
- 性能測試和負載測試

### 生產環境
- 容器化部署 (Kubernetes)
- 負載平衡和高可用性
- 自動擴展和監控告警
- 藍綠部署和滾動更新

---
*本架構設計遵循 VibeCoding 設計階段的最佳實踐，確保系統的可維護性和可擴展性。*`,

  '2_implementation/tests/test-strategy.md': `# 🧪 測試策略

## 📊 測試金字塔
1. **單元測試** (70%): 測試個別函數和組件
2. **整合測試** (20%): 測試組件間交互
3. **端到端測試** (10%): 測試完整用戶流程

## 🛠️ 工具選擇
- **Jest/Mocha**: 單元測試
- **Cypress/Playwright**: E2E測試
- **Supertest**: API 測試

## ✅ 測試檢查清單
- [ ] 測試覆蓋率 > 80%
- [ ] 所有 API 端點測試
- [ ] 關鍵用戶流程測試
- [ ] 錯誤處理測試`,

  '4_deployment/environments/deployment-guide.md': `# 🚀 部署指南

## 🎯 部署策略概覽

基於 VibeCoding 部署階段的最佳實踐，本指南提供完整的部署流程和環境管理策略。

## 🏗️ 環境分層架構

### 開發環境 (Development)
- **目的**: 本地開發和功能驗證
- **特點**: 快速迭代，完整功能模擬
- **工具**: Docker Compose + 本地資料庫
- **資料**: 模擬資料和測試資料集

### 測試環境 (Staging)
- **目的**: 集成測試和預發布驗證
- **特點**: 生產環境的完整複製
- **工具**: Kubernetes + 雲端資料庫
- **資料**: 脫敏的生產資料副本

### 生產環境 (Production)
- **目的**: 正式服務和用戶訪問
- **特點**: 高可用性和性能優化
- **工具**: Kubernetes + 分散式架構
- **資料**: 真實業務資料

## 🔄 CI/CD 流水線

### 持續集成 (CI)
\`\`\`yaml
# .github/workflows/ci.yml
name: Continuous Integration
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - run: npm run test:e2e
\`\`\`

### 持續部署 (CD)
\`\`\`yaml
# .github/workflows/cd.yml
name: Continuous Deployment
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: kubectl apply -f k8s/staging/
      - name: Run Integration Tests
        run: npm run test:integration
      - name: Deploy to Production
        if: success()
        run: kubectl apply -f k8s/production/
\`\`\`

## 🐳 容器化部署

### Dockerfile 最佳實踐
\`\`\`dockerfile
# 多階段建構優化映像大小
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Docker Compose 開發環境
\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
\`\`\`

## ☸️ Kubernetes 部署

### 部署配置
\`\`\`yaml
# k8s/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
\`\`\`

### 服務配置
\`\`\`yaml
# k8s/service.yml
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
\`\`\`

## 📊 監控和告警

### Prometheus 監控配置
\`\`\`yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app-service:3000']
    metrics_path: '/metrics'
\`\`\`

### Grafana 儀表板
- **應用性能**: 回應時間、吞吐量、錯誤率
- **系統資源**: CPU、記憶體、磁碟使用率
- **業務指標**: 用戶活躍度、功能使用統計

### 告警規則
\`\`\`yaml
# alerts/rules.yml
groups:
  - name: app.rules
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
\`\`\`

## 🔒 安全性配置

### SSL/TLS 設定
- 使用 Let's Encrypt 自動化憑證管理
- 強制 HTTPS 重導向
- HSTS 標頭配置

### 網路安全
- 防火牆規則配置
- VPC 網路隔離
- API 速率限制

### 資料安全
- 敏感資料加密存儲
- 資料庫連接加密
- 定期安全掃描

## 📋 部署檢查清單

### 部署前檢查
- [ ] 所有測試通過 (單元測試、集成測試、E2E 測試)
- [ ] 代碼審查完成
- [ ] 安全掃描通過
- [ ] 性能測試達標
- [ ] 資料庫遷移腳本準備
- [ ] 環境變數配置確認
- [ ] 備份計劃確認

### 部署中監控
- [ ] 部署進度監控
- [ ] 健康檢查通過
- [ ] 日誌監控正常
- [ ] 關鍵功能驗證
- [ ] 性能指標正常

### 部署後驗證
- [ ] 所有服務正常運行
- [ ] 用戶訪問正常
- [ ] 監控告警配置生效
- [ ] 備份機制運作正常
- [ ] 文檔更新完成

## 🔄 回滾策略

### 自動回滾觸發條件
- 健康檢查失敗
- 錯誤率超過閾值
- 關鍵功能不可用
- 性能指標異常

### 回滾執行步驟
1. 停止當前部署
2. 恢復到上一個穩定版本
3. 驗證回滾結果
4. 通知相關團隊
5. 分析失敗原因

## 🚀 持續改進

### 部署指標追蹤
- 部署頻率
- 部署成功率
- 平均修復時間 (MTTR)
- 變更失敗率

### 流程優化
- 定期回顧部署流程
- 自動化程度提升
- 監控告警優化
- 團隊培訓和知識分享

  ---
*遵循 VibeCoding 部署階段最佳實踐，確保部署的可靠性和可維護性。*`,

  // === VibeCoding 專用文件 ===
  '.vibecoding/conversations/README.md': `# VibeCoding 對話記錄

## 🎯 對話驅動開發記錄

本資料夾記錄與 VibeCoding AI 助手的所有重要對話和決策過程。

### 📁 檔案組織
- \`session-YYYY-MM-DD-HH-MM.md\` - 對話會話記錄
- \`decisions-YYYY-MM-DD.md\` - 重要決策記錄
- \`insights-YYYY-MM-DD.md\` - AI 洞察和建議

### 🔍 對話記錄格式
\`\`\`markdown
# 對話會話 - YYYY-MM-DD HH:MM

## 📋 會話資訊
- **日期**: YYYY-MM-DD HH:MM
- **階段**: Discovery/Design/Implementation/Validation/Deployment
- **參與者**: 用戶, VibeCoding Assistant
- **主題**: [會話主要討論內容]

## 💬 關鍵對話
[記錄重要的對話內容和決策]

## 🎯 行動項目
- [ ] 待完成的任務
- [ ] 需要澄清的問題
- [ ] 下次會話的重點

## 📝 備註
[其他重要備註]
\`\`\``,

  '.vibecoding/decisions/README.md': `# 技術決策記錄 (ADR)

## 🎯 決策驅動開發

記錄專案中所有重要的技術和設計決策，確保決策過程透明且可追溯。

### 📋 決策記錄格式
\`\`\`markdown
# ADR-001: [決策標題]

## 狀態
提議中 / 已接受 / 已廢棄 / 已取代

## 背景
[描述需要做決策的背景和問題]

## 決策
[描述具體的決策內容]

## 理由
[說明做出此決策的原因和考量]

## 後果
[描述此決策的正面和負面影響]

## 替代方案
[列出曾經考慮過的其他選項]
\`\`\`

### 🔗 相關資源
- [ADR 最佳實踐](https://github.com/joelparkerhenderson/architecture-decision-record)
- [VibeCoding 決策指南](https://vibecoding.com/docs/decisions)`,

  '.vibecoding/insights/README.md': `# AI 洞察和建議

## 🤖 智能建議記錄

記錄 VibeCoding AI 助手提供的重要洞察、建議和最佳實踐。

### 📁 檔案組織
- \`insights-YYYY-MM-DD.md\` - 日常洞察記錄
- \`best-practices.md\` - 累積的最佳實踐
- \`lessons-learned.md\` - 經驗教訓總結

### 🎯 洞察記錄格式
\`\`\`markdown
# AI 洞察 - YYYY-MM-DD

## 🔍 問題或挑戰
[描述遇到的問題或挑戰]

## 🤖 AI 建議
[記錄 AI 提供的建議和解決方案]

## 💡 關鍵洞察
[提煉出的關鍵洞察和學習點]

## 🎯 行動計劃
[基於洞察制定的具體行動計劃]

## 📊 影響評估
[評估建議的潛在影響和價值]
\`\`\``,

  'knowledge-base/patterns/README.md': `# 設計模式和架構模式

## 🏗️ 可重用的解決方案

記錄專案中使用的設計模式、架構模式和最佳實踐，促進知識重用。

### 📋 模式分類
- **創建型模式**: 工廠模式、建造者模式、單例模式
- **結構型模式**: 適配器模式、裝飾者模式、外觀模式
- **行為型模式**: 觀察者模式、策略模式、命令模式
- **架構模式**: MVC、MVP、MVVM、分層架構

### 🎯 模式記錄格式
\`\`\`markdown
# [模式名稱]

## 🎯 問題
[描述此模式解決的問題]

## 💡 解決方案
[描述模式的核心解決方案]

## 🔧 實現範例
[提供具體的代碼範例]

## ✅ 適用場景
[說明何時使用此模式]

## ⚠️ 注意事項
[使用此模式的注意事項和限制]
\`\`\``,

  'knowledge-base/solutions/README.md': `# 解決方案庫

## 🔧 問題解決方案集

記錄專案開發過程中遇到的問題和對應的解決方案，建立團隊知識庫。

### 📁 分類組織
- \`frontend/\` - 前端相關解決方案
- \`backend/\` - 後端相關解決方案
- \`database/\` - 資料庫相關解決方案
- \`deployment/\` - 部署相關解決方案
- \`performance/\` - 性能優化解決方案
- \`security/\` - 安全相關解決方案

### 🎯 解決方案格式
\`\`\`markdown
# [問題標題]

## 🔍 問題描述
[詳細描述遇到的問題]

## 🎯 解決方案
[提供具體的解決步驟和代碼]

## 🔧 實現細節
[詳細的實現說明和配置]

## ✅ 驗證方法
[如何驗證解決方案的有效性]

## 📚 相關資源
[相關文檔、工具和參考資料]

## 🏷️ 標籤
[相關的技術標籤和分類]
\`\`\``,

  'knowledge-base/retrospectives/README.md': `# 專案回顧

## 🔄 持續改進記錄

記錄專案各階段的回顧總結，促進團隊學習和流程改進。

### 📅 回顧週期
- **Sprint 回顧**: 每個開發週期結束後
- **階段回顧**: 每個開發階段完成後
- **專案回顧**: 整個專案完成後

### 🎯 回顧格式
\`\`\`markdown
# [階段/Sprint] 回顧 - YYYY-MM-DD

## 📊 數據總結
- **計劃任務**: X 個
- **完成任務**: Y 個
- **完成率**: Z%
- **主要成就**: [列出主要成就]

## 🎯 做得好的地方
[列出團隊做得好的方面]

## 🔧 需要改進的地方
[列出需要改進的方面]

## 💡 學到的經驗
[記錄重要的學習和洞察]

## 🎯 下階段行動計劃
[基於回顧制定的改進計劃]

## 📝 其他備註
[其他重要備註和觀察]
\`\`\``,

  'VIBECODING_WORKFLOW.md': `# VibeCoding 工作流程指南

## 🎯 對話驅動開發流程

歡迎使用 VibeCoding！本指南將帶您完整體驗對話驅動的開發流程。

## 🚀 快速開始

### 1️⃣ 專案初始化
\`\`\`bash
# 開始專案澄清對話
@vibe start "${projectName}"

# 或使用完整指令
@vibecoding-context-manager start-clarification --projectName "${projectName}"
\`\`\`

### 2️⃣ 需求澄清 (Discovery Phase)
\`\`\`bash
# 回答澄清問題
@vibe ask "您的回答內容"

# 生成產品需求文檔
@vibe prd

# 獲取 AI 洞察
@vibe insight "如何優化需求收集？"
\`\`\`

### 3️⃣ 系統設計 (Design Phase)
\`\`\`bash
# 生成實施計劃
@vibe plan

# 設計系統架構
@vibe arch "微服務架構，使用 React + Node.js"

# 設計 API 接口
@vibe api "用戶管理和認證系統"

# 設計資料庫
@vibe db "用戶、商品、訂單表結構"
\`\`\`

### 4️⃣ 代碼實現 (Implementation Phase)
\`\`\`bash
# 生成核心代碼
@vibe code "用戶認證系統"

# 生成 React 組件
@vibe comp "用戶個人資料頁面"

# 代碼審查
@vibe review "[您的代碼]"

# 重構優化
@vibe refactor "提升性能和可讀性"
\`\`\`

### 5️⃣ 測試驗證 (Validation Phase)
\`\`\`bash
# 執行測試
@vibe test

# 檢查覆蓋率
@vibe cover

# 生成測試報告
@vibe report

# 性能測試
@vibe perf "API 負載測試"

# 安全掃描
@vibe scan
\`\`\`

### 6️⃣ 部署上線 (Deployment Phase)
\`\`\`bash
# 配置部署
@vibe deploy

# 設定監控
@vibe monitor

# 配置告警
@vibe alert

# 回滾部署
@vibe rollback "v1.0.0"
\`\`\`

## 📋 階段檢查清單

### ✅ Discovery Phase 完成標準
- [ ] 完成 7 個澄清問題
- [ ] 生成產品需求文檔 (PRD)
- [ ] 定義核心用戶故事
- [ ] 識別技術風險和限制
- [ ] 確定專案成功指標

### ✅ Design Phase 完成標準
- [ ] 完成系統架構設計
- [ ] 定義主要 API 接口
- [ ] 設計資料庫結構
- [ ] 創建系統流程圖
- [ ] 確定技術選型

### ✅ Implementation Phase 完成標準
- [ ] 完成核心功能開發
- [ ] 實作所有 API 接口
- [ ] 撰寫單元測試
- [ ] 完成代碼審查
- [ ] 處理錯誤和異常情況

### ✅ Validation Phase 完成標準
- [ ] 單元測試覆蓋率 > 80%
- [ ] 整合測試全部通過
- [ ] 性能測試達到要求
- [ ] 安全掃描無高風險漏洞
- [ ] 代碼品質符合標準

### ✅ Deployment Phase 完成標準
- [ ] 配置生產環境
- [ ] 設定 CI/CD 流水線
- [ ] 建立監控儀表板
- [ ] 配置告警規則
- [ ] 完成正式部署
- [ ] 驗證部署成功

## 🎯 最佳實踐

### 💬 對話技巧
1. **明確表達需求**: 提供具體、詳細的描述
2. **積極回饋**: 及時回應 AI 的澄清問題
3. **迭代改進**: 基於 AI 建議持續優化
4. **記錄決策**: 保存重要的對話和決策記錄

### 📝 文檔管理
1. **及時更新**: 保持文檔與實際開發同步
2. **結構化組織**: 使用清晰的資料夾結構
3. **版本控制**: 追蹤文檔的變更歷史
4. **知識分享**: 與團隊成員分享重要洞察

### 🔄 持續改進
1. **定期回顧**: 每個階段結束後進行回顧
2. **收集反饋**: 聽取團隊和用戶的意見
3. **優化流程**: 基於經驗改進工作流程
4. **知識積累**: 建立團隊知識庫

## 🚀 進階功能

### 🤖 AI 洞察
使用 \`@vibe insight\` 獲取針對性的建議：
- 技術選型建議
- 架構設計優化
- 性能改進方案
- 安全最佳實踐

### 📊 專案分析
定期使用分析功能：
- 依賴關係分析
- 代碼品質評估
- 性能基準測試
- 安全漏洞掃描

### 🔗 整合工具
與其他工具整合：
- Git 版本控制
- CI/CD 流水線
- 監控和告警系統
- 專案管理工具

---

*享受 VibeCoding 帶來的智能開發體驗！有任何問題請使用 \`@vibe insight\` 獲取幫助。*`
};

// 🚀 主要執行函數
async function createEnhancedProject() {
  try {
    console.log(`📁 正在建立專案結構於: ${projectPath}`);
    console.log(`📝 專案名稱: ${projectName}\n`);

    // 建立目錄結構
    console.log('📁 建立目錄結構...');
    await createDirectoryStructure(projectPath, PROJECT_STRUCTURE);
    
    // 建立模板檔案
    console.log('📄 建立模板檔案...');
    await createTemplateFiles(projectPath, TEMPLATE_FILES);
    
    // 顯示成功訊息
    displaySuccessMessage();
    
  } catch (error) {
    console.error('❌ 建立專案結構時發生錯誤:', error.message);
    process.exit(1);
  }
}

// 遞迴建立目錄結構
async function createDirectoryStructure(basePath, structure) {
  for (const [key, value] of Object.entries(structure)) {
    const dirPath = path.join(basePath, key);
    await fs.ensureDir(dirPath);
    
    if (typeof value === 'object' && Object.keys(value).length > 0) {
      await createDirectoryStructure(dirPath, value);
    }
  }
}

// 建立模板檔案
async function createTemplateFiles(basePath, files) {
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(basePath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf8');
  }
}

// 顯示成功訊息和下一步指引
function displaySuccessMessage() {
  console.log('\n🎉 VibeCoding Enhanced Project Structure 建立完成！');
  console.log('\n✅ 已自動創建：');
  console.log('   📁 5個開發階段資料夾 + 完整子資料夾結構');
  console.log('   📄 專業模板和開發指南');
  console.log('   🧪 測試策略和部署指南');
  console.log('   📋 README.md 和配置檔案');
  console.log('   🚀 VibeCoding 快速開發指引');
  
  console.log('\n🎯 下一步：');
  console.log(`   1. 在 Cursor 或 Claude Desktop 中開啟專案`);
  console.log(`   2. 使用 @vibe start "${projectName}" 開始開發`);
  console.log(`   3. 跟隨 AI 引導完成整個開發流程`);
  
  console.log('\n📚 更多資源：');
  console.log('   • VibeCoding 工具參考: https://github.com/vibecoding/vibecoding-template/blob/main/VIBECODING_TOOLS_REFERENCE.md');
  console.log('   • IDE 設定指南: https://github.com/vibecoding/vibecoding-template/blob/main/IDE_SETUP_GUIDE.md');
  console.log('   • 完整開發示範: https://github.com/vibecoding/vibecoding-template/blob/main/DEMO_FINANCIAL_PLANNER.md');
  
  console.log('\n🚀 開始享受 AI 驅動的對話式開發體驗！');
}

// 執行腳本
createEnhancedProject(); 