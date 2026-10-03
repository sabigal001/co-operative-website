import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, ArrowRight, TrendingUp, Coins, Sparkles, CheckCircle2 } from 'lucide-react';

export const CalculatorSection: React.FC = () => {
  const { openRegisterModal, setCurrentPortal } = useApp();

  const [activeTab, setActiveTab] = useState<'savings' | 'loan'>('savings');

  // Savings Calculator State
  const [savingsMonthly, setSavingsMonthly] = useState<number>(100000);
  const [savingsMonths, setSavingsMonths] = useState<number>(12);
  const annualSavingsReturn = 18.5; // 18.5%

  // Savings Math: simple approximation of monthly accumulation + dividend
  const totalPrincipalSaved = savingsMonthly * savingsMonths;
  const estimatedDividend = Math.round(totalPrincipalSaved * (annualSavingsReturn / 100) * (savingsMonths / 12) * 0.55);
  const totalSavingsPayout = totalPrincipalSaved + estimatedDividend;

  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(1500000);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(6);
  const flatInterestRate = 5.0; // 5% cooperative rate

  // Loan Math
  const totalInterest = Math.round(loanAmount * (flatInterestRate / 100) * (loanTenureMonths / 12));
  const totalLoanRepayment = loanAmount + totalInterest;
  const monthlyLoanRepayment = Math.round(totalLoanRepayment / loanTenureMonths);

  return (
    <section id="calculator" className="py-20 lg:py-28 bg-[#0A2540] text-white border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            Transparent Financial Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            Calculate Your Yield & Borrowing Power.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time calculations based on official Mosunmola Cooperative Bye-Laws and audited yields.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex justify-center mb-10">
          <div className="bg-[#07192C] p-1.5 rounded-full border border-white/10 flex items-center shadow-inner">
            <button
              onClick={() => setActiveTab('savings')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'savings'
                  ? 'bg-brand-500 text-slate-950 shadow-glow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Target Savings & Thrift ROI</span>
            </button>

            <button
              onClick={() => setActiveTab('loan')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'loan'
                  ? 'bg-brand-500 text-slate-950 shadow-glow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Low-Interest Member Loan</span>
            </button>
          </div>
        </div>

        {/* Calculator Body */}
        <div className="bg-[#07192C] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto">
          {activeTab === 'savings' ? (
            /* SAVINGS CALCULATOR */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-8">
                {/* Monthly deposit slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Monthly Contribution
                    </span>
                    <span className="font-mono text-xl font-black text-brand-400">
                      ₦{savingsMonthly.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={savingsMonthly}
                    onChange={(e) => setSavingsMonthly(Number(e.target.value))}
                    className="w-full accent-brand-500 h-2 bg-[#0A2540] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>₦10,000</span>
                    <span>₦500,000</span>
                    <span>₦1,000,000</span>
                  </div>
                </div>

                {/* Duration slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Savings Tenure (Months)
                    </span>
                    <span className="font-mono text-xl font-black text-white">
                      {savingsMonths} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="36"
                    step="1"
                    value={savingsMonths}
                    onChange={(e) => setSavingsMonths(Number(e.target.value))}
                    className="w-full accent-brand-500 h-2 bg-[#0A2540] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>3 Months (Short)</span>
                    <span>12 Months (Annual Ajo)</span>
                    <span>36 Months</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A2540] border border-white/5 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-brand-400 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Projected Dividend Bonus: 18.5% p.a.</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dividends are audited and compounded into your cooperative wallet at the end of each financial year.
                  </p>
                </div>
              </div>

              {/* Yield Card Summary */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0A2540] to-[#0D2F52] p-6 sm:p-8 rounded-3xl border border-brand-500/30 shadow-glow flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 block mb-1">
                    Projected Maturity Payout
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white font-display">
                    ₦{totalSavingsPayout.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct credit to your verified Nigerian bank account.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Contribution:</span>
                    <span className="font-mono font-bold text-white">₦{totalPrincipalSaved.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Dividend Profit:</span>
                    <span className="font-mono font-bold text-emerald-400">+₦{estimatedDividend.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lock Liquidity:</span>
                    <span className="font-semibold text-slate-200">100% Guaranteed</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPortal('member')}
                  className="w-full py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Start This Savings Goal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* LOAN CALCULATOR */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-8">
                {/* Loan amount slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Desired Loan Amount
                    </span>
                    <span className="font-mono text-xl font-black text-amber-400">
                      ₦{loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-amber-400 h-2 bg-[#0A2540] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>₦100,000</span>
                    <span>₦2,500,000</span>
                    <span>₦5,000,000</span>
                  </div>
                </div>

                {/* Duration slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Repayment Tenure
                    </span>
                    <span className="font-mono text-xl font-black text-white">
                      {loanTenureMonths} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={loanTenureMonths}
                    onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
                    className="w-full accent-amber-400 h-2 bg-[#0A2540] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span>1 Month (Express)</span>
                    <span>6 Months</span>
                    <span>12 Months (Maximum)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A2540] border border-white/5 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Flat 5.0% Cooperative Interest Rate</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Zero physical collateral required. You only need 2 active co-operative members in good standing as your guarantors.
                  </p>
                </div>
              </div>

              {/* Repayment Card Summary */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0A2540] to-[#0D2F52] p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-glow flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                    Monthly Installment
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white font-display">
                    ₦{monthlyLoanRepayment.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Deducted monthly from wallet or linked bank account.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Principal Disbursed:</span>
                    <span className="font-mono font-bold text-white">₦{loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Flat Interest (5%):</span>
                    <span className="font-mono font-bold text-amber-400">₦{totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Repayment:</span>
                    <span className="font-mono font-bold text-white">₦{totalLoanRepayment.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPortal('member')}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Apply for this Loan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
