import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  CreditCard, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  CheckCircle2, 
  Sparkles, 
  Download,
  Users,
  ChevronRight
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { openRegisterModal, triggerInstallPrompt, setCurrentPortal } = useApp();

  return (
    <section className="relative overflow-hidden bg-mesh-green text-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-white/10">
      {/* Decorative ambient circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Active Members Trust Pill (Chowdeck style) */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-ping" />
              <span className="text-brand-300 font-bold">14,850+ Verified Members</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-200">₦3.2B+ Total Volume Handled</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.1]">
              Smart Wealth, Target Thrift & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-amber-300">Cooperative Freedom.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Mosunmola Cooperative Multipurpose Society empowers you with 
              <strong className="text-white font-semibold"> 18.5% annual thrift dividends</strong>, 
              zero-collateral member loans at a flat 5% rate, and verified asset co-ownership.
            </p>

            {/* Main Action Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => openRegisterModal()}
                className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-glow hover:scale-105 active:scale-95 transition-all"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>Activate Physical Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPortal('member')}
                className="w-full sm:w-auto px-6 py-4 bg-[#0F2F4F] hover:bg-[#133557] text-white font-bold text-sm rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-all hover:border-brand-500/40"
              >
                <span>Launch Member PWA</span>
                <ChevronRight className="w-4 h-4 text-brand-400" />
              </button>

              <button
                onClick={triggerInstallPrompt}
                className="w-full sm:w-auto px-4 py-4 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-brand-400" />
                <span>Install App</span>
              </button>
            </div>

            {/* Quick Guarantees Badge List */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Zero Collateral Needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Government Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Instant Receipt PDF</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Interactive Showcase Cards (Chowdeck vibe) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              
              {/* Main Card: Virtual Physical Member Card Preview */}
              <div className="relative bg-gradient-to-br from-[#0F2F4F] via-[#0A2540] to-[#061626] rounded-3xl p-6 border-2 border-brand-500/30 shadow-2xl overflow-hidden group hover:border-brand-400 transition-all">
                {/* Hologram metallic sheen */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-500 text-slate-950 font-black flex items-center justify-center text-xs">
                      M
                    </div>
                    <div>
                      <span className="font-display font-black text-xs text-white tracking-wider block">MOSUNMOLA</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest">Cooperative Society</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500 text-slate-950 shadow-glow">
                    ACTIVE ID
                  </span>
                </div>

                {/* EMV Microchip graphic */}
                <div className="w-11 h-8 rounded-lg bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 border border-amber-500/40 mb-4 p-1 flex flex-col justify-between shadow-inner">
                  <div className="w-full h-0.5 bg-amber-600/30" />
                  <div className="w-full h-0.5 bg-amber-600/30" />
                </div>

                <div className="font-mono text-lg sm:text-xl font-black text-white tracking-widest mb-4">
                  MCS-2026-8942
                </div>

                <div className="flex items-end justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Member Name</span>
                    <span className="font-bold text-white text-sm">CHIEF ADELEKE BALOGUN</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Branch</span>
                    <span className="font-semibold text-brand-300">IKEJA SECRETARIAT</span>
                  </div>
                </div>
              </div>

              {/* Floating Pill 1: Live ROI yield */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-[#07192C] text-white px-4 py-3 rounded-2xl border border-brand-500/40 shadow-xl flex items-center gap-3 animate-float backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Target Thrift ROI</span>
                  <span className="text-sm font-extrabold text-brand-400">+18.5% Per Annum</span>
                </div>
              </div>

              {/* Floating Pill 2: Instant Loan Pre-approved */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#07192C] text-white px-4 py-3 rounded-2xl border border-amber-500/40 shadow-xl flex items-center gap-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Member Loan Benefit</span>
                  <span className="text-sm font-extrabold text-white">Up to ₦5,000,000 (5%)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
