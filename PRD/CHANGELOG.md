# Changelog — insurance-hub

> 所有重要變更都會記錄於此檔案。
> 格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.1.0/)

---

## v3.0.2 — 2026-09-06 · Sean 10-repo-fleet Fleet Alignment

**完成於 2026-09-06 by Sean 10-repo-fleet**

### Added
- `PRD/CHANGELOG.md`（本檔案，初始建立）
- `.github/workflows/ci.yml` — 4-job CI（lint / test / build / deploy-to-Pages）

### Notes
- `PRD/SPEC.md` 保留既有 v2.2.1 sweet-spot rewrite（703 行），**本批不重寫**既有內容
- v3.0.2 為 Fleet 對齊版，僅補 CI 基礎建設（CHL + GHA）
- 既有 SPEC v2.2.1 → v3.0.2 升級（§17 監控 / §18 維運 / §19 安全）留待後續批次
- Deploy 目標：**GitHub Pages**（純前端 SPA，無 server-side 邏輯）
- 技術棧：Next.js 16.2.10 (Turbopack) + React 19.2.4 + TypeScript 5 + ESLint 9 + Zustand 5 + Leaflet 1.9 + React-Leaflet 5 + Tailwind 3.4
- Lint：repo 無 `eslint.config.*`（ESLint 9 flat config 缺檔），CI 用 `continue-on-error: true` 容錯，待後續修
- Build：3 static routes 全綠（/, /_not-found）

---

## v2.2.1 — 2026-07-19 · Sweet-spot-driven Rewrite (Sophia CPO)

### Changed
- 完全放棄比較/媒合，MVP 聚焦「個人保險資料夾 + 理賠 SOP」
- 加入法務 review 必要條件（金管會監管）
- §11 驗證計畫 + §12 失敗 SOP + §13 spec-kit 對齊 + §15 深度市調
- Sweet Spot 分數：**5 / 7**（甜蜜點存在但金管會監管 + 付費弱）
- 行動建議：**investigate**

### Source
- 由 `Sophia (CPO) for Sean` 撰寫
- 對接技術：Alan (CTO)
- 原始碼：https://github.com/openclawsean024-create/insurance-hub

---

## v2.0 — 2026-06-25 · 加入理賠 SOP 功能 (Sophia)

## v1.0 — 2026-05-20 · 初版（保險比較 + 業務員媒合）(Sophia)
