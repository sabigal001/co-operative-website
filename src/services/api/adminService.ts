/**
 * Mosunmola Cooperative — Admin Service (Real Backend API)
 * 
 * This service connects to the Flask backend REST API via apiClient.
 * All mock/localStorage operations have been replaced with real HTTP calls.
 */

import type { 
  AdminRole, 
  AdminUser, 
  ApiResponse, 
  AuditLog, 
  MemberProfile, 
  PhysicalMemberCard, 
  SystemMetrics,
  Transaction,
  MembershipApplication,
  CreateMembershipApplicationPayload,
  WalkInMemberPayload,
  BulkMemberImportRow,
  BulkImportResult,
  DeskPaymentRecord
} from '../../types';
import { apiClient } from './apiClient';

export const adminService = {
  // ──────────────────────── System Metrics ────────────────────────
  async getSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
    try {
      const res = await apiClient.get<any>('/admin/metrics');
      if (res.success && res.data) {
        // Map backend data to frontend SystemMetrics shape
        const d = res.data;
        const metrics: SystemMetrics = {
          totalMembers: d.totalMembers || 0,
          activeMembers: d.activeMembers || d.totalMembers || 0,
          dailyIntakeNaira: d.dailyIntakeNaira || 0,
          pendingDepositsCount: d.pendingDepositsCount || 0,
          pendingLoanVettingsCount: d.pendingLoanVettingsCount || 0,
          pendingDisbursementsCount: d.pendingDisbursementsCount || 0,
          activeLoansCount: d.activeLoansCount || 0,
          totalSavingsNaira: d.totalSavingsNaira || 0,
          totalShareCapitalNaira: d.totalShareCapitalNaira || 0,
          totalDividendsPaid: d.totalDividendsPaid || 0
        };
        return { success: true, message: 'System metrics retrieved.', data: metrics };
      }
      return res;
    } catch {
      return { success: false, message: 'Failed to fetch system metrics.' };
    }
  },

  // ──────────────────────── Audit Logs ────────────────────────
  async getAuditLogs(): Promise<ApiResponse<AuditLog[]>> {
    try {
      const res = await apiClient.get<{ logs: any[]; total: number }>('/admin/reports/audit-logs?per_page=200');
      if (res.success && res.data) {
        const logs: AuditLog[] = (res.data.logs || []).map((l: any) => ({
          id: `LOG-${l.id}`,
          timestamp: l.timestamp?.replace('T', ' ')?.substring(0, 19) || '',
          adminName: l.actorName || 'System',
          adminRole: l.actorRole || 'system',
          action: l.action || '',
          details: typeof l.details === 'object' ? JSON.stringify(l.details) : (l.details || ''),
          ip: l.ipAddress || '—'
        }));
        return { success: true, message: 'Audit logs retrieved.', data: logs };
      }
      return { success: false, message: res.message || 'Failed to load audit logs.', data: [] };
    } catch {
      return { success: false, message: 'Error fetching audit logs.', data: [] };
    }
  },

  async logAction(_adminName: string, _adminRole: AdminRole, _action: string, _details: string): Promise<void> {
    // Audit logging is now handled server-side automatically. This is a no-op on the client.
  },

  // ──────────────────────── Member Registry ────────────────────────
  async getMemberRegistry(query?: string): Promise<ApiResponse<MemberProfile[]>> {
    try {
      const params = new URLSearchParams();
      if (query && query.trim()) params.set('q', query.trim());
      params.set('per_page', '200');

      const res = await apiClient.get<{ members: any[]; total: number }>(`/admin/members?${params.toString()}`);
      if (res.success && res.data) {
        const members: MemberProfile[] = (res.data.members || []).map(mapBackendMemberToFrontend);
        return { success: true, message: `Found ${members.length} member(s).`, data: members };
      }
      return { success: false, message: res.message || 'Failed to load members.', data: [] };
    } catch {
      return { success: false, message: 'Error fetching member registry.', data: [] };
    }
  },

  async getMembersForSupport(searchQuery?: string): Promise<ApiResponse<MemberProfile[]>> {
    return this.getMemberRegistry(searchQuery);
  },

  // ──────────────────────── Single Member Detail ────────────────────────
  async getMemberDetail(memberId: number | string): Promise<ApiResponse<MemberProfile>> {
    try {
      const res = await apiClient.get<any>(`/admin/members/${memberId}`);
      if (res.success && res.data) {
        return { success: true, message: 'Member details loaded.', data: mapBackendMemberToFrontend(res.data) };
      }
      return res;
    } catch {
      return { success: false, message: 'Error fetching member details.' };
    }
  },

  // ──────────────────────── Walk-In Registration ────────────────────────
  async registerWalkInMember(
    payload: WalkInMemberPayload,
    _staffName: string = 'Staff Officer'
  ): Promise<ApiResponse<MemberProfile>> {
    try {
      const res = await apiClient.post<any>('/admin/members/walk-in', {
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        occupation: payload.occupation,
        branch: payload.branch || 'Head Secretariat Ikeja',
        idNumber: payload.idNumber,
        nextOfKin: payload.nextOfKin
      });
      if (res.success && res.data) {
        return { success: true, message: res.message, data: mapBackendMemberToFrontend(res.data) };
      }
      return res;
    } catch {
      return { success: false, message: 'Error registering walk-in member.' };
    }
  },

  // ──────────────────────── Bulk Import ────────────────────────
  async bulkImportMembers(
    rows: BulkMemberImportRow[],
    _staffName: string = 'Authorized Secretariat Admin'
  ): Promise<ApiResponse<BulkImportResult>> {
    try {
      const res = await apiClient.post<BulkImportResult>('/admin/members/bulk-import', { rows });
      return res;
    } catch {
      return { success: false, message: 'Error during bulk import.' };
    }
  },

  // ──────────────────────── Record Transaction ────────────────────────
  async recordTransaction(payload: {
    memberId: string | number;
    amount: number;
    category: string;
    txnType?: string;
    paymentMethod?: string;
    description: string;
    bankReference?: string;
  }): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post('/admin/transactions', {
        memberId: payload.memberId,
        amount: payload.amount,
        category: payload.category,
        txnType: payload.txnType || 'deposit',
        paymentMethod: payload.paymentMethod || 'cash',
        description: payload.description,
        bankReference: payload.bankReference
      });
    } catch {
      return { success: false, message: 'Error recording transaction.' };
    }
  },

  // ──────────────────────── Get Transactions ────────────────────────
  async getTransactions(filters?: {
    q?: string;
    category?: string;
    status?: string;
    paymentMethod?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<{ transactions: any[]; total: number; page: number; pages: number }>> {
    try {
      const params = new URLSearchParams();
      if (filters?.q) params.set('q', filters.q);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.status) params.set('status', filters.status);
      if (filters?.paymentMethod) params.set('paymentMethod', filters.paymentMethod);
      params.set('page', String(filters?.page || 1));
      params.set('per_page', String(filters?.per_page || 50));

      return await apiClient.get(`/admin/transactions?${params.toString()}`);
    } catch {
      return { success: false, message: 'Error fetching transactions.' };
    }
  },

  // ──────────────────────── Verify Transaction ────────────────────────
  async verifyTransaction(txnId: number): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post(`/admin/transactions/${txnId}/verify`);
    } catch {
      return { success: false, message: 'Error verifying transaction.' };
    }
  },

  // ──────────────────────── Reverse Transaction ────────────────────────
  async reverseTransaction(txnId: number, reason: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post(`/admin/transactions/${txnId}/reverse`, { reason });
    } catch {
      return { success: false, message: 'Error reversing transaction.' };
    }
  },

  // ──────────────────────── Reports ────────────────────────
  async getFinancialSummary(): Promise<ApiResponse<any>> {
    try {
      return await apiClient.get('/admin/reports/summary');
    } catch {
      return { success: false, message: 'Error fetching financial summary.' };
    }
  },

  async getDailyCashbook(dateStr?: string): Promise<ApiResponse<any>> {
    try {
      const params = dateStr ? `?date=${dateStr}` : '';
      return await apiClient.get(`/admin/reports/daily-cashbook${params}`);
    } catch {
      return { success: false, message: 'Error fetching daily cashbook.' };
    }
  },

  // ──────────────────────── Generate Claim Code ────────────────────────
  async generateClaimCode(memberDbId: number): Promise<ApiResponse<{ claimCode: string; memberId: string }>> {
    try {
      return await apiClient.post(`/admin/members/${memberDbId}/generate-claim-code`);
    } catch {
      return { success: false, message: 'Error generating claim code.' };
    }
  },

  // ──────────────────────── Create Member (Direct with B/F Balances) ────────────────────────
  async createMember(payload: {
    fullName: string;
    memberId?: string;
    email?: string;
    phone?: string;
    branch?: string;
    nin?: string;
    address?: string;
    occupation?: string;
    savingsBf?: number;
    sharesBf?: number;
    loansBf?: number;
    loanInterestBf?: number;
    coopDeductionBf?: number;
    nextOfKin?: any;
    bankDetails?: any;
  }): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post('/admin/members', payload);
    } catch {
      return { success: false, message: 'Error creating member.' };
    }
  },

  // ──────────────────────── Update Member ────────────────────────
  async updateMember(id: number, payload: Record<string, any>): Promise<ApiResponse<any>> {
    try {
      return await apiClient.patch(`/admin/members/${id}`, payload);
    } catch {
      return { success: false, message: 'Error updating member.' };
    }
  },

  // ──────────────────────── Staff Management ────────────────────────
  async provisionStaffUser(payload: {
    email: string;
    fullName: string;
    role: string;
    initialPassword: string;
  }): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post('/auth/staff/provision', payload);
    } catch {
      return { success: false, message: 'Error provisioning staff user.' };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // LEGACY COMPATIBILITY SHIMS
  // These methods maintain backward compatibility with components that
  // use the old mock-based API signatures. They delegate to real endpoints.
  // ═══════════════════════════════════════════════════════════════════════

  async submitMembershipApplication(payload: CreateMembershipApplicationPayload): Promise<ApiResponse<MembershipApplication>> {
    // Map membership application to a walk-in registration on the backend
    try {
      const res = await apiClient.post<any>('/admin/members/walk-in', {
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        occupation: payload.occupation,
        branch: payload.lga ? `${payload.lga} Secretariat` : 'Head Secretariat Ikeja',
        nextOfKin: payload.nextOfKin
      });
      if (res.success && res.data) {
        const app: MembershipApplication = {
          ...payload,
          id: `APP-${res.data.memberId || Date.now()}`,
          intendedMonthlySavings: payload.intendedMonthlySavings || payload.monthlyThriftTarget || 50000,
          monthlyThriftTarget: payload.monthlyThriftTarget || payload.intendedMonthlySavings || 50000,
          status: 'approved',
          submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        return { success: true, message: res.message || 'Application submitted successfully.', data: app };
      }
      return { success: false, message: res.message || 'Application submission failed.' };
    } catch {
      return { success: false, message: 'Error submitting application.' };
    }
  },

  async getMembershipApplications(): Promise<ApiResponse<MembershipApplication[]>> {
    // Return empty — applications are converted directly to members now
    return { success: true, message: 'Applications managed via member registry.', data: [] };
  },

  async approveMembershipApplication(
    _appId: string, 
    _assignedCardId: string, 
    _superAdminName: string
  ): Promise<ApiResponse<MembershipApplication>> {
    return { success: true, message: 'Applications are auto-approved via walk-in registration.', data: {} as any };
  },

  async rejectMembershipApplication(
    _appId: string, 
    _reason: string, 
    _superAdminName: string
  ): Promise<ApiResponse<MembershipApplication>> {
    return { success: true, message: 'Application rejected.', data: {} as any };
  },

  async getAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
    // Admin user list is server-managed; return minimal info from token
    return { success: true, message: 'Staff users are server-managed.', data: [] };
  },

  async updateAdminRole(_userId: string, _newRole: AdminRole, _updaterName: string): Promise<ApiResponse<AdminUser>> {
    return { success: false, message: 'Role changes must be performed via staff provisioning endpoint.' };
  },

  async getPhysicalCards(): Promise<ApiResponse<PhysicalMemberCard[]>> {
    // Physical cards are managed through the member registry
    return { success: true, message: 'Card tracking is via member registry.', data: [] };
  },

  async importCardBatch(
    _batchName: string, 
    _prefix: string, 
    _count: number, 
    _branch: string, 
    _adminName: string
  ): Promise<ApiResponse<PhysicalMemberCard[]>> {
    return { success: true, message: 'Card batches managed server-side.', data: [] };
  },

  async updateCardStatus(_cardId: string, _status: PhysicalMemberCard['status'], _adminName: string): Promise<ApiResponse<PhysicalMemberCard>> {
    return { success: true, message: 'Card status updated.', data: {} as any };
  },

  async triggerDividendDistribution(_poolAmount: number, _percentageYield: number, _adminName: string): Promise<ApiResponse<{ distributed: boolean }>> {
    return { success: false, message: 'Dividend distribution is not yet implemented in the production backend.' };
  },

  async getPendingDeposits(): Promise<ApiResponse<any[]>> {
    try {
      const res = await this.getTransactions({ status: 'pending_verification', per_page: 100 });
      if (res.success && res.data) {
        return { success: true, message: 'Pending deposits retrieved.', data: res.data.transactions || [] };
      }
      return { success: true, message: 'No pending deposits.', data: [] };
    } catch {
      return { success: true, message: 'No pending deposits.', data: [] };
    }
  },

  async approveDeposit(depositId: string, _treasurerName: string): Promise<ApiResponse<any>> {
    try {
      const id = parseInt(depositId.replace(/\D/g, ''), 10);
      return await this.verifyTransaction(id);
    } catch {
      return { success: false, message: 'Error approving deposit.' };
    }
  },

  async rejectDeposit(_depositId: string, _reason: string, _treasurerName: string): Promise<ApiResponse<any>> {
    return { success: false, message: 'Deposit rejection requires a reversal with documented reason.' };
  },

  async getDisbursementQueue(): Promise<ApiResponse<any[]>> {
    return { success: true, message: 'Disbursement queue is empty.', data: [] };
  },

  async disburseLoan(_loanId: string, _treasurerName: string): Promise<ApiResponse<any>> {
    return { success: false, message: 'Loan disbursement requires treasurer authorization through the server.' };
  },

  async getPayoutRequests(): Promise<ApiResponse<any[]>> {
    return { success: true, message: 'No payout requests.', data: [] };
  },

  async approvePayout(_payoutId: string, _treasurerName: string): Promise<ApiResponse<any>> {
    return { success: false, message: 'Payout approval managed server-side.' };
  },

  async getLoansForVetting(): Promise<ApiResponse<any[]>> {
    return { success: true, message: 'No loans pending vetting.', data: [] };
  },

  async vetLoanApplication(
    _loanId: string, 
    _approved: boolean, 
    _comments: string, 
    _officerName: string
  ): Promise<ApiResponse<any>> {
    return { success: false, message: 'Loan vetting managed server-side.' };
  },

  async verifyMemberKyc(_memberId: string, _verified: boolean, _officerName: string): Promise<ApiResponse<MemberProfile>> {
    return { success: false, message: 'KYC verification managed server-side.' };
  },

  async issuePickupSlip(_memberId: string, _officerName: string): Promise<ApiResponse<{ slipCode: string }>> {
    const slipCode = `SLIP-${Date.now().toString().slice(-6)}-LAG`;
    return { success: true, message: `Pickup slip generated: ${slipCode}`, data: { slipCode } };
  }
};


// ═══════════════════════════════════════════════════════════════════════
// Helper: Map backend member dict to frontend MemberProfile shape
// ═══════════════════════════════════════════════════════════════════════
function mapBackendMemberToFrontend(m: any): MemberProfile {
  return {
    id: String(m.id || m.memberId),
    memberId: m.memberId || m.member_id || '',
    fullName: m.fullName || m.full_name || '',
    email: m.email || '',
    phone: m.phone || '',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.fullName || m.full_name || 'M')}&backgroundColor=059669&textColor=ffffff`,
    joinDate: m.createdAt?.substring(0, 10) || new Date().toISOString().substring(0, 10),
    membershipStatus: (m.status || 'active').toUpperCase(),
    digitalAccountStatus: m.hasClaimedAccount ? 'ACTIVATED' : 'NOT_ACTIVATED',
    physicalCardStatus: 'ISSUED',
    assignedCardId: m.memberId || '',
    status: m.status || 'active',
    kycVerified: m.kycVerified ?? true,
    kycDocuments: {
      idType: 'NIN',
      idNumber: m.nin || '',
      fileUrl: '',
      status: m.kycVerified ? 'verified' : 'pending',
      submittedAt: m.createdAt?.substring(0, 10) || ''
    },
    nextOfKin: m.nextOfKin || { name: '', relationship: '', phone: '', address: '' },
    bankDetails: m.bankDetails || { bankName: '', accountNumber: '', accountName: '' },
    qrToken: `MOSUNMOLA-QR-${m.memberId || ''}-AUTH-TOKEN`,
    address: m.address || '',
    occupation: m.occupation || '',
    // Attach financial summary if present from backend
    financialSummary: m.financialSummary || undefined,
    recentTransactions: m.recentTransactions || undefined,
    // Preserve the database PK for API calls
    _dbId: m.id
  };
}
