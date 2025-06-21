# Validation Phase Workflow Prompt

## 🎯 階段目標

**測試驗證階段** - 全面驗證系統功能、性能、安全性和用戶體驗，確保產品達到上線標準。

## 🧪 階段重點

### 1. 功能測試
- **手動測試**: 完整的功能驗證和用戶場景測試
- **自動化測試**: 回歸測試和持續驗證
- **整合測試**: 系統組件間的協作驗證
- **端對端測試**: 完整用戶流程驗證

### 2. 效能測試
- **負載測試**: 正常負載下的系統表現
- **壓力測試**: 極限負載下的系統穩定性
- **容量測試**: 系統最大承載能力評估
- **效能優化**: 瓶頸識別和性能調優

### 3. 安全測試
- **漏洞掃描**: 常見安全漏洞檢查
- **滲透測試**: 模擬攻擊場景驗證
- **權限測試**: 存取控制和授權驗證
- **資料保護**: 敏感資料處理驗證

### 4. 用戶體驗驗證
- **可用性測試**: 介面易用性評估
- **兼容性測試**: 跨平台和瀏覽器測試
- **無障礙測試**: 協助功能和可及性驗證
- **用戶回饋**: 實際用戶體驗收集

## 🔍 測試策略指導

### 功能測試計劃
```markdown
🤖 **功能測試策略建議**

讓我們制定全面的功能測試計劃：

📋 **測試優先級分類**

🔥 **P0 - 核心功能 (必須無缺陷)**
1. **用戶認證流程**
   - 註冊、登入、登出功能
   - 密碼重設和帳號驗證
   - Session 管理和權限控制

2. **任務核心 CRUD**
   - 任務創建、查看、編輯、刪除
   - 任務狀態變更和進度追蹤
   - 任務指派和負責人管理

3. **資料完整性**
   - 資料存儲和檢索正確性
   - 關聯資料一致性維護
   - 並發操作資料安全

⚡ **P1 - 重要功能 (可接受輕微問題)**
1. **協作功能**
   - 團隊成員邀請和管理
   - 任務評論和溝通
   - 通知和提醒系統

2. **進階查詢**
   - 篩選和搜尋功能
   - 排序和分頁機制
   - 導出和報告生成

💡 **P2 - 輔助功能 (可延後修復)**
1. **使用者偏好**
   - 個人設定和偏好
   - 主題和介面自定義
   - 快捷鍵和效率工具

這個測試優先級劃分合理嗎？
```

### 測試用例設計
```markdown
🤖 **測試用例設計範例**

📝 **用戶註冊功能測試**

**測試用例 #001: 成功註冊新用戶**
- **前置條件**: 用戶未註冊，在註冊頁面
- **測試步驟**:
  1. 輸入有效的用戶名 "testuser123"
  2. 輸入有效的 email "test@example.com"
  3. 輸入符合要求的密碼 "SecurePass123!"
  4. 確認密碼輸入相同密碼
  5. 點擊 "註冊" 按鈕
- **預期結果**: 
  - 顯示註冊成功訊息
  - 自動登入並跳轉到主頁面
  - 收到歡迎郵件
- **實際結果**: [測試時填寫]
- **狀態**: [Pass/Fail]

**測試用例 #002: 重複 Email 註冊失敗**
- **前置條件**: 資料庫中已存在 email "existing@example.com"
- **測試步驟**:
  1. 輸入用戶名 "newuser"
  2. 輸入已存在的 email "existing@example.com"
  3. 輸入有效密碼
  4. 點擊 "註冊" 按鈕
- **預期結果**: 
  - 顯示錯誤訊息 "此 Email 已被註冊"
  - 保留用戶輸入的其他欄位內容
  - 不創建新用戶帳號
- **實際結果**: [測試時填寫]
- **狀態**: [Pass/Fail]

你希望我為其他功能也設計類似的測試用例嗎？
```

### 自動化測試策略
```markdown
🤖 **自動化測試實施建議**

🎯 **API 自動化測試**
```javascript
// tests/api/auth.test.js
describe('API 認證測試套件', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // 清理測試資料
    await User.destroy({ where: { email: { [Op.like]: '%test%' } } });
  });

  describe('POST /api/auth/register', () => {
    test('成功註冊新用戶', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        message: '註冊成功',
        user: {
          username: userData.username,
          email: userData.email
        }
      });
      expect(response.body.token).toBeDefined();
      expect(response.body.user.password_hash).toBeUndefined();
    });

    test('重複 Email 註冊失敗', async () => {
      // 先創建一個用戶
      await User.create({
        username: 'existing',
        email: 'existing@example.com',
        password_hash: await bcrypt.hash('password', 10)
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

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('password123', 10)
      });
    });

    test('正確憑證登入成功', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    });

    test('錯誤密碼登入失敗', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.error).toContain('密碼錯誤');
    });
  });
});
```

🎭 **前端 E2E 測試**
```javascript
// tests/e2e/user-journey.test.js
describe('用戶完整流程測試', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  test('用戶註冊到創建任務的完整流程', async () => {
    // 1. 註冊新用戶
    await page.click('[data-testid="register-link"]');
    await page.fill('[data-testid="username-input"]', 'e2euser');
    await page.fill('[data-testid="email-input"]', 'e2e@example.com');
    await page.fill('[data-testid="password-input"]', 'SecurePass123!');
    await page.fill('[data-testid="confirm-password-input"]', 'SecurePass123!');
    await page.click('[data-testid="register-button"]');

    // 2. 驗證登入成功
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('歡迎');

    // 3. 創建新任務
    await page.click('[data-testid="create-task-button"]');
    await page.fill('[data-testid="task-title-input"]', '第一個測試任務');
    await page.fill('[data-testid="task-description-input"]', '這是 E2E 測試創建的任務');
    await page.selectOption('[data-testid="task-priority-select"]', 'high');
    await page.click('[data-testid="save-task-button"]');

    // 4. 驗證任務創建成功
    await expect(page.locator('[data-testid="task-list"]')).toContainText('第一個測試任務');
    await expect(page.locator('[data-testid="task-priority-high"]')).toBeVisible();

    // 5. 更新任務狀態
    await page.click('[data-testid="task-start-button"]');
    await expect(page.locator('[data-testid="task-status"]')).toContainText('進行中');

    // 6. 完成任務
    await page.click('[data-testid="task-complete-button"]');
    await expect(page.locator('[data-testid="task-status"]')).toContainText('已完成');
  });
});
```

這些自動化測試策略符合你的需求嗎？
```

## 📊 效能測試策略

### 負載測試計劃
```markdown
🤖 **效能測試建議**

⚡ **負載測試場景設計**

📈 **場景 1: 正常負載測試**
- **目標**: 驗證系統在預期負載下的表現
- **用戶數量**: 100 併發用戶
- **測試時間**: 30 分鐘
- **操作模式**: 80% 讀取，20% 寫入
- **成功標準**: 
  - 平均回應時間 < 500ms
  - 95% 請求回應時間 < 1000ms
  - 錯誤率 < 0.1%

🔥 **場景 2: 壓力測試**
- **目標**: 找出系統的臨界點
- **用戶數量**: 從 50 逐步增加到 500
- **測試時間**: 60 分鐘
- **操作模式**: 混合讀寫操作
- **觀察指標**:
  - CPU 使用率
  - 記憶體消耗
  - 資料庫連接數
  - 回應時間變化

🏭 **場景 3: 容量測試**
- **目標**: 確定系統最大承載能力
- **資料量**: 10,000 用戶，100,000 任務
- **併發數**: 持續 200 用戶
- **測試時間**: 2 小時
- **驗證項目**:
  - 大資料量下的查詢效能
  - 分頁和篩選功能表現
  - 記憶體使用是否穩定

你希望調整這些測試場景嗎？
```

### 效能監控設置
```markdown
🤖 **效能監控配置**

📊 **關鍵指標監控**
```bash
# 使用 Artillery 進行負載測試
# artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 300  # 5 分鐘
      arrivalRate: 10  # 每秒 10 個用戶
    - duration: 600  # 10 分鐘
      arrivalRate: 20  # 每秒 20 個用戶
  environments:
    staging:
      target: 'https://staging-api.example.com'
    production:
      target: 'https://api.example.com'

scenarios:
  - name: "用戶登入和操作任務"
    weight: 80
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ email }}"
            password: "{{ password }}"
          capture:
            json: "$.token"
            as: "authToken"
      - get:
          url: "/api/tasks"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - post:
          url: "/api/tasks"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            title: "負載測試任務 {{ $randomString() }}"
            description: "這是負載測試創建的任務"
            priority: "{{ $randomPickSetKey(['low', 'medium', 'high']) }}"
```

🔍 **效能分析工具**
```javascript
// 應用效能監控中間件
const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const memoryUsage = process.memoryUsage();
    
    // 記錄效能指標
    logger.info('API Performance', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime,
      memoryUsage: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024)
      }
    });
    
    // 效能警告
    if (responseTime > 1000) {
      logger.warn('Slow API Response', {
        url: req.url,
        responseTime
      });
    }
  });
  
  next();
};
```

這個監控設置能滿足你的需求嗎？
```

## 🔒 安全測試策略

### 安全漏洞檢查
```markdown
🤖 **安全測試檢查清單**

🛡️ **OWASP Top 10 驗證**

1. **注入攻擊防護**
   - [ ] SQL 注入測試
   - [ ] NoSQL 注入測試
   - [ ] 命令注入測試
   - [ ] LDAP 注入測試

2. **認證和授權**
   - [ ] 弱密碼策略測試
   - [ ] Session 管理驗證
   - [ ] 權限提升測試
   - [ ] JWT Token 安全性

3. **敏感資料保護**
   - [ ] 資料傳輸加密
   - [ ] 靜態資料加密
   - [ ] 敏感資料遮罩
   - [ ] 密碼存儲安全性

4. **XML 外部實體 (XXE)**
   - [ ] XML 解析器配置
   - [ ] 外部實體注入測試

5. **存取控制缺陷**
   - [ ] 水平權限提升
   - [ ] 垂直權限提升
   - [ ] 直接物件參考

6. **安全配置錯誤**
   - [ ] 預設帳號和密碼
   - [ ] 錯誤頁面資訊洩露
   - [ ] HTTP 安全標頭
   - [ ] CORS 配置檢查

這個安全檢查清單是否涵蓋了主要風險？
```

### 滲透測試腳本
```markdown
🤖 **自動化安全測試**

🔍 **API 安全測試腳本**
```bash
#!/bin/bash
# security-test.sh

echo "開始 API 安全測試..."

# 1. SQL 注入測試
echo "測試 SQL 注入漏洞..."
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin'\''or 1=1--", "password": "anything"}'

# 2. XSS 測試
echo "測試 XSS 漏洞..."
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "<script>alert('\''XSS'\'')</script>", "description": "XSS test"}'

# 3. 權限提升測試
echo "測試未授權存取..."
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $REGULAR_USER_TOKEN"

# 4. 暴力破解測試
echo "測試暴力破解防護..."
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@example.com", "password": "wrong'$i'"}' &
done
wait

echo "安全測試完成"
```

🔐 **HTTPS 和 TLS 配置驗證**
```bash
# 檢查 TLS 配置
sslscan --show-certificate example.com:443

# 檢查 HTTP 安全標頭
curl -I https://example.com | grep -E "(Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options|Content-Security-Policy)"

# 檢查證書有效性
openssl s_client -connect example.com:443 -servername example.com < /dev/null
```

這些安全測試方法適合你的應用嗎？
```

## 🎯 階段完成標準

### ✅ 必須完成
- [ ] 所有 P0 功能測試通過，無阻擋性缺陷
- [ ] 效能測試達到預設基準
- [ ] 安全漏洞掃描通過，無高風險漏洞
- [ ] 跨瀏覽器兼容性測試通過
- [ ] 自動化測試套件建立並通過

### 🎁 額外價值
- [ ] 用戶可用性測試完成，滿意度 > 80%
- [ ] 無障礙功能測試通過 WCAG 2.1 AA 標準
- [ ] 災難恢復和資料備份驗證
- [ ] 效能優化建議已實施

## 💡 轉至下一階段

### 部署階段準備
```markdown
🚀 **準備進入部署階段**

✅ **Validation 階段成果**
- 功能測試完成率 100%（153/153 測試用例通過）
- 效能測試達標，平均回應時間 287ms
- 安全掃描通過，0 個高風險漏洞
- 跨瀏覽器測試通過（Chrome, Firefox, Safari, Edge）
- 用戶體驗測試滿意度 87%

🚀 **移交給部署階段**
- DevOps 團隊將準備生產環境部署
- SRE 團隊將配置監控和告警系統
- 運維團隊將建立災難恢復機制
- 客服團隊將準備用戶支援文檔

🎯 **部署階段關鍵任務**
1. 配置生產環境和 CDN
2. 建立 CI/CD 自動化部署流水線
3. 設置全面的監控和告警系統
4. 準備資料備份和災難恢復計劃
5. 制定上線計劃和回滾策略
```

---

*測試不僅是品質保證，更是對用戶的責任。每一個通過的測試用例，都是對用戶體驗的承諾。* 