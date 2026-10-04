import React from 'react';
import { 
  ArrowRight, 
  Building2, 
  ChevronRight,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';

interface HeroSectionProps {
  onOpenApplyModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenApplyModal }) => {
  const bgPosterImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85";

  return (
    <section className="relative overflow-hidden dark:bg-black bg-slate-50 dark:text-white text-slate-900 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b dark:border-white/10 border-slate-200 transition-colors duration-300">
      
      {/* Background Photography & Adaptive Ambient Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgPosterImage}
          alt="Modern Financial Architecture in Lagos"
          className="w-full h-full object-cover object-center dark:opacity-75 opacity-30 transform scale-105 transition-transform duration-1000"
        />

        {/* Adaptive Vignette to Guarantee Readability in both Dark and Light themes */}
        <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-black/90 dark:via-black/70 dark:to-black/80 bg-gradient-to-r from-slate-50/95 via-slate-50/85 to-slate-50/90" />
        <div className="absolute inset-0 dark:bg-gradient-to-t dark:from-black dark:via-transparent dark:to-black/40 bg-gradient-to-t from-slate-50 via-transparent to-slate-50/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Authentic Institutional Headline & Presentation */}
          <div className="lg:col-span-8 space-y-5 text-center lg:text-left animate-slide-up">
            
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border dark:border-white/15 border-slate-200 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#00C853] animate-pulse" />
              <span className="dark:text-white text-slate-900 font-bold">Lagos State Certified Society</span>
              <span className="dark:text-white/30 text-slate-400">•</span>
              <span className="dark:text-slate-300 text-slate-600 font-mono text-[11px]">LSCS/2018/8941</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight dark:text-white text-slate-900 leading-[1.12]">
              Empowering Members with Disciplined Wealth & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-brand-500 to-emerald-600 underline decoration-emerald-500/40 decoration-wavy underline-offset-8">Cooperative Freedom.</span>
            </h1>

            <p className="text-sm sm:text-base dark:text-slate-200 text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              <strong>Mosunmola Cooperative Multipurpose Society</strong> is a premier statutory credit and thrift institution. We help forward-thinking professionals, civil servants, and entrepreneurs achieve financial sovereignty through collective capital, 5% low-interest member loans, high-yield thrift, and verified asset co-ownership.
            </p>

            {/* Small Refined Liquid Glass Action Group */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <button
                onClick={onOpenApplyModal}
                className="liquid-btn liquid-btn-white"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Apply for Membership</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="#products"
                className="liquid-btn liquid-btn-default"
              >
                <span>Explore Solutions</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

            {/* Green Text Link for Issued Members (Added Back) */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#00C853] animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Already an issued member?{' '}
                <button
                  onClick={() => navigateToService('members')}
                  className="underline hover:text-emerald-700 dark:hover:text-emerald-300 font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Install or open the Member Web App (PWA)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </span>
            </div>

            {/* Credibility Stats Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto lg:mx-0 border-t dark:border-white/10 border-slate-200 text-left">
              <div>
                <span className="text-2xl font-black font-display dark:text-white text-slate-900 block">14,850+</span>
                <span className="text-[10px] dark:text-slate-300 text-slate-500 uppercase tracking-wider font-semibold">Active Members</span>
              </div>
              <div>
                <span className="text-2xl font-black font-display dark:text-white text-slate-900 block">₦3.2B+</span>
                <span className="text-[10px] dark:text-slate-300 text-slate-500 uppercase tracking-wider font-semibold">Managed Assets</span>
              </div>
              <div>
                <span className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400 block">5.0%</span>
                <span className="text-[10px] dark:text-slate-300 text-slate-500 uppercase tracking-wider font-semibold">Flat Loan Rate</span>
              </div>
              <div>
                <span className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400 block">18.5%</span>
                <span className="text-[10px] dark:text-slate-300 text-slate-500 uppercase tracking-wider font-semibold">Target Yield</span>
              </div>
            </div>

          </div>

          {/* Right Column: Institutional Trust Card & Protections */}
          <div className="lg:col-span-4">
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
              
              <div className="flex items-center gap-3 pb-3 border-b dark:border-white/10 border-slate-200">
                <div className="w-10 h-10 rounded-xl dark:bg-white/10 bg-emerald-50 text-emerald-500 flex items-center justify-center border dark:border-white/15 border-emerald-200 shadow-inner">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm dark:text-white text-slate-900">Why Join Mosunmola?</h3>
                  <p className="text-[10px] dark:text-slate-400 text-slate-500">Institutional Member Protections</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs dark:text-slate-200 text-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md dark:bg-white/10 bg-emerald-50 text-emerald-500 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="dark:text-white text-slate-900 block font-semibold text-xs">Zero Predatory Collateral</strong>
                    <span className="dark:text-slate-300 text-slate-600 text-[11px] leading-relaxed">Loans up to ₦5,000,000 backed simply by co-member trust and your savings history.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md dark:bg-white/10 bg-emerald-50 text-emerald-500 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="dark:text-white text-slate-900 block font-semibold text-xs">Titled Real Estate Allocation</strong>
                    <span className="dark:text-slate-300 text-slate-600 text-[11px] leading-relaxed">Direct co-ownership in prime Ibeju-Lekki layouts with registered Gazette and C of O.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md dark:bg-white/10 bg-emerald-50 text-emerald-500 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="dark:text-white text-slate-900 block font-semibold text-xs">Audited Annual Dividends</strong>
                    <span className="dark:text-slate-300 text-slate-600 text-[11px] leading-relaxed">Surplus profits from agro processing and investments distributed transparently at every AGM.</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass border dark:border-white/10 border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="dark:text-slate-400 text-slate-500">Society Headquarters:</span>
                  <span className="font-semibold dark:text-white text-slate-900">Ikeja Central, Lagos</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="dark:text-slate-400 text-slate-500">Board President:</span>
                  <span className="font-semibold dark:text-white text-slate-900">Alhaji Moshood Sanusi</span>
                </div>
              </div>

              <button
                onClick={onOpenApplyModal}
                className="liquid-btn liquid-btn-white w-full py-2.5"
              >
                <span>Submit Membership Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
