import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CurtainThemeSwitch: React.FC = () => {
  const { theme, setTheme } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [curtainStage, setCurtainStage] = useState<'idle' | 'closing' | 'closed' | 'opening'>('idle');
  const startYRef = useRef<number>(0);
  const cordRef = useRef<HTMLDivElement>(null);

  const targetTheme = theme === 'dark' ? 'light' : 'dark';

  // Trigger full curtain transition
  const executeCurtainTransition = useCallback(() => {
    if (curtainStage !== 'idle') return;

    setCurtainStage('closing');
    
    // Halfway through animation when curtain covers viewport
    setTimeout(() => {
      setCurtainStage('closed');
      setTheme(targetTheme);

      // Begin opening curtain
      setTimeout(() => {
        setCurtainStage('opening');

        // Reset to idle
        setTimeout(() => {
          setCurtainStage('idle');
          setDragDistance(0);
        }, 500);
      }, 150);
    }, 400);
  }, [curtainStage, targetTheme, setTheme]);

  // Listen for global curtain trigger event from buttons
  useEffect(() => {
    const handleGlobalTrigger = () => {
      executeCurtainTransition();
    };

    window.addEventListener('trigger-curtain-transition', handleGlobalTrigger);
    return () => {
      window.removeEventListener('trigger-curtain-transition', handleGlobalTrigger);
    };
  }, [executeCurtainTransition]);

  // Mouse / Touch Drag Handlers
  const handlePointerDown = (clientY: number) => {
    if (curtainStage !== 'idle') return;
    setIsDragging(true);
    startYRef.current = clientY;
  };

  const handlePointerMove = (clientY: number) => {
    if (!isDragging || curtainStage !== 'idle') return;
    const delta = Math.max(0, clientY - startYRef.current);
    // Add dampening for realistic spring tension
    const dampened = Math.min(180, delta * 0.75);
    setDragDistance(dampened);

    if (dampened >= 120) {
      // Auto trigger if pulled far enough
      setIsDragging(false);
      executeCurtainTransition();
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragDistance > 45) {
      // User pulled enough to trigger
      executeCurtainTransition();
    } else {
      // Snap back cord
      setDragDistance(0);
    }
  };

  // Global mouse move & up listeners during active drag
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientY);
    const onMouseUp = () => handlePointerUp();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handlePointerMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => handlePointerUp();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, dragDistance]);

  const cordExtension = isDragging ? Math.min(dragDistance, 60) : 0;
  const peekProgress = isDragging ? Math.min(dragDistance / 120, 1) : 0;

  return (
    <>
      {/* 1. Hanging Pull Cord / Tassel (Pinned at Top Bar) */}
      <div 
        ref={cordRef}
        className="fixed top-0 right-16 sm:right-28 z-50 select-none flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing group"
        onMouseDown={(e) => handlePointerDown(e.clientY)}
        onTouchStart={(e) => {
          if (e.touches[0]) handlePointerDown(e.touches[0].clientY);
        }}
        onClick={(e) => {
          // If simply clicked without dragging
          if (dragDistance < 10) {
            e.stopPropagation();
            executeCurtainTransition();
          }
        }}
        title={`Drag down or click to switch to ${targetTheme === 'dark' ? 'Dark' : 'Light'} Mode`}
      >
        {/* Mounting Plate at ceiling/top */}
        <div className="w-6 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-b-sm shadow-sm" />
        
        {/* Elastic Cord Line */}
        <div 
          className="w-0.5 bg-gradient-to-b from-amber-300 via-amber-400/80 to-emerald-400 transition-all duration-75 origin-top"
          style={{ height: `${28 + cordExtension}px` }}
        />

        {/* Tassel / Ring Toggle Handle */}
        <div 
          className={`relative p-1.5 rounded-full transition-all duration-200 transform shadow-lg flex items-center justify-center ${
            isDragging 
              ? 'scale-110 ring-2 ring-emerald-400 bg-emerald-600 text-white' 
              : 'group-hover:scale-110 bg-slate-900/90 dark:bg-white/95 text-amber-400 dark:text-slate-900 border border-amber-300/40'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 animate-spin-slow" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
          )}

          {/* Gentle Pulse Glow */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400/20 blur-sm pointer-events-none group-hover:bg-emerald-400/40 transition-colors" />
        </div>

        {/* Hanging Fringe / Tassel Skirt */}
        <div className="w-2.5 h-2 bg-gradient-to-b from-amber-400/80 to-transparent rounded-b-md -mt-0.5 opacity-80" />

        {/* Floating Tooltip Pill */}
        <div className="hidden group-hover:flex items-center gap-1.5 absolute top-14 right-0 translate-x-1/3 whitespace-nowrap bg-black/90 dark:bg-white/95 text-white dark:text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xl border border-white/20 dark:border-black/10 pointer-events-none transition-opacity animate-fade-in z-50">
          <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
          <span>Pull curtain for {targetTheme === 'dark' ? 'Dark' : 'Light'} Mode</span>
        </div>
      </div>

      {/* 2. Drag-peek Curtain Preview (reveals as you drag) */}
      {isDragging && dragDistance > 0 && curtainStage === 'idle' && (
        <div 
          className="fixed inset-x-0 top-0 z-[999] pointer-events-none overflow-hidden transition-none"
          style={{ height: `${dragDistance * 1.8}px` }}
        >
          <div className="w-full h-full bg-gradient-to-b from-slate-900 via-black to-slate-950 dark:from-slate-100 dark:via-white dark:to-slate-200 border-b-4 border-amber-400/80 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-end justify-center pb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 dark:text-amber-700 font-display">
              Release to Switch Theme ↕
            </span>
          </div>
        </div>
      )}

      {/* 3. Full Animated Curtain Screen Sweep */}
      {curtainStage !== 'idle' && (
        <div className="fixed inset-0 z-[1000] pointer-events-auto flex flex-col overflow-hidden">
          
          {/* Main Top Roller / Velvet Curtain Drop */}
          <div 
            className={`w-full h-full relative transition-transform duration-500 ease-out flex flex-col justify-between ${
              curtainStage === 'closing' 
                ? 'translate-y-0' 
                : curtainStage === 'closed'
                ? 'translate-y-0'
                : '-translate-y-full'
            }`}
            style={{
              background: theme === 'dark' 
                ? 'linear-gradient(180deg, #090d16 0%, #030712 50%, #020617 100%)' 
                : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Fabric Pleats Shading (Realistic Draped Folds) */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(0,0,0,0.4) 40px, rgba(255,255,255,0.15) 45px, transparent 50px)'
              }}
            />

            {/* Top Valance / Curtain Rod Header */}
            <div className="w-full py-4 px-6 border-b border-amber-400/40 bg-black/40 backdrop-blur-sm flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-display font-black text-xs tracking-wider text-amber-300">
                  MOSUNMOLA THEME THEATER
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-200/80 tracking-widest uppercase">
                {curtainStage === 'closing' ? 'Drawing Curtain...' : 'Revealing Mode...'}
              </span>
            </div>

            {/* Center Emblem / Crest */}
            <div className="my-auto flex flex-col items-center justify-center text-center p-6 z-10 animate-pulse">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 shadow-2xl mb-3 backdrop-blur-md">
                {targetTheme === 'dark' ? (
                  <Moon className="w-8 h-8 text-indigo-300" />
                ) : (
                  <Sun className="w-8 h-8 text-amber-400" />
                )}
              </div>
              <h3 className="font-display font-black text-xl text-white dark:text-slate-900 tracking-tight">
                Switching to {targetTheme === 'dark' ? 'Dark Obsidian' : 'Clean Light'}
              </h3>
              <p className="text-xs text-amber-200/90 dark:text-amber-800 font-medium mt-1">
                Lagos State Certified Cooperative Society
              </p>
            </div>

            {/* Bottom Embroidered Fringe & Gold Trim with Tassels */}
            <div className="w-full relative z-10">
              {/* Gold Embroidered Border */}
              <div className="h-3 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 border-t border-b border-amber-600/50 shadow-md" />
              {/* Tassel Fringe row */}
              <div 
                className="h-4 w-full opacity-90"
                style={{
                  background: 'repeating-linear-gradient(90deg, #d97706, #d97706 6px, transparent 6px, transparent 10px)'
                }}
              />
            </div>

          </div>

        </div>
      )}
    </>
  );
};
