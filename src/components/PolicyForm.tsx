'use client';
import { useInsuranceStore } from '@/lib/store';
import { INSURANCE_TYPE_LABELS, type InsuranceType, type Policy } from '@/lib/types';
import { COMPANIES } from '@/lib/companies';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PolicyForm({ policyId, onClose }: { policyId: string | null; onClose: () => void }) {
  const store = useInsuranceStore();
  const { addPolicy, updatePolicy } = store;
  const existing = policyId ? store.policies.find((p) => p.id === policyId) : null;

  const [form, setForm] = useState<Partial<Policy>>(
    existing || {
      companyId: COMPANIES[0].id,
      policyNumber: '',
      insuranceType: 'medical',
      insuredName: '',
      applicantName: '',
      coverageAmount: 1000000,
      annualPremium: 10000,
      paymentPeriod: 20,
      coveragePeriod: 30,
      isAutoRenew: false,
      contractStart: new Date().toISOString().slice(0, 10),
      contractEnd: '',
      hospitalDailyBenefit: 0,
      cancerLumpSum: 0,
      waitingPeriod: 30,
      exclusions: '',
      notes: '',
      isManagedForFamily: false,
    }
  );

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policyNumber || !form.insuredName || !form.companyId || !form.insuranceType) {
      alert('請填寫必填欄位');
      return;
    }
    if (policyId) {
      updatePolicy(policyId, form as Policy);
    } else {
      addPolicy(form as Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 pb-2">
          <h2 className="text-xl font-bold">{policyId ? '編輯保單' : '新增保單'}</h2>
          <button type="button" onClick={onClose} className="opacity-60 hover:opacity-100"><X size={20} /></button>
        </div>

        <Field label="保險公司 *">
          <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
            {COMPANIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label="保單號碼 *">
            <input type="text" required value={form.policyNumber || ''} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
          <Field label="險種 *">
            <select value={form.insuranceType} onChange={(e) => setForm({ ...form, insuranceType: e.target.value as InsuranceType })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm">
              {Object.entries(INSURANCE_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label="被保人 *">
            <input type="text" required value={form.insuredName || ''} onChange={(e) => setForm({ ...form, insuredName: e.target.value })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
          <Field label="要保人">
            <input type="text" value={form.applicantName || ''} onChange={(e) => setForm({ ...form, applicantName: e.target.value })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label="保額 (NT$) *">
            <input type="number" required min={0} value={form.coverageAmount || 0} onChange={(e) => setForm({ ...form, coverageAmount: Number(e.target.value) })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
          <Field label="年繳保費 (NT$) *">
            <input type="number" required min={0} value={form.annualPremium || 0} onChange={(e) => setForm({ ...form, annualPremium: Number(e.target.value) })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label="繳費期間 (年)">
            <input type="number" min={1} value={form.paymentPeriod || ''} onChange={(e) => setForm({ ...form, paymentPeriod: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
          <Field label="保障期間 (年)">
            <input type="number" min={1} value={form.coveragePeriod || ''} onChange={(e) => setForm({ ...form, coveragePeriod: e.target.value ? Number(e.target.value) : undefined })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label="合約起日">
            <input type="date" value={form.contractStart?.slice(0, 10) || ''} onChange={(e) => setForm({ ...form, contractStart: e.target.value })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
          <Field label="合約迄日（終身免填）">
            <input type="date" value={form.contractEnd?.slice(0, 10) || ''} onChange={(e) => setForm({ ...form, contractEnd: e.target.value || undefined })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <Field label="住院日額 (NT$)">
            <input type="number" min={0} value={form.hospitalDailyBenefit || 0} onChange={(e) => setForm({ ...form, hospitalDailyBenefit: Number(e.target.value) })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
          <Field label="癌症一次金 (NT$)">
            <input type="number" min={0} value={form.cancerLumpSum || 0} onChange={(e) => setForm({ ...form, cancerLumpSum: Number(e.target.value) })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
          <Field label="等待期 (天)">
            <input type="number" min={0} value={form.waitingPeriod || 0} onChange={(e) => setForm({ ...form, waitingPeriod: Number(e.target.value) })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          </Field>
        </div>

        <Field label="除外責任">
          <textarea rows={2} value={form.exclusions || ''} onChange={(e) => setForm({ ...form, exclusions: e.target.value })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
        </Field>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isAutoRenew || false} onChange={(e) => setForm({ ...form, isAutoRenew: e.target.checked })} />
            自動續保
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isManagedForFamily || false} onChange={(e) => setForm({ ...form, isManagedForFamily: e.target.checked })} />
            為家人代管
          </label>
          {form.isManagedForFamily && (
            <input type="text" placeholder="家人姓名" value={form.familyMemberName || ''} onChange={(e) => setForm({ ...form, familyMemberName: e.target.value })} className="flex-1 px-3 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
          )}
        </div>

        <Field label="備註">
          <textarea rows={2} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm" />
        </Field>

        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded text-sm">取消</button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium">{policyId ? '更新' : '新增'}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1 opacity-70">{label}</label>
      {children}
    </div>
  );
}