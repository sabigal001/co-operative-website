import React, { useState, useEffect } from 'react';
import type { LoanApplication, MemberProfile } from '../../types';
import { adminService } from '../../services/api/adminService';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  Search, 
  ShieldCheck, 
  FileCheck, 
  CreditCard, 
  Check, 
  X, 
  Users 
} from 'lucide-react';

export const PaOfficerView: React.FC = () => {
  const { currentAdmin, showToast, fireConfetti, dataVersion, refreshData } = useApp();

  const [activeTab, setActiveTab] = useState<'kyc' | 'vetting' | 'registry'>('kyc');
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loansForVetting, setLoansForVetting] = useState<LoanApplication[]>([]);
  const [searchMember, setSearchMember] = useState('');
  const [vettingComments, setVettingComments] = useState('');
  const [activeVettingLoan, setActiveVettingLoan] = useState<LoanApplication | null>(null);

  const loadData = async () => {
    try {
      const [memRes, loansRes] = await Promise.all([
        adminService.getMembersForSupport(),
        adminService.getLoansForVetting()
      ]);

      if (memRes.success) setMembers(memRes.data);
      if (loansRes.success) setLoansForVetting(loansRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [dataVersion]);

  // Handle KYC Verification
  const handleVerifyKyc = async (memberId: string, verified: boolean) => {
    try {
      const res = await adminService.verifyMemberKyc(memberId, verified, currentAdmin.name);
      if (res.success) {
        showToast(res.message, verified ? 'success' : 'info');
        if (verified) fireConfetti();
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error processing KYC', 'error');
    }
  };

  // Handle Loan Vetting (Forward to Treasurer or Reject)
  const handleVetLoanDecision = async (approved: boolean) => {
    if (!activeVettingLoan) return;

    try {
      const res = await adminService.vetLoanApplication(
        activeVettingLoan.id,
        approved,
        vettingComments || (approved ? 'Guarantors verified and eligible' : 'Failed credit requirements'),
        currentAdmin.name
      );

      if (res.success) {
        showToast(res.message, approved ? 'success' : 'info');
        if (approved) fireConfetti();
        setActiveVettingLoan(null);
        setVettingComments('');
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error vetting loan', 'error');
    }
  };

  // Issue Physical Card Pickup Slip
  const handleIssueSlip = async (memberId: string) => {
    try {
      const res = await adminService.issuePickupSlip(memberId, currentAdmin.name);
      if (res.success) {
        showToast(`Pickup Slip Generated: ${res.data.slipCode}. Member notified!`, 'success');
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error generating slip', 'error');
    }
  };

  const filteredMembers = members.filter((m) => 
    m.fullName.toLowerCase().includes(searchMember.toLowerCase()) ||
    m.memberId.toLowerCase().includes(searchMember.toLowerCase()) ||
    m.phone.includes(searchMember)
  );

  return (
    <div className="space-y-6">
      
      {/* RBAC Notice Banner */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3 text-xs text-blue-200">
        <UserCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="text-white block mb-0.5">Secretariat Operations & KYC Desk Authority Active</strong>
          <span>
            You have full authorization to verify member national identification, review guarantor eligibility, and perform first-stage loan vetting before forwarding to the Treasurer. Financial disbursements and direct wallet balance manipulation are restricted.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'kyc' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>KYC & Document Verification ({members.filter((m) => !m.kycVerified).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vetting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'vetting' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Loan Application Vetting ({loansForVetting.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'registry' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Member Support Registry</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: KYC VERIFICATION ================= */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              Member KYC & Plastic ID Cross-Verification
            </h3>
            <p className="text-xs text-slate-500">
              Verify submitted NIN / Voter Card / Passport against physical membership records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{m.fullName}</h4>
                      <span className="font-mono text-xs text-brand-700 font-bold block">{m.memberId}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    m.kycVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {m.kycVerified ? 'KYC Verified' : 'Pending Review'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doc Type:</span>
                    <strong className="text-slate-800">{m.kycDocuments.idType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Document / NIN Number:</span>
                    <span className="font-mono font-bold text-slate-900">{m.kycDocuments.idNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact Phone:</span>
                    <span className="text-slate-800">{m.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleIssueSlip(m.memberId)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Issue Card Slip</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {!m.kycVerified ? (
                      <>
                        <button
                          onClick={() => handleVerifyKyc(m.id, true)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve KYC
                        </button>
                        <button
                          onClick={() => handleVerifyKyc(m.id, false)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Cleared by Secretariat
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: LOAN APPLICATION VETTING ================= */}
      {activeTab === 'vetting' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              First-Stage Loan Application Vetting
            </h3>
            <p className="text-xs text-slate-500">
              Verify borrower savings status, cross-check the 2 co-member guarantors, and forward cleared applications to the Treasurer.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {loansForVetting.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No new loan applications awaiting vetting.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {loansForVetting.map((loan) => (
                  <div key={loan.id} className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-slate-900">{loan.id}</span>
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                            Pending Secretariat Review
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">{loan.memberName} ({loan.memberId})</h4>
                        <p className="text-xs text-slate-500">{loan.purpose}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block">Requested Amount</span>
                        <span className="text-2xl font-black font-display text-slate-900">
                          ₦{loan.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 block">Tenure: {loan.durationMonths} Months</span>
                      </div>
                    </div>

                    {/* Guarantor Details */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                        Assigned Guarantors:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {loan.guarantors.map((g, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                            <div>
                              <strong className="text-slate-900 block">{g.name}</strong>
                              <span className="text-slate-500 font-mono text-[10px]">{g.memberId} • {g.phone}</span>
                            </div>
                            <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">
                              Eligible
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Decision Button */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => setActiveVettingLoan(loan)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Perform Vetting & Forward to Treasurer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: MEMBER SUPPORT REGISTRY ================= */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-display">
                Member Support Registry & Pickup Desk
              </h3>
              <p className="text-xs text-slate-500">
                Look up members, issue physical card pickup slips, and update emergency phone numbers.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Search member name or ID..."
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
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Registered Bank</th>
                    <th className="py-3 px-4">KYC</th>
                    <th className="py-3 px-4 text-right">Support Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-bold text-brand-700">{m.memberId}</td>
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-900">{m.fullName}</td>
                      <td className="py-3.5 px-4 text-slate-600">{m.phone}</td>
                      <td className="py-3.5 px-4 font-sans text-slate-600 text-[10px]">
                        {m.bankDetails.bankName} - {m.bankDetails.accountNumber}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.kycVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.kycVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          onClick={() => handleIssueSlip(m.memberId)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]"
                        >
                          Print Pickup Slip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vetting Dialog */}
      {activeVettingLoan && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A2540] text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-lg text-white">Vetting Decision</h3>
              <button onClick={() => setActiveVettingLoan(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Loan: <strong>{activeVettingLoan.id}</strong> (₦{activeVettingLoan.amount.toLocaleString()} for {activeVettingLoan.memberName})
            </p>

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1">
                PA Vetting Comments / Guarantor Verification Notes
              </label>
              <textarea
                rows={3}
                value={vettingComments}
                onChange={(e) => setVettingComments(e.target.value)}
                placeholder="Confirming that both member guarantors are verified in active standing..."
                className="w-full bg-[#07192C] border border-white/10 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleVetLoanDecision(false)}
                className="px-4 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 font-bold text-xs rounded-xl"
              >
                Reject Vetting
              </button>
              <button
                type="button"
                onClick={() => handleVetLoanDecision(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Clear & Forward to Treasurer</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
