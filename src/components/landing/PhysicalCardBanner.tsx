import React from 'react';
import { CreditCard, QrCode, ShieldCheck, ArrowRight, UserPlus, Sparkles, Building2 } from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';

interface PhysicalCardBannerProps {
  onOpenApplyModal?: () => void;
}

export const PhysicalCardBanner: React.FC<PhysicalCardBannerProps> = ({ onOpenApplyModal }) => {

  const steps = [
    {
      step: '01',
      title: 'Submit Online Application',
      desc: 'Complete the prospective membership form with your identification, monthly savings target, and preferred branch.'
    },
    {
      step: '02',
      title: 'Board Review & Approval',
      desc: 'The Executive Committee and Super Admin review your credentials and allocate your verified RFID card ID.'
    },
    {
      step: '03',
      title: 'Collect Physical Member Card',
      desc: 'Obtain your physical tamper-proof membership card at any designated Secretariat in Lagos or Ogun State.'
    },
    {
      step: '04',
      title: 'Unlock Wealth & 5% Loans',
      desc: 'Sign into the Member Web App (members.mosunmolacoop.com) for target savings, thrift dividends, and low-interest credit.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#07192C] text-white border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-[#0F2F4F] to-[#0A2540] rounded-4xl p-8 sm:p-12 lg:p-16 border-2 border-brand-500/20 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5" />
                Statutory Member Identity System
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
                How to Become a Verified<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">
                  Mosunmola Cooperative Member.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Joining Mosunmola Cooperative is transparent and legally structured under Lagos State Cooperative laws. Every member is issued a unique plastic identity card linked directly to their personal cooperative ledger.
              </p>

              {/* 4 Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {steps.map((s) => (
                  <div key={s.step} className="p-4 rounded-2xl bg-[#061626]/70 border border-white/5 space-y-1.5">
                    <div className="text-xs font-mono font-black text-brand-400">
                      STEP {s.step}
                    </div>
                    <div className="text-sm font-bold text-white">
                      {s.title}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={onOpenApplyModal}
                  className="px-8 py-4 bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-glow transition-all hover:scale-105 active:scale-95"
                >
                  <UserPlus className="w-4 h-4 text-slate-950" />
                  <span>Register as a Member</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateToService('members')}
                  className="px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-bold rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Already Issued a Card? Member Login</span>
                </button>
              </div>
            </div>

            {/* Right Graphic: Physical Card Holographic Render */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-[#0A2540] p-1 shadow-2xl">
                <div className="bg-[#0A2540] rounded-[22px] p-6 space-y-5 text-white relative overflow-hidden">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-brand-400" />
                        <span className="font-display font-black text-xs tracking-wider">MOSUNMOLA COOP</span>
                      </div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block">Official Member Pass</span>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 text-[10px] font-mono font-bold border border-brand-500/30">
                      SECURE RFID
                    </div>
                  </div>

                  <div className="w-10 h-7 rounded bg-gradient-to-r from-amber-300 to-amber-500 p-1 flex flex-col justify-around">
                    <div className="h-0.5 bg-amber-700/40 w-full" />
                    <div className="h-0.5 bg-amber-700/40 w-full" />
                  </div>

                  <div className="font-mono text-xl font-bold tracking-widest text-center py-2 bg-[#061626]/80 rounded-xl border border-white/5 text-brand-300">
                    MCS-2026-8942
                  </div>

                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Member Name</span>
                      <span className="font-bold text-white">CHIEF ADELEKE BALOGUN</span>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-slate-950" />
                    </div>
                  </div>

                  <div className="text-[9px] text-center text-slate-400 pt-2 border-t border-white/10 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                    <span>Lagos State Registered Society LSCS/2018/8941</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
