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
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schemas
const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["api", "guide", "reference", "tutorial", "architecture"]),
  format: z.enum(["markdown", "html", "pdf"]),
  content: z.string(),
  metadata: z.object({
    created: z.string(),
    updated: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const ApiDocSchema = z.object({
  endpoint: z.string(),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  description: z.string(),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean(),
    description: z.string(),
  })).optional(),
  requestBody: z.object({
    type: z.string(),
    example: z.any(),
  }).optional(),
  responses: z.record(z.object({
    description: z.string(),
    schema: z.any(),
  })),
});

// Documentation Generator Class
class DocumentationGenerator {
  private docsDir: string;
  private templatesDir: string;
  private documents: Map<string, z.infer<typeof DocumentSchema>> = new Map();
  
  constructor(baseDir: string = ".") {
    this.docsDir = path.join(baseDir, "1_design", "architecture");
    this.templatesDir = path.join(baseDir, "vibe-services", "doc-generator", "templates");
    this.ensureDirectories();
    this.loadTemplates();
  }

  private ensureDirectories() {
    fs.ensureDirSync(this.docsDir);
    fs.ensureDirSync(this.templatesDir);
    fs.ensureDirSync(path.join(this.docsDir, "api"));
    fs.ensureDirSync(path.join(this.docsDir, "guides"));
    fs.ensureDirSync(path.join(this.docsDir, "references"));
  }

  private loadTemplates() {
    // Create default templates if they don't exist
    const apiTemplate = `# API Documentation: {{title}}

## Endpoint: \`{{method}} {{endpoint}}\`

{{description}}

### Parameters

{{#parameters}}
- **{{name}}** ({{type}}, {{#required}}required{{/required}}{{^required}}optional{{/required}}): {{description}}
{{/parameters}}

### Request Body

\`\`\`json
{{requestExample}}
\`\`\`

### Responses

{{#responses}}
#### {{statusCode}}
{{description}}

\`\`\`json
{{example}}
\`\`\`
{{/responses}}
`;

    const architectureTemplate = `# Architecture Document: {{title}}

## Overview
{{overview}}

## Components
{{#components}}
### {{name}}
{{description}}

**Responsibilities:**
{{#responsibilities}}
- {{.}}
{{/responsibilities}}

**Dependencies:**
{{#dependencies}}
- {{.}}
{{/dependencies}}
{{/components}}

## Data Flow
{{dataFlow}}

## Security Considerations
{{security}}

## Deployment Architecture
{{deployment}}
`;

    // Save templates
    fs.writeFileSync(path.join(this.templatesDir, "api.md"), apiTemplate);
    fs.writeFileSync(path.join(this.templatesDir, "architecture.md"), architectureTemplate);
  }

  public async generateApiDoc(apiSpec: z.infer<typeof ApiDocSchema>): Promise<string> {
    const doc = `# API Documentation: ${apiSpec.endpoint}

## ${apiSpec.method} ${apiSpec.endpoint}

${apiSpec.description}

### Parameters

${apiSpec.parameters?.map(p => 
  `- **${p.name}** (${p.type}, ${p.required ? 'required' : 'optional'}): ${p.description}`
).join('\n') || 'No parameters'}

### Request Body

${apiSpec.requestBody ? `
\`\`\`json
${JSON.stringify(apiSpec.requestBody.example, null, 2)}
\`\`\`
` : 'No request body'}

### Responses

${Object.entries(apiSpec.responses).map(([code, resp]) => `
#### ${code}
${resp.description}

\`\`\`json
${JSON.stringify(resp.schema, null, 2)}
\`\`\`
`).join('\n')}
`;

    const document: z.infer<typeof DocumentSchema> = {
      id: `api-${apiSpec.endpoint.replace(/\//g, '-')}-${apiSpec.method}`,
      title: `${apiSpec.method} ${apiSpec.endpoint}`,
      type: "api",
      format: "markdown",
      content: doc,
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        tags: ["api", apiSpec.method.toLowerCase()],
      },
    };

    this.documents.set(document.id, document);
    return doc;
  }

  public async generateArchitectureDoc(data: {
    title: string;
    overview: string;
    components: Array<{
      name: string;
      description: string;
      responsibilities: string[];
      dependencies: string[];
    }>;
    dataFlow: string;
    security: string;
    deployment: string;
  }): Promise<string> {
    const doc = `# Architecture Document: ${data.title}

## Overview
${data.overview}

## Components
${data.components.map(c => `
### ${c.name}
${c.description}

**Responsibilities:**
${c.responsibilities.map(r => `- ${r}`).join('\n')}

**Dependencies:**
${c.dependencies.map(d => `- ${d}`).join('\n')}
`).join('\n')}

## Data Flow
${data.dataFlow}

## Security Considerations
${data.security}

## Deployment Architecture
${data.deployment}

---
*Generated on ${new Date().toISOString()}*
`;

    const document: z.infer<typeof DocumentSchema> = {
      id: `arch-${data.title.toLowerCase().replace(/\s+/g, '-')}`,
      title: data.title,
      type: "architecture",
      format: "markdown",
      content: doc,
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        tags: ["architecture", "system-design"],
      },
    };

    this.documents.set(document.id, document);
    return doc;
  }

  public async generateFromCode(filePath: string, language: string): Promise<string> {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Simple extraction of comments and function signatures
    const functions: string[] = [];
    const comments: string[] = [];
    
    // Extract based on language
    if (language === 'typescript' || language === 'javascript') {
      // Extract functions
      const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)|(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(/g;
      let match;
      while ((match = funcRegex.exec(content)) !== null) {
        functions.push(match[1] || match[2]);
      }
      
      // Extract JSDoc comments
      const commentRegex = /\/\*\*([\s\S]*?)\*\//g;
      while ((match = commentRegex.exec(content)) !== null) {
        comments.push(match[1].trim());
      }
    }
    
    const doc = `# Code Documentation: ${path.basename(filePath)}

## File Overview
- **Language**: ${language}
- **Path**: ${filePath}
- **Functions**: ${functions.length}

## Functions
${functions.map(f => `- \`${f}()\``).join('\n')}

## Documentation Comments
${comments.map(c => `\`\`\`\n${c}\n\`\`\``).join('\n\n')}

---
*Generated from source code on ${new Date().toISOString()}*
`;

    return doc;
  }

  public async convertToHtml(markdown: string): Promise<string> {
    const html = marked(markdown);
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        code { background: #f4f4f4; padding: 2px 4px; }
        pre { background: #f4f4f4; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
  }

  public saveDocument(document: z.infer<typeof DocumentSchema>): string {
    const subDir = document.type === "api" ? "api" : document.type === "architecture" ? "" : "guides";
    const filename = `${document.id}.${document.format === "markdown" ? "md" : document.format}`;
    const filepath = path.join(this.docsDir, subDir, filename);
    
    fs.ensureDirSync(path.dirname(filepath));
    fs.writeFileSync(filepath, document.content);
    
    return filepath;
  }

  public listDocuments(): Array<z.infer<typeof DocumentSchema>> {
    return Array.from(this.documents.values());
  }

  public getDocument(id: string): z.infer<typeof DocumentSchema> | null {
    return this.documents.get(id) || null;
  }
}

// MCP Server
const docGenerator = new DocumentationGenerator();
const server = new Server(
  {
    name: "vibecoding-doc-generator",
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
  const documents = docGenerator.listDocuments();
  return {
    resources: [
      {
        uri: "documents://list",
        name: "Document List",
        description: "List of all generated documents",
        mimeType: "application/json",
      },
      ...documents.map(doc => ({
        uri: `document://${doc.id}`,
        name: doc.title,
        description: `${doc.type} documentation`,
        mimeType: doc.format === "markdown" ? "text/markdown" : "text/html",
      })),
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri === "documents://list") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(docGenerator.listDocuments(), null, 2),
        },
      ],
    };
  }
  
  if (uri.startsWith("document://")) {
    const id = uri.replace("document://", "");
    const doc = docGenerator.getDocument(id);
    if (doc) {
      return {
        contents: [
          {
            uri,
            mimeType: doc.format === "markdown" ? "text/markdown" : "text/html",
            text: doc.content,
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
    case "generate_api_doc":
      const apiSpec = ApiDocSchema.parse(args);
      const apiDoc = await docGenerator.generateApiDoc(apiSpec);
      return {
        content: [
          {
            type: "text",
            text: apiDoc,
          },
        ],
      };

    case "generate_architecture_doc":
      const archData = z.object({
        title: z.string(),
        overview: z.string(),
        components: z.array(z.object({
          name: z.string(),
          description: z.string(),
          responsibilities: z.array(z.string()),
          dependencies: z.array(z.string()),
        })),
        dataFlow: z.string(),
        security: z.string(),
        deployment: z.string(),
      }).parse(args);
      
      const archDoc = await docGenerator.generateArchitectureDoc(archData);
      return {
        content: [
          {
            type: "text",
            text: archDoc,
          },
        ],
      };

    case "generate_from_code":
      const { filePath, language } = z.object({
        filePath: z.string(),
        language: z.string(),
      }).parse(args);
      
      const codeDoc = await docGenerator.generateFromCode(filePath, language);
      return {
        content: [
          {
            type: "text",
            text: codeDoc,
          },
        ],
      };

    case "convert_to_html":
      const { markdown } = z.object({
        markdown: z.string(),
      }).parse(args);
      
      const html = await docGenerator.convertToHtml(markdown);
      return {
        content: [
          {
            type: "text",
            text: html,
          },
        ],
      };

    case "save_document":
      const document = DocumentSchema.parse(args);
      const filepath = docGenerator.saveDocument(document);
      return {
        content: [
          {
            type: "text",
            text: `Document saved to: ${filepath}`,
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
console.error("VibeCoding Documentation Generator MCP Server running on stdio"); 