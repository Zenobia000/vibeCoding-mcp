# 開發實施指南 (Development Implementation Guide)

> 基於系統架構設計和 VibeCoding design_templates 的專業開發指南

---

**專案名稱**: {{ project_name }}  
**文件版本**: v0.1  
**最後更新**: {{ current_date }}  
**開發團隊負責人**: {{ dev_lead }}

---

## 📋 開發概述

### 實施範圍 (Implementation Scope)
本階段將實現在 [系統架構設計](../1_design/architecture/system_architecture_enhanced.md) 中定義的所有組件和服務。

### 實施原則 (Implementation Principles)
1. **代碼品質優先**: 遵循 SOLID 原則和設計模式
2. **測試驅動開發**: TDD/BDD 方法論
3. **持續整合**: 每次提交都觸發 CI/CD 流程
4. **文檔同步**: 代碼變更必須同步更新文檔
5. **安全性內建**: Security by Design

---

## 🏗️ 開發環境設置

### 系統需求 (System Requirements)
- **操作系統**: {{ supported_os }}
- **運行時環境**: {{ runtime_requirements }}
- **內存要求**: 至少 {{ memory_requirement }}GB RAM
- **儲存空間**: 至少 {{ storage_requirement }}GB 可用空間

### 開發工具鏈 (Development Toolchain)

#### 必備工具 (Required Tools)
```bash
# Node.js 與 npm (適用於前端和工具)
node --version  # 需要 >= {{ node_version }}
npm --version   # 需要 >= {{ npm_version }}

# 版本控制
git --version   # 需要 >= {{ git_version }}

# 容器化工具
docker --version          # 需要 >= {{ docker_version }}
docker-compose --version  # 需要 >= {{ docker_compose_version }}

# 雲端 CLI (如適用)
{{ cloud_cli_tool }} --version
```

#### 推薦工具 (Recommended Tools)
- **IDE**: {{ recommended_ide }}
- **API 測試**: {{ api_testing_tool }}
- **數據庫管理**: {{ db_management_tool }}
- **代碼品質**: {{ code_quality_tools }}

### 環境變數設定 (Environment Variables)

```bash
# 開發環境變數範例
export NODE_ENV=development
export DATABASE_URL={{ dev_database_url }}
export REDIS_URL={{ dev_redis_url }}
export API_BASE_URL={{ dev_api_url }}

# 安全相關變數 (從 .env 檔案載入)
export JWT_SECRET={{ jwt_secret_placeholder }}
export API_KEY={{ api_key_placeholder }}
```

---

## 📁 代碼組織結構

### 專案結構 (Project Structure)
```
{{ project_name }}/
├── src/                          # 主要程式碼
│   ├── api/                      # API 路由和控制器
│   │   ├── controllers/          # 業務邏輯控制器
│   │   ├── middlewares/          # 中介軟體
│   │   └── routes/               # 路由定義
│   ├── core/                     # 核心業務邏輯
│   │   ├── entities/             # 業務實體
│   │   ├── services/             # 業務服務
│   │   └── repositories/         # 數據存取層
│   ├── infrastructure/           # 基礎設施層
│   │   ├── database/             # 資料庫配置
│   │   ├── external/             # 外部服務整合
│   │   └── monitoring/           # 監控和日誌
│   └── utils/                    # 工具函數
├── tests/                        # 測試檔案
│   ├── unit/                     # 單元測試
│   ├── integration/              # 整合測試
│   └── e2e/                      # 端到端測試
├── docs/                         # 開發文檔
├── scripts/                      # 自動化腳本
└── config/                       # 配置檔案
```

### 模組命名規範 (Module Naming Conventions)

| 類型 | 命名規則 | 範例 |
|------|----------|------|
| 檔案名稱 | kebab-case | `user-service.js` |
| 類別名稱 | PascalCase | `UserService` |
| 函數名稱 | camelCase | `getUserById` |
| 常數 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 變數 | camelCase | `userResponse` |

---

## 🔧 開發工作流程

### Git 工作流程 (Git Workflow)

#### 分支策略 (Branching Strategy)
- **main**: 生產環境分支，永遠穩定
- **develop**: 開發集成分支
- **feature/{feature-name}**: 功能開發分支
- **hotfix/{issue-id}**: 緊急修復分支
- **release/{version}**: 發布準備分支

#### 提交規範 (Commit Convention)
```bash
# 格式: type(scope): description [issue-number]
feat(api): add user authentication endpoint [#123]
fix(database): resolve connection timeout issue [#124]
docs(readme): update installation instructions [#125]
test(auth): add unit tests for login service [#126]
refactor(core): simplify user service logic [#127]
```

#### 合併規則 (Merge Rules)
- 所有功能必須通過 Code Review
- CI/CD 流水線必須全部通過
- 至少需要 {{ min_reviewers }} 位評審者批准
- 必須通過所有自動化測試

### 代碼審查檢查表 (Code Review Checklist)

#### 功能性檢查 (Functional Checks)
- [ ] 功能實現符合需求規格
- [ ] 邊界條件處理正確
- [ ] 錯誤處理機制完整
- [ ] 性能考量合理

#### 代碼品質檢查 (Code Quality Checks)
- [ ] 遵循專案編碼規範
- [ ] 函數和類別大小合理
- [ ] 複雜度在可接受範圍
- [ ] 代碼重複性最小化

#### 安全性檢查 (Security Checks)
- [ ] 輸入驗證完整
- [ ] 輸出編碼正確
- [ ] 敏感資訊不外洩
- [ ] 權限控制適當

#### 測試覆蓋檢查 (Test Coverage Checks)
- [ ] 單元測試覆蓋率 ≥ {{ unit_test_coverage }}%
- [ ] 整合測試充分
- [ ] 關鍵路徑測試完整

---

## 📊 品質標準與流程

### 代碼品質指標 (Code Quality Metrics)

| 指標 | 目標值 | 衡量工具 |
|------|--------|----------|
| 單元測試覆蓋率 | ≥ {{ unit_coverage_target }}% | {{ coverage_tool }} |
| 圈複雜度 | ≤ {{ complexity_target }} | {{ complexity_tool }} |
| 重複代碼比例 | ≤ {{ duplication_target }}% | {{ duplication_tool }} |
| 技術債務比例 | ≤ {{ debt_target }}% | {{ debt_tool }} |

### 持續整合流程 (CI/CD Pipeline)

#### 程式碼檢查階段 (Code Analysis Stage)
```yaml
code_analysis:
  runs-on: {{ ci_runner }}
  steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup environment
      run: {{ setup_commands }}
    
    - name: Run linting
      run: {{ linting_command }}
    
    - name: Run security scan
      run: {{ security_scan_command }}
    
    - name: Check code coverage
      run: {{ coverage_command }}
```

#### 測試階段 (Testing Stage)
```yaml
testing:
  needs: code_analysis
  strategy:
    matrix:
      test-type: [unit, integration, e2e]
  steps:
    - name: Run {{ "{{ matrix.test-type }}" }} tests
      run: npm run test:{{ "{{ matrix.test-type }}" }}
```

#### 部署階段 (Deployment Stage)
```yaml
deployment:
  needs: testing
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Build application
      run: {{ build_command }}
    
    - name: Deploy to staging
      run: {{ staging_deploy_command }}
    
    - name: Run smoke tests
      run: {{ smoke_test_command }}
```

---

## 🚀 API 開發指引

### API 設計原則 (API Design Principles)
1. **RESTful 設計**: 遵循 REST 架構原則
2. **一致性**: 統一的命名和回應格式
3. **版本控制**: 支援 API 版本管理
4. **文檔化**: 自動生成 API 文檔

### 標準回應格式 (Standard Response Format)

#### 成功回應 (Success Response)
```json
{
  "success": true,
  "data": {
    // 實際數據
  },
  "meta": {
    "timestamp": "2023-XX-XX",
    "version": "v1",
    "requestId": "uuid"
  }
}
```

#### 錯誤回應 (Error Response)
```json
{
  "success": false,
  "error": {
    "code": "{{ error_code }}",
    "message": "{{ error_message }}",
    "details": "{{ error_details }}"
  },
  "meta": {
    "timestamp": "2023-XX-XX",
    "version": "v1",
    "requestId": "uuid"
  }
}
```

### API 路由範例 (API Route Examples)

```javascript
// 用戶資源 API
router.get('/api/v1/users', userController.getAllUsers);
router.get('/api/v1/users/:id', userController.getUserById);
router.post('/api/v1/users', userController.createUser);
router.put('/api/v1/users/:id', userController.updateUser);
router.delete('/api/v1/users/:id', userController.deleteUser);

// 認證 API
router.post('/api/v1/auth/login', authController.login);
router.post('/api/v1/auth/logout', authController.logout);
router.post('/api/v1/auth/refresh', authController.refreshToken);
```

---

## 🗄️ 資料庫開發指引

### 資料庫遷移 (Database Migrations)

#### 遷移檔案命名規範
```
YYYYMMDD_HHMMSS_description.sql
20231201_143000_create_users_table.sql
20231201_144500_add_email_index_to_users.sql
```

#### 遷移最佳實踐
- 每次遷移只做一件事
- 遷移必須可逆
- 生產環境遷移前先測試
- 重要變更必須有回滾計劃

### 資料模型設計 (Data Model Design)

#### 實體關係範例
```sql
-- 用戶表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用戶資料表
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 安全性實施指引

### 認證與授權 (Authentication & Authorization)

#### JWT Token 實作
```javascript
// Token 生成
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'your-app-name'
  });
};

// Token 驗證中介軟體
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### 資料驗證 (Data Validation)

#### 輸入驗證範例
```javascript
const { body, validationResult } = require('express-validator');

const validateUserCreation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('firstName').isLength({ min: 2, max: 50 }).trim().escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

---

## 📈 監控與日誌

### 日誌標準 (Logging Standards)

#### 日誌格式
```javascript
const logger = require('winston');

// 結構化日誌範例
logger.info('User login successful', {
  userId: user.id,
  email: user.email,
  ipAddress: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date().toISOString(),
  requestId: req.requestId
});
```

#### 日誌級別指引
- **ERROR**: 系統錯誤，需要立即處理
- **WARN**: 警告信息，需要關注
- **INFO**: 一般信息，記錄關鍵操作
- **DEBUG**: 詳細除錯信息，僅開發環境

### 效能監控 (Performance Monitoring)

#### 關鍵指標 (Key Metrics)
- API 響應時間 (P50, P95, P99)
- 錯誤率
- 吞吐量 (TPS)
- 資源使用率 (CPU, Memory, Disk)

---

## ✅ 開發檢查表

### 功能開發完成檢查表 (Feature Development Checklist)

#### 開發階段 (Development Phase)
- [ ] 功能實現符合需求規格
- [ ] 代碼遵循專案規範
- [ ] 單元測試覆蓋率達標
- [ ] 整合測試通過
- [ ] 安全漏洞掃描通過
- [ ] 效能測試滿足要求

#### 代碼審查階段 (Code Review Phase)
- [ ] 同儕審查完成
- [ ] 技術領導審查通過
- [ ] 所有審查意見已處理
- [ ] CI/CD 流水線全部通過

#### 部署準備階段 (Deployment Preparation)
- [ ] 環境配置檢查完成
- [ ] 資料庫遷移腳本測試通過
- [ ] 部署腳本驗證完成
- [ ] 回滾計劃準備就緒

#### 上線後檢查 (Post-Deployment Checks)
- [ ] 煙霧測試通過
- [ ] 監控指標正常
- [ ] 錯誤率在可接受範圍
- [ ] 用戶反饋收集機制啟動

---

## 📚 相關文檔

### 上游文檔 (Upstream Documents)
- [專案簡報 PRD](../0_discovery/clarifications/project_brief_template.md)
- [系統架構設計](../1_design/architecture/system_architecture_enhanced.md)
- [API 設計規範](../1_design/api-contracts/)

### 下游文檔 (Downstream Documents)
- [測試策略](../3_validation/test_strategy.md)
- [部署指南](../4_deployment/deployment_guide.md)
- [運維手冊](../4_deployment/operations_manual.md)

---

**文檔審核記錄**:

| 日期 | 審核人 | 版本 | 變更摘要 |
|------|--------|------|----------|
| {{ date }} | {{ reviewer }} | v0.1 | 初始版本 |

---

**下一步行動**:
- [ ] 建立開發環境
- [ ] 開始核心模組開發
- [ ] 進入 [測試驗證階段](../3_validation/)
- [ ] 使用 `vibecoding develop --module {{ module_name }}` 開始開發

---
*本指南將隨專案進展持續更新，確保開發品質與效率* 