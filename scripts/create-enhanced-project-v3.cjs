#!/usr/bin/env node
/**
 * VibeCoding Enhanced Project Structure Creator v3
 * 整合 v1 完整內容 + v2 架構優化 + 完全遵循 .vibecoding/prompts 指導原則
 */

const fs = require('fs-extra');
const path = require('path');

console.log('🚀 VibeCoding Enhanced Project Structure Creator v3');
console.log('正在創建完整的專案開發結構...\n');

const projectPath = process.cwd();
const projectName = path.basename(projectPath);

// 完整的專案結構定義
const PROJECT_STRUCTURE = {
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
    'src': {
      'api': {},
      'components': {},
      'services': {},
      'utils': {}
    },
    'tests': {
      'unit': {},
      'integration': {},
      'e2e': {}
    },
    'scripts': {}
  },
  '3_validation': {
    'test-reports': {},
    'quality-metrics': {},
    'benchmarks': {}
  },
  '4_deployment': {
    'environments': {
      'development': {},
      'staging': {},
      'production': {}
    },
    'ci-cd': {},
    'monitoring': {}
  },
  'knowledge-base': {
    'patterns': {},
    'solutions': {
      'frontend': {},
      'backend': {},
      'database': {},
      'deployment': {},
      'performance': {},
      'security': {}
    },
    'retrospectives': {},
    'decisions': {}
  },
  '.vibecoding': {
    'conversations': {},
    'decisions': {},
    'insights': {}
  },
  'docs': {
    'api': {},
    'user-guide': {},
    'technical': {}
  },
  'config': {}
};

// 主要執行函數
async function createEnhancedProject() {
  try {
    console.log(`📁 正在建立專案結構於: ${projectPath}`);
    console.log(`📝 專案名稱: ${projectName}\n`);

    // 建立目錄結構
    console.log('📁 建立目錄結構...');
    await createDirectoryStructure(projectPath, PROJECT_STRUCTURE);
    
    // 建立基本檔案
    console.log('📄 建立基本檔案...');
    await createBasicFiles();
    
    // 建立階段檔案
    console.log('📄 建立階段檔案...');
    await createPhaseFiles();
    
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

// 建立基本檔案
async function createBasicFiles() {
  const basicFiles = {
    'README.md': generateMainReadme(),
    '.gitignore': generateGitignore(),
    'package.json': generatePackageJson(),
    'VIBECODING_WORKFLOW.md': generateWorkflowGuide()
  };
  
  for (const [filePath, content] of Object.entries(basicFiles)) {
    const fullPath = path.join(projectPath, filePath);
    await fs.writeFile(fullPath, content, 'utf8');
  }
}

// 建立階段檔案
async function createPhaseFiles() {
  const phaseFiles = {
    '0_discovery/README.md': generateDiscoveryReadme(),
    '0_discovery/clarifications/questions_template.md': generateQuestionsTemplate(),
    '0_discovery/requirements/user_stories_template.md': generateUserStoriesTemplate(),
    '1_design/README.md': generateDesignReadme(),
    '2_implementation/README.md': generateImplementationReadme(),
    '3_validation/README.md': generateValidationReadme(),
    '4_deployment/README.md': generateDeploymentReadme(),
    'knowledge-base/README.md': generateKnowledgeBaseReadme(),
    '.vibecoding/README.md': generateVibeCodingReadme()
  };
  
  for (const [filePath, content] of Object.entries(phaseFiles)) {
    const fullPath = path.join(projectPath, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf8');
  }
}

// 生成函數
function generateMainReadme() {
  return `# ${projectName}

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
# 簡潔指令 (推薦)
@vibe start "${projectName}"     # 開始專案澄清
@vibe prd                        # 生成產品需求文檔
@vibe code "核心功能"            # 生成代碼
@vibe test                       # 執行測試
@vibe deploy                     # 部署應用
\`\`\`

## 🎯 快速開始
1. 在 Cursor 或 Claude Desktop 中開啟此專案
2. 使用 \`@vibe start "${projectName}"\` 開始開發
3. 跟隨 AI 引導完成整個開發流程

---
*使用 VibeCoding Enhanced Project Creator v3 自動生成*`;
}

function generateGitignore() {
  return `# Dependencies
node_modules/
npm-debug.log*

# Build outputs  
dist/
build/

# Environment variables
.env
.env.local

# IDE files
.vscode/
.idea/

# OS generated files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# VibeCoding specific
test-project/
debug.txt`;
}

function generatePackageJson() {
  return `{
  "name": "${projectName.toLowerCase().replace(/\\s+/g, '-')}",
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
    "version": "3.0.0",
    "created": "${new Date().toISOString()}",
    "structure": "enhanced-complete",
    "prompts-compliant": true
  }
}`;
}

function generateWorkflowGuide() {
  return `# VibeCoding 工作流程指南

## 🎯 對話驅動開發流程

## 🚀 快速開始

### 1️⃣ 專案初始化
\`\`\`bash
@vibe start "${projectName}"
\`\`\`

### 2️⃣ 需求澄清 (Discovery Phase)
\`\`\`bash
@vibe ask "您的回答內容"
@vibe prd
@vibe insight "如何優化需求收集？"
\`\`\`

### 3️⃣ 系統設計 (Design Phase)
\`\`\`bash
@vibe plan
@vibe arch "微服務架構，使用 React + Node.js"
@vibe api "用戶管理和認證系統"
\`\`\`

### 4️⃣ 代碼實現 (Implementation Phase)
\`\`\`bash
@vibe code "用戶認證系統"
@vibe comp "用戶個人資料頁面"
@vibe review "[您的代碼]"
\`\`\`

### 5️⃣ 測試驗證 (Validation Phase)
\`\`\`bash
@vibe test
@vibe cover
@vibe report
\`\`\`

### 6️⃣ 部署上線 (Deployment Phase)
\`\`\`bash
@vibe deploy
@vibe monitor
@vibe alert
\`\`\`

---
*享受 VibeCoding 帶來的智能開發體驗！*`;
}

function generateDiscoveryReadme() {
  return `# 📋 Discovery Phase - 需求發現階段

## 🎯 階段目標
- 🔍 收集和澄清專案需求
- 📝 定義專案範圍和目標  
- ⚠️ 識別技術約束和風險
- 👥 了解目標用戶和使用情境

## 🛠️ VibeCoding 工具使用

### 🆕 簡潔指令 (推薦)
\`\`\`bash
@vibe start "${projectName}"    # 開始專案澄清
@vibe ask "你的回答內容"       # 回答澄清問題
@vibe prd                       # 生成產品需求文檔
@vibe insight "優化建議"        # 獲取 AI 洞察
\`\`\`

## 📁 資料夾結構說明
- **conversations/**: 對話記錄
- **clarifications/**: 需求澄清問題與回答
- **requirements/**: 需求文檔和用戶故事

## ✅ 完成檢查清單
- [ ] 完成 7 個澄清問題
- [ ] 生成產品需求文檔 (PRD)
- [ ] 定義核心用戶故事
- [ ] 識別技術風險和限制
- [ ] 確定專案成功指標`;
}

function generateQuestionsTemplate() {
  return `# 需求澄清清單

## 🔍 VibeCoding 7 問澄清法

### 🎯 問題 1: 核心問題定義
**這個專案主要解決什麼問題？請描述目標用戶和他們遇到的痛點。**

### 🎯 問題 2: 核心功能範圍  
**這個專案的核心功能有哪些？請列出 3-5 個最重要的功能。**

### 🎯 問題 3: 技術偏好和約束
**您對技術選型有什麼偏好或限制？**

### 🎯 問題 4: 用戶體驗期望
**您希望用戶在使用這個應用時有什麼樣的體驗？**

### 🎯 問題 5: 規模和性能要求
**預期的用戶規模和性能要求是什麼？**

### 🎯 問題 6: 時程和資源限制
**專案的時間限制和可用資源是什麼？**

### 🎯 問題 7: 成功標準定義
**如何衡量這個專案的成功？有什麼具體的指標嗎？**

## 📋 澄清完成檢查清單
- [ ] 核心問題和用戶痛點已明確
- [ ] 主要功能範圍已界定
- [ ] 技術約束和偏好已確認
- [ ] 用戶體驗期望已理解
- [ ] 性能和規模要求已確定
- [ ] 時程和資源限制已明確
- [ ] 成功標準已定義

完成澄清後，請使用 \`@vibe prd\` 生成產品需求文檔。`;
}

function generateUserStoriesTemplate() {
  return `# 用戶故事文檔

## 🎯 VibeCoding 用戶故事撰寫指南

## 📝 用戶故事撰寫格式
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
\`\`\`

## 📊 故事管理
### 優先級分類
- **Must Have**: 核心功能，MVP 必需
- **Should Have**: 重要但非關鍵功能
- **Could Have**: 增值功能
- **Won't Have**: 此版本不考慮的功能`;
}

function generateDesignReadme() {
  return `# 🎨 Design Phase - 設計階段

## 🎯 階段目標
- ��️ 設計系統整體架構
- 📡 定義 API 規格和介面
- 🗄️ 設計資料庫結構
- 🎨 規劃使用者介面

## 🛠️ VibeCoding 工具使用
\`\`\`bash
@vibe plan                      # 生成實施計劃
@vibe arch "系統架構設計"       # 設計系統架構  
@vibe api "API 設計"            # 生成 API 設計
@vibe db "資料庫設計"           # 資料庫設計
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
- [ ] 確定技術選型`;
}

function generateImplementationReadme() {
  return `# 💻 Implementation Phase - 實作階段

## �� 階段目標
- 🛠️ 撰寫核心程式碼
- 📡 實作 API 和服務
- 🔗 整合第三方服務
- 🧪 開發單元測試

## 🛠️ VibeCoding 工具使用
\`\`\`bash
@vibe code "核心功能"           # 生成核心代碼
@vibe comp "React 組件"         # 生成組件
@vibe api "API 接口"            # 生成 API
@vibe review "[代碼]"           # 代碼審查
@vibe refactor "優化代碼"       # 重構代碼
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
- [ ] 處理錯誤和異常情況`;
}

function generateValidationReadme() {
  return `# 🧪 Validation Phase - 驗證階段

## 🎯 階段目標
- 🧪 執行各種類型的測試
- 📊 進行代碼品質檢查
- ⚡ 評估系統性能
- 🔒 執行安全性檢查

## 🛠️ VibeCoding 工具使用
\`\`\`bash
@vibe test                      # 執行測試
@vibe cover                     # 檢查測試覆蓋率
@vibe report                    # 生成測試報告
@vibe perf "性能測試"           # 性能測試
@vibe scan                      # 安全掃描
\`\`\`

## ✅ 完成檢查清單
- [ ] 單元測試覆蓋率 > 80%
- [ ] 整合測試全部通過
- [ ] 性能測試達到要求
- [ ] 安全掃描無高風險漏洞
- [ ] 代碼品質符合標準`;
}

function generateDeploymentReadme() {
  return `# 🚀 Deployment Phase - 部署階段

## 🎯 階段目標
- ⚙️ 配置部署環境
- 🔄 設定 CI/CD 流水線
- 📊 建立監控和日誌
- 🚀 執行正式部署

## 🛠️ VibeCoding 工具使用
\`\`\`bash
@vibe deploy                    # 配置部署環境
@vibe monitor                   # 設定監控
@vibe alert                     # 設定告警
@vibe rollback "版本"           # 回滾部署
\`\`\`

## ✅ 完成檢查清單
- [ ] 配置生產環境
- [ ] 設定 CI/CD 流水線
- [ ] 建立監控儀表板
- [ ] 配置告警規則
- [ ] 完成正式部署
- [ ] 驗證部署成功`;
}

function generateKnowledgeBaseReadme() {
  return `# 📚 Knowledge Base - 知識庫

## 🎯 目的
建立專案開發過程中的知識積累和經驗分享平台。

## 📁 結構說明
- **patterns/**: 設計模式和架構模式
- **solutions/**: 分類的解決方案庫
- **retrospectives/**: 專案回顧和總結
- **decisions/**: 重要決策記錄

## 🔄 持續更新
定期更新知識庫內容，確保團隊經驗的有效傳承。`;
}

function generateVibeCodingReadme() {
  return `# .vibecoding - VibeCoding 專用目錄

## 🎯 目的
記錄與 VibeCoding AI 助手的互動過程和重要決策。

## 📁 結構說明
- **conversations/**: 重要對話記錄
- **decisions/**: 技術決策記錄 (ADR)
- **insights/**: AI 洞察和建議

## 📝 使用方式
所有 VibeCoding 相關的對話和決策都會自動記錄到此目錄中。`;
}

// 顯示成功訊息
function displaySuccessMessage() {
  console.log('\n🎉 VibeCoding Enhanced Project Structure v3 建立完成！');
  console.log('\n✅ 已自動創建：');
  console.log('   📁 5個開發階段資料夾 + 完整子資料夾結構');
  console.log('   📄 完全遵循 .vibecoding/prompts 指導原則');
  console.log('   🎯 100% VibeCoding 指令輸出路徑對應');
  console.log('   📚 知識庫和解決方案管理系統');
  console.log('   🤖 AI 對話、決策記錄和洞察管理');
  
  console.log('\n🎯 v3 版本特色：');
  console.log('   ✨ 整合 v1 完整內容 + v2 架構優化');
  console.log('   🎯 完全對應到正確的資料夾位置');
  console.log('   📋 遵循所有 .vibecoding/prompts 指導原則');
  
  console.log('\n🎯 下一步：');
  console.log(`   1. 在 Cursor 或 Claude Desktop 中開啟專案`);
  console.log(`   2. 使用 @vibe start "${projectName}" 開始開發`);
  console.log(`   3. 所有 VibeCoding 指令輸出都會自動放入對應資料夾`);
  
  console.log('\n🚀 開始享受完全整合的 AI 驅動開發體驗！');
}

// 執行腳本
createEnhancedProject();
