# Status — insurance-hub（保險管家）

- 產品：保險管家（保單集中管理＋理賠 SOP）
- 主 repo：`openclawsean024-create/insurance-hub`（`main` @ `4525519`）
- 候選併入（只讀）：`insurance-claims`（`main` @ `d67deca`）、`claim-helper`（`main` @ `9e0589b`）
- 規格：`PRD/SPEC.md` v4.0；目標：`GOAL.md`（M1）
- 狀態：🟠 **文件重建完成，尚未開發；評估建議暫緩，待 Sean 決定**（2026-11-16）

## 評估摘要（SPEC §0）

| 項目 | 結論 |
|---|---|
| 完成度 | 35 / 100 |
| 獲利潛力 | 低 |
| 獲利模式 | 免費增值（備選：持照業務員 SaaS，待驗證） |
| 建議 | 暫緩 |
| 主 repo | 維持 `insurance-hub` |

## 目前狀態摘要

- 純前端 Next.js 16 單頁工具，6 個 tab：儀表板、保單、比較、理賠 SOP、地圖、設定；資料存 localStorage（`insurance-hub-v1`）。
- 可用：保單 CRUD、搜尋篩選、儀表板、30 天到期提示、自有保單並排、6 種 SOP 文字、地圖、JSON 匯出入。
- 問題：理賠流程建立後無 UI；「清除所有資料」實為重置示範資料；列印印出設定頁；申訴率為示意值卻以紅綠標示公司；「最佳值」標示與不提供建議的定位衝突；無測試、無 ESLint 設定；CI 吞錯且 deploy 失敗。
- 候選 repo：`insurance-claims` 有理賠 6 階段狀態機、文件清單與 11 個測試，但入口 `index.html` 轉址導致 React app 未被打包；`claim-helper` 只有 scaffold 與需求清單。

## FR 對照（以 `main` 程式為準）

| FR | 需求 | 優先 | 狀態 | 所在 repo |
|---|---|---|---|---|
| FR-001 | 保單建檔、編輯、刪除 | P0 | 已實作 | insurance-hub |
| FR-002 | 搜尋與險種篩選 | P0 | 已實作 | insurance-hub |
| FR-003 | 儀表板統計 | P0 | 已實作 | insurance-hub |
| FR-004 | 到期與繳費提醒（App 內） | P0 | 部分 | insurance-hub |
| FR-005 | 依被保人／家人分組 | P1 | 部分 | insurance-hub |
| FR-006 | 理賠 SOP 文件清單 | P0 | 部分 | insurance-hub |
| FR-007 | 理賠案件追蹤 | P0 | 部分 | insurance-hub、insurance-claims、claim-helper（需求） |
| FR-008 | 理賠請求權時效提醒 | P1 | 未實作 | — |
| FR-009 | 自有保單並排（中立） | P1 | 部分 | insurance-hub |
| FR-010 | 保險公司聯絡目錄（附來源） | P1 | 部分 | insurance-hub |
| FR-011 | 保險公司地圖 | P2 | 部分 | insurance-hub |
| FR-012 | 申訴率等公司評比 | — | 移除 | insurance-hub |
| FR-013 | JSON 匯出入（驗證、版本、警示） | P0 | 部分 | insurance-hub |
| FR-014 | 清除全部／清除示範資料 | P0 | 部分 | insurance-hub |
| FR-015 | 列印保單總表 | P1 | 部分 | insurance-hub |
| FR-016 | 示範資料區隔 | P0 | 未實作 | — |
| FR-017 | 合規提示與首次使用確認 | P0 | 部分 | insurance-hub |
| FR-018 | 品質閘門 | P0 | 未實作 | — |
| FR-019 | 瀏覽器通知、PWA | P1 | 未實作 | — |
| FR-020 | 加密備份 | P1 | 未實作 | — |
| FR-021 | QR／條碼建檔 | P2 | 未實作 | — |
| FR-022 | 本機 OCR | P2 | 未實作 | — |
| FR-023 | 理賠文件上傳（本機加密） | P2 | 未實作 | claim-helper（需求） |
| FR-024 | 理賠申請書草稿／PDF | P2 | 未實作 | — |
| FR-025 | 帳號與雲端同步 | P2 | 未實作 | — |
| FR-026 | 業務員／經紀人版 | P2 | 未實作 | — |
| FR-027 | 付費方案限制 | P2 | 未實作 | — |

小計：已實作 3、部分 12、未實作 11、移除 1。

## Deterministic checks

本機 `/usr/bin/git`、`/usr/bin/python3` 受 Xcode 授權限制，且未安裝 node：**以下 npm 指令均未在本機執行**，證據取自 GitHub Actions。

| 來源 | 指令 | 結果 |
|---|---|---|
| insurance-hub CI run `34044902212`（2026-09-06） | `npm run lint` | 失敗（缺 `eslint.config.*`），被 `continue-on-error` 忽略 |
| 同上 | `npm test -- --run \|\| echo` | `Missing script: "test"`，被吞掉 |
| 同上 | `npm run build` | 成功，Next 16.2.10 |
| 同上 | deploy（GitHub Pages） | 失敗：repo 未啟用 Pages |
| insurance-claims CI run `34026186986`（2026-09-06） | `npm test` | 11 passed |
| 同上 | `npm run build` | 成功但只轉換 1 個 module（轉址頁），React app 未打包 |
| 同上 | deploy | 失敗：缺 `environment` |
| claim-helper CI run `35452582736`（2026-09-19） | — | 失敗且沒有任何 job（推測 workflow 解析錯誤，未驗證） |
| 本機 grep（2026-11-16） | 憑證樣式掃描（三個 repo） | 無結果 |
| curl（2026-11-16） | `https://insurance-hub-one.vercel.app` | HTTP 200；對應 commit 未驗證 |

## 已知風險與問題

- **法規**：比較頁「最佳值」與地圖申訴率紅綠標示，可能被視為評比或建議；理賠與診斷資料屬特種個資候選。見 SPEC §8。
- **資料來源**：`src/lib/companies.ts` 的申訴率、業務量、座標為示意值；客服電話有重複（中信產險與泰安產險同號），疑似未查證；`termsUrl` 多為猜測路徑。
- **候選 repo 資料**：`insurance-claims/web/src/lib/db.ts` 把疑似捏造的電話掛在真實公司與醫院名下，並有不存在的「行天宮鑑識中心」；`ContactPage.tsx` 寫死 `0800-123-456`。不搬入。
- **示範資料**：`src/lib/types.ts` 的 4 筆示範保單使用常見假名，未標示示範，與使用者資料混在一起（M1 AC-007）。未發現真實個資或憑證。
- **品質**：無測試；lint 設定缺檔；CI 吞錯；deploy job 上傳 repo 根目錄。
- **文件不符**：README、舊 SPEC、舊 SOP 與程式不一致之處見 SPEC §13。

## 本次變更

- 重寫 `PRD/SPEC.md`（v4.0）與 `SOP.md`；新增 `GOAL.md`、`AGENTS.md`、`STATUS.md`。未修改任何程式碼、設定或測試；`PRD/CHANGELOG.md` 未動。

## 待決事項（SPEC §14）

1. 接受「暫緩」或執行 M1；若都不做，三個 repo 是否封存。
2. 是否接受移除申訴率與「最佳值」標示。
3. M2 是否委請律師確認招攬邊界、特種個資、代辦理賠。
4. M2 驗證方向：家庭使用者、持照業務員，或兩者。
5. 部署方式：Vercel、GitHub Pages 靜態輸出，或暫停公開部署。
6. 合併後 `insurance-claims`、`claim-helper` 是否封存。
