'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useInsuranceStore } from '@/lib/store';
import { Shield, FileText, GitCompare, BookOpen, MapPin, Settings, Plus, Sun, Moon, Download, Upload, Trash2, Printer } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import PolicyList from '@/components/PolicyList';
import PolicyForm from '@/components/PolicyForm';
import Compare from '@/components/Compare';
import SOPs from '@/components/SOPs';
import SettingsPage from '@/components/SettingsPage';

// Leaflet 在 SSR 會炸 → 動態 import
const MapPage = dynamic(() => import('@/components/MapPage'), { ssr: false, loading: () => <div className="p-8 text-center opacity-60">地圖載入中…</div> });

type Tab = 'dashboard' | 'policies' | 'compare' | 'sop' | 'map' | 'settings';
type FormMode = null | 'new' | { id: string };

export default function HomePage() {
  const store = useInsuranceStore();
  const hydrated = store.hydrated;
  const [tab, setTab] = useState<Tab>('dashboard');
  const [formMode, setFormMode] = useState<FormMode>(null);

  useEffect(() => { store.hydrate(); }, []);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', store.theme === 'dark');
  }, [store.theme]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm opacity-60">
        載入中…
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'dashboard', label: '儀表板', icon: Shield },
    { id: 'policies', label: '保單', icon: FileText },
    { id: 'compare', label: '比較', icon: GitCompare },
    { id: 'sop', label: '理賠 SOP', icon: BookOpen },
    { id: 'map', label: '地圖', icon: MapPin },
    { id: 'settings', label: '設定', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-emerald-700 dark:text-emerald-400">保險管家</h1>
              <div className="text-[10px] opacity-60 font-medium uppercase tracking-wider">Insurance Hub · {store.policies.length} 張保單</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('policies')} className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700">
              <Plus size={14} /> 新增保單
            </button>
            <button
              onClick={() => useInsuranceStore.getState().update({ theme: store.theme === 'light' ? 'dark' : 'light' })}
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {store.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 text-sm font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  tab === t.id
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs text-center py-1.5 px-4">
        ⚠️ 本工具定位為資訊整理，非保險建議。具體理賠決策請洽詢您的保險公司或專業經紀人。
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {tab === 'dashboard' && <Dashboard onAddPolicy={() => setFormMode('new')} onEditPolicy={(id) => setFormMode({ id })} />}
        {tab === 'policies' && <PolicyList onEdit={(id) => setFormMode({ id })} />}
        {tab === 'compare' && <Compare />}
        {tab === 'sop' && <SOPs />}
        {tab === 'map' && <MapPage />}
        {tab === 'settings' && <SettingsPage onClear={() => setTab('dashboard')} />}
      </main>

      <footer className="text-center text-xs opacity-50 py-6 border-t border-slate-200 dark:border-slate-700 mt-8">
        Insurance Hub · 純前端 SPA · 資料 100% 在你的瀏覽器 ·
        <a className="underline ml-1" href="https://github.com/openclawsean024-create/insurance-hub/blob/main/SPEC.md" target="_blank" rel="noreferrer">SPEC</a>
      </footer>

      {formMode && (
        <PolicyForm
          policyId={formMode === 'new' ? null : formMode.id}
          onClose={() => setFormMode(null)}
        />
      )}
    </div>
  );
}