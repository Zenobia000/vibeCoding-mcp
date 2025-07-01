/**
 * Project utility functions adapted from mcp-vibecoder
 */

import { Project, ClarificationResponse, WorkflowPhase, Task, PhaseStatus } from '../core/orchestrator.js';

/**
 * Default questions to ask during project clarification
 */
export const DEFAULT_CLARIFICATION_QUESTIONS = [
  "What specific problem does this project solve?",
  "Who are the target users for this project?",
  "What are the key requirements for this project?",
  "What are the technical constraints or considerations?",
  "How will we measure the success of this project?",
  "Are there any dependencies on other projects or systems?",
  "What are the potential risks or challenges in implementing this project?"
];

/**
 * Generate a unique ID for projects with proper prefix
 */
export function generateProjectId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `project-${randomPart}`;
}

/**
 * Generate a unique ID for phases with proper prefix
 */
export function generatePhaseId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `phase-${randomPart}`;
}

/**
 * Generate a unique ID for tasks with proper prefix
 */
export function generateTaskId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `task-${randomPart}`;
}

/**
 * Create a new timestamp
 */
export function now(): Date {
  return new Date();
}

/**
 * Create a default project object with the given name and description
 */
export function createProjectObject(name: string, description: string = "", projectPath: string): Project {
  const timestamp = now();
  return {
    id: generateProjectId(),
    name,
    description,
    path: projectPath,
    clarificationResponses: [],
    phases: [],
    techStack: {},
    decisions: [],
    preferences: {},
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

/**
 * Create a default phase object with the given name and description
 */
export function createPhaseObject(name: string, description: string): WorkflowPhase {
  const timestamp = now();
  return {
    id: generatePhaseId(),
    name,
    description,
    tasks: [],
    status: "pending",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

/**
 * Create a default task object with the given description
 */
export function createTaskObject(description: string): Task {
  const timestamp = now();
  return {
    id: generateTaskId(),
    description,
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

/**
 * Get the next clarification question for a project
 */
export function getNextClarificationQuestion(project: Project): string | null {
  if (!project.clarificationResponses) {
    return DEFAULT_CLARIFICATION_QUESTIONS[0];
  }
  
  // Check if we've asked all the default questions
  if (project.clarificationResponses.length >= DEFAULT_CLARIFICATION_QUESTIONS.length) {
    return null; // All questions answered
  }
  
  // Get the next question based on the number of responses
  return DEFAULT_CLARIFICATION_QUESTIONS[project.clarificationResponses.length];
}

/**
 * Check if a project has completed the clarification process
 */
export function isClarificationComplete(project: Project): boolean {
  if (!project.clarificationResponses) {
    return false;
  }
  return project.clarificationResponses.length >= DEFAULT_CLARIFICATION_QUESTIONS.length;
}

/**
 * Format clarification responses as text
 */
export function formatClarificationResponses(responses: ClarificationResponse[]): string {
  if (!responses || responses.length === 0) {
    return "No clarification responses yet.";
  }
  
  return responses.map(cr => `Q: ${cr.question}\nA: ${cr.answer}`).join('\n\n');
}

/**
 * Generate a detailed progress summary for a project
 */
export function generateProjectProgressSummary(project: Project): string {
  const totalPhases = project.phases.length;
  const completedPhases = project.phases.filter(p => p.status === 'completed' || p.status === 'reviewed').length;
  const inProgressPhases = project.phases.filter(p => p.status === 'in_progress').length;
  
  const totalTasks = project.phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = project.phases.reduce(
    (acc, phase) => acc + phase.tasks.filter(t => t.completed).length, 0
  );
  
  const phaseProgress = totalPhases > 0
    ? Math.round((completedPhases / totalPhases) * 100)
    : 0;
  
  const taskProgress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  let summary = `
# Project Progress: ${project.name}

## Overview
- Project ID: ${project.id}
- Created: ${project.createdAt.toISOString()}
- Last Updated: ${project.updatedAt.toISOString()}
- Description: ${project.description}

## Progress Summary
- Phases: ${completedPhases}/${totalPhases} completed (${phaseProgress}%)
- Tasks: ${completedTasks}/${totalTasks} completed (${taskProgress}%)
- Phases in Progress: ${inProgressPhases}

## Phase Details
`;

  if (totalPhases === 0) {
    summary += "\nNo phases defined for this project yet.";
  } else {
    project.phases.forEach(phase => {
      const phaseTasks = phase.tasks.length;
      const phaseCompletedTasks = phase.tasks.filter(t => t.completed).length;
      const phaseTaskProgress = phaseTasks > 0
        ? Math.round((phaseCompletedTasks / phaseTasks) * 100)
        : 0;

      summary += `
### ${phase.name} (${phase.status})
- ID: ${phase.id}
- Progress: ${phaseCompletedTasks}/${phaseTasks} tasks (${phaseTaskProgress}%)
- Description: ${phase.description}

Tasks:
${phase.tasks.map(task => `- [${task.completed ? 'x' : ' '}] ${task.description}`).join('\n')}
`;
    });
  }

  return summary;
}

/**
 * Validate if a status is a valid phase status
 */
export function isValidPhaseStatus(status: string): status is PhaseStatus {
  return ['pending', 'in_progress', 'completed', 'reviewed'].includes(status);
}
