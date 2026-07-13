'use client';
import { CLAIM_SOPS, INSURANCE_TYPE_TO_SOP } from '@/lib/claimSops';
import { useInsuranceStore } from '@/lib/store';
import { useState } from 'react';
import { BookOpen, Check, Plus } from 'lucide-react';

export default function SOPs() {
  const { addWorkflow } = useInsuranceStore();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const startWorkflow = (sopKey: string, sopTitle: string) => {
    const sop = CLAIM_SOPS[sopKey];
    addWorkflow({
      insuranceType: 'medical',
      currentStage: 'reported',
      checklist: sop.stages.map((s) => ({
        item: `[${s.stage}] ${s.items.join('、')}`,
        isCompleted: false,
      })),
      notes: `已開始：${sopTitle}`,
    });
  };

  const list = Object.entries(CLAIM_SOPS);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen size={24} /> 理賠 SOP 流程</h1>
        <p className="text-sm opacity-60">出險時的標準作業流程，T+0 / T+3 / T+7 / T+14 階段檢查表</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(([key, sop]) => (
          <div key={key} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition">
            <h3 className="font-bold text-lg mb-1">{sop.title}</h3>
            <p className="text-sm opacity-60 mb-3">{sop.stages.length} 個階段 · {sop.stages.reduce((sum, s) => sum + s.items.length, 0)} 個檢查項目</p>
            <button onClick={() => setActiveKey(activeKey === key ? null : key)} className="text-sm text-emerald-600 hover:underline">
              {activeKey === key ? '收起' : '展開 SOP'}
            </button>
            {activeKey === key && (
              <div className="mt-3 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                {sop.stages.map((stage) => (
                  <div key={stage.stage}>
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{stage.stage}</span>
                      <span className="text-xs opacity-60">{stage.days}</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {stage.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5">☐</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <button onClick={() => startWorkflow(key, sop.title)} className="w-full mt-2 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-1">
                  <Plus size={14} /> 建立可勾選流程
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}