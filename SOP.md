# 保險管家 — 開發與驗證 SOP

## 規格對齊狀態（2026-11-16）

- ✅ `PRD/SPEC.md` v4.0 已依三個 repo 實際程式重建；`GOAL.md` 定義 M1。
- ⚠️ 評估建議**暫緩**；Sean 決定前不開始 M1 開發。
- ⚠️ 本次只重建文件，未修改程式；本機無法執行 node，下表指令**均未在本機執行**，結果取自 GitHub Actions run `34044902212`（2026-09-06，commit `4525519`）。
- ⚠️ `insurance-claims`、`claim-helper` 尚未併入（M1 AC-004）。

## 環境

```bash
nvm use 20       # 本 repo 沒有 .nvmrc；CI 使用 Node 20
npm ci           # 使用 package-lock.json
```

## 驗證指令（依 `package.json` scripts 查證）

| 類型 | 指令 | 狀態 | 最近證據 |
|---|---|---|---|
| Install | `npm ci` | 可用 | CI 成功（未在本機執行） |
| Lint | `npm run lint` | script 存在（`eslint`），**無法使用** | CI log：`ESLint couldn't find an eslint.config.(js\|mjs\|cjs) file`；因 `continue-on-error` 未擋 CI |
| Typecheck | `npm run typecheck` | **尚未配置** | `next build` 內含 TypeScript 檢查，CI 顯示通過；獨立 `tsc --noEmit` 未執行 |
| Unit | `npm test` | **尚未配置** | CI log：`Missing script: "test"`，被 `\|\| echo` 吞掉 |
| E2E | `npm run e2e` | **尚未配置** | — |
| Build | `npm run build` | 可用（`next build`） | CI 成功：Next 16.2.10，路由 `/`、`/_not-found`（未在本機執行） |
| Dev server | `npm run dev` | 可用（`next dev`，http://localhost:3000） | 未執行 |
| Start | `npm start` | 可用（`next start`） | 未執行 |
| Format | — | **尚未配置** | — |
| Secret 掃描 | `git grep -nIE "(sk-[A-Za-z0-9]{10,}\|AKIA[0-9A-Z]{12,}\|ghp_[A-Za-z0-9]{20,}\|-----BEGIN)" -- src .github` | 可用（git 指令） | 2026-11-16 以 grep 掃描下載的原始碼：無結果 |

尚未配置或無法使用的指令不得當成通過。M1 完成時，下列指令須全部 exit 0：

```bash
npm run lint        # M1 補 eslint.config.mjs
npm run typecheck   # M1 新增
npm test            # M1 新增
npm run build
npm run e2e         # M1 新增
```

## CI 現況（`.github/workflows/ci.yml`）

- lint job `continue-on-error: true`；test job `npm test -- --run 2>&1 || echo "no test script"`：**失敗不會擋 CI**。
- build job 上傳 `.next/`。
- deploy job 部署 GitHub Pages：repo 未啟用 Pages，`actions/configure-pages` 失敗；且上傳 `./`（repo 根目錄）而非建置產物，Next 也沒有靜態輸出設定。
- 以上在 M1 AC-001 修正；本次文件 PR 不改 CI。
- 線上 `https://insurance-hub-one.vercel.app` 2026-11-16 回應 HTTP 200；部署來源與 commit 未驗證。

## M1 開發流程（Sean 決定執行後）

1. 讀 `AGENTS.md`、`GOAL.md`、`PRD/SPEC.md` 對應章節。
2. 先做 AC-001（品質閘門），再依序做 AC-002～AC-008；每個 AC 一個分支與 PR，PR 標題含 AC 編號。
3. 先寫測試再實作；只用假資料。
4. 跑上表指令，把指令、exit code、日期記到 `STATUS.md`。
5. 併入 `insurance-claims`／`claim-helper` 時只讀來源 repo，依 SPEC §11 搬邏輯與測試做法，不搬 seed 據點與電話。
6. 不 push `main`、不部署 production；合併由 Sean 決定。

## 故意不做（M1）

- ❌ 保險商品比較、推薦、導購、媒合、公司評比。
- ❌ 真實保單、理賠、診斷或家人資料。
- ❌ OCR、QR、文件上傳、理賠申請書 PDF。
- ❌ 推播、Email、LINE、SMS。
- ❌ 帳號、後端、雲端同步、金流。
- ❌ production 部署設定變更、封存或刪除候選 repo。
