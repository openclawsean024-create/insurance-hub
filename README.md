# 保險管家 Insurance Hub

> 保單資料集中管理 + 各家條款對比 + 理賠 SOP 透明化 + 台灣保險地圖。

## 🌐 Demo

**網址：** https://insurance-hub-one.vercel.app

## 📦 規格

完整規格請見 [PRD/SPEC.md](./PRD/SPEC.md)。

## 🛠 技術棧

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS 3
- Zustand (localStorage 狀態管理)
- Leaflet + OpenStreetMap (保險公司地圖)
- lucide-react (icons)

## 🚀 開發

```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## 📁 結構

```
├── PRD/SPEC.md          ← 完整產品規格（v2.2.1）
├── src/
│   ├── app/             ← Next.js App Router
│   │   ├── page.tsx     ← 主頁（6 個 tab）
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/      ← 6 個分頁組件
│   │   ├── Dashboard.tsx
│   │   ├── PolicyList.tsx
│   │   ├── PolicyForm.tsx
│   │   ├── Compare.tsx
│   │   ├── SOPs.tsx
│   │   ├── MapPage.tsx
│   │   └── SettingsPage.tsx
│   └── lib/
│       ├── types.ts     ← Policy + Company + Workflow types
│       ├── companies.ts ← 30 家保險公司預載資料
│       ├── claimSops.ts ← 6 種理賠 SOP
│       └── store.ts     ← Zustand store
├── public/              ← 靜態資源
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## ✨ 已實作 P0 功能

- F-001 保單 CRUD
- F-002 自動分類（10 種險種）
- F-003 到期提醒儀表板（30 天紅色）
- F-004 JSON 備份
- F-005 一鍵列印
- F-006 條款比較矩陣（含 best/worst 高亮）
- F-007 30 家保險公司預載
- F-008 6 種險種 SOP
- F-009 保險地圖（Leaflet + OSM）
- F-010 RWD + 深色模式

## 📊 預載資料

- 4 張示範保單（國泰醫療 / 南山癌症 / 富邦壽險 / 富邦產險車險）
- 30 家保險公司總部位置 + 申訴率
- 6 種理賠 SOP（住院 / 手術 / 癌症 / 失能 / 身故 / 意外）

## 🚢 部署

```bash
vercel --prod
```

部署到 Vercel：https://vercel.com/openclawsean024-3056

## 📜 License

MIT