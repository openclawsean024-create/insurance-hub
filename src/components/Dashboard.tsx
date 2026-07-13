'use client';
import { useInsuranceStore } from '@/lib/store';
import { INSURANCE_TYPE_LABELS, getInsuranceTypeLabel, type InsuranceType } from '@/lib/types';
import { COMPANIES } from '@/lib/companies';
import { useMemo } from 'react';
import { Plus, FileText, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard({ onAddPolicy, onEditPolicy }: { onAddPolicy: () => void; onEditPolicy: (id: string) => void }) {
  const store = useInsuranceStore(); const policies = store.policies;

  const stats = useMemo(() => {
    const totalCoverage = policies.reduce((sum, p) => sum + (p.coverageAmount || 0), 0);
    const totalAnnualPremium = policies.reduce((sum, p) => sum + (p.annualPremium || 0), 0);
    const byType: Record<string, number> = {};
    policies.forEach((p) => {
      byType[p.insuranceType] = (byType[p.insuranceType] || 0) + 1;
    });
    const today = new Date();
    const expiringSoon = policies.filter((p) => {
      if (!p.contractEnd) return false;
      const end = new Date(p.contractEnd);
      const diff = (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    });
    const expired = policies.filter((p) => {
      if (!p.contractEnd) return false;
      return new Date(p.contractEnd).getTime() < today.getTime();
    });
    return { totalCoverage, totalAnnualPremium, byType, expiringSoon, expired };
  }, [policies]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp size={24} /> 儀表板</h1>
          <p className="text-sm opacity-60">你的保單總覽</p>
        </div>
        <button onClick={onAddPolicy} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium flex items-center gap-1">
          <Plus size={14} /> 新增保單
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="保單總數" value={`${policies.length}`} unit="張" icon={<FileText size={16} />} />
        <StatCard label="總保障額度" value={`${(stats.totalCoverage / 10000).toFixed(0)}`} unit="萬" icon={<TrendingUp size={16} />} />
        <StatCard label="年繳保費" value={`${(stats.totalAnnualPremium / 10000).toFixed(1)}`} unit="萬" icon={<TrendingUp size={16} />} />
        <StatCard
          label="30 天內到期"
          value={`${stats.expiringSoon.length}`}
          unit="張"
          icon={<Calendar size={16} />}
          highlight={stats.expiringSoon.length > 0}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="font-bold mb-3">險種分佈</h2>
          {Object.keys(stats.byType).length === 0 ? (
            <p className="text-sm opacity-60">尚未新增保單</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(stats.byType).map(([type, count]) => {
                const label = getInsuranceTypeLabel(type);
                const pct = (count / policies.length) * 100;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{label}</span>
                      <span className="opacity-60">{count} 張</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            30 天內到期保單
          </h2>
          {stats.expiringSoon.length === 0 ? (
            <p className="text-sm opacity-60">沒有 30 天內到期的保單</p>
          ) : (
            <ul className="space-y-2">
              {stats.expiringSoon.map((p) => {
                const days = Math.ceil((new Date(p.contractEnd!).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const company = COMPANIES.find((c) => c.id === p.companyId);
                return (
                  <li
                    key={p.id}
                    onClick={() => onEditPolicy(p.id)}
                    className="flex justify-between text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-2 rounded cursor-pointer hover:bg-red-100"
                  >
                    <span>
                      <span className="font-medium">{company?.shortName}</span> · {getInsuranceTypeLabel(p.insuranceType)} · {p.insuredName}
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-bold">剩 {days} 天</span>
                  </li>
                );
              })}
            </ul>
          )}
          {stats.expired.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-red-600 dark:text-red-400">⚠️ {stats.expired.length} 張保單已過期</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon, highlight }: { label: string; value: string; unit: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
      <div className="text-xs opacity-60 mb-1 flex items-center gap-1">{icon} {label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs opacity-60">{unit}</span>
      </div>
    </div>
  );
}