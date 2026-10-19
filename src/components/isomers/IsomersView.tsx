import React, { useState } from 'react';
import { 
  GitFork, 
  HelpCircle, 
  ArrowRight, 
  Scale, 
  Sparkles, 
  Flame, 
  Zap, 
  Eye, 
  Check, 
  Info,
  Layers
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import { ISOMERS_DATA } from '../../data/isomersData';
import { MoleculeRenderer } from '../common/MoleculeRenderer';

export const IsomersView: React.FC = () => {
  const { openWhyModal, setActiveTab, setPracticePresetTopic } = useChemistry();
  const [selectedIsomerId, setSelectedIsomerId] = useState<string>(ISOMERS_DATA[0].id);

  const activeIsomer = ISOMERS_DATA.find(i => i.id === selectedIsomerId) || ISOMERS_DATA[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
            <GitFork className="w-4 h-4" />
            <span>Dedicated Isomerism Section</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Molecular Isomers Explained
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Same molecular formula, different structures and behaviors. Understand why and how.
          </p>
        </div>

        {/* Quick Concept Explainer Button */}
        <button
          onClick={() => openWhyModal(
            'What are Isomers?',
            'Isomers are chemical compounds that possess the EXACT same molecular formula (identical count and types of atoms), but differ in how those atoms are connected (structural isomers) or how they are arranged in three-dimensional space (stereoisomers).',
            'IUPAC Gold Book: Isomerism definition'
          )}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 text-xs font-bold hover:bg-teal-500/20 transition self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4" />
          <span>What is an Isomer?</span>
        </button>
      </div>

      {/* Isomerism Category Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ISOMERS_DATA.map((item) => {
          const isSelected = item.id === activeIsomer.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedIsomerId(item.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400'
                }`}>
                  {item.molecularFormula}
                </span>
                <span className="text-[10px] opacity-80">{item.type.split(' ')[0]}</span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm leading-snug line-clamp-2">
                {item.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Isomer Case Study Display */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Header of Active Isomer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold border border-teal-500/20">
                {activeIsomer.type} Isomerism
              </span>
              <span className="font-mono text-sm font-extrabold text-slate-700 dark:text-slate-300">
                Formula: {activeIsomer.molecularFormula}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              {activeIsomer.title}
            </h2>
          </div>

          <button
            onClick={() => openWhyModal(
              `Why are they isomers: ${activeIsomer.title}`,
              activeIsomer.whyAreTheyIsomers,
              activeIsomer.keyDifferentiatingRule
            )}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition self-start md:self-auto"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Why are these isomers?</span>
          </button>
        </div>

        {/* Concept Summary Banner */}
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 text-slate-800 dark:text-teal-100 text-sm leading-relaxed font-medium">
          {activeIsomer.conceptSummary}
        </div>

        {/* Side-by-Side Visual Molecules Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Compound A Card */}
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-slate-50/50 dark:bg-slate-800/40 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider">
                Structure A
              </span>
              {activeIsomer.compoundA.boilingPoint && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  BP: {activeIsomer.compoundA.boilingPoint}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {activeIsomer.compoundA.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeIsomer.compoundA.structuralType}
              </p>
            </div>

            {/* Molecule Renderer */}
            <MoleculeRenderer
              condensedFormula={activeIsomer.compoundA.condensed}
              iupacName={activeIsomer.compoundA.name}
              compact
            />

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                Structural Profile:
              </span>
              {activeIsomer.compoundA.notes}
            </div>
          </div>

          {/* Compound B Card */}
          <div className="rounded-3xl border-2 border-teal-500/40 bg-slate-50/50 dark:bg-slate-800/40 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-[11px] font-black uppercase tracking-wider">
                Structure B
              </span>
              {activeIsomer.compoundB.boilingPoint && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  BP: {activeIsomer.compoundB.boilingPoint}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {activeIsomer.compoundB.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeIsomer.compoundB.structuralType}
              </p>
            </div>

            {/* Molecule Renderer */}
            <MoleculeRenderer
              condensedFormula={activeIsomer.compoundB.condensed}
              iupacName={activeIsomer.compoundB.name}
              compact
            />

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-teal-600 dark:text-teal-400 block mb-1">
                Structural Profile:
              </span>
              {activeIsomer.compoundB.notes}
            </div>
          </div>

        </div>

        {/* Atom-by-Atom Equality Verification Check */}
        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Molecular Formula Verification: {activeIsomer.molecularFormula}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Count the atoms: both Structure A and Structure B contain the EXACT same atom budget.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Check className="w-4 h-4" />
            <span>Equal Formula Confirmed</span>
          </div>
        </div>

        {/* Educational Insight & Exam Secret */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>WAEC / JAMB / IJMB Exam Insight</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {activeIsomer.educationalInsight}
          </p>
        </div>

        {/* Bottom CTA to practice */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              setPracticePresetTopic('Isomerism');
              setActiveTab('quiz');
            }}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <span>Practice Isomer Exam Questions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
