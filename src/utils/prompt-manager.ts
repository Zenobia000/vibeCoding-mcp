/**
 * VibeCoding Prompt 管理系統
 * 負責載入、組合和管理所有 MCP 服務的 prompts
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

// Prompt 類型定義
export interface PromptConfig {
  serviceId: string;
  serviceName: string;
  corePrompts: string[];
  servicePrompt: string;
  workflowPrompts?: string[];
  customPrompts?: string[];
}

export interface CombinedPrompt {
  systemIdentity: string;
  serviceRole: string;
  workflowContext: string;
  fullPrompt: string;
  metadata: {
    serviceId: string;
    phase?: string;
    version: string;
    loadedAt: Date;
  };
}

// 服務 ID 枚舉
export enum ServiceId {
  CONTEXT_MANAGER = 'context-manager',
  CODE_GENERATOR = 'code-generator',
  DEPENDENCY_TRACKER = 'dependency-tracker',
  TEST_VALIDATOR = 'test-validator',
  DOC_GENERATOR = 'doc-generator',
  DEPLOYMENT_MANAGER = 'deployment-manager'
}

// 開發階段枚舉
export enum DevelopmentPhase {
  DISCOVERY = 'discovery',
  DESIGN = 'design',
  IMPLEMENTATION = 'implementation',
  VALIDATION = 'validation',
  DEPLOYMENT = 'deployment'
}

export class PromptManager {
  private promptsBasePath: string;
  private promptCache = new Map<string, string>();
  private combinedPromptCache = new Map<string, CombinedPrompt>();

  constructor(promptsBasePath: string = '.vibecoding/prompts') {
    this.promptsBasePath = promptsBasePath;
  }

  /**
   * 載入單個 prompt 文件
   */
  async loadPrompt(promptPath: string): Promise<string> {
    const cacheKey = promptPath;
    
    if (this.promptCache.has(cacheKey)) {
      return this.promptCache.get(cacheKey)!;
    }

    try {
      const fullPath = join(process.cwd(), this.promptsBasePath, promptPath);
      const content = await readFile(fullPath, 'utf-8');
      
      this.promptCache.set(cacheKey, content);
      return content;
    } catch (error) {
      console.warn(`Failed to load prompt: ${promptPath}`, error);
      return `# Prompt not found: ${promptPath}\n\nPlease ensure the prompt file exists.`;
    }
  }

  /**
   * 為特定服務組合完整的 prompt
   */
  async buildServicePrompt(
    serviceId: ServiceId,
    phase?: DevelopmentPhase,
    customContext?: Record<string, any>
  ): Promise<CombinedPrompt> {
    const cacheKey = `${serviceId}-${phase || 'default'}-${JSON.stringify(customContext)}`;
    
    if (this.combinedPromptCache.has(cacheKey)) {
      return this.combinedPromptCache.get(cacheKey)!;
    }

    try {
      // 載入核心 prompts
      const systemIdentity = await this.loadPrompt('core/system-identity.md');
      const conversationStyle = await this.loadPrompt('core/conversation-style.md');
      const collaborationRules = await this.loadPrompt('core/collaboration-rules.md');

      // 載入服務專用 prompt
      const servicePrompt = await this.loadPrompt(`services/${serviceId}.md`);

      // 載入階段相關 prompt (如果指定)
      let workflowContext = '';
      if (phase) {
        workflowContext = await this.loadPrompt(`workflows/${phase}-phase.md`);
      }

      // 組合完整 prompt
      const fullPrompt = this.combinePrompts({
        systemIdentity,
        conversationStyle,
        collaborationRules,
        servicePrompt,
        workflowContext,
        customContext
      });

      const combinedPrompt: CombinedPrompt = {
        systemIdentity,
        serviceRole: servicePrompt,
        workflowContext,
        fullPrompt,
        metadata: {
          serviceId,
          phase,
          version: '1.0.0',
          loadedAt: new Date()
        }
      };

      this.combinedPromptCache.set(cacheKey, combinedPrompt);
      return combinedPrompt;

    } catch (error) {
      console.error(`Failed to build prompt for service ${serviceId}:`, error);
      throw new Error(`Prompt building failed for service: ${serviceId}`);
    }
  }

  /**
   * 組合多個 prompt 為完整的系統 prompt
   */
  private combinePrompts(components: {
    systemIdentity: string;
    conversationStyle: string;
    collaborationRules: string;
    servicePrompt: string;
    workflowContext: string;
    customContext?: Record<string, any>;
  }): string {
    const { 
      systemIdentity, 
      conversationStyle, 
      collaborationRules, 
      servicePrompt, 
      workflowContext,
      customContext 
    } = components;

    let combinedPrompt = `# VibeCoding 系統 Prompt

## 🎯 系統身份和核心理念
${systemIdentity}

## 🎪 對話風格指南
${conversationStyle}

## 🤝 服務協作規則
${collaborationRules}

## 🛠️ 服務專用職責和指導
${servicePrompt}
`;

    // 添加階段特定上下文
    if (workflowContext) {
      combinedPrompt += `
## 📋 當前階段工作流程
${workflowContext}
`;
    }

    // 添加自定義上下文
    if (customContext) {
      combinedPrompt += `
## 🔧 自定義上下文
${JSON.stringify(customContext, null, 2)}
`;
    }

    combinedPrompt += `
---

**重要提醒**: 始終遵循以上所有指導原則，確保提供一致、高質量的 VibeCoding 體驗。
`;

    return combinedPrompt;
  }

  /**
   * 獲取所有可用的服務 prompts
   */
  async getAvailableServices(): Promise<ServiceId[]> {
    return Object.values(ServiceId);
  }

  /**
   * 獲取所有可用的開發階段
   */
  async getAvailablePhases(): Promise<DevelopmentPhase[]> {
    return Object.values(DevelopmentPhase);
  }

  /**
   * 清除 prompt 緩存
   */
  clearCache(): void {
    this.promptCache.clear();
    this.combinedPromptCache.clear();
  }

  /**
   * 重新載入指定服務的 prompt
   */
  async reloadServicePrompt(serviceId: ServiceId): Promise<void> {
    // 清除相關緩存
    const keysToDelete = Array.from(this.combinedPromptCache.keys())
      .filter(key => key.startsWith(serviceId));
    
    keysToDelete.forEach(key => this.combinedPromptCache.delete(key));
    
    // 清除服務 prompt 文件緩存
    this.promptCache.delete(`services/${serviceId}.md`);
  }

  /**
   * 驗證 prompt 配置
   */
  async validatePrompts(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      // 檢查核心 prompts
      const corePrompts = [
        'core/system-identity.md',
        'core/conversation-style.md',
        'core/collaboration-rules.md'
      ];

      for (const promptPath of corePrompts) {
        const content = await this.loadPrompt(promptPath);
        if (content.includes('Prompt not found')) {
          errors.push(`Missing core prompt: ${promptPath}`);
        }
      }

      // 檢查服務 prompts
      for (const serviceId of Object.values(ServiceId)) {
        const content = await this.loadPrompt(`services/${serviceId}.md`);
        if (content.includes('Prompt not found')) {
          errors.push(`Missing service prompt: ${serviceId}`);
        }
      }

      return {
        valid: errors.length === 0,
        errors
      };

    } catch (error) {
      errors.push(`Validation failed: ${error}`);
      return { valid: false, errors };
    }
  }
}

// 全局 prompt manager 實例
export const promptManager = new PromptManager();

/**
 * 便利函數：為 MCP 服務快速構建 prompt
 */
export async function buildMCPServicePrompt(
  serviceId: ServiceId,
  phase?: DevelopmentPhase,
  customContext?: Record<string, any>
): Promise<string> {
  const combinedPrompt = await promptManager.buildServicePrompt(serviceId, phase, customContext);
  return combinedPrompt.fullPrompt;
}

/**
 * 便利函數：獲取服務的基本角色 prompt
 */
export async function getServiceRolePrompt(serviceId: ServiceId): Promise<string> {
  return await promptManager.loadPrompt(`services/${serviceId}.md`);
}

/**
 * 便利函數：獲取階段特定的工作流程 prompt
 */
export async function getPhaseWorkflowPrompt(phase: DevelopmentPhase): Promise<string> {
  return await promptManager.loadPrompt(`workflows/${phase}-phase.md`);
}

/**
 * MCP 服務初始化時使用的 prompt 配置
 */
export class MCPServicePromptConfig {
  constructor(
    public serviceId: ServiceId,
    public defaultPhase?: DevelopmentPhase,
    public customPrompts: string[] = []
  ) {}

  async getFullPrompt(
    currentPhase?: DevelopmentPhase,
    context?: Record<string, any>
  ): Promise<string> {
    const phase = currentPhase || this.defaultPhase;
    return await buildMCPServicePrompt(this.serviceId, phase, context);
  }
}

// 預定義的服務配置
export const MCP_SERVICE_CONFIGS = {
  [ServiceId.CONTEXT_MANAGER]: new MCPServicePromptConfig(ServiceId.CONTEXT_MANAGER),
  [ServiceId.CODE_GENERATOR]: new MCPServicePromptConfig(ServiceId.CODE_GENERATOR, DevelopmentPhase.IMPLEMENTATION),
  [ServiceId.DEPENDENCY_TRACKER]: new MCPServicePromptConfig(ServiceId.DEPENDENCY_TRACKER),
  [ServiceId.TEST_VALIDATOR]: new MCPServicePromptConfig(ServiceId.TEST_VALIDATOR, DevelopmentPhase.VALIDATION),
  [ServiceId.DOC_GENERATOR]: new MCPServicePromptConfig(ServiceId.DOC_GENERATOR),
  [ServiceId.DEPLOYMENT_MANAGER]: new MCPServicePromptConfig(ServiceId.DEPLOYMENT_MANAGER, DevelopmentPhase.DEPLOYMENT)
}; 