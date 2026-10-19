import React from 'react';
import { HelpCircle, X, Lightbulb, BookOpen } from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';

export const WhyModal: React.FC = () => {
  const { whyModalData, closeWhyModal } = useChemistry();

  if (!whyModalData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={closeWhyModal}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl transition-all transform scale-100 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                The Chemistry Reasoning
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {whyModalData.title}
              </h3>
            </div>
          </div>
          <button
            onClick={closeWhyModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl">
            <p className="font-medium text-slate-800 dark:text-amber-100">
              {whyModalData.content}
            </p>
          </div>

          {whyModalData.ruleCitation && (
            <div className="flex items-start gap-2.5 p-3.5 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
              <BookOpen className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                  IUPAC Standard / Exam Rule:
                </span>
                {whyModalData.ruleCitation}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={closeWhyModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
