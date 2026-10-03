import type { SavingsAccount, TargetPlan } from '../types';

export const initialTargetPlans: TargetPlan[] = [
  {
    id: 'TGT-001',
    title: 'Lekki Phase 2 Land Deposit Co-Ownership',
    targetAmount: 2500000,
    currentAmount: 1850000,
    monthlyContribution: 150000,
    startDate: '2025-08-01',
    endDate: '2026-12-31',
    category: 'estate',
    autoDebit: true,
    color: '#00C853'
  },
  {
    id: 'TGT-002',
    title: 'Annual Christmas & New Year Ajo Thrift',
    targetAmount: 1200000,
    currentAmount: 900000,
    monthlyContribution: 100000,
    startDate: '2026-01-01',
    endDate: '2026-12-15',
    category: 'holiday',
    autoDebit: true,
    color: '#FFB800'
  },
  {
    id: 'TGT-003',
    title: 'Undergraduate Children Education Trust',
    targetAmount: 3000000,
    currentAmount: 1450000,
    monthlyContribution: 120000,
    startDate: '2025-03-01',
    endDate: '2027-09-30',
    category: 'education',
    autoDebit: false,
    color: '#2563EB'
  }
];

export const initialMemberSavings: SavingsAccount = {
  totalBalance: 4200000,
  voluntarySavings: 2750000,
  targetSavings: 1450000,
  dividendsEarned: 385400,
  annualReturnRate: 18.5,
  targetPlans: initialTargetPlans
};
