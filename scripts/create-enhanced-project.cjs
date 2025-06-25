#!/usr/bin/env node

/**
 * VibeCoding 增強專案結構創建工具
 * 整合 design_templates 的專業模板
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

function log(message, color = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function createPhaseTemplates(phase, phasePath) {
  switch (phase) {
    case '0_discovery':
      createDiscoveryTemplates(phasePath);
      break;
    case '1_design':
      createDesignTemplates(phasePath);
      break;
    case '2_implementation':
      createImplementationTemplates(phasePath);
      break;
    case '3_validation':
      createValidationTemplates(phasePath);
      break;
    case '4_deployment':
      createDeploymentTemplates(phasePath);
      break;
  }
}

function createDiscoveryTemplates(phasePath) {
  // 專案簡報模板
  const projectBriefTemplate = `# 專案簡報 / PRD 摘要

**專案名稱**: [請填寫專案名稱]
**版本**: v0.1
**最後更新**: ${new Date().toISOString().split('T')[0]}
**負責人**: [請填寫負責人]

## 1. 專案概述

### 1.1 一行說明
[用一句話描述專案的核心價值]

### 1.2 問題陳述
[描述要解決的問題]

### 1.3 建議解決方案
[簡要概述解決方案]

### 1.4 目標用戶
- **主要用戶**: [描述主要用戶特徵]
- **次要用戶**: [描述次要用戶特徵]

## 2. 核心功能

| ID | 功能名稱 | 描述 | 優先級 |
|----|----------|------|---------|
| F-001 | [功能1] | [描述] | P0 |
| F-002 | [功能2] | [描述] | P1 |

## 3. 成功指標

- **目標1**: [具體指標]
- **目標2**: [具體指標]

---
*此文檔基於 VibeCoding design_templates 優化*
`;

  // 功能需求模板
  const functionalReqTemplate = `# 功能需求規格書

**專案名稱**: [填寫專案名稱]
**文件版本**: v0.1
**最後更新**: ${new Date().toISOString().split('T')[0]}

## 功能需求

### FR-001: [功能分類]

#### FR-001.1: [具體功能]
- **描述**: [功能描述]
- **用戶角色**: [目標用戶]
- **驗收標準**:
  - [ ] [標準1]
  - [ ] [標準2]

## 非功能需求

### 性能需求
- API 響應時間: < 200ms
- 系統可用性: 99.9%

### 安全需求  
- 數據加密: TLS 1.3+
- 身份驗證: OAuth 2.0

---
*基於 VibeCoding 專業模板*
`;

  // 寫入模板檔案
  fs.writeFileSync(path.join(phasePath, 'clarifications', 'project_brief.md'), projectBriefTemplate);
  fs.writeFileSync(path.join(phasePath, 'requirements', 'functional_requirements.md'), functionalReqTemplate);
  
  log(`  📄 創建 Discovery 階段模板`, COLORS.GREEN);
}

function createDesignTemplates(phasePath) {
  // 系統架構模板
  const architectureTemplate = `# 系統架構設計文檔

**專案名稱**: [填寫專案名稱]
**文件版本**: v0.1
**最後更新**: ${new Date().toISOString().split('T')[0]}

## 1. 架構概述

### 1.1 架構目標
- **高可用性**: 99.9% SLA
- **可擴展性**: 支持水平擴展
- **高性能**: API 響應時間 < 200ms

### 1.2 設計原則
1. API 優先設計
2. 微服務架構
3. 事件驅動
4. 無狀態服務

## 2. 技術選型

### 2.1 前端技術棧
- **框架**: [選擇前端框架]
- **狀態管理**: [選擇狀態管理方案]

### 2.2 後端技術棧
- **語言**: [選擇後端語言]
- **框架**: [選擇後端框架]
- **資料庫**: [選擇資料庫]

## 3. 架構圖

\`\`\`mermaid
graph TD
    A[前端應用] --> B[API 閘道]
    B --> C[業務服務]
    C --> D[資料庫]
\`\`\`

---
*基於 VibeCoding design_templates 優化*
`;

  // ADR 模板
  const adrTemplate = `# ADR-001: [決策標題]

**狀態**: 建議中
**決策日期**: ${new Date().toISOString().split('T')[0]}
**決策者**: [決策者姓名]

## 摘要
[簡短描述決策]

## 背景
[描述需要做決策的背景]

## 決策
[描述做出的決策]

## 考慮的替代方案
- **方案A**: [描述] - [未選擇原因]
- **方案B**: [描述] - [未選擇原因]

## 影響
- **正面影響**: [列出正面影響]
- **負面影響**: [列出權衡]

---
*此 ADR 整合到 VibeCoding 架構文檔中*
`;

  // 寫入模板檔案
  fs.writeFileSync(path.join(phasePath, 'architecture', 'system_architecture.md'), architectureTemplate);
  fs.writeFileSync(path.join(phasePath, 'adrs', 'adr-template.md'), adrTemplate);
  
  log(`  🎨 創建 Design 階段模板`, COLORS.GREEN);
}

function createImplementationTemplates(phasePath) {
  // 開發指南模板
  const devGuideTemplate = `# 開發實施指南

**專案名稱**: [填寫專案名稱]
**最後更新**: ${new Date().toISOString().split('T')[0]}

## 開發環境設置

### 必備工具
- Node.js >= 18.0
- Git >= 2.30
- Docker >= 20.0

### 環境變數
\`\`\`bash
export NODE_ENV=development
export DATABASE_URL=postgresql://localhost:5432/myapp
export JWT_SECRET=your-secret-key
\`\`\`

## 代碼規範

### 命名規則
- 檔案名稱: kebab-case
- 類別名稱: PascalCase  
- 函數名稱: camelCase
- 常數: UPPER_SNAKE_CASE

### Git 工作流程
\`\`\`bash
# 提交格式
feat(api): add user authentication [#123]
fix(database): resolve connection timeout [#124]
\`\`\`

## 測試標準
- 單元測試覆蓋率 ≥ 90%
- 整合測試必須通過
- E2E 測試覆蓋主要流程

---
*基於 VibeCoding 開發最佳實踐*
`;

  // API 設計模板
  const apiDesignTemplate = `# API 設計規範

## 標準回應格式

### 成功回應
\`\`\`json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2023-XX-XX",
    "version": "v1"
  }
}
\`\`\`

### 錯誤回應
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
\`\`\`

## API 端點範例

\`\`\`javascript
// 用戶 API
GET    /api/v1/users       # 獲取用戶列表
GET    /api/v1/users/:id   # 獲取特定用戶
POST   /api/v1/users       # 創建用戶
PUT    /api/v1/users/:id   # 更新用戶
DELETE /api/v1/users/:id   # 刪除用戶
\`\`\`

---
*遵循 RESTful 設計原則*
`;

  // 寫入模板檔案
  fs.writeFileSync(path.join(phasePath, 'scripts', 'development_guide.md'), devGuideTemplate);
  fs.writeFileSync(path.join(phasePath, 'src', 'api_design.md'), apiDesignTemplate);
  
  log(`  🔧 創建 Implementation 階段模板`, COLORS.GREEN);
}

function createValidationTemplates(phasePath) {
  // 測試策略模板
  const testStrategyTemplate = `# 測試策略

**專案名稱**: [填寫專案名稱]
**最後更新**: ${new Date().toISOString().split('T')[0]}

## 測試金字塔

### 單元測試 (70%)
- 測試個別函數和類別
- 覆蓋率目標: ≥ 90%
- 工具: Jest, Vitest

### 整合測試 (20%)
- 測試組件間交互
- 資料庫整合測試
- API 端點測試

### E2E 測試 (10%)
- 完整用戶流程測試
- 跨瀏覽器測試
- 工具: Playwright, Cypress

## 測試環境

### 測試資料管理
- 使用測試專用資料庫
- 每次測試前重置資料
- 使用工廠模式創建測試資料

## 品質門檻

- [ ] 所有測試必須通過
- [ ] 代碼覆蓋率 ≥ 90%
- [ ] 無安全漏洞
- [ ] 性能測試達標

---
*基於 VibeCoding 測試最佳實踐*
`;

  fs.writeFileSync(path.join(phasePath, 'test-reports', 'test_strategy.md'), testStrategyTemplate);
  log(`  🧪 創建 Validation 階段模板`, COLORS.GREEN);
}

function createDeploymentTemplates(phasePath) {
  // 部署指南模板
  const deploymentGuideTemplate = `# 部署指南

**專案名稱**: [填寫專案名稱]
**最後更新**: ${new Date().toISOString().split('T')[0]}

## 部署架構

### 環境層級
- **開發環境** (Development)
- **測試環境** (Staging)  
- **生產環境** (Production)

### 容器化部署

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  
  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=myapp
\`\`\`

## CI/CD 流程

### GitHub Actions

\`\`\`yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Test
        run: |
          npm ci
          npm test
          npm run build
      - name: Deploy
        run: echo "部署到生產環境"
\`\`\`

## 監控設置

### 關鍵指標
- 應用程式可用性
- API 響應時間
- 錯誤率
- 資源使用率

---
*基於 VibeCoding 部署最佳實踐*
`;

  fs.writeFileSync(path.join(phasePath, 'environments', 'deployment_guide.md'), deploymentGuideTemplate);
  log(`  🚀 創建 Deployment 階段模板`, COLORS.GREEN);
}

function createEnhancedProjectStructure(projectPath = null) {
  const targetPath = projectPath || process.cwd();
  log('\n🏗️  創建 VibeCoding 增強專案結構...', COLORS.BLUE + COLORS.BOLD);
  
  try {
    // 創建 VibeCoding 開發階段資料夾
    const phaseFolders = [
      '0_discovery',
      '1_design', 
      '2_implementation',
      '3_validation',
      '4_deployment'
    ];
    
    // 創建基本專案資料夾
    const basicFolders = [
      'src',
      'tests', 
      'docs',
      'config'
    ];
    
    log(`📍 目標路徑: ${targetPath}`, COLORS.YELLOW);
    
    // 創建階段資料夾及其子資料夾和模板
    phaseFolders.forEach(phase => {
      const phasePath = path.join(targetPath, phase);
      if (!fs.existsSync(phasePath)) {
        fs.mkdirSync(phasePath, { recursive: true });
        log(`✅ 創建階段資料夾: ${phase}`, COLORS.GREEN);
        
        // 為每個階段創建子資料夾
        switch (phase) {
          case '0_discovery':
            ['conversations', 'clarifications', 'requirements'].forEach(subfolder => {
              fs.mkdirSync(path.join(phasePath, subfolder), { recursive: true });
            });
            break;
          case '1_design':
            ['architecture', 'api-contracts', 'flow-diagrams', 'adrs'].forEach(subfolder => {
              fs.mkdirSync(path.join(phasePath, subfolder), { recursive: true });
            });
            break;
          case '2_implementation':
            ['src', 'tests', 'scripts'].forEach(subfolder => {
              fs.mkdirSync(path.join(phasePath, subfolder), { recursive: true });
            });
            break;
          case '3_validation':
            ['test-reports', 'quality-metrics', 'benchmarks'].forEach(subfolder => {
              fs.mkdirSync(path.join(phasePath, subfolder), { recursive: true });
            });
            break;
          case '4_deployment':
            ['environments', 'ci-cd', 'monitoring'].forEach(subfolder => {
              fs.mkdirSync(path.join(phasePath, subfolder), { recursive: true });
            });
            break;
        }
        
        // 創建專業模板
        createPhaseTemplates(phase, phasePath);
        
      } else {
        log(`⚠️  階段資料夾已存在: ${phase}`, COLORS.YELLOW);
      }
    });
    
    // 創建基本專案資料夾
    basicFolders.forEach(folder => {
      const folderPath = path.join(targetPath, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        log(`✅ 創建基本資料夾: ${folder}`, COLORS.GREEN);
      } else {
        log(`⚠️  基本資料夾已存在: ${folder}`, COLORS.YELLOW);
      }
    });
    
    // 創建增強版 README
    const readmePath = path.join(targetPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      const readmeContent = `# VibeCoding 專案

本專案使用 VibeCoding 對話式開發框架，整合了專業的軟體開發模板。

## 🎯 開發階段

- \`0_discovery/\` - **需求探索**: 澄清需求、定義專案範圍
- \`1_design/\` - **系統設計**: 架構設計、技術選型、ADR 記錄
- \`2_implementation/\` - **代碼實現**: 開發實作、代碼品質保證
- \`3_validation/\` - **測試驗證**: 品質測試、性能驗證
- \`4_deployment/\` - **部署運維**: 部署配置、監控運維

## 🚀 快速開始

### 1. 使用 VibeCoding AI 助手
\`\`\`bash
# 在 Cursor IDE 或 Claude Desktop 中：
@vibe start "我的專案名稱"
\`\`\`

### 2. 傳統開發流程
\`\`\`bash
# 1. 填寫專案簡報
# 編輯 0_discovery/clarifications/project_brief.md

# 2. 定義功能需求  
# 編輯 0_discovery/requirements/functional_requirements.md

# 3. 設計系統架構
# 編輯 1_design/architecture/system_architecture.md

# 4. 開始開發
# 參考 2_implementation/scripts/development_guide.md
\`\`\`

## 📚 文檔結構

每個階段都包含專業模板和指引：

### 0_discovery (需求探索)
- \`project_brief.md\` - 專案簡報模板
- \`functional_requirements.md\` - 功能需求規格

### 1_design (系統設計)  
- \`system_architecture.md\` - 系統架構文檔
- \`adr-template.md\` - 架構決策記錄模板

### 2_implementation (代碼實現)
- \`development_guide.md\` - 開發指南
- \`api_design.md\` - API 設計規範

### 3_validation (測試驗證)
- \`test_strategy.md\` - 測試策略

### 4_deployment (部署運維)
- \`deployment_guide.md\` - 部署指南

## 🛠️ 技術標準

本專案遵循以下技術標準：
- **代碼品質**: SOLID 原則、設計模式
- **測試覆蓋**: 單元測試 ≥ 90%
- **安全標準**: OWASP 安全指引
- **性能要求**: API 響應時間 < 200ms
- **可用性**: 99.9% SLA

## 📖 更多資源

- [VibeCoding 官方文檔](https://vibecoding.dev)
- [開發最佳實踐](./docs/)
- [API 參考文檔](./1_design/api-contracts/)

---
*本專案結構基於 VibeCoding design_templates 優化*
`;
      fs.writeFileSync(readmePath, readmeContent);
      log(`✅ 創建增強版 README.md`, COLORS.GREEN);
    }

    // 創建 .gitignore
    const gitignorePath = path.join(targetPath, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      const gitignoreContent = `node_modules/
dist/
build/
.env
.env.local
.env.*.local
.DS_Store
*.log
coverage/
.nyc_output/
.vscode/
.idea/
*.swp
*.swo
`;
      fs.writeFileSync(gitignorePath, gitignoreContent);
      log(`✅ 創建 .gitignore`, COLORS.GREEN);
    }
    
    log('\n🎉 VibeCoding 增強專案結構創建完成！', COLORS.GREEN + COLORS.BOLD);
    
    // 顯示創建的結構
    log('\n📁 創建的專案結構：', COLORS.BLUE);
    log('├── 0_discovery/              # 需求探索階段');
    log('│   ├── clarifications/       # 澄清文檔 (含專案簡報模板)');
    log('│   └── requirements/         # 需求文檔 (含功能需求模板)');
    log('├── 1_design/                 # 設計階段');
    log('│   ├── architecture/         # 架構設計 (含架構文檔模板)');
    log('│   └── adrs/                 # 架構決策記錄');  
    log('├── 2_implementation/         # 實作階段');
    log('│   ├── src/                  # API 設計規範');
    log('│   └── scripts/              # 開發指南');
    log('├── 3_validation/             # 驗證階段');
    log('│   └── test-reports/         # 測試策略模板');
    log('├── 4_deployment/             # 部署階段');
    log('│   └── environments/         # 部署指南模板');
    log('├── src/                      # 主要源代碼');
    log('├── tests/                    # 測試文件');
    log('├── docs/                     # 文檔');
    log('├── config/                   # 配置文件');
    log('├── README.md                 # 增強版專案說明');
    log('└── .gitignore                # Git 忽略文件');
    
    log('\n🎯 開發流程建議：', COLORS.BLUE);
    log('1. 📋 填寫專案簡報: 0_discovery/clarifications/project_brief.md');
    log('2. 📝 定義功能需求: 0_discovery/requirements/functional_requirements.md');  
    log('3. 🎨 設計系統架構: 1_design/architecture/system_architecture.md');
    log('4. 🔧 開始編碼實現: 參考 2_implementation/scripts/development_guide.md');
    log('5. 🧪 執行測試驗證: 參考 3_validation/test-reports/test_strategy.md');
    log('6. 🚀 部署上線運維: 參考 4_deployment/environments/deployment_guide.md');
    
    log('\n💡 使用 VibeCoding AI：', COLORS.YELLOW);
    log('@vibe start "我的專案名稱"  # 開始對話式開發');
    log('@vibe design              # 進入設計階段');
    log('@vibe implement           # 進入開發階段');
    
  } catch (error) {
    log(`❌ 創建專案結構失敗: ${error.message}`, COLORS.RED);
    console.error(error);
    process.exit(1);
  }
}

function main() {
  log('🏗️  VibeCoding 增強專案結構創建工具', COLORS.BLUE + COLORS.BOLD);
  log('============================================');
  log('整合 design_templates 專業模板', COLORS.YELLOW);
  
  const args = process.argv.slice(2);
  const projectPath = args[0] || null;
  
  if (args.includes('--help') || args.includes('-h')) {
    log('\n📖 使用說明：');
    log('node scripts/create-enhanced-project.cjs [專案路徑]');
    log('\n✨ 功能特色：');
    log('• 完整的 VibeCoding 5 階段資料夾結構');
    log('• 整合 design_templates 專業模板');
    log('• 包含開發指南、測試策略、部署指南');
    log('• 支援對話式開發工作流程');
    log('\n📁 範例：');
    log('# 在當前目錄創建增強結構');
    log('node scripts/create-enhanced-project.cjs');
    log('\n# 在指定目錄創建增強結構');
    log('node scripts/create-enhanced-project.cjs ./my-awesome-project');
    return;
  }
  
  createEnhancedProjectStructure(projectPath);
}

// 檢查是否直接執行此文件
if (require.main === module) {
  main();
}

module.exports = { createEnhancedProjectStructure }; 