# Goal — 保險管家 M1

> **建議暫緩，需 Sean 決定後才開發。** 評估結論見 `PRD/SPEC.md` §0：獲利潛力低、官方與業界已有免費替代服務、法規限制主要獲利路徑。以下 M1 只在 Sean 決定繼續時執行。

## Objective

在只使用明顯假資料、資料只存在使用者瀏覽器、不提供任何保險建議的前提下，把現有 `insurance-hub` 修成可信且可驗證的本機工具：品質閘門真正擋得住失敗；移除誤導性的公司評比與「最佳值」；修正清除、匯入、列印等資料錯誤；併入 `insurance-claims`／`claim-helper` 的理賠案件追蹤；補上繳費與到期提醒、家人分組、資料來源標示。

規格依據：`PRD/SPEC.md` v4.0（§6 FR、§8 法規、§9 M1、§11 合併清單）。

## Acceptance criteria

每條 AC 的「驗證」指令必須 exit 0。測試檔名為建議名稱，可在實作 PR 調整，但須同步更新本檔與 `SOP.md`。

- **AC-001：品質閘門真正擋得住失敗**（FR-018）
  - 新增 ESLint 9 flat config（`eslint.config.mjs`，使用 `eslint-config-next`），`npm run lint` 對現有程式 exit 0。
  - `package.json` 新增 `typecheck`（`tsc --noEmit`）、`test`（Vitest + Testing Library + jsdom）、`e2e`（Playwright，固定 `Asia/Taipei`、單 worker、每個測試清空 localStorage）；新增依賴固定版本。
  - CI 移除 lint 的 `continue-on-error` 與 test 的 `|| echo`；新增 typecheck、e2e job；移除或停用目前失敗的 GitHub Pages deploy job（部署方式由 Sean 另行決定）。
  - 新增一個刻意失敗的驗證：在本機把任一 unit test 斷言改錯後，`npm test` 必須 exit 非 0（驗證後還原，不提交）。
  - 驗證：`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e` 全部 exit 0；PR 上 GitHub Actions 全綠；`grep -nE "continue-on-error|\|\| echo" .github/workflows/ci.yml` 無結果。

- **AC-002：修正既有資料錯誤**（FR-001、FR-013、FR-014、FR-015）
  - 「清除所有資料」清空保單與理賠案件，不再回填示範資料；「重置為示範資料」保留為獨立動作。
  - 匯入 JSON 先做 schema 驗證（必要欄位、型別、`schemaVersion`），缺 `workflows` 時補空陣列；驗證失敗不改動現有資料。匯出檔加 `schemaVersion` 與「含個人資料，請妥善保管」說明欄位。
  - 保單頁可直接開啟新增表單；header「新增保單」開啟表單而非只切換 tab。
  - 列印只輸出保單總表（列印樣式隱藏導覽與按鈕）。
  - 頁尾 SPEC 連結改為 `PRD/SPEC.md`。
  - 驗證：`npm test -- tests/store.test.ts tests/import-export.test.ts`；`npm run e2e -- tests/e2e/data-actions.spec.ts`（清除後保單數為 0、匯入壞檔顯示錯誤且資料不變、從保單頁新增成功）。

- **AC-003：合規邊界與移除誤導資訊**（FR-009、FR-012、FR-017；SPEC §8.2）
  - 移除申訴率、業務量等公司評比欄位與地圖紅綠標示；地圖 marker 改為中性色。
  - 保單並排檢視移除「最佳值」高亮與「綠色=最佳值」說明，只並列數字。
  - 首次使用顯示說明並需按「我了解」：本工具只整理使用者自行輸入的資料、不提供保險建議、不推薦或銷售保險、資料只存在此瀏覽器、替家人建檔請先取得同意；確認狀態存 localStorage。
  - 新增字詞掃描測試：`src/` 的使用者可見字串不得出現「推薦」「最佳」「最划算」「建議投保」「CP 值」。
  - 驗證：`npm test -- tests/neutral-wording.test.ts`；`npm run e2e -- tests/e2e/first-run-notice.spec.ts`；`git grep -nE "complaintRate|最佳值" -- src` 無結果。

- **AC-004：理賠案件追蹤（併入 insurance-claims／claim-helper）**（FR-006、FR-007、FR-008；SPEC §11.1 第 1–5、7 項）
  - 新增 `src/lib/claims.ts` 純函式：建立案件（連結保單、理賠類型、出險日、送件日、申請金額、事由備註）；依 SOP 類型展開個別文件項目；進度狀態機（準備文件→已送件→補件中→已核定→已入帳，另有「不予理賠」與「結案」，允許回退一步）；計算請求權時效日（出險日起 2 年，標示「以契約與法律為準」）；補件期限。
  - 建立案件時 `insuranceType` 取自所選 SOP 或連結保單，不再寫死 `medical`。
  - UI：可列出案件、推進／回退狀態、勾選文件、顯示「x / y 已備齊」；事由備註預設摺疊。
  - 理賠 SOP 每頁加註「實際應備文件以各保險公司理賠申請書為準」；移除自訂的 T+3／T+7 期限，改為「建議盡早」與時效說明。
  - 儀表板顯示進行中案件數與 90 天內屆滿時效的案件。
  - 驗證：`npm test -- tests/claims.test.ts`（狀態轉換表逐格、文件展開數量、時效日跨閏年、補件期限）；`npm run e2e -- tests/e2e/claim-case.spec.ts`（從保單建立案件→勾選 2 份文件→推進兩次→reload 後狀態保留）。

- **AC-005：到期與繳費提醒（App 內）**（FR-004）
  - 保單新增 `premiumFrequency`（年／半年／季／月／躉繳）與 `nextPremiumDueDate`；舊資料遷移時可為空。
  - 純函式 `buildReminders(policies, claims, today)`：合約到期、繳費日、補件期限、理賠時效，分 30／7／1 天與已逾期四級；終身保單只計繳費日。
  - 儀表板顯示提醒清單並可依類型篩選；不使用瀏覽器通知、不發送任何訊息。
  - 驗證：`npm test -- tests/reminders.test.ts`（固定 `today`、Asia/Taipei、月底與閏年邊界）；`npm run e2e -- tests/e2e/reminders.spec.ts`。

- **AC-006：依被保人／家人分組**（FR-005）
  - 保單列表與儀表板可依被保人篩選；儀表板顯示每位被保人的保單數與年繳保費。
  - 「為家人代管」改為選擇或新增家人名稱（只存本機）。
  - 驗證：`npm test -- tests/family.test.ts`；`npm run e2e -- tests/e2e/family-filter.spec.ts`。

- **AC-007：資料來源標示與只用明顯假資料**（FR-010、FR-016；SPEC §8.3）
  - `Company` 新增 `sourceUrl`、`verifiedAt`；未查證的電話、地址、條款網址不顯示，改顯示「未查證，請以官網為準」與官網連結（官網網址同樣需查證，否則不顯示）。
  - 示範保單改為明顯假資料：被保人名稱加「示範」前綴、保單號碼以 `DEMO-` 開頭、`isDemo: true`；UI 顯示示範標記並提供「清除示範資料」。
  - 新增 fixture 安全測試：seed 與測試資料中的個人電話只能是 `0900-000-xxx` 格式、Email 只能是 `@example.com`、示範保單號碼必須以 `DEMO-` 開頭；每筆有 `contactPhone` 的公司必須有 `sourceUrl` 與 `verifiedAt`。
  - 驗證：`npm test -- tests/fixtures-safety.test.ts tests/companies.test.ts`；`git grep -nIE "(sk-[A-Za-z0-9]{10,}|AKIA[0-9A-Z]{12,}|ghp_[A-Za-z0-9]{20,}|-----BEGIN)" -- src tests .github` 無結果。

- **AC-008：本機隱私邊界**（SPEC §7、§8.1）
  - 程式不得把保單或理賠資料送到任何網路位置；不加入分析、廣告或錯誤回報 SDK。
  - Leaflet marker 圖示改用本機資源，不再從 unpkg 載入；地圖圖磚（OSM）為唯一允許的外部請求，且請求網址不含使用者資料。
  - 保單列表提供「遮罩保單號碼」切換（預設遮罩中段）。
  - 驗證：`npm run e2e -- tests/e2e/network-privacy.spec.ts`（攔截所有請求，斷言除 OSM 圖磚外沒有外部請求，且任何請求 URL／body 不含測試保單號碼與姓名）；`git grep -nE "fetch\(|XMLHttpRequest|navigator\.sendBeacon|gtag|googletagmanager|mixpanel|sentry" -- src` 無結果；`npm test -- tests/masking.test.ts`。

## Out of scope

- 真實保單、真實理賠或診斷資料、真實家人資料；任何試用者資料。
- 保險商品比較、推薦、導購、業務員媒合、轉介報酬、保險商品廣告（永久不做，見 SPEC §3、§8.2）。
- 申訴率等公司評比資料（除非日後有官方出處與律師意見，另案處理）。
- 條款全文爬取或轉載。
- QR／條碼掃描、OCR、理賠文件上傳、理賠申請書代填或 PDF 產生。
- 瀏覽器推播、Email、LINE、SMS 等任何通知發送。
- 帳號、後端、資料庫、雲端同步、加密備份（M2 之後）。
- 金流、訂閱、方案限制。
- 業務員／經紀人版。
- production 部署設定變更（Vercel、GitHub Pages 啟用）；封存、刪除或改名 `insurance-claims`、`claim-helper`。

## Exit gate

- Sean 已明確決定不採「暫緩」建議、要執行 M1。
- AC-001～AC-008 的驗證指令全部 exit 0，指令、exit code 與日期記錄於 `STATUS.md`。
- 實作 PR 的 GitHub Actions 全綠（lint、typecheck、test、build、e2e）。
- `PRD/SPEC.md` §11.1 每個「要搬」項目都有對應模組與測試；§11.2「不搬」原因仍成立。
- Sean 覆審 SPEC §14 待決事項後，才可進入 M2（訪談、律師意見、通知與加密備份）。
