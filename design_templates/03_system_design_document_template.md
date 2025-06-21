# 系統詳細設計文檔 (System Design Document) - [模組/功能名稱]

---

**文件版本 (Document Version):** `v0.1`

**最後更新 (Last Updated):** `YYYY-MM-DD`

**主要作者/設計師 (Lead Author/Designer):** `[請填寫]`

**審核者 (Reviewers):** `[列出主要審核人員/團隊]`

**狀態 (Status):** `[例如：草稿 (Draft), 審核中 (In Review), 已批准 (Approved), 待開發 (To Do), 開發中 (In Progress), 已完成 (Done)]`

**相關系統架構文檔 (SA Document):** `[連結到 02_system_architecture_document_template.md 或實際的 SA 文檔]`

**相關 User Stories/Features:** `[列出此詳細設計對應的 User Story ID 或 Feature 描述，可連結到 PRD 或需求文檔]`

**相關 ADRs (若適用):** `[列出影響此詳細設計的相關 ADR 編號]`

---

## 目錄 (Table of Contents)

1.  [引言 (Introduction)](#1-引言-introduction)
    1.1. [目的 (Purpose)](#11-目的-purpose)
    1.2. [範圍 (Scope)](#12-範圍-scope)
    1.3. [術語表 (Glossary - 選填)](#13-術語表-glossary---選填)
    1.4. [參考文件 (References)](#14-參考文件-references)
2.  [模組/功能概述 (Module/Feature Overview)](#2-模組功能概述-modulefeature-overview)
    2.1. [功能描述 (Functional Description)](#21-功能描述-functional-description)
    2.2. [與系統其他部分的關係 (Relationship to Other System Parts)](#22-與系統其他部分的關係-relationship-to-other-system-parts)
3.  [詳細設計 (Detailed Design)](#3-詳細設計-detailed-design)
    3.1. [模組結構與組件設計 (Module Structure and Component Design)](#31-模組結構與組件設計-module-structure-and-component-design)
        3.1.1. [類別圖/組件圖 (Class/Component Diagrams)](#311-類別圖組件圖-classcomponent-diagrams)
        3.1.2. [主要類別/介面/函式詳述 (Key Classes/Interfaces/Functions Details)](#312-主要類別介面函式詳述-key-classesinterfacesfunctions-details)
    3.2. [API 設計 (API Design - 若適用)](#32-api-設計-api-design---若適用)
        3.2.1. [內部 API (Internal APIs)](#321-內部-api-internal-apis)
        3.2.2. [外部 API (External/Public APIs)](#322-外部-api-externalpublic-apis)
    3.3. [資料庫設計 (Data Model / Database Design - 若適用)](#33-資料庫設計-data-model--database-design---若適用)
        3.3.1. [資料庫表結構/Schema](#331-資料庫表結構schema)
        3.3.2. [資料字典 (Data Dictionary)](#332-資料字典-data-dictionary)
        3.3.3. [ER 圖 (Entity-Relationship Diagram)](#333-er-圖-entity-relationship-diagram)
    3.4. [核心演算法/邏輯流程 (Core Algorithms / Logic Flow)](#34-核心演算法邏輯流程-core-algorithms--logic-flow)
        3.4.1. [主要業務流程圖 (Key Business Process Flows)](#341-主要業務流程圖-key-business-process-flows)
        3.4.2. [序列圖/活動圖 (Sequence/Activity Diagrams)](#342-序列圖活動圖-sequenceactivity-diagrams)
        3.4.3. [狀態機圖 (State Machine Diagrams - 若適用)](#343-狀態機圖-state-machine-diagrams---若適用)
    3.5. [錯誤處理與例外機制 (Error Handling and Exception Strategy)](#35-錯誤處理與例外機制-error-handling-and-exception-strategy)
    3.6. [配置管理 (Configuration - 若適用)](#36-配置管理-configuration---若適用)
4.  [設計考量 (Design Considerations)](#4-設計考量-design-considerations)
    *   `[參考 sd_review.mdc 的 "設計考量" 部分，並針對此模組/功能進行具體闡述]`
    4.1. [安全性 (Security)](#41-安全性-security)
    4.2. [性能 (Performance)](#42-性能-performance)
    4.3. [可擴展性 (Scalability)](#43-可擴展性-scalability)
    4.4. [可靠性與容錯 (Reliability & Fault Tolerance)](#44-可靠性與容錯-reliability--fault-tolerance)
    4.5. [可測試性 (Testability)](#45-可測試性-testability)
    4.6. [可維護性 (Maintainability)](#46-可維護性-maintainability)
    4.7. [部署考量 (Deployment - 若適用)](#47-部署考量-deployment---若適用)
5.  [介面定義 (Interface Definitions - 若單獨抽出)](#5-介面定義-interface-definitions---若單獨抽出)
6.  [未來展望 (Future Considerations - 選填)](#6-未來展望-future-considerations---選填)
7.  [附錄 (Appendices - 選填)](#7-附錄-appendices---選填)

---

## 1. 引言 (Introduction)

### 1.1 目的 (Purpose)
*   `[描述本詳細設計文檔的目的，例如：為 [模組/功能名稱] 提供具體的實現細節和規格，指導開發和測試工作。]`

### 1.2 範圍 (Scope)
*   `[明確定義本文件所涵蓋的模組/功能的邊界。]`

### 1.3 術語表 (Glossary - 選填)
*   `[定義與此模組/功能相關的特定術語。]`

### 1.4 參考文件 (References)
*   `[系統架構文檔: [連結]]`
*   `[相關 PRD/User Story: [連結]]`
*   `[相關 API 設計規範: [連結] (若適用)]`
*   `[相關 ADRs: [連結]]`
*   `...`

---

## 2. 模組/功能概述 (Module/Feature Overview)

### 2.1 功能描述 (Functional Description)
*   `[詳細描述此模組/功能的核心職責、它做什麼、以及它如何滿足相關的 User Stories/Features。]`
*   `[可以包含高層次的用例描述。]`

### 2.2 與系統其他部分的關係 (Relationship to Other System Parts)
*   `[說明此模組/功能如何與系統的其他模組/組件交互。可以使用簡單的上下文圖 (Context Diagram) 或列表說明。]`
    *   **輸入 (Inputs):** `[從哪些模組/服務接收數據或調用？數據/請求格式？]`
    *   **輸出 (Outputs):** `[向哪些模組/服務發送數據或結果？數據/回應格式？]`
    *   **依賴 (Dependencies):** `[依賴哪些內部/外部服務或函式庫？]`

---

## 3. 詳細設計 (Detailed Design)
*   `[這是 SD 文檔的核心。參考 sd_review.mdc 的各個檢查點。]`

### 3.1 模組結構與組件設計 (Module Structure and Component Design)

#### 3.1.1 類別圖/組件圖 (Class/Component Diagrams)
*   `[嵌入 Mermaid 或 PlantUML 碼塊來展示此模組內部的主要類別、介面及其關係 (繼承、實現、聚合、組合)。應標明關鍵屬性和方法。]`
    ```mermaid
    classDiagram
        class FeatureController {
            +process_request(data: RequestModel): ResponseModel
        }
        class FeatureService {
            -repository: IFeatureRepository
            +execute_feature_logic(params: FeatureParams): FeatureResult
        }
        interface IFeatureRepository {
            +save(data: FeatureData)
            +get_by_id(id: string): FeatureData
        }
        FeatureController ..> FeatureService : uses
        FeatureService ..> IFeatureRepository : uses
    ```
    * `[對圖表進行必要的文字說明。]`

#### 3.1.2 主要類別/介面/函式詳述 (Key Classes/Interfaces/Functions Details)
*   `[對圖中每個重要的類別、介面、函式/方法進行詳細描述。]`
    *   **`[ClassName/InterfaceName/FunctionName]`**
        *   **職責 (Responsibility):** `[簡明扼要地描述其核心職責。]`
        *   **主要屬性 (Attributes - 若為類別):** `[屬性名稱: 型別 - 描述]`
        *   **主要方法/函式簽名 (Methods/Function Signatures):**
            *   `method_name(param1: type, param2: type) -> return_type`
                *   **描述:** `[方法/函式的功能描述。]`
                *   **參數:** `[參數說明]`
                *   **回傳:** `[回傳值說明]`
                *   **前置條件 (Pre-conditions - 選填):** `[...]`
                *   **後置條件 (Post-conditions - 選填):** `[...]`
                *   **主要邏輯/演算法步驟 (選填，可用偽代碼):** `[...]`
        *   **與其他類的關係 (Relationships - 若為類別):** `[例如：繼承自 X, 實現 Y 介面, 聚合 Z]`

### 3.2 API 設計 (API Design - 若適用)
*   `[如果此模組提供或消費 API，在此詳細定義。可參考 04_api_design_specification_template.md。]`

#### 3.2.1 內部 API (Internal APIs)
*   `[模組內部或與其他內部模組交互的 API。]`

#### 3.2.2 外部 API (External/Public APIs)
*   `[模組暴露給外部客戶端或其他系統的 API。]`
    *   **端點 (Endpoint):** `[HTTP 方法] /path/to/resource`
    *   **描述:** `[...]`
    *   **請求 (Request):**
        *   **Headers:** `[...]`
        *   **路徑參數 (Path Parameters):** `[...]`
        *   **查詢參數 (Query Parameters):** `[...]`
        *   **請求體 (Body - 含 Schema/範例):** `[...]`
        *   **資料驗證規則:** `[...]`
    *   **回應 (Response):**
        *   **成功 (Success - e.g., 200 OK, 201 Created):**
            *   **Headers:** `[...]`
            *   **回應體 (Body - 含 Schema/範例):** `[...]`
        *   **錯誤 (Error - e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error):**
            *   **回應體 (Body - 含 Schema/範例):** `[...]`
    *   **認證/授權 (Authentication/Authorization):** `[...]`
    *   **冪等性 (Idempotency):** `[...]`
    *   **速率限制 (Rate Limiting):** `[...]`

### 3.3 資料庫設計 (Data Model / Database Design - 若適用)

#### 3.3.1 資料庫表結構/Schema
*   `[為此模組涉及的每個資料庫表提供詳細的 Schema 定義。]`

    **表名: `[table_name]`**

    | 欄位名稱 (Column) | 資料型別 (Data Type) |約束 (Constraints) | 描述/備註                                  |
    | :---------------- | :------------------- | :----------------- | :----------------------------------------- |
    | `id`              | `SERIAL` / `UUID`    | `PRIMARY KEY`      | `主鍵`                                     |
    | `created_at`      | `TIMESTAMP WITH TIME ZONE` | `NOT NULL DEFAULT NOW()` | `創建時間`                                 |
    | `updated_at`      | `TIMESTAMP WITH TIME ZONE` | `NOT NULL DEFAULT NOW()` | `最後更新時間`                             |
    | `[column_name_1]` | `[e.g., VARCHAR(255)]` | `[e.g., NOT NULL, UNIQUE]` | `[欄位描述]`                             |
    | `[column_name_2]` | `[e.g., INTEGER]`    | `[e.g., DEFAULT 0]` | `[欄位描述]`                             |
    | `[foreign_key_id]`| `INTEGER`            | `REFERENCES other_table(id)` | `[外鍵描述]`                             |

    *   **索引 (Indexes):** `[列出為此表創建的索引及其欄位。]`

#### 3.3.2 資料字典 (Data Dictionary)
*   `[對 Schema 中的重要欄位或具有特定業務含義的欄位進行更詳細的解釋。]`

#### 3.3.3 ER 圖 (Entity-Relationship Diagram)
*   `[嵌入 Mermaid 或 PlantUML 碼塊來展示此模組相關的資料庫實體及其關係。]`
    ```mermaid
    erDiagram
        USER ||--o{ ORDER : places
        USER {
            int id PK
            string name
            string email
        }
        ORDER {
            int id PK
            int user_id FK
            datetime order_date
        }
    ```

### 3.4 核心演算法/邏輯流程 (Core Algorithms / Logic Flow)

#### 3.4.1 主要業務流程圖 (Key Business Process Flows)
*   `[使用流程圖（建議Mermaid或PlantUML）描述此模組實現的關鍵業務流程。]`
    ```mermaid
    graph TD
        Start --> InputData{接收輸入數據}
        InputData -- 校驗通過 --> ProcessData[執行核心處理邏輯]
        InputData -- 校驗失敗 --> ErrorHandling[錯誤處理]
        ProcessData --> OutputData{產生輸出結果}
        ErrorHandling --> End
        OutputData --> End
    ```

#### 3.4.2 序列圖/活動圖 (Sequence/Activity Diagrams)
*   `[對於複雜的交互或內部邏輯，使用序列圖或活動圖來進一步闡明。]`

#### 3.4.3 狀態機圖 (State Machine Diagrams - 若適用)
*   `[如果模組中的實體或流程涉及複雜的狀態轉換，使用狀態機圖來描述。]`
    ```mermaid
    stateDiagram-v2
        [*] --> Draft
        Draft --> Submitted : Submit Application
        Submitted --> UnderReview : Reviewer Accepts
        UnderReview --> Approved : Approval
        UnderReview --> Rejected : Rejection
        Approved --> [*]
        Rejected --> [*]
    ```

### 3.5 錯誤處理與例外機制 (Error Handling and Exception Strategy)
*   `[詳細說明模組將如何處理預期和非預期的錯誤。]`
    *   **主要例外類型 (Key Exception Types):** `[列出模組將拋出或捕獲的主要自定義例外及其含義。]`
    *   **錯誤日誌記錄 (Error Logging):** `[錯誤日誌的格式、包含的信息、日誌級別。]`
    *   **用戶錯誤反饋 (User Error Feedback - 若適用於 UI 或 API):** `[向用戶或調用方返回錯誤信息的方式和內容。]`
    *   **重試機制 (Retry Mechanisms - 若適用):** `[對於可重試的錯誤，描述重試策略。]`

### 3.6 配置管理 (Configuration - 若適用)
*   `[列出此模組需要的配置參數、其含義、預設值以及如何配置 (例如：環境變數、配置文件)。]`

    | 配置項         | 描述                                   | 型別    | 預設值 | 環境變數名 (若適用) |
    | :------------- | :------------------------------------- | :------ | :----- | :------------------ |
    | `API_TIMEOUT_MS` | `調用外部 API 的超時時間 (毫秒)`       | `Integer` | `5000` | `MYMODULE_API_TIMEOUT` |
    | `FEATURE_FLAG_X` | `控制 X 功能是否開啟的特性開關`          | `Boolean` | `false`| `MYMODULE_FF_X`      |

---

## 4. 設計考量 (Design Considerations)
*   `[參考 sd_review.mdc 的 "設計考量" 部分，並針對此模組/功能進行具體闡述。]`

### 4.1 安全性 (Security)
*   `[例如：輸入驗證策略、輸出編碼、認證/授權實現細節、數據加密、防止常見漏洞 (OWASP Top 10) 的措施等。]`

### 4.2 性能 (Performance)
*   `[例如：預期的響應時間、吞吐量目標、資源使用（CPU/內存）預估、採用的性能優化技術 (如快取、異步處理、數據庫索引等)。]`

### 4.3 可擴展性 (Scalability)
*   `[例如：模組如何支持負載增加？是無狀態設計嗎？是否有潛在的擴展瓶頸？]`

### 4.4 可靠性與容錯 (Reliability & Fault Tolerance)
*   `[例如：如何處理依賴服務的失敗？是否有重試邏輯、超時設置、斷路器模式？數據一致性如何保證？]`

### 4.5 可測試性 (Testability)
*   `[例如：設計如何方便進行單元測試、整合測試？是否易於 Mock 依賴？是否有清晰的介面定義？]`

### 4.6 可維護性 (Maintainability)
*   `[例如：代碼的模塊化程度、可讀性、配置的靈活性、日誌的完備性如何支持後續維護？]`

### 4.7 部署考量 (Deployment - 若適用)
*   `[例如：此模組是否有特殊的部署需求？環境變數？依賴的基礎設施？]`

---

## 5. 介面定義 (Interface Definitions - 若單獨抽出)
*   `[如果介面定義非常多或複雜，可以考慮將其作為本章節或單獨附錄詳細列出，例如使用 OpenAPI/Swagger JSON/YAML 格式，或 Protocol Buffer 定義。]`

---

## 6. 未來展望 (Future Considerations - 選填)
*   `[對此模組/功能未來可能的擴展、重構或改進方向的初步思考。]`

---

## 7. 附錄 (Appendices - 選填)
*   `[任何無法歸入以上章節但對理解設計有幫助的補充材料。]`

---
**文件審核記錄 (Review History):**

| 日期       | 審核人     | 版本 | 變更摘要/主要反饋                                 |
| :--------- | :--------- | :--- | :---------------------------------------------- |
| YYYY-MM-DD | [姓名/團隊] | v0.1 | 初稿提交                                          |
| YYYY-MM-DD | [姓名/團隊] | v0.2 | 根據 XX 反饋更新了 YY；API 細化                   | 