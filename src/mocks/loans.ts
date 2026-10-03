import type { LoanApplication } from '../types';

export const initialLoans: LoanApplication[] = [
  {
    id: 'LN-2026-081',
    memberId: 'MCS-2026-8942',
    memberName: 'Chief Adeleke Balogun',
    amount: 1500000,
    purpose: 'Agro-processing machinery expansion & logistics',
    durationMonths: 6,
    interestRate: 5.0, // 5% flat cooperative rate
    monthlyRepayment: 262500,
    totalRepayment: 1575000,
    status: 'approved_disbursed',
    appliedDate: '2026-01-05',
    disbursedDate: '2026-01-10',
    totalPaid: 1050000, // 4 months paid out of 6
    guarantors: [
      {
        memberId: 'MCS-2026-9921',
        name: 'Dr. Babatunde Alabi',
        phone: '+234 809 112 3344',
        relationship: 'Cooperative Senior Colleague',
        status: 'accepted'
      },
      {
        memberId: 'MCS-2026-1033',
        name: 'Hajiya Fatima Garba',
        phone: '+234 802 334 1122',
        relationship: 'Business Partner & Member',
        status: 'accepted'
      }
    ],
    repaymentSchedule: [
      { id: 'SCH-1', dueDate: '2026-02-10', amount: 262500, status: 'paid', paidDate: '2026-02-09' },
      { id: 'SCH-2', dueDate: '2026-03-10', amount: 262500, status: 'paid', paidDate: '2026-03-08' },
      { id: 'SCH-3', dueDate: '2026-04-10', amount: 262500, status: 'paid', paidDate: '2026-04-10' },
      { id: 'SCH-4', dueDate: '2026-05-10', amount: 262500, status: 'paid', paidDate: '2026-05-09' },
      { id: 'SCH-5', dueDate: '2026-06-10', amount: 262500, status: 'pending' },
      { id: 'SCH-6', dueDate: '2026-07-10', amount: 262500, status: 'pending' },
    ],
    vettingNotes: 'Adequate voluntary savings buffer and clean 3-year contribution record.',
    vettedBy: 'Bolanle Davies (PA Officer)',
    treasurerNotes: 'Disbursed via automated NIP transfer to Access Bank account.',
    disbursedBy: 'Deaconess Maryam Awolowo (Treasurer)'
  },
  {
    id: 'LN-2026-094',
    memberId: 'MCS-2026-9921',
    memberName: 'Dr. Babatunde Alabi',
    amount: 2000000,
    purpose: 'Residential solar energy installation & home improvement',
    durationMonths: 10,
    interestRate: 5.0,
    monthlyRepayment: 210000,
    totalRepayment: 2100000,
    status: 'vetted_pending_treasurer',
    appliedDate: '2026-02-18',
    totalPaid: 0,
    guarantors: [
      {
        memberId: 'MCS-2026-8942',
        name: 'Chief Adeleke Balogun',
        phone: '+234 803 456 7890',
        relationship: 'Executive Committee Member',
        status: 'accepted'
      },
      {
        memberId: 'MCS-2026-5571',
        name: 'Engr. Emeka Okafor',
        phone: '+234 805 778 9900',
        relationship: 'Member in good standing',
        status: 'accepted'
      }
    ],
    repaymentSchedule: [],
    vettingNotes: 'KYC verified, 2 confirmed guarantors with savings exceeding loan coverage. Recommended for immediate disbursement.',
    vettedBy: 'Bolanle Davies (PA Officer)'
  },
  {
    id: 'LN-2026-102',
    memberId: 'MCS-2026-5571',
    memberName: 'Engr. Emeka Okafor',
    amount: 850000,
    purpose: 'Professional certification and cloud engineering lab equipment',
    durationMonths: 6,
    interestRate: 5.0,
    monthlyRepayment: 148750,
    totalRepayment: 892500,
    status: 'pending_vetting',
    appliedDate: '2026-02-28',
    totalPaid: 0,
    guarantors: [
      {
        memberId: 'MCS-2026-8942',
        name: 'Chief Adeleke Balogun',
        phone: '+234 803 456 7890',
        relationship: 'Fellow Member',
        status: 'accepted'
      },
      {
        memberId: 'MCS-2026-9921',
        name: 'Dr. Babatunde Alabi',
        phone: '+234 809 112 3344',
        relationship: 'Academic Mentor',
        status: 'pending'
      }
    ],
    repaymentSchedule: []
  }
];
