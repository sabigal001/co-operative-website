import React from 'react';
import { 
  ArrowRight, 
  FlaskConical, 
  Sparkles, 
  GraduationCap, 
  GitFork, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  Target,
  Flame,
  HelpCircle,
  Layers
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import { MoleculeRenderer } from '../common/MoleculeRenderer';

export const HomeView: React.FC = () => {
  const { setActiveTab, openWhyModal, practiceStreak, completedLessons, mistakes } = useChemistry();

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-20 bg-gradient-to-b from-emerald-500/5 via-teal-500/5 to-transparent border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-300 dark:border-emerald-800 shadow-sm mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Designed for Secondary-School, JAMB, WAEC & IJMB Students</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Stop memorizing organic chemistry names. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Learn how to build them.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chemistry shouldn't feel like random guessing. Master IUPAC naming step-by-step with simple visual rules, isomer breakdowns, and real external examination practice.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('learn')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base md:text-lg shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('nomenclature')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-base md:text-lg border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center gap-2 transition"
            >
              <FlaskConical className="w-5 h-5 text-emerald-500" />
              <span>Step-by-Step Naming Engine</span>
            </button>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg sm:text-xl">
                <BookOpen className="w-5 h-5" />
                <span>11+</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Core Lessons</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-lg sm:text-xl">
                <FlaskConical className="w-5 h-5" />
                <span>7 Steps</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Naming Engine</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg sm:text-xl">
                <GitFork className="w-5 h-5" />
                <span>5 Types</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Isomer Models</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-lg sm:text-xl">
                <GraduationCap className="w-5 h-5" />
                <span>4 Exams</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">WAEC/JAMB/NECO</p>
            </div>
          </div>

        </div>
      </section>

      {/* The 7-Step Universal IUPAC Formula Blueprint */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                The Master Blueprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                How Every IUPAC Name is Assembled
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Never guess again. Every organic compound follows this exact 4-part puzzle:
              </p>
            </div>
            <button
              onClick={() => openWhyModal(
                'Why does IUPAC follow this formula?',
                'IUPAC organized names so that each section answers a specific question: (1) What branches exist and where are they? (2) How long is the main backbone? (3) Is it single, double, or triple bonded? (4) What is the main functional group of the chemical family?',
                'IUPAC Blue Book: Systematic Organic Nomenclature Hierarchy'
              )}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Why this structure?</span>
            </button>
          </div>

          {/* Formula Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 font-mono text-center">
            
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1">
                Part 1: Prefix
              </span>
              <p className="text-lg font-bold">2-methyl</p>
              <p className="text-xs font-sans text-amber-200/70 mt-1">Substituent branches + Locants</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                Part 2: Parent Root
              </span>
              <p className="text-lg font-bold">butan</p>
              <p className="text-xs font-sans text-emerald-200/70 mt-1">Longest carbon chain (4 Carbons)</p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 block mb-1">
                Part 3: Infix
              </span>
              <p className="text-lg font-bold">-1-</p>
              <p className="text-xs font-sans text-teal-200/70 mt-1">Position of principal group</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block mb-1">
                Part 4: Suffix
              </span>
              <p className="text-lg font-bold">-ol</p>
              <p className="text-xs font-sans text-purple-200/70 mt-1">Principal functional group (Alcohol)</p>
            </div>

          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs text-slate-400">Put them all together:</span>
              <p className="font-mono text-xl sm:text-2xl font-black text-emerald-400">
                2-methylbutan-1-ol
              </p>
            </div>
            <button
              onClick={() => setActiveTab('nomenclature')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
            >
              <span>See Step-by-Step Breakdown</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* The 7-Stage Learning Loop */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Educational Principle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            The Naming Coach Learning Cycle
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            We don’t just hand you answers. You learn the real reasoning process to ace any organic problem.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { step: '1', title: 'See', desc: 'Observe molecule structure' },
            { step: '2', title: 'Identify', desc: 'Find groups & main chain' },
            { step: '3', title: 'Reason', desc: 'Apply lowest locant rules' },
            { step: '4', title: 'Build', desc: 'Assemble standard IUPAC name' },
            { step: '5', title: 'Understand', desc: 'Click "Why?" for any rule' },
            { step: '6', title: 'Practice', desc: 'Interactive guided puzzles' },
            { step: '7', title: 'Master', desc: 'Real WAEC/JAMB exam tests' },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition group"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                {item.step}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* App Feature Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Learn */}
          <div 
            onClick={() => setActiveTab('learn')}
            className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              1. Learn Nomenclature
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              11 bite-sized lessons covering longest carbon chains, numbering rules, Greek prefixes, alcohols, carbonyls, esters, haloalkanes, and aromatics.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Explore Lessons</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2: Isomerism */}
          <div 
            onClick={() => setActiveTab('isomers')}
            className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-teal-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              2. Visual Isomers
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Side-by-side molecular comparisons of chain, position, functional group, cis/trans (geometrical), and optical enantiomers with chiral centers.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
              <span>Compare Isomers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3: Exam Bank & Test Mode */}
          <div 
            onClick={() => setActiveTab('quiz')}
            className="cursor-pointer p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              3. Exam Bank & Timed Tests
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Authentic JAMB, WAEC, NECO & IJMB questions. Practice by topic or simulate real timed exams with instant results, weak area analysis, and mistake logs.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Start External Exam Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Why? Button Philosophy Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                The Ever-Present "Why?" Button
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Every major rule, naming step, and exam solution features a "Why?" button. Click it anytime you feel lost to get a clear, secondary-school-friendly explanation instead of textbook jargon.
              </p>
            </div>
          </div>
          <button
            onClick={() => openWhyModal(
              'Why do we number from the end with lowest locants?',
              'Imagine giving someone directions to a house. You want the shortest, simplest address numbers possible! In chemistry, using the smallest locants ensures that chemists everywhere refer to the identical carbon position without ambiguity.',
              'IUPAC Gold Book: Lowest Locant Principle'
            )}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition shrink-0"
          >
            Try a "Why?" Button Demo
          </button>
        </div>
      </section>

    </div>
  );
};
