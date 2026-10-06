import React, { useState, useRef } from 'react';
import { CreditCard, QrCode, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import { navigateToService } from '../../utils/subdomainRouter';

interface PhysicalCardBannerProps {
  onOpenApplyModal?: () => void;
}

export const PhysicalCardBanner: React.FC<PhysicalCardBannerProps> = ({ onOpenApplyModal }) => {
  // 3D Interactive Card Physics Tilt State
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

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
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="liquid-glass-card rounded-4xl p-8 sm:p-12 lg:p-16 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-semibold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <CreditCard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                <span>Statutory Member Identity System</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
                How to Become a Verified<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-white dark:via-slate-200 dark:to-emerald-300">
                  Mosunmola Cooperative Member.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Joining Mosunmola Cooperative is transparent and legally structured under Lagos State Cooperative laws. Every member is issued a unique plastic identity card linked directly to their personal cooperative ledger.
              </p>

              {/* 4 Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {steps.map((s) => (
                  <div key={s.step} className="p-4 rounded-2xl liquid-glass-card border border-slate-200 dark:border-white/10 space-y-1.5 transition-all duration-300 hover:border-emerald-500/40 dark:hover:border-white/20">
                    <div className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                      STEP {s.step}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {s.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onOpenApplyModal}
                  className="liquid-btn liquid-btn-white text-black font-bold py-2.5 px-5 text-xs flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5 text-black" />
                  <span>Register as a Member</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>

                <button
                  onClick={() => navigateToService('members')}
                  className="liquid-btn liquid-btn-default py-2.5 px-5 text-xs flex items-center justify-center gap-2"
                >
                  <span>Already Issued a Card? Member Login</span>
                </button>
              </div>
            </div>

            {/* Right Graphic: Interactive 3D RFID Card Tilt Render */}
            <div className="lg:col-span-5 flex justify-center" style={{ perspective: '1400px' }}>
              <div 
                ref={cardRef}
                onPointerMove={handlePointerMove}
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={handlePointerLeave}
                className="w-full max-w-sm rounded-3xl p-0.5 liquid-glass-card border border-white/20 shadow-2xl transition-transform ease-out cursor-pointer select-none"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isHovered
                    ? `rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg) translateZ(25px) scale(1.02)`
                    : 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)',
                  transitionDuration: isHovered ? '90ms' : '500ms'
                }}
              >
                <div className="bg-[#101010]/95 rounded-[22px] p-6 space-y-5 text-white relative overflow-hidden border border-white/10">
                  {/* Dynamic Holographic Rainbow Sheen */}
                  <div 
                    className="absolute inset-0 holo-sheen transition-opacity duration-300"
                    style={{
                      opacity: isHovered ? 0.75 : 0.3,
                      backgroundPosition: `${tilt.glareX}% ${tilt.glareY}%`
                    }}
                  />

                  {/* Specular Radial Glare */}
                  <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      opacity: isHovered ? 0.45 : 0,
                      background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`
                    }}
                  />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                        <span className="font-display font-black text-xs tracking-wider">MOSUNMOLA</span>
                      </div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-0.5">Official Member Pass</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full liquid-glass border border-white/10 text-emerald-300 text-[10px] font-mono font-bold">
                      SECURE RFID
                    </div>
                  </div>

                  <div className="w-10 h-7 rounded bg-gradient-to-r from-amber-400 to-amber-600 p-1 flex flex-col justify-around shadow-sm relative z-10">
                    <div className="h-0.5 bg-black/40 w-full" />
                    <div className="h-0.5 bg-black/40 w-full" />
                  </div>

                  <div className="font-mono text-xl font-bold tracking-widest text-center py-2 bg-black/80 rounded-xl border border-white/10 text-white shadow-inner relative z-10">
                    MCS-2026-8942
                  </div>

                  <div className="flex justify-between items-end text-xs relative z-10">
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase">Member Name</span>
                      <span className="font-bold text-white">CHIEF ADELEKE BALOGUN</span>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shadow-md">
                      <QrCode className="w-10 h-10 text-black" />
                    </div>
                  </div>

                  <div className="text-[9px] text-center text-slate-400 pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 relative z-10">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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
