'use client';
import { useInsuranceStore } from '@/lib/store';
import { getInsuranceTypeLabel } from '@/lib/types';
import { COMPANIES } from '@/lib/companies';
import { useState, useMemo } from 'react';
import { GitCompare } from 'lucide-react';

export default function Compare() {
  const store = useInsuranceStore(); const policies = store.policies;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 4 ? prev : [...prev, id]
    );
  };

  const selected = useMemo(() => policies.filter((p) => selectedIds.includes(p.id)), [policies, selectedIds]);

  const rows = [
    { key: 'company', label: '保險公司', render: (p: typeof policies[0]) => COMPANIES.find((c) => c.id === p.companyId)?.name || '-' },
    { key: 'type', label: '險種', render: (p: typeof policies[0]) => getInsuranceTypeLabel(p.insuranceType) },
    { key: 'insured', label: '被保人', render: (p: typeof policies[0]) => p.insuredName },
    { key: 'coverage', label: '保額', render: (p: typeof policies[0]) => `${(p.coverageAmount / 10000).toFixed(0)} 萬` },
    { key: 'premium', label: '年繳', render: (p: typeof policies[0]) => `${(p.annualPremium / 10000).toFixed(1)} 萬` },
    { key: 'hospital', label: '住院日額', render: (p: typeof policies[0]) => p.hospitalDailyBenefit ? `${p.hospitalDailyBenefit} 元/日` : '-' },
    { key: 'cancer', label: '癌症一次金', render: (p: typeof policies[0]) => p.cancerLumpSum ? `${(p.cancerLumpSum / 10000).toFixed(0)} 萬` : '-' },
    { key: 'wait', label: '等待期', render: (p: typeof policies[0]) => p.waitingPeriod !== undefined ? `${p.waitingPeriod} 天` : '-' },
    { key: 'exclusions', label: '除外責任', render: (p: typeof policies[0]) => p.exclusions || '-' },
    { key: 'pay', label: '繳費期間', render: (p: typeof policies[0]) => p.paymentPeriod ? `${p.paymentPeriod} 年` : '-' },
    { key: 'cover', label: '保障期間', render: (p: typeof policies[0]) => p.coveragePeriod ? `${p.coveragePeriod} 年` : '終身' },
    { key: 'autoRenew', label: '自動續保', render: (p: typeof policies[0]) => p.isAutoRenew ? '✓' : '✗' },
    { key: 'end', label: '到期日', render: (p: typeof policies[0]) => p.contractEnd || '終身' },
  ];

  // best/worst 高亮：保額最高 = best；年繳最低 = best
  const bestCoverage = selected.length > 0 ? Math.max(...selected.map((p) => p.coverageAmount || 0)) : 0;
  const minPremium = selected.length > 0 ? Math.min(...selected.map((p) => p.annualPremium || Infinity)) : 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><GitCompare size={24} /> 條款比較矩陣</h1>
        <p className="text-sm opacity-60">選擇 2-4 張保單並排比較（綠色=最佳值）</p>
      </div>

      {policies.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 opacity-60">
          尚未新增保單，無法比較
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h2 className="font-bold mb-3 text-sm">選擇保單（已選 {selectedIds.length} / 4）</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {policies.map((p) => {
                const company = COMPANIES.find((c) => c.id === p.companyId);
                const checked = selectedIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex items-start gap-2 p-2 rounded border cursor-pointer text-sm ${checked ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggle(p.id)} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{company?.shortName} · {getInsuranceTypeLabel(p.insuranceType)}</div>
                      <div className="text-xs opacity-60">{p.insuredName} · {(p.coverageAmount / 10000).toFixed(0)} 萬</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {selected.length >= 2 && (
            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-3 py-2 text-left">欄位</th>
                    {selected.map((p) => {
                      const company = COMPANIES.find((c) => c.id === p.companyId);
                      return (
                        <th key={p.id} className="px-3 py-2 text-left whitespace-nowrap">
                          {company?.shortName} - {getInsuranceTypeLabel(p.insuranceType)}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="px-3 py-2 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{row.label}</td>
                      {selected.map((p) => {
                        const value = row.render(p);
                        let highlight = '';
                        if (row.key === 'coverage' && selected.length > 1 && p.coverageAmount === bestCoverage && selected.some((x) => (x.coverageAmount || 0) !== bestCoverage)) {
                          highlight = 'text-emerald-600 dark:text-emerald-400 font-bold';
                        }
                        if (row.key === 'premium' && selected.length > 1 && p.annualPremium === minPremium && selected.some((x) => (x.annualPremium || 0) !== minPremium)) {
                          highlight = 'text-emerald-600 dark:text-emerald-400 font-bold';
                        }
                        return <td key={p.id} className={`px-3 py-2 ${highlight}`}>{value}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selected.length === 1 && (
            <div className="text-center py-6 text-sm opacity-60 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              已選 1 張，再選至少 1 張才能比較
            </div>
          )}
        </>
      )}
    </div>
  );
}