# 安全與隱私審查清單 (Security and Privacy Review Checklist) - [專案/功能名稱]

---

**審查對象 (Review Target):** `[專案名稱] v[版本] / [功能名稱]`

**審查日期 (Review Date):** `YYYY-MM-DD`

**審查人員 (Reviewers):** `[安全團隊成員、隱私顧問、架構師、相關開發負責人]`

**相關設計文檔 (Related Design Documents):**
*   SA 文檔: `[連結]`
*   SD 文檔: `[連結]`
*   API 設計規範: `[連結]`
*   數據模型: `[連結]`

**上次審查日期 (Previous Review Date - 若適用):** `YYYY-MM-DD`

---

## A. 總體原則 (Overall Principles)

*   `[ ]` **最小權限原則 (Principle of Least Privilege):** 系統組件和用戶是否僅被授予執行其預期功能所需的最小權限？
*   `[ ]` **縱深防禦 (Defense in Depth):** 是否有多層安全控制來保護系統和數據？單點安全機制的失效是否會導致嚴重後果？
*   `[ ]` **預設安全 (Secure by Default):** 系統的預設配置是否是安全的？是否需要用戶進行額外配置才能達到安全狀態？
*   `[ ]` **安全設計是持續的過程 (Security is a Continuous Process):** 是否有計劃定期重新評估和更新安全措施？
*   `[ ]` **職責分離 (Separation of Duties):** 關鍵操作是否需要多方參與或批准？

## B. 數據生命週期安全與隱私 (Data Lifecycle Security and Privacy)

### B.1 數據收集 (Data Collection)
*   `[ ]` **數據最小化 (Data Minimization):** 是否只收集業務功能絕對必要的數據？
*   `[ ]` **目的限制 (Purpose Limitation):** 收集的數據是否僅用於明確告知用戶的特定目的？
*   `[ ]` **用戶同意/告知 (User Consent/Notification):** 在收集個人身份信息 (PII) 或敏感數據前，是否已獲得用戶的明確同意或已充分告知？
*   `[ ]` **數據分類 (Data Classification):** 系統處理的所有數據是否已根據其敏感性進行分類 (例如：公開、內部、機密、高度機密、PII)？

### B.2 數據傳輸 (Data in Transit)
*   `[ ]` **傳輸加密 (Encryption in Transit):** 所有外部網路通訊 (例如：用戶到伺服器、服務到服務間的公開網路通訊) 是否都使用強加密協議 (例如：TLS 1.2+, HTTPS)？
*   `[ ]` **內部傳輸加密 (Internal Encryption - 若適用):** 內部網路敏感數據的傳輸是否也考慮加密？
*   `[ ]` **證書管理 (Certificate Management):** TLS/SSL 證書是否有效、來自受信任的 CA，並有適當的更新和輪換機制？

### B.3 數據儲存 (Data at Rest)
*   `[ ]` **儲存加密 (Encryption at Rest):** 儲存的敏感數據 (特別是 PII、財務信息、密碼等) 是否使用強加密演算法 (例如：AES-256) 進行加密？
*   `[ ]` **金鑰管理 (Key Management):** 加密金鑰是否安全地生成、儲存、分發和輪換 (例如：使用 KMS, HSM)？金鑰本身是否受到嚴格的訪問控制？
*   `[ ]` **數據備份與恢復安全:** 備份數據是否也受到與原始數據同等級別的加密和訪問控制保護？恢復過程是否安全？

### B.4 數據使用與處理 (Data Usage and Processing)
*   `[ ]` **訪問控制 (Access Control):** 對敏感數據的訪問是否有嚴格的、基於角色的訪問控制 (RBAC)？
*   `[ ]` **PII 處理:** PII 數據的處理是否符合相關法規 (如 GDPR, CCPA) 的要求？是否有去標識化 (De-identification) 或匿名化 (Anonymization) 的措施？
*   `[ ]` **日誌記錄中的敏感資訊:** 系統日誌是否避免記錄不必要的敏感資訊 (如密碼、完整信用卡號、PII)？若必須記錄，是否已脫敏？
*   `[ ]` **第三方共享:** 如果與第三方共享數據，是否有適當的數據共享協議和安全評估？

### B.5 數據保留與銷毀 (Data Retention and Disposal)
*   `[ ]` **保留策略 (Retention Policy):** 是否為不同類型的數據定義了明確的保留期限？
*   `[ ]` **安全銷毀 (Secure Disposal):** 過期或不再需要的數據是否被安全地、不可恢復地銷毀？

## C. 應用程式安全 (Application Security)

### C.1 身份驗證 (Authentication)
*   `[ ]` **強度:** 密碼策略是否強制足夠的複雜度？是否提供多因子認證 (MFA) 選項？
*   `[ ]` **憑證儲存:** 用戶密碼是否使用安全的哈希演算法 (例如：Argon2, scrypt, bcrypt) 加鹽儲存？嚴禁明文儲存。
*   `[ ]` **會話管理 (Session Management):** 會話 Token 是否安全生成、傳輸 (HTTPS Only, HttpOnly, Secure flag for cookies) 和管理 (例如：超時、註銷時失效)？
*   `[ ]` **暴力破解防護:** 是否有機制防止對登錄接口的暴力破解嘗試 (例如：帳戶鎖定、驗證碼、速率限制)？

### C.2 授權與訪問控制 (Authorization and Access Control)
*   `[ ]` **權限檢查:** 每個敏感操作或資源訪問前是否都執行了明確的權限檢查？
*   `[ ]` **防止權限提升:** 是否有措施防止橫向或縱向的權限提升攻擊？
*   `[ ]` **物件級別授權 (Object-Level Authorization):** 除了功能級別授權，是否對特定數據對象的訪問也進行了權限控制 (例如，用戶只能修改自己的資料)？

### C.3 輸入驗證與輸出編碼 (Input Validation and Output Encoding)
*   `[ ]` **輸入驗證:** 所有來自不可信來源 (用戶輸入、第三方 API 回應等) 的數據是否都經過了嚴格的驗證 (型別、格式、長度、範圍、白名單/黑名單)？
*   `[ ]` **防止注入攻擊:** 是否有效防禦了常見的注入攻擊，如 SQL Injection, NoSQL Injection, OS Command Injection, LDAP Injection, XPath Injection？ (首選參數化查詢、ORM、安全的 API)
*   `[ ]` **防止跨站腳本 (XSS):** 所有輸出到用戶界面的數據是否都進行了上下文感知的編碼 (例如：HTML Encode, JavaScript Encode, URL Encode)？是否使用了 Content Security Policy (CSP)？
*   `[ ]` **防止跨站請求偽造 (CSRF):** 對於會改變狀態的請求，是否使用了 CSRF Token 或其他有效的防護機制？

### C.4 API 安全 (API Security - 參考 API 設計規範)
*   `[ ]` API 端點是否都經過了身份驗證和授權？
*   `[ ]` 是否對 API 請求進行了速率限制以防止濫用？
*   `[ ]` 是否避免了敏感資訊在 URL 中洩漏？
*   `[ ]` 是否遵循了 OWASP API Security Top 10 的建議？

### C.5 安全配置 (Secure Configuration)
*   `[ ]` 是否移除了所有不必要的特性、組件、預設帳戶和密碼？
*   `[ ]` 錯誤訊息是否避免洩露過多系統內部細節？
*   `[ ]` HTTP 安全 Headers (例如：Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, CSP) 是否已正確配置？

### C.6 依賴庫安全 (Dependency Security)
*   `[ ]` 是否定期掃描專案使用的第三方函式庫和依賴項是否存在已知的安全漏洞 (例如：使用 `pip-audit`, `npm audit`, Snyk, Dependabot)？
*   `[ ]` 是否有流程及時更新存在漏洞的依賴庫？

## D. 基礎設施與運維安全 (Infrastructure and Operations Security)

### D.1 網路安全 (Network Security)
*   `[ ]` **防火牆/安全組:** 網路訪問是否通過防火牆或安全組進行了嚴格控制，遵循最小開放原則？
*   `[ ]` **端口管理:** 是否僅開放了服務所必需的端口？
*   `[ ]` **DDoS 防護:** 是否有 DDoS 緩解措施 (特別是對於公開服務)？

### D.2 伺服器/主機安全 (Server/Host Security)
*   `[ ]` **作業系統強化:** 作業系統是否經過了安全強化？是否及時安裝安全補丁？
*   `[ ]` **惡意軟體防護:** 是否部署了反惡意軟體解決方案？

### D.3 日誌與監控 (Logging and Monitoring)
*   `[ ]` **安全事件日誌:** 是否記錄了足夠的安全相關事件 (例如：登錄嘗試、權限變更、重要操作、檢測到的攻擊)？
*   `[ ]` **日誌保護與審計:** 日誌是否受到保護以防篡改？是否定期審計日誌？
*   `[ ]` **入侵檢測/防禦系統 (IDS/IPS - 若適用):** 是否部署了 IDS/IPS？
*   `[ ]` **安全告警:** 是否針對可疑活動和安全事件配置了實時告警？

### D.4 機密管理 (Secrets Management)
*   `[ ]` API Keys, 資料庫密碼, 證書私鑰等機密信息是否使用專用的機密管理系統 (例如：HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) 進行安全儲存和分發？嚴禁硬編碼或存儲在版本控制中。

### D.5 Docker/容器安全 (若適用 - 參考 security-guard.mdc 中的 Dockerfile 部分)
*   `[ ]` 基礎鏡像是否來自受信任的來源並定期更新？是否使用最小化的基礎鏡像？
*   `[ ]` Dockerfile 中是否避免了不必要的權限提升 (例如：以 root 用戶運行容器)？
*   `[ ]` 是否對容器鏡像進行了漏洞掃描？
*   `[ ]` 容器運行時的安全性 (例如：AppArmor, Seccomp, Capabilities) 是否得到考慮？

## E. 合規性 (Compliance)

*   `[ ]` **相關法規識別:** 是否已識別專案需要遵循的所有相關法律法規和行業標準 (例如：GDPR, CCPA, HIPAA, PCI-DSS, ISO 27001)？
*   `[ ]` **合規性措施:** 是否已將合規性要求落實到設計和實現中？是否有證據證明符合性 (例如：數據保護影響評估 DPIA)？

## F. 安全測試與演練 (Security Testing and Drills)

*   `[ ]` **安全程式碼審查 (Secure Code Review):** 是否定期進行安全導向的程式碼審查？
*   `[ ]` **滲透測試 (Penetration Testing - 若適用):** 是否計劃或已執行滲透測試？
*   `[ ]` **漏洞掃描 (Vulnerability Scanning):** 是否定期進行自動化的漏洞掃描？
*   `[ ]` **事件應變計畫 (Incident Response Plan):** 是否有明確的安全事件應變計畫和演練？

---

## 審查結論與建議 (Review Conclusion and Recommendations)

*   **主要發現 (Key Findings):**
    *   `[列出審查過程中發現的主要安全風險或隱私問題。]`
*   **風險評級 (Risk Rating - 對每個主要發現):** `[例如：高/中/低]`
*   **建議的補救措施 (Recommended Remediation Actions):**
    *   `[針對每個發現，提出具體的修復建議和優先級。]`
*   **整體評估 (Overall Assessment):** `[對專案/功能的整體安全與隱私態勢給出評價。]`
*   **後續追蹤事項 (Follow-up Actions):**
    *   `[列出需要進一步追蹤的行動項、負責人和預期完成日期。]`

---
**簽署 (Signatures):**

*   **安全審查團隊代表:** _______________ 日期: _______________
*   **專案/功能負責人:** _______________ 日期: _______________ 