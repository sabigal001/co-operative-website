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
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'toBack' | 'toFront' | null>(null);
  const [copied, setCopied] = useState(false);

  // 3D Interactive Card Physics Tilt State
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTouchHandledRef = useRef<number>(0);

  // Passive Gyroscope / DeviceOrientation Listener for subtle 3D parallax on mobile
  React.useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!isHovered && e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right [-90, 90], beta: front-to-back [-180, 180]
        const rotateY = Math.max(-8, Math.min(8, (e.gamma / 35) * 8));
        const rotateX = Math.max(-8, Math.min(8, ((e.beta - 40) / 35) * -8));
        const glareX = 50 + rotateY * 3;
        const glareY = 50 - rotateX * 3;
        setTilt({ rotateX, rotateY, glareX, glareY });
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, [isHovered]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle mouse/pen pointer events; touch is handled separately by onTouchMove
    if (e.pointerType === 'touch') return;
    if (isFlipping || !cardRef.current) return;
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

  // Mobile Touch Gestures: Drag to tilt, Swipe to flip 3D
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isFlipping) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    setIsHovered(true);

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = Math.max(-14, Math.min(14, ((y - centerY) / centerY) * -12));
      const rotateY = Math.max(-14, Math.min(14, ((x - centerX) / centerX) * 12));
      const glareX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const glareY = Math.max(0, Math.min(100, (y / rect.height) * 100));
      setTilt({ rotateX, rotateY, glareX, glareY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isFlipping || !cardRef.current) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = Math.max(-14, Math.min(14, ((y - centerY) / centerY) * -12));
    const rotateY = Math.max(-14, Math.min(14, ((x - centerX) / centerX) * 12));
    const glareX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const glareY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const duration = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // Detect horizontal swipe (at least 30px horizontal and predominantly horizontal)
    const isHorizontalSwipe = Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 0.7;
    const isTap = Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15 && duration < 350;

    if (isHorizontalSwipe || isTap) {
      lastTouchHandledRef.current = Date.now();
      handleFlip();
    }

    // Smoothly restore neutral tilt after release
    setTimeout(() => {
      setIsHovered(false);
      setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    }, 400);
  };

  const handleClick = () => {
    // Prevent synthetic touch-click double triggers on mobile
    if (Date.now() - lastTouchHandledRef.current < 600) return;
    handleFlip();
  };

  const handleFlip = () => {
    if (isFlipping) return;
    triggerHaptic('medium');
    const nextFlipped = !isFlipped;
    setFlipDirection(nextFlipped ? 'toBack' : 'toFront');
    setIsFlipping(true);
    setIsFlipped(nextFlipped);

    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 700);
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
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleFlip}
            className="liquid-btn liquid-btn-default py-1.5 px-3 text-xs flex items-center gap-1.5 tap-spring flex-1 sm:flex-initial justify-center"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Show Front' : 'Flip 3D'}</span>
          </button>

          <button
            onClick={copyCardId}
            className="liquid-btn liquid-btn-default py-1.5 px-3 text-xs flex items-center gap-1.5 tap-spring flex-1 sm:flex-initial justify-center"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy ID'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="liquid-btn liquid-btn-white text-black font-bold py-1.5 px-3 text-xs flex items-center gap-1.5 tap-spring flex-1 sm:flex-initial justify-center"
          >
            <Printer className="w-3.5 h-3.5 text-black" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 3D Flippable Card Container with Interactive Tilt & Holographic Sheen */}
      <div 
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{ perspective: '1500px', touchAction: 'pan-y' }}
        className="max-w-lg mx-auto cursor-pointer select-none group touch-pan-y"
      >
        <div
          className={`relative w-full aspect-[1.586/1] min-h-[220px] sm:min-h-[250px] rounded-2xl sm:rounded-3xl shadow-2xl ${
            isFlipping
              ? (flipDirection === 'toBack' ? 'animate-card-flip-back' : 'animate-card-flip-front')
              : 'transition-transform ease-out'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipping
              ? undefined
              : (isFlipped 
                  ? `rotateY(${180 + tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`
                  : `rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`),
            transitionDuration: isFlipping ? undefined : (isHovered ? '90ms' : '500ms')
          }}
        >
          {/* ================= CARD FRONT ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-white overflow-hidden bg-black border border-white/20 shadow-2xl flex flex-col justify-between"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(1px)'
            }}
          >
            {/* Dynamic Holographic Rainbow Sheen */}
            <div 
              className="absolute inset-0 holo-sheen transition-opacity duration-300 pointer-events-none"
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
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl liquid-glass border border-white/15 p-0.5 shadow-sm">
                  <div className="w-full h-full bg-black/80 rounded-[6px] sm:rounded-[10px] flex items-center justify-center font-display font-black text-xs sm:text-sm text-white">
                    M
                  </div>
                </div>
                <div>
                  <span className="font-display font-black text-[11px] sm:text-sm tracking-wider text-white block leading-tight">
                    MOSUNMOLA COOPERATIVE
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                    Multipurpose Society Ltd.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 liquid-glass text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OFFICIAL PASS</span>
              </div>
            </div>

            {/* Middle: Microchip & Card Number */}
            <div className="relative z-10 my-auto py-1 sm:py-0">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                {/* Gold Microchip Graphic */}
                <div className="w-9 h-6 sm:w-11 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 border border-amber-500/60 p-0.5 sm:p-1 flex flex-col justify-around shadow-inner">
                  <div className="h-0.5 bg-amber-800/40 w-full" />
                  <div className="h-0.5 bg-amber-800/40 w-full" />
                </div>

                {/* Contactless symbol */}
                <div className="flex items-center text-slate-400">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                    <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                    <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                  </svg>
                </div>
              </div>

              <div className="font-mono text-base sm:text-2xl font-extrabold text-white tracking-wider sm:tracking-widest">
                {member.memberId}
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wider">
                ID NO. • VALIDATED
              </span>
            </div>

            {/* Bottom Row: Member Photo, Name, and Dynamic QR */}
            <div className="flex items-end justify-between relative z-10 pt-1.5 sm:pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={member.avatar}
                  alt={member.fullName}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover border-2 border-brand-500 ring-2 ring-brand-500/30 shadow-md shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                    MEMBER NAME
                  </span>
                  <span className="font-bold text-white text-[11px] sm:text-sm uppercase tracking-wide block truncate max-w-[130px] sm:max-w-[180px]">
                    {member.fullName}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-brand-400 font-mono">
                    Joined: {member.joinDate}
                  </span>
                </div>
              </div>

              {/* Dynamic QR Code box */}
              <div className="bg-white p-1 rounded-lg sm:rounded-xl shadow-lg flex flex-col items-center shrink-0">
                <QrCode className="w-8 h-8 sm:w-11 sm:h-11 text-slate-950" />
                <span className="text-[7px] sm:text-[8px] font-mono font-bold text-slate-900 mt-0.5">
                  SECURE PASS
                </span>
              </div>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-white overflow-hidden bg-gradient-to-bl from-neutral-900 via-zinc-950 to-black border border-white/20 shadow-2xl flex flex-col justify-between"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(1px)'
            }}
          >
            {/* Magnetic Stripe */}
            <div className="-mx-4 sm:-mx-7 -mt-1 sm:-mt-2 h-9 sm:h-12 bg-slate-950 border-y border-white/10" />

            {/* Signature & Security Panel */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/90 text-slate-900 font-serif italic text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-right truncate">
                  {member.fullName}
                </div>
                <div className="bg-slate-800 text-white font-mono text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-white/10 font-bold shrink-0">
                  CVV 894
                </div>
              </div>
              <p className="text-[8px] sm:text-[9px] text-slate-400 leading-tight">
                Authorized Signature. Not transferable. This card remains the property of Mosunmola Cooperative Multipurpose Society.
              </p>
            </div>

            {/* Statutory Details & Helpline */}
            <div className="text-[9px] sm:text-[10px] text-slate-400 border-t border-white/10 pt-2 sm:pt-3 space-y-0.5 sm:space-y-1">
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

      {/* Mobile Touch & Swipe Guide */}
      <div className="flex sm:hidden items-center justify-center gap-2 mt-4 text-slate-500 dark:text-slate-400 text-[11px] font-medium bg-slate-100 dark:bg-white/5 py-2 px-4 rounded-full max-w-xs mx-auto border border-slate-200 dark:border-white/10">
        <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400 shrink-0" />
        <span>Swipe horizontally or tap to flip 3D • Drag to tilt</span>
      </div>
    </div>
  );
};
