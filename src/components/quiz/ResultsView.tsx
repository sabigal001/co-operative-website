import React, { useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  HelpCircle, 
  BookOpen,
  Sparkles,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuizResult, ExamQuestion } from '../../types/chemistry';
import { EXAM_QUESTIONS_DATA } from '../../data/examQuestionsData';
import { useChemistry } from '../../context/ChemistryContext';

interface ResultsViewProps {
  result: QuizResult;
  questions: ExamQuestion[];
  onRetake: () => void;
  onPracticeMistakes: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  questions,
  onRetake,
  onPracticeMistakes
}) => {
  const { openWhyModal, setActiveTab } = useChemistry();
  const [reviewFilter, setReviewFilter] = React.useState<'all' | 'wrong' | 'correct'>('all');

  // Trigger celebration confetti if score >= 70%
  useEffect(() => {
    if (result.percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent fail
      }
    }
  }, [result.percentage]);

  const filteredAnswers = result.userAnswers.filter(ans => {
    if (reviewFilter === 'wrong') return !ans.isCorrect;
    if (reviewFilter === 'correct') return ans.isCorrect;
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Score Hero Card */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>

        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
          {result.config.mode === 'test' ? 'Official Test Completed' : 'Practice Session Finished'}
        </span>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Score: {result.score} / {result.totalQuestions}
        </h2>

        <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 font-bold text-sm">
          <span>Percentage: </span>
          <span className={`text-base font-black ${
            result.percentage >= 75 ? 'text-emerald-400' :
            result.percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {result.percentage}%
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs text-slate-400 block">Correct</span>
            <span className="text-xl font-black text-emerald-400">{result.correctAnswers}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs text-slate-400 block">Wrong</span>
            <span className="text-xl font-black text-rose-400">{result.wrongAnswers}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs text-slate-400 block">Unanswered</span>
            <span className="text-xl font-black text-amber-400">{result.unanswered}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs text-slate-400 block">Time Spent</span>
            <span className="text-base font-black text-teal-300 flex items-center gap-1 mt-0.5">
              <Clock className="w-4 h-4" />
              {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition flex items-center gap-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Another Test</span>
          </button>

          {result.wrongAnswers > 0 && (
            <button
              onClick={onPracticeMistakes}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-md"
            >
              <span>Practice My Mistakes ({result.wrongAnswers})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Topic Mastery Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Performance Breakdown by Topic
          </h3>
        </div>

        <div className="space-y-3 pt-2">
          {Object.entries(result.topicBreakdown).map(([topic, stats]) => (
            <div key={topic} className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{topic}</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">
                  {stats.correct}/{stats.total} ({stats.percentage}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    stats.percentage >= 70 ? 'bg-emerald-500' :
                    stats.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Question by Question Answer Review */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Answer Review & Reasoning
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Learn the exact naming steps and reasons for every answer.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            {(['all', 'wrong', 'correct'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setReviewFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  reviewFilter === tab
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-6">
          {filteredAnswers.map((userAns, index) => {
            const q = questions.find(item => item.id === userAns.questionId);
            if (!q) return null;

            const userSelectedText = userAns.selectedOptionIndex !== null 
              ? q.options[userAns.selectedOptionIndex] 
              : 'Unanswered';
            const correctText = q.options[q.correctOptionIndex];

            return (
              <div 
                key={q.id}
                className={`p-5 rounded-2xl border-2 space-y-4 ${
                  userAns.isCorrect 
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/30' 
                    : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-500/30'
                }`}
              >
                {/* Header: Question Meta & Result Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">
                      {q.exam} {q.year}
                    </span>
                    <span>•</span>
                    <span>{q.topic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {userAns.isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}

                    <button
                      onClick={() => openWhyModal(
                        `Reasoning: ${q.question}`,
                        q.whyExplanation,
                        q.ruleToRemember
                      )}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      Why?
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {q.question}
                </h4>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-xl border ${
                    userAns.isCorrect
                      ? 'bg-emerald-100/60 dark:bg-emerald-900/30 border-emerald-400/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-100/60 dark:bg-rose-900/30 border-rose-400/40 text-rose-900 dark:text-rose-200'
                  }`}>
                    <span className="font-bold block opacity-75 mb-0.5">Your Answer:</span>
                    <span className="font-mono font-bold text-sm">{userSelectedText}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/30 border border-emerald-400/40 text-emerald-900 dark:text-emerald-200">
                    <span className="font-bold block opacity-75 mb-0.5">Correct IUPAC Answer:</span>
                    <span className="font-mono font-bold text-sm">{correctText}</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    Pedagogical Explanation:
                  </span>
                  {q.explanation}
                </div>

                {/* Step Breakdown if available */}
                {q.namingStepsBreakdown && q.namingStepsBreakdown.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      Naming Steps Applied:
                    </span>
                    {q.namingStepsBreakdown.map((st, i) => (
                      <p key={i} className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        {st}
                      </p>
                    ))}
                  </div>
                )}

                {/* Rule to Remember */}
                <div className="flex items-start gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Rule to remember: </span>
                    {q.ruleToRemember}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
