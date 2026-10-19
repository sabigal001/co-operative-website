import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Trash2, 
  HelpCircle, 
  BookOpen, 
  Target,
  Sparkles,
  TrendingDown,
  Layers
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import { EXAM_QUESTIONS_DATA } from '../../data/examQuestionsData';
import type { ExamQuestion } from '../../types/chemistry';

interface MistakesViewProps {
  onStartMistakeQuiz: (questions: ExamQuestion[]) => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({ onStartMistakeQuiz }) => {
  const { 
    mistakes, 
    markMistakeResolved, 
    clearAllMistakes, 
    weakTopics, 
    openWhyModal, 
    setActiveTab,
    setPracticePresetTopic 
  } = useChemistry();

  const [activeTab, setActiveFilterTab] = useState<'all' | string>('all');

  // Find full question objects for the mistakes
  const mistakeQuestions: { mistake: typeof mistakes[0]; question: ExamQuestion }[] = mistakes
    .map(m => {
      const q = EXAM_QUESTIONS_DATA.find(item => item.id === m.questionId);
      return q ? { mistake: m, question: q } : null;
    })
    .filter((item): item is { mistake: typeof mistakes[0]; question: ExamQuestion } => item !== null);

  const filteredItems = activeTab === 'all'
    ? mistakeQuestions
    : mistakeQuestions.filter(item => item.question.topic === activeTab);

  const handlePracticeAllMistakes = () => {
    const questionsToPractice = filteredItems.map(item => item.question);
    if (questionsToPractice.length > 0) {
      onStartMistakeQuiz(questionsToPractice);
    }
  };

  const handlePracticeTopic = (topicName: string) => {
    setPracticePresetTopic(topicName);
    setActiveTab('quiz');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Targeted Weakness Remediation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Mistakes Practice Hub
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Turn your wrong answers into mastery. Practice questions you missed until they become second nature.
          </p>
        </div>

        {mistakes.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePracticeAllMistakes}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Mistakes ({filteredItems.length})</span>
            </button>

            <button
              onClick={clearAllMistakes}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 transition"
              title="Clear all saved mistakes"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Weak Areas Analysis Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <TrendingDown className="w-5 h-5" />
            <span>Your Identified Weak Areas</span>
          </div>
          <span className="text-xs text-slate-400">Based on past quiz attempts</span>
        </div>

        {weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {weakTopics.slice(0, 3).map((item, idx) => (
              <div 
                key={item.topic}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    {item.scorePercent}% Mastery
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.topic}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.count} questions practiced
                  </p>
                </div>

                <button
                  onClick={() => handlePracticeTopic(item.topic)}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <span>Practice this topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            No weak areas detected yet! Take a test or quiz to uncover any topics needing reinforcement.
          </p>
        )}
      </div>

      {/* Mistakes List */}
      {mistakes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No Active Mistakes!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You currently have a clean sheet. Whenever you miss an answer in Practice or Exam mode, it will be automatically logged here for targeted revision.
          </p>
          <button
            onClick={() => setActiveTab('quiz')}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            Start an Exam Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Questions Needing Review ({filteredItems.length})
            </span>
          </div>

          <div className="space-y-4">
            {filteredItems.map(({ mistake, question }) => {
              const wrongAnswer = question.options[mistake.selectedOptionIndex];
              const correctAnswer = question.options[question.correctOptionIndex];

              return (
                <div 
                  key={mistake.questionId}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 font-bold">
                        {question.exam} {question.year}
                      </span>
                      <span>•</span>
                      <span>{question.topic}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openWhyModal(
                          `Why is this correct?`,
                          question.whyExplanation,
                          question.ruleToRemember
                        )}
                        className="px-3 py-1 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why?</span>
                      </button>

                      <button
                        onClick={() => markMistakeResolved(mistake.questionId)}
                        className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>I Understand This Now</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {question.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200">
                      <span className="font-bold block opacity-75 mb-0.5">Your Past Answer:</span>
                      <span className="font-mono font-bold text-sm">{wrongAnswer}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-200">
                      <span className="font-bold block opacity-75 mb-0.5">Correct Answer:</span>
                      <span className="font-mono font-bold text-sm">{correctAnswer}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      How to Reason This Correctly:
                    </span>
                    {question.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
