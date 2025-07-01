#!/usr/bin/env node

/**
 * VibeCoding Context Manager MCP Server
 * Simplified context management without projectId complexity.
 * Uses current working directory as project context.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path, { join, resolve } from 'path';
import { z } from 'zod';
import { fileURLToPath } from 'url';

// Core types and utilities
import { Project, ClarificationResponse } from '../../src/core/orchestrator.js';
import { createProjectObject, DEFAULT_CLARIFICATION_QUESTIONS } from '../../src/utils/project-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class VibeContextManager {
  constructor() {}

  private getContextDir(): string {
    return join(process.cwd(), '.vibecoding', 'context');
  }

  private getCurrentProjectFile(): string {
    return join(this.getContextDir(), 'current-project.json');
  }

  private loadCurrentProject(): Project | null {
    const projectFile = this.getCurrentProjectFile();
    if (existsSync(projectFile)) {
      try {
        const data = JSON.parse(readFileSync(projectFile, 'utf-8'));
        return data;
    } catch (error) {
        console.error('Failed to load current project:', error);
      }
    }
    return null;
  }

  private saveCurrentProject(project: Project): void {
    const contextDir = this.getContextDir();
    if (!existsSync(contextDir)) {
      mkdirSync(contextDir, { recursive: true });
    }
    const projectFile = this.getCurrentProjectFile();
    try {
      writeFileSync(projectFile, JSON.stringify(project, null, 2));
    } catch (error) {
      console.error('Failed to save current project:', error);
    }
  }

  async startProjectClarification(projectName: string, initialDescription: string = ""): Promise<{
    question: string;
  }> {
    const projectPath = process.cwd();
    const project = createProjectObject(projectName, initialDescription, projectPath);
    this.saveCurrentProject(project);

    const firstQuestion = DEFAULT_CLARIFICATION_QUESTIONS[0];
    return {
      question: firstQuestion,
    };
  }

  async provideClarification(
    questionIndex: number, 
    answer: string
  ): Promise<{ success: boolean; nextQuestion?: string; isComplete: boolean; message: string }> {
      const project = this.loadCurrentProject();
    if (!project) {
          throw new Error('No active project found. Please start clarification first.');
    }

    const clarificationResponse: ClarificationResponse = {
      question: DEFAULT_CLARIFICATION_QUESTIONS[questionIndex],
      answer,
      timestamp: new Date()
    };

      if (!project.clarificationResponses) {
          project.clarificationResponses = [];
      }
    project.clarificationResponses.push(clarificationResponse);
    project.updatedAt = new Date();
      this.saveCurrentProject(project);

    const nextIndex = questionIndex + 1;
    if (nextIndex >= DEFAULT_CLARIFICATION_QUESTIONS.length) {
      return {
        success: true,
        isComplete: true,
              message: `✅ Project clarification complete! You can now generate the PRD.`
      };
    }

    return {
      success: true,
          nextQuestion: DEFAULT_CLARIFICATION_QUESTIONS[nextIndex],
      isComplete: false,
          message: `✅ Answer recorded. Next question:`
      };
  }

  async generateProjectPRD(): Promise<string> {
    const project = this.loadCurrentProject();
    if (!project) {
      throw new Error('No active project found. Please start clarification first.');
    }

    const promptPath = resolve(__dirname, '../../../.vibecoding/prompts/workflows/discovery-phase.md');
    let prdContent = `Failed to load PRD template.`;
    if (existsSync(promptPath)) {
      prdContent = readFileSync(promptPath, 'utf-8');
    }
    
    prdContent = prdContent.replace(/{{projectName}}/g, project.name);

    const outputPath = join(project.path, '0_discovery', 'requirements', 'PRODUCT_REQUIREMENTS_DOCUMENT.md');
    
    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, prdContent);

    return `✅ PRD document generated and saved to: ${outputPath}`;
  }

  async generateProjectImplementationPlan(): Promise<string> {
    const project = this.loadCurrentProject();
    if (!project) {
      throw new Error('No active project found. Please start clarification first.');
    }

    const promptPath = resolve(__dirname, '../../../.vibecoding/prompts/workflows/design-phase.md');
    let planContent = `Failed to load implementation plan template.`;
    if (existsSync(promptPath)) {
      planContent = readFileSync(promptPath, 'utf-8');
    }
    
    planContent = planContent.replace(/{{projectName}}/g, project.name);

    const outputPath = join(project.path, '1_design', 'IMPLEMENTATION_PLAN.md');
    
    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, planContent);

    return `✅ Implementation plan generated and saved to: ${outputPath}`;
  }
}

const server = new Server(
  {
    name: 'vibecoding-context-manager',
    version: '2.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

const contextManager = new VibeContextManager();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'start-clarification',
        description: 'Start a project clarification process',
        inputSchema: {
          type: 'object',
          properties: {
            projectName: {
              type: 'string',
              description: 'The name of the project'
            },
            initialDescription: {
              type: 'string',
              description: 'Initial description of the project'
            }
          },
          required: ['projectName']
        }
      },
      {
        name: 'provide-clarification',
        description: 'Provide a clarification answer',
        inputSchema: {
          type: 'object',
          properties: {
            questionIndex: { type: 'number' },
            answer: { type: 'string' }
          },
          required: ['questionIndex', 'answer']
        }
      },
      {
        name: 'generate-prd',
        description: 'Generate a project PRD and save it to the project structure',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'generate-impl-plan',
        description: 'Generate a project implementation plan and save it',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'start-clarification': {
        const { projectName, initialDescription } = z.object({
          projectName: z.string(),
          initialDescription: z.string().optional()
        }).parse(args);
        
        const result = await contextManager.startProjectClarification(projectName, initialDescription);
        return {
          content: [
            {
              type: 'text',
              text: `🚀 Project clarification started for "${projectName}".\n\nQuestion 1: ${result.question}`
            }
          ]
        };
      }

      case 'provide-clarification': {
        const { questionIndex, answer } = z.object({
          questionIndex: z.number(),
          answer: z.string()
        }).parse(args);
        const result = await contextManager.provideClarification(questionIndex, answer);
        let text = result.message;
        if(result.nextQuestion) {
            text += `\n\nNext question: ${result.nextQuestion}`;
        }
        return { content: [{ type: 'text', text }] };
      }

      case 'generate-prd': {
        const resultMessage = await contextManager.generateProjectPRD();
        return {
          content: [
            {
              type: 'text',
              text: resultMessage
            }
          ]
        };
      }

      case 'generate-impl-plan': {
        const resultMessage = await contextManager.generateProjectImplementationPlan();
        return {
          content: [
            {
              type: 'text',
              text: resultMessage
            }
          ]
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('Tool execution error:', error);
    if (error instanceof z.ZodError) {
      throw new McpError(ErrorCode.InvalidRequest, `Invalid arguments: ${error.message}`);
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  console.error('🎯 VibeCoding Context Manager MCP Server v2.0 starting...');
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 