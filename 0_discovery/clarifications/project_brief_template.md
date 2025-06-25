# 專案簡報 / PRD 摘要 (Project Brief / PRD Summary)

---

**專案名稱 (Project Name):** `[請填寫專案的正式名稱]`

**版本 (Version):** `v0.1`

**最後更新 (Last Updated):** `YYYY-MM-DD`

**負責人/團隊 (Owner/Team):** `[請填寫]`

**狀態 (Status):** `[構想中 (Ideation) | 規劃中 (Planning) | 設計中 (Design) | 開發中 (Development) | 已發布 (Live) | 已歸檔 (Archived)]`

---

## 1. 專案概述 (Project Overview)

### 1.1 一行說明 (One-Liner)
*簡潔地用一句話描述這個專案的核心價值和目標*

**範例**: `為中小企業提供AI驅動的智能客服解決方案，提升客戶滿意度並降低人工成本`

### 1.2 問題陳述 (Problem Statement)
*詳細描述專案要解決的具體問題、痛點或市場機會*

**要回答的關鍵問題**:
- 這個問題對誰造成了困擾？
- 影響有多大？
- 目前的解決方案有什麼不足？

### 1.3 建議解決方案 (Proposed Solution)
*簡要概述您提議的解決方案是什麼，它如何解決上述問題*

### 1.4 目標用戶 (Target Users / Audience)
*明確定義產品或功能的主要目標用戶群體*

- **主要用戶群體**: [描述核心用戶特徵、需求和使用場景]
- **次要用戶群體**: [描述次要用戶群體]

### 1.5 專案目標與成功指標 (Goals & Success Metrics)

#### 主要目標 (Primary Goals)
1. **目標 1**: [具體的、可衡量的業務目標]
2. **目標 2**: [具體的、可衡量的產品目標]
3. **目標 3**: [具體的、可衡量的技術目標]

#### 成功指標/KPIs (Key Performance Indicators)
| 目標 | KPI | 目標值 | 衡量方式 |
|------|-----|--------|----------|
| 目標 1 | [具體指標] | [數值目標] | [衡量方法] |
| 目標 2 | [具體指標] | [數值目標] | [衡量方法] |
| 目標 3 | [具體指標] | [數值目標] | [衡量方法] |

#### 非目標 (Non-Goals)
*明確指出此專案範圍內 **不包含** 的目標或功能*

---

## 2. 核心使用者故事 / 主要功能 (Key User Stories / Features)

| ID | User Story / Feature 標題 | 描述 (As a [角色], I want [需求], so that [價值]) | 優先級 | 狀態 |
|----|---------------------------|---------------------------------------------------|---------|------|
| US-001 | [功能標題] | [詳細描述] | P0/P1/P2 | 待辦/進行中/完成 |
| US-002 | [功能標題] | [詳細描述] | P0/P1/P2 | 待辦/進行中/完成 |
| US-003 | [功能標題] | [詳細描述] | P0/P1/P2 | 待辦/進行中/完成 |

---

## 3. 里程碑與時程規劃 (Milestones & Timeline)

| 里程碑 | 預期完成日期 | 主要交付物 / 範圍 |
|--------|-------------|-------------------|
| Alpha 版內部測試 | YYYY-MM-DD | [核心功能完成] |
| Beta 版公測 | YYYY-MM-DD | [完整功能及基本監控] |
| GA 發布 | YYYY-MM-DD | [所有功能完成並通過 PRR] |

---

## 4. 依賴關係與風險 (Dependencies & Risks)

### 主要依賴 (Key Dependencies)
- [列出專案成功所依賴的其他團隊、系統、技術或資源]

### 風險分析 (Risk Analysis)
| 風險描述 | 可能性 | 影響程度 | 緩解/應對措施 |
|----------|--------|----------|---------------|
| [具體風險] | 高/中/低 | 高/中/低 | [具體措施] |

---

## 5. VibeCoding 整合指引

### 下一步行動
- [ ] 完成此 PRD 並獲得利害關係人確認
- [ ] 進入 [1_design](../1_design/README.md) 階段
- [ ] 使用 `vibecoding chat --phase discovery` 進行需求澄清

### 模板檔案連結
- **系統架構**: 將基於此 PRD 創建 `design_templates/02_system_architecture_document_template.md`
- **詳細設計**: 將基於架構創建 `design_templates/03_system_design_document_template.md`
- **API 設計**: 將創建 `design_templates/04_api_design_specification_template.md`

---

**文件審核記錄 (Review History):**

| 日期 | 審核人 | 版本 | 備註 |
|------|--------|------|------|
| YYYY-MM-DD | [姓名/團隊] | v0.1 | 初稿審核 |

---
*本模板基於 VibeCoding design_templates 優化，確保與後續階段無縫銜接* 