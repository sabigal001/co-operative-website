import React, { useState, useEffect } from 'react';
import type { LoanApplication, MemberProfile, Guarantor } from '../../types';
import { loanService } from '../../services/api/loanService';
import { useApp } from '../../context/AppContext';
import { 
  Coins, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Calendar, 
  X,
  CreditCard,
  Loader2
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

  // Repayment in-flight state
  const [repayingLoanId, setRepayingLoanId] = useState<string | null>(null);

  const loadLoans = async () => {
    try {
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

  // Handle Application Submit (Sent to PA / Admin Officer)
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
        showToast('Loan application submitted for PA Officer vetting!', 'success');
        fireConfetti();
        setShowApplyModal(false);
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error applying for loan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pay Next Installment
  const handlePayInstallment = async (loan: LoanApplication) => {
    const nextInstallment = loan.repaymentSchedule.find((s) => s.status === 'pending');
    if (!nextInstallment) {
      showToast('All installments for this loan have been completed!', 'info');
      return;
    }

    setRepayingLoanId(loan.id);
    try {
      const res = await loanService.repayLoan(loan.id, nextInstallment.amount, member.fullName);
      if (res.success) {
        showToast(`Paid ₦${nextInstallment.amount.toLocaleString()} for installment #${loan.id}!`, 'success');
        fireConfetti();
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Payment error', 'error');
    } finally {
      setRepayingLoanId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header & Apply Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              Cooperative Loan Hub
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider liquid-glass text-amber-300 border border-white/10">
              Flat 5% Interest
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero collateral credit backed by fellow member trust and voluntary savings.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="liquid-btn liquid-btn-white text-black font-bold py-2 px-4 text-xs flex items-center justify-center gap-2"
        >
          <Plus className="w-3.5 h-3.5 text-black" />
          <span>Apply for New Loan</span>
        </button>
      </div>

      {/* Loans List */}
      <div className="space-y-6">
        {loans.length === 0 ? (
          <div className="liquid-glass-card rounded-3xl p-10 text-center border border-white/10">
            <Coins className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-white text-base mb-1">No Active Loans Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              As an active member with verified physical card ID, you are eligible for up to ₦5,000,000 at 5% flat interest.
            </p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="liquid-btn liquid-btn-white text-black font-bold py-2 px-4 text-xs"
            >
              Apply Now
            </button>
          </div>
        ) : (
          loans.map((loan) => {
            const percentPaid = loan.totalRepayment > 0 
              ? Math.min(100, Math.round((loan.totalPaid / loan.totalRepayment) * 100))
              : 0;

            const nextPending = loan.repaymentSchedule.find((s) => s.status === 'pending');

            return (
              <div
                key={loan.id}
                className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-sm space-y-6"
              >
                {/* Top Status Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-white">{loan.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider liquid-glass border border-white/10 ${
                        loan.status === 'approved_disbursed' ? 'text-emerald-400' :
                        loan.status === 'vetted_pending_treasurer' ? 'text-amber-400' :
                        loan.status === 'pending_vetting' ? 'text-blue-400' :
                        loan.status === 'repaid' ? 'text-slate-300' :
                        'text-rose-400'
                      }`}>
                        {loan.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{loan.purpose}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Total Repayment</span>
                    <span className="text-2xl font-black font-display text-white">
                      ₦{loan.totalRepayment.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Repayment Metric */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-slate-400 font-medium">
                      Repayment Progress: <strong className="text-white">₦{loan.totalPaid.toLocaleString()} paid</strong> of ₦{loan.totalRepayment.toLocaleString()}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{percentPaid}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-white rounded-full transition-all duration-500"
                      style={{ width: `${percentPaid}%` }}
                    />
                  </div>
                </div>

                {/* Vetting & Guarantors Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Guarantors</span>
                    <div className="space-y-1">
                      {loan.guarantors.map((g, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-300">
                          <span className="font-medium truncate max-w-[160px]">{g.name}</span>
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Installment</span>
                    {nextPending ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-bold text-white font-mono">
                            ₦{nextPending.amount.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-slate-400">Due Date: {nextPending.dueDate}</span>
                        </div>
                        {loan.status === 'approved_disbursed' && (
                          <button
                            onClick={() => handlePayInstallment(loan)}
                            disabled={repayingLoanId === loan.id}
                            className="liquid-btn liquid-btn-white py-1.5 px-3 text-xs flex items-center gap-1.5"
                          >
                            {repayingLoanId === loan.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CreditCard className="w-3 h-3 text-black" />
                            )}
                            <span>Pay Installment</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5 py-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>All installments fully settled!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Repayment Schedule Collapsible */}
                {loan.repaymentSchedule.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      Repayment Schedule Breakdown
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
                        <thead className="bg-black/50 text-slate-400 font-semibold border-b border-white/10">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Due Date</th>
                            <th className="py-2.5 px-3">Amount</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Payment Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                          {loan.repaymentSchedule.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-white/5">
                              <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                              <td className="py-2 px-3 text-slate-300">{item.dueDate}</td>
                              <td className="py-2 px-3 font-bold text-white">₦{item.amount.toLocaleString()}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${
                                  item.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-slate-400 text-[11px] font-sans">
                                {item.paidDate || 'Pending'}
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0A0A] text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-slide-up relative">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Apply for Member Loan</h3>
                <p className="text-xs text-slate-400">Zero collateral • 5% Flat Interest Rate</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Requested Loan Amount (₦)</label>
                <input
                  type="number"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Repayment Duration</label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={9}>9 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Loan Purpose</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Agro commodity trade financing"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              {/* Guarantors */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider block">
                  Assign 2 Verified Cooperative Guarantors
                </span>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Guarantor 1 (Member ID & Name)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={guarantor1Id}
                      onChange={(e) => setGuarantor1Id(e.target.value)}
                      className="bg-black border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-500"
                    />
                    <input
                      type="text"
                      value={guarantor1Name}
                      onChange={(e) => setGuarantor1Name(e.target.value)}
                      className="bg-black border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Guarantor 2 (Member ID & Name)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={guarantor2Id}
                      onChange={(e) => setGuarantor2Id(e.target.value)}
                      className="bg-black border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-500"
                    />
                    <input
                      type="text"
                      value={guarantor2Name}
                      onChange={(e) => setGuarantor2Name(e.target.value)}
                      className="bg-black border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-bold text-emerald-400">5.0% Flat</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Repayment:</span>
                  <span className="font-bold text-white font-mono">
                    ₦{Math.round(amount + (amount * 0.05 * (durationMonths / 12))).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="liquid-btn liquid-btn-default py-1.5 px-3.5 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="liquid-btn liquid-btn-white text-black font-bold py-1.5 px-3.5 text-xs flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-black" /> : <ShieldCheck className="w-3.5 h-3.5 text-black" />}
                  <span>Submit for PA Vetting</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
