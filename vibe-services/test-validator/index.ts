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
const TestSuiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  framework: z.enum(["jest", "mocha", "vitest", "playwright", "cypress"]),
  language: z.string(),
  tests: z.array(z.object({
    name: z.string(),
    description: z.string(),
    code: z.string(),
    type: z.enum(["unit", "integration", "e2e", "performance"]),
  })),
  config: z.record(z.any()).optional(),
});

const TestResultSchema = z.object({
  suite: z.string(),
  testName: z.string(),
  status: z.enum(["passed", "failed", "skipped", "pending"]),
  duration: z.number(),
  error: z.string().optional(),
  assertions: z.number().optional(),
});

const CoverageReportSchema = z.object({
  overall: z.object({
    lines: z.number(),
    functions: z.number(),
    branches: z.number(),
    statements: z.number(),
  }),
  files: z.record(z.object({
    lines: z.number(),
    functions: z.number(),
    branches: z.number(),
    statements: z.number(),
    uncoveredLines: z.array(z.number()),
  })),
  threshold: z.object({
    lines: z.number(),
    functions: z.number(),
    branches: z.number(),
    statements: z.number(),
  }),
});

// Test Validator Class
class TestValidator {
  private testsDir: string;
  private reportsDir: string;
  private testSuites: Map<string, z.infer<typeof TestSuiteSchema>> = new Map();
  private testResults: Array<z.infer<typeof TestResultSchema>> = [];
  
  constructor(baseDir: string = ".") {
    this.testsDir = path.join(baseDir, "2_implementation", "tests");
    this.reportsDir = path.join(baseDir, "3_validation", "test-reports");
    this.ensureDirectories();
    this.loadTestSuites();
  }

  private ensureDirectories() {
    fs.ensureDirSync(this.testsDir);
    fs.ensureDirSync(this.reportsDir);
    fs.ensureDirSync(path.join(this.testsDir, "unit"));
    fs.ensureDirSync(path.join(this.testsDir, "integration"));
    fs.ensureDirSync(path.join(this.testsDir, "e2e"));
  }

  private loadTestSuites() {
    // Load existing test suites from disk
    if (fs.existsSync(this.testsDir)) {
      const suiteFiles = fs.readdirSync(this.testsDir).filter(f => f.endsWith('.suite.json'));
      for (const file of suiteFiles) {
        try {
          const suite = fs.readJsonSync(path.join(this.testsDir, file));
          const validated = TestSuiteSchema.parse(suite);
          this.testSuites.set(validated.id, validated);
        } catch (error) {
          console.error(`Failed to load test suite ${file}:`, error);
        }
      }
    }
  }

  public async generateUnitTests(filePath: string, language: string): Promise<string> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Extract functions to test
    const functions = this.extractFunctions(content, language);
    
    let testCode = '';
    
    if (language === 'typescript' || language === 'javascript') {
      testCode = this.generateJestTests(fileName, functions);
    } else if (language === 'python') {
      testCode = this.generatePytestTests(fileName, functions);
    }
    
    return testCode;
  }

  private extractFunctions(content: string, language: string): string[] {
    const functions: string[] = [];
    
    if (language === 'typescript' || language === 'javascript') {
      // Extract function names
      const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)|(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(/g;
      let match;
      while ((match = funcRegex.exec(content)) !== null) {
        functions.push(match[1] || match[2]);
      }
    } else if (language === 'python') {
      const funcRegex = /def\s+(\w+)\s*\(/g;
      let match;
      while ((match = funcRegex.exec(content)) !== null) {
        functions.push(match[1]);
      }
    }
    
    return functions;
  }

  private generateJestTests(fileName: string, functions: string[]): string {
    return `import { ${functions.join(', ')} } from '../src/${fileName}';

describe('${fileName}', () => {
${functions.map(func => `  describe('${func}', () => {
    it('should work correctly with valid input', () => {
      // TODO: Implement test for ${func}
      expect(${func}).toBeDefined();
    });
    
    it('should handle edge cases', () => {
      // TODO: Implement edge case tests for ${func}
      expect(${func}).toBeDefined();
    });
    
    it('should handle invalid input gracefully', () => {
      // TODO: Implement error handling tests for ${func}
      expect(${func}).toBeDefined();
    });
  });`).join('\n\n')}
});
`;
  }

  private generatePytestTests(fileName: string, functions: string[]): string {
    return `import pytest
from src.${fileName} import ${functions.join(', ')}

class Test${fileName.charAt(0).toUpperCase() + fileName.slice(1)}:
${functions.map(func => `    def test_${func}_valid_input(self):
        """Test ${func} with valid input"""
        # TODO: Implement test for ${func}
        assert ${func} is not None
    
    def test_${func}_edge_cases(self):
        """Test ${func} with edge cases"""
        # TODO: Implement edge case tests for ${func}
        assert ${func} is not None
    
    def test_${func}_invalid_input(self):
        """Test ${func} with invalid input"""
        # TODO: Implement error handling tests for ${func}
        with pytest.raises(Exception):
            pass  # Add test that should raise exception`).join('\n\n')}
`;
  }

  public async generateIntegrationTests(endpoints: Array<{
    path: string;
    method: string;
    description: string;
  }>): Promise<string> {
    return `import request from 'supertest';
import app from '../src/app';

describe('API Integration Tests', () => {
${endpoints.map(endpoint => `  describe('${endpoint.method} ${endpoint.path}', () => {
    it('${endpoint.description}', async () => {
      const response = await request(app)
        .${endpoint.method.toLowerCase()}('${endpoint.path}')
        .expect(200);
      
      expect(response.body).toBeDefined();
      // TODO: Add specific assertions for ${endpoint.path}
    });
    
    it('should handle invalid requests', async () => {
      const response = await request(app)
        .${endpoint.method.toLowerCase()}('${endpoint.path}/invalid')
        .expect(404);
      
      expect(response.body.error).toBeDefined();
    });
  });`).join('\n\n')}
});
`;
  }

  public async generateE2ETests(scenarios: Array<{
    name: string;
    description: string;
    steps: string[];
  }>): Promise<string> {
    return `import { test, expect } from '@playwright/test';

${scenarios.map(scenario => `test('${scenario.name}', async ({ page }) => {
  // ${scenario.description}
  
${scenario.steps.map((step, index) => `  // Step ${index + 1}: ${step}
  // TODO: Implement step`).join('\n')}
  
  // Verify final state
  // TODO: Add assertions
});`).join('\n\n')}
`;
  }

  public async runTests(framework: string, pattern?: string): Promise<{
    results: Array<z.infer<typeof TestResultSchema>>;
    summary: {
      total: number;
      passed: number;
      failed: number;
      skipped: number;
    };
  }> {
    const results: Array<z.infer<typeof TestResultSchema>> = [];
    let command = '';
    
    switch (framework) {
      case 'jest':
        command = `npx jest ${pattern || ''} --json --coverage`;
        break;
      case 'vitest':
        command = `npx vitest run ${pattern || ''} --reporter=json`;
        break;
      case 'pytest':
        command = `python -m pytest ${pattern || ''} --json-report`;
        break;
      default:
        throw new Error(`Unsupported test framework: ${framework}`);
    }
    
    try {
      const { stdout } = await execAsync(command, { cwd: this.testsDir });
      const output = JSON.parse(stdout);
      
      // Parse results based on framework
      if (framework === 'jest') {
        output.testResults?.forEach((testResult: any) => {
          testResult.assertionResults?.forEach((assertion: any) => {
            results.push({
              suite: testResult.name,
              testName: assertion.title,
              status: assertion.status,
              duration: assertion.duration || 0,
              error: assertion.failureMessages?.[0],
            });
          });
        });
      }
    } catch (error) {
      console.error('Failed to run tests:', error);
    }
    
    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
    };
    
    this.testResults = results;
    return { results, summary };
  }

  public async generateCoverageReport(): Promise<z.infer<typeof CoverageReportSchema>> {
    // Mock coverage report - in production, this would parse actual coverage data
    const report: z.infer<typeof CoverageReportSchema> = {
      overall: {
        lines: 85.5,
        functions: 92.3,
        branches: 78.9,
        statements: 87.2,
      },
      files: {
        'src/index.ts': {
          lines: 90.0,
          functions: 100.0,
          branches: 80.0,
          statements: 92.0,
          uncoveredLines: [15, 32, 45],
        },
        'src/utils.ts': {
          lines: 75.0,
          functions: 80.0,
          branches: 70.0,
          statements: 78.0,
          uncoveredLines: [8, 12, 25, 30],
        },
      },
      threshold: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    };
    
    return report;
  }

  public async runPerformanceTests(scenarios: Array<{
    name: string;
    endpoint: string;
    concurrent: number;
    duration: number;
  }>): Promise<Array<{
    scenario: string;
    averageResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
  }>> {
    const results = [];
    
    for (const scenario of scenarios) {
      // Mock performance test results
      results.push({
        scenario: scenario.name,
        averageResponseTime: Math.random() * 100 + 50, // 50-150ms
        requestsPerSecond: Math.random() * 1000 + 500, // 500-1500 RPS
        errorRate: Math.random() * 0.05, // 0-5% error rate
      });
    }
    
    return results;
  }

  public saveTestSuite(suite: z.infer<typeof TestSuiteSchema>): string {
    this.testSuites.set(suite.id, suite);
    
    const filename = `${suite.id}.suite.json`;
    const filepath = path.join(this.testsDir, filename);
    fs.writeJsonSync(filepath, suite, { spaces: 2 });
    
    return filepath;
  }

  public listTestSuites(): Array<z.infer<typeof TestSuiteSchema>> {
    return Array.from(this.testSuites.values());
  }

  public getTestResults(): Array<z.infer<typeof TestResultSchema>> {
    return this.testResults;
  }
}

// MCP Server
const testValidator = new TestValidator();
const server = new Server(
  {
    name: "vibecoding-test-validator",
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
  const testSuites = testValidator.listTestSuites();
  return {
    resources: [
      {
        uri: "test-suites://list",
        name: "Test Suites",
        description: "List of all test suites",
        mimeType: "application/json",
      },
      {
        uri: "test-results://latest",
        name: "Latest Test Results",
        description: "Results from the most recent test run",
        mimeType: "application/json",
      },
      ...testSuites.map(suite => ({
        uri: `test-suite://${suite.id}`,
        name: suite.name,
        description: `${suite.framework} test suite`,
        mimeType: "application/json",
      })),
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri === "test-suites://list") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(testValidator.listTestSuites(), null, 2),
        },
      ],
    };
  }
  
  if (uri === "test-results://latest") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(testValidator.getTestResults(), null, 2),
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
    case "generate_unit_tests":
      const { filePath, language } = z.object({
        filePath: z.string(),
        language: z.string(),
      }).parse(args);
      
      const unitTests = await testValidator.generateUnitTests(filePath, language);
      return {
        content: [
          {
            type: "text",
            text: unitTests,
          },
        ],
      };

    case "generate_integration_tests":
      const { endpoints } = z.object({
        endpoints: z.array(z.object({
          path: z.string(),
          method: z.string(),
          description: z.string(),
        })),
      }).parse(args);
      
      const integrationTests = await testValidator.generateIntegrationTests(endpoints);
      return {
        content: [
          {
            type: "text",
            text: integrationTests,
          },
        ],
      };

    case "generate_e2e_tests":
      const { scenarios } = z.object({
        scenarios: z.array(z.object({
          name: z.string(),
          description: z.string(),
          steps: z.array(z.string()),
        })),
      }).parse(args);
      
      const e2eTests = await testValidator.generateE2ETests(scenarios);
      return {
        content: [
          {
            type: "text",
            text: e2eTests,
          },
        ],
      };

    case "run_tests":
      const { framework, pattern } = z.object({
        framework: z.string(),
        pattern: z.string().optional(),
      }).parse(args);
      
      const testRun = await testValidator.runTests(framework, pattern);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(testRun, null, 2),
          },
        ],
      };

    case "generate_coverage_report":
      const coverage = await testValidator.generateCoverageReport();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(coverage, null, 2),
          },
        ],
      };

    case "run_performance_tests":
      const { perfScenarios } = z.object({
        perfScenarios: z.array(z.object({
          name: z.string(),
          endpoint: z.string(),
          concurrent: z.number(),
          duration: z.number(),
        })),
      }).parse(args);
      
      const perfResults = await testValidator.runPerformanceTests(perfScenarios);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(perfResults, null, 2),
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
console.error("VibeCoding Test Validator MCP Server running on stdio"); 