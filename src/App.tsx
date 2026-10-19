import React from 'react';
import { ChemistryProvider, useChemistry } from './context/ChemistryContext';
import { Header } from './components/common/Header';
import { WhyModal } from './components/common/WhyModal';
import { HomeView } from './components/home/HomeView';
import { LearnView } from './components/learn/LearnView';
import { NomenclatureView } from './components/nomenclature/NomenclatureView';
import { IsomersView } from './components/isomers/IsomersView';
import { PracticeView } from './components/practice/PracticeView';
import { ExamQuizView } from './components/quiz/ExamQuizView';
import { MistakesView } from './components/quiz/MistakesView';
import { ProgressView } from './components/progress/ProgressView';
import { Atom, BookOpen, GraduationCap, Heart } from 'lucide-react';
import type { ExamQuestion } from './types/chemistry';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useChemistry();

  const handleStartMistakesQuiz = (questions: ExamQuestion[]) => {
    setActiveTab('quiz');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Sticky Header with Navigation, Streak, and Theme Switch */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'learn' && <LearnView />}
        {activeTab === 'nomenclature' && <NomenclatureView />}
        {activeTab === 'isomers' && <IsomersView />}
        {activeTab === 'practice' && <PracticeView />}
        {activeTab === 'quiz' && <ExamQuizView />}
        {activeTab === 'mistakes' && <MistakesView onStartMistakeQuiz={handleStartMistakesQuiz} />}
        {activeTab === 'progress' && <ProgressView />}
      </main>

      {/* Interactive Global "Why?" Modal */}
      <WhyModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Atom className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Chemistry Made Easy — Organic Chemistry Naming Coach
            </span>
            <span>• Based on standard IUPAC Blue Book Nomenclature</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
            <span>Aligned with WAEC, NECO, JAMB/UTME & IJMB syllabuses</span>
            <span>•</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              See → Identify → Reason → Build → Practice
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ChemistryProvider>
      <MainAppContent />
    </ChemistryProvider>
  );
}
