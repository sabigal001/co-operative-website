import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

interface CarbonNode {
  id: number;
  label: string;
  numberLtoR?: number;
  numberRtoL?: number;
  correctNumber?: number;
  isParentChain?: boolean;
  substituent?: string;
  isFunctionalGroup?: boolean;
}

interface MoleculeRendererProps {
  condensedFormula: string;
  iupacName?: string;
  nodes?: CarbonNode[];
  activeStepFocus?: 'functional_group' | 'parent_chain' | 'numbering' | 'substituents' | 'locants' | 'assembly' | 'final';
  numberingDirection?: 'left-to-right' | 'right-to-left' | 'iupac';
  showNumbering?: boolean;
  compact?: boolean;
}

export const MoleculeRenderer: React.FC<MoleculeRendererProps> = ({
  condensedFormula,
  iupacName,
  nodes,
  activeStepFocus,
  numberingDirection = 'iupac',
  showNumbering = true,
  compact = false
}) => {
  // Parse condensed formula into readable badges if no detailed nodes are supplied
  const renderSimpleFormula = () => {
    // If formula has brackets like [OH] or [CH3], render them highlighted
    const parts = condensedFormula.split(/(\[[^\]]+\])/g);

    return (
      <div className="font-mono text-base sm:text-xl font-bold tracking-wider text-slate-800 dark:text-slate-100 flex flex-wrap items-center justify-center gap-1">
        {parts.map((part, idx) => {
          if (part.startsWith('[') && part.endsWith(']')) {
            const clean = part.slice(1, -1);
            return (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/40 shadow-sm animate-pulse"
              >
                {clean}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className={`w-full rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/90 dark:to-slate-950 p-4 md:p-6 transition-all ${
      compact ? 'py-3' : 'shadow-inner'
    }`}>
      
      {/* Top Banner / Formula Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5 text-emerald-500" />
          Structural View
        </span>
        {iupacName && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            {iupacName}
          </span>
        )}
      </div>

      {/* Main Structural Display */}
      {nodes && nodes.length > 0 ? (
        <div className="flex flex-col items-center justify-center py-2 overflow-x-auto">
          {/* Node Chain */}
          <div className="flex items-center justify-center min-w-max gap-2 sm:gap-3 py-4 px-2">
            {nodes.map((node, index) => {
              // Determine numbering to show
              let numberToShow = node.correctNumber;
              if (numberingDirection === 'left-to-right') numberToShow = node.numberLtoR;
              if (numberingDirection === 'right-to-left') numberToShow = node.numberRtoL;

              // Color styles based on active step focus
              let isHighlighted = false;
              let highlightStyle = 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-300 dark:border-slate-700';

              if (activeStepFocus === 'functional_group' && node.isFunctionalGroup) {
                isHighlighted = true;
                highlightStyle = 'bg-purple-500 text-white border-purple-400 ring-4 ring-purple-500/30 shadow-lg';
              } else if (activeStepFocus === 'parent_chain' && node.isParentChain) {
                isHighlighted = true;
                highlightStyle = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/20 shadow-lg';
              } else if (activeStepFocus === 'numbering') {
                isHighlighted = true;
                highlightStyle = 'bg-teal-500 text-white border-teal-300 shadow-md';
              } else if (activeStepFocus === 'substituents' && node.substituent) {
                isHighlighted = true;
                highlightStyle = 'bg-amber-500 text-white border-amber-300 ring-4 ring-amber-500/30 shadow-lg';
              } else if (node.isParentChain) {
                highlightStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-emerald-500/40';
              }

              return (
                <React.Fragment key={node.id}>
                  <div className="flex flex-col items-center group relative">
                    
                    {/* Top Branch (if substituent exists) */}
                    {node.substituent ? (
                      <div className="mb-2 flex flex-col items-center animate-bounce duration-1000">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 whitespace-nowrap shadow-sm">
                          {node.substituent}
                        </span>
                        <div className="w-0.5 h-3 bg-amber-400 dark:bg-amber-600"></div>
                      </div>
                    ) : (
                      <div className="h-8"></div>
                    )}

                    {/* Carbon Node Bead */}
                    <div 
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-sm sm:text-base border-2 transition-all transform group-hover:scale-105 ${highlightStyle}`}
                    >
                      {/* Number Locant Badge */}
                      {showNumbering && numberToShow !== undefined && (
                        <span className={`absolute -top-2.5 -right-2 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shadow-md ${
                          isHighlighted 
                            ? 'bg-amber-400 text-slate-900 ring-2 ring-white dark:ring-slate-900' 
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {numberToShow}
                        </span>
                      )}
                      <span>{node.label}</span>
                    </div>

                    {/* Bottom Label / Details */}
                    <div className="mt-2 text-center">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">
                        C-{numberToShow}
                      </span>
                    </div>
                  </div>

                  {/* Bond connector between carbons */}
                  {index < nodes.length - 1 && (
                    <div className="flex items-center -mt-6">
                      <div className="w-4 sm:w-6 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Color Key Legend */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-600"></span>
              <span className="text-slate-600 dark:text-slate-400">Parent Chain</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Alkyl Substituent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-purple-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Functional Group</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">1</span>
              <span className="text-slate-600 dark:text-slate-400">Carbon Locant</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4 text-center">
          {renderSimpleFormula()}
        </div>
      )}

    </div>
  );
};
