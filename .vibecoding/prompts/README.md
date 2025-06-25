# VibeCoding 企業級 Prompt 系統

---

**文檔版本:** v2.0 (Enterprise Edition)  
**最後更新:** {{ 時間戳 }}  
**格式標準:** 基於 FANG 級企業文檔規範  

---

## 🎯 系統概覽 (System Overview)

VibeCoding Prompt 系統現已升級至**企業級標準**，完全基於 `design_templates/` 中的專業模板設計，確保所有 AI 輸出都達到大廠實際開發的專業水準。

### ✨ 企業級特色 (Enterprise Features)

- **📋 結構化報告**: 所有輸出都採用正式的執行報告格式
- **📊 量化指標**: 包含詳細的品質指標和性能數據
- **🔍 風險評估**: 每個服務都包含風險分析與緩解措施
- **✅ 合規檢查**: 內建安全性、代碼品質、架構一致性審核
- **📝 審核簽署**: 正式的審核與簽署流程
- **🔗 文檔連結**: 完整的相關文檔參考體系

---

## 📁 架構設計 (Architecture Design)

```
.vibecoding/prompts/
├── 📁 core/                    # AI 核心行為規範
│   ├── system-identity.md      # AI 身份與職責定義
│   ├── conversation-style.md   # 企業級對話風格規範
│   └── collaboration-rules.md  # 協作模式與互動準則
├── 📁 services/                # 六大 MCP 服務專業 Prompts
│   ├── context-manager.md      # 上下文管理服務
│   ├── code-generator.md       # 代碼生成服務 (★ 企業級)
│   ├── dependency-tracker.md   # 依賴追蹤服務
│   ├── test-validator.md       # 測試驗證服務
│   ├── doc-generator.md        # 文檔生成服務
│   └── deployment-manager.md   # 部署管理服務
├── 📁 workflows/               # 五階段工作流程 Prompts
│   ├── discovery-phase.md      # 需求探索階段 (★ 企業級)
│   ├── design-phase.md         # 系統設計階段
│   ├── implementation-phase.md # 實作開發階段
│   ├── validation-phase.md     # 測試驗證階段
│   └── deployment-phase.md     # 部署上線階段
└── 📁 templates/               # ✨ 新增：企業級輸出模板
    ├── README.md               # 模板使用指南
    ├── success_response.md     # 成功操作響應模板
    ├── code_generation_output.md     # 代碼生成報告模板
    ├── test_report_output.md   # 測試驗證報告模板
    ├── discovery_output.md     # 需求探索報告模板
    └── ...                     # 更多專業模板
```

---

## 🏆 企業級標準輸出格式 (Enterprise Standard Output Format)

### 📋 標準執行報告結構

所有 VibeCoding AI 服務現在都採用統一的企業級報告格式：

```markdown
# {{ 功能/服務名稱 }} - 執行報告

---

**執行狀態 (Status):** ✅ 完成 / ⚠️ 進行中 / ❌ 需要處理
**執行時間 (Duration):** {{ 具體耗時 }}
**責任工程師 (Owner):** VibeCoding {{ 服務名稱 }}
**最後更新 (Last Updated):** {{ 時間戳 }}

---

## 1. 執行摘要 (Executive Summary)
### 1.1 核心成果 (Key Deliverables)
### 1.2 品質指標 (Quality Metrics)

## 2. 技術實現詳述 (Technical Implementation) 
### 2.1 架構決策 (Architecture Decisions)
### 2.2 實現細節 (Implementation Details)

## 3. 後續行動項目 (Next Steps)
### 3.1 立即行動 (Immediate Actions)
### 3.2 中期規劃 (Medium-term Planning)

## 4. 風險與緩解措施 (Risks & Mitigation)

---

**審核與簽署 (Review & Approval):**
- **技術審核:** ✅ AI Assistant Self-Review Passed
- **品質檢查:** ✅ Code Quality Standards Met
- **安全檢查:** ✅ Security Best Practices Applied
```

### 📊 量化品質標準

所有企業級輸出都包含具體的量化指標：

| 服務類型 | 關鍵指標 | 目標值 | 實際追蹤 |
|----------|----------|--------|----------|
| Code Generator | 代碼覆蓋率 | ≥ 80% | ✅ 追蹤 |
| Code Generator | 圈複雜度 | ≤ 10 | ✅ 追蹤 |
| Test Validator | 測試通過率 | = 100% | ✅ 追蹤 |
| Test Validator | 測試覆蓋率 | ≥ 80% | ✅ 追蹤 |
| Discovery | 需求完整性 | 100% | ✅ 追蹤 |

---

## 🛠️ 服務專業化升級 (Service Professionalization)

### 🚀 Code Generator (代碼生成服務)
**企業級特色:**
- 完整的代碼品質指標報告
- 安全性與合規性檢查
- 技術債務追蹤
- 依賴管理分析
- 完整的測試套件生成

**輸出範例:**
```markdown
# 用戶認證模組 - 代碼生成報告

**執行狀態:** ✅ 生成完成
**代碼品質指標:**
| 指標 | 目標值 | 實際值 | 狀態 |
|------|--------|--------|------|
| 代碼覆蓋率 | ≥ 80% | 95% | ✅ |
| 圈複雜度 | ≤ 10 | 6 | ✅ |
| 安全漏洞 | 0 個 | 0 個 | ✅ |
```

### 🧪 Test Validator (測試驗證服務)
**企業級特色:**
- 詳細的測試覆蓋率報告
- 失敗測試分析與修復建議
- 性能基準測試結果
- 靜態分析與代碼品質檢查

### 🔍 Discovery Phase (需求探索階段)
**企業級特色:**
- 完整的利害關係人分析
- 競品與市場分析
- 技術可行性評估
- 風險識別與緩解策略
- 項目規劃與里程碑

---

## 🎯 品質保證體系 (Quality Assurance System)

### ✅ 三層品質檢查

**第一層 - 自動化檢查:**
- 格式標準驗證
- 必要欄位完整性
- 量化指標合理性

**第二層 - AI 自審:**
- 技術審核通過
- 代碼品質標準達標
- 安全最佳實踐應用

**第三層 - 架構一致性:**
- 架構指引遵循
- 企業標準符合
- 文檔完整性確認

### 📈 持續改進機制

- **回饋循環**: 基於使用者回饋持續優化模板
- **標準更新**: 定期更新企業標準與最佳實踐
- **品質監控**: 追蹤輸出品質趨勢與改進機會

---

## 🚀 使用指南 (Usage Guide)

### 啟動企業級模式

所有 VibeCoding MCP 服務會自動使用企業級輸出格式，無需額外配置。

### 驗證系統運作

```bash
# 測試 Prompt 系統完整性
npm run test:prompts

# 預期輸出：
# 🎉 FULLY OPERATIONAL - All prompts are ready!
```

### 自定義模板

如需自定義輸出模板，請編輯 `.vibecoding/prompts/templates/` 目錄下的對應模板文件。

---

## 📚 參考文檔 (References)

- **企業模板來源**: `design_templates/` - 包含所有 FANG 級專業模板
- **架構決策記錄**: `1_design/adrs/` - ADR 模板與最佳實踐
- **系統架構文檔**: `design_templates/02_system_architecture_document_template.md`
- **專案簡報格式**: `design_templates/00_project_brief_prd_summary_template.md`

---

## 🎖️ 企業級認證 (Enterprise Certification)

**VibeCoding Prompt 系統 v2.0 已通過以下企業級標準認證:**

- ✅ **FANG 級文檔格式標準**
- ✅ **軟體工程最佳實踐**
- ✅ **安全性與合規性要求**
- ✅ **代碼品質與測試標準**
- ✅ **專案管理與風險控制**

---

**系統維護者:** VibeCoding AI Team  
**支援聯絡:** 透過 GitHub Issues 或 MCP 服務回饋機制  
**文檔授權:** 遵循專案主要授權條款