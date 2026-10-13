import type { 
  ApiResponse, 
  DepositSubmission, 
  LedgerTransaction, 
  SavingsAccount, 
  Transaction,
  DeskPaymentRecord,
  DeskPaymentPayload,
  DailyCashbookSummary
} from '../../types';
import { initialMemberSavings } from '../../mocks/savings';
import { initialPendingDeposits } from '../../mocks/admins';
import { initialTransactions } from '../../mocks/transactions';
import { initialDeskPayments } from '../../mocks/payments';
import { getFromStorage, saveToStorage } from './storageHelper';
import { adminService } from './adminService';
import { CATEGORY_LABELS, METHOD_LABELS, numberToWordsNaira } from '../../utils/currencyFormatter';

const SAVINGS_STORAGE_KEY = 'member_savings';
const DEPOSITS_STORAGE_KEY = 'pending_deposits';
const TXN_STORAGE_KEY = 'transactions_registry';
const LEDGER_STORAGE_KEY = 'financial_ledger';
const DESK_PAYMENTS_KEY = 'desk_payments_ledger';

export const financeService = {
  // Get consolidated financial summary for member
  async getSummary(memberId: string): Promise<ApiResponse<{
    totalSavings: number;
    regularThrift: number;
    targetSavings: number;
    dividends: number;
    shareCapital: number;
  }>> {
    await new Promise((r) => setTimeout(r, 200));

    const savings = getFromStorage<SavingsAccount>(`${SAVINGS_STORAGE_KEY}_${memberId}`, initialMemberSavings);
    
    return {
      success: true,
      message: 'Financial summary loaded.',
      data: {
        totalSavings: savings.totalBalance,
        regularThrift: savings.voluntarySavings,
        targetSavings: savings.targetSavings,
        dividends: savings.dividendsEarned,
        shareCapital: 250000 // Statutory member share capital
      }
    };
  },

  // Get Immutable Financial Ledger for Member or Global
  async getLedgerTransactions(memberId?: string): Promise<ApiResponse<LedgerTransaction[]>> {
    await new Promise((r) => setTimeout(r, 200));

    const ledger = getFromStorage<LedgerTransaction[]>(LEDGER_STORAGE_KEY, []);
    let filtered = ledger;
    if (memberId) {
      filtered = ledger.filter((l) => l.memberId === memberId || l.memberId === 'MCS-2026-8942');
    }

    return {
      success: true,
      message: 'Ledger records retrieved.',
      data: filtered
    };
  },

  // =============================================================
  // SECRETARIAT DESK PAYMENT RECORDING (HERO FEATURE)
  // =============================================================
  async recordDeskPayment(
    payload: DeskPaymentPayload,
    staffName: string = 'Staff Officer',
    staffRole: string = 'Principal Secretariat & KYC Officer'
  ): Promise<ApiResponse<DeskPaymentRecord>> {
    await new Promise((r) => setTimeout(r, 350));

    const payments = getFromStorage<DeskPaymentRecord[]>(DESK_PAYMENTS_KEY, initialDeskPayments);
    const receiptSeq = payments.length + 496;
    const receiptNumber = `RV-2026-${String(receiptSeq).padStart(5, '0')}`;
    const paymentId = `PMT-2026-${String(payments.length + 46).padStart(4, '0')}`;
    
    const isInstantCredit = payload.method === 'CASH_AT_DESK' || payload.method === 'POS_TERMINAL';
    const status: 'CONFIRMED' | 'PENDING_VERIFICATION' = isInstantCredit ? 'CONFIRMED' : 'PENDING_VERIFICATION';

    // Retrieve savings balance
    const savings = getFromStorage<SavingsAccount>(`${SAVINGS_STORAGE_KEY}_${payload.memberId}`, initialMemberSavings);
    
    let balanceAfter = savings.totalBalance;
    if (isInstantCredit) {
      if (payload.category === 'MONTHLY_THRIFT' || payload.category === 'VOLUNTARY_SAVINGS') {
        savings.totalBalance += payload.amount;
        savings.voluntarySavings += payload.amount;
      } else if (payload.category === 'TARGET_SAVINGS') {
        savings.totalBalance += payload.amount;
        savings.targetSavings += payload.amount;
      }
      balanceAfter = savings.totalBalance;
      saveToStorage(`${SAVINGS_STORAGE_KEY}_${payload.memberId}`, savings);

      // Append to general transactions ledger
      const txns = getFromStorage<Transaction[]>(TXN_STORAGE_KEY, initialTransactions);
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        reference: receiptNumber,
        memberId: payload.memberId,
        memberName: payload.memberName,
        type: payload.category === 'LOAN_REPAYMENT' ? 'loan_repayment' : 'deposit',
        amount: payload.amount,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'successful',
        description: `Desk Receipt ${receiptNumber} (${CATEGORY_LABELS[payload.category] || payload.category})`,
        paymentMethod: METHOD_LABELS[payload.method] || payload.method,
        balanceAfter
      };
      saveToStorage(TXN_STORAGE_KEY, [newTxn, ...txns]);

      // Append to immutable ledger
      const ledger = getFromStorage<LedgerTransaction[]>(LEDGER_STORAGE_KEY, []);
      const newLedgerEntry: LedgerTransaction = {
        transactionId: `TXN-LEDGER-${Date.now().toString().slice(-6)}`,
        memberId: payload.memberId,
        type: payload.category === 'MONTHLY_THRIFT' ? 'THRIFT_DEPOSIT' : 'CONTRIBUTION',
        amount: payload.amount,
        status: 'VERIFIED',
        reference: receiptNumber,
        description: `Desk Payment recorded by ${staffName} (${CATEGORY_LABELS[payload.category]})`,
        paymentMethod: METHOD_LABELS[payload.method],
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        verifiedBy: staffName,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        balanceAfter
      };
      saveToStorage(LEDGER_STORAGE_KEY, [newLedgerEntry, ...ledger]);
    }

    const newPayment: DeskPaymentRecord = {
      id: paymentId,
      receiptNumber,
      memberId: payload.memberId,
      memberName: payload.memberName,
      category: payload.category,
      categoryLabel: payload.customCategoryLabel || CATEGORY_LABELS[payload.category] || payload.category,
      amount: payload.amount,
      amountInWords: numberToWordsNaira(payload.amount),
      method: payload.method,
      reference: payload.reference || `${payload.method === 'CASH_AT_DESK' ? 'CSH' : 'TRF'}-IKJ-${Date.now().toString().slice(-6)}`,
      recordedBy: staffName,
      recordedByRole: staffRole,
      recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status,
      balanceAfter: isInstantCredit ? balanceAfter : undefined,
      notes: payload.notes
    };

    saveToStorage(DESK_PAYMENTS_KEY, [newPayment, ...payments]);

    await adminService.logAction(
      staffName,
      'pa_officer',
      'RECORD_DESK_PAYMENT',
      `Recorded ${payload.method} payment of ₦${payload.amount.toLocaleString()} for ${payload.memberName} (${receiptNumber})`
    );

    return {
      success: true,
      message: isInstantCredit
        ? `Payment of ₦${payload.amount.toLocaleString()} successfully recorded and confirmed. Receipt Voucher generated!`
        : `Bank transfer payment logged in queue (${receiptNumber}). Awaiting Treasurer statement verification.`,
      data: newPayment
    };
  },

  // Get all Desk Payments
  async getDeskPayments(filter?: { 
    memberId?: string; 
    date?: string; 
    status?: string 
  }): Promise<ApiResponse<DeskPaymentRecord[]>> {
    await new Promise((r) => setTimeout(r, 150));
    let payments = getFromStorage<DeskPaymentRecord[]>(DESK_PAYMENTS_KEY, initialDeskPayments);

    if (filter?.memberId) {
      payments = payments.filter((p) => p.memberId.toLowerCase() === filter.memberId?.toLowerCase());
    }
    if (filter?.status && filter.status !== 'ALL') {
      payments = payments.filter((p) => p.status === filter.status);
    }

    return {
      success: true,
      message: 'Desk payments retrieved.',
      data: payments
    };
  },

  // Get Daily Cashbook Summary
  async getDailyCashbook(dateString?: string): Promise<ApiResponse<{
    summary: DailyCashbookSummary;
    records: DeskPaymentRecord[];
  }>> {
    await new Promise((r) => setTimeout(r, 200));
    const payments = getFromStorage<DeskPaymentRecord[]>(DESK_PAYMENTS_KEY, initialDeskPayments);

    const todayStr = dateString || new Date().toISOString().substring(0, 10);
    const dayPayments = payments.filter((p) => p.recordedAt.startsWith(todayStr));

    const totalCash = dayPayments
      .filter((p) => (p.method === 'CASH_AT_DESK' || p.method === 'POS_TERMINAL') && p.status === 'CONFIRMED')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalTransfers = dayPayments
      .filter((p) => p.method === 'BANK_TRANSFER' && p.status === 'CONFIRMED')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingTransfers = dayPayments
      .filter((p) => p.method === 'BANK_TRANSFER' && p.status === 'PENDING_VERIFICATION')
      .reduce((sum, p) => sum + p.amount, 0);

    const summary: DailyCashbookSummary = {
      date: todayStr,
      totalCashReceived: totalCash,
      totalTransfersReceived: totalTransfers,
      totalPendingTransfers: pendingTransfers,
      totalTransactionsCount: dayPayments.length,
      cashierInCharge: 'Bolanle Davies',
      reconciled: false
    };

    return {
      success: true,
      message: 'Daily cashbook retrieved.',
      data: {
        summary,
        records: dayPayments
      }
    };
  },

  // Treasurer: Verify Bank Transfer Desk Payment
  async verifyTransferPayment(
    paymentId: string,
    approved: boolean,
    treasurerName: string = 'Deaconess Maryam Awolowo'
  ): Promise<ApiResponse<DeskPaymentRecord>> {
    await new Promise((r) => setTimeout(r, 400));
    const payments = getFromStorage<DeskPaymentRecord[]>(DESK_PAYMENTS_KEY, initialDeskPayments);
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) throw new Error('Payment record not found.');

    payment.status = approved ? 'CONFIRMED' : 'REVERSED';
    payment.verifiedBy = treasurerName;
    payment.verifiedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (approved) {
      const savings = getFromStorage<SavingsAccount>(`${SAVINGS_STORAGE_KEY}_${payment.memberId}`, initialMemberSavings);
      savings.totalBalance += payment.amount;
      savings.voluntarySavings += payment.amount;
      payment.balanceAfter = savings.totalBalance;
      saveToStorage(`${SAVINGS_STORAGE_KEY}_${payment.memberId}`, savings);

      // Ledger entry
      const ledger = getFromStorage<LedgerTransaction[]>(LEDGER_STORAGE_KEY, []);
      const newLedgerEntry: LedgerTransaction = {
        transactionId: `TXN-LEDGER-${Date.now().toString().slice(-6)}`,
        memberId: payment.memberId,
        type: 'THRIFT_DEPOSIT',
        amount: payment.amount,
        status: 'VERIFIED',
        reference: payment.receiptNumber,
        description: `Bank Transfer verified by Treasurer (${payment.reference})`,
        paymentMethod: 'Bank Transfer (Verified)',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        verifiedBy: treasurerName,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        balanceAfter: savings.totalBalance
      };
      saveToStorage(LEDGER_STORAGE_KEY, [newLedgerEntry, ...ledger]);
    }

    saveToStorage(DESK_PAYMENTS_KEY, payments);

    await adminService.logAction(
      treasurerName,
      'treasurer',
      approved ? 'VERIFY_TRANSFER_PAYMENT' : 'REJECT_TRANSFER_PAYMENT',
      `${approved ? 'Verified' : 'Rejected'} bank transfer payment ${payment.receiptNumber} of ₦${payment.amount.toLocaleString()} for ${payment.memberName}`
    );

    return {
      success: true,
      message: approved 
        ? `Transfer of ₦${payment.amount.toLocaleString()} verified and credited to member's official ledger.`
        : `Transfer payment ${payment.receiptNumber} was marked uncredited/reversed.`,
      data: payment
    };
  },

  // Super Admin: Traceable Reversal (No silent deletions!)
  async reversePayment(
    paymentId: string,
    reason: string,
    adminName: string = 'Super Admin'
  ): Promise<ApiResponse<DeskPaymentRecord>> {
    await new Promise((r) => setTimeout(r, 450));
    const payments = getFromStorage<DeskPaymentRecord[]>(DESK_PAYMENTS_KEY, initialDeskPayments);
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) throw new Error('Payment record not found.');
    if (payment.status === 'REVERSED') throw new Error('Payment is already reversed.');

    const wasConfirmed = payment.status === 'CONFIRMED';
    payment.status = 'REVERSED';
    payment.reversalReason = reason;
    payment.reversedBy = adminName;
    payment.reversedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (wasConfirmed) {
      // Reverse savings balance
      const savings = getFromStorage<SavingsAccount>(`${SAVINGS_STORAGE_KEY}_${payment.memberId}`, initialMemberSavings);
      savings.totalBalance = Math.max(0, savings.totalBalance - payment.amount);
      savings.voluntarySavings = Math.max(0, savings.voluntarySavings - payment.amount);
      saveToStorage(`${SAVINGS_STORAGE_KEY}_${payment.memberId}`, savings);

      // Ledger contra-entry
      const ledger = getFromStorage<LedgerTransaction[]>(LEDGER_STORAGE_KEY, []);
      const contraEntry: LedgerTransaction = {
        transactionId: `TXN-CONTRA-${Date.now().toString().slice(-6)}`,
        memberId: payment.memberId,
        type: 'ADJUSTMENT',
        amount: -payment.amount,
        status: 'VERIFIED',
        reference: `CONTRA-${payment.receiptNumber}`,
        description: `Contra Reversal of ${payment.receiptNumber}. Reason: ${reason}`,
        paymentMethod: 'Audit Reversal',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        verifiedBy: adminName,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        balanceAfter: savings.totalBalance
      };
      saveToStorage(LEDGER_STORAGE_KEY, [contraEntry, ...ledger]);
    }

    saveToStorage(DESK_PAYMENTS_KEY, payments);

    await adminService.logAction(
      adminName,
      'master_admin',
      'REVERSE_PAYMENT',
      `Reversed payment ${payment.receiptNumber} (₦${payment.amount.toLocaleString()}) for ${payment.memberName}. Reason: ${reason}`
    );

    return {
      success: true,
      message: `Payment ${payment.receiptNumber} successfully reversed with traceable audit log entry.`,
      data: payment
    };
  },

  // Member Passbook & Statement
  async getMemberPassbook(memberId: string): Promise<ApiResponse<{
    memberId: string;
    totalBalance: number;
    regularThrift: number;
    voluntarySavings: number;
    shareCapital: number;
    records: DeskPaymentRecord[];
  }>> {
    await new Promise((r) => setTimeout(r, 200));
    const savings = getFromStorage<SavingsAccount>(`${SAVINGS_STORAGE_KEY}_${memberId}`, initialMemberSavings);
    const payments = getFromStorage<DeskPaymentRecord[]>(DESK_PAYMENTS_KEY, initialDeskPayments);
    const memberPayments = payments.filter((p) => p.memberId.toLowerCase() === memberId.toLowerCase());

    return {
      success: true,
      message: 'Member passbook loaded.',
      data: {
        memberId,
        totalBalance: savings.totalBalance,
        regularThrift: savings.voluntarySavings,
        voluntarySavings: savings.targetSavings,
        shareCapital: 250000,
        records: memberPayments
      }
    };
  },

  // =============================================================
  // LEGACY DEPOSIT PROOFS (PRESERVED)
  // =============================================================
  async submitDeposit(
    memberId: string, 
    memberName: string, 
    amount: number, 
    depositType: 'voluntary_savings' | 'target_plan' | 'loan_repayment',
    bankRef: string,
    proofUrl?: string,
    targetPlanId?: string
  ): Promise<ApiResponse<DepositSubmission>> {
    await new Promise((r) => setTimeout(r, 400));

    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    const newSubmission: DepositSubmission = {
      id: `DEP-2026-${Math.floor(100 + Math.random() * 900)}`,
      reference: `DEP-TRF-${memberId.slice(-4)}-${Date.now().toString().slice(-4)}`,
      memberId,
      memberName,
      amount,
      depositType,
      targetPlanId,
      bankReference: bankRef || `BANK-TRF-${Date.now().toString().slice(-6)}`,
      paymentProofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      submissionDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'pending'
    };

    saveToStorage(DEPOSITS_STORAGE_KEY, [newSubmission, ...deposits]);

    return {
      success: true,
      message: 'Deposit proof logged in queue.',
      data: newSubmission
    };
  },

  async getPendingDeposits(): Promise<ApiResponse<DepositSubmission[]>> {
    await new Promise((r) => setTimeout(r, 200));
    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    return {
      success: true,
      message: 'Pending deposits list retrieved.',
      data: deposits.filter((d) => d.status === 'pending')
    };
  },

  async verifyDeposit(
    depositId: string, 
    approved: boolean, 
    verifiedBy: string = 'Treasurer', 
    rejectionReason?: string
  ): Promise<ApiResponse<DepositSubmission>> {
    await new Promise((r) => setTimeout(r, 400));

    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    const deposit = deposits.find((d) => d.id === depositId);

    if (!deposit) throw new Error('Deposit submission not found');

    deposit.status = approved ? 'approved' : 'rejected';
    deposit.reviewedBy = verifiedBy;
    if (rejectionReason) deposit.rejectionReason = rejectionReason;

    saveToStorage(DEPOSITS_STORAGE_KEY, deposits);

    if (approved) {
      const savings = getFromStorage<SavingsAccount>(`${SAVINGS_STORAGE_KEY}_${deposit.memberId}`, initialMemberSavings);
      savings.totalBalance += deposit.amount;
      if (deposit.depositType === 'target_plan') {
        savings.targetSavings += deposit.amount;
        if (deposit.targetPlanId) {
          const plan = savings.targetPlans.find((p) => p.id === deposit.targetPlanId);
          if (plan) plan.currentAmount += deposit.amount;
        }
      } else {
        savings.voluntarySavings += deposit.amount;
      }
      saveToStorage(`${SAVINGS_STORAGE_KEY}_${deposit.memberId}`, savings);

      const ledger = getFromStorage<LedgerTransaction[]>(LEDGER_STORAGE_KEY, []);
      const newLedgerEntry: LedgerTransaction = {
        transactionId: `TXN-LEDGER-${Date.now().toString().slice(-6)}`,
        memberId: deposit.memberId,
        type: deposit.depositType === 'target_plan' ? 'TARGET_DEPOSIT' : 'THRIFT_DEPOSIT',
        amount: deposit.amount,
        status: 'VERIFIED',
        reference: deposit.reference,
        description: `Verified ${deposit.depositType.replace('_', ' ').toUpperCase()} via ${deposit.bankReference}`,
        paymentMethod: `Bank Transfer (${deposit.bankReference})`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        verifiedBy,
        verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        balanceAfter: savings.totalBalance
      };
      saveToStorage(LEDGER_STORAGE_KEY, [newLedgerEntry, ...ledger]);
    }

    return {
      success: true,
      message: approved ? 'Deposit confirmed.' : 'Deposit rejected.',
      data: deposit
    };
  }
};
