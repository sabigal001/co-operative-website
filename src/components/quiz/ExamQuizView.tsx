import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Filter, 
  Shuffle, 
  Play, 
  AlertCircle, 
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useChemistry } from '../../context/ChemistryContext';
import { EXAM_QUESTIONS_DATA } from '../../data/examQuestionsData';
import type { 
  ExamQuestion, 
  ExamCategory, 
  DifficultyLevel, 
  QuizTestConfig, 
  QuizResult 
} from '../../types/chemistry';
import { ResultsView } from './ResultsView';
import { MoleculeRenderer } from '../common/MoleculeRenderer';

export const ExamQuizView: React.FC = () => {
  const { 
    practicePresetTopic, 
    setPracticePresetTopic, 
    openWhyModal, 
    saveTestResult, 
    logMistake,
    setActiveTab 
  } = useChemistry();

  // Test setup configuration state
  const [mode, setMode] = useState<'practice' | 'test'>('test');
  const [selectedExam, setSelectedExam] = useState<ExamCategory>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<string>(practicePresetTopic || 'ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(15);

  // Active quiz session state
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<{ [qId: string]: number | null }>({});
  const [practiceAnsweredState, setPracticeAnsweredState] = useState<{ [qId: string]: boolean }>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [completedResult, setCompletedResult] = useState<QuizResult | null>(null);
  const [showUnansweredDrawer, setShowUnansweredDrawer] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Sync preset topic if coming from another section
  useEffect(() => {
    if (practicePresetTopic) {
      setSelectedTopic(practicePresetTopic);
      setMode('practice');
    }
  }, [practicePresetTopic]);

  // Handle countdown timer for test mode
  useEffect(() => {
    if (sessionActive && mode === 'test' && timeLimitMinutes > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [sessionActive, mode, timeLimitMinutes]);

  // Start Quiz
  const handleStartQuiz = () => {
    let pool = [...EXAM_QUESTIONS_DATA];

    if (selectedExam !== 'ALL') {
      pool = pool.filter(q => q.exam === selectedExam);
    }
    if (selectedTopic !== 'ALL') {
      pool = pool.filter(q => q.topic.toLowerCase().includes(selectedTopic.toLowerCase()));
    }
    if (selectedDifficulty !== 'ALL') {
      pool = pool.filter(q => q.difficulty === selectedDifficulty);
    }

    if (pool.length === 0) {
      pool = [...EXAM_QUESTIONS_DATA];
    }

    // Shuffle questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setQuizQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserSelectedAnswers({});
    setPracticeAnsweredState({});
    setCompletedResult(null);
    setShowUnansweredDrawer(false);

    startTimeRef.current = Date.now();
    setTimeRemainingSeconds(timeLimitMinutes * 60);
    setSessionActive(true);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (mode === 'practice' && practiceAnsweredState[questionId]) return;

    setUserSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    if (mode === 'practice') {
      setPracticeAnsweredState(prev => ({
        ...prev,
        [questionId]: true
      }));

      // If wrong in practice mode, log mistake immediately
      const q = quizQuestions.find(item => item.id === questionId);
      if (q && optionIndex !== q.correctOptionIndex) {
        logMistake(q, optionIndex);
      }
    }
  };

  const handleFinishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const topicStats: { [topic: string]: { total: number; correct: number; percentage: number } } = {};

    const userAnswersList = quizQuestions.map(q => {
      const selected = userSelectedAnswers[q.id];
      const isCorrect = selected !== undefined && selected !== null && selected === q.correctOptionIndex;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0, percentage: 0 };
      }
      topicStats[q.topic].total += 1;

      if (selected === undefined || selected === null) {
        unansweredCount += 1;
      } else if (isCorrect) {
        correctCount += 1;
        topicStats[q.topic].correct += 1;
      } else {
        wrongCount += 1;
        // Log mistake into persistent user mistake bank
        logMistake(q, selected);
      }

      return {
        questionId: q.id,
        selectedOptionIndex: selected !== undefined ? selected : null,
        isCorrect
      };
    });

    Object.keys(topicStats).forEach(t => {
      const st = topicStats[t];
      st.percentage = st.total > 0 ? Math.round((st.correct / st.total) * 100) : 0;
    });

    const result: QuizResult = {
      id: `test-${Date.now()}`,
      timestamp: Date.now(),
      config: {
        mode,
        exam: selectedExam,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        questionCount: quizQuestions.length,
        timeLimitMinutes
      },
      totalQuestions: quizQuestions.length,
      score: correctCount,
      percentage: Math.round((correctCount / quizQuestions.length) * 100),
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unanswered: unansweredCount,
      timeSpentSeconds: timeSpent,
      topicBreakdown: topicStats,
      userAnswers: userAnswersList
    };

    saveTestResult(result);
    setCompletedResult(result);
    setSessionActive(false);
  };

  const handleAutoSubmitOnTimeout = () => {
    handleFinishTest();
  };

  // If a test just completed, show ResultsView
  if (completedResult) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <ResultsView
          result={completedResult}
          questions={quizQuestions}
          onRetake={() => {
            setCompletedResult(null);
            setSessionActive(false);
          }}
          onPracticeMistakes={() => {
            setActiveTab('mistakes');
          }}
        />
      </div>
    );
  }

  // ACTIVE QUIZ INTERFACE (Requirement #10 & #16)
  if (sessionActive && quizQuestions.length > 0) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const userChoice = userSelectedAnswers[currentQuestion.id];
    const isPracticeAnswered = mode === 'practice' && practiceAnsweredState[currentQuestion.id];
    const unansweredCount = quizQuestions.filter(q => userSelectedAnswers[q.id] === undefined || userSelectedAnswers[q.id] === null).length;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
        
        {/* Top Floating Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* Progress Count */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {mode === 'test' ? 'Exam Mode' : 'Practice Mode'}
            </span>
            <span className="text-base font-black text-slate-900 dark:text-white">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
          </div>

          {/* Timer Countdown (if timed) */}
          {mode === 'test' && timeLimitMinutes > 0 && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono font-bold text-xs ${
              timeRemainingSeconds <= 120 
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse border border-rose-500/30' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <Clock className="w-4 h-4" />
              <span>
                {Math.floor(timeRemainingSeconds / 60)}:
                {(timeRemainingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Finish / Unanswered Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUnansweredDrawer(!showUnansweredDrawer)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Unanswered ({unansweredCount})
            </button>

            <button
              onClick={handleFinishTest}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
            >
              Submit Test
            </button>
          </div>

        </div>

        {/* Small Question Indicator Dots / Grid Drawer */}
        {showUnansweredDrawer && (
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 animate-slide-down">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Question Navigator</span>
              <span>Click any number to jump</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quizQuestions.map((q, idx) => {
                const answered = userSelectedAnswers[q.id] !== undefined && userSelectedAnswers[q.id] !== null;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setShowUnansweredDrawer(false);
                    }}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition ${
                      isCurrent
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/40'
                        : answered
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Progress Bar */}
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%` }}
          />
        </div>

        {/* Question Box (Requirement #16) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Metadata Tag Line: Exam -> Year -> Topic -> Difficulty */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 font-mono">
                {currentQuestion.exam} {currentQuestion.year}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">
                {currentQuestion.topic}
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
                {currentQuestion.subtopic}
              </span>
            </div>

            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              currentQuestion.difficulty === 'Beginner' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' :
              currentQuestion.difficulty === 'Intermediate' ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400' :
              currentQuestion.difficulty === 'Advanced' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400' :
              'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Optional Molecule Diagram */}
          {currentQuestion.condensedMolecule && (
            <MoleculeRenderer
              condensedFormula={currentQuestion.condensedMolecule}
              compact
            />
          )}

          {/* Answering Options List A, B, C, D */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((optionText, optIdx) => {
              const isSelected = userChoice === optIdx;
              const isCorrectOpt = optIdx === currentQuestion.correctOptionIndex;

              let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50';

              if (mode === 'practice' && isPracticeAnswered) {
                if (isCorrectOpt) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/30';
                } else {
                  optionStyle = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400';
                }
              } else if (isSelected) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-bold';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base flex items-center justify-between gap-4 transition-all ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{optionText}</span>
                  </div>

                  {mode === 'practice' && isPracticeAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {mode === 'practice' && isPracticeAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback in Practice Mode Only */}
          {mode === 'practice' && isPracticeAnswered && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-slide-up">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  userChoice === currentQuestion.correctOptionIndex ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {userChoice === currentQuestion.correctOptionIndex ? 'Correct Answer!' : 'Review The Reasoning:'}
                </span>

                <button
                  onClick={() => openWhyModal(
                    `Why: ${currentQuestion.question}`,
                    currentQuestion.whyExplanation,
                    currentQuestion.ruleToRemember
                  )}
                  className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why?</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Bottom Navigation Buttons [Previous] [Next] (Requirement #16) */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < quizQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(quizQuestions.length - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishTest}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <span>Submit & Review Results</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    );
  }

  // QUIZ SETUP SCREEN (Requirement #8, #9, #10, #13)
  const uniqueTopics = ['ALL', ...Array.from(new Set(EXAM_QUESTIONS_DATA.map(q => q.topic)))];
  const questionCountOptions = [5, 10, 15, 20, 30, 50];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>WAEC • NECO • JAMB/UTME • IJMB Question Bank</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Organic Chemistry Exam Suite
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate real timed national examinations or practice topical drills with instant step-by-step reasoning.
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setMode('test')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              mode === 'test'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Exam Simulation
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              mode === 'practice'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Practice Mode
          </button>
        </div>
      </div>

      {/* Setup Config Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-500" />
          <span>Configure Your Session</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Examination Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Examination Body
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['ALL', 'JAMB', 'WAEC', 'NECO', 'IJMB'] as ExamCategory[]).map(exam => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => setSelectedExam(exam)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                    selectedExam === exam
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {exam === 'ALL' ? 'All Exams' : exam}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Organic Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {uniqueTopics.map(t => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Organic Topics (Mixed)' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Difficulties (Mixed)</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="IJMB/JAMB Challenge">IJMB / JAMB Challenge</option>
            </select>
          </div>

          {/* Question Count (Requirement #10) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Number of Questions
            </label>
            <div className="flex flex-wrap gap-2">
              {questionCountOptions.map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`w-11 h-9 rounded-xl text-xs font-bold transition ${
                    questionCount === cnt
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Settings (Requirement #13) */}
          {mode === 'test' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Exam Time Limit
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 10, 15, 20, 30].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimeLimitMinutes(mins)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                      timeLimitMinutes === mins
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mins === 0 ? 'Untimed' : `${mins} min`}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Practice Mode Behavior
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Untimed. Reveals instant explanations and "Why?" button after every answer.
              </p>
            </div>
          )}

        </div>

        {/* Start Button */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'test' 
              ? 'Results & step-by-step review will be shown upon test submission.' 
              : 'Immediate answers & rules shown after each choice.'}
          </div>

          <button
            onClick={handleStartQuiz}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
              mode === 'test' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start {mode === 'test' ? 'Timed Test' : 'Practice Session'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
