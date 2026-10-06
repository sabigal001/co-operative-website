import type { 
  ApiResponse, 
  DepositSubmission, 
  LedgerTransaction, 
  SavingsAccount, 
  Transaction 
} from '../../types';
import { initialMemberSavings } from '../../mocks/savings';
import { initialPendingDeposits } from '../../mocks/admins';
import { initialTransactions } from '../../mocks/transactions';
import { getFromStorage, saveToStorage } from './storageHelper';
import { adminService } from './adminService';

const SAVINGS_STORAGE_KEY = 'member_savings';
const DEPOSITS_STORAGE_KEY = 'pending_deposits';
const TXN_STORAGE_KEY = 'transactions_registry';
const LEDGER_STORAGE_KEY = 'financial_ledger';

export const financeService = {
  // Get consolidated financial summary for member
  async getSummary(memberId: string): Promise<ApiResponse<{
    totalSavings: number;
    regularThrift: number;
    targetSavings: number;
    dividends: number;
    shareCapital: number;
  }>> {
    await new Promise((r) => setTimeout(r, 250));

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
    await new Promise((r) => setTimeout(r, 300));

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

  // Submit Bank Deposit for Administrative Review
  async submitDeposit(
    memberId: string, 
    memberName: string, 
    amount: number, 
    depositType: 'voluntary_savings' | 'target_plan' | 'loan_repayment',
    bankRef: string,
    proofUrl?: string,
    targetPlanId?: string
  ): Promise<ApiResponse<DepositSubmission>> {
    await new Promise((r) => setTimeout(r, 650));

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
      status: 'pending' // STRICT: Not credited yet!
    };

    saveToStorage(DEPOSITS_STORAGE_KEY, [newSubmission, ...deposits]);

    return {
      success: true,
      message: 'Deposit proof logged in queue. Treasurer will review and record in the official ledger.',
      data: newSubmission
    };
  },

  // Admin: Get Pending Deposits
  async getPendingDeposits(): Promise<ApiResponse<DepositSubmission[]>> {
    await new Promise((r) => setTimeout(r, 200));
    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    return {
      success: true,
      message: 'Pending deposits list retrieved.',
      data: deposits.filter((d) => d.status === 'pending')
    };
  },

  // Admin Action: Verify & Credit Deposit into Official Ledger
  async verifyDeposit(
    depositId: string, 
    approved: boolean, 
    verifiedBy: string = 'Treasurer', 
    rejectionReason?: string
  ): Promise<ApiResponse<DepositSubmission>> {
    await new Promise((r) => setTimeout(r, 500));

    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    const deposit = deposits.find((d) => d.id === depositId);

    if (!deposit) throw new Error('Deposit submission not found');

    deposit.status = approved ? 'approved' : 'rejected';
    deposit.reviewedBy = verifiedBy;
    if (rejectionReason) deposit.rejectionReason = rejectionReason;

    saveToStorage(DEPOSITS_STORAGE_KEY, deposits);

    if (approved) {
      // 1. Update savings account
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

      // 2. Append immutable ledger transaction
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

      // 3. Append to standard transaction history
      const txns = getFromStorage<Transaction[]>(TXN_STORAGE_KEY, initialTransactions);
      const newTxn: Transaction = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        reference: deposit.reference,
        memberId: deposit.memberId,
        memberName: deposit.memberName,
        type: deposit.depositType === 'target_plan' ? 'target_savings' : 'deposit',
        amount: deposit.amount,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'successful',
        description: `Approved ${deposit.depositType.replace('_', ' ').toUpperCase()} Deposit`,
        paymentMethod: `Bank Transfer (${deposit.bankReference})`,
        balanceAfter: savings.totalBalance
      };
      saveToStorage(TXN_STORAGE_KEY, [newTxn, ...txns]);

      await adminService.logAction(
        verifiedBy,
        'treasurer',
        'APPROVE_DEPOSIT',
        `Approved deposit ${deposit.id} of ₦${deposit.amount.toLocaleString()} for ${deposit.memberName}`
      );
    } else {
      await adminService.logAction(
        verifiedBy,
        'treasurer',
        'REJECT_DEPOSIT',
        `Rejected deposit ${deposit.id} for ${deposit.memberName}. Reason: ${rejectionReason || 'Invalid proof'}`
      );
    }

    return {
      success: true,
      message: approved 
        ? `Deposit of ₦${deposit.amount.toLocaleString()} confirmed and posted to the official financial ledger!`
        : `Deposit ${deposit.id} was rejected.`,
      data: deposit
    };
  }
};
