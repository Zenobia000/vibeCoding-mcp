# ADR-{{ adr_number }}: {{ adr_title }}

> 基於 VibeCoding design_templates/01_adr_template.md 優化的架構決策記錄

**狀態 (Status):** `[建議中 (Proposed) | 已接受 (Accepted) | 已棄用 (Deprecated) | 已取代 (Superseded)]`

**決策日期 (Decision Date):** `{{ decision_date }}`

**決策者 (Deciders):** `{{ decision_makers }}`

**相關利害關係人 (Stakeholders):** `{{ stakeholders }}`

**相關技術/組件 (Related Components):** `{{ related_components }}`

---

## 摘要 (Summary)

*簡短描述所做的決策及其核心影響*

{{ decision_summary }}

---

## 背景 (Context)

### 問題陳述 (Problem Statement)
{{ problem_description }}

### 目前現況 (Current State)
{{ current_state_description }}

### 驅動因素 (Driving Forces)
- **業務需求**: {{ business_requirements }}
- **技術制約**: {{ technical_constraints }}
- **資源限制**: {{ resource_constraints }}
- **時程壓力**: {{ timeline_pressure }}

---

## 決策 (Decision)

### 選擇的方案 (Chosen Solution)
{{ chosen_solution_description }}

### 核心理由 (Key Rationale)
1. **{{ reason_1_category }}**: {{ reason_1_detail }}
2. **{{ reason_2_category }}**: {{ reason_2_detail }}
3. **{{ reason_3_category }}**: {{ reason_3_detail }}

---

## 考慮的替代方案 (Alternatives Considered)

### 方案 A: {{ alternative_1_name }}
- **優點**: {{ alternative_1_pros }}
- **缺點**: {{ alternative_1_cons }}
- **為何未選擇**: {{ alternative_1_rejection_reason }}

### 方案 B: {{ alternative_2_name }}
- **優點**: {{ alternative_2_pros }}
- **缺點**: {{ alternative_2_cons }}
- **為何未選擇**: {{ alternative_2_rejection_reason }}

### 方案 C: 不採取行動 (Do Nothing)
- **影響**: {{ do_nothing_impact }}
- **風險**: {{ do_nothing_risks }}

---

## 影響分析 (Impact Analysis)

### 正面影響 (Positive Consequences)
- **技術影響**: {{ positive_technical_impact }}
- **業務影響**: {{ positive_business_impact }}
- **團隊影響**: {{ positive_team_impact }}

### 負面影響/權衡 (Negative Consequences/Trade-offs)
- **技術債務**: {{ technical_debt_impact }}
- **複雜度增加**: {{ complexity_impact }}
- **資源消耗**: {{ resource_impact }}

### 中性影響 (Neutral Consequences)
- {{ neutral_consequence_1 }}
- {{ neutral_consequence_2 }}

---

## 實施計畫 (Implementation Plan)

### 短期行動 (Immediate Actions)
- [ ] {{ immediate_action_1 }}
- [ ] {{ immediate_action_2 }}
- [ ] {{ immediate_action_3 }}

### 中期目標 (Medium-term Goals)
- [ ] {{ medium_term_goal_1 }}
- [ ] {{ medium_term_goal_2 }}

### 長期考量 (Long-term Considerations)
- {{ long_term_consideration_1 }}
- {{ long_term_consideration_2 }}

---

## 風險與緩解策略 (Risks and Mitigation)

| 風險描述 | 可能性 | 影響程度 | 緩解策略 | 負責人 |
|----------|--------|----------|----------|--------|
| {{ risk_1 }} | 高/中/低 | 高/中/低 | {{ mitigation_1 }} | {{ owner_1 }} |
| {{ risk_2 }} | 高/中/低 | 高/中/低 | {{ mitigation_2 }} | {{ owner_2 }} |

---

## 成功指標 (Success Metrics)

### 技術指標 (Technical Metrics)
- **{{ technical_metric_1 }}**: 目標值 {{ target_value_1 }}
- **{{ technical_metric_2 }}**: 目標值 {{ target_value_2 }}

### 業務指標 (Business Metrics)
- **{{ business_metric_1 }}**: 目標值 {{ target_value_3 }}
- **{{ business_metric_2 }}**: 目標值 {{ target_value_4 }}

### 檢查點時程 (Review Timeline)
- **首次檢視**: {{ first_review_date }}
- **定期檢視**: {{ regular_review_frequency }}
- **重大檢視**: {{ major_review_trigger }}

---

## 相關決策 (Related Decisions)

### 先決條件 ADRs (Prerequisite ADRs)
- [ADR-{{ prerequisite_adr_1 }}](./adr-{{ prerequisite_adr_1 }}.md): {{ prerequisite_title_1 }}

### 相關 ADRs (Related ADRs)
- [ADR-{{ related_adr_1 }}](./adr-{{ related_adr_1 }}.md): {{ related_title_1 }}

### 影響的 ADRs (Impacted ADRs)
- [ADR-{{ impacted_adr_1 }}](./adr-{{ impacted_adr_1 }}.md): {{ impact_description_1 }}

---

## 學習與回顧 (Lessons Learned)

*此區塊在決策實施後填寫*

### 實際結果 vs 預期 (Actual vs Expected Outcomes)
{{ actual_vs_expected }}

### 意外發現 (Unexpected Learnings)
{{ unexpected_learnings }}

### 改進建議 (Improvement Suggestions)
{{ improvement_suggestions }}

---

**決策歷史 (Decision History):**

| 日期 | 狀態變更 | 變更原因 | 變更者 |
|------|----------|----------|--------|
| {{ date_1 }} | Proposed | 初始提案 | {{ proposer }} |
| {{ date_2 }} | Accepted | {{ acceptance_reason }} | {{ accepter }} |

---

**下一步行動**:
- [ ] 更新相關的架構文檔
- [ ] 通知相關利害關係人
- [ ] 開始實施計畫
- [ ] 安排首次檢視

---
*此 ADR 將自動整合到系統架構文檔和後續實施計畫中* 