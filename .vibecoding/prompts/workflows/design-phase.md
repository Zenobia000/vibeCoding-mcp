# Design Phase Workflow Prompt

## 🎯 階段目標

**系統設計階段** - 將需求轉化為具體的技術方案，設計系統架構、API 接口、資料庫結構和用戶介面。

## 🏗️ 階段重點

### 1. 系統架構設計
- **技術選型**: 基於需求選擇最適合的技術棧
- **架構模式**: 定義系統整體架構風格（微服務、單體、分層等）
- **組件設計**: 劃分系統模組和組件職責
- **部署架構**: 設計生產環境部署方案

### 2. API 設計
- **端點設計**: 定義 RESTful API 端點和資源
- **資料格式**: 確定請求和回應的資料結構
- **認證授權**: 設計安全機制和權限控制
- **版本管理**: 規劃 API 版本策略

### 3. 資料庫設計
- **資料模型**: 設計實體關係圖（ERD）
- **資料庫選型**: 選擇關聯式或非關聯式資料庫
- **效能最佳化**: 設計索引和查詢優化策略
- **資料備份**: 規劃資料備份和恢復機制

### 4. 用戶介面設計
- **使用者體驗**: 設計直觀的用戶操作流程
- **介面設計**: 創建線框圖和視覺設計
- **響應式設計**: 確保多裝置兼容性
- **可用性測試**: 驗證設計的易用性

## 🎨 設計策略指導

### 技術選型決策
```markdown
🤖 **技術選型建議範例**

基於你的需求分析，我建議以下技術方案：

🎯 **前端技術棧**
- **框架**: React 18 with TypeScript
  - 理由: 豐富的生態系統，優秀的開發體驗
  - 優勢: 組件化開發，強型別支援，良好的測試框架
  
- **狀態管理**: Redux Toolkit + RTK Query
  - 理由: 簡化 Redux 使用，內建 API 查詢緩存
  
- **UI 框架**: Ant Design + Tailwind CSS
  - 理由: 企業級組件庫 + 靈活的樣式控制

🖥️ **後端技術棧**
- **運行環境**: Node.js + Express.js
  - 理由: 與前端共用語言，豐富的中間件生態
  
- **資料庫**: PostgreSQL + Redis
  - 理由: 可靠的關聯式資料庫 + 高性能緩存
  
- **認證**: JWT + bcrypt
  - 理由: 無狀態認證，適合分散式部署

這個技術選型符合你的偏好嗎？有什麼需要調整的嗎？
```

### 架構設計交流
```markdown
🤖 **系統架構討論範例**

讓我們討論系統的整體架構：

🏗️ **建議採用分層架構**

```
┌─────────────────────────────────────┐
│           前端層 (React)              │
├─────────────────────────────────────┤
│           API 閘道層                  │
├─────────────────────────────────────┤
│     業務邏輯層 (Express Services)      │
├─────────────────────────────────────┤
│     資料訪問層 (Repository Pattern)    │
├─────────────────────────────────────┤
│        資料庫層 (PostgreSQL)          │
└─────────────────────────────────────┘
```

🎯 **架構優勢**
1. **職責分離**: 每層有明確職責
2. **可測試性**: 易於編寫單元和整合測試
3. **可維護性**: 變更影響範圍可控
4. **可擴展性**: 支援未來功能擴展

📊 **關鍵設計決策**
- 使用 Repository Pattern 封裝資料存取
- API 層實施統一的錯誤處理和日誌記錄
- 前端採用組件化設計，支援代碼復用

你對這個架構設計有什麼想法？
```

### API 設計指導
```markdown
🤖 **API 設計討論**

基於你的任務管理需求，讓我們設計核心 API：

📋 **任務管理 API 設計**

### 任務資源 (/api/tasks)
```http
# 獲取任務列表
GET /api/tasks?page=1&limit=20&status=pending&assignee=user123

# 創建新任務
POST /api/tasks
Content-Type: application/json
{
  "title": "實現用戶認證功能",
  "description": "使用 JWT 實現用戶登入和權限驗證",
  "priority": "high",
  "dueDate": "2025-01-30",
  "assigneeId": "user123",
  "projectId": "proj456"
}

# 更新任務
PUT /api/tasks/task789
Content-Type: application/json
{
  "status": "in-progress",
  "completedPercentage": 30
}

# 刪除任務
DELETE /api/tasks/task789
```

🔐 **認證和授權**
```http
# 所有 API 需要認證 Header
Authorization: Bearer <jwt-token>

# 權限檢查邏輯
- 任務創建者可以編輯/刪除任務
- 任務指派者可以更新任務狀態
- 項目管理者可以管理項目內所有任務
```

這個 API 設計滿足你的需求嗎？
```

### 資料庫設計指導
```markdown
🤖 **資料庫設計討論**

基於功能需求，我建議以下資料庫設計：

📊 **核心資料表設計**

### Users (用戶表)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url VARCHAR(255),
  role VARCHAR(20) DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Projects (項目表)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tasks (任務表)  
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  priority VARCHAR(10) DEFAULT 'medium',
  due_date TIMESTAMP,
  completed_percentage INTEGER DEFAULT 0,
  project_id UUID REFERENCES projects(id),
  creator_id UUID REFERENCES users(id),
  assignee_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

🎯 **設計考量**
- 使用 UUID 作為主鍵，增強安全性
- 添加適當索引優化查詢性能
- 實施軟刪除策略保留歷史記錄

這個資料庫設計符合需求嗎？
```

## 📋 設計產出

### 系統架構文檔
```markdown
# 系統架構設計文檔

## 🎯 架構概覽
本系統採用現代化的分層架構設計，確保可擴展性、可維護性和高性能。

## 🏗️ 技術棧

### 前端技術
- **框架**: React 18 + TypeScript
- **狀態管理**: Redux Toolkit
- **UI 框架**: Ant Design
- **樣式**: Tailwind CSS
- **構建工具**: Vite

### 後端技術
- **運行環境**: Node.js 18+
- **Web 框架**: Express.js
- **資料庫**: PostgreSQL 14+
- **緩存**: Redis
- **認證**: JWT + bcrypt

### 基礎設施
- **容器化**: Docker + Docker Compose
- **雲端平台**: AWS/Azure/GCP
- **CI/CD**: GitHub Actions
- **監控**: Prometheus + Grafana

## 📊 系統組件圖
[Mermaid 圖表描述系統組件關係]

## 🔧 部署架構
[部署環境和配置說明]
```

### API 規格文檔
```yaml
# OpenAPI 3.0 規格
openapi: 3.0.0
info:
  title: 任務管理系統 API
  version: 1.0.0
  description: 提供任務管理的完整 RESTful API

servers:
  - url: https://api.taskmanager.com/v1
    description: 生產環境
  - url: https://staging-api.taskmanager.com/v1
    description: 測試環境

paths:
  /tasks:
    get:
      summary: 獲取任務列表
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: 成功返回任務列表
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Task'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
```

### 資料庫設計文檔
```markdown
# 資料庫設計文檔

## 📊 實體關係圖 (ERD)
[資料庫 ERD 圖表]

## 📋 資料表說明

### 核心業務表
1. **users** - 用戶基本信息
2. **projects** - 項目管理
3. **tasks** - 任務詳情
4. **comments** - 任務評論
5. **attachments** - 檔案附件

### 關聯表
1. **project_members** - 項目成員關係
2. **task_dependencies** - 任務依賴關係
3. **user_preferences** - 用戶偏好設定

## 🔍 索引策略
- tasks(project_id, status) - 優化項目任務查詢
- tasks(assignee_id, due_date) - 優化用戶任務列表
- users(email) - 優化登入查詢

## 💾 資料保留政策
- 已刪除任務保留 90 天
- 日誌資料保留 1 年
- 使用者活動記錄保留 2 年
```

## 🎯 階段完成標準

### ✅ 必須完成
- [ ] 系統架構設計已確定並文檔化
- [ ] API 規格已設計並通過評審
- [ ] 資料庫設計已完成並優化
- [ ] 技術選型已確定並說明理由
- [ ] 部署架構已規劃

### 🎁 額外價值  
- [ ] 效能基準測試計劃已制定
- [ ] 安全風險評估已完成
- [ ] 監控和告警策略已設計
- [ ] 災難恢復計劃已初步制定

## 💡 轉至下一階段

### 實作階段準備
```markdown
🚀 **準備進入實作階段**

✅ **Design 階段成果**
- 系統架構設計已完成並評審通過
- API 規格文檔已撰寫（42 個端點）
- 資料庫設計已優化（15 個資料表）
- 技術選型已確定並獲得團隊共識

🔧 **移交給實作階段**
- 開發團隊將基於設計文檔開始編碼
- 測試團隊將準備測試計劃和測試用例
- DevOps 團隊將準備開發環境和 CI/CD 流水線

💻 **實作階段關鍵任務**
1. 按照 API 規格實現後端服務
2. 根據設計稿開發前端介面
3. 實施資料庫遷移和種子資料
4. 建立自動化測試套件
5. 配置開發和測試環境
```

---

*好的設計是實作成功的一半。細心的規劃能夠避免 80% 的開發問題。* 