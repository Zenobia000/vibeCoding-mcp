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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schemas
const CodeTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  language: z.string(),
  description: z.string(),
  template: z.string(),
  variables: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});

const GenerationRequestSchema = z.object({
  language: z.string(),
  framework: z.string().optional(),
  description: z.string(),
  requirements: z.array(z.string()),
  context: z.record(z.any()).optional(),
});

const RefactorRequestSchema = z.object({
  code: z.string(),
  language: z.string(),
  operation: z.enum(["optimize", "clean", "modernize", "extract", "simplify"]),
  targetPattern: z.string().optional(),
});

// Code Generator Class
class CodeGenerator {
  private templatesDir: string;
  private generatedDir: string;
  private templates: Map<string, z.infer<typeof CodeTemplateSchema>> = new Map();
  
  constructor(baseDir: string = ".") {
    this.templatesDir = path.join(baseDir, "vibe-services", "code-generator", "templates");
    this.generatedDir = path.join(baseDir, "2_implementation", "src");
    this.ensureDirectories();
    this.loadTemplates();
  }

  private ensureDirectories() {
    fs.ensureDirSync(this.templatesDir);
    fs.ensureDirSync(this.generatedDir);
  }

  private loadTemplates() {
    // Load built-in templates
    this.registerTemplate({
      id: "express-api",
      name: "Express API Endpoint",
      language: "typescript",
      description: "RESTful API endpoint with Express",
      template: `import { Request, Response, Router } from 'express';

const router = Router();

/**
 * {{description}}
 */
router.{{method}}('{{path}}', async (req: Request, res: Response) => {
  try {
    // {{logic}}
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;`,
      variables: ["description", "method", "path", "logic"],
    });

    this.registerTemplate({
      id: "react-component",
      name: "React Functional Component",
      language: "typescript",
      description: "React component with TypeScript",
      template: `import React{{hooks}} from 'react';
{{imports}}

interface {{name}}Props {
  {{props}}
}

export const {{name}}: React.FC<{{name}}Props> = ({ {{propsList}} }) => {
  {{state}}
  
  {{effects}}
  
  return (
    <div className="{{className}}">
      {{content}}
    </div>
  );
};`,
      variables: ["name", "props", "propsList", "hooks", "imports", "state", "effects", "className", "content"],
    });

    // Load custom templates from disk
    if (fs.existsSync(this.templatesDir)) {
      const files = fs.readdirSync(this.templatesDir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        try {
          const template = fs.readJsonSync(path.join(this.templatesDir, file));
          const validated = CodeTemplateSchema.parse(template);
          this.templates.set(validated.id, validated);
        } catch (error) {
          console.error(`Failed to load template ${file}:`, error);
        }
      }
    }
  }

  public registerTemplate(template: z.infer<typeof CodeTemplateSchema>) {
    this.templates.set(template.id, template);
  }

  public async generateCode(request: z.infer<typeof GenerationRequestSchema>): Promise<string> {
    // This is a simplified version. In production, this would use AI
    const { language, framework, description, requirements } = request;
    
    // Find matching template
    const matchingTemplates = Array.from(this.templates.values()).filter(t => 
      t.language === language && 
      (!framework || t.tags?.includes(framework))
    );

    if (matchingTemplates.length === 0) {
      throw new Error(`No templates found for ${language}${framework ? ` with ${framework}` : ''}`);
    }

    // For demo, return a simple generated code
    return `// Generated code for: ${description}
// Language: ${language}
// Framework: ${framework || 'none'}
// Requirements:
${requirements.map(r => `//   - ${r}`).join('\n')}

// TODO: Implement based on requirements
export function generatedFunction() {
  // Implementation goes here
  throw new Error('Not implemented');
}`;
  }

  public async refactorCode(request: z.infer<typeof RefactorRequestSchema>): Promise<string> {
    const { code, language, operation } = request;
    
    // Simplified refactoring - in production, this would use AI
    let refactored = code;
    
    switch (operation) {
      case "optimize":
        refactored = `// Optimized version\n${code}`;
        break;
      case "clean":
        // Remove comments and empty lines for demo
        refactored = code
          .split('\n')
          .filter(line => line.trim() && !line.trim().startsWith('//'))
          .join('\n');
        break;
      case "modernize":
        refactored = `// Modernized with latest ${language} features\n${code}`;
        break;
      default:
        refactored = `// Refactored: ${operation}\n${code}`;
    }
    
    return refactored;
  }

  public async generateFromTemplate(templateId: string, variables: Record<string, string>): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let code = template.template;
    
    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      code = code.replace(regex, value);
    }
    
    return code;
  }

  public saveGeneratedCode(filename: string, code: string): string {
    const filepath = path.join(this.generatedDir, filename);
    fs.ensureDirSync(path.dirname(filepath));
    fs.writeFileSync(filepath, code);
    return filepath;
  }

  public listTemplates(): Array<z.infer<typeof CodeTemplateSchema>> {
    return Array.from(this.templates.values());
  }
}

// MCP Server
const codeGenerator = new CodeGenerator();
const server = new Server(
  {
    name: "vibecoding-code-generator",
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
  const templates = codeGenerator.listTemplates();
  return {
    resources: [
      {
        uri: "templates://list",
        name: "Code Templates",
        description: "Available code generation templates",
        mimeType: "application/json",
      },
      ...templates.map(t => ({
        uri: `template://${t.id}`,
        name: t.name,
        description: t.description,
        mimeType: "text/plain",
      })),
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri === "templates://list") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(codeGenerator.listTemplates(), null, 2),
        },
      ],
    };
  }
  
  if (uri.startsWith("template://")) {
    const templateId = uri.replace("template://", "");
    const templates = codeGenerator.listTemplates();
    const template = templates.find(t => t.id === templateId);
    if (template) {
      return {
        contents: [
          {
            uri,
            mimeType: "text/plain",
            text: template.template,
          },
        ],
      };
    }
  }
  
  throw new Error(`Resource not found: ${uri}`);
});

// Tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "generate_code":
      const genRequest = GenerationRequestSchema.parse(args);
      const code = await codeGenerator.generateCode(genRequest);
      return {
        content: [
          {
            type: "text",
            text: code,
          },
        ],
      };

    case "refactor_code":
      const refactorRequest = RefactorRequestSchema.parse(args);
      const refactored = await codeGenerator.refactorCode(refactorRequest);
      return {
        content: [
          {
            type: "text",
            text: refactored,
          },
        ],
      };

    case "generate_from_template":
      const { templateId, variables } = z.object({
        templateId: z.string(),
        variables: z.record(z.string()),
      }).parse(args);
      
      const generated = await codeGenerator.generateFromTemplate(templateId, variables);
      return {
        content: [
          {
            type: "text",
            text: generated,
          },
        ],
      };

    case "save_code":
      const { filename, code: saveCode } = z.object({
        filename: z.string(),
        code: z.string(),
      }).parse(args);
      
      const filepath = codeGenerator.saveGeneratedCode(filename, saveCode);
      return {
        content: [
          {
            type: "text",
            text: `Code saved to: ${filepath}`,
          },
        ],
      };

    case "register_template":
      const newTemplate = CodeTemplateSchema.parse(args);
      codeGenerator.registerTemplate(newTemplate);
      return {
        content: [
          {
            type: "text",
            text: `Template registered: ${newTemplate.id}`,
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
console.error("VibeCoding Code Generator MCP Server running on stdio"); 