# Deployment Phase Workflow Prompt

## 🎯 階段目標

**部署上線階段** - 將驗證完成的應用部署到生產環境，建立監控體系，確保系統穩定運行並服務用戶。

## 🚀 階段重點

### 1. 生產環境部署
- **基礎設施**: 配置生產伺服器和網路環境
- **應用部署**: 部署應用程式和相關服務
- **資料庫設置**: 配置生產資料庫和資料遷移
- **CDN 配置**: 設置內容分發網路加速

### 2. CI/CD 自動化
- **流水線建立**: 建立自動化部署流水線
- **環境管理**: 配置多環境部署策略
- **自動化測試**: 整合測試到部署流程
- **回滾機制**: 建立快速回滾策略

### 3. 監控和告警
- **應用監控**: 建立應用效能和狀態監控
- **基礎設施監控**: 監控伺服器和網路狀態
- **日誌管理**: 集中化日誌收集和分析
- **告警系統**: 配置多層級告警機制

### 4. 運維和維護
- **災難恢復**: 建立備份和災難恢復計劃
- **擴容策略**: 配置自動擴容機制
- **安全措施**: 實施生產環境安全控制
- **文檔準備**: 準備運維和用戶文檔

## 🏗️ 部署策略指導

### 藍綠部署策略
```markdown
🤖 **部署策略建議**

我建議採用藍綠部署策略，確保零停機部署：

🔵 **藍綠部署流程**

**環境準備**
- 🔵 藍環境 (生產環境): 當前服務用戶的環境
- 🟢 綠環境 (準備環境): 新版本部署和驗證環境
- 🔀 負載均衡器: 控制流量切換

**部署步驟**
1. **準備綠環境**
   ```bash
   # 在綠環境部署新版本
   kubectl apply -f k8s/green-deployment.yaml
   
   # 等待 Pod 就緒
   kubectl wait --for=condition=Ready pod -l app=taskmanager,environment=green
   
   # 執行健康檢查
   curl -f http://green-app.internal/health
   ```

2. **驗證綠環境**
   ```bash
   # 執行冒煙測試
   npm run test:smoke -- --env=green
   
   # 資料庫遷移
   npm run db:migrate -- --env=green
   
   # 關鍵功能驗證
   npm run test:critical -- --env=green
   ```

3. **流量切換**
   ```bash
   # 逐步切換流量 (金絲雀發布)
   # 5% 流量到綠環境
   kubectl patch service taskmanager-service -p '{"spec":{"selector":{"environment":"green","traffic":"5%"}}}'
   
   # 監控指標無異常後，完全切換
   kubectl patch service taskmanager-service -p '{"spec":{"selector":{"environment":"green"}}}'
   ```

4. **清理藍環境**
   ```bash
   # 確認綠環境穩定後，清理藍環境
   kubectl delete deployment taskmanager-blue
   ```

這個部署策略符合你的需求嗎？需要調整嗎？
```

### Docker 容器化部署
```markdown
🤖 **容器化部署配置**

🐳 **多階段 Dockerfile 優化**
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製依賴檔案
COPY package*.json ./
COPY tsconfig.json ./

# 安裝依賴 (僅生產依賴)
RUN npm ci --only=production && npm cache clean --force

# 複製源碼並構建
COPY src/ ./src/
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# 安全性設置
RUN addgroup -g 1001 -S nodejs
RUN adduser -S vibe -u 1001

# 設置工作目錄
WORKDIR /app

# 複製構建產物和依賴
COPY --from=builder --chown=vibe:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=vibe:nodejs /app/dist ./dist
COPY --from=builder --chown=vibe:nodejs /app/package*.json ./

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# 安全性：非 root 用戶運行
USER vibe

# 暴露端口
EXPOSE 3000

# 優雅關閉支援
STOPSIGNAL SIGTERM

# 啟動應用
CMD ["node", "dist/index.js"]
```

🎯 **Docker Compose 生產配置**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped
    resources:
      limits:
        cpus: '1.0'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: taskmanager
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 30s
      timeout: 10s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

這個容器化配置滿足生產需求嗎？
```

### Kubernetes 生產部署
```markdown
🤖 **Kubernetes 生產環境配置**

☸️ **完整的 K8s 部署清單**

**Namespace 和 ConfigMap**
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: taskmanager-prod
  labels:
    environment: production
---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: taskmanager-prod
data:
  NODE_ENV: "production"
  API_VERSION: "v1"
  LOG_LEVEL: "info"
  REDIS_HOST: "redis-service"
  DB_HOST: "postgres-service"
```

**Secrets 管理**
```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: taskmanager-prod
type: Opaque
data:
  database-url: <%= database_url | base64 %>
  jwt-secret: <%= jwt_secret | base64 %>
  redis-password: <%= redis_password | base64 %>
```

**Deployment 配置**
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taskmanager-app
  namespace: taskmanager-prod
  labels:
    app: taskmanager
    version: v1.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: taskmanager
  template:
    metadata:
      labels:
        app: taskmanager
        version: v1.0.0
    spec:
      containers:
      - name: taskmanager
        image: your-registry/taskmanager:v1.0.0
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
```

**Service 和 Ingress**
```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: taskmanager-service
  namespace: taskmanager-prod
spec:
  selector:
    app: taskmanager
  ports:
  - name: http
    port: 80
    targetPort: 3000
  type: ClusterIP
---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: taskmanager-ingress
  namespace: taskmanager-prod
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.taskmanager.com
    secretName: taskmanager-tls
  rules:
  - host: api.taskmanager.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: taskmanager-service
            port:
              number: 80
```

這個 K8s 配置是否完整且安全？
```

## 📊 監控和告警系統

### Prometheus + Grafana 監控
```markdown
🤖 **監控系統建議**

📈 **Prometheus 配置**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: 'taskmanager-app'
    static_configs:
      - targets: ['taskmanager-service:80']
    metrics_path: /metrics
    scrape_interval: 30s
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
      
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

🔔 **告警規則配置**
```yaml
# alerts.yml
groups:
- name: taskmanager.rules
  rules:
  # 應用可用性告警
  - alert: AppDown
    expr: up{job="taskmanager-app"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "TaskManager application is down"
      description: "TaskManager has been down for more than 1 minute."

  # 高回應時間告警
  - alert: HighResponseTime
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
      description: "95th percentile response time is {{ $value }}s for 5 minutes."

  # 高錯誤率告警
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value | humanizePercentage }} for 5 minutes."

  # 資料庫連接告警
  - alert: DatabaseConnectionHigh
    expr: postgres_connections_active / postgres_connections_max > 0.8
    for: 3m
    labels:
      severity: warning
    annotations:
      summary: "Database connection usage high"
      description: "Database connections are {{ $value | humanizePercentage }} of maximum."

  # 記憶體使用率告警
  - alert: HighMemoryUsage
    expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage"
      description: "Memory usage is {{ $value | humanizePercentage }} for 5 minutes."
```

📊 **Grafana 儀表板 JSON**
```json
{
  "dashboard": {
    "id": null,
    "title": "TaskManager 生產監控",
    "tags": ["taskmanager", "production"],
    "refresh": "30s",
    "panels": [
      {
        "title": "應用請求 QPS",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[1m])",
            "legendFormat": "{{ method }} {{ endpoint }}"
          }
        ],
        "yAxes": [
          {
            "label": "Requests/sec",
            "min": 0
          }
        ]
      },
      {
        "title": "回應時間分布",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "99th percentile"
          }
        ]
      },
      {
        "title": "錯誤率",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])",
            "format": "percent"
          }
        ],
        "thresholds": "0.01,0.05",
        "colors": ["green", "yellow", "red"]
      },
      {
        "title": "資料庫連接數",
        "type": "graph",
        "targets": [
          {
            "expr": "postgres_connections_active",
            "legendFormat": "Active"
          },
          {
            "expr": "postgres_connections_idle",
            "legendFormat": "Idle"
          },
          {
            "expr": "postgres_connections_max",
            "legendFormat": "Max"
          }
        ]
      }
    ]
  }
}
```

這個監控配置是否全面？需要增加其他指標嗎？
```

## 🔄 CI/CD 流水線

### GitHub Actions 工作流
```markdown
🤖 **完整的 CI/CD 流水線**

🚀 **生產部署工作流**
```yaml
# .github/workflows/production.yml
name: Production Deployment

on:
  push:
    branches: [main]
    tags: ['v*']

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run unit tests
      run: npm run test:unit
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

    - name: Check test coverage
      run: npm run test:coverage
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Run security audit
      run: npm audit --audit-level high

    - name: Run dependency scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.image.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}
    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}

    - name: Build and push Docker image
      id: build
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

    - name: Output image
      id: image
      run: |
        echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}" >> $GITHUB_OUTPUT

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # kubectl commands for staging deployment

    - name: Run smoke tests
      run: |
        echo "Running smoke tests on staging..."
        npm run test:smoke -- --env=staging

  deploy-production:
    needs: [build, deploy-staging]
    runs-on: ubuntu-latest
    environment: production
    if: startsWith(github.ref, 'refs/tags/v')
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production environment..."
        kubectl set image deployment/taskmanager-app taskmanager=${{ needs.build.outputs.image }}:${{ github.ref_name }} -n taskmanager-prod
        kubectl rollout status deployment/taskmanager-app -n taskmanager-prod

    - name: Run health checks
      run: |
        echo "Running production health checks..."
        curl -f https://api.taskmanager.com/health

    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

這個 CI/CD 流水線是否涵蓋了所有必要步驟？
```

## 🎯 階段完成標準

### ✅ 必須完成
- [ ] 生產環境部署成功，應用正常運行
- [ ] CI/CD 流水線建立並測試通過
- [ ] 監控和告警系統運行正常
- [ ] 備份和災難恢復機制已驗證
- [ ] 安全措施已實施並通過檢查

### 🎁 額外價值
- [ ] 自動擴容機制已配置並測試
- [ ] 性能優化建議已實施
- [ ] 多區域部署已配置（高可用）
- [ ] 完整的運維文檔已準備

## 💡 項目完成

### 上線慶祝和總結
```markdown
🎉 **項目成功上線！**

✅ **最終成果統計**
- 開發週期: 6 週完成
- 功能完成率: 100% (所有 MVP 功能)
- 測試覆蓋率: 87%
- 性能指標: 平均回應時間 298ms
- 安全評級: A+ (無高風險漏洞)
- 用戶滿意度: 89%

🚀 **技術成就**
- 現代化技術棧: React + Node.js + PostgreSQL
- 容器化部署: Docker + Kubernetes
- 自動化流水線: GitHub Actions CI/CD
- 完整監控: Prometheus + Grafana
- 高可用設計: 99.9% SLA 保證

📈 **商業價值**
- MVP 快速驗證: 6 週從想法到產品
- 開發效率提升: 70% 代碼自動生成
- 運維成本降低: 自動化部署和監控
- 用戶體驗優化: 響應式設計，跨平台支援

🔮 **後續發展計劃**
- 用戶反饋收集和功能優化
- 性能監控和持續改進
- 功能擴展和市場推廣
- 技術債務清理和重構

🎯 **經驗總結**
- VibeCoding 對話式開發大幅提升效率
- 自動化測試和部署確保品質
- 持續監控和告警保障穩定性
- 團隊協作和知識共享促進成功

🤝 **致謝**
感謝所有參與者的努力和貢獻，讓這個項目從想法變成現實！
```

---

*部署不是結束，而是新的開始。真正的挑戰在於持續運營和不斷改進，為用戶創造持久的價值。* 