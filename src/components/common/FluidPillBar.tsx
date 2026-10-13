import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { triggerHaptic } from '../../utils/haptics';

export interface FluidTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface FluidPillBarProps {
  tabs: readonly FluidTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  activePillClassName?: string;
  inactiveTabClassName?: string;
}

export const FluidPillBar: React.FC<FluidPillBarProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
  activePillClassName = 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md border border-slate-900/10 dark:border-white/20',
  inactiveTabClassName = 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0
  });

  const updatePill = () => {
    if (!containerRef.current) return;
    const activeButton = containerRef.current.querySelector<HTMLButtonElement>(`[data-tab-id="${activeId}"]`);
    if (activeButton) {
      setPillStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
        opacity: 1
      });
    }
  };

  useLayoutEffect(() => {
    updatePill();
  }, [activeId, tabs]);

  useEffect(() => {
    const handleResize = () => updatePill();
    window.addEventListener('resize', handleResize);
    // Double check after font or layout paint
    const timer = setTimeout(updatePill, 50);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm overflow-x-auto select-none no-scrollbar ${className}`}
    >
      {/* Sliding Fluid Backdrop Pill */}
      <div
        className={`absolute top-1.5 bottom-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${activePillClassName}`}
        style={{
          transform: `translateX(${pillStyle.left}px)`,
          width: `${pillStyle.width}px`,
          opacity: pillStyle.opacity
        }}
      />

      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => {
              triggerHaptic('light');
              onChange(tab.id);
            }}
            className={`relative z-10 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors duration-200 tap-spring ${
              isActive ? 'text-white dark:text-black font-black' : inactiveTabClassName
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
