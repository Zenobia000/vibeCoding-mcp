# 開發指引 (Development Guideline)

---

## 1. 核心原則

本文件旨在提供一套清晰、一致的開發規範，以確保程式碼品質、提升協作效率並降低維護成本。所有參與本專案的開發人員，無論資歷深淺，都必須熟悉並遵循本指引。

本指引分為兩大部分：
*   **通用工程實踐**: 適用於所有專案的基礎規範，如版本控制和 Code Review。
*   **專案特定指南**: 針對本專案技術棧（在 SA 階段後確定）的具體編碼標準。

---

## 2. 通用工程實踐 (Foundational Practices)

### 2.1 版本控制 (Version Control) - GitFlow

我們採用 GitFlow 作為核心分支管理模型。

*   **`main`**: 主分支，用於存放穩定、可隨時發布的產品級程式碼。**禁止直接 commit 到此分支**。只能從 `release` 或 `hotfix` 分支合併。
*   **`develop`**: 開發分支，整合所有已完成的功能，是下一個發布版本的基礎。此分支應保持相對穩定。
*   **`feature/[feature-name]`**: 功能分支，所有新功能開發都必須從 `develop` 分支出來。
    *   命名規則: `feature/US-123-user-authentication`
    *   完成後合併回 `develop` 分支，並刪除此功能分支。
*   **`release/[version-number]`**: 發布分支，當 `develop` 分支的功能足夠多時，從 `develop` 創建。此分支專門用於發布前的最後測試、Bug 修復和文檔更新。
    *   完成後，必須同時合併回 `main` 和 `develop` 分支。
*   **`hotfix/[fix-name]`**: 熱修復分支，用於緊急修復 `main` 分支上的 Bug。
    *   從 `main` 分支出來，完成後必須同時合併回 `main` 和 `develop` 分支。

### 2.2 Commit 訊息規範 (Commit Message Convention)

我們遵循 **Conventional Commits** 規範。這有助於自動生成變更日誌 (Changelog) 並保持歷史清晰。

格式: `<type>(<scope>): <subject>`

*   **`type`**:
    *   `feat`: 新增功能 (feature)。
    *   `fix`: 修復 Bug。
    *   `docs`: 只修改了文件 (documentation)。
    *   `style`: 不影響程式碼邏輯的修改 (空格、格式化、缺少分號等)。
    *   `refactor`: 重構程式碼，既不是新增功能也不是修復 Bug。
    *   `perf`: 提升效能的修改。
    *   `test`: 新增或修改測試。
    *   `ci`: 修改 CI/CD 流程或腳本。
    *   `chore`: 其他不修改 `src` 或 `tests` 的變更 (例如：更新依賴)。
*   **`scope` (選填)**: 描述此次 commit 影響的範圍 (例如: `api`, `db`, `auth`)。
*   **`subject`**: 簡潔地描述此次變更的內容。

**範例:**
```
feat(auth): add JWT-based user authentication
fix(api): correct pagination logic for user list endpoint
docs(readme): update setup instructions
```

### 2.3 程式碼審查 (Code Review)

Code Review 是保證品質和知識傳遞的關鍵環節。

*   **提交者 (Author) 的責任**:
    1.  在提交 Review 前，確保程式碼已通過所有本地測試和 Linter 檢查。
    2.  Pull Request (PR) 的描述應清晰，說明**為什麼**要這樣改，**解決了什麼問題**，以及**如何驗證**。
    3.  指定至少一位相關的審查者。對於核心改動，應指定資深工程師。
    4.  建設性地回應評論，並在完成修改後重新請求審查。
    5.  最終由 Author 自行合併 PR (在獲得批准後)。

*   **審查者 (Reviewer) 的責任**:
    1.  及時進行審查。如果短期內無法審查，應告知 Author。
    2.  審查目標：設計是否合理、程式碼是否清晰可讀、是否符合開發規範、是否存在潛在 Bug、測試是否充分。
    3.  提供**建設性**、**具體**且**友善**的評論。提問多於命令。
        *   (Good) "這裡用 `map` 會不會比 `for` 迴圈更簡潔？"
        *   (Bad) "你這裡寫錯了，改掉。"
    4.  當 PR 符合標準時，明確給予批准 (Approve)。

---

## 3. 專案特定指南 (Project-Specific Guidelines)

**[注意：此章節應在系統架構 (SA) 設計階段完成後，由技術負責人 (Tech Lead) 根據確定的技術棧進行填充。]**

### 3.1 語言與框架 (Language & Framework)
*   **主要語言**: `[例如：Python 3.11+]`
*   **主要框架**: `[例如：FastAPI]`
*   **程式碼風格**:
    *   格式化工具: `[例如：Black]`
    *   Import 排序: `[例如：isort]`
*   **Linter 配置**: `[附上 .pylintrc 或 flake8 配置的關鍵規則]`

### 3.2 命名約定 (Naming Conventions)
*   **API Endpoints**: `[例如：使用複數名詞，kebab-case，例如 /api/v1/user-profiles]`
*   **資料庫 Tables**: `[例如：使用複數名詞，snake_case，例如 user_profiles]`
*   **變數/函數**: `[遵循語言的官方風格指南，例如 Python 的 PEP-8]`

### 3.3 測試策略 (Testing Strategy)
*   **單元測試覆蓋率**: `[例如：核心業務邏輯模組 > 90%]`
*   **測試框架**: `[例如：pytest]`

### 3.4 Dockerfile 最佳實踐
*   `[例如：使用多階段構建 (multi-stage builds) 來減小最終鏡像大小]`
*   `[例如：使用非 root 用戶運行應用]`





