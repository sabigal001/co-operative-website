import React, { useState } from 'react';
import { 
  FlaskConical, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Lightbulb, 
  RotateCcw, 
  Sparkles,
  ChevronDown,
  Layers,
  Eye,
  Check
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import { NOMENCLATURE_COMPOUNDS } from '../../data/nomenclatureData';
import { MoleculeRenderer } from '../common/MoleculeRenderer';

export const NomenclatureView: React.FC = () => {
  const { selectedCompoundId, setSelectedCompoundId, openWhyModal } = useChemistry();
  
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [revealAll, setRevealAll] = useState<boolean>(false);
  const [numberingTestSelection, setNumberingTestSelection] = useState<'left' | 'right' | null>(null);

  const activeCompound = NOMENCLATURE_COMPOUNDS.find(c => c.id === selectedCompoundId) || NOMENCLATURE_COMPOUNDS[0];
  const steps = activeCompound.steps;
  const currentStep = steps[currentStepIndex];

  const handleSelectCompound = (id: string) => {
    setSelectedCompoundId(id);
    setCurrentStepIndex(0);
    setRevealAll(false);
    setNumberingTestSelection(null);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const stepLabels = [
    '1. Functional Group',
    '2. Parent Chain',
    '3. Numbering',
    '4. Substituents',
    '5. Locants',
    '6. Assembly',
    '7. Final Name'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Interactive 7-Step IUPAC Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Step-by-Step Naming Coach
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Follow the exact reasoning path used by chemistry examiners—never jump straight to a blind answer.
          </p>
        </div>

        {/* Compound Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="compound-select" className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            Select Molecule:
          </label>
          <select
            id="compound-select"
            value={activeCompound.id}
            onChange={(e) => handleSelectCompound(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          >
            {NOMENCLATURE_COMPOUNDS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.family})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Compound Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {NOMENCLATURE_COMPOUNDS.map(c => {
          const isSelected = c.id === activeCompound.id;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCompound(c.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              <span>{c.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {c.family}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Molecule & Step Progress Stepper */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Molecule Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Target Compound
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {activeCompound.name}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Formula: {activeCompound.formula}
              </span>
            </div>

            {/* Molecule Diagram with Highlight of current step */}
            <MoleculeRenderer
              condensedFormula={activeCompound.condensedFormula}
              nodes={activeCompound.carbonNodes}
              activeStepFocus={currentStep.highlightedFocus}
              showNumbering={currentStepIndex >= 2}
            />

            {/* Step-Specific Live Badge */}
            {currentStep.visualFeedback.badge && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Active Highlight:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentStep.visualFeedback.badge}
                </span>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {activeCompound.description}
            </p>
          </div>

          {/* Stepper Pill Indicator */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 px-1">
              <span>Step Progress</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {steps.map((st, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;
                return (
                  <button
                    key={st.stepNumber}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setRevealAll(false);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-emerald-500 ring-2 ring-emerald-500/30'
                        : isPassed
                        ? 'bg-emerald-600/70'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                    title={`Go to Step ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Steps Quick Selector */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {stepLabels.map((label, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setRevealAll(false);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                    idx === currentStepIndex
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : idx < currentStepIndex
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Step Breakdown Card with "WHY" Focus */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
            
            {/* Header: Step Number & Title */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-emerald-600/20">
                  {currentStep.stepNumber}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Nomenclature Stage {currentStep.stepNumber} of 7
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {currentStep.title.replace(/^Step \d+: /, '')}
                  </h3>
                </div>
              </div>

              {/* Toggle Reveal All */}
              <button
                onClick={() => setRevealAll(!revealAll)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
                title="Toggle all 7 steps overview"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{revealAll ? 'Single Step' : 'Show All'}</span>
              </button>
            </div>

            {/* If Reveal All is active, show list */}
            {revealAll ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {steps.map((st) => (
                  <div key={st.stepNumber} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                          {st.stepNumber}
                        </span>
                        {st.title}
                      </h4>
                      <button
                        onClick={() => openWhyModal(st.title, st.whyThisStep, st.ruleCitation)}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        Why?
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {st.explanation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* Single Active Step Focus */
              <div className="space-y-6">
                
                {/* Explanation Paragraph */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    What To Do In This Step
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                    {currentStep.explanation}
                  </div>
                </div>

                {/* THE "WHY" BOX (Heart of the app) */}
                <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                        ?
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        Why is this step done?
                      </span>
                    </div>

                    <button
                      onClick={() => openWhyModal(
                        currentStep.title,
                        currentStep.whyThisStep,
                        currentStep.ruleCitation
                      )}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-sm transition"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Expand Reasoning</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-amber-950 dark:text-amber-200 leading-relaxed">
                    {currentStep.whyThisStep}
                  </p>
                </div>

                {/* Official Rule / Citation */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Standard Rule:
                    </span>
                    {currentStep.ruleCitation}
                  </div>
                </div>

                {/* Stepper Navigation Buttons */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentStepIndex(0);
                      setRevealAll(false);
                    }}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                    title="Restart from Step 1"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {currentStepIndex < steps.length - 1 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                    >
                      <span>Next: Step {currentStepIndex + 2}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Naming Complete!</span>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
