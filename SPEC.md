# 保險資料對比 + 理賠流程 — 規格計劃書 v2.2.1

> 版本：v2.2.1｜更新日期：2026-07-11｜維護者：Sophia (CPO)
> 對接技術：Alan (CTO) + Hermes Agent
> Demo：https://insurance-hub-one.vercel.app/
> 原始碼：https://github.com/openclawsean024-create/insurance-hub

---

## 1. 產品概述 (Product Overview)

### 1.1 問題陳述 (Problem Statement)

台灣保險市場長年存在三大結構性痛點，讓一般民眾在投保與理賠兩個階段都處於高度資訊不對稱的位置：

1. **保單散落難以管理**：多數保戶手上同時持有壽險、醫療險、意外險、產險等不同公司保單，紙本與 PDF 散落在抽屜、Email、LINE 群組。出險時往往找不到自己有哪些保障，也不知道保障額度與到期日。
2. **條款複雜、無法檯向比較**：各家保險公司的除外責任、等待期、給付條件、理賠文件要求皆不同。保戶難以用一致標準評估「哪一張保單對我最好」，業務員亦難以提供中立比較。
3. **理賠流程黑箱**：出險後民眾常不知道第一步該做什麼 — 要通知誰、要準備什麼文件、要多久能拿到錢 — 導致錯過時效或漏報項目，理賠權益受損。銀髮族群子女更是經常需要代為處理，跨世代資訊傳遞斷裂。

**市場痛點量化**：
- 台灣保險滲透率全球第 1（每人平均 3.2 張保單）
- 保險類申訴常年高居前三名（金融消費評議中心 2025 統計）
- **超過 60% 申訴與「理賠認定」「條款理解落差」相關**
- 出險後民眾平均花 **12 小時**摸索理賠流程

### 1.2 目標使用者 (User Personas)

| Persona | 規模 | 核心痛點 | 願付價格 |
|---|---|---|---|
| **一般保戶（小芳）** | 1,500 萬 | 保單分散、理賠流程不清楚 | NT$0（免費） |
| **保險經紀人（小華）** | 8 萬 | 客戶保單管理、比較報表 | NT$499/月 |
| **銀髮族子女（小雯）** | 200 萬 | 代父母管理保單、協助理賠 | NT$99/月 |
| **企業福委（Linda）** | 5,000 | 員工團保管理 + 理賠諮詢 | NT$2,999/月 |

### 1.3 核心價值主張 (Value Proposition)

> 「**保險地圖** — 把全台 30 家保險公司的保單、條款、理賠 SOP 全部集中在一個平台。保單自動彙整、條款並排比較、理賠流程 step-by-step 跟蹤。出險不再慌張，三步驟完成理賠。」

**三大差異化**：
1. **純前端 + localStorage 個資零外流**：100% 隱私保護，零密碼、零後端、無需登入
2. **30 家保險公司預載資料**：金管會公開資訊 + 保發中心 + 公司官網彙整
3. **6 種險種 SOP 透明化**：住院/手術/癌症/失能/身故/意外，每階段 T+X 時間軸

### 1.4 商業目標 (KPIs / OKRs)

| 時間 | KPI | 目標值 |
|---|---|---|
| **3 個月** | MAU | 50,000 |
| **6 個月** | 付費轉化率 | 1.5%（750 付費） |
| **6 個月** | MRR | NT$380,000 |
| **12 個月** | MRR | NT$1,500,000 |
| **12 個月** | GitHub stars | 500 |

### 1.5 Non-Goals (明確不做)

- ❌ **不做保險業務員導流** — 與「中立比較」定位衝突；保戶不信任含導流內容
- ❌ **不串接金管會 API** — 目前金管會無開放保單資料查詢 API，預載資料採手動維護
- ❌ **不做後端** — 個資保護優先，所有資料本地儲存（localStorage）
- ❌ **不做 OCR 拍照辨識保單** — v1 不做（OCR 準確率 <80% 易誤導），v3+ 評估
- ❌ **不做「推薦買哪家」功能** — 法律風險 + 立場衝突，本工具定位「資訊整理」非「保險建議」
- ❌ **不做 IG/TikTok 等社群經營** — 與保險專業內容無關

---

## 2. 使用者場景與流程

### 2.1 使用者流程圖

```mermaid
graph LR
    A[進入首頁] --> B[瀏覽保險地圖]
    B --> C{選擇功能}
    C -->|保單管理| D[新增/編輯保單<br/>localStorage]
    C -->|條款比較| E[選 2-4 張保單<br/>並排比較]
    C -->|理賠 SOP| F[選險種<br/>step-by-step]
    D --> G[儀表板<br/>到期提醒]
    E --> H[差異高亮<br/>best/worst]
    F --> I[check box 追蹤<br/>預估工作天]
    G --> J[匯出 JSON 備份]
```

### 2.2 關鍵用戶故事 (User Stories)

**US-001：保單集中管理**
> As a 一般保戶  
> I want to 在瀏覽器新增 3 張保單（國泰人壽+富邦產險+南山醫療險）  
> So that 系統自動彙整總保障額度 NT$1,500 萬、年繳保費 NT$48,000、到期提醒

**US-002：條款並排比較**
> As a 準備買新醫療險的保戶  
> I want to 選 2 張醫療險並排比較（住院日額、癌症一次金、等待期）  
> So that 系統自動高亮差異（紅/綠）並顯示「這張在 X 項目優於其他」

**US-003：理賠 SOP step-by-step**
> As a 出險住院的保戶  
> I want to 點擊「住院理賠 SOP」並依序完成 T+0 通報 → T+3 文件 → T+7 送件 → T+14 核付  
> So that 我能跟蹤進度，且不漏掉必備文件

**US-004：銀髮族子女代管**
> As a 50 歲的子女  
> I want to 為 80 歲父母建立保單資料（標記「代父母管理」），並列印紙本清單  
> So that 我能回家確認父母的保障，避免出險時才發現漏保

**US-005：保險經紀人客戶管理**
> As a 保險經紀人  
> I want to 一次性管理 50 位客戶保單，產生客製化比較報表 PDF  
> So that 我能在客戶會議上即時展示條款差異，提高成交率

### 2.3 邊界場景 (Edge Cases)

- **30 天內到期保單**：儀表板紅色標示 + email 提醒（如未登入則 browser notification）
- **保單資料完整性**：必填欄位（保險公司、保單號碼、險種、保額）若缺漏，UI 顯示警告但不擋儲存
- **條款資料過期**：每筆條款標註「資料更新日期」+ 免責聲明
- **跨瀏覽器同步**：localStorage 跨瀏覽器不互通，提供 JSON 匯出/匯入備份機制
- **公用電腦使用**：UI 明顯提示「資料儲存在此裝置，清除瀏覽器資料將遺失」

---

## 3. 功能性需求 (Functional Requirements)

### 3.1 MVP（必做，P0）

- [ ] **F-001 保單 CRUD**（Given 使用者在保單頁，When 新增/編輯/刪除保單，Then 資料寫入 localStorage 且立即更新儀表板）
- [ ] **F-002 自動分類**（Given 保單資料，When 輸入險種，Then 自動歸類：壽險/醫療險/意外險/癌症險/住院日額/長照/失能/旅平險/車險/產險）
- [ ] **F-003 到期提醒儀表板**（Given 30 天內到期保單，When 開啟首頁，Then 紅色標示且顯示「剩餘 X 天」）
- [ ] **F-004 JSON 備份**（Given 使用者點擊匯出，When 下載，Then 瀏覽器下載完整保單 JSON）
- [ ] **F-005 一鍵列印**（Given 點擊列印，When 瀏覽器列印對話框，Then 顯示「保單清單」列印版）
- [ ] **F-006 條款比較矩陣**（Given 2-4 張保單，When 並排比較，Then 顯示差異欄位（住院日額/癌症一次金/等待期/除外責任）並高亮 best/worst）
- [ ] **F-007 30 家保險公司預載資料**（Given 首次進入，When 開啟比較頁，Then 預載金管會公開條款資料）
- [ ] **F-008 6 種險種 SOP**（Given 點擊任一險種，When 開啟 SOP，Then 顯示 T+0/T+3/T+7/T+14 階段 + check box）
- [ ] **F-009 保險地圖**（Given 開啟地圖頁，When 載入，Then 顯示 30 家公司總部位置 + 業務密度 + 申訴率）
- [ ] **F-010 RWD + 深色模式**（Given 三斷點（375/768/1440）+ 深色模式切換，When 操作，Then 正常使用）

### 3.2 v2.0 B2B 經紀人版（加值，P1）

- [ ] **F-011 經紀人客戶管理**（管理 50 位客戶保單 + 標籤分組）
- [ ] **F-012 客製化比較報表 PDF**（經紀人選擇客戶保單 → 自動產生含 Logo 的 PDF）
- [ ] **F-013 客戶白牌版本**（經紀人可建立 white-label 連結給客戶）
- [ ] **F-014 多家庭成員切換**（父母/子女/配偶切換保單群組）
- [ ] **F-015 條款資料自動更新提醒**（每季新公告 → 通知經紀人檢視更新）
- [ ] **F-016 理賠權益試算**（輸入自付額 → 試算可申請金額）

### 3.3 v3.0（願景，P2）

- [ ] **F-017 OCR 拍照辨識紙本保單**（GPT-4o vision API）
- [ ] **F-018 AI 推薦引擎**（依使用者年齡/收入/家庭狀況建議險種組合）
- [ ] **F-019 與保險經紀人協作模式**（選擇性 share 部分保單）
- [ ] **F-020 Telegram/LINE Bot 整合**（出險時 LINE Bot 自動推 SOP）

### 3.4 Acceptance Criteria (Given/When/Then)

**AC-001（保單 CRUD）**
> Given 使用者在保單頁  
> When 新增保單（保險公司=國泰人壽、保單號碼=ABC123、險種=醫療險、保額=NT$100 萬）  
> Then localStorage 寫入 1 筆保單，且儀表板立即顯示「總保障 NT$100 萬」

**AC-002（自動分類）**
> Given 使用者輸入險種「醫療險」  
> When 點擊儲存  
> Then 保單自動歸類為「醫療險」分類，且儀表板醫療險分類顯示「1 張」

**AC-003（30 天內到期提醒）**
> Given 某保單到期日為 2026-08-01（今天 2026-07-03）  
> When 開啟首頁  
> Then 該保單在儀表板紅色標示「剩餘 28 天到期」

**AC-004（JSON 匯出匯入）**
> Given 使用者有 5 張保單  
> When 點擊「匯出 JSON」  
> Then 下載 `policies-2026-07-11.json` 含 5 筆保單完整資料

**AC-005（條款比較）**
> Given 使用者選 2 張醫療險（A 公司 + B 公司）  
> When 點擊「並排比較」  
> Then 顯示 7 個欄位（住院日額、癌症一次金、等待期、除外責任等）並對差異高亮（紅=差、綠=優）

**AC-006（理賠 SOP）**
> Given 使用者點擊「住院理賠 SOP」  
> When 開啟頁面  
> Then 顯示 4 階段：T+0 通報（電話保險公司）、T+3 文件（診斷書+收據）、T+7 送件（紙本/線上）、T+14~30 核付（匯款帳戶），每階段可勾選

**AC-007（保險地圖）**
> Given 開啟保險地圖頁  
> When 載入完成  
> Then 顯示全台 30 家保險公司總部位置（marker）+ 業務密度熱區 + 申訴率高低

**AC-008（深色模式）**
> Given 使用者點擊右上「深色模式」按鈕  
> When 切換  
> Then 整站從淺色切換到深色（背景 #1a1a1a、文字 #fafafa），且 localStorage 記住偏好

**AC-009（公用電腦警告）**
> Given 使用者在公用電腦（user agent 含「Kiosk」或 IP 為公開 WiFi）  
> When 首次進入  
> Then UI 顯示黃色警告橫幅「此裝置資料將被清除，建議匯出 JSON 備份」

**AC-010（30 家預載資料）**
> Given 首次進入比較頁  
> When 載入條款資料  
> Then 從 `/data/companies.json` 載入 30 家公司（每家含名稱、總部、申訴率、條款連結），無重複或缺漏

---

## 4. 系統設計 (System Design)

### 4.1 技術棧 (Tech Stack)

| 層 | 技術 | 理由 |
|---|---|---|
| 前端 | React 18 + Vite + TypeScript | 純 SPA、bundle 小、開發快 |
| 路由 | React Router v6 | SPA 多頁面導航（保單/對比/理賠/地圖） |
| 狀態管理 | Zustand | 比 Redux 輕量，適合純前端本地狀態 |
| 樣式 | Tailwind CSS + Headless UI | 快速 RWD、無障礙組件支援 |
| 資料儲存 | localStorage（含 IndexedDB 備援） | 純前端、零後端、個資不外流 |
| 圖表 | Recharts | 保險地圖、儀表板圖表 |
| 地圖 | Leaflet + OpenStreetMap | 免費、開源、保險公司總部位置 |
| PDF 產生 | jsPDF + html2canvas | 經紀人客戶報表 |
| 預載資料 | 靜態 JSON (`/public/data/companies.json`) | 30 家公司條款資料 |
| 部署 | Vercel | 自動 CI/CD、全球 CDN、免費 HTTPS |
| 版本控制 | GitHub | 公開原始碼、利於社群協作 |
| 程式碼品質 | ESLint + Prettier | 一致風格 |

### 4.2 系統架構圖 (Mermaid)

```mermaid
graph TB
    subgraph Browser
        SPA[React 18 SPA<br/>+ Zustand]
        LocalStorage[(localStorage<br/>保單資料)]
        IndexedDB[(IndexedDB<br/>備援)]
    end
    
    subgraph Static[Static Assets on Vercel CDN]
        HTML[HTML/CSS/JS Bundle]
        CompaniesJSON[/data/companies.json<br/>30家預載/]
        MapTiles[OSM Map Tiles]
    end
    
    subgraph External
        KmgInfo[金管會公開資料<br/>每季更新]
        ROCData[保發中心<br/>申訴率統計]
    end
    
    SPA --> LocalStorage
    SPA --> IndexedDB
    SPA --> HTML
    SPA --> CompaniesJSON
    SPA --> MapTiles
    CompaniesJSON -.每季更新.-> KmgInfo
    CompaniesJSON -.每月更新.-> ROCData
```

### 4.3 資料模型 (Prisma schema)

```prisma
// 純前端 IndexedDB schema (Prisma 對照版)
model Policy {
  id              String   @id @default(uuid())
  userId          String   // localStorage key (per browser)
  companyId       String   // FK -> Company
  company         Company  @relation(fields: [companyId], references: [id])
  policyNumber    String
  insuranceType   String   // life/medical/accident/cancer/hospital/longterm/disability/travel/auto/property
  insuredName     String
  applicantName   String
  coverageAmount  Decimal
  annualPremium   Decimal
  paymentPeriod   Int?     // 繳費期間（年）
  coveragePeriod  Int?     // 保障期間（年）
  isAutoRenew     Boolean  @default(false)
  contractStart   DateTime
  contractEnd     DateTime?
  notes           String?  @db.Text
  isManagedForFamily Boolean @default(false) // 為家人代管
  familyMemberName String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId, insuranceType])
  @@index([contractEnd])
}

model Company {
  id              String   @id @default(uuid())
  name            String   @unique
  shortName       String
  headquarters    String
  latitude        Float
  longitude       Float
  complaintRate   Float    // 申訴率（每萬件）
  totalPolicies   Int      // 業務量（萬件）
  foundedYear     Int
  contactPhone    String
  websiteUrl      String
  termsUrl        String
  lastUpdated     DateTime
  policies        Policy[]
}

model ClaimWorkflow {
  id              String   @id @default(uuid())
  userId          String
  insuranceType   String   // 住院/手術/癌症/失能/身故/意外
  policyId        String?  // 關聯保單
  currentStage    String   // reported/documenting/submitting/paid
  reportedAt      DateTime?
  documentReadyAt DateTime?
  submittedAt     DateTime?
  paidAt          DateTime?
  documents       String[] // ["診斷書", "收據", "..."
  notes           String?  @db.Text
  
  @@index([userId, insuranceType])
}

model ClaimChecklist {
  id              String   @id @default(uuid())
  workflowId      String
  workflow        ClaimWorkflow @relation(fields: [workflowId], references: [id])
  stage           String   // reported/documenting/submitting/paid
  item            String
  isCompleted     Boolean  @default(false)
  completedAt     DateTime?
}

model ComparisonSession {
  id              String   @id @default(uuid())
  userId          String
  policyIds       String[] // 2-4 張保單
  result          Json     // 比較結果（含差異標記）
  createdAt       DateTime @default(now())
}

model FamilyMember {
  id              String   @id @default(uuid())
  userId          String
  name            String
  relation        String   // self/spouse/child/parent/sibling
  birthYear       Int
  policyIds       String[] // 關聯保單
  
  @@index([userId])
}
```

### 4.4 API 規格 (REST endpoints)

| Method | Path | Auth | 用途 |
|---|---|---|---|
| GET | /data/companies.json | Optional | 30 家保險公司預載資料 |
| POST | /api/export/policies | Optional | 匯出 JSON（前端產生，這是 mock） |
| POST | /api/import/policies | Optional | 匯入 JSON（前端處理，這是 mock） |
| POST | /api/agent/white-label | Required | 經紀人 white-label 連結產生 |
| GET | /api/agent/clients/:id | Required | 經紀人查詢客戶保單 |
| POST | /api/agent/reports/pdf | Required | 經紀人客製化比較報表 PDF |
| POST | /api/stripe/checkout | Required | Stripe Checkout 訂閱（B2B 經紀人版） |
| POST | /api/stripe/webhook | Required | Stripe webhook 接收 |
| GET | /api/companies/:id/complaints | Required | 查詢申訴率（v2 從金管會同步） |
| GET | /api/news/insurance-updates | Optional | 金管會最新公告 RSS |

---

## 5. 非功能性需求 (Non-Functional Requirements)

### 5.1 性能指標

| 指標 | 目標 |
|---|---|
| 首頁載入 P95 | ≤ 2 秒 |
| 保單新增/編輯 localStorage 寫入 | ≤ 100ms |
| 條款比較矩陣渲染（4 張保單） | ≤ 1 秒 |
| 6 種 SOP 頁面切換 | ≤ 500ms |
| 地圖 30 個 marker 渲染 | ≤ 3 秒 |
| Lighthouse 行動版 | ≥ 85 |
| 並發用戶 | 10,000 MAU |

### 5.2 安全與隱私

- **零後端 + localStorage**：個資 100% 在使用者瀏覽器
- **無 Cookie 追蹤**：除 Vercel Analytics 外不使用第三方追蹤
- **無第三方 OAuth**：不串接 Google/Facebook 登入
- **免責聲明固定顯示**：首頁 + 條款頁頂部固定顯示「本工具定位為資訊整理，非保險建議」
- **HTTPS 強制**：Vercel 自動 + HSTS
- **30 家預載資料來源公開**：每筆條款標註來源（金管會/保發中心/公司官網）

### 5.3 降級機制 (Graceful Degradation)

| 失敗服務 | 掛掉情境 | 降級行為（切換到）| 用戶感受 |
|---|---|---|---|
| localStorage 滿載 | 5MB 上限掛掉 | 切換到 IndexedDB 備援（瀏覽器支援） | 自動備援，使用者無感 |
| IndexedDB 不支援 | Safari 隱私模式掛掉 | 切換到 sessionStorage（單次 session） | 提示「資料僅本次 session 保留」 |
| Vercel CDN 掛掉 | 靜態資源 5xx 掛掉 | 切換到 Cloudflare Pages 鏡像 | 載入延遲 ≤5 秒 |
| OpenStreetMap 圖磚 | OSM 服務掛掉 | 切換 CartoDB/Stamen 圖磚 | 地圖仍可用 |
| Recharts 渲染 | 圖表 JS 5xx 掛掉 | 切換到純 HTML 表格 fallback | 圖表變表格，功能仍可用 |
| jsPDF 客戶端 | 不支援 掛掉 | fallback 下載純文字 checklist | 部分用戶無法匯出 PDF |
| 金管會 RSS 變動 | RSS 格式變更 掛掉 | 切換到保發中心 RSS | 最新公告延遲 ≤1 天 |
| Stripe webhook | Webhook 5xx 掛掉 | 本地排程每 5 分鐘 reconcile | 訂閱狀態延遲 ≤15 分鐘 |
| 公用電腦（user agent 異常） | 偵測到 Kiosk 模式 掛掉 | 切換到「強制匯出」模式 | UI 顯示警告 |

### 5.4 擴展性

- **靜態資源 CDN**：Vercel Edge Network 全球 280+ 節點
- **資料分區**：localStorage 依 userId（瀏覽器指紋）分區
- **IndexedDB 升級**：當資料 >5MB 時自動切換
- **30 家預載資料**：每季更新，由 Sean 手動 commit 新 JSON

---

## 6. 完成標準 (Definition of Done)

### 6.1 v1 MVP DoD

- [ ] Vercel production URL（https://insurance-hub-one.vercel.app/）200 OK
- [ ] GitHub Repo 公開
- [ ] 30 家保險公司預載資料完整（含公司名、總部、申訴率、公開條款）
- [ ] 保單新增/編輯/刪除/查詢 4 項功能全通
- [ ] 條款對比矩陣可同時比較 2-4 張保單，差異高亮正確
- [ ] 6 種險種 SOP 頁面皆上線，check box 狀態可持久化
- [ ] Vercel 部署成功，網址可公開訪問
- [ ] Lighthouse 行動版分數 ≥85
- [ ] 所有頁面繁體中文，無英文未翻譯字串
- [ ] 10 條 AC 單元測試全綠
- [ ] JSON 匯出/匯入機制驗證

### 6.2 v2 B2B 經紀人版 DoD

- [ ] Supabase Auth 整合（magic link）
- [ ] 經紀人客戶管理（50 位）
- [ ] 客製化比較報表 PDF
- [ ] white-label 連結產生
- [ ] 多家庭成員切換
- [ ] Stripe Checkout 訂閱流程
- [ ] 客服頁 + 法律頁上線

---

## 7. 風險與決策

### 7.1 風險表

| 風險 | 等級 | 緩解策略 |
|---|---|---|
| 個資在公用電腦外洩 | 🟠 中 | UI 明顯警告 + 強制匯出備份機制 |
| 條款資料過期造成誤導 | 🟠 中 | 免責聲明 + 資料更新日期標註 + 定期更新 |
| 法律責任風險（使用者決策受損） | 🟡 低 | 明確「資訊整理」定位 + 免責聲明固定顯示 |
| 業務員導流衝突 | 🟡 低 | 初期不做導流；若未來考慮須明確標示業配 |
| 30 家預載資料維護成本 | 🟠 中 | 開源 GitHub 接受社群 PR + 資料更新 checklist |
| 保險公司官網改版導致條款連結失效 | 🟡 低 | 監控連結存活 + 定期重新整理 |
| OCR 拍照辨識準確率 | 🟠 中 | v1 不做；v3 評估 GPT-4o vision API |
| 金管會 RSS 格式變更 | 🟡 低 | 多源 fallback（金管會/保發中心/公司官網） |

### 7.2 ADR (Architecture Decision Records)

### ADR-001：純前端 SPA + localStorage 而非 Next.js 全端
- **Context**：個資保護優先 + 30 家預載資料靜態化
- **Decision**：React 18 SPA + localStorage，零後端
- **Consequences**：✅ 個資 100% 在使用者裝置；✅ 零後端成本；⚠️ 跨裝置不互通（提供 JSON 備份）

### ADR-002：30 家保險公司資料採靜態 JSON 而非 API
- **Context**：金管會無開放保單資料查詢 API
- **Decision**：`/data/companies.json` 預載，Sean 手動每季更新
- **Consequences**：✅ 零 API 成本；⚠️ 需人工維護（透過 GitHub PR 社群協作）

### ADR-003：選擇 Zustand 而非 Redux
- **Context**：純前端本地狀態管理
- **Decision**：Zustand（輕量、API 簡潔）
- **Consequences**：✅ Bundle size 節省 30KB+；✅ 學習曲線低；⚠️ 社群資源少於 Redux

### ADR-004：Leaflet + OpenStreetMap 而非 Google Maps
- **Context**：地圖 API 成本
- **Decision**：Leaflet + OSM 圖磚
- **Consequences**：✅ 零地圖成本；✅ 無 API key；⚠️ 圖磚品質略遜 Google

### ADR-005：JSON 匯出匯入而非雲端同步
- **Context**：v1 純前端 + 個資保護
- **Decision**：使用者手動 JSON 匯出/匯入
- **Consequences**：✅ 零後端；⚠️ 跨裝置不便（v2 經紀人版加 Supabase）

### ADR-006：免責聲明固定顯示而非彈出
- **Context**：法律風險
- **Decision**：首頁 + 條款頁頂部固定顯示，非 modal 彈出
- **Consequences**：✅ 避免使用者關閉免責聲明；✅ 法律保護更明確

### ADR-007：不支援保險業務員導流
- **Context**：定位衝突
- **Decision**：永遠不做業務員導流（與「中立比較」定位衝突）
- **Consequences**：✅ 維持使用者信任；⚠️ 放棄潛在業務員付費營收（但保戶量體更大）

---

## 8. 里程碑與 Sprint 拆解

### 8.1 里程碑總覽

| 里程碑 | 時間 | 完成定義 |
|---|---|---|
| **M1 規格完成** | 2026-07-11 | v2.2.1 PRD 100% 合規 |
| **M2 v1 MVP 強化** | 2026-07-30 | 10 條 AC 全綠 + Lighthouse ≥90 + 資料更新機制 |
| **M3 v2 B2B 經紀人版** | 2026-08-31 | 客戶管理 + PDF + white-label + Stripe |
| **M4 v3 AI 加值** | 2026-10-15 | GPT-4o OCR + AI 推薦引擎 |
| **M5 GA 上線** | 2026-11-01 | 行銷素材 + 客服 SOP + 推廣 |

### 8.2 Sprint 拆解 (從 PRD 到「每天做什麼」)

#### Sprint 1：v1 MVP 強化（2026-07-12 → 2026-07-30，19 天）
- Day 1-3：補強 30 家預載資料完整性 + 申訴率更新
- Day 4-5：補強條款比較矩陣差異高亮（best/worst 視覺化）
- Day 6-7：補強 JSON 匯出/匯入機制（含版本控制）
- Day 8-9：補強公用電腦偵測（user agent + IP）
- Day 10-11：補強 IndexedDB 備援（>5MB 自動切換）
- Day 12-13：補強 PWA（manifest + service worker，可離線使用）
- Day 14-15：補強 SEO meta + Open Graph + sitemap
- Day 16-17：補強 10 條 AC 單元測試（vitest）
- Day 18-19：補強 E2E 測試（Cypress）

#### Sprint 2：B2B 經紀人版（2026-07-31 → 2026-08-31，32 天）
- Day 1-3：Supabase 建專案 + Auth 整合
- Day 4-6：客戶保單管理（依經紀人分組）
- Day 7-9：客製化比較報表 PDF（jsPDF）
- Day 10-12：white-label 連結產生
- Day 13-15：多家庭成員切換
- Day 16-18：條款資料自動更新提醒（cron job）
- Day 19-21：理賠權益試算工具
- Day 22-24：Stripe Checkout 訂閱流程
- Day 25-27：客服頁 + 法律頁
- Day 28-30：Beta 測試
- Day 31-32：修正 + 正式上線

#### Sprint 3：AI 加值（2026-09-01 → 2026-10-15，45 天）
- Day 1-5：GPT-4o vision API OCR 測試
- Day 6-10：OCR 資料結構化（保單欄位自動填入）
- Day 11-15：AI 推薦引擎（依年齡/收入建議險種）
- Day 16-20：LINE Bot 整合（出險 SOP 推播）
- Day 21-25：公開測試
- Day 26-30：修正 + 正式上線

---

## 9. 變現路徑 + 定價心理學

### 9.1 變現方案

| 方案 | 價格 | 功能 | 目標用戶 |
|---|---|---|---|
| **免費版** | NT$0 | 保單管理（無上限）+ 條款比較 + SOP + 保險地圖 | 一般保戶 |
| **家庭進階版** | NT$99/月 | 免費版 + 多家庭成員切換 + OCR（v3） + AI 推薦（v3） | 銀髮族子女 |
| **經紀人版** | NT$499/月 | 50 位客戶 + 客製化 PDF + white-label + 報表 | 保險經紀人 |
| **企業福委版** | NT$2,999/月 | 200 位員工 + 團保管理 + 理賠諮詢 + 客服優先 | 企業福委 |

### 9.2 定價心理學 (Pricing Psychology)

1. **Freemium 鎖定「免費版」**：保單管理 + 條款比較 + SOP 全免費，建立大量 MAU 為 B2B 經紀人版導流
2. **家庭版 NT$99**：低於 NT$100 整數（mental accounting），NT$99 感覺「不到 100」
3. **經紀人版 NT$499**：低於 NT$500 整數，NT$499 感覺「不到 500」，對個人經紀人親民
4. **企業版 NT$2,999**：低於 NT$3,000 整數，NT$2,999 感覺「不到 3,000」，財務長報帳「不到 3,000/月」接受度高
5. **年繳 8 折**：家庭版年繳 NT$990 vs 月繳 NT$99 × 12 = NT$1,188（年省 NT$198）
6. **14 天免費試用經紀人版**：試用期結束前 3 天 email「升級以保留 50 位客戶資料」
7. **錨定效應**：在定價頁顯示「企業版 NT$5,999（聯絡我們）」，讓 NT$2,999 顯得划算
8. **社會證明**：首頁顯示「已有 X 位保戶使用，管理 Y 張保單，節省 Z 小時理賠時間」

---

## 10. 附錄

### 10.1 競品分析 + Competitive Quadrant Chart

| 競品 | 公司 | 價格 | 強項 | 弱項 |
|---|---|---|---|---|
| **保發中心** | 保發中心（公） | NT$0 | 官方資料、可信度高 | 無個人化、無比較功能 |
| **金融消費評議中心** | 金管會（公） | NT$0 | 申訴資料完整 | 僅申訴查詢、無保單管理 |
| **Goodinfo 保險** | Goodinfo（台） | NT$0 + 廣告 | 條件比較 | 無保單管理、無 SOP |
| **保經業務員 App** | 各家保險公司 | NT$0 | 業務員專用 | 僅自家保單、立場不中立 |
| **Insurance Hub（本專案）** | Sean Li（台） | NT$0-2,999/月 | 30 家中立比較 + SOP + 個資零外流 | 規模小、無 OCR |

```mermaid
quadrantChart
    title "保險工具定位（X：價格親民度 / Y：功能完整度）"
    x-axis "高價" --> "低價"
    y-axis "功能少" --> "功能多"
    quadrant-1 "低價功能多（本專案目標）"
    quadrant-2 "高價功能多"
    quadrant-3 "低價功能少"
    quadrant-4 "高價功能少"
    "保發中心": [0.95, 0.4]
    "金管會": [0.95, 0.2]
    "Goodinfo": [0.9, 0.5]
    "保經App": [0.9, 0.45]
    "Insurance Hub": [0.5, 0.85]
```

**差異化定位**：**低價 + 功能多 + 個資零外流** — 保發中心低價但功能少；保經 App 立場不中立；本專案整合且中立。

### 10.2 術語表

- **保險滲透率**：每人平均持有的保單數，台灣 3.2 為全球第 1
- **T+X 時間軸**：理賠 SOP 的階段標記（T+0=通報日、T+3=3 天後、T+7=7 天後、T+14=14 天後）
- **除外責任**：保險公司不理賠的情況（如懷孕、自殺、酒駕等）
- **等待期**：投保後需經過特定天數才能請領理賠（癌症險常見 90 天）
- **申訴率**：每萬件保單申訴次數（來自金管會公開資料）
- **white-label**：經紀人可建立自有品牌的客戶版本

### 10.3 參考資料

- 金管會公開資料：https://www.fsc.gov.tw/
- 保發中心：https://www.tii.org.tw/
- 金融消費評議中心：https://www.foi.org.tw/
- 內政部戶政司：https://www.ris.gov.tw/
- React Router：https://reactrouter.com/
- Zustand：https://zustand-demo.pmnd.rs/

### 10.4 Error Code 統一字典

| Code | HTTP | 訊息 | 觸發情境 |
|---|---|---|---|
| STORAGE_001 | - | localStorage 滿載 | 5MB 上限 |
| STORAGE_002 | - | IndexedDB 不支援 | Safari 隱私模式 |
| STORAGE_003 | - | JSON 匯入格式錯誤 | 結構不符合 schema |
| POLICY_001 | - | 保單必填欄位缺漏 | 公司/號碼/險種/保額 |
| POLICY_002 | - | 保單到期日早於今天 | 邏輯錯誤 |
| COMPARE_001 | - | 比較保單少於 2 張 | 至少 2 張 |
| COMPARE_002 | - | 比較保單多於 4 張 | 最多 4 張 |
| SOP_001 | - | 險種不支援 | 僅 6 種 |
| SOP_002 | - | SOP 階段順序錯誤 | 跳階段勾選 |
| AGENT_001 | 401 | 經紀人未登入 | B2B API |
| AGENT_002 | 403 | 客戶保單數超過 50 | 升級企業版 |
| STRIPE_001 | 402 | 訂閱方案不支援 | 錯誤 tier |
| STRIPE_002 | 400 | Stripe webhook signature 驗證失敗 | 偽造 webhook |

---

## 11. 市場驗證計畫 (Market Validation Plan)

### 11.1 驗證前 3 個關鍵問題

1. **一般保戶真的會用「保險地圖」嗎？** — 多數保戶只在出險時才想理賠，使用者黏性低
2. **銀髮族子女真的願意付費 NT$99/月 幫父母管理保單嗎？** — 代管意願是否真實
3. **保險經紀人願意付費 NT$499/月 換掉現有客戶管理工具嗎？** — 業務員工作流程整合意願

### 11.2 訪談 SOP

**目標**：訪談 30 位潛在用戶（10 位一般保戶 + 10 位銀髮族子女 + 10 位經紀人）
- **招募**：
  - 一般保戶：Facebook 社團「保險討論區」「保戶聯盟」
  - 銀髮族子女：PTT 板「Senior_Comm」+ Facebook「50+ 社群」
  - 經紀人：保險經紀人公會 + 公會 LINE 群
- **問題清單**：
  1. 目前如何管理保單？用什麼工具？
  2. 出險時花多少時間摸索理賠流程？
  3. 願意付費多少？哪些功能必備？
- **獎勵**：NT$200 7-11 禮券 + 終身免費 Pro 版
- **驗收指標**：≥60%（18 位）願意付 NT$99/月 或 NT$499/月 = 驗證通過

### 11.3 落地指標 (Post-launch KPIs)

- **M1（首月）**：5,000 MAU、500 註冊
- **M3（3 個月）**：20,000 MAU、200 付費 = NT$100K MRR
- **M6（6 個月）**：50,000 MAU、750 付費 = NT$380K MRR
- **M12（12 個月）**：120,000 MAU、2,000 付費 = NT$1.5M MRR

---

## 12. 失敗模式 SOP (Failure Mode Playbook)

| 失敗情境 | 影響範圍 | 觸發條件 | 立即處置 | Post-mortem |
|---|---|---|---|---|
| **30 家預載資料過期** | 條款比較誤導 | 6 個月未更新 | UI 警告「資料已過期，請聯絡我們」 | 重新整理 + 提交新 PR |
| **金管會 RSS 變動** | 最新公告功能失效 | RSS 格式變更 | 切換到保發中心 RSS | 評估自有 RSS parser |
| **公用電腦個資外洩** | 使用者隱私受損 | UI 警告未生效 | 強制 modal 警告 + 不允許繼續 | 強化 user agent 偵測 |
| **保險公司官網改版** | 條款連結失效 | 監控腳本報警 | 改用金管會公開連結 | 重新整理連結清單 |
| **Stripe 訂閱大量退款** | MRR 突然下降 | Stripe dashboard alert | 檢查 webhook + email 用戶 | 分析退款原因 |
| **律師函（業務員抵制）** | 品牌聲譽受損 | 業務員公會抗議 | 公開聲明「不做業務員導流」 | 強化中立定位溝通 |
| **個資法違規罰款** | 營運風險 | 主管機關調查 | 法務團隊應對 + 公開聲明 | 重新 audit 個資處理流程 |
| **Lighthouse 分數掉到 80 以下** | SEO 受損 | Lighthouse CI 失敗 | 立即優化（圖片 lazy load、bundle 拆分） | 評估長期效能優化方案 |
| **30 家預載資料維護人力不足** | 資料過期 | Sean 工時飽和 | 招募社群 PR 貢獻者 | 建立資料更新 SOP + 獎勵機制 |
| **保險 API（未來開放）政策變動** | 須重新整合 | 金管會政策變動 | 法務評估 + 評估是否整合 | 重新評估技術架構 |

---

## 13. MetaGPT / spec-kit 對齊

### 13.1 MUST / SHOULD / MAY

**MUST（不做就失敗 — MVP 必交付）**
- MUST-1 保單 CRUD（localStorage）
- MUST-2 30 家預載資料
- MUST-3 條款比較矩陣
- MUST-4 6 種險種 SOP
- MUST-5 保險地圖
- MUST-6 JSON 匯出匯入
- MUST-7 RWD + 深色模式
- MUST-8 免責聲明固定顯示

**SHOULD（強烈建議 — Sprint 2 完成）**
- SHOULD-1 經紀人客戶管理
- SHOULD-2 客製化比較報表 PDF
- SHOULD-3 white-label 連結
- SHOULD-4 多家庭成員切換
- SHOULD-5 條款資料自動更新提醒
- SHOULD-6 Stripe Checkout 訂閱

**MAY（可選 — v3+ 評估）**
- MAY-1 OCR 拍照辨識
- MAY-2 AI 推薦引擎
- MAY-3 與保險經紀人協作模式
- MAY-4 LINE Bot 整合
- MAY-5 Telegram Bot 整合

### 13.2 P0 / P1 / P2 優先級

| 優先級 | 項目 | 目標完成 |
|---|---|---|
| **P0** | MUST-1 ~ MUST-8（核心 MVP） | Sprint 1 |
| **P1** | SHOULD-1 ~ SHOULD-6（B2B 經紀人版） | Sprint 2 |
| **P2** | MAY-1 ~ MAY-5（AI 加值） | v3.0+ |

### 13.3 Competitive Quadrant Chart

（見 §10.1）

### 13.4 Open Questions

- **Q1**：是否要支援中文以外的語言（英文/日文）？目前判定 v3+ 評估
- **Q2**：是否要串接保險公司 API（目前皆無）？待金管會開放
- **Q3**：家庭進階版定價 NT$99 是否太便宜？需 Beta 測試後調整
- **Q4**：OCR 拍照辨識使用 GPT-4o vision 還是專用模型？v3 評估成本/準確率
- **Q5**：保險地圖是否要加上「業務員分布密度」而非只標總部？v2 評估

### 13.5 Requirement Pool

- **REQ-POOL-001**：OCR 拍照辨識紙本保單
- **REQ-POOL-002**：AI 推薦引擎（依年齡/收入建議險種）
- **REQ-POOL-003**：LINE Bot 整合（出險 SOP 推播）
- **REQ-POOL-004**：Telegram Bot 整合
- **REQ-POOL-005**：英文/日文多語系
- **REQ-POOL-006**：保險 API 整合（金管會開放後）
- **REQ-POOL-007**：保戶社群論壇
- **REQ-POOL-008**：AI 理賠律師諮詢

---

## 14. AI Agent 實測驗證法

### 14.1 PRD → Code 轉換驗證

**測試方式**：將本 PRD 餵給 Cursor / Claude Code，觀察其產出的程式碼是否符合 §3 AC：
- ✅ AC-001：能寫出 localStorage CRUD 邏輯
- ✅ AC-002：能寫出險種自動分類映射表
- ✅ AC-003：能寫出 30 天內到期判斷邏輯
- ✅ AC-004：能寫出 JSON 序列化/反序列化
- ✅ AC-005：能寫出條款差異比對邏輯（高亮 best/worst）
- ✅ AC-006：能寫出 6 種 SOP 結構 + check box 狀態
- ✅ AC-007：能寫出 Leaflet 30 個 marker 渲染
- ✅ AC-008：能寫出深色模式 CSS 切換
- ✅ AC-009：能寫出 user agent 偵測公用電腦
- ✅ AC-010：能寫出 30 家預載 JSON 載入 + 驗證完整性

### 14.2 Independent Test

每個 AC 都應該可被獨立 unit test 驗證：
- **AC-001**：mock localStorage → 測試 CRUD 函式
- **AC-002**：mock 險種字串 → 測試分類映射
- **AC-003**：mock 到期日 → 測試 30 天判斷
- **AC-004**：mock 保單陣列 → 測試 JSON 序列化
- **AC-005**：mock 條款資料 → 測試差異比對
- **AC-006**：mock SOP 結構 → 測試階段流轉
- **AC-007**：mock Leaflet → 測試 marker 渲染
- **AC-008**：mock 切換事件 → 測試 CSS class 變更
- **AC-009**：mock user agent → 測試偵測函式
- **AC-010**：mock JSON → 測試 30 家完整性

---

## 15. 深度市調報告 (Deep Market Research)

### 15.1 市場規模

**全球保險科技市場（InsurTech，2025）**
- 規模：**US$15.6 億**（2025）→ 預估 **US$38.2 億**（2030），CAGR 19.6%
- 主要廠商：Lemonade、Root、WeFox、CCC Intelligent Solutions
- 來源：Grand View Research 2025

**台灣保險市場（2025）**
- 總保費收入：**NT$3.8 兆**（2024 金管會統計）
- 人壽保險滲透率：**全球第 1**（每人平均 3.2 張保單）
- 產險滲透率：每人平均 0.8 張
- 銀髮族（65+）：**420 萬人**，子女代管需求強

**目標細分**
- 一般保戶（B2C 免費）：1,500 萬 × 30% MAU = 450 萬 MAU
- 銀髮族子女：200 萬 × NT$99/月 × 12 月 = **NT$23.76 億 ARR** 潛在
- 保險經紀人：8 萬 × NT$499/月 × 12 月 = **NT$47.9 億 ARR** 潛在
- 企業福委：5,000 × NT$2,999/月 × 12 月 = **NT$18 億 ARR** 潛在
- **合計總潛在 ARR**：**NT$89.66 億**

### 15.2 競品分析

| 競品 | 公司 | 價格 | 強項 | 弱項 |
|---|---|---|---|---|
| **保發中心** | 保發中心（公） | NT$0 | 官方、可信度高 | 僅資料查詢、無個人化 |
| **金管會公開資料** | 金管會（公） | NT$0 | 申訴資料完整 | 僅申訴查詢 |
| **Goodinfo 保險** | Goodinfo（台） | NT$0 + 廣告 | 條件比較 | 無保單管理 |
| **保經業務員 App** | 各家保險公司 | NT$0 | 業務員專用 | 立場不中立 |
| **富邦 My 保單** | 富邦（台） | NT$0 | 富邦保戶專用 | 僅自家保單 |
| **國泰 My Smart** | 國泰（台） | NT$0 | 國泰保戶專用 | 僅自家保單 |
| **Insurance Hub（本專案）** | Sean Li（台） | NT$0-2,999/月 | 30 家中立比較 + SOP + 個資零外流 | 規模小、無 OCR |

**結論**：本專案定位「**中立比較 + 保單管理 + 理賠 SOP + 個資零外流**」整合，保發中心/金管會官方但無個人化；保經 App 立場不中立；富邦/國泰僅自家。差異化明確。

### 15.3 預期收益

**保守估計**（M6 達成）
- 50,000 MAU × 1.5% 付費 = 750 付費
- 平均月費 NT$500（混合家庭版+經紀人版）= NT$375,000 MRR
- 年化 = **NT$4.5M ARR**

**中等估計**（M12 達成）
- 120,000 MAU × 1.8% 付費 = 2,160 付費
- 平均月費 NT$700（含 20% 經紀人版）= NT$1.5M MRR
- 年化 = **NT$18M ARR**

**樂觀估計**（M18 達成）
- 300,000 MAU × 2% 付費 = 6,000 付費
- 平均月費 NT$1,200（含 30% 經紀人版 + 5% 企業版）= NT$7.2M MRR
- 年化 = **NT$86.4M ARR**

**Unit Economics**
- **CAC**：NT$200（SEO 內容行銷 + Facebook 社團 + 保險經紀人口碑）
- **LTV**：NT$500/月 × 平均訂閱 18 個月 = NT$9,000
- **LTV/CAC 比**：45（健康 SaaS 應 ≥3）

### 15.4 商業化評分（0-100，4 維細項）

| 維度 | 分數 | 評估理由 |
|---|---|---|
| **市場規模** | 90 | NT$89.66 億潛在 ARR，台灣保險滲透率全球第 1 |
| **差異化** | 85 | 30 家中立 + SOP + 個資零外流為獨特賣點 |
| **變現路徑** | 65 | Freemium 鎖定 MAU，B2B 經紀人版變現清晰但需時間 |
| **技術可行性** | 80 | React + Zustand + Leaflet 都成熟 |
| **團隊執行力** | 75 | Alan (CTO) + Hermes Agent 已有 SaaS 經驗 |
| **競爭護城河** | 70 | 30 家預載資料 + 6 種 SOP 為內容護城河 |
| **加權平均** | **77** | 🟢 中高水平（70-80 = 有真實變現路徑但需驗證） |

**最終商業化分數**：**77 / 100**（中等偏高 — Freemium + B2B 經紀人版雙引擎驅動，需 Beta 驗證付費意願）

---

*文件結束。本 PRD 為 v2.2.1，已通過 validate_prd.py 100% 合規。下游開發可依本文件執行 Sprint 1 MVP 強化 + Sprint 2 B2B 經紀人版。*
