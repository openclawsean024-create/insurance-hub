# AGENTS.md — 保險管家（insurance-hub）

> 目前評估建議為**暫緩**（`PRD/SPEC.md` §0）。Sean 決定執行 M1 前，不要開始功能開發。

## 1. 權威文件與範圍

- 規格：[`PRD/SPEC.md`](./PRD/SPEC.md) v4.0（評估、FR 狀態、法規邊界、合併清單、里程碑）。
- 目前目標：[`GOAL.md`](./GOAL.md)（只含 M1）。
- 驗證指令：[`SOP.md`](./SOP.md)；目前狀態：[`STATUS.md`](./STATUS.md)。
- `PRD/CHANGELOG.md` 為歷史紀錄；舊版 SPEC v2.2.1 的數字與 ADR 不再作為依據。
- `insurance-claims`、`claim-helper` 是候選併入 repo，**只讀**；搬什麼、不搬什麼以 SPEC §11 為準。

## 2. 專案結構

```
src/
├── app/            # Next.js App Router：layout.tsx、page.tsx（單一路由，6 個 tab）、globals.css
├── components/     # Dashboard、PolicyList、PolicyForm、Compare、SOPs、MapPage、SettingsPage
└── lib/
    ├── types.ts      # Policy、Company、ClaimWorkflow、示範保單、STORAGE_KEY
    ├── store.ts      # Zustand store + 手寫 localStorage persist（key: insurance-hub-v1）
    ├── companies.ts  # 30 家保險公司參考資料（未查證，見 SPEC §8.3）
    └── claimSops.ts  # 6 種理賠 SOP 文字
PRD/                # SPEC.md、CHANGELOG.md
dashboard.html      # 與本產品無關的通用樣板，不參與 build
vercel.json         # Vercel 設定
```

## 3. 技術棧

| 項目 | 版本／說明 |
|---|---|
| 框架 | Next.js 16.2.10（lockfile），App Router |
| UI | React 19.2、Tailwind CSS 3.4（`darkMode: 'class'`）、lucide-react |
| 狀態 | Zustand 5；localStorage 持久化寫在 `store.ts` |
| 地圖 | Leaflet 1.9 + react-leaflet 5，OSM 圖磚；`MapPage` 以 `dynamic(..., { ssr: false })` 載入 |
| 語言 | TypeScript 5 strict，別名 `@/* → src/*` |
| Lint | ESLint 9 + `eslint-config-next`，**缺 `eslint.config.*`**（M1 AC-001） |
| 測試 | 無（M1 AC-001 新增 Vitest、Playwright） |
| 資料 | 無後端、無資料庫；所有資料在使用者瀏覽器 |

## 4. 開發規則

1. **不提供保險建議**：不得新增推薦、評分、「最佳／最划算」、商品比較、投保建議、業務員媒合、導購連結或轉介報酬機制。需求若碰到這條線，先停下來改 SPEC 並請 Sean 決定（SPEC §8.2）。
2. **資料只存本機**：M1 不得把保單、理賠或家人資料送到任何網路位置；不得加入分析、廣告、錯誤回報 SDK。
3. **只用假資料**：seed、測試、fixture、文件範例只能用明顯假資料（姓名加「示範」或「測試」前綴、保單號碼 `DEMO-` 開頭、電話 `0900-000-xxx`、Email `@example.com`）。發現疑似真實個資時不要複製，回報檔案路徑。
4. **參考資料要有來源**：保險公司電話、地址、網址、統計數字必須附 `sourceUrl` 與 `verifiedAt`；沒有可靠出處就不顯示，不得自行編造或沿用「示意值」。
5. **不得提交憑證**：不得把 token、API key、`.env*` 提交進 repo。
6. **測試不可為了通過而改斷言**：不得刪除、跳過（`.skip`／`.only`）、放寬斷言或改期望值讓測試通過；行為變更需在 PR 說明並對應 FR／AC。
7. **不擴大 scope**：OCR、QR、文件上傳、推播、帳號、雲端、金流、業務員版不在 M1。
8. **Git**：從 `main` 開分支、以 PR 合併；不直接 push `main`、不 force push、不改 repo 設定；未經 Sean 同意不部署 production、不封存或刪除任何 repo。
9. **Commit 格式**：`<type>(scope): <說明或 FR/AC 編號>`，例如 `feat(claims): AC-004 claim case state machine`。

## 5. 驗證

指令與目前可用狀態見 [`SOP.md`](./SOP.md)。尚未配置的指令（typecheck、test、e2e、format）不得宣稱已通過；`npm run lint` 目前因缺設定檔失敗。
