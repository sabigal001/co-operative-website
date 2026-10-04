import React, { useState, useEffect } from 'react';
import type { MemberProfile, SavingsAccount, TargetPlan } from '../../types';
import { savingsService } from '../../services/api/savingsService';
import { useApp } from '../../context/AppContext';
import { 
  PiggyBank, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Upload, 
  Building, 
  Copy,
  Clock,
  X,
  Loader2
} from 'lucide-react';

interface SavingsWalletProps {
  member: MemberProfile;
}

export const SavingsWallet: React.FC<SavingsWalletProps> = ({ member }) => {
  const { showToast, fireConfetti, dataVersion, refreshData } = useApp();

  const [savings, setSavings] = useState<SavingsAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(200000);
  const [depositType, setDepositType] = useState<'voluntary_savings' | 'target_plan'>('voluntary_savings');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [bankRef, setBankRef] = useState<string>('NIP-TRF-908129');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Target Plan Form State
  const [planTitle, setPlanTitle] = useState('');
  const [planTarget, setPlanTarget] = useState<number>(1000000);
  const [planMonthly, setPlanMonthly] = useState<number>(100000);
  const [planCategory, setPlanCategory] = useState<TargetPlan['category']>('estate');

  // Payout Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(150000);

  const loadData = async () => {
    try {
      const res = await savingsService.getSavings(member.id);
      if (res.success && res.data) {
        setSavings(res.data);
        if (res.data.targetPlans.length > 0) {
          setSelectedPlanId(res.data.targetPlans[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [member.id, dataVersion]);

  // Handle Deposit Submission (Enters Treasurer Approval Queue!)
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) {
      showToast('Please enter a valid deposit amount.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await savingsService.submitDeposit(
        member.memberId,
        member.fullName,
        depositAmount,
        depositType,
        bankRef,
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
        depositType === 'target_plan' ? selectedPlanId : undefined
      );

      if (res.success) {
        showToast('Payment proof submitted to the Treasurer for authorization!', 'success');
        setShowDepositModal(false);
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting deposit.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle New Target Plan Creation
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle || planTarget <= 0) {
      showToast('Please specify a title and target amount.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date();
      const end = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

      const res = await savingsService.createTargetPlan(member.id, {
        title: planTitle,
        targetAmount: planTarget,
        monthlyContribution: planMonthly,
        startDate: today.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        category: planCategory,
        autoDebit: true,
        color: '#00C853'
      });

      if (res.success) {
        showToast(res.message, 'success');
        fireConfetti();
        setShowNewPlanModal(false);
        setPlanTitle('');
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error creating plan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Payout Request to Treasurer
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await savingsService.requestPayout(
        member.memberId,
        member.fullName,
        withdrawAmount,
        'savings_withdrawal',
        member.bankDetails
      );

      if (res.success) {
        showToast('Withdrawal request submitted to the Treasurer.', 'success');
        setShowWithdrawModal(false);
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting withdrawal.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !savings) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Total Balance Hero Card */}
      <div className="bg-gradient-to-br from-black via-zinc-950 to-neutral-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                Total Consolidated Savings
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                18.5% p.a. ROI
              </span>
            </div>
            <div className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
              ₦{savings.totalBalance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Active Member: <strong className="text-white">{member.fullName}</strong> ({member.memberId})
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-5 py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-2 shadow-glow transition-all active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4 text-slate-950" />
              <span>Deposit Funds</span>
            </button>

            <button
              onClick={() => setShowNewPlanModal(true)}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl flex items-center gap-2 border border-white/10 transition-colors"
            >
              <Plus className="w-4 h-4 text-brand-400" />
              <span>New Target Plan</span>
            </button>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs rounded-2xl transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills: Voluntary vs Target vs Dividend */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Voluntary Regular Thrift</span>
            <span className="text-lg font-bold text-white font-mono">
              ₦{savings.voluntarySavings.toLocaleString()}
            </span>
            <span className="text-[10px] text-brand-400 block mt-0.5">Flexible liquidation</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Dedicated Target Plans</span>
            <span className="text-lg font-bold text-white font-mono">
              ₦{savings.targetSavings.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-400 block mt-0.5">{savings.targetPlans.length} active goals locked</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Accrued AGM Dividends</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              ₦{savings.dividendsEarned.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Paid annually in December</span>
          </div>
        </div>
      </div>

      {/* Target Savings Plans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Target Savings & Thrift Goals
            </h3>
            <p className="text-xs text-slate-500">
              Disciplined contributions locked towards high-value acquisitions.
            </p>
          </div>
          <button
            onClick={() => setShowNewPlanModal(true)}
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savings.targetPlans.map((plan) => {
            const percent = Math.min(100, Math.round((plan.currentAmount / plan.targetAmount) * 100));
            return (
              <div
                key={plan.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {plan.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-600">
                      {percent}%
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mb-1">
                    {plan.title}
                  </h4>
                  <div className="text-2xl font-black font-display text-slate-900 mb-2">
                    ₦{plan.currentAmount.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500 block mb-4">
                    Target: ₦{plan.targetAmount.toLocaleString()}
                  </span>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                  <span>Monthly: ₦{plan.monthlyContribution.toLocaleString()}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Due: {plan.endDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL 1: DEPOSIT SAVINGS (TREASURER APPROVAL FLOW) ================= */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0A0A] text-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-slide-up relative">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Deposit Contribution</h3>
                <p className="text-xs text-slate-400">Direct Bank Transfer to Cooperative Accounts</p>
              </div>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cooperative Bank Account Information */}
            <div className="p-4 rounded-2xl bg-black border border-brand-500/30 mb-6 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">
                Official Treasury Collection Bank Account:
              </span>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Bank Name:</span>
                <strong className="text-white">Access Bank PLC</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Account Number:</span>
                <span className="font-mono font-bold text-brand-400 text-sm">0129482710</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Account Name:</span>
                <span className="text-white font-semibold">MOSUNMOLA COOP SOC LTD</span>
              </div>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deposit Type</label>
                <select
                  value={depositType}
                  onChange={(e) => setDepositType(e.target.value as any)}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="voluntary_savings">Regular Voluntary Thrift Savings</option>
                  <option value="target_plan">Dedicated Target Savings Goal</option>
                </select>
              </div>

              {depositType === 'target_plan' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Target Goal</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  >
                    {savings.targetPlans.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deposit Amount (₦)</label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bank Payment Reference / Session ID</label>
                <input
                  type="text"
                  value={bankRef}
                  onChange={(e) => setBankRef(e.target.value)}
                  placeholder="e.g. NIP-9081298402"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-center">
                <Upload className="w-5 h-5 text-brand-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-300 block">Bank Transfer Receipt Attached</span>
                <span className="text-[9px] text-slate-500">proof_transfer_access.pdf (Uploaded)</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-4 py-2.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-glow"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Submit to Treasurer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: NEW TARGET PLAN ================= */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">Create Target Savings Goal</h3>
              <button onClick={() => setShowNewPlanModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Goal Title</label>
                <input
                  type="text"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="e.g. Epe Land Deposit 2026"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Amount (₦)</label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={planTarget}
                  onChange={(e) => setPlanTarget(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Monthly Contribution (₦)</label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  value={planMonthly}
                  onChange={(e) => setPlanMonthly(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={planCategory}
                  onChange={(e) => setPlanCategory(e.target.value as any)}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="estate">Real Estate & Land Downpayment</option>
                  <option value="education">Tuition & School Fees</option>
                  <option value="business">Business Expansion & Equipment</option>
                  <option value="holiday">Festive Ajo / Holiday</option>
                  <option value="vehicle">Automobile / Logistics</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5"
                >
                  <span>Create Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: WITHDRAWAL REQUEST ================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-white">Withdraw Savings</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                Payouts are authorized by the Treasurer and disbursed directly into your registered bank account ({member.bankDetails.bankName} - {member.bankDetails.accountNumber}).
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amount to Withdraw (₦)</label>
                <input
                  type="number"
                  min="10000"
                  max={savings.voluntarySavings}
                  step="5000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Available voluntary balance: ₦{savings.voluntarySavings.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-xl"
                >
                  <span>Request Payout</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
