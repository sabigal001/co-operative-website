import type { ApiResponse, DepositSubmission, PayoutRequest, SavingsAccount, TargetPlan, Transaction } from '../../types';
import { initialMemberSavings } from '../../mocks/savings';
import { initialPendingDeposits, initialPayoutRequests } from '../../mocks/admins';
import { initialTransactions } from '../../mocks/transactions';
import { getFromStorage, saveToStorage } from './storageHelper';

const SAVINGS_STORAGE_KEY = 'member_savings';
const DEPOSITS_STORAGE_KEY = 'pending_deposits';
const PAYOUTS_STORAGE_KEY = 'payout_requests';
const TXN_STORAGE_KEY = 'transactions_registry';

export const savingsService = {
  async getSavings(memberId: string): Promise<ApiResponse<SavingsAccount>> {
    await new Promise((r) => setTimeout(r, 300));
    const savings = getFromStorage<SavingsAccount>(`${SAVINGS_STORAGE_KEY}_${memberId}`, initialMemberSavings);
    return {
      success: true,
      message: 'Savings details loaded.',
      data: savings
    };
  },

  async createTargetPlan(memberId: string, planData: Omit<TargetPlan, 'id' | 'currentAmount'>): Promise<ApiResponse<TargetPlan>> {
    await new Promise((r) => setTimeout(r, 600));
    const savings = getFromStorage<SavingsAccount>(`${SAVINGS_STORAGE_KEY}_${memberId}`, initialMemberSavings);
    
    const newPlan: TargetPlan = {
      ...planData,
      id: `TGT-${Math.floor(100 + Math.random() * 900)}`,
      currentAmount: 0,
      color: planData.color || '#00C853'
    };

    savings.targetPlans.push(newPlan);
    saveToStorage(`${SAVINGS_STORAGE_KEY}_${memberId}`, savings);

    return {
      success: true,
      message: `Target plan "${newPlan.title}" created successfully!`,
      data: newPlan
    };
  },

  // Member submits a bank deposit proof which goes into the Treasurer's approval queue
  async submitDeposit(
    memberId: string, 
    memberName: string, 
    amount: number, 
    depositType: 'voluntary_savings' | 'target_plan' | 'loan_repayment',
    bankRef: string,
    proofUrl?: string,
    targetPlanId?: string
  ): Promise<ApiResponse<DepositSubmission>> {
    await new Promise((r) => setTimeout(r, 700));

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

    // Also record a pending transaction
    const txns = getFromStorage<Transaction[]>(TXN_STORAGE_KEY, initialTransactions);
    const pendingTxn: Transaction = {
      id: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
      reference: newSubmission.reference,
      memberId,
      memberName,
      type: depositType === 'target_plan' ? 'target_savings' : 'deposit',
      amount,
      date: newSubmission.submissionDate,
      status: 'pending',
      description: `Pending Approval: ${depositType.replace('_', ' ').toUpperCase()} Deposit`,
      paymentMethod: `Bank Transfer Ref: ${newSubmission.bankReference}`,
      balanceAfter: 4200000 // will update on approval
    };
    saveToStorage(TXN_STORAGE_KEY, [pendingTxn, ...txns]);

    return {
      success: true,
      message: 'Deposit proof submitted successfully! Treasurer will verify and credit your wallet shortly.',
      data: newSubmission
    };
  },

  // Member requests withdrawal for savings maturity or emergency
  async requestPayout(
    memberId: string,
    memberName: string,
    amount: number,
    payoutType: 'savings_withdrawal' | 'dividend_distribution' | 'target_maturity',
    bankDetails: { bankName: string; accountNumber: string; accountName: string }
  ): Promise<ApiResponse<PayoutRequest>> {
    await new Promise((r) => setTimeout(r, 600));

    const payouts = getFromStorage<PayoutRequest[]>(PAYOUTS_STORAGE_KEY, initialPayoutRequests);
    const newPayout: PayoutRequest = {
      id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      memberId,
      memberName,
      amount,
      payoutType,
      bankName: bankDetails.bankName,
      accountNumber: bankDetails.accountNumber,
      accountName: bankDetails.accountName,
      requestDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'pending'
    };

    saveToStorage(PAYOUTS_STORAGE_KEY, [newPayout, ...payouts]);

    return {
      success: true,
      message: 'Withdrawal payout request submitted to the Treasurer for authorization.',
      data: newPayout
    };
  }
};
