#!/usr/bin/env node

/**
 * VibeCoding Prompt 系統測試工具
 * 驗證所有 prompt 文件是否完整且可正常載入
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// 測試結果追蹤
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const errors = [];

/**
 * 記錄測試結果
 */
function logTest(testName, passed, error = null) {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(chalk.green(`✅ ${testName}`));
  } else {
    failedTests++;
    console.log(chalk.red(`❌ ${testName}`));
    if (error) {
      console.log(chalk.gray(`   ${error}`));
      errors.push(`${testName}: ${error}`);
    }
  }
}

/**
 * 檢查文件是否存在且內容充足
 */
async function checkFile(filePath, minLength = 100) {
  try {
    const fullPath = join(projectRoot, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    
    if (content.length < minLength) {
      throw new Error(`文件內容過短 (${content.length} < ${minLength} 字符)`);
    }
    
    // 檢查是否有實際的佔位符（排除文檔中的說明性文字）
    const todoPattern = /(?<!沒有\s)TODO(?!\s或佔位符)/i;
    const placeholderPattern = /(?<!或\s)PLACEHOLDER(?![\s，。])/i;
    
    if (todoPattern.test(content) || placeholderPattern.test(content)) {
      throw new Error('文件包含未完成的佔位符內容');
    }
    
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * 檢查目錄是否存在
 */
async function checkDirectory(dirPath) {
  try {
    const fullPath = join(projectRoot, dirPath);
    const stat = await fs.stat(fullPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * 測試核心 prompt 文件
 */
async function testCorePrompts() {
  console.log(chalk.blue('\n🎯 測試核心 Prompt 文件...'));
  
  const corePrompts = [
    '.vibecoding/prompts/core/system-identity.md',
    '.vibecoding/prompts/core/conversation-style.md', 
    '.vibecoding/prompts/core/collaboration-rules.md'
  ];
  
  for (const promptPath of corePrompts) {
    try {
      await checkFile(promptPath, 200);
      logTest(`核心 Prompt: ${promptPath.split('/').pop()}`, true);
    } catch (error) {
      logTest(`核心 Prompt: ${promptPath.split('/').pop()}`, false, error.message);
    }
  }
}

/**
 * 測試服務 prompt 文件
 */
async function testServicePrompts() {
  console.log(chalk.blue('\n🛠️ 測試服務 Prompt 文件...'));
  
  const services = [
    'context-manager',
    'code-generator',
    'dependency-tracker',
    'test-validator',
    'doc-generator',
    'deployment-manager'
  ];
  
  for (const service of services) {
    const promptPath = `.vibecoding/prompts/services/${service}.md`;
    try {
      await checkFile(promptPath, 300);
      logTest(`服務 Prompt: ${service}`, true);
    } catch (error) {
      logTest(`服務 Prompt: ${service}`, false, error.message);
    }
  }
}

/**
 * 測試工作流 prompt 文件
 */
async function testWorkflowPrompts() {
  console.log(chalk.blue('\n📋 測試工作流 Prompt 文件...'));
  
  const workflows = [
    'discovery-phase',
    'design-phase', 
    'implementation-phase',
    'validation-phase',
    'deployment-phase'
  ];
  
  for (const workflow of workflows) {
    const promptPath = `.vibecoding/prompts/workflows/${workflow}.md`;
    try {
      await checkFile(promptPath, 250);
      logTest(`工作流 Prompt: ${workflow}`, true);
    } catch (error) {
      logTest(`工作流 Prompt: ${workflow}`, false, error.message);
    }
  }
}

/**
 * 測試 prompt 目錄結構
 */
async function testDirectoryStructure() {
  console.log(chalk.blue('\n📁 測試 Prompt 目錄結構...'));
  
  const requiredDirs = [
    '.vibecoding',
    '.vibecoding/prompts',
    '.vibecoding/prompts/core',
    '.vibecoding/prompts/services',
    '.vibecoding/prompts/workflows'
  ];
  
  for (const dir of requiredDirs) {
    try {
      const exists = await checkDirectory(dir);
      if (!exists) {
        throw new Error('目錄不存在');
      }
      logTest(`目錄結構: ${dir}`, true);
    } catch (error) {
      logTest(`目錄結構: ${dir}`, false, error.message);
    }
  }
}

/**
 * 測試 PromptManager 類別
 */
async function testPromptManager() {
  console.log(chalk.blue('\n⚙️ 測試 PromptManager 功能...'));
  
  try {
    // 動態導入 PromptManager
    const { promptManager } = await import('../dist/src/utils/prompt-manager.js');
    
    // 測試驗證功能
    const validation = await promptManager.validatePrompts();
    
    if (validation.valid) {
      logTest('PromptManager 驗證', true);
    } else {
      logTest('PromptManager 驗證', false, validation.errors.join('; '));
    }
    
    // 測試可用服務
    const services = await promptManager.getAvailableServices();
    if (services.length >= 6) {
      logTest('可用服務數量', true);
    } else {
      logTest('可用服務數量', false, `只找到 ${services.length} 個服務，預期至少 6 個`);
    }
    
  } catch (error) {
    logTest('PromptManager 載入', false, error.message);
  }
}

/**
 * 主測試函數
 */
async function runTests() {
  console.log(chalk.cyan(`
╦  ╦╦╔╗ ╔═╗  ╔═╗╔═╗╔╦╗╦╔╗╔╔═╗
╚╗╔╝║╠╩╗║╣   ║  ║ ║ ║║║║║║║ ╦
 ╚╝ ╩╚═╝╚═╝  ╚═╝╚═╝═╩╝╩╝╚╝╚═╝
Prompt 系統測試工具
`));

  // 執行所有測試
  await testDirectoryStructure();
  await testCorePrompts();
  await testServicePrompts();
  await testWorkflowPrompts();
  await testPromptManager();
  
  // 顯示測試結果
  console.log(chalk.cyan('\n📊 測試結果摘要:'));
  console.log(`總計測試: ${totalTests}`);
  console.log(chalk.green(`✅ 通過: ${passedTests}`));
  console.log(chalk.red(`❌ 失敗: ${failedTests}`));
  
  if (failedTests === 0) {
    console.log(chalk.green.bold('\n🎉 FULLY OPERATIONAL - All prompts are ready!'));
    console.log(chalk.gray('所有 prompt 系統組件都正常運作'));
    process.exit(0);
  } else {
    console.log(chalk.red.bold('\n⚠️ PROMPT SYSTEM ISSUES DETECTED'));
    console.log(chalk.yellow('\n🔧 需要修復的問題:'));
    errors.forEach(error => {
      console.log(chalk.gray(`   • ${error}`));
    });
    
    console.log(chalk.blue('\n💡 建議解決方案:'));
    console.log(chalk.gray('   1. 檢查 .vibecoding/prompts/ 目錄是否完整'));
    console.log(chalk.gray('   2. 確認所有 prompt 文件內容充足 (>100 字符)'));
    console.log(chalk.gray('   3. 執行 npm run build 重新建構系統'));
    console.log(chalk.gray('   4. 檢查文件編碼是否為 UTF-8'));
    
    process.exit(1);
  }
}

// 執行測試
runTests().catch(error => {
  console.error(chalk.red('測試執行錯誤:'), error);
  process.exit(1);
}); 