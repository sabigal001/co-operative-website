// Core Domain Types for Mosunmola Cooperative Multipurpose Society

export type CardStatus = 'unassigned' | 'active' | 'pending_verification' | 'lost' | 'replaced';

export interface PhysicalMemberCard {
  cardId: string; // e.g., 'MCS-2026-8942'
  batchNumber: string;
  assignedMemberName: string;
  assignedEmail?: string;
  assignedPhone?: string;
  status: CardStatus;
  issuedDate: string;
  activationDate?: string;
  pickupSlipCode?: string;
  securityHash: string;
  branch: string;
}

export interface MemberProfile {
  id: string;
  memberId: string; // Matches physical card ID
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  status: 'active' | 'pending_kyc' | 'suspended';
  kycVerified: boolean;
  kycDocuments: {
    idType: 'NIN' | 'Voters Card' | 'International Passport' | 'Drivers License';
    idNumber: string;
    fileUrl: string;
    status: 'pending' | 'verified' | 'rejected';
    submittedAt: string;
  };
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  qrToken: string;
  address: string;
  occupation: string;
}

export interface SavingsAccount {
  totalBalance: number;
  voluntarySavings: number;
  targetSavings: number;
  dividendsEarned: number;
  annualReturnRate: number; // e.g. 18.5%
  targetPlans: TargetPlan[];
}

export interface TargetPlan {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  startDate: string;
  endDate: string;
  category: 'estate' | 'education' | 'business' | 'holiday' | 'vehicle';
  autoDebit: boolean;
  color: string;
}

export type LoanStatus = 
  | 'pending_vetting'              // Submitted by member, waiting for PA / Admin Officer
  | 'vetted_pending_treasurer'     // Vetted by PA, forwarded to Treasurer for disbursement
  | 'approved_disbursed'           // Treasurer approved and funds disbursed
  | 'rejected' 
  | 'repaid';

export interface Guarantor {
  memberId: string;
  name: string;
  phone: string;
  relationship: string;
  status: 'accepted' | 'pending' | 'rejected';
}

export interface RepaymentScheduleItem {
  id: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

export interface LoanApplication {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  purpose: string;
  durationMonths: number;
  interestRate: number; // e.g. 5%
  monthlyRepayment: number;
  totalRepayment: number;
  status: LoanStatus;
  appliedDate: string;
  disbursedDate?: string;
  guarantors: Guarantor[];
  repaymentSchedule: RepaymentScheduleItem[];
  vettingNotes?: string;
  vettedBy?: string;
  treasurerNotes?: string;
  disbursedBy?: string;
  totalPaid: number;
}

export interface InvestmentAsset {
  id: string;
  title: string;
  category: 'real_estate' | 'agro_processing' | 'thrift_pool';
  location: string;
  unitPrice: number;
  totalUnits: number;
  availableUnits: number;
  annualYieldPercent: number;
  durationMonths: number;
  image: string;
  description: string;
  features: string[];
}

export interface MemberInvestment {
  id: string;
  memberId: string;
  assetId: string;
  assetTitle: string;
  units: number;
  totalInvested: number;
  purchaseDate: string;
  maturityDate: string;
  projectedPayout: number;
  certificateNumber: string;
  status: 'active' | 'matured';
}

export type TransactionType = 
  | 'deposit' 
  | 'withdrawal' 
  | 'loan_disbursement' 
  | 'loan_repayment' 
  | 'dividend' 
  | 'target_savings';

export interface Transaction {
  id: string;
  reference: string;
  memberId: string;
  memberName: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: 'successful' | 'pending' | 'failed';
  description: string;
  paymentMethod: string;
  balanceAfter: number;
}

export interface DepositSubmission {
  id: string;
  reference: string;
  memberId: string;
  memberName: string;
  amount: number;
  depositType: 'voluntary_savings' | 'target_plan' | 'loan_repayment';
  targetPlanId?: string;
  paymentProofUrl: string;
  bankReference: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface PayoutRequest {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  payoutType: 'savings_withdrawal' | 'dividend_distribution' | 'target_maturity';
  bankName: string;
  accountNumber: string;
  accountName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type AdminRole = 'master_admin' | 'treasurer' | 'pa_officer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastActive: string;
  department: string;
  avatar: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  details: string;
  ip: string;
}

export interface SystemMetrics {
  totalLiquidity: number;
  totalSavingsPool: number;
  totalOutstandingLoans: number;
  totalDisbursedLoans: number;
  totalDividendsPaid: number;
  activeMemberCount: number;
  pendingDepositsCount: number;
  pendingLoanVettingsCount: number;
  pendingDisbursementsCount: number;
  cardsInCirculation: number;
  availableCardStock: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

// DTOs for registration and verification
export interface CardVerificationResult {
  valid: boolean;
  cardId: string;
  status: CardStatus;
  prefill?: {
    fullName: string;
    branch: string;
    phone?: string;
    email?: string;
  };
  reason?: string;
}

export interface RegisterMemberPayload {
  cardId: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  avatarUrl?: string;
  nin: string;
  address: string;
  occupation: string;
  nextOfKin: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
}

export type MembershipApplicationStatus = 'pending_approval' | 'approved' | 'rejected';

export interface MembershipApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
  occupation: string;
  monthlyThriftTarget: number;
  idType: 'NIN' | 'Drivers License' | 'International Passport' | 'Voters Card';
  idNumber: string;
  reasonForJoining: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  status: MembershipApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  assignedCardId?: string;
  rejectionReason?: string;
}

export interface CreateMembershipApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
  occupation: string;
  monthlyThriftTarget: number;
  idType: 'NIN' | 'Drivers License' | 'International Passport' | 'Voters Card';
  idNumber: string;
  reasonForJoining: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
}
