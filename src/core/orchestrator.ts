import { EventEmitter } from "events";
import path from "path";
import fs from "fs-extra";
import { z } from "zod";

// Types
export interface Service {
  name: string;
  enabled: boolean;
  status: "idle" | "running" | "error";
  start(): Promise<void>;
  stop(): Promise<void>;
}

/**
 * Represents a question and answer pair from the clarification process
 */
export interface ClarificationResponse {
  question: string;
  answer: string;
  timestamp: Date;
}

/**
 * Represents a task within a development phase
 */
export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Possible statuses for a development phase
 */
export type PhaseStatus = "pending" | "in_progress" | "completed" | "reviewed";

export interface WorkflowPhase {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  status: PhaseStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clarificationResponses: ClarificationResponse[];
  prd?: string;
  prdDoc?: string;
  implementationPlan?: string;
  implDoc?: string;
  phases: WorkflowPhase[];
  currentPhase?: string;
  techStack?: Record<string, string>;
  decisions?: Array<{
    id: string;
    timestamp: Date;
    decision: string;
    rationale: string;
    impact: string;
    service: string;
  }>;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Configuration Schema
const ConfigSchema = z.object({
  version: z.string(),
  projectName: z.string(),
  description: z.string(),
  services: z.record(z.object({
    enabled: z.boolean(),
  })),
  workflow: z.object({
    phases: z.array(z.string()),
    autoProgressTracking: z.boolean(),
  }),
  knowledgeBase: z.object({
    autoCapture: z.boolean(),
    categories: z.array(z.string()),
  }),
});

// VibeCoding Orchestrator
export class VibeCodingOrchestrator extends EventEmitter {
  private config!: z.infer<typeof ConfigSchema>;
  private services: Map<string, Service> = new Map();
  private currentProject: Project | null = null;
  private baseDir: string;

  constructor(baseDir: string = ".") {
    super();
    this.baseDir = baseDir;
    this.loadConfig();
  }

  private loadConfig() {
    const configPath = path.join(this.baseDir, ".vibecoding", "config", "vibe.config.json");
    if (!fs.existsSync(configPath)) {
      throw new Error("VibeCoding configuration not found. Please run 'vibecoding init' first.");
    }
    
    const rawConfig = fs.readJsonSync(configPath);
    this.config = ConfigSchema.parse(rawConfig);
  }

  public async initialize() {
    console.log("🚀 Initializing VibeCoding System...");
    
    // Initialize services based on config
    for (const [serviceName, serviceConfig] of Object.entries(this.config.services)) {
      if (serviceConfig.enabled) {
        await this.loadService(serviceName);
      }
    }
    
    // Load current project if exists
    await this.loadCurrentProject();
    
    this.emit("initialized");
    console.log("✅ VibeCoding System initialized successfully!");
  }

  private async loadService(serviceName: string) {
    try {
      console.log(`Loading service: ${serviceName}...`);
      
      // Service loading logic will be implemented for each service
      // For now, we'll create a placeholder
      const service: Service = {
        name: serviceName,
        enabled: true,
        status: "idle",
        async start() {
          this.status = "running";
          console.log(`${serviceName} started`);
        },
        async stop() {
          this.status = "idle";
          console.log(`${serviceName} stopped`);
        },
      };
      
      this.services.set(serviceName, service);
      await service.start();
      
    } catch (error) {
      console.error(`Failed to load service ${serviceName}:`, error);
    }
  }

  private async loadCurrentProject() {
    const projectFile = path.join(this.baseDir, ".vibecoding", "context", "current-project.json");
    if (fs.existsSync(projectFile)) {
      this.currentProject = fs.readJsonSync(projectFile);
    }
  }

  public async createProject(name: string, description: string): Promise<Project> {
    const now = new Date();
    const project: Project = {
      id: this.generateProjectId(),
      name,
      description,
      clarificationResponses: [],
      phases: [],
      createdAt: now,
      updatedAt: now,
    };
    
    this.currentProject = project;
    await this.saveCurrentProject();
    
    this.emit("project:created", project);
    return project;
  }

  private generateProjectId(): string {
    return `project-${Math.random().toString(36).substring(2, 10)}`;
  }

  private async saveCurrentProject() {
    if (!this.currentProject) return;
    
    const projectFile = path.join(this.baseDir, ".vibecoding", "context", "current-project.json");
    fs.writeJsonSync(projectFile, this.currentProject, { spaces: 2 });
  }

  public async startPhase(phaseName: string) {
    if (!this.currentProject) {
      throw new Error("No active project");
    }
    
    const phase = this.currentProject.phases.find(p => p.name === phaseName);
    if (!phase) {
      throw new Error(`Phase ${phaseName} not found`);
    }
    
    phase.status = "in_progress";
    phase.updatedAt = new Date();
    
    await this.saveCurrentProject();
    this.emit("phase:started", phase);
  }

  public async completePhase(phaseName: string) {
    if (!this.currentProject) {
      throw new Error("No active project");
    }
    
    const phase = this.currentProject.phases.find(p => p.name === phaseName);
    if (!phase) {
      throw new Error(`Phase ${phaseName} not found`);
    }
    
    phase.status = "completed";
    phase.updatedAt = new Date();
    
    await this.saveCurrentProject();
    this.emit("phase:completed", phase);
  }

  public async captureKnowledge(category: string, content: any) {
    if (!this.config.knowledgeBase.autoCapture) return;
    
    const timestamp = new Date().toISOString();
    const filename = `${category}-${timestamp.replace(/[:.]/g, "-")}.json`;
    const filepath = path.join(this.baseDir, "knowledge-base", category, filename);
    
    fs.ensureDirSync(path.dirname(filepath));
    fs.writeJsonSync(filepath, {
      timestamp,
      category,
      projectId: this.currentProject?.id,
      content,
    }, { spaces: 2 });
    
    this.emit("knowledge:captured", { category, filepath });
  }

  public getService(name: string): Service | undefined {
    return this.services.get(name);
  }

  public getCurrentProject(): Project | null {
    return this.currentProject;
  }

  public async shutdown() {
    console.log("Shutting down VibeCoding System...");
    
    for (const service of this.services.values()) {
      await service.stop();
    }
    
    this.emit("shutdown");
    console.log("VibeCoding System shut down successfully");
  }
} 