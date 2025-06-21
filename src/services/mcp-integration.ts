import { spawn } from "child_process";
import { EventEmitter } from "events";
import path from "path";

// MCP Service Integration Interface
export interface MCPService {
  name: string;
  executable: string;
  args: string[];
  process?: any;
}

// MCP Integration Manager
export class MCPIntegrationManager extends EventEmitter {
  private services: Map<string, MCPService> = new Map();
  
  constructor() {
    super();
    this.initializeServices();
  }
  
  private initializeServices() {
    // Register existing MCP servers
    this.registerService({
      name: "mcp-vibecoder",
      executable: "node",
      args: [path.join(__dirname, "../../../mcp-vibecoder/dist/index.js")],
    });
    
    this.registerService({
      name: "prd-mcp-server",
      executable: "node", 
      args: [path.join(__dirname, "../../../PRD-MCP-Server/dist/index.js")],
    });
  }
  
  public registerService(service: MCPService) {
    this.services.set(service.name, service);
    console.log(`Registered MCP service: ${service.name}`);
  }
  
  public async startService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    if (service.process) {
      console.log(`Service ${name} is already running`);
      return;
    }
    
    return new Promise((resolve) => {
      const childProcess = spawn(service.executable, service.args, {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env },
      });
      
      service.process = childProcess;
      
      childProcess.stdout?.on("data", (data: Buffer) => {
        this.emit("service:output", { service: name, data: data.toString() });
      });
      
      childProcess.stderr?.on("data", (data: Buffer) => {
        this.emit("service:error", { service: name, data: data.toString() });
      });
      
      childProcess.on("close", (code: number | null) => {
        service.process = null;
        this.emit("service:closed", { service: name, code });
      });
      
      // Give the service time to start
      setTimeout(() => resolve(), 2000);
    });
  }
  
  public async stopService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service || !service.process) {
      return;
    }
    
    return new Promise((resolve) => {
      service.process.on("close", () => {
        service.process = null;
        resolve();
      });
      
      service.process.kill("SIGTERM");
    });
  }
  
  public async stopAllServices(): Promise<void> {
    const promises = Array.from(this.services.keys()).map(name => 
      this.stopService(name)
    );
    await Promise.all(promises);
  }
}

// Example: VibeCoding Service Adapter
export class VibeCodingServiceAdapter {
  private mcpManager: MCPIntegrationManager;
  
  constructor() {
    this.mcpManager = new MCPIntegrationManager();
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.mcpManager.on("service:output", ({ service, data }) => {
      console.log(`[${service}] ${data}`);
    });
    
    this.mcpManager.on("service:error", ({ service, data }) => {
      console.error(`[${service}] ERROR: ${data}`);
    });
  }
  
  // Integrate mcp-vibecoder for structured development
  public async startFeatureDevelopment(featureName: string, description: string) {
    await this.mcpManager.startService("mcp-vibecoder");
    
    // Use mcp-vibecoder's clarification flow
    const clarificationRequest = {
      tool: "start_feature_clarification",
      arguments: {
        featureName,
        initialDescription: description,
      },
    };
    
    console.log("Starting feature clarification with mcp-vibecoder...");
    // In real implementation, this would communicate with the MCP server
    return clarificationRequest;
  }
  
  // Integrate PRD-MCP-Server for documentation
  public async generatePRD(productName: string, features: string[]) {
    await this.mcpManager.startService("prd-mcp-server");
    
    // Use PRD-MCP-Server's PRD generation
    const prdRequest = {
      tool: "generate_prd",
      arguments: {
        productName,
        productDescription: "Generated from VibeCoding conversation",
        targetAudience: "Developers and stakeholders",
        coreFeatures: features,
      },
    };
    
    console.log("Generating PRD with PRD-MCP-Server...");
    return prdRequest;
  }
  
  // Combined workflow example
  public async runIntegratedWorkflow(projectName: string) {
    console.log(`\n🚀 Starting integrated workflow for: ${projectName}\n`);
    
    // Phase 1: Discovery with mcp-vibecoder
    console.log("📝 Phase 1: Discovery");
    await this.startFeatureDevelopment(projectName, "Initial project setup");
    
    // Phase 2: Generate PRD with PRD-MCP-Server
    console.log("\n📄 Phase 2: Documentation");
    await this.generatePRD(projectName, [
      "User authentication",
      "Dashboard interface",
      "API integration",
    ]);
    
    // Continue with other phases...
    console.log("\n✅ Integrated workflow completed!");
    
    // Cleanup
    await this.mcpManager.stopAllServices();
  }
}

// Usage Example
async function demonstrateIntegration() {
  const adapter = new VibeCodingServiceAdapter();
  
  try {
    await adapter.runIntegratedWorkflow("awesome-app");
  } catch (error) {
    console.error("Integration error:", error);
  }
}

// Export for use in VibeCoding system
export { demonstrateIntegration }; 