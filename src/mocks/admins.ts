import type { AdminUser, AuditLog, DepositSubmission, PayoutRequest, SystemMetrics } from '../types';

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'ADM-001',
    name: 'Alhaji Moshood Sanusi',
    email: 'moshood.sanusi@mosunmolacoop.ng',
    role: 'master_admin',
    lastActive: 'Just now',
    department: 'Office of the President & Board of Trustees',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'ADM-002',
    name: 'Deaconess Maryam Awolowo',
    email: 'treasury@mosunmolacoop.ng',
    role: 'treasurer',
    lastActive: '5 mins ago',
    department: 'Treasury & Financial Operations Committee',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'ADM-003',
    name: 'Bolanle Davies',
    email: 'bolanle.davies@mosunmolacoop.ng',
    role: 'pa_officer',
    lastActive: '12 mins ago',
    department: 'Secretariat, KYC & Member Verification',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  }
];

export const initialPendingDeposits: DepositSubmission[] = [
  {
    id: 'DEP-2026-031',
    reference: 'DEP-TRF-9921-FEB',
    memberId: 'MCS-2026-9921',
    memberName: 'Dr. Babatunde Alabi',
    amount: 350000,
    depositType: 'voluntary_savings',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    bankReference: 'GTB-NIP-992104829',
    submissionDate: '2026-02-27 10:14:20',
    status: 'pending'
  },
  {
    id: 'DEP-2026-032',
    reference: 'DEP-TRF-5571-FEB',
    memberId: 'MCS-2026-5571',
    memberName: 'Engr. Emeka Okafor',
    amount: 200000,
    depositType: 'target_plan',
    targetPlanId: 'TGT-001',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    bankReference: 'FBN-MOB-557193820',
    submissionDate: '2026-02-28 16:45:00',
    status: 'pending'
  },
  {
    id: 'DEP-2026-029',
    reference: 'DEP-TRF-8942-FEB',
    memberId: 'MCS-2026-8942',
    memberName: 'Chief Adeleke Balogun',
    amount: 250000,
    depositType: 'voluntary_savings',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    bankReference: 'ACC-NIP-89420918',
    submissionDate: '2026-02-28 14:30:00',
    status: 'approved',
    reviewedBy: 'Deaconess Maryam Awolowo'
  }
];

export const initialPayoutRequests: PayoutRequest[] = [
  {
    id: 'PO-2026-012',
    memberId: 'MCS-2026-9921',
    memberName: 'Dr. Babatunde Alabi',
    amount: 500000,
    payoutType: 'savings_withdrawal',
    bankName: 'Guaranty Trust Bank (GTB)',
    accountNumber: '0223948192',
    accountName: 'BABATUNDE ADISA ALABI',
    requestDate: '2026-02-27 12:00:00',
    status: 'pending'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-1092',
    timestamp: '2026-02-28 14:32:15',
    adminName: 'Deaconess Maryam Awolowo',
    adminRole: 'treasurer',
    action: 'APPROVED_DEPOSIT',
    details: 'Approved Voluntary Deposit ₦250,000 for Chief Adeleke Balogun (DEP-2026-029)',
    ip: '102.89.44.12'
  },
  {
    id: 'LOG-1091',
    timestamp: '2026-02-28 11:20:00',
    adminName: 'Bolanle Davies',
    adminRole: 'pa_officer',
    action: 'VETTED_LOAN_APPLICATION',
    details: 'Vetted loan LN-2026-094 (₦2,000,000) for Dr. Babatunde Alabi and forwarded to Treasurer',
    ip: '197.210.65.88'
  },
  {
    id: 'LOG-1090',
    timestamp: '2026-02-25 09:15:30',
    adminName: 'Alhaji Moshood Sanusi',
    adminRole: 'master_admin',
    action: 'IMPORT_CARD_BATCH',
    details: 'Imported Physical Card Batch "BATCH-2026-Q2-LAGOS" (150 cards registered)',
    ip: '102.89.42.100'
  },
  {
    id: 'LOG-1089',
    timestamp: '2026-02-20 16:00:00',
    adminName: 'Alhaji Moshood Sanusi',
    adminRole: 'master_admin',
    action: 'DIVIDEND_POOL_ALLOCATION',
    details: 'Allocated ₦45,000,000 AGM Surplus pool across all active financial members',
    ip: '102.89.42.100'
  }
];

export const initialSystemMetrics: SystemMetrics = {
  totalLiquidity: 485200000, // ₦485.2M
  totalSavingsPool: 342800000, // ₦342.8M
  totalOutstandingLoans: 142400000, // ₦142.4M
  totalDisbursedLoans: 890000000, // ₦890M all-time
  totalDividendsPaid: 65400000, // ₦65.4M
  activeMemberCount: 14852,
  pendingDepositsCount: 2,
  pendingLoanVettingsCount: 1,
  pendingDisbursementsCount: 1,
  cardsInCirculation: 12480,
  availableCardStock: 2520
};
