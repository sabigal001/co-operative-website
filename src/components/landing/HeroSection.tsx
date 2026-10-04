import React, { useState } from 'react';
import { 
  ArrowRight, 
  Building2, 
  ChevronRight,
  Play,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';

interface HeroSectionProps {
  onOpenApplyModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenApplyModal }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Background video URL & photography
  const videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-business-team-in-a-meeting-working-on-a-financial-report-42540-large.mp4";
  const bgPosterImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85";

  return (
    <section className="relative overflow-hidden bg-black text-white pt-14 pb-20 lg:pt-24 lg:pb-28 border-b border-white/10">
      
      {/* Background Photography (Highly Visible) & Ambient Gradient Layer */}
      <div className="absolute inset-0 z-0">
        {/* Background Image / Poster with High Visibility */}
        <img
          src={bgPosterImage}
          alt="Modern Financial Architecture in Lagos"
          className="w-full h-full object-cover object-center opacity-75 sm:opacity-80 transform scale-105 transition-transform duration-1000"
        />

        {/* Optional Ambient Video Background */}
        {isVideoPlaying && (
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {/* Crisp Gradient Vignette to Guarantee Readability while keeping Photo Clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Authentic Institutional Headline & Presentation */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-brand-400 font-bold">Lagos State Certified Society</span>
              <span className="text-white/40">•</span>
              <span className="text-slate-200">Reg No: LSCS/2018/8941</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.12]">
              Empowering Members with Disciplined Wealth & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-green-300">Cooperative Freedom.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed drop-shadow-md">
              <strong>Mosunmola Cooperative Multipurpose Society</strong> is a premier statutory credit and thrift institution. We help forward-thinking professionals, civil servants, and entrepreneurs achieve financial sovereignty through collective capital, 5% low-interest member loans, high-yield thrift, and verified asset co-ownership.
            </p>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenApplyModal}
                className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-400 text-black font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-glow hover:scale-105 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4 text-black" />
                <span>Apply for Membership</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#products"
                className="w-full sm:w-auto px-6 py-4 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-2xl border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all"
              >
                <span>Explore Financial Solutions</span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </a>

              {/* Video Tour Toggle */}
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="w-full sm:w-auto px-4 py-4 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="Toggle background video"
              >
                <Play className="w-3.5 h-3.5 text-brand-400" />
                <span>{isVideoPlaying ? 'Pause Ambient Video' : 'Play Ambient Video'}</span>
              </button>
            </div>

            {/* Existing Member Portal Prompt */}
            <div className="pt-2 text-xs text-slate-300 flex items-center justify-center lg:justify-start gap-1.5">
              <span>Already an approved member?</span>
              <button
                onClick={() => navigateToService('members')}
                className="font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
              >
                Access Member Web Portal <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Credibility Stats Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto lg:mx-0 border-t border-white/15 text-left">
              <div>
                <span className="text-2xl sm:text-3xl font-black font-display text-white block">14,850+</span>
                <span className="text-[11px] text-slate-300 uppercase font-medium">Active Members</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black font-display text-brand-400 block">₦3.2B+</span>
                <span className="text-[11px] text-slate-300 uppercase font-medium">Managed Assets</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black font-display text-emerald-400 block">5.0%</span>
                <span className="text-[11px] text-slate-300 uppercase font-medium">Flat Loan Rate</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black font-display text-brand-400 block">18.5%</span>
                <span className="text-[11px] text-slate-300 uppercase font-medium">Target Thrift Yield</span>
              </div>
            </div>

          </div>

          {/* Right Column: Institutional Trust Card & Protections */}
          <div className="lg:col-span-4">
            <div className="bg-black/75 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-white/15 shadow-2xl space-y-6">
              
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">Why Join Mosunmola?</h3>
                  <p className="text-[11px] text-slate-400">Key Member Protections</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-brand-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Zero Predatory Collateral</strong>
                    <span className="text-slate-300">Loans up to ₦5,000,000 backed simply by co-member trust and your savings history.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-brand-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Titled Real Estate Allocation</strong>
                    <span className="text-slate-300">Direct co-ownership in prime Ibeju-Lekki layouts with registered Gazette and C of O.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-brand-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Audited Annual Dividends</strong>
                    <span className="text-slate-300">Surplus profits from agro processing and investments distributed transparently at every AGM.</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Society Headquarters:</span>
                  <span className="font-semibold text-white">Ikeja Central, Lagos</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Board President:</span>
                  <span className="font-semibold text-brand-400">Alhaji Moshood Sanusi</span>
                </div>
              </div>

              <button
                onClick={onOpenApplyModal}
                className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-glow"
              >
                <span>Submit Membership Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
