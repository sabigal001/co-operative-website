import React, { useState } from 'react';
import { 
  PenTool, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  Layers,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import { MoleculeRenderer } from '../common/MoleculeRenderer';

interface PracticeDrill {
  id: string;
  category: 'Parent Chain' | 'Numbering' | 'Functional Group' | 'Name Builder';
  prompt: string;
  moleculeCondensed: string;
  moleculeName?: string;
  nodes?: {
    id: number;
    label: string;
    numberLtoR: number;
    numberRtoL: number;
    correctNumber: number;
    isParentChain: boolean;
    substituent?: string;
    isFunctionalGroup?: boolean;
  }[];
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  whyExplanation: string;
  ruleCitation: string;
}

const PRACTICE_DRILLS: PracticeDrill[] = [
  {
    id: 'drill-1-chain',
    category: 'Parent Chain',
    prompt: 'Look carefully at the molecule below. What is the length of the LONGEST continuous carbon chain (parent chain)?',
    moleculeCondensed: 'CH₃–CH₂–CH(CH₂–CH₃)–CH₂–CH₂–CH₃',
    options: [
      { text: '5 Carbons (Pentane)', isCorrect: false, feedback: 'Trap! You only counted horizontally in a straight line. Carbon chains can bend!' },
      { text: '6 Carbons (Hexane)', isCorrect: true, feedback: 'Correct! Tracing from the ethyl branch –CH₂CH₃ through the middle carbon to the right propyl chain gives 6 unbroken carbons (hexane).' },
      { text: '7 Carbons (Heptane)', isCorrect: false, feedback: 'Too high! Count the longest single continuous path without branching back.' },
      { text: '4 Carbons (Butane)', isCorrect: false, feedback: 'Too short!' }
    ],
    whyExplanation: 'Molecules in 3D solution rotate freely around C–C single bonds. Just because a textbook prints the ethyl branch downwards does not make it a separate piece. The longest unbroken continuous carbon path has 6 carbons.',
    ruleCitation: 'IUPAC Rule: The parent chain is the longest continuous chain of carbon atoms.'
  },
  {
    id: 'drill-2-numbering',
    category: 'Numbering',
    prompt: 'For this alkene: CH₃–CH=CH–CH(CH₃)–CH₃, which numbering direction is correct under IUPAC rules?',
    moleculeCondensed: 'CH₃–CH=CH–CH(CH₃)–CH₃',
    nodes: [
      { id: 1, label: 'CH₃', numberLtoR: 1, numberRtoL: 5, correctNumber: 1, isParentChain: true },
      { id: 2, label: 'CH', numberLtoR: 2, numberRtoL: 4, correctNumber: 2, isParentChain: true, isFunctionalGroup: true },
      { id: 3, label: 'CH', numberLtoR: 3, numberRtoL: 3, correctNumber: 3, isParentChain: true, isFunctionalGroup: true },
      { id: 4, label: 'CH', numberLtoR: 4, numberRtoL: 2, correctNumber: 4, isParentChain: true, substituent: 'CH₃' },
      { id: 5, label: 'CH₃', numberLtoR: 5, numberRtoL: 1, correctNumber: 5, isParentChain: true }
    ],
    options: [
      { text: 'Left-to-Right (Double bond gets C-2)', isCorrect: true, feedback: 'Bingo! The double bond (C=C) has higher numbering priority than the methyl branch. Numbering from the left gives the alkene position 2!' },
      { text: 'Right-to-Left (Methyl branch gets C-2)', isCorrect: false, feedback: 'Trap! Alkyl branches do NOT take priority over double bonds. Multiple bonds must receive the lowest locant.' }
    ],
    whyExplanation: 'Unsaturated bonds (C=C double bonds and C≡C triple bonds) are reactive functional centers. IUPAC explicitly rules that multiple bonds outrank simple saturated alkyl branches when choosing numbering direction.',
    ruleCitation: 'IUPAC Lowest Locant: Multiple bonds take priority over substituents.'
  },
  {
    id: 'drill-3-functional-group',
    category: 'Functional Group',
    prompt: 'This molecule contains both a –COOH group and an –OH group: CH₃–CH(OH)–CH₂–COOH. Which functional group dictates the SUFFIX of the name?',
    moleculeCondensed: 'CH₃–CH(OH)–CH₂–COOH',
    options: [
      { text: 'Carboxylic acid (-COOH) → suffix "-oic acid"', isCorrect: true, feedback: 'Spot on! Carboxylic acid has highest seniority. The –OH group is demoted to the prefix "hydroxy-".' },
      { text: 'Alcohol (-OH) → suffix "-ol"', isCorrect: false, feedback: 'Incorrect. Carboxylic acid (-COOH) is much higher on the priority ladder than alcohol (-OH).' },
      { text: 'Both groups get suffixes (e.g. butanol-oic acid)', isCorrect: false, feedback: 'Never! An organic name can only have ONE principal suffix.' }
    ],
    whyExplanation: 'IUPAC establishes a seniority ladder so every multi-functional molecule has exactly one principal functional suffix. Carboxylic acid sits at the very top of high school chemistry.',
    ruleCitation: 'IUPAC Seniority: -COOH > -OH. Suffix = -oic acid, Prefix = hydroxy-.'
  },
  {
    id: 'drill-4-name-builder',
    category: 'Name Builder',
    prompt: 'How do you correctly format the IUPAC name for a 4-carbon alcohol with a methyl group at position 2 and –OH at position 1?',
    moleculeCondensed: 'CH₃–CH₂–CH(CH₃)–CH₂–OH',
    options: [
      { text: '2-methylbutan-1-ol', isCorrect: true, feedback: 'Perfect! [Prefix with locant] + [Parent chain] + [Infix locant] + [Suffix].' },
      { text: '2-methyl-1-butanol', isCorrect: true, feedback: 'Accepted in WAEC/JAMB! (Older format, but chemically valid).' },
      { text: '2 methyl butan 1 ol (with spaces)', isCorrect: false, feedback: 'Punctuation error! IUPAC names must not contain spaces between prefixes and parent chains.' },
      { text: '3-methylbutan-4-ol', isCorrect: false, feedback: 'Wrong numbering direction! The –OH group must be C-1.' }
    ],
    whyExplanation: 'In current IUPAC standard (1993/2013), position numbers are inserted right before the syllable they describe: butan-1-ol. Hyphens connect numbers to letters, and no spaces exist except in esters and acid words.',
    ruleCitation: 'IUPAC Punctuation: hyphens between numbers and letters, commas between numbers.'
  }
];

export const PracticeView: React.FC = () => {
  const { openWhyModal, setActiveTab } = useChemistry();
  const [currentDrillIndex, setCurrentDrillIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const activeDrill = PRACTICE_DRILLS[currentDrillIndex];

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedOptionIndex(index);
    setHasAnswered(true);

    if (activeDrill.options[index].isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextDrill = () => {
    if (currentDrillIndex < PRACTICE_DRILLS.length - 1) {
      setCurrentDrillIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setHasAnswered(false);
    }
  };

  const handleReset = () => {
    setCurrentDrillIndex(0);
    setSelectedOptionIndex(null);
    setHasAnswered(false);
    setScore(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <PenTool className="w-4 h-4" />
            <span>Interactive Nomenclature Practice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Skill-Building Drills
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Practice identifying chains, numbering directions, and naming blocks with real-time feedback.
          </p>
        </div>

        {/* Score & Progress */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Score: </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
              {score}/{PRACTICE_DRILLS.length}
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset drills"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drill Step Indicators */}
      <div className="grid grid-cols-4 gap-2">
        {PRACTICE_DRILLS.map((d, idx) => {
          const isCurrent = idx === currentDrillIndex;
          const isPassed = idx < currentDrillIndex;
          return (
            <button
              key={d.id}
              onClick={() => {
                setCurrentDrillIndex(idx);
                setSelectedOptionIndex(null);
                setHasAnswered(false);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                  : isPassed
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span className="text-[10px] font-bold block opacity-80">Drill {idx + 1}</span>
              <span className="text-xs font-bold truncate block">{d.category}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Category & Prompt */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            {activeDrill.category} Challenge
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {activeDrill.prompt}
          </h2>
        </div>

        {/* Molecule Diagram */}
        <MoleculeRenderer
          condensedFormula={activeDrill.moleculeCondensed}
          nodes={activeDrill.nodes}
        />

        {/* Options */}
        <div className="space-y-3">
          {activeDrill.options.map((opt, idx) => {
            const isSelected = selectedOptionIndex === idx;
            let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50';

            if (hasAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30';
              } else if (isSelected) {
                btnStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/30';
              } else {
                btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-sm sm:text-base flex items-center justify-between gap-4 transition-all ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt.text}</span>
                </div>

                {hasAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {hasAnswered && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Feedback & Why Explanation */}
        {hasAnswered && selectedOptionIndex !== null && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-slide-up">
            
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className={`text-xs font-bold uppercase tracking-wider block ${
                  activeDrill.options[selectedOptionIndex].isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {activeDrill.options[selectedOptionIndex].isCorrect ? 'Correct Reasoning!' : 'Review the rule:'}
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                  {activeDrill.options[selectedOptionIndex].feedback}
                </p>
              </div>

              <button
                onClick={() => openWhyModal(
                  activeDrill.prompt,
                  activeDrill.whyExplanation,
                  activeDrill.ruleCitation
                )}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Why?</span>
              </button>
            </div>

            {/* Next Drill CTA */}
            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700/60">
              {currentDrillIndex < PRACTICE_DRILLS.length - 1 ? (
                <button
                  onClick={handleNextDrill}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
                >
                  <span>Ready for External Exam Quiz!</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
