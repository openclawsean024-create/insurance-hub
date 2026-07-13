export type InsuranceType =
  | 'life' | 'medical' | 'accident' | 'cancer' | 'hospital'
  | 'longterm' | 'disability' | 'travel' | 'auto' | 'property';

export const INSURANCE_TYPE_LABELS: Record<InsuranceType, string> = {
  life: '壽險',
  medical: '醫療險',
  accident: '意外險',
  cancer: '癌症險',
  hospital: '住院日額',
  longterm: '長照險',
  disability: '失能險',
  travel: '旅平險',
  auto: '車險',
  property: '產險',
};

export const getInsuranceTypeLabel = (type: string): string =>
  (INSURANCE_TYPE_LABELS as Record<string, string>)[type] || type;

export interface Policy {
  id: string;
  companyId: string;
  policyNumber: string;
  insuranceType: InsuranceType;
  insuredName: string;
  applicantName: string;
  coverageAmount: number;
  annualPremium: number;
  paymentPeriod?: number;
  coveragePeriod?: number;
  isAutoRenew: boolean;
  contractStart: string;
  contractEnd?: string;
  notes?: string;
  isManagedForFamily: boolean;
  familyMemberName?: string;
  // 條款比較用（F-006）
  hospitalDailyBenefit?: number;
  cancerLumpSum?: number;
  waitingPeriod?: number; // 天
  exclusions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  shortName: string;
  headquarters: string;
  latitude: number;
  longitude: number;
  complaintRate: number; // 每萬件
  totalPolicies: number; // 萬件
  foundedYear: number;
  contactPhone: string;
  websiteUrl: string;
  termsUrl: string;
  lastUpdated: string;
}

export interface ClaimChecklistItem {
  item: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface ClaimWorkflow {
  id: string;
  insuranceType: InsuranceType;
  policyId?: string;
  currentStage: 'reported' | 'documenting' | 'submitting' | 'paid';
  reportedAt?: string;
  documentReadyAt?: string;
  submittedAt?: string;
  paidAt?: string;
  checklist: ClaimChecklistItem[];
  notes?: string;
  createdAt: string;
}

export interface AppState {
  policies: Policy[];
  workflows: ClaimWorkflow[];
  theme: 'light' | 'dark';
}

export const DEFAULT_STATE: AppState = {
  policies: [],
  workflows: [],
  theme: 'light',
};

export const STORAGE_KEY = 'insurance-hub-v1';

// 4 筆預載範例
export const DEFAULT_POLICIES: Policy[] = [
  {
    id: 'demo-1',
    companyId: 'c01',
    policyNumber: 'CAT-2024-001234',
    insuranceType: 'medical',
    insuredName: '王小明',
    applicantName: '王小明',
    coverageAmount: 2000000,
    annualPremium: 18000,
    paymentPeriod: 20,
    coveragePeriod: 30,
    isAutoRenew: true,
    contractStart: '2024-01-15',
    contractEnd: '2054-01-15',
    hospitalDailyBenefit: 3000,
    cancerLumpSum: 500000,
    waitingPeriod: 30,
    exclusions: '懷孕相關、整形手術、戰爭行為',
    isManagedForFamily: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-2',
    companyId: 'c03',
    policyNumber: 'NSL-2023-987654',
    insuranceType: 'cancer',
    insuredName: '林大華',
    applicantName: '林大華',
    coverageAmount: 1500000,
    annualPremium: 12000,
    paymentPeriod: 15,
    coveragePeriod: 20,
    isAutoRenew: false,
    contractStart: '2023-06-01',
    contractEnd: '2043-06-01',
    hospitalDailyBenefit: 0,
    cancerLumpSum: 1000000,
    waitingPeriod: 90,
    exclusions: '投保前已確診之癌症',
    isManagedForFamily: false,
    notes: '初次罹癌一次金 100 萬',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
  },
  {
    id: 'demo-3',
    companyId: 'c02',
    policyNumber: 'FUB-2024-555666',
    insuranceType: 'life',
    insuredName: '張怡君',
    applicantName: '張怡君',
    coverageAmount: 5000000,
    annualPremium: 25000,
    paymentPeriod: 20,
    coveragePeriod: 30,
    isAutoRenew: false,
    contractStart: '2024-03-10',
    contractEnd: '2054-03-10',
    hospitalDailyBenefit: 0,
    cancerLumpSum: 0,
    waitingPeriod: 0,
    exclusions: '2 年內自殺不賠',
    isManagedForFamily: false,
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'demo-4',
    companyId: 'c18',
    policyNumber: 'FBP-2024-777888',
    insuranceType: 'auto',
    insuredName: '陳志強',
    applicantName: '陳志強',
    coverageAmount: 300000,
    annualPremium: 8000,
    paymentPeriod: 1,
    isAutoRenew: true,
    contractStart: '2024-08-01',
    contractEnd: '2025-08-01',
    isManagedForFamily: false,
    notes: '強制險 + 第三責任險',
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2024-08-01T00:00:00Z',
  },
];