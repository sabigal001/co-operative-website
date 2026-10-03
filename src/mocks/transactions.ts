import type { Transaction } from '../types';

export const initialTransactions: Transaction[] = [
  {
    id: 'TXN-90182',
    reference: 'REF-MOS-2026-02-90182',
    memberId: 'MCS-2026-8942',
    memberName: 'Chief Adeleke Balogun',
    type: 'deposit',
    amount: 250000,
    date: '2026-02-28 14:32:10',
    status: 'successful',
    description: 'Monthly Voluntary Thrift Savings Contribution',
    paymentMethod: 'Direct Bank Transfer (Access Bank)',
    balanceAfter: 4200000
  },
  {
    id: 'TXN-90175',
    reference: 'REF-MOS-2026-02-90175',
    memberId: 'MCS-2026-8942',
    memberName: 'Chief Adeleke Balogun',
    type: 'loan_repayment',
    amount: 262500,
    date: '2026-02-09 09:15:42',
    status: 'successful',
    description: 'Loan Installment #4 for LN-2026-081',
    paymentMethod: 'Wallet Auto-Debit',
    balanceAfter: 3950000
  },
  {
    id: 'TXN-90140',
    reference: 'REF-MOS-2026-01-90140',
    memberId: 'MCS-2026-8942',
    memberName: 'Chief Adeleke Balogun',
    type: 'target_savings',
    amount: 150000,
    date: '2026-01-25 11:20:00',
    status: 'successful',
    description: 'Target Plan: Lekki Phase 2 Land Deposit Co-Ownership',
    paymentMethod: 'Automated Standing Order',
    balanceAfter: 3950000
  },
  {
    id: 'TXN-89912',
    reference: 'REF-MOS-2025-12-89912',
    memberId: 'MCS-2026-8942',
    memberName: 'Chief Adeleke Balogun',
    type: 'dividend',
    amount: 185400,
    date: '2025-12-31 18:00:00',
    status: 'successful',
    description: 'Annual General Meeting (AGM) Surplus Profit Dividend Payout',
    paymentMethod: 'Cooperative Treasury Dividend Allocation',
    balanceAfter: 3800000
  },
  {
    id: 'TXN-89844',
    reference: 'REF-MOS-2025-11-89844',
    memberId: 'MCS-2026-8942',
    memberName: 'Chief Adeleke Balogun',
    type: 'withdrawal',
    amount: 100000,
    date: '2025-11-15 16:45:22',
    status: 'successful',
    description: 'Emergency Voluntary Savings Partial Liquidation',
    paymentMethod: 'Direct NIP Payout to Access Bank',
    balanceAfter: 3614600
  }
];
