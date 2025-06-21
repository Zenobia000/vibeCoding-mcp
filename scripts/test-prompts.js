#!/usr/bin/env node

/**
 * VibeCoding Prompt System Validation Script
 * 
 * This script validates the integrity and completeness of the prompt system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, '../.vibecoding/prompts');

// Expected prompt structure
const EXPECTED_STRUCTURE = {
  core: [
    'system-identity.md',
    'conversation-style.md', 
    'collaboration-rules.md'
  ],
  services: [
    'context-manager.md',
    'code-generator.md',
    'dependency-tracker.md',
    'test-validator.md',
    'doc-generator.md',
    'deployment-manager.md'
  ],
  workflows: [
    'discovery-phase.md',
    'design-phase.md',
    'implementation-phase.md',
    'validation-phase.md',
    'deployment-phase.md'
  ]
};

// Validation functions
function validateFileExists(filePath) {
  return fs.existsSync(filePath);
}

function validateFileContent(filePath, minLength = 1000) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return {
      exists: true,
      length: content.length,
      valid: content.length >= minLength,
      hasHeaders: content.includes('##'),
      hasPrompts: content.includes('🤖'),
      hasExamples: content.includes('```')
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
}

function validatePromptStructure() {
  console.log('🔍 Validating VibeCoding Prompt System...\n');
  
  let totalFiles = 0;
  let validFiles = 0;
  let issues = [];

  // Check each category
  for (const [category, files] of Object.entries(EXPECTED_STRUCTURE)) {
    console.log(`📁 ${category.toUpperCase()} Prompts:`);
    
    const categoryPath = path.join(PROMPTS_DIR, category);
    
    if (!fs.existsSync(categoryPath)) {
      issues.push(`❌ Missing ${category} directory`);
      console.log(`  ❌ Directory not found: ${categoryPath}`);
      continue;
    }
    
    for (const file of files) {
      totalFiles++;
      const filePath = path.join(categoryPath, file);
      const validation = validateFileContent(filePath);
      
      if (validation.exists && validation.valid) {
        validFiles++;
        console.log(`  ✅ ${file} (${validation.length} chars)`);
        
        // Additional content checks
        if (!validation.hasHeaders) {
          console.log(`    ⚠️  Missing markdown headers`);
        }
        if (!validation.hasPrompts) {
          console.log(`    ⚠️  Missing prompt examples (🤖)`);
        }
        if (!validation.hasExamples) {
          console.log(`    ⚠️  Missing code examples`);
        }
      } else if (validation.exists) {
        console.log(`  ⚠️  ${file} (${validation.length} chars - too short)`);
        issues.push(`File too short: ${file}`);
      } else {
        console.log(`  ❌ ${file} - Not found`);
        issues.push(`Missing file: ${file}`);
      }
    }
    console.log('');
  }
  
  return {
    totalFiles,
    validFiles,
    issues,
    completeness: (validFiles / totalFiles) * 100
  };
}

function validatePromptManager() {
  console.log('🔧 Validating Prompt Manager...\n');
  
  const promptManagerPath = path.join(__dirname, '../src/utils/prompt-manager.ts');
  
  if (!validateFileExists(promptManagerPath)) {
    console.log('❌ Prompt Manager not found');
    return false;
  }
  
  const content = fs.readFileSync(promptManagerPath, 'utf8');
  const checks = [
    { name: 'PromptManager class', pattern: /class PromptManager/ },
    { name: 'ServiceId enum', pattern: /enum ServiceId/ },
    { name: 'DevelopmentPhase enum', pattern: /enum DevelopmentPhase/ },
    { name: 'buildMCPServicePrompt function', pattern: /buildMCPServicePrompt/ },
    { name: 'Service configurations', pattern: /SERVICE_CONFIGS/ }
  ];
  
  let passed = 0;
  for (const check of checks) {
    if (check.pattern.test(content)) {
      console.log(`  ✅ ${check.name}`);
      passed++;
    } else {
      console.log(`  ❌ ${check.name}`);
    }
  }
  
  console.log(`\n📊 Prompt Manager: ${passed}/${checks.length} checks passed\n`);
  return passed === checks.length;
}

function validateServiceIntegration() {
  console.log('🔗 Validating Service Integration...\n');
  
  const contextManagerPath = path.join(__dirname, '../vibe-services/context-manager/index.ts');
  
  if (!validateFileExists(contextManagerPath)) {
    console.log('❌ Context Manager service not found');
    return false;
  }
  
  const content = fs.readFileSync(contextManagerPath, 'utf8');
  const integrationChecks = [
    { name: 'Prompt system import', pattern: /buildMCPServicePrompt/ },
    { name: 'Service prompt initialization', pattern: /initializePromptSystem/ },
    { name: 'AI insight generation', pattern: /getAIInsight/ }
  ];
  
  let passed = 0;
  for (const check of integrationChecks) {
    if (check.pattern.test(content)) {
      console.log(`  ✅ ${check.name}`);
      passed++;
    } else {
      console.log(`  ❌ ${check.name}`);
    }
  }
  
  console.log(`\n📊 Service Integration: ${passed}/${integrationChecks.length} checks passed\n`);
  return passed === integrationChecks.length;
}

function generateReport(results) {
  console.log('📋 VALIDATION REPORT');
  console.log('='.repeat(50));
  console.log(`📁 Total Prompt Files: ${results.totalFiles}`);
  console.log(`✅ Valid Files: ${results.validFiles}`);
  console.log(`📊 Completeness: ${results.completeness.toFixed(1)}%`);
  
  if (results.issues.length > 0) {
    console.log('\n⚠️  Issues Found:');
    results.issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  console.log('\n🎯 Prompt System Status:');
  if (results.completeness === 100) {
    console.log('   🎉 FULLY OPERATIONAL - All prompts are ready!');
  } else if (results.completeness >= 80) {
    console.log('   ✅ MOSTLY READY - Minor issues to fix');
  } else {
    console.log('   ⚠️  NEEDS ATTENTION - Major issues found');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('   1. Fix any missing or incomplete prompt files');
  console.log('   2. Test prompt loading in services');
  console.log('   3. Validate service behavior with prompts');
  console.log('   4. Run integration tests');
}

// Main execution
function main() {
  console.log('🎯 VibeCoding Prompt System Validator\n');
  
  const promptResults = validatePromptStructure();
  const managerValid = validatePromptManager();
  const integrationValid = validateServiceIntegration();
  
  generateReport(promptResults);
  
  console.log('\n🔧 System Components:');
  console.log(`   Prompt Manager: ${managerValid ? '✅' : '❌'}`);
  console.log(`   Service Integration: ${integrationValid ? '✅' : '❌'}`);
  
  const overallHealth = promptResults.completeness >= 80 && managerValid && integrationValid;
  console.log(`\n🏥 Overall System Health: ${overallHealth ? '🟢 HEALTHY' : '🔴 NEEDS WORK'}`);
  
  process.exit(overallHealth ? 0 : 1);
}

main(); 