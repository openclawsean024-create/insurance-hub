# 保險管家 — 開發 SOP

## 已實作

- ✅ Next.js 16 + React 19 + TypeScript + Tailwind 3 + Zustand
- ✅ Leaflet + OpenStreetMap（純前端，無 API key）
- ✅ 30 家保險公司預載（含真實總部座標 + 申訴率示意值）
- ✅ 6 種理賠 SOP + 可建立可勾選流程
- ✅ 條款比較矩陣（含 best 保額/最低保費 高亮）
- ✅ 4 張預載示範保單

## v2 規劃（ADR-001）

SPEC ADR-001 原本寫「純前端 SPA + localStorage」，**v2 升級路徑**：

| 需求 | 加什麼 | 改什麼檔案 |
|---|---|---|
| 多裝置同步 | Supabase 多 schema | `src/lib/store.ts` 加 `syncToCloud()` |
| OCR 紙本保單 | Google Vision / GPT-4o | 新增 `src/lib/ocr.ts` |
| B2B 經紀人客戶 | NextAuth + RLS | 新增 `src/app/(auth)/` |
| PDF 報表 | jsPDF + html2canvas | 新增 `src/lib/pdf.ts` |

## 技術債

- 申訴率數值是示意值（金管會每季更新）→ v2 接金管會 RSS
- 座標是示意值 → v2 從保發中心 API 抓

## v3（不做）

- 後端 API：純前端策略維持
- 保險業務員導流：ADR-007 明文不做