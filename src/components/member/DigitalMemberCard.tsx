import React, { useState, useRef } from 'react';
import type { MemberProfile } from '../../types';
import { 
  CreditCard, 
  QrCode, 
  RotateCw, 
  Download, 
  Printer, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

interface DigitalMemberCardProps {
  member: MemberProfile;
}

export const DigitalMemberCard: React.FC<DigitalMemberCardProps> = ({ member }) => {
  const { showToast } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

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

    const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg tilt
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const handleFlip = () => {
    triggerHaptic('medium');
    setIsFlipped(!isFlipped);
  };

  const copyCardId = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(member.memberId);
    setCopied(true);
    showToast(`Copied ${member.memberId} to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    triggerHaptic('light');
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
              Digital Membership Pass
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider liquid-glass text-emerald-400 border border-white/10">
              {member.status === 'active' ? 'Active & Verified' : 'Pending KYC'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically signed virtual counterpart of your physical RFID card. Move cursor/touch to inspect holographic security foil.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFlip}
            className="liquid-btn liquid-btn-default py-1.5 px-3 text-xs flex items-center gap-1.5 tap-spring"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Show Front' : 'Flip Card 3D'}</span>
          </button>

          <button
            onClick={copyCardId}
            className="liquid-btn liquid-btn-default py-1.5 px-3 text-xs flex items-center gap-1.5 tap-spring"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy ID'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="liquid-btn liquid-btn-white text-black font-bold py-1.5 px-3 text-xs flex items-center gap-1.5 tap-spring"
          >
            <Printer className="w-3.5 h-3.5 text-black" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* 3D Flippable Card Container with Interactive Tilt & Holographic Sheen */}
      <div 
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onClick={handleFlip}
        className="perspective-1000 max-w-lg mx-auto cursor-pointer select-none group"
      >
        <div
          className="relative w-full aspect-[1.586/1] rounded-3xl transform-style-3d shadow-2xl transition-transform ease-out"
          style={{
            transform: isFlipped 
              ? `rotateY(${180 + tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`
              : `rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`,
            transitionDuration: isHovered ? '75ms' : '500ms'
          }}
        >
          {/* ================= CARD FRONT ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-7 text-white overflow-hidden bg-black border border-white/20 shadow-2xl flex flex-col justify-between"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Dynamic Holographic Rainbow Sheen */}
            <div 
              className="absolute inset-0 holo-sheen transition-opacity duration-300"
              style={{
                opacity: isHovered ? 0.75 : 0.3,
                backgroundPosition: `${tilt.glareX}% ${tilt.glareY}%`
              }}
            />

            {/* Specular Radial Light Reflection following cursor */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 0.45 : 0,
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.4) 0%, transparent 60%)`
              }}
            />

            {/* Top Bar: Brand, Logo & Status Badge */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl liquid-glass border border-white/15 p-0.5 shadow-sm">
                  <div className="w-full h-full bg-black/80 rounded-[10px] flex items-center justify-center font-display font-black text-sm text-white">
                    M
                  </div>
                </div>
                <div>
                  <span className="font-display font-black text-xs sm:text-sm tracking-wider text-white block">
                    MOSUNMOLA COOPERATIVE
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                    Multipurpose Society Ltd.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 liquid-glass text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OFFICIAL PASS</span>
              </div>
            </div>

            {/* Middle: Microchip & Card Number */}
            <div className="relative z-10 my-auto">
              <div className="flex items-center justify-between mb-2">
                {/* Gold Microchip Graphic */}
                <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-500/60 p-1 flex flex-col justify-around shadow-inner">
                  <div className="h-0.5 bg-amber-800/40 w-full" />
                  <div className="h-0.5 bg-amber-800/40 w-full" />
                </div>

                {/* Contactless symbol */}
                <div className="flex items-center text-slate-400">
                  <svg className="w-6 h-6 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                    <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                    <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                  </svg>
                </div>
              </div>

              <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest drop-shadow">
                {member.memberId}
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                ID NO. • VALIDATED
              </span>
            </div>

            {/* Bottom Row: Member Photo, Name, and Dynamic QR */}
            <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.fullName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-brand-500 ring-2 ring-brand-500/30 shadow-md"
                />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                    MEMBER NAME
                  </span>
                  <span className="font-bold text-white text-xs sm:text-sm uppercase tracking-wide block truncate max-w-[180px]">
                    {member.fullName}
                  </span>
                  <span className="text-[10px] text-brand-400 font-mono">
                    Joined: {member.joinDate}
                  </span>
                </div>
              </div>

              {/* Dynamic QR Code box */}
              <div className="bg-white p-1 rounded-xl shadow-lg flex flex-col items-center">
                <QrCode className="w-11 h-11 text-slate-950" />
                <span className="text-[8px] font-mono font-bold text-slate-900 mt-0.5">
                  SECURE PASS
                </span>
              </div>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-7 text-white overflow-hidden bg-gradient-to-bl from-neutral-900 via-zinc-950 to-black border border-white/20 shadow-2xl flex flex-col justify-between"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Magnetic Stripe */}
            <div className="-mx-6 sm:-mx-7 -mt-2 h-12 bg-slate-950 border-y border-white/10" />

            {/* Signature & Security Panel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/90 text-slate-900 font-serif italic text-sm px-4 py-1.5 rounded-lg text-right">
                  {member.fullName}
                </div>
                <div className="bg-slate-800 text-white font-mono text-xs px-2.5 py-1.5 rounded-lg border border-white/10 font-bold">
                  CVV 894
                </div>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight">
                Authorized Signature. Not transferable. This card remains the property of Mosunmola Cooperative Multipurpose Society.
              </p>
            </div>

            {/* Statutory Details & Helpline */}
            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-3 space-y-1">
              <div className="flex justify-between">
                <span>Lagos State Reg No:</span>
                <span className="font-mono text-slate-200">LSCS/2018/8941</span>
              </div>
              <div className="flex justify-between">
                <span>Secretariat Hotline:</span>
                <span className="text-white font-mono">+234 (1) 489-0021</span>
              </div>
              <div className="flex justify-between">
                <span>Branch Secretariat:</span>
                <span className="text-white font-medium">Ikeja Central, Lagos</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
