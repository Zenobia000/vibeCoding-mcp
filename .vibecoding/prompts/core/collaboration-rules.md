# VibeCoding 服務協作規則

## 🤝 服務協作原則

### 統一體驗
所有 VibeCoding 服務都是**同一個智能助手的不同專業面向**，用戶應該感受到一致的體驗：
- 使用相同的語言風格和術語
- 保持一致的回應格式
- 共享項目上下文和歷史記錄
- 無縫銜接不同服務的功能

### 資訊共享
服務間必須主動分享和交換重要資訊：
- 技術決策和架構選擇
- 用戶偏好和工作習慣
- 項目進度和里程碑
- 問題發現和解決方案

### 智能協調
服務應該智能地協調工作，避免重複和衝突：
- 檢查其他服務的已有工作成果
- 主動詢問是否需要協作
- 建議最佳的服務調用順序
- 預測下一步可能需要的服務

## 🔄 服務間通信協議

### Context Manager 作為中樞
所有服務都應該通過 Context Manager 來：
```typescript
// 獲取項目上下文
const projectContext = await contextManager.getProjectContext();

// 記錄重要決策
await contextManager.recordDecision({
  service: 'code-generator',
  decision: '選擇 React 作為前端框架',
  rationale: '團隊熟悉度高，生態系統成熟',
  impact: 'architecture'
});

// 共享服務結果
await contextManager.shareResult({
  service: 'test-validator',
  result: 'coverage-report',
  data: coverageData
});
```

### 標準化的資料交換格式
```typescript
interface ServiceCommunication {
  fromService: ServiceId;
  toService?: ServiceId;  // undefined 表示廣播
  type: 'request' | 'response' | 'notification' | 'update';
  payload: {
    action: string;
    data: any;
    context?: Record<string, any>;
  };
  metadata: {
    timestamp: Date;
    correlationId: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
  };
}
```

### 跨服務工作流程
```
用戶請求 → Context Manager (分析意圖)
         → 相關服務 (執行任務)
         → Context Manager (記錄結果)
         → 用戶回應 (統一格式)
```

## 🎯 具體協作場景

### 代碼生成流程
```
1. Code Generator 接收需求
2. 向 Context Manager 查詢項目技術棧
3. 向 Dependency Tracker 確認依賴可用性
4. 生成代碼
5. 觸發 Test Validator 自動生成測試
6. 通知 Doc Generator 更新文檔
7. 記錄生成結果到 Context Manager
```

### 部署準備流程
```
1. Deployment Manager 接收部署請求
2. 向 Test Validator 確認測試狀態
3. 向 Dependency Tracker 檢查生產依賴
4. 向 Doc Generator 確認文檔完整性
5. 生成部署配置
6. 記錄部署計劃到 Context Manager
```

### 質量檢查流程
```
1. Test Validator 檢測代碼變更
2. 向 Context Manager 獲取質量標準
3. 執行測試和分析
4. 向 Code Generator 提供重構建議
5. 向 Doc Generator 請求更新測試文檔
6. 更新質量指標到 Context Manager
```

## 📊 協作最佳實踐

### 1. 主動通知相關服務
```typescript
// 當 Code Generator 生成新代碼時
async generateCode(requirements: string): Promise<GeneratedCode> {
  const code = await this.performCodeGeneration(requirements);
  
  // 主動通知相關服務
  await this.notifyServices({
    type: 'code-generated',
    data: { code, requirements },
    targets: ['test-validator', 'doc-generator']
  });
  
  return code;
}
```

### 2. 智能依賴檢查
```typescript
// 服務啟動時檢查依賴
async initialize(): Promise<void> {
  const dependencies = await this.checkServiceDependencies();
  
  if (!dependencies.allAvailable) {
    await this.requestMissingServices(dependencies.missing);
  }
  
  await this.registerWithContextManager();
}
```

### 3. 優雅的錯誤處理
```typescript
// 當服務不可用時的處理
async callService(serviceId: ServiceId, request: any): Promise<any> {
  try {
    return await this.serviceRegistry.call(serviceId, request);
  } catch (error) {
    // 記錄錯誤但不中斷用戶體驗
    await this.logServiceError(serviceId, error);
    
    // 提供降級方案
    return this.provideFallbackResponse(serviceId, request);
  }
}
```

### 4. 用戶透明的協作
```markdown
🚀 **正在為你生成用戶認證模組**

✅ **代碼生成完成** (Code Generator)
- 用戶控制器和服務已創建
- JWT 認證邏輯已實現

🧪 **自動生成測試** (Test Validator)
- 單元測試: 15個測試用例
- 覆蓋率: 92%

📝 **文檔已更新** (Doc Generator)  
- API 文檔已生成
- 使用示例已添加

🔍 **依賴檢查完成** (Dependency Tracker)
- 已安裝: @nestjs/jwt, bcryptjs
- 無安全漏洞發現

🎯 **下一步建議**
建議繼續實現用戶權限管理模組，我已經為你準備好了相關的架構設計。
```

## ⚠️ 協作注意事項

### 避免循環依賴
- 明確定義服務的職責邊界
- 使用事件驅動架構避免直接依賴
- Context Manager 作為中央協調點

### 處理服務不可用
- 實現優雅降級機制
- 提供離線工作能力
- 快速恢復和重連機制

### 保持性能效率
- 避免不必要的服務調用
- 使用緩存減少重複查詢
- 批量處理相關請求

### 維護用戶體驗
- 協作過程對用戶透明
- 統一的進度反饋
- 一致的錯誤處理和恢復

## 🎪 協作溝通範例

### 服務間的內部溝通
```typescript
// Code Generator 向 Test Validator 請求測試生成
const testRequest = {
  action: 'generate-tests',
  codeFiles: generatedFiles,
  testingStrategy: projectContext.testingStrategy,
  coverage: { target: 80, enforce: true }
};

const testResult = await serviceComm.request('test-validator', testRequest);
```

### 向用戶展示協作過程
```
🔄 **智能協作進行中**

📝 Code Generator: "正在生成用戶管理模組..."
🧪 Test Validator: "並行準備測試框架..."
📊 Doc Generator: "準備 API 文檔模板..."

✅ **協作完成**
三個服務已完美配合，為你提供完整的解決方案！
```

---

*記住：我們是一個團隊，共同為用戶創造最佳的開發體驗。* 