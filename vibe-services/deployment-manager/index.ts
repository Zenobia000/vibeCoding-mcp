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
const EnvironmentSchema = z.object({
  name: z.string(),
  type: z.enum(["development", "staging", "production"]),
  variables: z.record(z.string()),
  replicas: z.number().optional(),
  resources: z.object({
    cpu: z.string(),
    memory: z.string(),
  }).optional(),
});

const DockerfileSchema = z.object({
  baseImage: z.string(),
  workdir: z.string(),
  commands: z.array(z.string()),
  ports: z.array(z.number()),
  environment: z.record(z.string()).optional(),
});

const KubernetesConfigSchema = z.object({
  apiVersion: z.string(),
  kind: z.string(),
  metadata: z.object({
    name: z.string(),
    namespace: z.string().optional(),
  }),
  spec: z.record(z.any()),
});

const DeploymentStatus = z.object({
  environment: z.string(),
  status: z.enum(["pending", "deploying", "deployed", "failed", "rollback"]),
  version: z.string(),
  timestamp: z.string(),
  logs: z.array(z.string()),
});

// Deployment Manager Class
class DeploymentManager {
  private deploymentDir: string;
  private configsDir: string;
  private environments: Map<string, z.infer<typeof EnvironmentSchema>> = new Map();
  private deploymentHistory: Array<z.infer<typeof DeploymentStatus>> = [];
  
  constructor(baseDir: string = ".") {
    this.deploymentDir = path.join(baseDir, "4_deployment");
    this.configsDir = path.join(this.deploymentDir, "environments");
    this.ensureDirectories();
    this.loadEnvironments();
  }

  private ensureDirectories() {
    fs.ensureDirSync(this.deploymentDir);
    fs.ensureDirSync(this.configsDir);
    fs.ensureDirSync(path.join(this.deploymentDir, "ci-cd"));
    fs.ensureDirSync(path.join(this.deploymentDir, "monitoring"));
    fs.ensureDirSync(path.join(this.deploymentDir, "scripts"));
  }

  private loadEnvironments() {
    // Default environments
    this.environments.set("development", {
      name: "development",
      type: "development",
      variables: {
        NODE_ENV: "development",
        PORT: "3000",
        DEBUG: "true",
      },
      replicas: 1,
      resources: {
        cpu: "100m",
        memory: "256Mi",
      },
    });

    this.environments.set("staging", {
      name: "staging",
      type: "staging",
      variables: {
        NODE_ENV: "staging",
        PORT: "3000",
        DEBUG: "false",
      },
      replicas: 2,
      resources: {
        cpu: "200m",
        memory: "512Mi",
      },
    });

    this.environments.set("production", {
      name: "production",
      type: "production",
      variables: {
        NODE_ENV: "production",
        PORT: "3000",
        DEBUG: "false",
      },
      replicas: 3,
      resources: {
        cpu: "500m",
        memory: "1Gi",
      },
    });
  }

  public async generateDockerfile(spec: z.infer<typeof DockerfileSchema>): Promise<string> {
    const dockerfile = `FROM ${spec.baseImage}

WORKDIR ${spec.workdir}

# Copy package files
COPY package*.json ./

# Install dependencies
${spec.commands.map(cmd => `RUN ${cmd}`).join('\n')}

# Copy source code
COPY . .

# Set environment variables
${spec.environment ? Object.entries(spec.environment).map(([key, value]) => `ENV ${key}=${value}`).join('\n') : ''}

# Expose ports
${spec.ports.map(port => `EXPOSE ${port}`).join('\n')}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:${spec.ports[0]}/health || exit 1

# Start application
CMD ["npm", "start"]
`;

    return dockerfile;
  }

  public async generateKubernetesManifests(appName: string, environment: string): Promise<{
    deployment: string;
    service: string;
    configMap: string;
  }> {
    const env = this.environments.get(environment);
    if (!env) {
      throw new Error(`Environment ${environment} not found`);
    }

    const deployment = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  namespace: ${environment}
  labels:
    app: ${appName}
    environment: ${environment}
spec:
  replicas: ${env.replicas || 1}
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
        environment: ${environment}
    spec:
      containers:
      - name: ${appName}
        image: ${appName}:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "${environment}"
${Object.entries(env.variables).map(([key, value]) => `        - name: ${key}
          value: "${value}"`).join('\n')}
        resources:
          requests:
            cpu: ${env.resources?.cpu || '100m'}
            memory: ${env.resources?.memory || '256Mi'}
          limits:
            cpu: ${env.resources?.cpu || '100m'}
            memory: ${env.resources?.memory || '256Mi'}
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
`;

    const service = `apiVersion: v1
kind: Service
metadata:
  name: ${appName}-service
  namespace: ${environment}
  labels:
    app: ${appName}
spec:
  selector:
    app: ${appName}
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
  type: ClusterIP
`;

    const configMap = `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${appName}-config
  namespace: ${environment}
data:
${Object.entries(env.variables).map(([key, value]) => `  ${key}: "${value}"`).join('\n')}
`;

    return { deployment, service, configMap };
  }

  public async generateCICDPipeline(provider: "github-actions" | "gitlab-ci" | "azure-devops"): Promise<string> {
    switch (provider) {
      case "github-actions":
        return this.generateGitHubActions();
      case "gitlab-ci":
        return this.generateGitLabCI();
      case "azure-devops":
        return this.generateAzureDevOps();
      default:
        throw new Error(`Unsupported CI/CD provider: ${provider}`);
    }
  }

  private generateGitHubActions(): string {
    return `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
    - uses: actions/checkout@v4
    
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: \${{ env.REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: \${{ steps.meta.outputs.tags }}
        labels: \${{ steps.meta.outputs.labels }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # Add deployment commands here

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to production
      run: |
        echo "Deploying to production environment"
        # Add deployment commands here
`;
  }

  private generateGitLabCI(): string {
    return `stages:
  - test
  - build
  - deploy

variables:
  DOCKER_REGISTRY: \$CI_REGISTRY
  DOCKER_IMAGE: \$CI_REGISTRY_IMAGE

test:
  stage: test
  image: node:18
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run test
    - npm run lint
    - npm run test:coverage
  coverage: '/Lines\\s*:\\s*(\\d+\\.?\\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u \$CI_REGISTRY_USER -p \$CI_REGISTRY_PASSWORD \$CI_REGISTRY
  script:
    - docker build -t \$DOCKER_IMAGE:\$CI_COMMIT_SHA .
    - docker push \$DOCKER_IMAGE:\$CI_COMMIT_SHA
  only:
    - main
    - develop

deploy-staging:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying to staging"
    # Add deployment commands here
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy-production:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying to production"
    # Add deployment commands here
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
`;
  }

  private generateAzureDevOps(): string {
    return `trigger:
- main
- develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  buildConfiguration: 'Release'
  containerRegistry: 'your-acr.azurecr.io'
  imageRepository: 'your-app'
  tag: '$(Build.BuildId)'

stages:
- stage: Test
  displayName: 'Test Stage'
  jobs:
  - job: Test
    displayName: 'Run Tests'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18.x'
      displayName: 'Install Node.js'
    
    - script: |
        npm ci
        npm run test
        npm run lint
      displayName: 'Run tests and linting'
    
    - task: PublishTestResults@2
      condition: succeededOrFailed()
      inputs:
        testRunner: JUnit
        testResultsFiles: '**/test-results.xml'

- stage: Build
  displayName: 'Build Stage'
  dependsOn: Test
  jobs:
  - job: Build
    displayName: 'Build and Push'
    steps:
    - task: Docker@2
      displayName: 'Build and push image'
      inputs:
        containerRegistry: '\$(containerRegistry)'
        repository: '\$(imageRepository)'
        command: 'buildAndPush'
        Dockerfile: '**/Dockerfile'
        tags: '\$(tag)'

- stage: Deploy
  displayName: 'Deploy Stage'
  dependsOn: Build
  jobs:
  - deployment: DeployToStaging
    displayName: 'Deploy to Staging'
    environment: 'staging'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Deploying to staging"
            displayName: 'Deploy to staging'
`;
  }

  public async generateMonitoringConfig(): Promise<{
    prometheus: string;
    grafana: string;
    alerts: string;
  }> {
    const prometheus = `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: /metrics
    scrape_interval: 5s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
`;

    const grafana = `{
  "dashboard": {
    "title": "Application Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5.*\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      }
    ]
  }
}`;

    const alerts = `groups:
- name: app.rules
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.*"}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} errors per second"

  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
      description: "95th percentile response time is {{ $value }}s"

  - alert: ServiceDown
    expr: up{job="app"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Service is down"
      description: "Application has been down for more than 1 minute"
`;

    return { prometheus, grafana, alerts };
  }

  public async deploy(environment: string, version: string): Promise<z.infer<typeof DeploymentStatus>> {
    const env = this.environments.get(environment);
    if (!env) {
      throw new Error(`Environment ${environment} not found`);
    }

    const deployment: z.infer<typeof DeploymentStatus> = {
      environment,
      status: "deploying",
      version,
      timestamp: new Date().toISOString(),
      logs: [
        `Starting deployment to ${environment}`,
        `Deploying version ${version}`,
      ],
    };

    // Simulate deployment process
    setTimeout(() => {
      deployment.status = "deployed";
      deployment.logs.push(`Deployment to ${environment} completed successfully`);
    }, 5000);

    this.deploymentHistory.push(deployment);
    return deployment;
  }

  public getDeploymentHistory(): Array<z.infer<typeof DeploymentStatus>> {
    return this.deploymentHistory;
  }

  public getEnvironments(): Array<z.infer<typeof EnvironmentSchema>> {
    return Array.from(this.environments.values());
  }

  public saveConfig(filename: string, content: string, subDir: string = ""): string {
    const dir = subDir ? path.join(this.deploymentDir, subDir) : this.deploymentDir;
    fs.ensureDirSync(dir);
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, content);
    return filepath;
  }
}

// MCP Server
const deploymentManager = new DeploymentManager();
const server = new Server(
  {
    name: "vibecoding-deployment-manager",
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
  const environments = deploymentManager.getEnvironments();
  return {
    resources: [
      {
        uri: "environments://list",
        name: "Environments",
        description: "List of deployment environments",
        mimeType: "application/json",
      },
      {
        uri: "deployments://history",
        name: "Deployment History",
        description: "History of all deployments",
        mimeType: "application/json",
      },
      ...environments.map(env => ({
        uri: `environment://${env.name}`,
        name: env.name,
        description: `${env.type} environment configuration`,
        mimeType: "application/json",
      })),
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri === "environments://list") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(deploymentManager.getEnvironments(), null, 2),
        },
      ],
    };
  }
  
  if (uri === "deployments://history") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(deploymentManager.getDeploymentHistory(), null, 2),
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
    case "generate_dockerfile":
      const dockerSpec = DockerfileSchema.parse(args);
      const dockerfile = await deploymentManager.generateDockerfile(dockerSpec);
      return {
        content: [
          {
            type: "text",
            text: dockerfile,
          },
        ],
      };

    case "generate_kubernetes_manifests":
      const { appName, environment } = z.object({
        appName: z.string(),
        environment: z.string(),
      }).parse(args);
      
      const manifests = await deploymentManager.generateKubernetesManifests(appName, environment);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(manifests, null, 2),
          },
        ],
      };

    case "generate_cicd_pipeline":
      const { provider } = z.object({
        provider: z.enum(["github-actions", "gitlab-ci", "azure-devops"]),
      }).parse(args);
      
      const pipeline = await deploymentManager.generateCICDPipeline(provider);
      return {
        content: [
          {
            type: "text",
            text: pipeline,
          },
        ],
      };

    case "generate_monitoring_config":
      const monitoring = await deploymentManager.generateMonitoringConfig();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(monitoring, null, 2),
          },
        ],
      };

    case "deploy":
      const { env, version } = z.object({
        env: z.string(),
        version: z.string(),
      }).parse(args);
      
      const deployment = await deploymentManager.deploy(env, version);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(deployment, null, 2),
          },
        ],
      };

    case "save_config":
      const { filename, content, subDir } = z.object({
        filename: z.string(),
        content: z.string(),
        subDir: z.string().optional(),
      }).parse(args);
      
      const filepath = deploymentManager.saveConfig(filename, content, subDir);
      return {
        content: [
          {
            type: "text",
            text: `Configuration saved to: ${filepath}`,
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
console.error("VibeCoding Deployment Manager MCP Server running on stdio"); 