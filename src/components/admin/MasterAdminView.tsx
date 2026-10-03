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
import { useApp } from '../../context/AppContext';
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
  ShieldCheck
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
  const [loading, setLoading] = useState(true);

  // Modals
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showDividendModal, setShowDividendModal] = useState(false);
  const [selectedAppForApproval, setSelectedAppForApproval] = useState<MembershipApplication | null>(null);
  const [assignedCardInput, setAssignedCardInput] = useState('MCS-2026-');

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
        adminService.getMembershipApplications()
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
        showToast(res.message, 'success');
        fireConfetti();
        setShowBatchModal(false);
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error importing batch', 'error');
    }
  };

  // Handle Status Update (e.g. Lost / Replaced / Active)
  const handleStatusChange = async (cardId: string, status: PhysicalMemberCard['status']) => {
    const res = await adminService.updateCardStatus(cardId, status, currentAdmin.name);
    if (res.success) {
      showToast(`Card ${cardId} status set to ${status}`, 'info');
      refreshData();
    }
  };

  // Handle Admin Role Promotion / Demotion
  const handleRoleChange = async (userId: string, newRole: AdminRole) => {
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
        showToast(res.message, 'success');
        fireConfetti();
        setShowDividendModal(false);
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error triggering dividends', 'error');
    }
  };

  // Handle Membership Application Decision
  const handleApproveApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForApproval || !assignedCardInput) return;

    try {
      const res = await adminService.approveMembershipApplication(
        selectedAppForApproval.id,
        assignedCardInput.trim().toUpperCase(),
        currentAdmin.name
      );

      if (res.success) {
        showToast(res.message, 'success');
        fireConfetti();
        setSelectedAppForApproval(null);
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error approving application', 'error');
    }
  };

  const handleRejectApplication = async (appId: string) => {
    try {
      const res = await adminService.rejectMembershipApplication(
        appId,
        'Does not meet statutory cooperative residency or identification criteria',
        currentAdmin.name
      );

      if (res.success) {
        showToast(res.message, 'info');
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error rejecting application', 'error');
    }
  };

  const filteredCards = cards.filter((c) => 
    c.cardId.toLowerCase().includes(cardSearch.toLowerCase()) ||
    c.assignedMemberName.toLowerCase().includes(cardSearch.toLowerCase()) ||
    c.batchNumber.toLowerCase().includes(cardSearch.toLowerCase())
  );

  const pendingAppsCount = applications.filter((a) => a.status === 'pending_approval').length;

  return (
    <div className="space-y-8">
      
      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
          {[
            { id: 'applications', label: `Prospective Applications (${pendingAppsCount})`, icon: <UserPlus className="w-4 h-4" /> },
            { id: 'cards', label: 'Physical ID Card Batch Manager', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'roles', label: 'Staff Role Management (RBAC)', icon: <Users className="w-4 h-4" /> },
            { id: 'dividends', label: 'Financial Master & Dividends', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'audit', label: 'System Audit Logs', icon: <Clock className="w-4 h-4" /> },
          ].map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-purple-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'cards' && (
          <button
            onClick={() => setShowBatchModal(true)}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import New Card Batch (CSV)</span>
          </button>
        )}

        {activeTab === 'dividends' && (
          <button
            onClick={() => setShowDividendModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trigger Annual Dividend Pool</span>
          </button>
        )}
      </div>

      {/* TAB 0: PROSPECTIVE MEMBERSHIP APPLICATIONS (FROM LANDING PAGE) */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-display">
                Prospective Membership Applications ({applications.length})
              </h3>
              <p className="text-xs text-slate-500">
                Applicants who registered through the public landing page awaiting Board and Super Admin approval and physical card allocation.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No prospective applications currently submitted.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Applicant Name</th>
                      <th className="py-3 px-4">Contact & Location</th>
                      <th className="py-3 px-4">Occupation</th>
                      <th className="py-3 px-4">Thrift Target</th>
                      <th className="py-3 px-4">ID Document</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Super Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{app.id}</td>
                        <td className="py-3.5 px-4 font-sans font-bold text-slate-800">
                          {app.fullName}
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">{app.email}</span>
                        </td>
                        <td className="py-3.5 px-4 font-sans text-slate-600 text-[10px]">
                          <div>{app.phone}</div>
                          <div>{app.lga}, {app.state}</div>
                        </td>
                        <td className="py-3.5 px-4 font-sans text-slate-700">{app.occupation}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">
                          ₦{app.monthlyThriftTarget.toLocaleString()}/mo
                        </td>
                        <td className="py-3.5 px-4 font-sans text-[10px]">
                          <span className="font-semibold block">{app.idType}</span>
                          <span className="font-mono text-slate-500">{app.idNumber}</span>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'pending_approval' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-sans">
                          {app.status === 'pending_approval' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedAppForApproval(app);
                                  setAssignedCardInput(`MCS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve & Issue ID
                              </button>
                              <button
                                onClick={() => handleRejectApplication(app.id)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              {app.status === 'approved' ? `Assigned: ${app.assignedCardId}` : 'Rejected'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: PHYSICAL CARD BATCH MANAGER */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-display">
                Physical Member Card Inventory & Batch Control
              </h3>
              <p className="text-xs text-slate-500">
                Track pre-printed RFID plastic cards, member allocations, and lost/replacement records.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={cardSearch}
                onChange={(e) => setCardSearch(e.target.value)}
                placeholder="Search card ID, holder, batch..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Card ID Number</th>
                    <th className="py-3 px-4">Batch Code</th>
                    <th className="py-3 px-4">Allocated Member Name</th>
                    <th className="py-3 px-4">Issuing Branch</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Card Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredCards.map((card) => (
                    <tr key={card.cardId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{card.cardId}</td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{card.batchNumber}</td>
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-800">
                        {card.assignedMemberName}
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-600 text-[11px]">{card.branch}</td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          card.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          card.status === 'unassigned' ? 'bg-blue-100 text-blue-800' :
                          card.status === 'lost' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {card.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          {card.status !== 'active' && (
                            <button
                              onClick={() => handleStatusChange(card.cardId, 'active')}
                              className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-emerald-100 text-emerald-800 rounded-md"
                              title="Mark as Active"
                            >
                              Activate
                            </button>
                          )}
                          {card.status !== 'lost' && (
                            <button
                              onClick={() => handleStatusChange(card.cardId, 'lost')}
                              className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-rose-100 text-rose-800 rounded-md"
                              title="Flag Lost"
                            >
                              Flag Lost
                            </button>
                          )}
                          {card.status === 'lost' && (
                            <button
                              onClick={() => handleStatusChange(card.cardId, 'replaced')}
                              className="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-amber-100 text-amber-800 rounded-md"
                              title="Mark Replaced"
                            >
                              Replaced
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

      {/* TAB 2: STAFF ROLE MANAGEMENT (RBAC) */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              Role-Based Access Control (RBAC) Administration
            </h3>
            <p className="text-xs text-slate-500">
              Assign administrative permissions between Master Admin, Treasurer, and Personal Assistant officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={admin.avatar}
                      alt={admin.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{admin.name}</h4>
                      <p className="text-[11px] text-slate-500">{admin.email}</p>
                    </div>
                  </div>

                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                    admin.role === 'master_admin' ? 'bg-purple-100 text-purple-800' :
                    admin.role === 'treasurer' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    Current Role: {admin.role.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Department: {admin.department}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Assign New Role:
                  </label>
                  <select
                    value={admin.role}
                    onChange={(e) => handleRoleChange(admin.id, e.target.value as AdminRole)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="master_admin">Master Admin (Full Access)</option>
                    <option value="treasurer">Treasurer (Financial Disbursals Only)</option>
                    <option value="pa_officer">PA / Admin Officer (KYC & Vetting)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIAL MASTER & DIVIDENDS */}
      {activeTab === 'dividends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Total Savings Pool</span>
              <div className="text-2xl font-black font-display text-slate-900">
                ₦342,800,000
              </div>
              <p className="text-[11px] text-slate-400">Regular Thrift + Dedicated Target Plans</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Outstanding Active Loans</span>
              <div className="text-2xl font-black font-display text-amber-600">
                ₦142,400,000
              </div>
              <p className="text-[11px] text-slate-400">Performing with 0.2% NPL ratio</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 font-semibold">Total AGM Dividends Distributed</span>
              <div className="text-2xl font-black font-display text-emerald-600">
                ₦65,400,000
              </div>
              <p className="text-[11px] text-slate-400">Audited surplus returns credited</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-base text-slate-900 font-display">
              Annual General Meeting (AGM) Surplus Profit Allocation
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Under Section 14 of the Cooperative Bye-Laws, net operating surplus from agro-processing, real estate capital gains, and loan interest margins are allocated pro-rata across active financial members.
            </p>

            <button
              onClick={() => setShowDividendModal(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Configure & Distribute Surplus Pool</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              Immutable System Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Cryptographic log of all administrative approvals, disbursements, KYC verifications, and role edits.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Admin Officer</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{log.id}</td>
                      <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-4 font-sans font-medium text-slate-800">{log.adminName}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-100 text-slate-700 font-bold">
                          {log.adminRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-700">{log.action}</td>
                      <td className="py-3 px-4 font-sans text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CSV BATCH IMPORT SIMULATION ================= */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A2540] text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">Import Physical Card Batch</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportBatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Batch Identifier</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full bg-[#07192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ID Card Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full bg-[#07192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Number of Cards in Batch</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="w-full bg-[#07192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Issuing Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-[#07192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="Ikeja Central Secretariat">Ikeja Central Secretariat</option>
                  <option value="Victoria Island Regional Office">Victoria Island Regional Office</option>
                  <option value="Lekki Phase 1 Center">Lekki Phase 1 Center</option>
                  <option value="Surulere Sub-Station">Surulere Sub-Station</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-xl"
                >
                  Generate & Register Cards
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIVIDEND ALLOCATION ================= */}
      {showDividendModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A2540] text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">Trigger Dividend Pool</h3>
              <button onClick={() => setShowDividendModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTriggerDividends} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Pool to Allocate (₦)</label>
                <input
                  type="number"
                  min="1000000"
                  step="500000"
                  value={dividendPool}
                  onChange={(e) => setDividendPool(Number(e.target.value))}
                  className="w-full bg-[#07192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Effective Annual Yield (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={dividendPercent}
                  onChange={(e) => setDividendPercent(Number(e.target.value))}
                  className="w-full bg-[#07192C] border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowDividendModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
                >
                  Authorize Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROSPECTIVE APPLICANT APPROVAL & CARD ISSUANCE ================= */}
      {selectedAppForApproval && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A2540] text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">Approve Member & Allocate Card</h3>
                  <p className="text-[11px] text-slate-400">Application: {selectedAppForApproval.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAppForApproval(null)} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Summary */}
            <div className="bg-[#07192C] border border-white/10 rounded-2xl p-4 mb-5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Full Legal Name:</span>
                <span className="font-bold text-white font-sans">{selectedAppForApproval.fullName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Email & Phone:</span>
                <span className="text-slate-300 font-mono text-[11px]">{selectedAppForApproval.email} • {selectedAppForApproval.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Occupation:</span>
                <span className="text-slate-300">{selectedAppForApproval.occupation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-300">{selectedAppForApproval.lga}, {selectedAppForApproval.state}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Committed Monthly Thrift:</span>
                <span className="text-emerald-400 font-bold font-mono">₦{selectedAppForApproval.monthlyThriftTarget.toLocaleString()}/month</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-white/5">
                <span className="text-slate-400">Govt ID ({selectedAppForApproval.idType}):</span>
                <span className="text-slate-200 font-mono">{selectedAppForApproval.idNumber}</span>
              </div>
              {selectedAppForApproval.nextOfKinName && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Next of Kin:</span>
                  <span className="text-slate-300">{selectedAppForApproval.nextOfKinName} ({selectedAppForApproval.nextOfKinPhone})</span>
                </div>
              )}
            </div>

            <form onSubmit={handleApproveApplication} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assign Physical Member Card ID
                </label>
                <input
                  type="text"
                  value={assignedCardInput}
                  onChange={(e) => setAssignedCardInput(e.target.value)}
                  placeholder="e.g. MCS-2026-7842"
                  className="w-full bg-[#07192C] border border-brand-500/40 focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-brand-400 font-mono font-bold tracking-wider"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This plastic RFID card code will be tied to this applicant. They can use it to self-activate on the Member Portal (members.mosunmolacoop.com).
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedAppForApproval(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Approval & Allocate Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
