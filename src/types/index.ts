// Core Domain Types for Mosunmola Cooperative Multipurpose Society

export type CardStatus = 
  | 'PENDING_ISSUANCE' 
  | 'ISSUED' 
  | 'ACTIVATED' 
  | 'BLOCKED' 
  | 'LOST' 
  | 'EXPIRED' 
  | 'REASSIGNED'
  | 'unassigned' 
  | 'active' 
  | 'pending_verification' 
  | 'lost' 
  | 'replaced';

export type MembershipStatus = 
  | 'PENDING' 
  | 'ACTIVE' 
  | 'INACTIVE' 
  | 'SUSPENDED' 
  | 'TERMINATED';

export type DigitalAccountStatus = 
  | 'NOT_ACTIVATED' 
  | 'ACTIVE' 
  | 'SUSPENDED' 
  | 'BLOCKED';

export interface PhysicalMemberCard {
  cardId: string; // e.g., 'MCS-2026-8942' or 'CARD-2026-77821'
  assignedMemberId?: string; // Canonical Member ID e.g. 'MCS-2026-8942'
  assignedMemberName: string;
  assignedEmail?: string;
  assignedPhone?: string;
  cardType?: 'standard_plastic' | 'rfid_executive' | 'gold_fiduciary';
  batchNumber: string;
  status: CardStatus;
  issuedDate: string;
  activationDate?: string;
  pickupSlipCode?: string;
  securityHash: string;
  branch: string;
}

export interface MemberProfile {
  id: string;
  memberId: string; // Canonical Member ID e.g. 'MCS-2026-8942'
  applicationId?: string; // Links to originating MembershipApplication
  fullName: string;
  dateOfBirth?: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  membershipStatus?: MembershipStatus; // PENDING | ACTIVE | INACTIVE | SUSPENDED | TERMINATED
  digitalAccountStatus?: DigitalAccountStatus; // NOT_ACTIVATED | ACTIVE
  physicalCardStatus?: CardStatus; // PENDING_ISSUANCE | ISSUED | ACTIVATED
  assignedCardId?: string; // Physical card identifier
  status: 'active' | 'pending_kyc' | 'suspended';
  kycVerified: boolean;
  kycDocuments: {
    idType: 'NIN' | 'Voters Card' | 'International Passport' | 'Drivers License' | string;
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
  state?: string;
  lga?: string;
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

export type MembershipApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'MORE_INFORMATION_REQUIRED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'WITHDRAWN'
  | 'pending_approval' 
  | 'approved' 
  | 'rejected';

export interface MembershipApplication {
  id: string; // e.g. 'APP-2026-00482'
  fullName: string;
  dateOfBirth?: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
  occupation: string;
  intendedMonthlySavings: number;
  monthlyThriftTarget: number; // Backwards compatible alias
  savingsPlanId?: 'basic_thrift' | 'standard' | 'executive' | 'premium' | 'institutional' | string;
  idType: 'NIN' | 'FRSC Driver\'s License' | 'International Passport' | 'INEC Voter\'s Card' | 'Drivers License' | 'Voters Card';
  idNumber: string;
  idDocumentStatus?: 'PROVIDED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  idDocumentUrl?: string;
  reasonForJoining: string;
  nextOfKin?: {
    name: string;
    phone: string;
    relationship: string;
    address?: string;
  };
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  status: MembershipApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  assignedCardId?: string;
  approvedMemberId?: string; // Canonical Member ID e.g. 'MCS-2026-8942'
  rejectionReason?: string;
}

export interface CreateMembershipApplicationPayload {
  fullName: string;
  dateOfBirth?: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  lga: string;
  occupation: string;
  intendedMonthlySavings?: number;
  monthlyThriftTarget: number;
  savingsPlanId?: string;
  idType: 'NIN' | 'FRSC Driver\'s License' | 'International Passport' | 'INEC Voter\'s Card' | 'Drivers License' | 'Voters Card';
  idNumber: string;
  idDocumentStatus?: 'PROVIDED' | 'PENDING_REVIEW';
  idDocumentUrl?: string;
  reasonForJoining: string;
  nextOfKin?: {
    name: string;
    phone: string;
    relationship: string;
    address?: string;
  };
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
}

// Configurable Savings Plans
export interface SavingsPlanConfig {
  id: 'basic_thrift' | 'standard' | 'executive' | 'premium' | 'institutional';
  name: string;
  tier: string;
  monthlyAmount: number;
  description: string;
  targetAudience: string;
  recommendedDuration: string;
  benefits: string[];
}

// Configurable Loan Products
export interface LoanProductConfig {
  id: string;
  name: string;
  code: string;
  interestRatePercent: number; // Flat rate per annum
  maxMultiplierOfSavings: number; // Max loan = savings * multiplier
  maxAmount: number;
  minSavingsDurationMonths: number;
  maxTenureMonths: number;
  processingFeePercent: number;
  repaymentFrequency: 'monthly' | 'quarterly';
  description: string;
  eligibilitySummary: string;
}

// Financial Ledger & Immutable Records
export type LedgerTransactionType = 
  | 'OPENING_BALANCE'
  | 'CONTRIBUTION'
  | 'THRIFT_DEPOSIT'
  | 'TARGET_DEPOSIT'
  | 'SHARE_PAYMENT'
  | 'WITHDRAWAL'
  | 'DIVIDEND'
  | 'LOAN_DISBURSEMENT'
  | 'LOAN_REPAYMENT'
  | 'INTEREST'
  | 'ADJUSTMENT'
  | 'REFUND';

export interface LedgerTransaction {
  transactionId: string;
  memberId: string;
  type: LedgerTransactionType;
  amount: number;
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'REVERSED';
  reference: string;
  description: string;
  paymentMethod?: string;
  createdAt: string;
  createdBy?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  balanceAfter: number;
}

// Physical Card Digital Activation DTOs
export type CardLookupStatus = 
  | 'FOUND_ELIGIBLE' 
  | 'ALREADY_ACTIVATED' 
  | 'CARD_NOT_FOUND' 
  | 'CARD_BLOCKED' 
  | 'MEMBERSHIP_NOT_APPROVED';

export interface CardLookupResponse {
  status: CardLookupStatus;
  message: string;
  card?: PhysicalMemberCard;
  membership?: MemberProfile;
  prefill?: {
    fullName: string;
    memberId: string;
    cardId: string;
    maskedPhone: string;
    maskedEmail: string;
    phone: string;
    email: string;
    branch: string;
    joinDate: string;
    occupation?: string;
    address?: string;
  };
}

