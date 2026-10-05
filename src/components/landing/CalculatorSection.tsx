import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, TrendingUp, Coins, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';
import { triggerHaptic } from '../../utils/haptics';

interface KineticGaugeProps {
  ratio: number;
  title: string;
  centerLabel: string;
  centerValue: string;
  colorGradient: 'emerald' | 'amber';
}

const KineticGauge: React.FC<KineticGaugeProps> = ({
  ratio,
  title,
  centerLabel,
  centerValue,
  colorGradient
}) => {
  const arcLength = 220;
  const clampedRatio = Math.min(Math.max(ratio, 0.05), 1);
  const strokeOffset = arcLength * (1 - clampedRatio);
  
  // Point on semicircle (100, 92), r=70. Angle goes from PI (left) to 0 (right)
  const angle = Math.PI - (Math.PI * clampedRatio);
  const tipX = 100 + 70 * Math.cos(angle);
  const tipY = 92 - 70 * Math.sin(angle);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 mb-4 overflow-hidden">
      <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5 px-1">
        <span>{title}</span>
        <span className={colorGradient === 'emerald' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-bold'}>
          {Math.round(clampedRatio * 100)}% Velocity
        </span>
      </div>
      <svg viewBox="0 0 200 102" className="w-48 h-24 overflow-visible">
        <defs>
          <linearGradient id={`gaugeGrad-${colorGradient}`} x1="0%" y1="0%" x2="100%" y2="0%">
            {colorGradient === 'emerald' ? (
              <>
                <stop offset="0%" stopColor="#059669" />
                <stop offset="60%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
              </>
            )}
          </linearGradient>
        </defs>
        {/* Background Track Arc */}
        <path
          d="M 30 92 A 70 70 0 0 1 170 92"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          className="text-slate-200 dark:text-white/10"
        />
        {/* Dynamic Animated Progress Arc */}
        <path
          d="M 30 92 A 70 70 0 0 1 170 92"
          fill="none"
          stroke={`url(#gaugeGrad-${colorGradient})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={strokeOffset}
          style={{ transition: 'stroke-dashoffset 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        {/* Glowing Tip Needle Bead */}
        <circle
          cx={tipX}
          cy={tipY}
          r="5.5"
          fill="#FFFFFF"
          stroke={colorGradient === 'emerald' ? '#059669' : '#D97706'}
          strokeWidth="2.5"
          className="drop-shadow-md transition-all duration-300 ease-out"
        />
      </svg>
      {/* Central Metric Readout */}
      <div className="-mt-7 text-center">
        <span className="text-[10px] font-mono text-slate-400 block">{centerLabel}</span>
        <span className={`text-xs font-black font-display tracking-tight ${
          colorGradient === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
        }`}>
          {centerValue}
        </span>
      </div>
    </div>
  );
};

export const CalculatorSection: React.FC = () => {
  const { setCurrentPortal } = useApp();

  const [activeTab, setActiveTab] = useState<'savings' | 'loan'>('savings');

  // Savings Calculator State
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(50000);
  const [savingsMonths, setSavingsMonths] = useState<number>(12);
  const annualDividendRate = 18.5; // 18.5% p.a.

  // Savings Math
  const totalPrincipalSaved = monthlyDeposit * savingsMonths;
  const estimatedDividend = Math.round(totalPrincipalSaved * (annualDividendRate / 100) * (savingsMonths / 12));
  const totalSavingsPayout = totalPrincipalSaved + estimatedDividend;
  const savingsRatio = Math.min(Math.max((monthlyDeposit / 1000000) * 0.6 + (savingsMonths / 36) * 0.4, 0.08), 1);

  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(750000);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(6);
  const flatInterestRate = 5.0; // 5% flat cooperative rate

  // Loan Math
  const totalInterest = Math.round(loanAmount * (flatInterestRate / 100) * (loanTenureMonths / 12));
  const totalLoanRepayment = loanAmount + totalInterest;
  const monthlyLoanRepayment = Math.round(totalLoanRepayment / loanTenureMonths);
  // Fluid animated ratio directly reflecting monthly repayment and tenure duration
  const loanRatio = Math.min(Math.max((monthlyLoanRepayment / 500000) * 0.65 + (loanTenureMonths / 12) * 0.35, 0.08), 1);

  return (
    <section id="calculator" className="py-20 lg:py-28 bg-white dark:bg-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-white/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 dark:border-white/15 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
            <Calculator className="w-3.5 h-3.5" />
            Transparent Financial Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            Calculate Your Yield & Borrowing Power.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Real-time calculations based on official Mosunmola Cooperative Bye-Laws and audited yields.
          </p>
        </div>

        {/* Tab Switcher Pills with Sliding Fluid Pill */}
        <div className="flex justify-center mb-8">
          <div className="liquid-glass p-1 rounded-full border border-slate-200 dark:border-white/15 flex items-center shadow-lg relative overflow-hidden">
            {/* Sliding Fluid Backdrop Pill */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-slate-900 text-white dark:bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-md ${
                activeTab === 'savings' ? 'left-1' : 'left-[calc(50%+2px)]'
              }`}
            />

            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('savings');
              }}
              className={`relative z-10 px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors tap-spring ${
                activeTab === 'savings'
                  ? 'text-white dark:text-black font-black'
                  : 'text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <TrendingUp className={`w-3.5 h-3.5 ${activeTab === 'savings' ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-500'}`} />
              <span>Target Savings & Thrift ROI</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('loan');
              }}
              className={`relative z-10 px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors tap-spring ${
                activeTab === 'loan'
                  ? 'text-white dark:text-black font-black'
                  : 'text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Coins className={`w-3.5 h-3.5 ${activeTab === 'loan' ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-500'}`} />
              <span>Low-Interest Member Loan</span>
            </button>
          </div>
        </div>

        {/* Calculator Body */}
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-9 shadow-2xl max-w-4xl mx-auto border border-slate-200 dark:border-white/10">
          {activeTab === 'savings' ? (
            /* SAVINGS CALCULATOR */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-8">
                {/* Monthly deposit slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Monthly Contribution (₦)
                    </span>
                    <span className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">
                      ₦{monthlyDeposit.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={monthlyDeposit}
                    onChange={(e) => {
                      triggerHaptic('selection');
                      setMonthlyDeposit(Number(e.target.value));
                    }}
                    className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>₦10,000/mo</span>
                    <span>₦500,000/mo</span>
                    <span>₦1,000,000/mo</span>
                  </div>
                </div>

                {/* Duration slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Savings Tenure
                    </span>
                    <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                      {savingsMonths} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="36"
                    step="3"
                    value={savingsMonths}
                    onChange={(e) => {
                      triggerHaptic('selection');
                      setSavingsMonths(Number(e.target.value));
                    }}
                    className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>3 Months (Short)</span>
                    <span>12 Months (Annual Ajo)</span>
                    <span>36 Months</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl liquid-glass-card space-y-2 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                    <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Projected Dividend Bonus: 18.5% p.a.</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Dividends are audited and compounded into your cooperative wallet at the end of each financial year.
                  </p>
                </div>
              </div>

              {/* Yield Card Summary */}
              <div className="lg:col-span-5 liquid-glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-5">
                {/* Kinetic Animated Arc Gauge */}
                <KineticGauge
                  ratio={savingsRatio}
                  title={`Thrift Velocity (${savingsMonths} Mo)`}
                  centerLabel="Est. Dividend Bonus"
                  centerValue={`+₦${estimatedDividend.toLocaleString()} (${annualDividendRate}%)`}
                  colorGradient="emerald"
                />

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Projected Maturity Payout
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">
                    ₦{totalSavingsPayout.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Direct credit to your verified Nigerian bank account.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Contribution:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₦{totalPrincipalSaved.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Est. Dividend Profit:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+₦{estimatedDividend.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Lock Liquidity:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Guaranteed</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('medium');
                    navigateToService('members');
                  }}
                  className="w-full liquid-btn liquid-btn-white text-black font-bold py-2.5 text-xs flex items-center justify-center gap-2 tap-spring"
                >
                  <span>Start This Savings Goal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
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
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Desired Loan Amount
                    </span>
                    <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                      ₦{loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => {
                      triggerHaptic('selection');
                      setLoanAmount(Number(e.target.value));
                    }}
                    className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>₦100,000</span>
                    <span>₦2,500,000</span>
                    <span>₦5,000,000</span>
                  </div>
                </div>

                {/* Duration slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Repayment Tenure
                    </span>
                    <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                      {loanTenureMonths} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={loanTenureMonths}
                    onChange={(e) => {
                      triggerHaptic('selection');
                      setLoanTenureMonths(Number(e.target.value));
                    }}
                    className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    <span>1 Month (Express)</span>
                    <span>6 Months</span>
                    <span>12 Months (Maximum)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl liquid-glass-card space-y-2 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Flat 5.0% Cooperative Interest Rate</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Zero physical collateral required. You only need 2 active co-operative members in good standing as your guarantors.
                  </p>
                </div>
              </div>

              {/* Repayment Card Summary */}
              <div className="lg:col-span-5 liquid-glass-card p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-5">
                {/* Kinetic Animated Arc Gauge */}
                <KineticGauge
                  ratio={loanRatio}
                  title={`Repayment & Tenure Arc (${loanTenureMonths} Mo)`}
                  centerLabel="Monthly Repayment"
                  centerValue={`₦${monthlyLoanRepayment.toLocaleString()}/mo`}
                  colorGradient="amber"
                />

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Monthly Installment
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">
                    ₦{monthlyLoanRepayment.toLocaleString()}
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal"> / mo</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Low interest rates designed for member prosperity.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Principal Borrowed:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₦{loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Flat Interest (5%):</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₦{totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Repayment:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">₦{totalLoanRepayment.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic('medium');
                    navigateToService('members');
                  }}
                  className="w-full liquid-btn liquid-btn-white text-black font-bold py-2.5 text-xs flex items-center justify-center gap-2 tap-spring"
                >
                  <span>Apply for This Loan</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
