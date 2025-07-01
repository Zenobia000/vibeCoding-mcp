#!/usr/bin/env node
/**
 * VibeCoding Enhanced Project Structure Creator v2
 * 🚀 一鍵創建完整的 VibeCoding 增強專案結構
 * 遵循 .vibecoding/prompts 指導原則
 */

const fs = require('fs-extra');
const path = require('path');

console.log('🚀 VibeCoding Enhanced Project Structure Creator v2');
console.log('正在創建完整的專案開發結構...\n');

// 獲取目標目錄（當前目錄）
const projectPath = process.cwd();
const projectName = path.basename(projectPath);

// 📁 完整的專案結構定義
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
  'README.md': generateMainReadme(projectName),
  '.gitignore': generateGitignore(),
  'package.json': generatePackageJson(projectName),
  'VIBECODING_WORKFLOW.md': generateWorkflowGuide(projectName),
  
  // Discovery Phase
  '0_discovery/README.md': generateDiscoveryReadme(projectName),
  '0_discovery/clarifications/questions_template.md': generateQuestionsTemplate(),
  '0_discovery/requirements/user_stories_template.md': generateUserStoriesTemplate(),
  
  // Design Phase
  '1_design/README.md': generateDesignReadme(),
  '1_design/architecture/system_architecture.md': generateArchitectureTemplate(),
  
  // Implementation Phase
  '2_implementation/README.md': generateImplementationReadme(),
  '2_implementation/tests/test-strategy.md': generateTestStrategy(),
  
  // Validation Phase
  '3_validation/README.md': generateValidationReadme(),
  
  // Deployment Phase
  '4_deployment/README.md': generateDeploymentReadme(),
  '4_deployment/environments/deployment-guide.md': generateDeploymentGuide(),
  
  // Knowledge Base
  'knowledge-base/patterns/README.md': generatePatternsReadme(),
  'knowledge-base/solutions/README.md': generateSolutionsReadme(),
  'knowledge-base/retrospectives/README.md': generateRetrospectivesReadme(),
  
  // VibeCoding Files
  '.vibecoding/conversations/README.md': generateConversationsReadme(),
  '.vibecoding/decisions/README.md': generateDecisionsReadme(),
  '.vibecoding/insights/README.md': generateInsightsReadme()
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

// 生成主 README
function generateMainReadme(projectName) {
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
# 🆕 簡潔指令 (推薦)
@vibe start "${projectName}"     # 開始專案澄清
@vibe prd                        # 生成產品需求文檔
@vibe code "核心功能"            # 生成代碼
@vibe test                       # 執行測試
@vibe deploy                     # 部署應用
\`\`\`

## 🎯 快速開始

1. **在 Cursor 或 Claude Desktop 中開啟此專案**
2. **使用 \`@vibe start "${projectName}"\` 開始開發**
3. **跟隨 AI 引導完成整個開發流程**

---
*使用 VibeCoding Enhanced Project Creator 自動生成*`;
}

// 生成 gitignore
function generateGitignore() {
  return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs  
dist/
build/
*.d.ts

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

# OS generated files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Temporary files
tmp/
temp/

# VibeCoding specific
test-project/
debug.txt`;
}

// 生成 package.json
function generatePackageJson(projectName) {
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
    "conversation-driven"
  ],
  "author": "",
  "license": "MIT",
  "vibecoding": {
    "version": "2.0.0",
    "created": "${new Date().toISOString()}",
    "structure": "enhanced"
  }
}`;
}

// 生成工作流程指南
function generateWorkflowGuide(projectName) {
  return `# VibeCoding 工作流程指南

## 🎯 對話驅動開發流程

歡迎使用 VibeCoding！本指南將帶您完整體驗對話驅動的開發流程。

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
@vibe arch "系統架構描述"
@vibe api "API 設計需求"
\`\`\`

### 4️⃣ 代碼實現 (Implementation Phase)
\`\`\`bash
@vibe code "功能需求"
@vibe comp "組件需求"
@vibe review "[代碼]"
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

// 生成 Discovery README
function generateDiscoveryReadme(projectName) {
  return `# 📋 Discovery Phase - 需求發現階段

## 🎯 階段目標
- 🔍 收集和澄清專案需求
- 📝 定義專案範圍和目標  
- ⚠️ 識別技術約束和風險
- 👥 了解目標用戶和使用情境

## 🛠️ VibeCoding 工具使用

### 🆕 簡潔指令 (推薦)
\`\`\`bash
@vibe start "${projectName}"     # 開始專案澄清
@vibe ask "你的回答內容"        # 回答澄清問題
@vibe prd                        # 生成產品需求文檔
@vibe insight "問題"             # 獲取 AI 洞察
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
- [ ] 確定專案成功指標`;
}

// 其他生成函數的簡化版本...
function generateQuestionsTemplate() {
  return `# 需求澄清清單

## 🔍 VibeCoding 7 問澄清法

### 🎯 問題 1: 核心問題定義
**這個專案主要解決什麼問題？**

### 🎯 問題 2: 核心功能範圍  
**這個專案的核心功能有哪些？**

### 🎯 問題 3: 技術偏好和約束
**您對技術選型有什麼偏好或限制？**

### 🎯 問題 4: 用戶體驗期望
**您希望用戶在使用這個應用時有什麼樣的體驗？**

### 🎯 問題 5: 規模和性能要求
**預期的用戶規模和性能要求是什麼？**

### 🎯 問題 6: 時程和資源限制
**專案的時間限制和可用資源是什麼？**

### 🎯 問題 7: 成功標準定義
**如何衡量這個專案的成功？**

## 📋 澄清完成檢查清單

- [ ] 核心問題和用戶痛點已明確
- [ ] 主要功能範圍已界定
- [ ] 技術約束和偏好已確認
- [ ] 用戶體驗期望已理解
- [ ] 性能和規模要求已確定
- [ ] 時程和資源限制已明確
- [ ] 成功標準已定義

## 🎯 下一步行動

完成澄清後，請使用 \`@vibe prd\` 生成產品需求文檔 (PRD)。`;
}

// 簡化的生成函數
function generateUserStoriesTemplate() { return '# 用戶故事模板\n\n基本格式：**作為** [用戶角色]，**我希望** [功能描述]，**以便** [業務價值]。'; }
function generateDesignReadme() { return '# 🎨 Design Phase - 設計階段\n\n使用 @vibe plan 開始設計階段'; }
function generateArchitectureTemplate() { return '# 系統架構設計\n\n使用 @vibe arch 生成系統架構'; }
function generateImplementationReadme() { return '# 💻 Implementation Phase - 實作階段\n\n使用 @vibe code 開始實作'; }
function generateTestStrategy() { return '# 🧪 測試策略\n\n使用 @vibe test 執行測試'; }
function generateValidationReadme() { return '# 🧪 Validation Phase - 驗證階段\n\n使用 @vibe test 開始驗證'; }
function generateDeploymentReadme() { return '# 🚀 Deployment Phase - 部署階段\n\n使用 @vibe deploy 開始部署'; }
function generateDeploymentGuide() { return '# 🚀 部署指南\n\n完整的部署流程和最佳實踐'; }
function generatePatternsReadme() { return '# 設計模式和架構模式\n\n記錄可重用的解決方案'; }
function generateSolutionsReadme() { return '# 解決方案庫\n\n問題解決方案集'; }
function generateRetrospectivesReadme() { return '# 專案回顧\n\n持續改進記錄'; }
function generateConversationsReadme() { return '# VibeCoding 對話記錄\n\n對話驅動開發記錄'; }
function generateDecisionsReadme() { return '# 技術決策記錄 (ADR)\n\n決策驅動開發'; }
function generateInsightsReadme() { return '# AI 洞察和建議\n\n智能建議記錄'; }

// 顯示成功訊息
function displaySuccessMessage() {
  console.log('\n🎉 VibeCoding Enhanced Project Structure v2 建立完成！');
  console.log('\n✅ 已自動創建：');
  console.log('   📁 5個開發階段資料夾 + 完整子資料夾結構');
  console.log('   📄 遵循 .vibecoding/prompts 指導原則的模板');
  console.log('   🧪 測試策略和部署指南');
  console.log('   📋 README.md 和配置檔案');
  console.log('   🚀 VibeCoding 快速開發指引');
  console.log('   🤖 AI 對話和決策記錄系統');
  
  console.log('\n🎯 下一步：');
  console.log(`   1. 在 Cursor 或 Claude Desktop 中開啟專案`);
  console.log(`   2. 使用 @vibe start "${projectName}" 開始開發`);
  console.log(`   3. 跟隨 AI 引導完成整個開發流程`);
  
  console.log('\n🚀 開始享受 AI 驅動的對話式開發體驗！');
}

// 執行腳本
createEnhancedProject(); 