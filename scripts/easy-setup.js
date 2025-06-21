#!/usr/bin/env node

/**
 * VibeCoding 一鍵簡易設定腳本
 * 自動偵測並設定常見的 IDE
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

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

function checkRequirements() {
  log('\n🔍 檢查系統需求...', COLORS.BLUE);
  
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      log(`✅ Node.js ${nodeVersion} (符合要求)`, COLORS.GREEN);
    } else {
      log(`❌ Node.js ${nodeVersion} (需要 >= 18.0.0)`, COLORS.RED);
      process.exit(1);
    }
  } catch (error) {
    log('❌ Node.js 未安裝', COLORS.RED);
    process.exit(1);
  }
  
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    log(`✅ npm ${npmVersion}`, COLORS.GREEN);
  } catch (error) {
    log('❌ npm 未安裝', COLORS.RED);
    process.exit(1);
  }
}

function detectIDE() {
  log('\n🔍 偵測已安裝的 IDE...', COLORS.BLUE);
  const ides = [];
  
  const homeDir = os.homedir();
  const platform = os.platform();
  
  // 偵測 Cursor
  const cursorPaths = {
    'win32': path.join(homeDir, 'AppData', 'Roaming', 'Cursor'),
    'darwin': path.join(homeDir, 'Library', 'Application Support', 'Cursor'),
    'linux': path.join(homeDir, '.config', 'Cursor')
  };
  
  if (fs.existsSync(cursorPaths[platform])) {
    ides.push({ name: 'Cursor', path: cursorPaths[platform], type: 'cursor' });
    log('✅ 找到 Cursor IDE', COLORS.GREEN);
  }
  
  // 偵測 VSCode
  const vscodePaths = {
    'win32': path.join(homeDir, 'AppData', 'Roaming', 'Code'),
    'darwin': path.join(homeDir, 'Library', 'Application Support', 'Code'),
    'linux': path.join(homeDir, '.config', 'Code')
  };
  
  if (fs.existsSync(vscodePaths[platform])) {
    ides.push({ name: 'VSCode', path: vscodePaths[platform], type: 'vscode' });
    log('✅ 找到 VSCode', COLORS.GREEN);
  }
  
  // 偵測 Claude Desktop
  const claudePaths = {
    'win32': path.join(homeDir, 'AppData', 'Roaming', 'Claude'),
    'darwin': path.join(homeDir, 'Library', 'Application Support', 'Claude'),
    'linux': path.join(homeDir, '.config', 'claude')
  };
  
  if (fs.existsSync(claudePaths[platform])) {
    ides.push({ name: 'Claude Desktop', path: claudePaths[platform], type: 'claude' });
    log('✅ 找到 Claude Desktop', COLORS.GREEN);
  }
  
  if (ides.length === 0) {
    log('⚠️  未找到支援的 IDE，將顯示手動設定指引', COLORS.YELLOW);
  }
  
  return ides;
}

function promptForAPIKeys() {
  log('\n🔑 API 金鑰設定（可選，稍後也可設定）', COLORS.BLUE);
  log('如果你有 AI 提供者的 API 金鑰，現在可以設定：', COLORS.YELLOW);
  
  const apiKeys = {};
  
  // 這裡簡化處理，實際應該使用 readline 或其他互動方式
  log('\n📋 請手動設定以下環境變數（或在 IDE 設定中加入）：');
  log('export OPENAI_API_KEY="你的_OpenAI_金鑰"');
  log('export ANTHROPIC_API_KEY="你的_Anthropic_金鑰"');
  log('export GEMINI_API_KEY="你的_Gemini_金鑰"');
  
  return apiKeys;
}

function setupCursor(idePath) {
  log('\n⚙️  設定 Cursor IDE...', COLORS.BLUE);
  
  const settingsPath = path.join(idePath, 'User', 'settings.json');
  const settingsDir = path.dirname(settingsPath);
  
  // 確保目錄存在
  if (!fs.existsSync(settingsDir)) {
    fs.mkdirSync(settingsDir, { recursive: true });
  }
  
  let settings = {};
  
  // 讀取現有設定
  if (fs.existsSync(settingsPath)) {
    try {
      const content = fs.readFileSync(settingsPath, 'utf-8');
      settings = JSON.parse(content);
    } catch (error) {
      log('⚠️  無法解析現有設定檔，將創建新設定', COLORS.YELLOW);
    }
  }
  
  // 加入 VibeCoding 設定
  settings['mcp.servers'] = settings['mcp.servers'] || {};
  settings['mcp.servers']['vibecoding'] = {
    command: 'npx',
    args: ['vibecoding-system', 'mcp'],
    env: {
      OPENAI_API_KEY: '${OPENAI_API_KEY}',
      ANTHROPIC_API_KEY: '${ANTHROPIC_API_KEY}'
    }
  };
  
  // VibeCoding 基本設定
  Object.assign(settings, {
    'vibecoding.enabled': true,
    'vibecoding.autoTrigger': true,
    'vibecoding.conversationMode': true,
    'vibecoding.defaultProvider': 'openai',
    'vibecoding.workflow.autoPhaseDetection': true,
    'vibecoding.ui.showProgressBar': true
  });
  
  // 寫入設定檔
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  log(`✅ Cursor 設定完成: ${settingsPath}`, COLORS.GREEN);
}

function setupVSCode(idePath) {
  log('\n⚙️  設定 VSCode...', COLORS.BLUE);
  
  const settingsPath = path.join(idePath, 'User', 'settings.json');
  const settingsDir = path.dirname(settingsPath);
  
  if (!fs.existsSync(settingsDir)) {
    fs.mkdirSync(settingsDir, { recursive: true });
  }
  
  let settings = {};
  
  if (fs.existsSync(settingsPath)) {
    try {
      const content = fs.readFileSync(settingsPath, 'utf-8');
      settings = JSON.parse(content);
    } catch (error) {
      log('⚠️  無法解析現有設定檔，將創建新設定', COLORS.YELLOW);
    }
  }
  
  settings['mcp.servers'] = settings['mcp.servers'] || {};
  settings['mcp.servers']['vibecoding'] = {
    command: 'npx',
    args: ['vibecoding-system', 'mcp'],
    env: {
      OPENAI_API_KEY: '${OPENAI_API_KEY}'
    }
  };
  
  Object.assign(settings, {
    'vibecoding.vscode.enabled': true,
    'vibecoding.vscode.autoTrigger': true,
    'vibecoding.workspace.autoDetectPhase': true,
    'vibecoding.ai.contextAware': true
  });
  
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  log(`✅ VSCode 設定完成: ${settingsPath}`, COLORS.GREEN);
}

function setupClaude(idePath) {
  log('\n⚙️  設定 Claude Desktop...', COLORS.BLUE);
  
  const configPath = path.join(idePath, 'claude_desktop_config.json');
  
  if (!fs.existsSync(idePath)) {
    fs.mkdirSync(idePath, { recursive: true });
  }
  
  let config = {};
  
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(content);
    } catch (error) {
      log('⚠️  無法解析現有設定檔，將創建新設定', COLORS.YELLOW);
    }
  }
  
  config.mcpServers = config.mcpServers || {};
  config.mcpServers.vibecoding = {
    command: 'npx',
    args: ['vibecoding-system', 'mcp'],
    env: {
      OPENAI_API_KEY: '${OPENAI_API_KEY}',
      ANTHROPIC_API_KEY: '${ANTHROPIC_API_KEY}',
      VIBECODING_LOG_LEVEL: 'info'
    }
  };
  
  config.vibecoding = {
    conversationMode: 'advanced',
    autoSaveContext: true,
    enableSmartSuggestions: true
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  log(`✅ Claude Desktop 設定完成: ${configPath}`, COLORS.GREEN);
}

function installVibeCoding() {
  log('\n📦 安裝 VibeCoding...', COLORS.BLUE);
  
  try {
    log('正在安裝 vibecoding-system...');
    execSync('npm install -g vibecoding-system', { stdio: 'inherit' });
    log('✅ VibeCoding 安裝完成', COLORS.GREEN);
  } catch (error) {
    log('❌ VibeCoding 安裝失敗', COLORS.RED);
    log('請手動執行: npm install -g vibecoding-system', COLORS.YELLOW);
    process.exit(1);
  }
}

function verifyInstallation() {
  log('\n✅ 驗證安裝...', COLORS.BLUE);
  
  try {
    const version = execSync('npx vibecoding-system --version', { encoding: 'utf-8' }).trim();
    log(`✅ VibeCoding ${version} 安裝成功`, COLORS.GREEN);
    
    log('正在測試 prompt 系統...');
    execSync('npm run test:prompts', { stdio: 'inherit', cwd: process.cwd() });
    log('✅ Prompt 系統測試通過', COLORS.GREEN);
    
  } catch (error) {
    log('⚠️  部分驗證失敗，但基本安裝完成', COLORS.YELLOW);
  }
}

function showNextSteps() {
  log('\n🎉 設定完成！', COLORS.GREEN + COLORS.BOLD);
  log('\n📋 後續步驟：');
  log('1. 重啟你的 IDE');
  log('2. 設定 API 金鑰（如果尚未設定）');
  log('3. 執行: npx vibecoding-system init --name "test-project"');
  log('4. 開始對話式開發: npx vibecoding-system chat');
  
  log('\n📖 詳細說明請參考：');
  log('- IDE_SETUP_GUIDE.md - 完整設定指南');
  log('- README.md - 使用說明');
  
  log('\n💬 需要協助？');
  log('- GitHub: https://github.com/vibecoding/issues');
  log('- Discord: https://discord.gg/vibecoding');
}

function main() {
  log('🚀 VibeCoding 一鍵設定工具', COLORS.BLUE + COLORS.BOLD);
  log('============================================');
  
  // 檢查系統需求
  checkRequirements();
  
  // 偵測 IDE
  const ides = detectIDE();
  
  // 安裝 VibeCoding
  installVibeCoding();
  
  // 設定 API 金鑰提示
  promptForAPIKeys();
  
  // 設定各個 IDE
  for (const ide of ides) {
    switch (ide.type) {
      case 'cursor':
        setupCursor(ide.path);
        break;
      case 'vscode':
        setupVSCode(ide.path);
        break;
      case 'claude':
        setupClaude(ide.path);
        break;
    }
  }
  
  // 驗證安裝
  verifyInstallation();
  
  // 顯示後續步驟
  showNextSteps();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 