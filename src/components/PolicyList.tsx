'use client';
import { useInsuranceStore } from '@/lib/store';
import { INSURANCE_TYPE_LABELS, getInsuranceTypeLabel, type InsuranceType } from '@/lib/types';
import { COMPANIES } from '@/lib/companies';
import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function PolicyList({ onEdit }: { onEdit: (id: string) => void }) {
  const store = useInsuranceStore();
  const { deletePolicy } = store;
  const [filterType, setFilterType] = useState<InsuranceType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return store.policies.filter((p) => {
      if (filterType !== 'all' && p.insuranceType !== filterType) return false;
      if (search) {
        const company = COMPANIES.find((c) => c.id === p.companyId)?.name || '';
        const q = search.toLowerCase();
        if (
          !p.policyNumber.toLowerCase().includes(q) &&
          !p.insuredName.toLowerCase().includes(q) &&
          !company.toLowerCase().includes(q) &&
          !p.notes?.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [store.policies, filterType, search]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">保單管理</h1>
          <p className="text-sm opacity-60">共 {store.policies.length} 張{filtered.length !== store.policies.length && `（顯示 ${filtered.length}）`}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            placeholder="搜尋保單號碼 / 被保人 / 公司..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as InsuranceType | 'all')}
          className="px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
        >
          <option value="all">全部險種</option>
          {Object.entries(INSURANCE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {store.policies.length === 0 ? (
            <p className="opacity-60">尚未新增保單。點上方「新增保單」開始。</p>
          ) : (
            <p className="opacity-60">沒有符合條件的保單</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left">保險公司</th>
                <th className="px-3 py-2 text-left">險種</th>
                <th className="px-3 py-2 text-left">被保人</th>
                <th className="px-3 py-2 text-right">保額</th>
                <th className="px-3 py-2 text-right">年繳</th>
                <th className="px-3 py-2 text-left">到期</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const company = COMPANIES.find((c) => c.id === p.companyId);
                const today = new Date();
                const days = p.contractEnd ? Math.ceil((new Date(p.contractEnd).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
                const expiringSoon = days !== null && days >= 0 && days <= 30;
                const expired = days !== null && days < 0;
                return (
                  <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-3 py-2">{company?.shortName || p.companyId}</td>
                    <td className="px-3 py-2">{getInsuranceTypeLabel(p.insuranceType)}</td>
                    <td className="px-3 py-2">{p.insuredName}</td>
                    <td className="px-3 py-2 text-right">{(p.coverageAmount / 10000).toFixed(0)} 萬</td>
                    <td className="px-3 py-2 text-right">{(p.annualPremium / 10000).toFixed(1)} 萬</td>
                    <td className={`px-3 py-2 ${expiringSoon ? 'text-red-600 font-medium' : expired ? 'text-red-800 font-bold' : ''}`}>
                      {p.contractEnd || '終身'}
                      {days !== null && days >= 0 && (
                        <span className="text-xs ml-1 opacity-60">({days}天)</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => onEdit(p.id)} className="text-emerald-600 hover:underline mr-2 text-xs inline-flex items-center gap-1">
                        <Edit2 size={10} /> 編輯
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`確定刪除「${company?.name} - ${getInsuranceTypeLabel(p.insuranceType)}」？`)) deletePolicy(p.id);
                        }}
                        className="text-red-600 hover:underline text-xs inline-flex items-center gap-1"
                      >
                        <Trash2 size={10} /> 刪除
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}