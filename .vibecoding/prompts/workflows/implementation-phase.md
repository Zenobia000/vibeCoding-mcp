# Implementation Phase Workflow Prompt

## 🎯 階段目標

**代碼實作階段** - 將設計方案轉化為可運行的代碼，實現核心功能，建立測試覆蓋，確保代碼品質。

## 💻 階段重點

### 1. 代碼實作
- **模組開發**: 按照架構設計實現各個模組
- **API 實現**: 根據 API 規格實現後端端點
- **前端開發**: 實現用戶介面和互動邏輯
- **資料庫整合**: 實施資料存取層和 ORM

### 2. 測試開發
- **單元測試**: 為核心邏輯編寫單元測試
- **整合測試**: 測試模組間的協作
- **端對端測試**: 驗證完整用戶流程
- **API 測試**: 驗證 API 端點功能

### 3. 代碼品質
- **代碼審查**: 實施同儕代碼審查流程
- **靜態分析**: 使用工具檢查代碼品質
- **效能優化**: 識別和解決效能瓶頸
- **重構改進**: 持續改進代碼結構

### 4. 開發環境
- **本地環境**: 建立統一的開發環境
- **版本控制**: 實施 Git 工作流程
- **CI/CD**: 設置持續整合流水線
- **開發工具**: 配置編輯器和除錯工具

## 🛠️ 實作策略指導

### 漸進式開發
```markdown
🤖 **實作計劃建議**

讓我們採用分階段的實作策略：

🎯 **第一階段: 核心功能 (Week 1-2)**
1. **用戶認證系統**
   - 用戶註冊、登入、登出
   - JWT Token 實現
   - 密碼加密和驗證

2. **基本 CRUD 操作**
   - 任務創建、讀取、更新、刪除
   - 項目基本管理
   - 資料庫遷移腳本

🔧 **第二階段: 進階功能 (Week 3-4)**
1. **權限系統**
   - 角色權限控制
   - 資源訪問限制
   - API 權限驗證

2. **協作功能**
   - 任務指派
   - 評論系統
   - 團隊成員管理

🚀 **第三階段: 優化完善 (Week 5-6)**
1. **效能優化**
   - 資料庫查詢優化
   - API 回應快取
   - 前端效能調優

2. **用戶體驗**
   - 介面互動優化
   - 錯誤處理改進
   - 載入狀態管理

這個實作計劃符合你的時程安排嗎？
```

### 開發工作流程
```markdown
🤖 **建議的開發流程**

📋 **每日開發循環**

🌅 **上午 (功能開發)**
1. 檢查昨日的代碼審查反饋
2. 選擇當日要實現的功能
3. 編寫測試用例（TDD 方式）
4. 實現功能代碼
5. 運行測試確保通過

🌅 **下午 (整合測試)**
1. 將功能整合到主分支
2. 運行完整測試套件
3. 進行代碼審查
4. 處理整合衝突
5. 更新文檔和註解

🌆 **傍晚 (總結規劃)**
1. 提交今日工作成果
2. 記錄遇到的問題和解決方案
3. 規劃明日工作項目
4. 更新專案進度

你覺得這個工作流程適合嗎？需要調整嗎？
```

### 技術實現指導
```markdown
🤖 **後端 API 實現建議**

讓我們從核心 API 開始實現：

🔐 **用戶認證 API**
```javascript
// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// 用戶註冊
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 驗證用戶是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: '用戶已存在' });
    }
    
    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 創建用戶
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword
    });
    
    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: '註冊成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

📋 **任務管理 API**
```javascript
// routes/tasks.js
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, assignee } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (assignee) whereClause.assignee_id = assignee;
    
    const tasks = await Task.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username'] },
        { model: User, as: 'assignee', attributes: ['id', 'username'] },
        { model: Project, attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      data: tasks.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: tasks.count,
        totalPages: Math.ceil(tasks.count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

這個實現方式符合你的預期嗎？需要調整什麼嗎？
```

### 前端實現指導
```markdown
🤖 **React 前端實現建議**

🎨 **組件結構設計**
```
src/
├── components/           # 可重用組件
│   ├── common/          # 通用組件
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── Loading/
│   ├── layout/          # 版面組件
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   └── features/        # 功能組件
│       ├── auth/
│       ├── tasks/
│       └── projects/
├── pages/               # 頁面組件
├── hooks/               # 自定義 Hooks
├── services/            # API 服務
├── store/               # Redux Store
└── utils/               # 工具函數
```

📱 **核心組件實現**
```jsx
// components/features/tasks/TaskList.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, updateTaskStatus } from '../../../store/tasksSlice';
import { Card, Button, Tag, Avatar } from 'antd';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, pagination } = useSelector(state => state.tasks);
  const [filters, setFilters] = useState({ status: 'all', page: 1 });

  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus }));
      // 重新載入任務列表
      dispatch(fetchTasks(filters));
    } catch (error) {
      console.error('更新任務狀態失敗:', error);
    }
  };

  if (loading) return <div>載入中...</div>;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <Card
          key={task.id}
          title={task.title}
          extra={
            <Tag color={getStatusColor(task.status)}>
              {task.status}
            </Tag>
          }
          actions={[
            <Button 
              onClick={() => handleStatusChange(task.id, 'in-progress')}
              disabled={task.status === 'completed'}
            >
              開始處理
            </Button>,
            <Button 
              onClick={() => handleStatusChange(task.id, 'completed')}
              disabled={task.status === 'completed'}
            >
              標記完成
            </Button>
          ]}
        >
          <p>{task.description}</p>
          <div className="task-meta">
            <Avatar src={task.assignee?.avatar} />
            <span>{task.assignee?.username}</span>
            <span>截止日期: {task.due_date}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
```

這個組件設計符合你的需求嗎？
```

## 📊 品質保證策略

### 測試驅動開發 (TDD)
```markdown
🤖 **TDD 實作流程**

🔴 **Red Phase: 編寫失敗測試**
```javascript
// tests/auth.test.js
describe('用戶認證', () => {
  test('應該能夠成功註冊新用戶', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user).not.toHaveProperty('password_hash');
  });
  
  test('不應該允許重複的 email 註冊', async () => {
    // 先創建一個用戶
    await User.create({
      username: 'existing',
      email: 'existing@example.com',
      password_hash: 'hashed'
    });
    
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123'
      })
      .expect(400);
    
    expect(response.body.error).toContain('用戶已存在');
  });
});
```

🟢 **Green Phase: 實現最小可行代碼**
```javascript
// 實現能讓測試通過的最簡代碼
router.post('/register', async (req, res) => {
  // 實現註冊邏輯
});
```

🔵 **Refactor Phase: 重構優化**
```javascript
// 重構代碼，改進結構和性能
// 添加錯誤處理、驗證、日誌等
```

你想要採用 TDD 的開發方式嗎？
```

### 代碼品質檢查
```markdown
🤖 **代碼品質工具設置**

📋 **ESLint 配置**
```json
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};
```

🧪 **Jest 測試配置**
```json
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

🎯 **Prettier 格式化**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

這些品質控制工具的配置合適嗎？
```

## 🎯 階段完成標準

### ✅ 必須完成
- [ ] 所有核心功能已實現並測試通過
- [ ] API 端點已完成並符合規格
- [ ] 前端頁面已開發並整合 API
- [ ] 單元測試覆蓋率達到 80% 以上
- [ ] 代碼審查已完成，無重大問題

### 🎁 額外價值
- [ ] 整合測試已建立並通過
- [ ] 效能測試已執行，符合預期
- [ ] 錯誤處理和日誌系統已完善
- [ ] 代碼文檔和註解已補充完整

## 💡 轉至下一階段

### 驗證階段準備
```markdown
🧪 **準備進入驗證階段**

✅ **Implementation 階段成果**
- 核心功能已完成實現（認證、任務管理、團隊協作）
- API 端點已開發完成（23 個端點，100% 覆蓋率）
- 前端頁面已實現（5 個主要頁面）
- 單元測試覆蓋率達到 85%
- 代碼審查已完成，品質良好

🔍 **移交給驗證階段**
- QA 團隊將進行全面功能測試
- 效能團隊將執行負載和壓力測試
- 安全團隊將進行安全漏洞掃描
- 用戶體驗團隊將進行可用性測試

🎯 **驗證階段關鍵任務**
1. 執行完整的功能測試套件
2. 進行跨瀏覽器兼容性測試
3. 執行 API 效能和負載測試
4. 進行安全性漏洞評估
5. 收集用戶體驗反饋並優化
```

---

*代碼是思想的具現化。每一行代碼都應該清楚表達其意圖，每一個函數都應該專注於單一職責。* 