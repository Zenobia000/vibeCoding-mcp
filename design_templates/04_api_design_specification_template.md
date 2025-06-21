# API 設計規範 (API Design Specification) - [API 名稱/服務名稱]

---

**文件版本 (Document Version):** `v1.0.0`

**最後更新 (Last Updated):** `YYYY-MM-DD`

**主要作者/設計師 (Lead Author/Designer):** `[請填寫]`

**審核者 (Reviewers):** `[API 設計委員會、架構團隊、相關開發團隊等]`

**狀態 (Status):** `[例如：草稿 (Draft), 審核中 (In Review), 已批准 (Approved), 已發布 (Published), 已棄用 (Deprecated)]`

**相關 SD 文檔:** `[連結到對應的 03_system_design_document_template.md 或實際的 SD 文檔]`

**OpenAPI/Swagger 定義文件:** `[連結到 OpenAPI/Swagger (YAML/JSON) 文件的路徑或 URL (若有)]`

---

## 目錄 (Table of Contents)

1.  [引言 (Introduction)](#1-引言-introduction)
    1.1. [目的 (Purpose)](#11-目的-purpose)
    1.2. [目標讀者 (Target Audience)](#12-目標讀者-target-audience)
    1.3. [API 風格與原則 (API Style and Principles)](#13-api-風格與原則-api-style-and-principles)
2.  [通用設計約定 (General Design Conventions)](#2-通用設計約定-general-design-conventions)
    2.1. [基本 URL (Base URL)](#21-基本-url-base-url)
    2.2. [版本控制 (Versioning)](#22-版本控制-versioning)
    2.3. [請求格式 (Request Formats)](#23-請求格式-request-formats)
    2.4. [回應格式 (Response Formats)](#24-回應格式-response-formats)
    2.5. [日期與時間格式 (Date and Time Formats)](#25-日期與時間格式-date-and-time-formats)
    2.6. [命名約定 (Naming Conventions)](#26-命名約定-naming-conventions)
    2.7. [分頁 (Pagination)](#27-分頁-pagination)
    2.8. [排序 (Sorting)](#28-排序-sorting)
    2.9. [過濾 (Filtering)](#29-過濾-filtering)
    2.10. [部分回應與欄位選擇 (Partial Responses and Field Selection - 選填)](#210-部分回應與欄位選擇-partial-responses-and-field-selection---選填)
3.  [認證與授權 (Authentication and Authorization)](#3-認證與授權-authentication-and-authorization)
    3.1. [認證機制 (Authentication Mechanism)](#31-認證機制-authentication-mechanism)
    3.2. [授權模型/範圍 (Authorization Model/Scopes)](#32-授權模型範圍-authorization-modelscopes)
4.  [錯誤處理 (Error Handling)](#4-錯誤處理-error-handling)
    4.1. [標準錯誤回應格式 (Standard Error Response Format)](#41-標準錯誤回應格式-standard-error-response-format)
    4.2. [通用 HTTP 狀態碼使用 (Common HTTP Status Codes)](#42-通用-http-狀態碼使用-common-http-status-codes)
5.  [速率限制與配額 (Rate Limiting and Quotas)](#5-速率限制與配額-rate-limiting-and-quotas)
6.  [API 端點詳述 (API Endpoint Definitions)](#6-api-端點詳述-api-endpoint-definitions)
    *   `[對每個資源 (Resource) 和其下的端點 (Endpoint) 進行詳細描述]`
7.  [資料模型/Schema 定義 (Data Models / Schema Definitions)](#7-資料模型schema-定義-data-models--schema-definitions)
8.  [安全性考量 (Security Considerations)](#8-安全性考量-security-considerations)
9.  [向後兼容性與棄用策略 (Backward Compatibility and Deprecation Policy)](#9-向後兼容性與棄用策略-backward-compatibility-and-deprecation-policy)
10. [附錄 (Appendices - 選填)](#10-附錄-appendices---選填)
    10.1. [請求/回應範例 (Request/Response Examples)](#101-請求回應範例-requestresponse-examples)

---

## 1. 引言 (Introduction)

### 1.1 目的 (Purpose)
*   `[清晰說明本 API 設計規範的目的，例如：為 [API 名稱/服務名稱] 的消費者和實現者提供一個統一、明確的接口契約。]`

### 1.2 目標讀者 (Target Audience)
*   `[API 消費者 (前端開發者、其他後端服務開發者)、API 實現者、測試工程師、技術文件撰寫者等。]`

### 1.3 API 風格與原則 (API Style and Principles)
*   `[描述 API 設計遵循的主要風格，例如：RESTful (並指明遵循的成熟度級別), GraphQL, gRPC。]`
*   `[列出 API 設計的核心原則，例如：資源導向、無狀態、冪等性、易用性、一致性、安全性等。]`
    *   *例如：所有端點應盡可能使用 HTTPS。*
    *   *例如：資源 URI 應使用名詞複數形式。*
    *   *例如：對於會修改資源的操作，應使用恰當的 HTTP 動詞 (POST, PUT, DELETE, PATCH)。*

---

## 2. 通用設計約定 (General Design Conventions)

### 2.1 基本 URL (Base URL)
*   **生產環境 (Production):** `https://api.example.com/v1`
*   **預備環境 (Staging):** `https://staging-api.example.com/v1`
*   **開發環境 (Development):** `http://localhost:8000/v1` (或根據實際情況)

### 2.2 版本控制 (Versioning)
*   **策略:** `[描述 API 版本控制策略，例如：URL 路徑版本控制 (e.g., /v1/, /v2/)，Header 版本控制 (e.g., Accept header)，或查詢參數版本控制。推薦 URL 路徑版本控制。]`
*   **當前版本:** `v1`

### 2.3 請求格式 (Request Formats)
*   **主要格式:** `application/json` (UTF-8 編碼)
*   **(選填) 其他支持格式:** `[例如：application/xml, multipart/form-data (用於文件上傳)]`
*   **Content-Type Header:** 客戶端發送請求時，若有請求體，應包含 `Content-Type` header。

### 2.4 回應格式 (Response Formats)
*   **主要格式:** `application/json` (UTF-8 編碼)
*   **Accept Header:** 客戶端可使用 `Accept` header 指定期望的回應格式 (若支持多種格式)。
*   **通用回應結構 (選填，但建議):**
    ```json
    // 成功回應範例
    {
      "data": { /* 實際數據對象或列表 */ },
      "meta": { /* 元數據，如分頁信息 */ }
    }
    // 錯誤回應範例見錯誤處理章節
    ```

### 2.5 日期與時間格式 (Date and Time Formats)
*   **標準格式:** `[推薦使用 ISO 8601 格式，例如：YYYY-MM-DDTHH:mm:ss.sssZ (UTC 時間)]`
*   **時區處理:** `[所有 API 交換的時間數據是否都應為 UTC？或明確指定時區？]`

### 2.6 命名約定 (Naming Conventions)
*   **資源路徑 (Resource Paths):** `[例如：小寫，多個單詞用連字符 (-) 或下劃線 (_) 連接，名詞複數形式 (e.g., /users, /user-profiles)]`
*   **查詢參數 (Query Parameters):** `[例如：snake_case (e.g., page_size, sort_by) 或 camelCase (e.g., pageSize, sortBy)]` (團隊應統一)
*   **JSON 欄位 (JSON Fields):** `[例如：snake_case 或 camelCase]` (團隊應統一，並與查詢參數風格協調)
*   **HTTP Headers (自定義):** `[例如：X-Custom-Header]`

### 2.7 分頁 (Pagination)
*   **策略:** `[描述分頁策略，例如：基於游標 (Cursor-based) 或基於偏移量/限制 (Offset/Limit-based)。推薦基於游標的分頁以獲得更穩定的性能。]`
*   **查詢參數 (若為 Offset/Limit):**
    *   `offset` (或 `page`): `[預設值，例如 0 或 1]`
    *   `limit` (或 `page_size`): `[預設值和最大值，例如預設 20，最大 100]`
*   **回應中的分頁信息 (若適用):**
    ```json
    "meta": {
      "pagination": {
        "total_items": 120,
        "total_pages": 6,
        "current_page": 1,
        "per_page": 20,
        "next_url": "/items?page=2&page_size=20", // 或 next_cursor
        "prev_url": null // 或 prev_cursor
      }
    }
    ```

### 2.8 排序 (Sorting)
*   **查詢參數:** `sort_by` (或 `sort`)
*   **格式:** `[例如：sort_by=field_name (升序預設), sort_by=-field_name (降序), 或 sort_by=field1:asc,field2:desc]`
*   **可排序欄位:** `[明確列出哪些欄位支持排序。]`

### 2.9 過濾 (Filtering)
*   **策略:** `[描述如何對資源集合進行過濾。]`
*   **查詢參數:** `[例如：直接使用欄位名作為參數 (e.g., /users?status=active&role=admin)，或使用特定的過濾語法 (e.g., /items?filter[price_gt]=100&filter[category_in]=electronics,books)]`
*   **可過濾欄位:** `[明確列出哪些欄位支持過濾以及支持的操作符 (等於、大於、小於、包含等)。]`

### 2.10 部分回應與欄位選擇 (Partial Responses and Field Selection - 選填)
*   **查詢參數:** `fields`
*   **格式:** `[例如：fields=id,name,email (逗號分隔的欄位列表)]`
*   **目的:** 允許客戶端只請求其需要的欄位，以減少網路傳輸和處理負載。

---

## 3. 認證與授權 (Authentication and Authorization)

### 3.1 認證機制 (Authentication Mechanism)
*   `[描述 API 使用的認證方式。]`
    *   **例如：OAuth 2.0 (Bearer Token):** 客戶端需在 `Authorization` header 中提供 `Bearer <access_token>`。
    *   **例如：API Key:** 客戶端需在特定 header (e.g., `X-API-Key`) 或查詢參數中提供 API Key。
    *   `[說明 Token/Key 的獲取方式、有效期、刷新機制等。]`

### 3.2 授權模型/範圍 (Authorization Model/Scopes)
*   `[描述 API 的授權邏輯。]`
    *   **基於角色的訪問控制 (RBAC - Role-Based Access Control):** `[用戶角色及其對應的 API 權限。]`
    *   **OAuth 2.0 範圍 (Scopes):** `[定義不同的 scope 及其代表的權限，例如：read:users, write:orders。]`
    *   `[說明當授權失敗時 (例如，用戶無權限訪問某資源)，API 如何回應 (通常是 403 Forbidden)。]`

---

## 4. 錯誤處理 (Error Handling)

### 4.1 標準錯誤回應格式 (Standard Error Response Format)
*   `[定義一個全局一致的錯誤回應 JSON 結構。]`
    ```json
    {
      "error": {
        "code": "[UNIQUE_ERROR_CODE]", // 應用程式特定的錯誤碼 (可選，但有助於客戶端處理)
        "message": "[對用戶友好的錯誤描述]",
        "developer_message": "[對開發者更詳細的錯誤信息或調試線索 (選填，僅在開發/測試環境顯示)]",
        "target": "[錯誤發生的欄位或資源 (選填)]",
        "details": [
          {
            "code": "[VALIDATION_ERROR_CODE]",
            "target": "[具體欄位]",
            "message": "[欄位驗證錯誤信息]"
          }
          // ... (更多詳細錯誤，例如批量操作中的部分失敗)
        ],
        "help_url": "[指向相關文檔或幫助頁面的URL (選填)]"
      }
    }
    ```

### 4.2 通用 HTTP 狀態碼使用 (Common HTTP Status Codes)
*   **2xx - 成功 (Success):**
    *   `200 OK`: 請求成功。適用於 GET, PUT, PATCH (部分更新)。
    *   `201 Created`: 資源創建成功。適用於 POST。回應中應包含新創建資源的 URI (`Location` header) 和/或資源本身。
    *   `202 Accepted`: 請求已被接受處理，但處理尚未完成 (異步操作)。
    *   `204 No Content`: 請求成功，但回應體中沒有內容。適用於 DELETE 或內容為空的 PUT/POST。
*   **4xx - 客戶端錯誤 (Client Errors):**
    *   `400 Bad Request`: 請求無效 (例如，格式錯誤、缺少必要參數、參數值無效)。錯誤回應體應包含詳細信息。
    *   `401 Unauthorized`: 未認證或認證失敗。客戶端應提供有效的憑證。
    *   `403 Forbidden`: 已認證，但客戶端無權限訪問該資源或執行該操作。
    *   `404 Not Found`: 請求的資源不存在。
    *   `405 Method Not Allowed`: 請求的 HTTP 方法不被該資源支持。
    *   `409 Conflict`: 請求衝突，通常由於資源的當前狀態與請求期望的狀態不一致 (例如，嘗試創建已存在的唯一資源)。
    *   `415 Unsupported Media Type`: 請求體的媒體類型不被支持。
    *   `422 Unprocessable Entity`: 請求格式正確，但語義上無法處理 (例如，業務邏輯驗證失敗)。
    *   `429 Too Many Requests`: 客戶端在給定時間內發送的請求過多 (速率限制)。
*   **5xx - 伺服器錯誤 (Server Errors):**
    *   `500 Internal Server Error`: 伺服器內部發生未知錯誤。錯誤回應體不應暴露敏感信息。
    *   `502 Bad Gateway`: 作為閘道或代理的伺服器從上游伺服器收到了無效的回應。
    *   `503 Service Unavailable`: 伺服器暫時無法處理請求 (例如，過載或維護中)。通常應包含 `Retry-After` header。
    *   `504 Gateway Timeout`: 作為閘道或代理的伺服器未能及時從上游伺服器獲得回應。

---

## 5. 速率限制與配額 (Rate Limiting and Quotas)
*   **策略:** `[描述是否對 API 請求進行速率限制或設置配額。]`
*   **限制標準:** `[例如：基於 IP 地址、用戶 ID、API Key。]`
*   **限制閾值:** `[例如：每分鐘 X 次請求，每天 Y 次請求。]`
*   **超出限制時的回應:** `[通常是 HTTP 429 Too Many Requests。]`
*   **相關 Headers (推薦):**
    *   `X-RateLimit-Limit`: 當前時間窗口內的總請求數限制。
    *   `X-RateLimit-Remaining`: 當前時間窗口內剩餘的請求數。
    *   `X-RateLimit-Reset`: 當前時間窗口重置的 Unix 時間戳或秒數。
    *   `Retry-After`: (用於 429 或 503) 建議客戶端在多少秒後重試。

---

## 6. API 端點詳述 (API Endpoint Definitions)

*   `[這是 API 設計的核心部分。對每個資源 (Resource) 及其相關的端點 (Endpoint) 進行詳細定義。建議按資源分組。]`

### 6.1 資源：[資源名稱，例如 Users]

#### 6.1.1 `GET /[resource_path]` (例如 `/users`)
*   **描述:** `[獲取 [資源名稱] 列表。]`
*   **認證/授權:** `[需要的權限/範圍，例如：read:users]`
*   **查詢參數 (Query Parameters):**
    *   `[參考章節 2.7 (分頁), 2.8 (排序), 2.9 (過濾) 中定義的參數。]`
    *   `[其他特定於此端點的查詢參數。]`
*   **成功回應 (200 OK):**
    *   **回應體:** `[一個包含 [資源對象] 的列表，以及分頁元數據。參考章節 7 中的 [Resource]List Schema。]`
*   **錯誤回應:** `[參考章節 4。]`
*   **範例請求/回應:** `[可連結到附錄中的範例。]`

#### 6.1.2 `POST /[resource_path]` (例如 `/users`)
*   **描述:** `[創建一個新的 [資源名稱]。]`
*   **認證/授權:** `[例如：write:users]`
*   **請求體:** `[參考章節 7 中的 [Resource]Create Schema。]`
*   **成功回應 (201 Created):**
    *   **Headers:** `Location: /[resource_path]/{new_resource_id}`
    *   **回應體:** `[新創建的 [資源對象]。參考章節 7 中的 [Resource] Schema。]`
*   **錯誤回應:** `[例如：400 Bad Request (驗證失敗), 409 Conflict (資源已存在)。參考章節 4。]`
*   **範例請求/回應:** `[...]`

#### 6.1.3 `GET /[resource_path]/{id}` (例如 `/users/{user_id}`)
*   **描述:** `[獲取指定 ID 的 [資源名稱] 詳情。]`
*   **認證/授權:** `[例如：read:users, 或用戶只能讀取自己的資源]`
*   **路徑參數 (Path Parameters):**
    *   `id`: `[ID 的型別和描述，例如：integer, UUID]`
*   **成功回應 (200 OK):**
    *   **回應體:** `[單個 [資源對象]。參考章節 7 中的 [Resource] Schema。]`
*   **錯誤回應:** `[例如：404 Not Found。參考章節 4。]`
*   **範例請求/回應:** `[...]`

#### 6.1.4 `PUT /[resource_path]/{id}` (例如 `/users/{user_id}`)
*   **描述:** `[完整更新指定 ID 的 [資源名稱]。請求體應包含資源的所有欄位。]`
*   **認證/授權:** `[例如：write:users, 或用戶只能更新自己的資源]`
*   **路徑參數:** `id`
*   **請求體:** `[參考章節 7 中的 [Resource]Update Schema (通常與 Create Schema 類似，但所有欄位都可選或部分必選)。]`
*   **成功回應 (200 OK 或 204 No Content):**
    *   **回應體 (若 200 OK):** `[更新後的 [資源對象]。]`
*   **錯誤回應:** `[例如：400 Bad Request, 404 Not Found。參考章節 4。]`
*   **冪等性:** 此操作應為冪等。
*   **範例請求/回應:** `[...]`

#### 6.1.5 `PATCH /[resource_path]/{id}` (例如 `/users/{user_id}`)
*   **描述:** `[部分更新指定 ID 的 [資源名稱]。請求體只需包含要修改的欄位。]`
*   **認證/授權:** `[同 PUT]`
*   **路徑參數:** `id`
*   **請求體:** `[參考章節 7 中的 [Resource]PartialUpdate Schema (所有欄位均為可選)。]`
*   **成功回應 (200 OK 或 204 No Content):**
    *   **回應體 (若 200 OK):** `[更新後的 [資源對象]。]`
*   **錯誤回應:** `[參考章節 4。]`
*   **冪等性:** 此操作應為冪等。
*   **範例請求/回應:** `[...]`

#### 6.1.6 `DELETE /[resource_path]/{id}` (例如 `/users/{user_id}`)
*   **描述:** `[刪除指定 ID 的 [資源名稱]。]`
*   **認證/授權:** `[例如：delete:users, 或用戶只能刪除自己的資源]`
*   **路徑參數:** `id`
*   **成功回應 (204 No Content 或 200 OK 含確認信息):**
*   **錯誤回應:** `[例如：404 Not Found。參考章節 4。]`
*   **冪等性:** 此操作應為冪等。
*   **範例請求/回應:** `[...]`

*   `... (繼續列出其他資源及其端點) ...`

---

## 7. 資料模型/Schema 定義 (Data Models / Schema Definitions)

*   `[使用 Pydantic 模型、JSON Schema、OpenAPI Schema Object 或其他清晰的方式定義 API 中使用的所有數據模型/DTO。]`

### 7.1 `[ResourceName]Schema` (例如 `UserSchema`)
*   **描述:** `[代表一個 [資源名稱] 的標準數據結構。]`
    ```json
    // 範例 (Pydantic 風格，可轉為 JSON Schema)
    {
      "id": "string (uuid)",
      "username": "string",
      "email": "string (email format)",
      "created_at": "string (date-time)",
      "updated_at": "string (date-time)",
      // ... 其他欄位
      "_links": { // HATEOAS 連結 (選填)
        "self": { "href": "/users/{id}" },
        "related_resource": { "href": "/users/{id}/orders" }
      }
    }
    ```

### 7.2 `[ResourceName]CreateSchema` (例如 `UserCreateSchema`)
*   **描述:** `[用於創建新 [資源名稱] 時的請求體結構。]`
    ```json
    {
      "username": "string (required, min_length: 3, max_length: 50)",
      "email": "string (required, email format)",
      "password": "string (required, min_length: 8, meets complexity rules)"
      // ... 其他創建時需要的欄位
    }
    ```

### 7.3 `[ResourceName]UpdateSchema` (例如 `UserUpdateSchema`)
*   **描述:** `[用於完整更新現有 [資源名稱] 時的請求體結構。]`
    ```json
    {
      "username": "string (min_length: 3, max_length: 50)",
      "email": "string (email format)"
      // ... 其他可更新的欄位 (通常不包括 id, created_at)
    }
    ```

### 7.4 `[ResourceName]PartialUpdateSchema` (例如 `UserPartialUpdateSchema`)
*   **描述:** `[用於部分更新現有 [資源名稱] 時的請求體結構 (所有欄位可選)。]`
    ```json
    {
      "username": "string (optional, min_length: 3, max_length: 50)",
      "email": "string (optional, email format)"
      // ... 其他可部分更新的欄位
    }
    ```

### 7.5 `[ResourceName]ListSchema` (例如 `UserListSchema`)
*   **描述:** `[代表 [資源名稱] 列表的回應結構，通常包含數據和分頁元信息。]`
    ```json
    {
      "data": [
        // 數個 UserSchema 對象
      ],
      "meta": {
        "pagination": { /* 分頁信息 */ }
      }
    }
    ```

*   `... (繼續列出其他必要的 Schema 定義) ...`

---

## 8. 安全性考量 (Security Considerations)
*   `[除了第 3 節的認證授權外，此處應更詳細地討論 API 特定的安全威脅和防護措施。]`
    *   **輸入驗證 (Input Validation):** `[強調所有用戶輸入都必須經過嚴格驗證，防止 XSS, SQL Injection, 命令注入等。]`
    *   **輸出編碼 (Output Encoding):** `[確保所有輸出到客戶端的數據都進行了恰當的編碼，以防止 XSS。]`
    *   **敏感數據處理:** `[API 如何處理和傳輸敏感數據？是否遵循最小權限原則？]`
    *   **防止常見 API 漏洞 (OWASP API Security Top 10):** `[簡要說明如何應對 Broken Object Level Authorization, Broken User Authentication, Excessive Data Exposure, Lack of Resources & Rate Limiting 等問題。]`
    *   **日誌與監控:** `[安全相關事件的日誌記錄和監控策略。]`

---

## 9. 向後兼容性與棄用策略 (Backward Compatibility and Deprecation Policy)
*   **向後兼容性承諾:** `[API 是否致力於保持向後兼容？如果是，哪些類型的變更是被允許的 (例如，增加新的可選欄位)，哪些是不被允許的 (例如，刪除欄位、修改現有欄位型別)？]`
*   **API 版本棄用策略:**
    *   `[如果一個 API 版本需要被棄用，提前多久通知？]`
    *   `[通知渠道是什麼？]`
    *   `[棄用後，API 會如何回應 (例如，返回特定錯誤碼，或在一段時間後停止服務)？]`
    *   `[是否有遷移指南幫助用戶升級到新版本？]`

---

## 10. 附錄 (Appendices - 選填)

### 10.1 請求/回應範例 (Request/Response Examples)
*   `[為每個端點提供一些常見的請求和回應 JSON 範例，包括成功和失敗的場景。]`
    *   **端點: `GET /users`**
        *   **請求範例:** `curl -H "Authorization: Bearer <token>" "https://api.example.com/v1/users?page_size=2&sort_by=-created_at"`
        *   **成功回應範例 (200 OK):**
            ```json
            {
              "data": [
                { "id": "uuid-user-2", "username": "jane_doe", ... },
                { "id": "uuid-user-1", "username": "john_doe", ... }
              ],
              "meta": { "pagination": { ... } }
            }
            ```
    *   `... (更多範例) ...`

---
**文件審核記錄 (Review History):**

| 日期       | 審核人     | 版本 | 變更摘要/主要反饋                     |
| :--------- | :--------- | :--- | :---------------------------------- |
| YYYY-MM-DD | [姓名/團隊] | v0.1 | 初稿提交                              |
| YYYY-MM-DD | [姓名/團隊] | v0.2 | 根據 XX 反饋更新了 YY；增加了錯誤碼定義 |
| YYYY-MM-DD | [API委員會] | v1.0 | 批准發布                              | 