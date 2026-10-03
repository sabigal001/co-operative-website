import type { ApiResponse, Guarantor, LoanApplication, RepaymentScheduleItem, Transaction } from '../../types';
import { initialLoans } from '../../mocks/loans';
import { initialTransactions } from '../../mocks/transactions';
import { getFromStorage, saveToStorage } from './storageHelper';

const LOANS_STORAGE_KEY = 'loans_registry';
const TXN_STORAGE_KEY = 'transactions_registry';

export const loanService = {
  async getMemberLoans(memberId: string): Promise<ApiResponse<LoanApplication[]>> {
    await new Promise((r) => setTimeout(r, 300));
    const allLoans = getFromStorage<LoanApplication[]>(LOANS_STORAGE_KEY, initialLoans);
    const memberLoans = allLoans.filter((l) => l.memberId === memberId || l.memberId === 'MCS-2026-8942');
    return {
      success: true,
      message: 'Member loans loaded.',
      data: memberLoans
    };
  },

  async applyForLoan(
    memberId: string,
    memberName: string,
    amount: number,
    purpose: string,
    durationMonths: number,
    guarantors: Guarantor[]
  ): Promise<ApiResponse<LoanApplication>> {
    await new Promise((r) => setTimeout(r, 700));

    const allLoans = getFromStorage<LoanApplication[]>(LOANS_STORAGE_KEY, initialLoans);
    const interestRate = 5.0; // 5% flat cooperative interest
    const interestAmount = (amount * (interestRate / 100) * (durationMonths / 12));
    const totalRepayment = Math.round(amount + interestAmount);
    const monthlyRepayment = Math.round(totalRepayment / durationMonths);

    // Build schedule
    const schedule: RepaymentScheduleItem[] = [];
    const today = new Date();
    for (let i = 1; i <= durationMonths; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, today.getDate());
      schedule.push({
        id: `SCH-${Date.now()}-${i}`,
        dueDate: d.toISOString().split('T')[0],
        amount: monthlyRepayment,
        status: 'pending'
      });
    }

    const newLoan: LoanApplication = {
      id: `LN-2026-${Math.floor(100 + Math.random() * 900)}`,
      memberId,
      memberName,
      amount,
      purpose,
      durationMonths,
      interestRate,
      monthlyRepayment,
      totalRepayment,
      status: 'pending_vetting', // Handed to PA / Admin Officer first!
      appliedDate: new Date().toISOString().split('T')[0],
      totalPaid: 0,
      guarantors,
      repaymentSchedule: schedule
    };

    saveToStorage(LOANS_STORAGE_KEY, [newLoan, ...allLoans]);

    return {
      success: true,
      message: 'Loan application submitted successfully! It is now being vetted by the Secretariat & Admin Officer.',
      data: newLoan
    };
  },

  async repayLoan(loanId: string, amount: number, memberName: string): Promise<ApiResponse<LoanApplication>> {
    await new Promise((r) => setTimeout(r, 600));

    const allLoans = getFromStorage<LoanApplication[]>(LOANS_STORAGE_KEY, initialLoans);
    const loan = allLoans.find((l) => l.id === loanId);

    if (!loan) {
      return {
        success: false,
        message: 'Loan record not found.',
        data: allLoans[0]
      };
    }

    loan.totalPaid += amount;
    if (loan.totalPaid >= loan.totalRepayment) {
      loan.status = 'repaid';
    }

    // Mark next pending installment as paid
    const nextInstallment = loan.repaymentSchedule.find((s) => s.status === 'pending');
    if (nextInstallment) {
      nextInstallment.status = 'paid';
      nextInstallment.paidDate = new Date().toISOString().split('T')[0];
    }

    saveToStorage(LOANS_STORAGE_KEY, allLoans);

    // Record transaction
    const txns = getFromStorage<Transaction[]>(TXN_STORAGE_KEY, initialTransactions);
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(90000 + Math.random() * 9999)}`,
      reference: `REF-MOS-RPY-${Date.now().toString().slice(-5)}`,
      memberId: loan.memberId,
      memberName,
      type: 'loan_repayment',
      amount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'successful',
      description: `Loan Repayment Installment for ${loan.id}`,
      paymentMethod: 'Instant Wallet Payment',
      balanceAfter: 4200000 - amount
    };
    saveToStorage(TXN_STORAGE_KEY, [newTxn, ...txns]);

    return {
      success: true,
      message: `Repayment of ₦${amount.toLocaleString()} processed successfully!`,
      data: loan
    };
  }
};
