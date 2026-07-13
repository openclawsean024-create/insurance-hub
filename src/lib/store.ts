'use client';
import { create } from 'zustand';
import { DEFAULT_STATE, type AppState, type Policy, type ClaimWorkflow, STORAGE_KEY, DEFAULT_POLICIES } from './types';

interface InsuranceState {
  policies: Policy[];
  workflows: ClaimWorkflow[];
  theme: 'light' | 'dark';
  hydrated: boolean;
  update: (partial: { policies?: Policy[]; workflows?: ClaimWorkflow[]; theme?: 'light' | 'dark' }) => void;
  addPolicy: (p: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePolicy: (id: string, patch: Partial<Policy>) => void;
  deletePolicy: (id: string) => void;
  addWorkflow: (w: Omit<ClaimWorkflow, 'id' | 'createdAt'>) => void;
  toggleChecklistItem: (workflowId: string, itemIndex: number) => void;
  importAll: (data: { policies: Policy[]; workflows: ClaimWorkflow[] }) => void;
  reset: () => void;
  hydrate: () => void;
}

export const useInsuranceStore = create<InsuranceState>()((set) => ({
  ...DEFAULT_STATE,
  hydrated: false,
  update: (partial) => set((s) => ({ ...s, ...partial })),
  addPolicy: (p) => set((s) => {
    const now = new Date().toISOString();
    return { policies: [{ ...p, id: `pol-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: now, updatedAt: now }, ...s.policies] };
  }),
  updatePolicy: (id, patch) => set((s) => ({
    policies: s.policies.map((p) => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p),
  })),
  deletePolicy: (id) => set((s) => ({ policies: s.policies.filter((p) => p.id !== id) })),
  addWorkflow: (w) => set((s) => ({
    workflows: [...s.workflows, { ...w, id: `wf-${Date.now()}`, createdAt: new Date().toISOString() }],
  })),
  toggleChecklistItem: (workflowId, itemIndex) => set((s) => ({
    workflows: s.workflows.map((w) =>
      w.id === workflowId
        ? {
            ...w,
            checklist: w.checklist.map((it, i) =>
              i === itemIndex ? { ...it, isCompleted: !it.isCompleted, completedAt: !it.isCompleted ? new Date().toISOString() : undefined } : it
            ),
          }
        : w
    ),
  })),
  importAll: (data) => set({ policies: data.policies, workflows: data.workflows }),
  reset: () => set({ ...DEFAULT_STATE, policies: DEFAULT_POLICIES }),
  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        useInsuranceStore.setState({ ...parsed, hydrated: true });
      } else {
        useInsuranceStore.setState({ policies: DEFAULT_POLICIES, hydrated: true });
      }
    } catch (err) {
      console.warn('[insurance] hydrate failed', err);
      useInsuranceStore.setState({ policies: DEFAULT_POLICIES, hydrated: true });
    }
  },
}));

// subscribe 自動 persist
if (typeof window !== 'undefined') {
  useInsuranceStore.subscribe((state) => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        policies: state.policies,
        workflows: state.workflows,
        theme: state.theme,
      }));
    } catch (err) {
      console.warn('[insurance] persist failed', err);
    }
  });
}