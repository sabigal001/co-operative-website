import React, { useState, useEffect } from 'react';
import type { 
  AdminRole, 
  AdminUser, 
  AuditLog, 
  PhysicalMemberCard, 
  SystemMetrics,
  MembershipApplication
} from '../../types';
import { adminService } from '../../services/api/adminService';
import { applicationService } from '../../services/api/applicationService';
import { cardService } from '../../services/api/cardService';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { FluidPillBar } from '../common/FluidPillBar';
import { 
  CreditCard, 
  Users, 
  TrendingUp, 
  Upload, 
  Sparkles, 
  Search, 
  X, 
  Clock, 
  UserPlus, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ShieldCheck,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Coins,
  Calendar,
  Briefcase
} from 'lucide-react';

interface MasterAdminViewProps {
  metrics: SystemMetrics | null;
}

export const MasterAdminView: React.FC<MasterAdminViewProps> = ({ metrics }) => {
  const { currentAdmin, showToast, fireConfetti, dataVersion, refreshData } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'cards' | 'roles' | 'dividends' | 'audit'>('applications');
  const [cards, setCards] = useState<PhysicalMemberCard[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [cardSearch, setCardSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showDividendModal, setShowDividendModal] = useState(false);
  const [showIssueCardModal, setShowIssueCardModal] = useState(false);
  
  // Application Review & Approval States
  const [selectedAppDetail, setSelectedAppDetail] = useState<MembershipApplication | null>(null);
  const [selectedAppForApproval, setSelectedAppForApproval] = useState<MembershipApplication | null>(null);
  const [assignedCardInput, setAssignedCardInput] = useState('');
  const [cardTypeInput, setCardTypeInput] = useState<'standard_plastic' | 'rfid_executive' | 'gold_fiduciary'>('standard_plastic');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);

  // Direct Card Issuance Form
  const [issueMemberIdInput, setIssueMemberIdInput] = useState('MCS-2026-');
  const [issueCardIdInput, setIssueCardIdInput] = useState('MCS-2026-');
  const [issueCardType, setIssueCardType] = useState<'standard_plastic' | 'rfid_executive' | 'gold_fiduciary'>('standard_plastic');
  const [issueBranch, setIssueBranch] = useState('Ikeja Central Secretariat');

  // Batch Form
  const [batchName, setBatchName] = useState('BATCH-2026-Q3-LAGOS');
  const [prefix, setPrefix] = useState('MCS-2026');
  const [batchCount, setBatchCount] = useState<number>(25);
  const [branch, setBranch] = useState('Ikeja Central Secretariat');

  // Dividend Form
  const [dividendPool, setDividendPool] = useState<number>(45000000);
  const [dividendPercent, setDividendPercent] = useState<number>(18.5);

  const loadAll = async () => {
    try {
      const [cardsRes, adminsRes, logsRes, appsRes] = await Promise.all([
        adminService.getPhysicalCards(),
        adminService.getAdminUsers(),
        adminService.getAuditLogs(),
        applicationService.getApplications()
      ]);

      if (cardsRes.success) setCards(cardsRes.data);
      if (adminsRes.success) setAdmins(adminsRes.data);
      if (logsRes.success) setAuditLogs(logsRes.data);
      if (appsRes.success) setApplications(appsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [dataVersion]);

  // Handle Card Batch Import (CSV Simulation)
  const handleImportBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminService.importCardBatch(batchName, prefix, batchCount, branch, currentAdmin.name);
      if (res.success) {
        triggerHaptic('success');
        showToast(res.message, 'success');
        fireConfetti();
        setShowBatchModal(false);
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error importing batch', 'error');
    }
  };

  // Handle Direct Card Issuance
  const handleIssueCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await cardService.issueCard(
        issueMemberIdInput.trim().toUpperCase(),
        issueCardIdInput.trim().toUpperCase(),
        issueCardType,
        issueBranch,
        currentAdmin.name
      );
      if (res.success) {
        triggerHaptic('success');
        showToast(res.message, 'success');
        fireConfetti();
        setShowIssueCardModal(false);
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error issuing card', 'error');
    }
  };

  // Handle Status Update (e.g. Lost / Replaced / Active)
  const handleStatusChange = async (cardId: string, status: PhysicalMemberCard['status']) => {
    triggerHaptic('medium');
    const res = await adminService.updateCardStatus(cardId, status, currentAdmin.name);
    if (res.success) {
      showToast(`Card ${cardId} status set to ${status}`, 'info');
      refreshData();
    }
  };

  // Handle Admin Role Promotion / Demotion
  const handleRoleChange = async (userId: string, newRole: AdminRole) => {
    triggerHaptic('medium');
    const res = await adminService.updateAdminRole(userId, newRole, currentAdmin.name);
    if (res.success) {
      showToast(res.message, 'success');
      refreshData();
    }
  };

  // Trigger Dividend Distribution
  const handleTriggerDividends = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminService.triggerDividendDistribution(dividendPool, dividendPercent, currentAdmin.name);
      if (res.success) {
        triggerHaptic('success');
        showToast(res.message, 'success');
        fireConfetti();
        setShowDividendModal(false);
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error triggering dividends', 'error');
    }
  };

  // Open Approval Dialog for an Application
  const openApprovalModal = (app: MembershipApplication) => {
    triggerHaptic('selection');
    setSelectedAppForApproval(app);
    const suggestedId = `MCS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setAssignedCardInput(suggestedId);
    setCardTypeInput(app.intendedMonthlySavings >= 100000 ? 'rfid_executive' : 'standard_plastic');
    setShowRejectPrompt(false);
  };

  // Approve Application: Generates canonical Member ID, creates membership with digitalAccountStatus: NOT_ACTIVATED, issues card
  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForApproval) return;

    try {
      const res = await applicationService.approveApplication(
        selectedAppForApproval.id,
        assignedCardInput.trim().toUpperCase(),
        currentAdmin.name
      );

      if (res.success) {
        triggerHaptic('success');
        showToast(res.message, 'success');
        fireConfetti();
        setSelectedAppForApproval(null);
        setSelectedAppDetail(null);
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error approving application', 'error');
    }
  };

  // Reject Application
  const handleConfirmRejection = async (appId: string) => {
    try {
      triggerHaptic('warning');
      const reason = rejectionReasonInput.trim() || 'Statutory identification criteria not met under cooperative bye-laws.';
      const res = await applicationService.rejectApplication(appId, reason, currentAdmin.name);

      if (res.success) {
        showToast(res.message, 'info');
        setShowRejectPrompt(false);
        setSelectedAppForApproval(null);
        setSelectedAppDetail(null);
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error rejecting application', 'error');
    }
  };

  // Request More Info
  const handleRequestMoreInfo = async (appId: string) => {
    try {
      triggerHaptic('selection');
      const notes = prompt('Enter Secretarial request notes for applicant:') || 'Please provide updated utility bill and clear copy of identification document.';
      const res = await applicationService.requestMoreInfo(appId, notes, currentAdmin.name);
      if (res.success) {
        showToast(res.message, 'info');
        setSelectedAppDetail(null);
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error', 'error');
    }
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.id.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.phone.includes(appSearch);

    const isPending = app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW' || app.status === 'pending_approval';
    const isApproved = app.status === 'APPROVED' || app.status === 'approved';
    const isRejected = app.status === 'REJECTED' || app.status === 'rejected';

    if (appStatusFilter === 'PENDING') return matchesSearch && isPending;
    if (appStatusFilter === 'APPROVED') return matchesSearch && isApproved;
    if (appStatusFilter === 'REJECTED') return matchesSearch && isRejected;
    return matchesSearch;
  });

  const pendingAppsCount = applications.filter((a) => 
    a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW' || a.status === 'pending_approval'
  ).length;

  const filteredCards = cards.filter((c) => 
    c.cardId.toLowerCase().includes(cardSearch.toLowerCase()) ||
    c.assignedMemberName.toLowerCase().includes(cardSearch.toLowerCase()) ||
    c.batchNumber.toLowerCase().includes(cardSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FluidPillBar
          tabs={[
            { id: 'applications', label: `Prospective Applications (${pendingAppsCount})`, icon: <UserPlus className="w-4 h-4" /> },
            { id: 'cards', label: 'Physical ID Card Control', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'roles', label: 'Staff Roles (RBAC)', icon: <Users className="w-4 h-4" /> },
            { id: 'dividends', label: 'Financial Master & Dividends', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'audit', label: 'System Audit Logs', icon: <Clock className="w-4 h-4" /> },
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />

        {activeTab === 'cards' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('selection');
                setShowIssueCardModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all tap-spring"
            >
              <CreditCard className="w-4 h-4" />
              <span>Issue Physical Card</span>
            </button>
            <button
              onClick={() => {
                triggerHaptic('selection');
                setShowBatchModal(true);
              }}
              className="px-3.5 py-2 bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all tap-spring"
            >
              <Upload className="w-4 h-4" />
              <span>Import Batch (CSV)</span>
            </button>
          </div>
        )}

        {activeTab === 'dividends' && (
          <button
            onClick={() => {
              triggerHaptic('selection');
              setShowDividendModal(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all tap-spring"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trigger Annual Dividend Pool</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: PROSPECTIVE MEMBERSHIP APPLICATIONS QUEUE                          */}
      {/* ========================================================================= */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                Membership Applications Review Queue ({applications.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Applicants who completed the public society application. Vetting creates canonical membership and authorizes physical card embossing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setAppStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${appStatusFilter === 'ALL' ? 'bg-white dark:bg-white/20 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}
                >
                  All ({applications.length})
                </button>
                <button
                  onClick={() => setAppStatusFilter('PENDING')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${appStatusFilter === 'PENDING' ? 'bg-white dark:bg-white/20 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}
                >
                  Pending ({pendingAppsCount})
                </button>
                <button
                  onClick={() => setAppStatusFilter('APPROVED')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${appStatusFilter === 'APPROVED' ? 'bg-white dark:bg-white/20 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setAppStatusFilter('REJECTED')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${appStatusFilter === 'REJECTED' ? 'bg-white dark:bg-white/20 shadow-sm text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}
                >
                  Rejected
                </button>
              </div>

              {/* Search */}
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search ID, name, email..."
                  className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            {filteredApplications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                No membership applications found matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/10 text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Contact & Location</th>
                      <th className="py-3 px-4">Savings Plan</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Secretariat Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                    {filteredApplications.map((app) => {
                      const isPending = app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW' || app.status === 'pending_approval';
                      const isApproved = app.status === 'APPROVED' || app.status === 'approved';

                      return (
                        <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-white/5">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {app.id}
                          </td>
                          <td className="py-3.5 px-4 font-sans font-bold text-slate-800 dark:text-slate-200">
                            {app.fullName}
                            <span className="block text-[10px] text-slate-400 font-normal">{app.occupation}</span>
                          </td>
                          <td className="py-3.5 px-4 font-sans text-slate-600 dark:text-slate-300 text-[10px]">
                            <div>{app.phone}</div>
                            <div className="text-slate-400">{app.lga}, {app.state}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                            ₦{(app.intendedMonthlySavings || app.monthlyThriftTarget).toLocaleString()}/mo
                            <span className="block text-[9px] uppercase font-normal text-slate-400">
                              {app.savingsPlanId || 'Standard'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-sans text-slate-500 dark:text-slate-400 text-[10px]">
                            {app.submittedAt.slice(0, 10)}
                          </td>
                          <td className="py-3.5 px-4 font-sans">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isApproved ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20' :
                              isPending ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20' :
                              'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-500/20'
                            }`}>
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-sans">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Review button */}
                              <button
                                onClick={() => {
                                  triggerHaptic('selection');
                                  setSelectedAppDetail(app);
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1 tap-spring"
                              >
                                <Eye className="w-3.5 h-3.5" /> Review
                              </button>

                              {isPending && (
                                <button
                                  onClick={() => openApprovalModal(app)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm tap-spring"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: PHYSICAL CARD BATCH MANAGER & CONTROL                              */}
      {/* ========================================================================= */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                Physical Member Card Inventory & Batch Control
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track pre-printed RFID plastic cards, member allocations, and lost/replacement records.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={cardSearch}
                onChange={(e) => setCardSearch(e.target.value)}
                placeholder="Search card ID, holder, batch..."
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/10 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Card ID Number</th>
                    <th className="py-3 px-4">Card Type</th>
                    <th className="py-3 px-4">Allocated Member</th>
                    <th className="py-3 px-4">Issuing Branch</th>
                    <th className="py-3 px-4">Card Status</th>
                    <th className="py-3 px-4 text-right">Card Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                  {filteredCards.map((card) => (
                    <tr key={card.cardId} className="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {card.cardId}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-500 dark:text-slate-400 text-[11px] capitalize">
                        {card.cardType ? card.cardType.replace('_', ' ') : 'Standard Plastic'}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">
                        {card.assignedMemberName}
                        {card.assignedMemberId && (
                          <span className="block font-mono text-[10px] text-slate-400 font-normal">
                            ID: {card.assignedMemberId}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-600 dark:text-slate-300 text-[11px]">
                        {card.branch}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          card.status === 'ACTIVATED' || card.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20' :
                          card.status === 'ISSUED' || card.status === 'unassigned' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border border-blue-500/20' :
                          'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {card.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          {card.status !== 'BLOCKED' && card.status !== 'lost' ? (
                            <button
                              onClick={() => handleStatusChange(card.cardId, 'BLOCKED')}
                              className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded text-[10px] font-bold"
                            >
                              Block Card
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(card.cardId, 'ISSUED')}
                              className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded text-[10px] font-bold"
                            >
                              Unblock
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STAFF ROLE MANAGEMENT                                              */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              Fiduciary Staff & Role-Based Access Control (RBAC)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage executive roles across Super Admin, Treasurer, and Principal Secretariat Officer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {admins.map((adm) => (
              <div 
                key={adm.id}
                className="p-5 rounded-3xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img src={adm.avatar} alt={adm.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-white/15" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{adm.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{adm.department}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Assigned Role</span>
                  <select
                    value={adm.role}
                    onChange={(e) => handleRoleChange(adm.id, e.target.value as AdminRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="master_admin">Master Admin (Super Admin)</option>
                    <option value="treasurer">Chief Treasurer & Controller</option>
                    <option value="pa_officer">Principal Secretariat Officer</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FINANCIAL MASTER & DIVIDENDS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'dividends' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-slate-900 dark:text-white space-y-3">
            <h4 className="font-bold text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>Statutory AGM Dividend Allocation Engine</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              Annual General Meeting (AGM) surplus is distributed pro-rata based on members' thrift savings balance and share capital equity.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block">Current Dividend Pool</span>
                <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400">₦45,000,000</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block">Declared Yield Rate</span>
                <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400">18.5% p.a.</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block">Eligible Members</span>
                <strong className="text-sm font-mono text-slate-900 dark:text-white">14,850+</strong>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block">Audit Sign-off</span>
                <strong className="text-sm font-mono text-slate-900 dark:text-white">LSCS Verified</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SYSTEM AUDIT LOGS                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/10 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-white/5">
                      <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                      <td className="py-3 px-4 font-sans font-bold text-slate-800 dark:text-slate-200">{log.adminName}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{log.action}</td>
                      <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APPLICATION DETAIL REVIEW DRAWER                                   */}
      {/* ========================================================================= */}
      {selectedAppDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white border border-slate-200 dark:border-white/15 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-6 animate-slide-up relative flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-black/40 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Membership Application Review</span>
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {selectedAppDetail.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppDetail(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Applicant Profile */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-base font-bold text-slate-900 dark:text-white">{selectedAppDetail.fullName}</strong>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {selectedAppDetail.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Occupation / Enterprise:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{selectedAppDetail.occupation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Birth:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{selectedAppDetail.dateOfBirth || '1985-06-15'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email Address:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{selectedAppDetail.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mobile Phone:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{selectedAppDetail.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">State & LGA:</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedAppDetail.lga}, {selectedAppDetail.state}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Street Address:</span>
                    <span className="text-slate-800 dark:text-slate-200">{selectedAppDetail.address}</span>
                  </div>
                </div>
              </div>

              {/* Savings Intent */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Intended Contribution Target</span>
                <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ₦{(selectedAppDetail.intendedMonthlySavings || selectedAppDetail.monthlyThriftTarget).toLocaleString()} / month
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Plan Tier: <strong className="capitalize">{selectedAppDetail.savingsPlanId || 'Standard'}</strong>
                </p>
              </div>

              {/* Statutory ID Credentials */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Government ID Document</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    STATUS: {selectedAppDetail.idDocumentStatus || 'PROVIDED'}
                  </span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {selectedAppDetail.idType}: <span className="font-mono">{selectedAppDetail.idNumber}</span>
                </div>
                {selectedAppDetail.idDocumentUrl && (
                  <div className="pt-2">
                    <img 
                      src={selectedAppDetail.idDocumentUrl} 
                      alt="Identification Slip" 
                      className="w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-white/10 shadow-inner"
                    />
                  </div>
                )}
              </div>

              {/* Next of Kin */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Designated Beneficiary (Next of Kin)</span>
                <div className="font-bold text-slate-900 dark:text-white">
                  {selectedAppDetail.nextOfKinName || 'Next of Kin'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedAppDetail.nextOfKinRelationship || 'Relative'} • {selectedAppDetail.nextOfKinPhone || selectedAppDetail.phone}
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleRequestMoreInfo(selectedAppDetail.id)}
                  className="px-3 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs"
                >
                  Request More Info
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openApprovalModal(selectedAppDetail);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md tap-spring"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve & Issue ID</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APPROVE MEMBERSHIP & CONFIGURE PHYSICAL CARD                        */}
      {/* ========================================================================= */}
      {selectedAppForApproval && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/15 shadow-2xl animate-slide-up space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Approve Membership & Issue Card
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Application: {selectedAppForApproval.id}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAppForApproval(null)} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Applicant:</span>
                <strong className="text-slate-900 dark:text-white">{selectedAppForApproval.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Monthly Thrift Target:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  ₦{(selectedAppForApproval.intendedMonthlySavings || selectedAppForApproval.monthlyThriftTarget).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Location:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedAppForApproval.lga}, {selectedAppForApproval.state}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Canonical Member ID / Physical Card ID *
                </label>
                <input
                  type="text"
                  value={assignedCardInput}
                  onChange={(e) => setAssignedCardInput(e.target.value)}
                  placeholder="e.g. MCS-2026-8942"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[10px] text-slate-400 block">
                  The system generates this canonical identifier. The member uses this ID to activate their digital account.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Physical Card Credential Type
                </label>
                <select
                  value={cardTypeInput}
                  onChange={(e) => setCardTypeInput(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="standard_plastic">Standard Plastic RFID Card</option>
                  <option value="rfid_executive">Executive Gold RFID Card</option>
                  <option value="gold_fiduciary">Fiduciary Trustee Card</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedAppForApproval(null)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md tap-spring"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Membership & Issue Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DIRECT PHYSICAL CARD ISSUANCE                                      */}
      {/* ========================================================================= */}
      {showIssueCardModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/15 shadow-2xl animate-slide-up space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Issue Physical Plastic RFID Card
              </h3>
              <button onClick={() => setShowIssueCardModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueCardSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Approved Member ID *</label>
                <input
                  type="text"
                  value={issueMemberIdInput}
                  onChange={(e) => setIssueMemberIdInput(e.target.value)}
                  placeholder="e.g. MCS-2026-8942"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Physical Card ID *</label>
                <input
                  type="text"
                  value={issueCardIdInput}
                  onChange={(e) => setIssueCardIdInput(e.target.value)}
                  placeholder="e.g. MCS-2026-8942 or CARD-2026-77821"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Card Credential Type</label>
                <select
                  value={issueCardType}
                  onChange={(e) => setIssueCardType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="standard_plastic">Standard Plastic Card</option>
                  <option value="rfid_executive">Executive RFID Card</option>
                  <option value="gold_fiduciary">Gold Fiduciary Card</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Issuing Branch</label>
                <input
                  type="text"
                  value={issueBranch}
                  onChange={(e) => setIssueBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowIssueCardModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CARD BATCH IMPORT                                                  */}
      {/* ========================================================================= */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/15 shadow-2xl animate-slide-up space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Import Card Batch (CSV)</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Batch Code</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Card Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Number of Cards</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-black font-bold rounded-xl"
                >
                  Generate Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DIVIDEND ALLOCATION                                                */}
      {/* ========================================================================= */}
      {showDividendModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/15 shadow-2xl animate-slide-up space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Trigger Dividend Pool</h3>
              <button onClick={() => setShowDividendModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTriggerDividends} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Total Pool to Allocate (₦)</label>
                <input
                  type="number"
                  min="1000000"
                  step="500000"
                  value={dividendPool}
                  onChange={(e) => setDividendPool(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Effective Annual Yield (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={dividendPercent}
                  onChange={(e) => setDividendPercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-slate-300 dark:border-white/15 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowDividendModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  Authorize Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
