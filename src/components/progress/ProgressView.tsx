import React from 'react';
import { 
  Trophy, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  RotateCcw, 
  Award, 
  Target, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import { LESSONS_DATA } from '../../data/lessonsData';

export const ProgressView: React.FC = () => {
  const { 
    completedLessons, 
    practiceStreak, 
    testHistory, 
    mistakes, 
    weakTopics, 
    setActiveTab, 
    resetAllProgress,
    setPracticePresetTopic 
  } = useChemistry();

  const totalLessons = LESSONS_DATA.length;
  const lessonsPercentage = Math.round((completedLessons.length / totalLessons) * 100);

  // Overall average test score
  const totalTests = testHistory.length;
  const averageScore = totalTests > 0
    ? Math.round(testHistory.reduce((acc, t) => acc + t.percentage, 0) / totalTests)
    : 0;

  const handlePracticeTopic = (topicName: string) => {
    setPracticePresetTopic(topicName);
    setActiveTab('quiz');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>Academic Performance Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Your Learning & Exam Progress
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track completed curriculum topics, examine your test score progression, and strengthen weak spots.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all progress data?')) {
              resetAllProgress();
            }
          }}
          className="text-xs font-semibold text-slate-400 hover:text-rose-500 self-start md:self-auto transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Card 1: Practice Streak */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-400/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
              Active Streak
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {practiceStreak}
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {practiceStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-2 font-medium">
              Keep building daily chemistry intuition!
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">
            <Flame className="w-8 h-8 fill-slate-950 animate-bounce" />
          </div>
        </div>

        {/* Card 2: Curriculum Completion */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-400/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
              Lessons Completed
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {completedLessons.length}
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                / {totalLessons} ({lessonsPercentage}%)
              </span>
            </div>
            <div className="w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-3">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${lessonsPercentage}%` }}
              />
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-600/30">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>

        {/* Card 3: Exam Score Average */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-400/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
              Test Score Average
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {totalTests > 0 ? `${averageScore}%` : 'N/A'}
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                ({totalTests} {totalTests === 1 ? 'test' : 'tests'})
              </span>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-2 font-medium">
              {totalTests === 0 ? 'Take your first exam quiz' : 'Targeting 80%+ for JAMB/WAEC'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

      </div>

      {/* Weak Areas Recommendation Strip */}
      {weakTopics.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Topics Requiring Attention
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('mistakes')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>View Mistakes ({mistakes.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {weakTopics.slice(0, 3).map((item) => (
              <div 
                key={item.topic}
                className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {item.topic}
                  </h4>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">
                    {item.scorePercent}% Mastery
                  </p>
                </div>
                <button
                  onClick={() => handlePracticeTopic(item.topic)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition"
                >
                  Practice
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Lessons Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Curriculum Mastery Checklist</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LESSONS_DATA.map((lesson, idx) => {
            const isDone = completedLessons.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400/40'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {lesson.title}
                  </span>
                </div>

                {isDone && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Exam Test History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-500" />
          <span>Recent Test Results</span>
        </h3>

        {testHistory.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            No tests taken yet. Start an exam simulation under the Quiz tab to view your score history here.
          </p>
        ) : (
          <div className="space-y-3">
            {testHistory.slice(0, 5).map((test) => (
              <div 
                key={test.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono">
                      {test.config.exam} {test.config.mode === 'test' ? 'Exam' : 'Practice'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(test.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Topic: {test.config.topic} • {test.totalQuestions} questions
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {test.score} / {test.totalQuestions}
                    </span>
                    <span className={`block text-xs font-bold ${
                      test.percentage >= 75 ? 'text-emerald-500' :
                      test.percentage >= 50 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {test.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
