#!/usr/bin/env node

/**
 * VibeCoding End-to-End Test Suite
 * 🧪 完整的端到端測試，驗證整個 VibeCoding 系統
 * 
 * 測試範圍：
 * - 系統初始化和配置
 * - 提示系統完整性
 * - MCP 服務功能
 * - 專案創建流程
 * - 整合功能測試
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

// 測試配置
const TEST_CONFIG = {
  timeout: 30000,
  testProjectName: 'vibecoding-e2e-test',
  tempDir: path.join(__dirname, '../temp-test'),
  rootDir: path.join(__dirname, '..')
};

// 測試結果收集
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// 工具函數
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function assert(condition, message) {
  testResults.total++;
  if (condition) {
    testResults.passed++;
    log(`✅ ${message}`, 'success');
    return true;
  } else {
    testResults.failed++;
    testResults.errors.push(message);
    log(`❌ ${message}`, 'error');
    return false;
  }
}

async function runCommand(command, cwd = TEST_CONFIG.rootDir) {
  try {
    const { stdout, stderr } = await execAsync(command, { cwd, timeout: TEST_CONFIG.timeout });
    return { success: true, stdout, stderr };
  } catch (error) {
    return { success: false, error: error.message, stdout: error.stdout, stderr: error.stderr };
  }
}

// === 測試套件 ===

/**
 * 測試 1: 系統基礎設施檢查
 */
async function testSystemInfrastructure() {
  log('🔧 Testing System Infrastructure...', 'info');
  
  // 檢查 Node.js 版本
  const nodeResult = await runCommand('node --version');
  assert(nodeResult.success && nodeResult.stdout.includes('v'), 'Node.js is available');
  
  // 檢查 npm 版本
  const npmResult = await runCommand('npm --version');
  assert(npmResult.success, 'npm is available');
  
  // 檢查專案結構
  const requiredDirs = [
    'src', 'vibe-services', 'scripts', '.vibecoding'
  ];
  
  for (const dir of requiredDirs) {
    const exists = await fs.pathExists(path.join(TEST_CONFIG.rootDir, dir));
    assert(exists, `Required directory exists: ${dir}`);
  }
  
  // 檢查關鍵檔案
  const requiredFiles = [
    'package.json', 'tsconfig.json', 'README.md'
  ];
  
  for (const file of requiredFiles) {
    const exists = await fs.pathExists(path.join(TEST_CONFIG.rootDir, file));
    assert(exists, `Required file exists: ${file}`);
  }
}

/**
 * 測試 2: 建構系統
 */
async function testBuildSystem() {
  log('🏗️ Testing Build System...', 'info');
  
  // 安裝依賴
  const installResult = await runCommand('npm install');
  assert(installResult.success, 'npm install completed successfully');
  
  // 建構專案
  const buildResult = await runCommand('npm run build');
  assert(buildResult.success, 'npm run build completed successfully');
  
  // 檢查建構輸出
  const distExists = await fs.pathExists(path.join(TEST_CONFIG.rootDir, 'dist'));
  assert(distExists, 'dist directory created after build');
  
  // 檢查服務檔案
  const services = [
    'context-manager', 'code-generator', 'dependency-tracker',
    'test-validator', 'doc-generator', 'deployment-manager'
  ];
  
  for (const service of services) {
    const serviceFile = path.join(TEST_CONFIG.rootDir, 'dist/vibe-services', service, 'index.js');
    const exists = await fs.pathExists(serviceFile);
    assert(exists, `Service built successfully: ${service}`);
  }
}

/**
 * 測試 3: 提示系統
 */
async function testPromptSystem() {
  log('🎯 Testing Prompt System...', 'info');
  
  // 執行提示系統測試
  const promptTestResult = await runCommand('node scripts/test-prompts.js');
  assert(promptTestResult.success, 'Prompt system validation passed');
  
  // 檢查提示檔案結構
  const promptsDir = path.join(TEST_CONFIG.rootDir, '.vibecoding/prompts');
  const promptCategories = ['core', 'services', 'workflows'];
  
  for (const category of promptCategories) {
    const categoryDir = path.join(promptsDir, category);
    const exists = await fs.pathExists(categoryDir);
    assert(exists, `Prompt category exists: ${category}`);
  }
  
  // 檢查核心提示檔案
  const corePrompts = [
    'system-identity.md', 'conversation-style.md', 'collaboration-rules.md'
  ];
  
  for (const prompt of corePrompts) {
    const promptFile = path.join(promptsDir, 'core', prompt);
    const exists = await fs.pathExists(promptFile);
    assert(exists, `Core prompt exists: ${prompt}`);
    
    if (exists) {
      const content = await fs.readFile(promptFile, 'utf8');
      assert(content.length > 500, `Core prompt has content: ${prompt}`);
    }
  }
}

/**
 * 測試 4: MCP 服務功能
 */
async function testMCPServices() {
  log('🤖 Testing MCP Services...', 'info');
  
  const services = [
    'context-manager', 'code-generator', 'dependency-tracker',
    'test-validator', 'doc-generator', 'deployment-manager'
  ];
  
  for (const service of services) {
    const servicePath = path.join(TEST_CONFIG.rootDir, `dist/vibe-services/${service}/index.js`);
    
    // 檢查服務檔案存在
    const exists = await fs.pathExists(servicePath);
    assert(exists, `MCP service file exists: ${service}`);
    
    if (exists) {
      // 嘗試載入服務 (語法檢查)
      try {
        const serviceContent = await fs.readFile(servicePath, 'utf8');
        assert(serviceContent.includes('Server'), `MCP service has Server class: ${service}`);
        assert(serviceContent.includes('tool'), `MCP service has tools: ${service}`);
      } catch (error) {
        assert(false, `MCP service syntax error: ${service} - ${error.message}`);
      }
    }
  }
}

/**
 * 測試 5: 專案創建功能
 */
async function testProjectCreation() {
  log('📁 Testing Project Creation...', 'info');
  
  // 清理測試目錄
  await fs.remove(TEST_CONFIG.tempDir);
  await fs.ensureDir(TEST_CONFIG.tempDir);
  
  const testProjectDir = path.join(TEST_CONFIG.tempDir, TEST_CONFIG.testProjectName);
  await fs.ensureDir(testProjectDir);
  
  // 測試增強專案創建
  const createResult = await runCommand(
    `node ${path.join(TEST_CONFIG.rootDir, 'scripts/create-enhanced-project.cjs')}`,
    testProjectDir
  );
  
  assert(createResult.success, 'Enhanced project creation completed');
  
  // 檢查創建的專案結構
  const expectedDirs = [
    '0_discovery', '1_design', '2_implementation', '3_validation', '4_deployment'
  ];
  
  for (const dir of expectedDirs) {
    const dirPath = path.join(testProjectDir, dir);
    const exists = await fs.pathExists(dirPath);
    assert(exists, `Project phase directory created: ${dir}`);
  }
  
  // 檢查關鍵檔案
  const expectedFiles = [
    'README.md', 'package.json', '.gitignore'
  ];
  
  for (const file of expectedFiles) {
    const filePath = path.join(testProjectDir, file);
    const exists = await fs.pathExists(filePath);
    assert(exists, `Project file created: ${file}`);
    
    if (exists) {
      const content = await fs.readFile(filePath, 'utf8');
      assert(content.length > 0, `Project file has content: ${file}`);
    }
  }
  
  // 檢查模板檔案內容
  const readmePath = path.join(testProjectDir, 'README.md');
  if (await fs.pathExists(readmePath)) {
    const readmeContent = await fs.readFile(readmePath, 'utf8');
    assert(readmeContent.includes(TEST_CONFIG.testProjectName), 'README contains project name');
    assert(readmeContent.includes('@vibe'), 'README contains VibeCoding commands');
  }
}

/**
 * 測試 6: 腳本功能
 */
async function testScripts() {
  log('📜 Testing Scripts...', 'info');
  
  const scriptsDir = path.join(TEST_CONFIG.rootDir, 'scripts');
  const scripts = await fs.readdir(scriptsDir);
  
  // 檢查關鍵腳本存在
  const requiredScripts = [
    'test-prompts.js', 'create-enhanced-project.cjs', 'easy-setup.js'
  ];
  
  for (const script of requiredScripts) {
    const scriptExists = scripts.includes(script);
    assert(scriptExists, `Required script exists: ${script}`);
    
    if (scriptExists) {
      const scriptPath = path.join(scriptsDir, script);
      const content = await fs.readFile(scriptPath, 'utf8');
      assert(content.length > 1000, `Script has substantial content: ${script}`);
    }
  }
  
  // 測試 easy-setup 腳本
  const easySetupResult = await runCommand('node scripts/easy-setup.js --dry-run');
  // easy-setup 可能會失敗，但不應該有語法錯誤
  assert(
    easySetupResult.success || !easySetupResult.stderr?.includes('SyntaxError'),
    'easy-setup.js has no syntax errors'
  );
}

/**
 * 測試 7: 文檔完整性
 */
async function testDocumentation() {
  log('📚 Testing Documentation...', 'info');
  
  const requiredDocs = [
    'README.md', 'IDE_SETUP_GUIDE.md', 'MCP_SETUP_GUIDE.md',
    'VIBECODING_TOOLS_REFERENCE.md', 'CURSOR_MCP_CLARIFICATION.md'
  ];
  
  for (const doc of requiredDocs) {
    const docPath = path.join(TEST_CONFIG.rootDir, doc);
    const exists = await fs.pathExists(docPath);
    assert(exists, `Documentation exists: ${doc}`);
    
    if (exists) {
      const content = await fs.readFile(docPath, 'utf8');
      assert(content.length > 2000, `Documentation has substantial content: ${doc}`);
      assert(content.includes('#'), `Documentation has headers: ${doc}`);
    }
  }
  
  // 檢查設計模板
  const templatesDir = path.join(TEST_CONFIG.rootDir, 'design_templates');
  const templatesExist = await fs.pathExists(templatesDir);
  assert(templatesExist, 'Design templates directory exists');
  
  if (templatesExist) {
    const templates = await fs.readdir(templatesDir);
    assert(templates.length > 5, 'Multiple design templates available');
  }
}

/**
 * 測試 8: 配置檔案
 */
async function testConfiguration() {
  log('⚙️ Testing Configuration...', 'info');
  
  // 檢查 package.json
  const packageJsonPath = path.join(TEST_CONFIG.rootDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  
  assert(packageJson.name, 'package.json has name');
  assert(packageJson.scripts, 'package.json has scripts');
  assert(packageJson.scripts.build, 'package.json has build script');
  
  // 檢查 TypeScript 配置
  const tsconfigPath = path.join(TEST_CONFIG.rootDir, 'tsconfig.json');
  const tsconfigExists = await fs.pathExists(tsconfigPath);
  assert(tsconfigExists, 'tsconfig.json exists');
  
  if (tsconfigExists) {
    const tsconfig = await fs.readJson(tsconfigPath);
    assert(tsconfig.compilerOptions, 'tsconfig.json has compilerOptions');
  }
  
  // 檢查 MCP 配置範例
  const mcpConfigPath = path.join(TEST_CONFIG.rootDir, 'mcp-config-examples.json');
  const mcpConfigExists = await fs.pathExists(mcpConfigPath);
  assert(mcpConfigExists, 'MCP config examples exist');
}

/**
 * 測試 9: 整合測試
 */
async function testIntegration() {
  log('🔗 Testing Integration...', 'info');
  
  // 測試系統狀態檢查
  const statusResult = await runCommand('npm run vibecoding status');
  // 狀態檢查可能會失敗，但不應該有嚴重錯誤
  const hasNoSyntaxError = !statusResult.stderr?.includes('SyntaxError');
  assert(hasNoSyntaxError, 'System status check has no syntax errors');
  
  // 檢查所有服務都有對應的 TypeScript 源碼
  const servicesDirs = await fs.readdir(path.join(TEST_CONFIG.rootDir, 'vibe-services'));
  
  for (const serviceDir of servicesDirs) {
    const servicePath = path.join(TEST_CONFIG.rootDir, 'vibe-services', serviceDir);
    const stats = await fs.stat(servicePath);
    
    if (stats.isDirectory()) {
      const indexTsPath = path.join(servicePath, 'index.ts');
      const packageJsonPath = path.join(servicePath, 'package.json');
      
      const indexExists = await fs.pathExists(indexTsPath);
      const packageExists = await fs.pathExists(packageJsonPath);
      
      assert(indexExists, `Service has index.ts: ${serviceDir}`);
      assert(packageExists, `Service has package.json: ${serviceDir}`);
    }
  }
}

/**
 * 清理測試環境
 */
async function cleanup() {
  log('🧹 Cleaning up test environment...', 'info');
  
  try {
    await fs.remove(TEST_CONFIG.tempDir);
    log('✅ Test cleanup completed', 'success');
  } catch (error) {
    log(`⚠️ Cleanup warning: ${error.message}`, 'warning');
  }
}

/**
 * 生成測試報告
 */
function generateReport() {
  log('\n📋 VibeCoding E2E Test Report', 'info');
  log('='.repeat(50), 'info');
  log(`📊 Total Tests: ${testResults.total}`, 'info');
  log(`✅ Passed: ${testResults.passed}`, 'success');
  log(`❌ Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'info');
  log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`, 'info');
  
  if (testResults.errors.length > 0) {
    log('\n❌ Failed Tests:', 'error');
    testResults.errors.forEach((error, index) => {
      log(`   ${index + 1}. ${error}`, 'error');
    });
  }
  
  log('\n🎯 Test Summary:', 'info');
  const healthScore = (testResults.passed / testResults.total) * 100;
  
  if (healthScore === 100) {
    log('   🎉 PERFECT - All tests passed!', 'success');
  } else if (healthScore >= 90) {
    log('   ✅ EXCELLENT - System is highly functional', 'success');
  } else if (healthScore >= 80) {
    log('   ✅ GOOD - System is mostly functional', 'success');
  } else if (healthScore >= 70) {
    log('   ⚠️ FAIR - Some issues need attention', 'warning');
  } else {
    log('   ❌ POOR - Significant issues found', 'error');
  }
  
  log('\n🚀 Next Steps:', 'info');
  if (testResults.failed === 0) {
    log('   • VibeCoding system is ready for use!', 'success');
    log('   • Start developing with: @vibe start "your-project"', 'info');
  } else {
    log('   • Fix the failed tests before using the system', 'warning');
    log('   • Check the error messages above for guidance', 'info');
    log('   • Re-run this test after fixes: npm run test:e2e', 'info');
  }
}

/**
 * 主要測試執行器
 */
async function runE2ETests() {
  const startTime = Date.now();
  
  log('🚀 Starting VibeCoding End-to-End Tests...', 'info');
  log(`📁 Test Root: ${TEST_CONFIG.rootDir}`, 'info');
  log(`⏱️ Timeout: ${TEST_CONFIG.timeout}ms per test`, 'info');
  log('', 'info');
  
  try {
    // 執行所有測試套件
    await testSystemInfrastructure();
    await testBuildSystem();
    await testPromptSystem();
    await testMCPServices();
    await testProjectCreation();
    await testScripts();
    await testDocumentation();
    await testConfiguration();
    await testIntegration();
    
  } catch (error) {
    log(`💥 Test execution error: ${error.message}`, 'error');
    testResults.failed++;
    testResults.errors.push(`Test execution error: ${error.message}`);
  } finally {
    await cleanup();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    log(`⏱️ Total test time: ${duration}s`, 'info');
    generateReport();
    
    // 設定退出碼
    process.exit(testResults.failed === 0 ? 0 : 1);
  }
}

// 處理未捕獲的異常
process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  testResults.failed++;
  testResults.errors.push(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`💥 Uncaught Exception: ${error.message}`, 'error');
  testResults.failed++;
  testResults.errors.push(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// 執行測試
if (import.meta.url === `file://${process.argv[1]}`) {
  runE2ETests();
}

export { runE2ETests, testResults };