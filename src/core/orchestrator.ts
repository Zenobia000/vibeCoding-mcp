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

export interface WorkflowPhase {
  name: string;
  status: "pending" | "in-progress" | "completed";
  startTime?: Date;
  endTime?: Date;
  artifacts: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created: Date;
  phases: WorkflowPhase[];
  currentPhase: string;
  metadata: Record<string, any>;
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
    const project: Project = {
      id: this.generateProjectId(),
      name,
      description,
      created: new Date(),
      phases: this.config.workflow.phases.map(phase => ({
        name: phase,
        status: "pending",
        artifacts: [],
      })),
      currentPhase: this.config.workflow.phases[0],
      metadata: {},
    };
    
    this.currentProject = project;
    await this.saveCurrentProject();
    
    this.emit("project:created", project);
    return project;
  }

  private generateProjectId(): string {
    return `vibe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
    
    phase.status = "in-progress";
    phase.startTime = new Date();
    this.currentProject.currentPhase = phaseName;
    
    await this.saveCurrentProject();
    this.emit("phase:started", phase);
  }

  public async completePhase(phaseName: string, artifacts: string[] = []) {
    if (!this.currentProject) {
      throw new Error("No active project");
    }
    
    const phase = this.currentProject.phases.find(p => p.name === phaseName);
    if (!phase) {
      throw new Error(`Phase ${phaseName} not found`);
    }
    
    phase.status = "completed";
    phase.endTime = new Date();
    phase.artifacts = artifacts;
    
    // Auto-progress to next phase if enabled
    if (this.config.workflow.autoProgressTracking) {
      const currentIndex = this.currentProject.phases.findIndex(p => p.name === phaseName);
      if (currentIndex < this.currentProject.phases.length - 1) {
        const nextPhase = this.currentProject.phases[currentIndex + 1];
        await this.startPhase(nextPhase.name);
      }
    }
    
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