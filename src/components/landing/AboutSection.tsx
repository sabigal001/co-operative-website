import React from 'react';
import { 
  Building, 
  Target, 
  Users, 
  Scale, 
  ArrowRight
} from 'lucide-react';

interface AboutSectionProps {
  onOpenApplyModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenApplyModal }) => {
  return (
    <section id="about" className="py-20 lg:py-28 dark:bg-[#080808] bg-slate-50 dark:text-white text-slate-900 border-b dark:border-white/10 border-slate-200 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border dark:border-white/10 border-slate-200 dark:text-white text-slate-900 text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Building className="w-3.5 h-3.5 text-emerald-500" />
            <span>About Mosunmola Cooperative</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight dark:text-white text-slate-900 leading-tight">
            A Legacy of Trust, Capital Pooling & Member Wealth.
          </h2>
          <p className="text-base dark:text-slate-300 text-slate-600 leading-relaxed">
            Registered under the Cooperative Societies Laws of Lagos State (Certificate No: <strong className="dark:text-emerald-400 text-emerald-600 font-mono">LSCS/2018/8941</strong>), Mosunmola Cooperative Multipurpose Society Limited is built on the time-tested cooperative principle of mutual empowerment.
          </p>
        </div>

        {/* 3 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="liquid-glass-card rounded-3xl p-7 space-y-4 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl dark:bg-white/10 bg-emerald-50 text-emerald-500 flex items-center justify-center border dark:border-white/15 border-emerald-200">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg dark:text-white text-slate-900">Our Mission</h3>
            <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
              To liberate everyday Nigerian professionals, business owners, and artisans from predatory bank rates through pooled community savings, low-interest micro-credit, and transparent asset co-ownership.
            </p>
          </div>

          <div className="liquid-glass-card rounded-3xl p-7 space-y-4 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl dark:bg-white/10 bg-emerald-50 text-emerald-500 flex items-center justify-center border dark:border-white/15 border-emerald-200">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg dark:text-white text-slate-900">Legal & Audited Solvency</h3>
            <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
              We operate under strict statutory fiduciary guidelines. Accounts are independently audited every financial year, maintaining a 42.8% liquid reserve ratio to ensure instant member withdrawals and loan payouts.
            </p>
          </div>

          <div className="liquid-glass-card rounded-3xl p-7 space-y-4 hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl dark:bg-white/10 bg-emerald-50 text-emerald-500 flex items-center justify-center border dark:border-white/15 border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg dark:text-white text-slate-900">The Co-Member Guarantor Model</h3>
            <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
              Members borrow up to ₦5,000,000 at a flat 5% interest rate with zero physical collateral. Approvals are backed simply by two fellow financial members who vouch for your integrity and track record.
            </p>
          </div>
        </div>

        {/* How to Join Banner */}
        <div className="liquid-glass-card rounded-3xl p-7 sm:p-10 border dark:border-white/15 border-slate-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full liquid-glass dark:text-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider border dark:border-white/10 border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Admission Procedure
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display dark:text-white text-slate-900">
              How to Become a Registered Member
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs dark:text-slate-300 text-slate-600">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full dark:bg-white dark:text-black bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <span>Submit online membership application with government ID.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full dark:bg-white dark:text-black bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span>Super Admin reviews credentials and allocates physical Member ID card.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full dark:bg-white dark:text-black bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span>Access Member Web App, activate wallet, and start building wealth.</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenApplyModal}
            className="liquid-btn liquid-btn-white shrink-0 py-2.5 px-5 text-xs font-bold"
          >
            <span>Apply to Join Today</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
