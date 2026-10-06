import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

// 1. Interactive Hanging Pull Cord / Tassel Component
export const CurtainPullCord: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const startYRef = useRef<number>(0);
  const cordRef = useRef<HTMLDivElement>(null);

  const targetTheme = theme === 'dark' ? 'light' : 'dark';

  const triggerCurtain = useCallback(() => {
    triggerHaptic('medium');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-curtain-transition'));
    }
  }, []);

  const handlePointerDown = (clientY: number) => {
    setIsDragging(true);
    startYRef.current = clientY;
  };

  const handlePointerMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const delta = Math.max(0, clientY - startYRef.current);
    const dampened = Math.min(160, delta * 0.7);
    setDragDistance(dampened);

    if (dampened >= 100) {
      setIsDragging(false);
      setDragDistance(0);
      triggerCurtain();
    }
  }, [isDragging, triggerCurtain]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDistance > 40) {
      triggerCurtain();
    }
    setDragDistance(0);
  }, [isDragging, dragDistance, triggerCurtain]);

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
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const cordExtension = isDragging ? Math.min(dragDistance, 50) : 0;

  return (
    <div
      ref={cordRef}
      className={`relative select-none flex flex-col items-center cursor-grab active:cursor-grabbing group z-20 ${className}`}
      onMouseDown={(e) => handlePointerDown(e.clientY)}
      onTouchStart={(e) => {
        if (e.touches[0]) handlePointerDown(e.touches[0].clientY);
      }}
      onClick={(e) => {
        if (dragDistance < 8) {
          e.stopPropagation();
          triggerCurtain();
        }
      }}
      title={`Drag down or click to switch to ${targetTheme === 'dark' ? 'Dark' : 'Light'} Mode`}
    >
      {/* Small ceiling mounting bracket */}
      <div className="w-5 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-sm shadow-xs" />

      {/* Elastic cord line */}
      <div 
        className="w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-emerald-400 transition-all duration-75 origin-top"
        style={{ height: `${20 + cordExtension}px` }}
      />

      {/* Tassel / Ring bead */}
      <div 
        className={`relative p-1.5 rounded-full transition-all duration-200 transform shadow-md flex items-center justify-center ${
          isDragging 
            ? 'scale-110 ring-2 ring-emerald-400 bg-emerald-600 text-white' 
            : 'group-hover:scale-110 bg-slate-900 dark:bg-white text-amber-400 dark:text-slate-900 border border-amber-300/40'
        }`}
      >
        {theme === 'dark' ? (
          <Sun className="w-3.5 h-3.5 animate-spin-slow text-amber-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
        )}

        <span className="absolute -inset-1 rounded-full bg-emerald-400/20 blur-xs pointer-events-none group-hover:bg-emerald-400/40 transition-colors" />
      </div>

      {/* Hanging Fringe Skirt */}
      <div className="w-2 h-1.5 bg-gradient-to-b from-amber-400/80 to-transparent rounded-b-sm -mt-0.5 opacity-80" />

      {/* Floating Tooltip */}
      <div className="hidden group-hover:flex items-center gap-1 absolute -bottom-8 right-0 whitespace-nowrap bg-black/90 dark:bg-white/95 text-white dark:text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xl border border-white/20 dark:border-black/10 pointer-events-none transition-opacity animate-fade-in z-50">
        <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
        <span>Switch to {targetTheme === 'dark' ? 'Dark' : 'Light'}</span>
      </div>
    </div>
  );
};

// 2. Global Full-Screen Animated Curtain Screen Wipe
export const CurtainThemeSwitch: React.FC = () => {
  const { theme, setTheme } = useApp();
  const [curtainStage, setCurtainStage] = useState<'idle' | 'closing' | 'closed' | 'opening'>('idle');

  const targetTheme = theme === 'dark' ? 'light' : 'dark';

  const executeCurtainTransition = useCallback(() => {
    if (curtainStage !== 'idle') return;

    setCurtainStage('closing');
    
    // Halfway through animation when curtain fully covers viewport
    setTimeout(() => {
      setCurtainStage('closed');
      setTheme(targetTheme);
      triggerHaptic('selection');

      // Begin opening curtain
      setTimeout(() => {
        setCurtainStage('opening');

        // Reset to idle
        setTimeout(() => {
          setCurtainStage('idle');
        }, 500);
      }, 150);
    }, 400);
  }, [curtainStage, targetTheme, setTheme]);

  // Listen for global curtain trigger event
  useEffect(() => {
    const handleGlobalTrigger = () => {
      executeCurtainTransition();
    };

    window.addEventListener('trigger-curtain-transition', handleGlobalTrigger);
    return () => {
      window.removeEventListener('trigger-curtain-transition', handleGlobalTrigger);
    };
  }, [executeCurtainTransition]);

  if (curtainStage === 'idle') return null;

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-auto flex flex-col overflow-hidden">
      {/* Main Top Roller / Velvet Curtain Drop */}
      <div 
        className={`w-full h-full relative transition-transform duration-500 ease-out flex flex-col justify-between ${
          curtainStage === 'closing' || curtainStage === 'closed'
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
          <div className="h-3 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 border-t border-b border-amber-600/50 shadow-md" />
          <div 
            className="h-4 w-full opacity-90"
            style={{
              background: 'repeating-linear-gradient(90deg, #d97706, #d97706 6px, transparent 6px, transparent 10px)'
            }}
          />
        </div>

      </div>
    </div>
  );
};
