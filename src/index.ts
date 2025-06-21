#!/usr/bin/env node

import { VibeCodingOrchestrator } from "./core/orchestrator.js";
import { MCPIntegrationManager } from "./services/mcp-integration.js";

/**
 * VibeCoding System Main Entry Point
 * This starts the full VibeCoding orchestrated system
 */
async function main() {
  console.log("🚀 Starting VibeCoding System...\n");

  try {
    // Initialize the orchestrator
    const orchestrator = new VibeCodingOrchestrator();
    
    // Setup graceful shutdown
    process.on('SIGINT', async () => {
      console.log("\n🛑 Shutting down VibeCoding System...");
      await orchestrator.shutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log("\n🛑 Shutting down VibeCoding System...");
      await orchestrator.shutdown();
      process.exit(0);
    });

    // Initialize the system
    await orchestrator.initialize();

    // Initialize MCP Integration
    const mcpManager = new MCPIntegrationManager();
    console.log("🔗 MCP Integration Manager initialized");
    
    // Store reference for cleanup
    orchestrator.on("shutdown", async () => {
      await mcpManager.stopAllServices();
    });

    console.log("\n✅ VibeCoding System is ready!");
    console.log("💡 Use 'vibecoding' CLI commands to interact with the system");
    console.log("   - vibecoding init     : Initialize a new project");
    console.log("   - vibecoding chat     : Start conversation session");
    console.log("   - vibecoding status   : Check project status");
    console.log("   - vibecoding docs     : Generate documentation");

    // Keep the process running
    console.log("\n🔄 System running... Press Ctrl+C to stop\n");

  } catch (error) {
    console.error("❌ Failed to start VibeCoding System:", error);
    process.exit(1);
  }
}

// Start the system if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main }; 