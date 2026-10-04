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
    <section className="relative overflow-hidden bg-black text-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-white/10 transition-colors duration-300">
      
      {/* Background Photography (Highly Visible) & Ambient Gradient Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgPosterImage}
          alt="Modern Financial Architecture in Lagos"
          className="w-full h-full object-cover object-center opacity-75 sm:opacity-80 transform scale-105 transition-transform duration-1000"
        />

        {/* Minimal Black & White Vignette to Guarantee Readability while keeping Photo Clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Authentic Institutional Headline & Presentation */}
          <div className="lg:col-span-8 space-y-5 text-center lg:text-left animate-slide-up">
            
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-white font-bold">Lagos State Certified Society</span>
              <span className="text-white/30">•</span>
              <span className="text-slate-300 font-mono text-[11px]">LSCS/2018/8941</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.12]">
              Empowering Members with Disciplined Wealth & <span className="text-slate-100 underline decoration-brand-500/40 decoration-wavy underline-offset-8">Cooperative Freedom.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed drop-shadow-md">
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

              <button
                onClick={() => navigateToService('members')}
                className="liquid-btn liquid-btn-default text-slate-300 hover:text-white"
              >
                <span>Member Login</span>
                <ArrowRight className="w-3 h-3 text-brand-400" />
              </button>
            </div>

            {/* Credibility Stats Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto lg:mx-0 border-t border-white/10 text-left">
              <div>
                <span className="text-2xl font-black font-display text-white block">14,850+</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Active Members</span>
              </div>
              <div>
                <span className="text-2xl font-black font-display text-white block">₦3.2B+</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Managed Assets</span>
              </div>
              <div>
                <span className="text-2xl font-black font-display text-white block">5.0%</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Flat Loan Rate</span>
              </div>
              <div>
                <span className="text-2xl font-black font-display text-white block">18.5%</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Target Yield</span>
              </div>
            </div>

          </div>

          {/* Right Column: Institutional Trust Card & Protections */}
          <div className="lg:col-span-4">
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
              
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/15 shadow-inner">
                  <Building2 className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Why Join Mosunmola?</h3>
                  <p className="text-[10px] text-slate-400">Institutional Member Protections</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-white/10 text-brand-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold text-xs">Zero Predatory Collateral</strong>
                    <span className="text-slate-300 text-[11px] leading-relaxed">Loans up to ₦5,000,000 backed simply by co-member trust and your savings history.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-white/10 text-brand-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold text-xs">Titled Real Estate Allocation</strong>
                    <span className="text-slate-300 text-[11px] leading-relaxed">Direct co-ownership in prime Ibeju-Lekki layouts with registered Gazette and C of O.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-white/10 text-brand-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold text-xs">Audited Annual Dividends</strong>
                    <span className="text-slate-300 text-[11px] leading-relaxed">Surplus profits from agro processing and investments distributed transparently at every AGM.</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Society Headquarters:</span>
                  <span className="font-semibold text-white">Ikeja Central, Lagos</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Board President:</span>
                  <span className="font-semibold text-white">Alhaji Moshood Sanusi</span>
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
