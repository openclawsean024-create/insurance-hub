'use client';
import { useInsuranceStore } from '@/lib/store';
import { useRef } from 'react';
import { Settings, Download, Upload, Trash2, Printer, RotateCcw } from 'lucide-react';

export default function SettingsPage({ onClear }: { onClear: () => void }) {
  const store = useInsuranceStore();
  const { importAll, reset } = store;
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { policies: store.policies, workflows: store.workflows, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insurance-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.policies || !Array.isArray(data.policies)) {
          alert('檔案格式不正確（缺少 policies 陣列）');
          return;
        }
        if (!confirm(`將匯入 ${data.policies.length} 張保單。繼續？`)) return;
        importAll(data);
        alert('匯入成功');
      } catch (err) {
        alert('JSON 解析失敗：' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Settings size={24} /> 設定</h1>
        <p className="text-sm opacity-60">備份與管理你的保單資料</p>
      </div>

      <section className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h2 className="font-bold">資料備份</h2>
        <p className="text-sm opacity-60">所有保單資料儲存在瀏覽器 localStorage，建議定期匯出 JSON 備份。</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} disabled={store.policies.length === 0} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium disabled:opacity-40 flex items-center gap-1">
            <Download size={14} /> 匯出 JSON ({store.policies.length})
          </button>
          <label className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium cursor-pointer flex items-center gap-1">
            <Upload size={14} /> 匯入 JSON
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button onClick={handlePrint} disabled={store.policies.length === 0} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 text-sm font-medium disabled:opacity-40 flex items-center gap-1">
            <Printer size={14} /> 列印保單清單
          </button>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-amber-200 dark:border-amber-800 space-y-3">
        <h2 className="font-bold flex items-center gap-2"><RotateCcw size={16} /> 重置為預載範例</h2>
        <p className="text-sm opacity-60">恢復為 4 張預載範例保單（會清除現有資料）。</p>
        <button onClick={() => {
          if (confirm('將清除所有保單並重置為 4 張預載範例。繼續？')) {
            reset();
            onClear();
          }
        }} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium">
          重置
        </button>
      </section>

      <section className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-red-200 dark:border-red-800 space-y-3">
        <h2 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><Trash2 size={16} /> 危險區</h2>
        <p className="text-sm opacity-60">清除所有保單與理賠流程（無法復原，建議先匯出備份）。</p>
        <button onClick={() => {
          if (confirm('⚠️ 將清除所有資料，無法復原。確定？')) {
            reset();
            onClear();
          }
        }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
          🗑️ 清除所有資料
        </button>
      </section>

      <section className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h2 className="font-bold mb-2">關於</h2>
        <ul className="text-sm opacity-70 space-y-1">
          <li>版本：v1.0 MVP</li>
          <li>儲存：localStorage（純前端、零後端）</li>
          <li>地圖：Leaflet + OpenStreetMap</li>
          <li>部署：Vercel</li>
          <li>原始碼：<a className="text-emerald-600 underline" href="https://github.com/openclawsean024-create/insurance-hub" target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
      </section>
    </div>
  );
}