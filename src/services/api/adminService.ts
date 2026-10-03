import type { 
  AdminRole, 
  AdminUser, 
  ApiResponse, 
  AuditLog, 
  DepositSubmission, 
  LoanApplication, 
  MemberProfile, 
  PayoutRequest, 
  PhysicalMemberCard, 
  SystemMetrics,
  Transaction
} from '../../types';
import { 
  initialAuditLogs, 
  initialPendingDeposits, 
  initialPayoutRequests, 
  initialSystemMetrics, 
  mockAdminUsers 
} from '../../mocks/admins';
import { initialPhysicalCards } from '../../mocks/cards';
import { initialMembersRegistry } from '../../mocks/members';
import { initialLoans } from '../../mocks/loans';
import { initialTransactions } from '../../mocks/transactions';
import { getFromStorage, saveToStorage } from './storageHelper';

const CARDS_STORAGE_KEY = 'physical_cards';
const MEMBERS_STORAGE_KEY = 'members_registry';
const LOANS_STORAGE_KEY = 'loans_registry';
const DEPOSITS_STORAGE_KEY = 'pending_deposits';
const PAYOUTS_STORAGE_KEY = 'payout_requests';
const AUDIT_STORAGE_KEY = 'audit_logs';
const METRICS_STORAGE_KEY = 'system_metrics';
const ADMINS_STORAGE_KEY = 'admin_users';
const TXN_STORAGE_KEY = 'transactions_registry';

export const adminService = {
  // Shared / General
  async getSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
    await new Promise((r) => setTimeout(r, 200));
    const metrics = getFromStorage<SystemMetrics>(METRICS_STORAGE_KEY, initialSystemMetrics);
    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    const loans = getFromStorage<LoanApplication[]>(LOANS_STORAGE_KEY, initialLoans);
    
    // dynamically sync counts
    metrics.pendingDepositsCount = deposits.filter((d) => d.status === 'pending').length;
    metrics.pendingLoanVettingsCount = loans.filter((l) => l.status === 'pending_vetting').length;
    metrics.pendingDisbursementsCount = loans.filter((l) => l.status === 'vetted_pending_treasurer').length;

    return {
      success: true,
      message: 'System metrics retrieved.',
      data: metrics
    };
  },

  async getAuditLogs(): Promise<ApiResponse<AuditLog[]>> {
    await new Promise((r) => setTimeout(r, 250));
    const logs = getFromStorage<AuditLog[]>(AUDIT_STORAGE_KEY, initialAuditLogs);
    return {
      success: true,
      message: 'Audit logs retrieved.',
      data: logs
    };
  },

  async logAction(adminName: string, adminRole: AdminRole, action: string, details: string): Promise<void> {
    const logs = getFromStorage<AuditLog[]>(AUDIT_STORAGE_KEY, initialAuditLogs);
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      adminName,
      adminRole,
      action,
      details,
      ip: '102.89.44.12'
    };
    saveToStorage(AUDIT_STORAGE_KEY, [newLog, ...logs]);
  },

  // -------------------------------------------------------------
  // 1. MASTER ADMIN (SUPER ADMIN) CAPABILITIES
  // -------------------------------------------------------------
  async getAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
    await new Promise((r) => setTimeout(r, 200));
    const admins = getFromStorage<AdminUser[]>(ADMINS_STORAGE_KEY, mockAdminUsers);
    return {
      success: true,
      message: 'Admin staff list retrieved.',
      data: admins
    };
  },

  async updateAdminRole(userId: string, newRole: AdminRole, updaterName: string): Promise<ApiResponse<AdminUser>> {
    await new Promise((r) => setTimeout(r, 400));
    const admins = getFromStorage<AdminUser[]>(ADMINS_STORAGE_KEY, mockAdminUsers);
    const user = admins.find((a) => a.id === userId);
    if (!user) {
      return { success: false, message: 'Admin user not found', data: admins[0] };
    }

    user.role = newRole;
    saveToStorage(ADMINS_STORAGE_KEY, admins);
    await this.logAction(updaterName, 'master_admin', 'UPDATE_ADMIN_ROLE', `Changed role of ${user.name} to ${newRole}`);

    return {
      success: true,
      message: `Role for ${user.name} successfully updated to ${newRole}.`,
      data: user
    };
  },

  async getPhysicalCards(): Promise<ApiResponse<PhysicalMemberCard[]>> {
    await new Promise((r) => setTimeout(r, 300));
    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    return {
      success: true,
      message: 'Physical card registry retrieved.',
      data: cards
    };
  },

  async importCardBatch(
    batchName: string, 
    prefix: string, 
    count: number, 
    branch: string, 
    adminName: string
  ): Promise<ApiResponse<PhysicalMemberCard[]>> {
    await new Promise((r) => setTimeout(r, 600));
    const existingCards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const newCards: PhysicalMemberCard[] = [];

    const startNum = 1000 + existingCards.length;
    for (let i = 0; i < count; i++) {
      const cardNum = startNum + i;
      newCards.push({
        cardId: `${prefix}-${cardNum}`,
        batchNumber: batchName,
        assignedMemberName: 'Unassigned Member',
        status: 'unassigned',
        issuedDate: new Date().toISOString().split('T')[0],
        securityHash: `sha256-${cardNum}a8f7c9e`,
        branch
      });
    }

    const merged = [...newCards, ...existingCards];
    saveToStorage(CARDS_STORAGE_KEY, merged);

    await this.logAction(
      adminName, 
      'master_admin', 
      'IMPORT_CARD_BATCH', 
      `Imported ${count} cards under batch "${batchName}" for branch ${branch}`
    );

    return {
      success: true,
      message: `Successfully generated and registered ${count} physical member ID cards!`,
      data: newCards
    };
  },

  async updateCardStatus(cardId: string, status: PhysicalMemberCard['status'], adminName: string): Promise<ApiResponse<PhysicalMemberCard>> {
    await new Promise((r) => setTimeout(r, 300));
    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const card = cards.find((c) => c.cardId === cardId);
    if (!card) {
      return { success: false, message: 'Card not found', data: cards[0] };
    }

    card.status = status;
    saveToStorage(CARDS_STORAGE_KEY, cards);

    await this.logAction(
      adminName, 
      'master_admin', 
      'UPDATE_CARD_STATUS', 
      `Changed status of Card ID ${cardId} to ${status}`
    );

    return {
      success: true,
      message: `Card status changed to ${status}.`,
      data: card
    };
  },

  async triggerDividendDistribution(poolAmount: number, percentageYield: number, adminName: string): Promise<ApiResponse<{ distributed: boolean }>> {
    await new Promise((r) => setTimeout(r, 800));
    const metrics = getFromStorage<SystemMetrics>(METRICS_STORAGE_KEY, initialSystemMetrics);
    metrics.totalDividendsPaid += poolAmount;
    saveToStorage(METRICS_STORAGE_KEY, metrics);

    await this.logAction(
      adminName, 
      'master_admin', 
      'DIVIDEND_DISTRIBUTION', 
      `Triggered dividend distribution of ₦${poolAmount.toLocaleString()} (${percentageYield}% yield) across eligible members.`
    );

    return {
      success: true,
      message: `Dividend distribution of ₦${poolAmount.toLocaleString()} triggered successfully!`,
      data: { distributed: true }
    };
  },

  // -------------------------------------------------------------
  // 2. TREASURER ADMIN CAPABILITIES (FINANCIAL OPS)
  // -------------------------------------------------------------
  async getPendingDeposits(): Promise<ApiResponse<DepositSubmission[]>> {
    await new Promise((r) => setTimeout(r, 200));
    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    return {
      success: true,
      message: 'Deposit requests retrieved.',
      data: deposits
    };
  },

  async approveDeposit(depositId: string, treasurerName: string): Promise<ApiResponse<DepositSubmission>> {
    await new Promise((r) => setTimeout(r, 500));
    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    const deposit = deposits.find((d) => d.id === depositId);
    if (!deposit) {
      return { success: false, message: 'Deposit record not found', data: deposits[0] };
    }

    deposit.status = 'approved';
    deposit.reviewedBy = treasurerName;
    saveToStorage(DEPOSITS_STORAGE_KEY, deposits);

    // Update transaction to successful
    const txns = getFromStorage<Transaction[]>(TXN_STORAGE_KEY, initialTransactions);
    const txn = txns.find((t) => t.reference === deposit.reference);
    if (txn) {
      txn.status = 'successful';
      saveToStorage(TXN_STORAGE_KEY, txns);
    }

    await this.logAction(
      treasurerName, 
      'treasurer', 
      'APPROVED_DEPOSIT', 
      `Approved bank deposit of ₦${deposit.amount.toLocaleString()} for ${deposit.memberName} (${deposit.reference})`
    );

    return {
      success: true,
      message: `Deposit of ₦${deposit.amount.toLocaleString()} approved and member wallet credited!`,
      data: deposit
    };
  },

  async rejectDeposit(depositId: string, reason: string, treasurerName: string): Promise<ApiResponse<DepositSubmission>> {
    await new Promise((r) => setTimeout(r, 400));
    const deposits = getFromStorage<DepositSubmission[]>(DEPOSITS_STORAGE_KEY, initialPendingDeposits);
    const deposit = deposits.find((d) => d.id === depositId);
    if (!deposit) {
      return { success: false, message: 'Deposit not found', data: deposits[0] };
    }

    deposit.status = 'rejected';
    deposit.reviewedBy = treasurerName;
    deposit.rejectionReason = reason;
    saveToStorage(DEPOSITS_STORAGE_KEY, deposits);

    await this.logAction(
      treasurerName, 
      'treasurer', 
      'REJECTED_DEPOSIT', 
      `Rejected deposit ${deposit.id} for ${deposit.memberName}. Reason: ${reason}`
    );

    return {
      success: true,
      message: 'Deposit submission rejected.',
      data: deposit
    };
  },

  async getDisbursementQueue(): Promise<ApiResponse<LoanApplication[]>> {
    await new Promise((r) => setTimeout(r, 250));
    const loans = getFromStorage<LoanApplication[]>(LOANS_STORAGE_KEY, initialLoans);
    const vettedLoans = loans.filter((l) => l.status === 'vetted_pending_treasurer');
    return {
      success: true,
      message: 'Loans awaiting disbursement retrieved.',
      data: vettedLoans
    };
  },

  async disburseLoan(loanId: string, treasurerName: string): Promise<ApiResponse<LoanApplication>> {
    await new Promise((r) => setTimeout(r, 600));
    const loans = getFromStorage<LoanApplication[]>(LOANS_STORAGE_KEY, initialLoans);
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      return { success: false, message: 'Loan not found', data: loans[0] };
    }

    loan.status = 'approved_disbursed';
    loan.disbursedDate = new Date().toISOString().split('T')[0];
    loan.disbursedBy = treasurerName;
    loan.treasurerNotes = 'Disbursed via automated cooperative treasury bank transfer.';

    // Populate repayment schedule if empty
    if (loan.repaymentSchedule.length === 0) {
      const today = new Date();
      for (let i = 1; i <= loan.durationMonths; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, today.getDate());
        loan.repaymentSchedule.push({
          id: `SCH-${loan.id}-${i}`,
          dueDate: d.toISOString().split('T')[0],
          amount: loan.monthlyRepayment,
          status: 'pending'
        });
      }
    }

    saveToStorage(LOANS_STORAGE_KEY, loans);

    // Record disbursement transaction
    const txns = getFromStorage<Transaction[]>(TXN_STORAGE_KEY, initialTransactions);
    const newTxn: Transaction = {
      id: `TXN-${Date.now().toString().slice(-5)}`,
      reference: `REF-DISB-${loan.id}`,
      memberId: loan.memberId,
      memberName: loan.memberName,
      type: 'loan_disbursement',
      amount: loan.amount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'successful',
      description: `Disbursement of Loan ${loan.id} - ${loan.purpose}`,
      paymentMethod: 'Treasury NIP Bank Transfer',
      balanceAfter: 4200000 + loan.amount
    };
    saveToStorage(TXN_STORAGE_KEY, [newTxn, ...txns]);

    await this.logAction(
      treasurerName, 
      'treasurer', 
      'DISBURSED_LOAN', 
      `Disbursed ₦${loan.amount.toLocaleString()} for loan ${loan.id} to ${loan.memberName}`
    );

    return {
      success: true,
      message: `Loan ₦${loan.amount.toLocaleString()} disbursed successfully to ${loan.memberName}!`,
      data: loan
    };
  },

  async getPayoutRequests(): Promise<ApiResponse<PayoutRequest[]>> {
    await new Promise((r) => setTimeout(r, 200));
    const payouts = getFromStorage<PayoutRequest[]>(PAYOUTS_STORAGE_KEY, initialPayoutRequests);
    return {
      success: true,
      message: 'Payout requests retrieved.',
      data: payouts
    };
  },

  async approvePayout(payoutId: string, treasurerName: string): Promise<ApiResponse<PayoutRequest>> {
    await new Promise((r) => setTimeout(r, 450));
    const payouts = getFromStorage<PayoutRequest[]>(PAYOUTS_STORAGE_KEY, initialPayoutRequests);
    const payout = payouts.find((p) => p.id === payoutId);
    if (!payout) {
      return { success: false, message: 'Payout not found', data: payouts[0] };
    }

    payout.status = 'approved';
    saveToStorage(PAYOUTS_STORAGE_KEY, payouts);

    await this.logAction(
      treasurerName, 
      'treasurer', 
      'APPROVED_PAYOUT', 
      `Authorized withdrawal payout of ₦${payout.amount.toLocaleString()} to ${payout.accountName} (${payout.bankName})`
    );

    return {
      success: true,
      message: `Payout of ₦${payout.amount.toLocaleString()} authorized and sent to bank!`,
      data: payout
    };
  },

  // -------------------------------------------------------------
  // 3. PA / ADMIN OFFICER CAPABILITIES (OPERATIONS & KYC)
  // -------------------------------------------------------------
  async getMembersForSupport(searchQuery?: string): Promise<ApiResponse<MemberProfile[]>> {
    await new Promise((r) => setTimeout(r, 200));
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);
    if (!searchQuery) {
      return { success: true, message: 'Members retrieved.', data: members };
    }

    const q = searchQuery.toLowerCase();
    const filtered = members.filter((m) => 
      m.fullName.toLowerCase().includes(q) ||
      m.memberId.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q)
    );

    return {
      success: true,
      message: `Found ${filtered.length} member(s).`,
      data: filtered
    };
  },

  async getLoansForVetting(): Promise<ApiResponse<LoanApplication[]>> {
    await new Promise((r) => setTimeout(r, 200));
    const loans = getFromStorage<LoanApplication[]>(LOANS_STORAGE_KEY, initialLoans);
    const pendingLoans = loans.filter((l) => l.status === 'pending_vetting');
    return {
      success: true,
      message: 'Loans awaiting vetting retrieved.',
      data: pendingLoans
    };
  },

  async vetLoanApplication(
    loanId: string, 
    approved: boolean, 
    comments: string, 
    officerName: string
  ): Promise<ApiResponse<LoanApplication>> {
    await new Promise((r) => setTimeout(r, 500));
    const loans = getFromStorage<LoanApplication[]>(LOANS_STORAGE_KEY, initialLoans);
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) {
      return { success: false, message: 'Loan not found', data: loans[0] };
    }

    if (approved) {
      loan.status = 'vetted_pending_treasurer';
      loan.vettingNotes = comments || 'Guarantors verified and credit history vetted. Recommended for disbursement.';
    } else {
      loan.status = 'rejected';
      loan.vettingNotes = comments || 'Guarantor verification failed or insufficient savings history.';
    }
    loan.vettedBy = officerName;

    saveToStorage(LOANS_STORAGE_KEY, loans);

    await this.logAction(
      officerName, 
      'pa_officer', 
      approved ? 'VETTED_LOAN_FORWARDED' : 'REJECTED_LOAN_VETTING', 
      `${approved ? 'Vetted and forwarded' : 'Rejected'} loan ${loan.id} for ${loan.memberName}. Notes: ${comments}`
    );

    return {
      success: true,
      message: approved 
        ? 'Loan application vetted and forwarded to the Treasurer for fund disbursement!' 
        : 'Loan application rejected during preliminary vetting.',
      data: loan
    };
  },

  async verifyMemberKyc(memberId: string, verified: boolean, officerName: string): Promise<ApiResponse<MemberProfile>> {
    await new Promise((r) => setTimeout(r, 400));
    const members = getFromStorage<MemberProfile[]>(MEMBERS_STORAGE_KEY, initialMembersRegistry);
    const member = members.find((m) => m.id === memberId || m.memberId === memberId);
    if (!member) {
      return { success: false, message: 'Member not found', data: members[0] };
    }

    member.kycVerified = verified;
    member.status = verified ? 'active' : 'pending_kyc';
    member.kycDocuments.status = verified ? 'verified' : 'rejected';

    saveToStorage(MEMBERS_STORAGE_KEY, members);

    await this.logAction(
      officerName, 
      'pa_officer', 
      'KYC_VERIFICATION', 
      `${verified ? 'Verified' : 'Rejected'} KYC documents for ${member.fullName} (${member.memberId})`
    );

    return {
      success: true,
      message: verified ? `KYC verified for ${member.fullName}!` : `KYC rejected for ${member.fullName}.`,
      data: member
    };
  },

  async issuePickupSlip(memberId: string, officerName: string): Promise<ApiResponse<{ slipCode: string }>> {
    await new Promise((r) => setTimeout(r, 300));
    const cards = getFromStorage<PhysicalMemberCard[]>(CARDS_STORAGE_KEY, initialPhysicalCards);
    const card = cards.find((c) => c.cardId === memberId);
    const slipCode = `SLIP-${Date.now().toString().slice(-6)}-LAG`;

    if (card) {
      card.pickupSlipCode = slipCode;
      saveToStorage(CARDS_STORAGE_KEY, cards);
    }

    await this.logAction(
      officerName, 
      'pa_officer', 
      'ISSUE_PICKUP_SLIP', 
      `Issued physical card pickup slip (${slipCode}) for Member ID ${memberId}`
    );

    return {
      success: true,
      message: `Physical card pickup slip generated: ${slipCode}`,
      data: { slipCode }
    };
  }
};
