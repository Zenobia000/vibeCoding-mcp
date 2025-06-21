import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schemas
const DependencySchema = z.object({
  name: z.string(),
  version: z.string(),
  type: z.enum(["production", "development", "peer", "optional"]),
  resolved: z.string().optional(),
  dependencies: z.record(z.string()).optional(),
});

const PackageInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  peerDependencies: z.record(z.string()).optional(),
  optionalDependencies: z.record(z.string()).optional(),
});

const VulnerabilitySchema = z.object({
  name: z.string(),
  severity: z.enum(["low", "moderate", "high", "critical"]),
  description: z.string(),
  fixAvailable: z.boolean(),
  recommendedVersion: z.string().optional(),
});

// Dependency Tracker Class
class DependencyTracker {
  private projectRoot: string;
  private dependencyCache: Map<string, z.infer<typeof DependencySchema>> = new Map();
  private vulnerabilities: Map<string, z.infer<typeof VulnerabilitySchema>> = new Map();
  
  constructor(projectRoot: string = ".") {
    this.projectRoot = projectRoot;
    this.scanDependencies();
  }

  private async scanDependencies() {
    // Scan package.json
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      await this.scanNodeDependencies(packageJsonPath);
    }

    // Scan requirements.txt (Python)
    const requirementsPath = path.join(this.projectRoot, "requirements.txt");
    if (fs.existsSync(requirementsPath)) {
      await this.scanPythonDependencies(requirementsPath);
    }

    // Additional language support can be added here
  }

  private async scanNodeDependencies(packageJsonPath: string) {
    try {
      const packageJson = fs.readJsonSync(packageJsonPath);
      const packageInfo = PackageInfoSchema.parse(packageJson);

      // Production dependencies
      if (packageInfo.dependencies) {
        for (const [name, version] of Object.entries(packageInfo.dependencies)) {
          this.dependencyCache.set(name, {
            name,
            version,
            type: "production",
          });
        }
      }

      // Development dependencies
      if (packageInfo.devDependencies) {
        for (const [name, version] of Object.entries(packageInfo.devDependencies)) {
          this.dependencyCache.set(`dev:${name}`, {
            name,
            version,
            type: "development",
          });
        }
      }

      // Check for vulnerabilities using npm audit (simplified)
      try {
        const { stdout } = await execAsync("npm audit --json", { cwd: this.projectRoot });
        const auditResult = JSON.parse(stdout);
        this.processNpmAudit(auditResult);
      } catch (error) {
        // npm audit might fail if no package-lock.json exists
        console.error("Failed to run npm audit:", error);
      }
    } catch (error) {
      console.error("Failed to scan Node dependencies:", error);
    }
  }

  private async scanPythonDependencies(requirementsPath: string) {
    try {
      const content = fs.readFileSync(requirementsPath, "utf-8");
      const lines = content.split("\n").filter(line => line.trim() && !line.startsWith("#"));

      for (const line of lines) {
        const match = line.match(/^([^=<>!]+)([=<>!]+.+)?$/);
        if (match) {
          const [, name, version] = match;
          this.dependencyCache.set(`py:${name}`, {
            name: name.trim(),
            version: version ? version.trim() : "*",
            type: "production",
          });
        }
      }
    } catch (error) {
      console.error("Failed to scan Python dependencies:", error);
    }
  }

  private processNpmAudit(auditResult: any) {
    // Simplified vulnerability processing
    if (auditResult.vulnerabilities) {
      for (const [name, vuln] of Object.entries(auditResult.vulnerabilities as any)) {
        const vulnData = vuln as any;
        this.vulnerabilities.set(name, {
          name,
          severity: vulnData.severity || "low",
          description: vulnData.title || "Security vulnerability",
          fixAvailable: !!vulnData.fixAvailable,
          recommendedVersion: vulnData.fixAvailable?.version,
        });
      }
    }
  }

  public async addDependency(name: string, version: string, type: "production" | "development" = "production") {
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("No package.json found in project root");
    }

    const packageJson = fs.readJsonSync(packageJsonPath);
    const dependencyKey = type === "production" ? "dependencies" : "devDependencies";
    
    if (!packageJson[dependencyKey]) {
      packageJson[dependencyKey] = {};
    }
    
    packageJson[dependencyKey][name] = version;
    
    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
    
    // Update cache
    this.dependencyCache.set(type === "development" ? `dev:${name}` : name, {
      name,
      version,
      type,
    });

    return `Added ${name}@${version} to ${type} dependencies`;
  }

  public async updateDependency(name: string, newVersion: string) {
    const packageJsonPath = path.join(this.projectRoot, "package.json");
    
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error("No package.json found in project root");
    }

    const packageJson = fs.readJsonSync(packageJsonPath);
    let updated = false;

    // Check in production dependencies
    if (packageJson.dependencies && packageJson.dependencies[name]) {
      packageJson.dependencies[name] = newVersion;
      updated = true;
    }

    // Check in dev dependencies
    if (packageJson.devDependencies && packageJson.devDependencies[name]) {
      packageJson.devDependencies[name] = newVersion;
      updated = true;
    }

    if (!updated) {
      throw new Error(`Dependency ${name} not found`);
    }

    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
    await this.scanDependencies(); // Rescan

    return `Updated ${name} to version ${newVersion}`;
  }

  public getDependencyTree(): Record<string, any> {
    const tree: Record<string, any> = {
      production: {},
      development: {},
    };

    for (const [key, dep] of this.dependencyCache) {
      if (dep.type === "production") {
        tree.production[dep.name] = {
          version: dep.version,
          resolved: dep.resolved,
        };
      } else if (dep.type === "development") {
        tree.development[dep.name] = {
          version: dep.version,
          resolved: dep.resolved,
        };
      }
    }

    return tree;
  }

  public getVulnerabilities(): Array<z.infer<typeof VulnerabilitySchema>> {
    return Array.from(this.vulnerabilities.values());
  }

  public async checkForUpdates(): Promise<Record<string, string>> {
    const updates: Record<string, string> = {};
    
    // In a real implementation, this would check npm registry or PyPI
    // For demo purposes, we'll return mock data
    for (const [key, dep] of this.dependencyCache) {
      if (dep.version.includes("^") || dep.version.includes("~")) {
        // Simulate finding an update
        updates[dep.name] = "newer-version-available";
      }
    }

    return updates;
  }
}

// MCP Server
const dependencyTracker = new DependencyTracker();
const server = new Server(
  {
    name: "vibecoding-dependency-tracker",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "dependencies://tree",
        name: "Dependency Tree",
        description: "Complete dependency tree of the project",
        mimeType: "application/json",
      },
      {
        uri: "vulnerabilities://list",
        name: "Security Vulnerabilities",
        description: "List of known vulnerabilities in dependencies",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri === "dependencies://tree") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(dependencyTracker.getDependencyTree(), null, 2),
        },
      ],
    };
  }
  
  if (uri === "vulnerabilities://list") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(dependencyTracker.getVulnerabilities(), null, 2),
        },
      ],
    };
  }
  
  throw new Error(`Resource not found: ${uri}`);
});

// Tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "add_dependency":
      const { name: depName, version, type } = z.object({
        name: z.string(),
        version: z.string(),
        type: z.enum(["production", "development"]).optional(),
      }).parse(args);
      
      const result = await dependencyTracker.addDependency(depName, version, type);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };

    case "update_dependency":
      const { name: updateName, version: newVersion } = z.object({
        name: z.string(),
        version: z.string(),
      }).parse(args);
      
      const updateResult = await dependencyTracker.updateDependency(updateName, newVersion);
      return {
        content: [
          {
            type: "text",
            text: updateResult,
          },
        ],
      };

    case "check_vulnerabilities":
      const vulnerabilities = dependencyTracker.getVulnerabilities();
      return {
        content: [
          {
            type: "text",
            text: vulnerabilities.length > 0 
              ? `Found ${vulnerabilities.length} vulnerabilities:\n${JSON.stringify(vulnerabilities, null, 2)}`
              : "No vulnerabilities found",
          },
        ],
      };

    case "check_updates":
      const updates = await dependencyTracker.checkForUpdates();
      const updateCount = Object.keys(updates).length;
      return {
        content: [
          {
            type: "text",
            text: updateCount > 0
              ? `${updateCount} updates available:\n${JSON.stringify(updates, null, 2)}`
              : "All dependencies are up to date",
          },
        ],
      };

    case "scan_dependencies":
      await dependencyTracker["scanDependencies"]();
      const tree = dependencyTracker.getDependencyTree();
      return {
        content: [
          {
            type: "text",
            text: `Dependencies scanned:\n${JSON.stringify(tree, null, 2)}`,
          },
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport);
console.error("VibeCoding Dependency Tracker MCP Server running on stdio"); 