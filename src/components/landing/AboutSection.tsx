import React from 'react';
import { 
  Building, 
  ShieldCheck, 
  Target, 
  Users, 
  Scale, 
  Coins, 
  FileCheck2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AboutSectionProps {
  onOpenApplyModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenApplyModal }) => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#07192C] text-white border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            About Mosunmola Cooperative
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            A Legacy of Trust, Capital Pooling & Member Wealth.
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Registered under the Cooperative Societies Laws of Lagos State (Certificate No: <strong>LSCS/2018/8941</strong>), Mosunmola Cooperative Multipurpose Society Limited is built on the time-tested cooperative principle of mutual empowerment.
          </p>
        </div>

        {/* 3 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#0A2540] rounded-3xl p-8 border border-white/10 space-y-4 hover:border-brand-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To liberate everyday Nigerian professionals, business owners, and artisans from predatory bank rates through pooled community savings, low-interest micro-credit, and transparent asset co-ownership.
            </p>
          </div>

          <div className="bg-[#0A2540] rounded-3xl p-8 border border-white/10 space-y-4 hover:border-brand-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">Legal & Audited Solvency</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We operate under strict statutory fiduciary guidelines. Accounts are independently audited every financial year, maintaining a 42.8% liquid reserve ratio to ensure instant member withdrawals and loan payouts.
            </p>
          </div>

          <div className="bg-[#0A2540] rounded-3xl p-8 border border-white/10 space-y-4 hover:border-brand-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">The Co-Member Guarantor Model</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Members borrow up to ₦5,000,000 at a flat 5% interest rate with zero physical collateral. Approvals are backed simply by two fellow financial members who vouch for your integrity and track record.
            </p>
          </div>
        </div>

        {/* How to Join Banner */}
        <div className="bg-gradient-to-r from-[#0F2F4F] via-[#0A2540] to-[#07192C] rounded-3xl p-8 sm:p-12 border border-brand-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block">
              Admission Procedure
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
              How to Become a Registered Member
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span>Submit online membership application with government ID.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span>Super Admin reviews credentials and allocates physical Member ID card.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span>Access Member Web App, activate wallet, and start building wealth.</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenApplyModal}
            className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-glow shrink-0 transition-all active:scale-95"
          >
            <span>Apply to Join Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
