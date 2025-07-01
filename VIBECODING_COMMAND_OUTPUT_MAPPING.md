# 🎯 VibeCoding 指令完整對照表與文檔輸出路徑

## 🚀 **重要更新：VibeCoding v2.0 簡化升級**

**✅ 移除 projectId 複雜性**: 不再需要記憶或傳遞 projectId 參數
**✅ 基於工作目錄的上下文**: 專案狀態自動保存在 `.vibecoding/context/`
**✅ 更直觀的指令**: 所有 MCP 工具都已簡化

## 📋 目錄
- [簡潔指令 vs 完整指令對照表](#簡潔指令-vs-完整指令對照表)
- [文檔輸出路徑對應表](#文檔輸出路徑對應表)
- [create-enhanced-project.cjs 資料夾結構](#create-enhanced-projectcjs-資料夾結構)
- [指令與資料夾對應關係](#指令與資料夾對應關係)

---

## 🚀 簡潔指令 vs 完整指令對照表

### 📋 Context Manager (專案管理)
| 簡潔指令 | 完整指令 | 功能描述 | 輸出位置 |
|---------|---------|---------|---------|
| `@vibe start "專案名"` | `@vibecoding-context-manager start-clarification` | 開始專案澄清 | 無文檔輸出 |
| `@vibe ask "答案"` | `@vibecoding-context-manager provide-clarification` | 回答澄清問題 | 無文檔輸出 |
| `@vibe prd` | `@vibecoding-context-manager generate-prd` | 生成產品需求文檔 | `0_discovery/requirements/PRODUCT_REQUIREMENTS_DOCUMENT.md` |
| `@vibe plan` | `@vibecoding-context-manager generate-impl-plan` | 生成實施計劃 | `1_design/IMPLEMENTATION_PLAN.md` |
| `@vibe insight "問題"` | `@vibecoding-context-manager get-ai-insight` | 獲取 AI 洞察 | 無文檔輸出 |

### 💻 Code Generator (代碼生成)
| 簡潔指令 | 完整指令 | 功能描述 | 輸出位置 |
|---------|---------|---------|---------|
| `@vibe code "需求"` | `@vibecoding-code-generator generate-code` | 生成代碼 | `2_implementation/src/` |
| `@vibe api "描述"` | `@vibecoding-code-generator generate-code --codeType api` | 生成 API 代碼 | `2_implementation/src/api/` |
| `@vibe comp "描述"` | `@vibecoding-code-generator generate-code --codeType component` | 生成組件 | `2_implementation/src/components/` |
| `@vibe fix "代碼"` | `@vibecoding-code-generator refactor-code` | 重構代碼 | 直接回傳，不保存 |
| `@vibe review "代碼"` | `@vibecoding-code-generator code-review` | 代碼審查 | 直接回傳，不保存 |
| `@vibe mock "代碼"` | `@vibecoding-code-generator generate-tests` | 生成測試 | `2_implementation/tests/` |

### 🧪 Test Validator (測試驗證)
| 簡潔指令 | 完整指令 | 功能描述 | 輸出位置 |
|---------|---------|---------|---------|
| `@vibe test` | `@vibecoding-test-validator run-tests` | 執行測試 | `3_validation/test-reports/` |
| `@vibe cover` | `@vibecoding-test-validator validate-coverage` | 檢查覆蓋率 | `3_validation/quality-metrics/` |
| `@vibe report` | `@vibecoding-test-validator generate-test-report` | 生成測試報告 | `3_validation/test-reports/` |
| `@vibe perf "測試"` | `@vibecoding-test-validator performance-test` | 性能測試 | `3_validation/benchmarks/` |

### 📦 Dependency Tracker (依賴管理)
| 簡潔指令 | 完整指令 | 功能描述 | 輸出位置 |
|---------|---------|---------|---------|
| `@vibe deps` | `@vibecoding-dependency-tracker analyze-dependencies` | 分析依賴 | `3_validation/quality-metrics/dependencies.md` |
| `@vibe scan` | `@vibecoding-dependency-tracker security-scan` | 安全掃描 | `3_validation/quality-metrics/security-scan.md` |
| `@vibe update` | `@vibecoding-dependency-tracker update-dependencies` | 更新依賴 | 直接更新 package.json |
| `@vibe vuln "套件"` | `@vibecoding-dependency-tracker check-vulnerabilities` | 檢查漏洞 | 直接回傳，不保存 |

### 📚 Doc Generator (文檔生成)
| 簡潔指令 | 完整指令 | 功能描述 | 輸出位置 |
|---------|---------|---------|---------|
| `@vibe doc` | `@vibecoding-doc-generator generate-docs` | 生成文檔 | `docs/` |
| `@vibe readme` | `@vibecoding-doc-generator update-readme` | 更新 README | `README.md` |
| `@vibe api-doc` | `@vibecoding-doc-generator create-api-docs` | 生成 API 文檔 | `1_design/api-contracts/` |
| `@vibe changelog` | `@vibecoding-doc-generator generate-changelog` | 生成變更日誌 | `CHANGELOG.md` |

### 🚀 Deployment Manager (部署管理)
| 簡潔指令 | 完整指令 | 功能描述 | 輸出位置 |
|---------|---------|---------|---------|
| `@vibe deploy` | `@vibecoding-deployment-manager deploy-service` | 部署服務 | `4_deployment/environments/` |
| `@vibe monitor` | `@vibecoding-deployment-manager setup-monitoring` | 設定監控 | `4_deployment/monitoring/` |
| `@vibe alert` | `@vibecoding-deployment-manager configure-alerts` | 配置告警 | `4_deployment/monitoring/alerts.yml` |
| `@vibe rollback "版本"` | `@vibecoding-deployment-manager rollback-deployment` | 回滾部署 | 直接執行，不保存 |

---

## 📁 create-enhanced-project.cjs 資料夾結構

```
專案根目錄/
├── 0_discovery/           # 🔍 需求發現階段
│   ├── conversations/     # 對話記錄
│   ├── clarifications/    # 澄清問題與回答
│   │   └── questions_template.md
│   └── requirements/      # 需求文檔
│       └── user_stories_template.md
│
├── 1_design/             # 🎨 設計階段
│   ├── architecture/     # 系統架構
│   │   └── system_architecture.md
│   ├── api-contracts/    # API 規格
│   └── flow-diagrams/    # 流程圖
│
├── 2_implementation/     # 💻 實作階段
│   ├── src/             # 源代碼
│   ├── tests/           # 測試代碼
│   │   └── test-strategy.md
│   └── scripts/         # 建構腳本
│
├── 3_validation/         # 🧪 驗證階段
│   ├── test-reports/    # 測試報告
│   ├── quality-metrics/ # 品質指標
│   └── benchmarks/      # 性能基準
│
├── 4_deployment/         # 🚀 部署階段
│   ├── environments/    # 環境配置
│   │   └── deployment-guide.md
│   ├── ci-cd/          # CI/CD 配置
│   └── monitoring/     # 監控設定
│
├── knowledge-base/       # 📚 知識庫
│   ├── patterns/        # 設計模式
│   ├── solutions/       # 解決方案
│   ├── retrospectives/  # 回顧總結
│   └── decisions/       # 技術決策記錄
│
├── .vibecoding/         # 🤖 VibeCoding 專用文件夾
│   ├── conversations/   # AI 對話記錄
│   ├── decisions/       # 技術決策記錄 (ADR)
│   └── insights/        # AI 洞察和建議
│
├── docs/                # 📖 文檔目錄
├── config/              # 配置文件
├── README.md            # 專案說明
├── package.json         # 專案配置
└── .gitignore          # Git 忽略文件
```

---

## 🎯 指令與資料夾對應關係

### ✅ **完全對應** - 指令輸出會自動放入對應資料夾

| VibeCoding 指令 | 輸出資料夾 | 自動創建 |
|----------------|-----------|---------|
| `@vibe prd` | `0_discovery/requirements/` | ✅ |
| `@vibe plan` | `1_design/` | ✅ |
| `@vibe api-doc` | `1_design/api-contracts/` | ✅ |
| `@vibe code` | `2_implementation/src/` | ✅ |
| `@vibe mock` | `2_implementation/tests/` | ✅ |
| `@vibe test` | `3_validation/test-reports/` | ✅ |
| `@vibe cover` | `3_validation/quality-metrics/` | ✅ |
| `@vibe deps` | `3_validation/quality-metrics/` | ✅ |
| `@vibe scan` | `3_validation/quality-metrics/` | ✅ |
| `@vibe perf` | `3_validation/benchmarks/` | ✅ |
| `@vibe doc` | `docs/` | ✅ |
| `@vibe deploy` | `4_deployment/environments/` | ✅ |
| `@vibe monitor` | `4_deployment/monitoring/` | ✅ |

### ⚠️ **部分對應** - 需要手動指定或組織

| VibeCoding 指令 | 建議放置位置 | 需手動操作 |
|----------------|-------------|-----------|
| `@vibe fix` | `2_implementation/src/` | ⚠️ 需手動保存 |
| `@vibe review` | `knowledge-base/solutions/` | ⚠️ 需手動整理 |
| `@vibe rollback` | 無需保存 | ⚠️ 直接執行 |
| `@vibe insight` | `knowledge-base/patterns/` | ⚠️ 需手動記錄 |

### 📋 **專案根目錄文件**

| VibeCoding 指令 | 輸出文件 | 位置 |
|----------------|---------|------|
| `@vibe readme` | `README.md` | 專案根目錄 |
| `@vibe changelog` | `CHANGELOG.md` | 專案根目錄 |
| `@vibe update` | `package.json` | 專案根目錄 |

---

## 🎉 結論

**✅ 高度整合**：約 **85%** 的 VibeCoding 指令輸出會自動放入 `create-enhanced-project.cjs` 建立的對應資料夾中。

**🔄 工作流程完美對應**：
1. **0_discovery** ← `@vibe start`, `@vibe prd`
2. **1_design** ← `@vibe plan`, `@vibe api-doc`  
3. **2_implementation** ← `@vibe code`, `@vibe mock`
4. **3_validation** ← `@vibe test`, `@vibe cover`, `@vibe deps`, `@vibe scan`
5. **4_deployment** ← `@vibe deploy`, `@vibe monitor`

**📚 知識管理**：`knowledge-base/` 資料夾為手動整理的洞察和解決方案提供了完美的存放位置。

**🚀 開發體驗**：開發者可以專注於對話和開發，VibeCoding 會自動將產出組織到正確的專案結構中！

---

## 🆕 Enhanced Project Creator v2 更新

### ✨ 新增功能
- **🤖 .vibecoding/ 專用文件夾**：遵循 .vibecoding/prompts 指導原則
- **📋 VibeCoding 7 問澄清法**：結構化需求收集模板
- **🎯 對話驅動開發記錄**：完整的 AI 互動記錄系統
- **📝 技術決策記錄 (ADR)**：透明的決策過程追蹤
- **💡 AI 洞察管理**：智能建議的系統化整理

### 🚀 使用新版本
```bash
# 使用優化版本（推薦）
node scripts/create-enhanced-project-v2.cjs

# 原版本仍可用
node scripts/create-enhanced-project.cjs
```

### 📊 版本對比
| 功能 | v1 | v2 |
|------|----|----|
| 基礎專案結構 | ✅ | ✅ |
| 5 階段開發流程 | ✅ | ✅ |
| VibeCoding 指令支援 | ✅ | ✅ |
| .vibecoding/ 文件夾 | ❌ | ✅ |
| 7 問澄清法 | ❌ | ✅ |
| ADR 技術決策記錄 | ❌ | ✅ |
| AI 對話記錄系統 | ❌ | ✅ |
| Prompts 指導原則遵循 | 部分 | ✅ |

**建議**：新專案使用 v3 版本，現有專案可以繼續使用 v1/v2 或升級到 v3。

---

## 🌟 Enhanced Project Creator v3 最新版本

### ✨ v3 版本特色
- **🎯 完整整合**：結合 v1 的完整內容 + v2 的架構優化
- **📋 100% 對應**：所有 VibeCoding 指令輸出完全對應到正確資料夾
- **🤖 全面遵循**：完全遵循 .vibecoding/prompts 所有指導原則
- **📚 知識庫完整**：更詳細的知識管理和解決方案分類
- **🏗️ 細分結構**：更精細的資料夾組織和模板內容

### 🚀 推薦使用方式

```bash
# 1. 建立專案目錄
mkdir my-awesome-project
cd my-awesome-project

# 2. 🌟 使用 v3 增強版專案結構生成器 (推薦 - 完整整合)
node /path/to/vibeCoding-template/scripts/create-enhanced-project-v3.cjs

# 其他版本選擇：
# v2 版本 (架構優化)
node /path/to/vibeCoding-template/scripts/create-enhanced-project-v2.cjs

# v1 版本 (完整內容)
node /path/to/vibeCoding-template/scripts/create-enhanced-project.cjs

# 3. 開始 VibeCoding 開發
@vibe start "my-awesome-project"
```

### 📊 完整版本對比
| 功能 | v1 | v2 | v3 |
|------|----|----|----| 
| 基礎專案結構 | ✅ | ✅ | ✅ |
| 5 階段開發流程 | ✅ | ✅ | ✅ |
| VibeCoding 指令支援 | ✅ | ✅ | ✅ |
| .vibecoding/ 文件夾 | ❌ | ✅ | ✅ |
| 7 問澄清法 | ❌ | ✅ | ✅ |
| ADR 技術決策記錄 | ❌ | ✅ | ✅ |
| AI 對話記錄系統 | ❌ | ✅ | ✅ |
| Prompts 指導原則遵循 | 部分 | ✅ | ✅ |
| 完整模板內容 | ✅ | 部分 | ✅ |
| 詳細知識庫分類 | ✅ | 基本 | ✅ |
| 細分資料夾結構 | ✅ | 基本 | ✅ |
| 完整工作流程指南 | ✅ | 簡化 | ✅ |
| 專業級文檔模板 | ✅ | 基本 | ✅ |

### 🎯 v3 版本優勢
1. **🔄 最佳整合**：保留 v1 的完整內容，同時採用 v2 的架構優化
2. **📋 完全對應**：100% VibeCoding 指令輸出路徑對應
3. **🎯 零學習成本**：從 v1 或 v2 升級無需重新學習
4. **📚 知識完整**：包含最豐富的模板和指南內容
5. **🚀 生產就緒**：可直接用於正式專案開發

**🌟 強烈建議**：所有新專案使用 v3 版本，享受最完整的 VibeCoding 開發體驗！ 