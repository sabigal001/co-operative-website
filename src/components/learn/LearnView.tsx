import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  HelpCircle, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft, 
  AlertOctagon, 
  Sparkles,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import { LESSONS_DATA } from '../../data/lessonsData';
import { MoleculeRenderer } from '../common/MoleculeRenderer';

export const LearnView: React.FC = () => {
  const { 
    completedLessons, 
    toggleLessonCompleted, 
    openWhyModal, 
    setActiveTab,
    setPracticePresetTopic 
  } = useChemistry();

  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS_DATA[0].id);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Fundamentals', 'Hydrocarbons', 'Functional Groups', 'Special Topics'];

  const filteredLessons = categoryFilter === 'All' 
    ? LESSONS_DATA 
    : LESSONS_DATA.filter(l => l.category === categoryFilter);

  const activeLesson = LESSONS_DATA.find(l => l.id === selectedLessonId) || LESSONS_DATA[0];
  const activeIndex = LESSONS_DATA.findIndex(l => l.id === selectedLessonId);
  const isCompleted = completedLessons.includes(activeLesson.id);

  const handleNextLesson = () => {
    if (activeIndex < LESSONS_DATA.length - 1) {
      setSelectedLessonId(LESSONS_DATA[activeIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (activeIndex > 0) {
      setSelectedLessonId(LESSONS_DATA[activeIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePracticeTopic = (topicName: string) => {
    setPracticePresetTopic(topicName);
    setActiveTab('practice');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Progressive Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Learn Organic Nomenclature
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Bite-sized visual lessons structured so you build confidence step-by-step.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Mastery:</span>
          <div className="w-24 sm:w-32 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.round((completedLessons.length / LESSONS_DATA.length) * 100)}%` }}
            ></div>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
            {completedLessons.length}/{LESSONS_DATA.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Sidebar List + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar: Lessons Index */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lessons List Cards */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredLessons.map((lesson, idx) => {
              const isSelected = lesson.id === activeLesson.id;
              const completed = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/60 shadow-sm ring-1 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                      {idx + 1}.
                    </span>
                    <div>
                      <h4 className={`text-sm font-bold leading-tight ${
                        isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{lesson.duration}</span>
                        <span>•</span>
                        <span className={`font-semibold ${
                          lesson.difficulty === 'Beginner' ? 'text-emerald-500' :
                          lesson.difficulty === 'Intermediate' ? 'text-teal-500' :
                          lesson.difficulty === 'Advanced' ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                          {lesson.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Main Column: Active Lesson View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Top Meta & Mark Complete */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  {activeLesson.category}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400">{activeLesson.duration} read</span>
              </div>

              {/* Completion Toggle */}
              <button
                onClick={() => toggleLessonCompleted(activeLesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
              </button>
            </div>

            {/* Title & Summary */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {activeLesson.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium mt-2 leading-relaxed">
                {activeLesson.summary}
              </p>
            </div>

            {/* Key Rule Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  RULE
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                    Core IUPAC Principle
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                    {activeLesson.keyRule}
                  </p>
                </div>
              </div>

              {/* "Why?" Button */}
              <button
                onClick={() => openWhyModal(
                  `Why: ${activeLesson.title}`,
                  activeLesson.whyExplanation,
                  activeLesson.keyRule
                )}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition shrink-0"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Why?</span>
              </button>
            </div>

            {/* Visual Molecule Diagram */}
            {activeLesson.visualMolecule && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Visual Molecule Example
                </span>
                <MoleculeRenderer
                  condensedFormula={activeLesson.visualMolecule.condensed}
                  iupacName={activeLesson.visualMolecule.iupacName}
                />
                {activeLesson.visualMolecule.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic px-2">
                    💡 {activeLesson.visualMolecule.notes}
                  </p>
                )}
              </div>
            )}

            {/* Detailed Explanation */}
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {activeLesson.explanation}
            </div>

            {/* Takeaways & Common Mistakes Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              
              {/* Key Takeaways */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Key Takeaways
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeLesson.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-500" />
                  Avoid These Traps
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeLesson.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer Navigation Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handlePrevLesson}
                disabled={activeIndex === 0}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>

              <button
                onClick={() => handlePracticeTopic(activeLesson.title)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Practice Questions</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextLesson}
                disabled={activeIndex === LESSONS_DATA.length - 1}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
