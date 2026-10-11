import React, { useState, useEffect } from 'react';
import type { LoanApplication, MemberProfile, DeskPaymentRecord } from '../../types';
import { adminService } from '../../services/api/adminService';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { FluidPillBar } from '../common/FluidPillBar';
import { RecordPaymentModal } from './RecordPaymentModal';
import { ReceiptVoucherModal } from './ReceiptVoucherModal';
import { MemberPassbookDrawer } from './MemberPassbookDrawer';
import { WalkInRegistrationModal } from './WalkInRegistrationModal';
import { BulkMemberImportModal } from './BulkMemberImportModal';
import { 
  UserCheck, 
  Search, 
  ShieldCheck, 
  FileCheck, 
  CreditCard, 
  Check, 
  X, 
  Users,
  Coins,
  UserPlus,
  UploadCloud,
  FileText
} from 'lucide-react';

export const PaOfficerView: React.FC = () => {
  const { currentAdmin, showToast, fireConfetti, dataVersion, refreshData } = useApp();

  const [activeTab, setActiveTab] = useState<'registry' | 'kyc' | 'vetting'>('registry');
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loansForVetting, setLoansForVetting] = useState<LoanApplication[]>([]);
  const [searchMember, setSearchMember] = useState('');
  const [vettingComments, setVettingComments] = useState('');
  const [activeVettingLoan, setActiveVettingLoan] = useState<LoanApplication | null>(null);

  // Desk Finance Modals State
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [selectedPassbookMember, setSelectedPassbookMember] = useState<MemberProfile | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<DeskPaymentRecord | null>(null);
  const [preselectedPaymentMember, setPreselectedPaymentMember] = useState<MemberProfile | null>(null);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

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
        triggerHaptic(verified ? 'success' : 'warning');
        showToast(res.message, verified ? 'success' : 'info');
        if (verified) fireConfetti();
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
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
        triggerHaptic(approved ? 'success' : 'warning');
        showToast(res.message, approved ? 'success' : 'info');
        if (approved) fireConfetti();
        setActiveVettingLoan(null);
        setVettingComments('');
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error vetting loan', 'error');
    }
  };

  // Issue Physical Card Pickup Slip
  const handleIssueSlip = async (memberId: string) => {
    try {
      const res = await adminService.issuePickupSlip(memberId, currentAdmin.name);
      if (res.success) {
        triggerHaptic('success');
        showToast(`Pickup Slip Generated: ${res.data.slipCode}. Member notified!`, 'success');
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
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
      <div className="p-4 rounded-2xl bg-black/90 border border-brand-500/30 flex items-start gap-3 text-xs text-slate-300">
        <UserCheck className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="text-white block mb-0.5">Secretariat Operations & KYC Desk Authority Active</strong>
          <span>
            You have full authorization to verify member national identification, review guarantor eligibility, and perform first-stage loan vetting before forwarding to the Treasurer. Financial disbursements and direct wallet balance manipulation are restricted.
          </span>
        </div>
      </div>

      {/* Sliding Fluid Pill Tabs & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <FluidPillBar
          tabs={[
            {
              id: 'registry',
              label: `Member Support Registry (${members.length})`,
              icon: <Users className="w-4 h-4" />
            },
            {
              id: 'kyc',
              label: `KYC & Verification (${members.filter((m) => !m.kycVerified).length})`,
              icon: <ShieldCheck className="w-4 h-4" />
            },
            {
              id: 'vetting',
              label: `Loan Vetting (${loansForVetting.length})`,
              icon: <FileCheck className="w-4 h-4" />
            }
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              triggerHaptic('medium');
              setPreselectedPaymentMember(null);
              setShowRecordPaymentModal(true);
            }}
            className="liquid-btn liquid-btn-white py-2 px-3 text-xs font-bold flex items-center gap-1.5 shadow-md tap-spring min-h-[38px] shrink-0"
          >
            <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
            <span>+ Record Payment</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('selection');
              setShowWalkInModal(true);
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 tap-spring min-h-[38px] shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-400" />
            <span>Onboard Walk-In</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('selection');
              setShowBulkImportModal(true);
            }}
            className="py-2 px-3 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center gap-1.5 tap-spring min-h-[38px] shrink-0"
            title="Bulk import 5,400 legacy members from CSV or Excel"
          >
            <UploadCloud className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Bulk Import (5,400+)</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: KYC VERIFICATION ================= */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              Member KYC & Plastic ID Cross-Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify submitted NIN / Voter Card / Passport against physical membership records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-black rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-white/15"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{m.fullName}</h4>
                      <span className="font-mono text-xs text-brand-700 dark:text-brand-400 font-bold block">{m.memberId}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    m.kycVerified ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400'
                  }`}>
                    {m.kycVerified ? 'KYC Verified' : 'Pending Review'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Doc Type:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{m.kycDocuments.idType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Document / NIN Number:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{m.kycDocuments.idNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Contact Phone:</span>
                    <span className="text-slate-800 dark:text-slate-200">{m.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10">
                  <button
                    onClick={() => handleIssueSlip(m.memberId)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Issue Card Slip</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {!m.kycVerified ? (
                      <>
                        <button
                          onClick={() => handleVerifyKyc(m.id, true)}
                          className="px-3.5 py-1.5 bg-black dark:bg-brand-500 hover:bg-zinc-900 dark:hover:bg-brand-400 text-brand-400 dark:text-black border border-brand-500/30 font-bold rounded-lg text-xs flex items-center gap-1 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve KYC
                        </button>
                        <button
                          onClick={() => handleVerifyKyc(m.id, false)}
                          className="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold rounded-lg text-xs"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
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
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              First-Stage Loan Application Vetting
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify borrower savings status, cross-check the 2 co-member guarantors, and forward cleared applications to the Treasurer.
            </p>
          </div>

          <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            {loansForVetting.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                No new loan applications awaiting vetting.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {loansForVetting.map((loan) => (
                  <div key={loan.id} className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{loan.id}</span>
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
                            Pending Secretariat Review
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">{loan.memberName} ({loan.memberId})</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{loan.purpose}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block">Requested Amount</span>
                        <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                          ₦{loan.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block">Tenure: {loan.durationMonths} Months</span>
                      </div>
                    </div>

                    {/* Guarantor Details */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block">
                        Assigned Guarantors:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {loan.guarantors.map((g, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white dark:bg-black/50 p-2.5 rounded-xl border border-slate-100 dark:border-white/10">
                            <div>
                              <strong className="text-slate-900 dark:text-white block">{g.name}</strong>
                              <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">{g.memberId} • {g.phone}</span>
                            </div>
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
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
                        className="px-5 py-2.5 bg-black dark:bg-brand-500 hover:bg-zinc-900 dark:hover:bg-brand-400 text-brand-400 dark:text-black border border-brand-500/30 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
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
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
                Member Support Registry & Pickup Desk
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Look up members, issue physical card pickup slips, and update emergency phone numbers.
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Search member name or ID..."
                className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            {/* Mobile Cards View (sm:hidden) */}
            <div className="sm:hidden divide-y divide-slate-100 dark:divide-white/5">
              {filteredMembers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No members found matching your search.
                </div>
              ) : (
                filteredMembers.map((m) => (
                  <div key={m.id} className="p-4 space-y-3 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {m.fullName}
                        </h4>
                        <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-400 block mt-0.5">
                          {m.memberId}
                        </span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                        m.kycVerified
                          ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {m.kycVerified ? 'KYC Verified' : 'KYC Pending'}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">Phone:</span>
                        <span className="font-mono font-semibold">{m.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400">Bank Account:</span>
                        <span className="font-medium text-right text-[11px]">{m.bankDetails.bankName} - {m.bankDetails.accountNumber}</span>
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedPassbookMember(m)}
                        className="flex-1 py-2 px-3 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center gap-1.5 min-h-[38px] tap-spring transition-colors"
                        title="View Financial Passbook & Statements"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Passbook</span>
                      </button>

                      <button
                        onClick={() => {
                          setPreselectedPaymentMember(m);
                          setShowRecordPaymentModal(true);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 min-h-[38px] shadow-sm tap-spring transition-colors"
                        title="Record Walk-in Cash or Transfer Payment"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Pay</span>
                      </button>

                      <button
                        onClick={() => handleIssueSlip(m.memberId)}
                        className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1 min-h-[38px] tap-spring shrink-0"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pickup Slip</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Spreadsheet Table (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/10 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Member ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Registered Bank</th>
                    <th className="py-3 px-4">KYC</th>
                    <th className="py-3 px-4 text-right">Support Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-[11px]">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 dark:hover:bg-white/5">
                      <td className="py-3.5 px-4 font-bold text-brand-700 dark:text-brand-400">{m.memberId}</td>
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-900 dark:text-white">{m.fullName}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{m.phone}</td>
                      <td className="py-3.5 px-4 font-sans text-slate-600 dark:text-slate-300 text-[10px]">
                        {m.bankDetails.bankName} - {m.bankDetails.accountNumber}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.kycVerified ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400'
                        }`}>
                          {m.kycVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPassbookMember(m)}
                            className="px-2.5 py-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all"
                            title="View Financial Passbook & Statements"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Passbook</span>
                          </button>
                          <button
                            onClick={() => {
                              setPreselectedPaymentMember(m);
                              setShowRecordPaymentModal(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg text-[10px] flex items-center gap-1 transition-all"
                            title="Record Walk-in Cash or Transfer Payment"
                          >
                            <Coins className="w-3 h-3" />
                            <span>Pay</span>
                          </button>
                          <button
                            onClick={() => handleIssueSlip(m.memberId)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-[10px]"
                          >
                            Pickup Slip
                          </button>
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

      {/* Vetting Dialog */}
      {activeVettingLoan && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Vetting Decision</h3>
              <button onClick={() => setActiveVettingLoan(null)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Loan: <strong className="text-slate-900 dark:text-white font-mono">{activeVettingLoan.id}</strong> (₦{activeVettingLoan.amount.toLocaleString()} for {activeVettingLoan.memberName})
            </p>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-semibold mb-1">
                PA Vetting Comments / Guarantor Verification Notes
              </label>
              <textarea
                rows={3}
                value={vettingComments}
                onChange={(e) => setVettingComments(e.target.value)}
                placeholder="Confirming that both member guarantors are verified in active standing..."
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/15 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => handleVetLoanDecision(false)}
                className="px-4 py-2 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl transition-all"
              >
                Reject Vetting
              </button>
              <button
                type="button"
                onClick={() => handleVetLoanDecision(true)}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Clear & Forward to Treasurer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Desk Modal */}
      <RecordPaymentModal
        isOpen={showRecordPaymentModal}
        onClose={() => {
          setShowRecordPaymentModal(false);
          setPreselectedPaymentMember(null);
        }}
        preselectedMember={preselectedPaymentMember}
        onPaymentSuccess={(pmt) => {
          setSelectedVoucher(pmt);
        }}
      />

      {/* Official Printable Receipt Voucher Modal */}
      <ReceiptVoucherModal
        isOpen={!!selectedVoucher}
        payment={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        onRecordAnother={() => {
          setSelectedVoucher(null);
          setShowRecordPaymentModal(true);
        }}
      />

      {/* Member Passbook & Statement Drawer */}
      <MemberPassbookDrawer
        isOpen={!!selectedPassbookMember}
        member={selectedPassbookMember}
        onClose={() => setSelectedPassbookMember(null)}
        onRecordPaymentForMember={(mem) => {
          setSelectedPassbookMember(null);
          setPreselectedPaymentMember(mem);
          setShowRecordPaymentModal(true);
        }}
        onViewVoucher={(pmt) => setSelectedVoucher(pmt)}
      />

      {/* Walk-In Desk Member Registration Modal */}
      <WalkInRegistrationModal
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onRegisteredSuccess={(newMem) => {
          setSelectedPassbookMember(newMem);
        }}
      />

      {/* Bulk Member Migration Modal (5,400+ Members) */}
      <BulkMemberImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onImportComplete={() => {
          refreshData();
        }}
      />

    </div>
  );
};
