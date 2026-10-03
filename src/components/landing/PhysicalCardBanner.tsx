import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, QrCode, ShieldCheck, ArrowRight, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

export const PhysicalCardBanner: React.FC = () => {
  const { openRegisterModal } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Collect Physical Plastic ID',
      desc: 'Obtain your official RFID-chipped Mosunmola Cooperative Member Card from any designated Secretariat branch in Lagos or Ogun.'
    },
    {
      step: '02',
      title: 'Enter Member ID Number',
      desc: 'Type the 12-character ID (e.g. MCS-2026-8942) found on the front of your card into the activation portal.'
    },
    {
      step: '03',
      title: 'Complete Profile & OTP',
      desc: 'Our system auto-verifies your branch record. Confirm your email, password, and attach your facial photo for your digital wallet pass.'
    },
    {
      step: '04',
      title: 'Digital Card & Wallet Live',
      desc: 'Instantly access your digital card with dynamic QR code, apply for low-interest loans, and track your daily thrift contributions.'
    }
  ];

  return (
    <section className="py-20 bg-[#07192C] text-white border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-[#0F2F4F] to-[#0A2540] rounded-4xl p-8 sm:p-12 lg:p-16 border-2 border-brand-500/20 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5" />
                Physical ID Card Technology
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
                One Physical Card.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">
                  Infinite Cooperative Privileges.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Mosunmola Cooperative bridges the physical and digital divide. Every member is issued a secure, tamper-proof plastic identity card that seamlessly activates their web PWA account.
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

              <div className="pt-4">
                <button
                  onClick={() => openRegisterModal()}
                  className="px-8 py-4 bg-gradient-to-r from-brand-500 to-emerald-400 hover:from-brand-400 hover:to-emerald-300 text-slate-950 font-black text-sm rounded-2xl flex items-center gap-2 shadow-glow transition-all hover:scale-105 active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>Activate Your Card Now</span>
                  <ArrowRight className="w-4 h-4" />
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
