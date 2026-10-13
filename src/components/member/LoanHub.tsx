import React, { useState, useEffect } from 'react';
import type { LoanApplication, MemberProfile, Guarantor } from '../../types';
import { loanService } from '../../services/api/loanService';
import { apiClient } from '../../services/api/apiClient';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { 
  Coins, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Calendar, 
  X,
  Lock,
  Loader2,
  FileText
} from 'lucide-react';

interface LoanHubProps {
  member: MemberProfile;
}

export const LoanHub: React.FC<LoanHubProps> = ({ member }) => {
  const { showToast, fireConfetti, dataVersion, refreshData } = useApp();

  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Apply Form State
  const [amount, setAmount] = useState<number>(1000000);
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [purpose, setPurpose] = useState('Business Working Capital Expansion');
  const [guarantor1Id, setGuarantor1Id] = useState('MCS-2026-9921');
  const [guarantor1Name, setGuarantor1Name] = useState('Dr. Babatunde Alabi');
  const [guarantor2Id, setGuarantor2Id] = useState('MCS-2026-1033');
  const [guarantor2Name, setGuarantor2Name] = useState('Hajiya Fatima Garba');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLoans = async () => {
    try {
      // 1. Try real backend member loans
      const backendRes = await apiClient.get<any[]>('/member/loans');
      if (backendRes.success && Array.isArray(backendRes.data) && backendRes.data.length > 0) {
        // Map backend loans
        const mapped = backendRes.data.map((bl: any) => ({
          id: bl.loanReference || `LN-${bl.id}`,
          memberId: member.memberId,
          memberName: member.fullName,
          amount: bl.principalNaira,
          purpose: bl.purpose,
          durationMonths: bl.durationMonths,
          interestRate: bl.interestRatePct,
          monthlyRepayment: bl.monthlyRepaymentNaira,
          totalRepayment: bl.principalNaira * (1 + bl.interestRatePct / 100),
          totalPaid: bl.principalNaira * (1 + bl.interestRatePct / 100) - bl.outstandingNaira,
          outstandingBalance: bl.outstandingNaira,
          status: bl.status === 'active' ? 'approved_disbursed' : bl.status,
          applicationDate: bl.createdAt.split('T')[0],
          guarantors: [],
          repaymentSchedule: []
        }));
        setLoans(mapped as any);
        return;
      }

      // Fallback to local loan service
      const res = await loanService.getMemberLoans(member.id);
      if (res.success) {
        setLoans(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, [member.id, dataVersion]);

  // Handle Application Submit (Sent to Secretariat / PA Officer)
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsSubmitting(true);
    try {
      const guarantors: Guarantor[] = [
        {
          memberId: guarantor1Id,
          name: guarantor1Name,
          phone: '+234 809 112 3344',
          relationship: 'Cooperative Senior Colleague',
          status: 'accepted'
        },
        {
          memberId: guarantor2Id,
          name: guarantor2Name,
          phone: '+234 802 334 1122',
          relationship: 'Cooperative Associate',
          status: 'accepted'
        }
      ];

      const res = await loanService.applyForLoan(
        member.memberId,
        member.fullName,
        amount,
        purpose,
        durationMonths,
        guarantors
      );

      if (res.success) {
        triggerHaptic('success');
        showToast('Loan application submitted for secretariat review!', 'success');
        fireConfetti();
        setShowApplyModal(false);
        refreshData();
      }
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message || 'Error applying for loan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 flex flex-col justify-center items-center gap-2">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <span className="text-xs text-slate-500 font-mono">Loading credit register...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Read-Only Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Read-Only Credit Ledger:</strong> Installment repayments and loan settlements are recorded manually by cooperative cashier staff and verified by the Treasurer.
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/40 hidden sm:inline">
          Server Verified
        </span>
      </div>

      {/* Header & Apply Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
              Cooperative Loan Records & Schedule
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
              Flat 5% Interest Rate
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Credit facility records, approved amortizations, and verified repayment receipts.
          </p>
        </div>
      </div>

      {/* Loans List */}
      <div className="space-y-6">
        {loans.length === 0 ? (
          <div className="rounded-3xl p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <Coins className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">No Active Loans Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Any loan facility approved and disbursed by the Secretariat will appear here automatically.
            </p>
          </div>
        ) : (
          loans.map((loan) => {
            const percentPaid = loan.totalRepayment > 0 
              ? Math.min(100, Math.round((loan.totalPaid / loan.totalRepayment) * 100))
              : 0;

            const nextPending = loan.repaymentSchedule?.find((s) => s.status === 'pending');

            return (
              <div
                key={loan.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
              >
                {/* Top Status Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{loan.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        loan.status === 'approved_disbursed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40' :
                        loan.status === 'vetted_pending_treasurer' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400' :
                        loan.status === 'repaid' ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300' :
                        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}>
                        {loan.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{loan.purpose}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Repayment Amount</span>
                    <span className="text-2xl font-black font-display text-slate-900 dark:text-white">
                      ₦{loan.totalRepayment.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Repayment Metric */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Verified Repaid: <strong className="text-slate-900 dark:text-white">₦{loan.totalPaid.toLocaleString()}</strong> of ₦{loan.totalRepayment.toLocaleString()}
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{percentPaid}% Settle Rate</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentPaid}%` }}
                    />
                  </div>
                </div>

                {/* Guarantors & Schedule Overview Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-mono">Verified Member Guarantors</span>
                    <div className="space-y-1">
                      {loan.guarantors && loan.guarantors.length > 0 ? (
                        loan.guarantors.map((g, idx) => (
                          <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                            <span className="font-medium truncate max-w-[160px]">{g.name}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500">Cooperative Secretariat Vetted</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block font-mono">Outstanding Balance</span>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                          ₦{(loan.outstandingBalance || 0).toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {nextPending ? `Next Due: ${nextPending.dueDate}` : 'Settlement on schedule'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Staff Receipt Only
                      </span>
                    </div>
                  </div>
                </div>

                {/* Repayment Schedule Table */}
                {loan.repaymentSchedule && loan.repaymentSchedule.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2 font-mono">
                      Repayment Schedule & Receipt Records
                    </span>
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                      <table className="w-full text-left text-xs min-w-[560px]">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Due Date</th>
                            <th className="py-2.5 px-3">Installment</th>
                            <th className="py-2.5 px-3">Settlement Status</th>
                            <th className="py-2.5 px-3">Receipt Ref</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                          {loan.repaymentSchedule.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                              <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                              <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{item.dueDate}</td>
                              <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">₦{item.amount.toLocaleString()}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${
                                  item.status === 'paid' 
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                }`}>
                                  {item.status === 'paid' ? 'Settled' : 'Awaiting Cashier Settlement'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-500 text-[11px]">
                                {item.paidDate ? `RCP-${item.paidDate}` : 'Pending'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Apply Loan Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Apply for Member Loan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Flat 5% Interest • Verified Member Trust</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Requested Principal (₦)
                </label>
                <input
                  type="number"
                  min="100000"
                  max="5000000"
                  step="50000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Loan Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Commercial Inventory & Working Capital"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Repayment Tenor
                  </label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Interest Rate
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold">
                    5.0% Flat
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block font-mono">Guarantor Endorsements</span>
                <p>1. {guarantor1Name} ({guarantor1Id})</p>
                <p>2. {guarantor2Name} ({guarantor2Id})</p>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
