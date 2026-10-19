import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  NavigationTab, 
  QuizResult, 
  UserMistakeRecord, 
  ExamQuestion 
} from '../types/chemistry';
import { EXAM_QUESTIONS_DATA } from '../data/examQuestionsData';

interface WhyModalData {
  title: string;
  content: string;
  ruleCitation?: string;
}

interface ChemistryContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCompoundId: string;
  setSelectedCompoundId: (id: string) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  practicePresetTopic: string | null;
  setPracticePresetTopic: (topic: string | null) => void;
  
  // Why Modal
  whyModalData: WhyModalData | null;
  openWhyModal: (title: string, content: string, ruleCitation?: string) => void;
  closeWhyModal: () => void;

  // Progress & Stats
  completedLessons: string[];
  toggleLessonCompleted: (lessonId: string) => void;
  practiceStreak: number;
  testHistory: QuizResult[];
  saveTestResult: (result: QuizResult) => void;
  mistakes: UserMistakeRecord[];
  logMistake: (question: ExamQuestion, selectedOption: number) => void;
  markMistakeResolved: (questionId: string) => void;
  clearAllMistakes: () => void;
  weakTopics: { topic: string; scorePercent: number; count: number }[];
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'orgchem_coach_data_v1';

const ChemistryContext = createContext<ChemistryContextType | undefined>(undefined);

export const ChemistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedCompoundId, setSelectedCompoundId] = useState<string>('compound-1-methylbutanol');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [practicePresetTopic, setPracticePresetTopic] = useState<string | null>(null);
  const [whyModalData, setWhyModalData] = useState<WhyModalData | null>(null);

  // Persistent user state
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [practiceStreak, setPracticeStreak] = useState<number>(1);
  const [testHistory, setTestHistory] = useState<QuizResult[]>([]);
  const [mistakes, setMistakes] = useState<UserMistakeRecord[]>([]);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedLessons) setCompletedLessons(parsed.completedLessons);
        if (parsed.testHistory) setTestHistory(parsed.testHistory);
        if (parsed.mistakes) setMistakes(parsed.mistakes);
        if (parsed.practiceStreak) setPracticeStreak(parsed.practiceStreak);

        // Check streak continuation
        const lastDate = parsed.lastActiveDate;
        const today = new Date().toISOString().slice(0, 10);
        if (lastDate && lastDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          if (lastDate === yesterday) {
            setPracticeStreak(prev => prev + 1);
          }
        }
      } else {
        // Initialize with default 1-day streak
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          completedLessons: ['lesson-1-chain'],
          practiceStreak: 1,
          lastActiveDate: new Date().toISOString().slice(0, 10),
          testHistory: [],
          mistakes: []
        }));
        setCompletedLessons(['lesson-1-chain']);
      }
    } catch (e) {
      console.error('Failed to load chemistry progress:', e);
    }
  }, []);

  // Save to local storage on update
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completedLessons,
        practiceStreak,
        lastActiveDate: today,
        testHistory,
        mistakes
      }));
    } catch (e) {
      console.error('Failed to persist chemistry progress:', e);
    }
  }, [completedLessons, practiceStreak, testHistory, mistakes]);

  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  const openWhyModal = (title: string, content: string, ruleCitation?: string) => {
    setWhyModalData({ title, content, ruleCitation });
  };

  const closeWhyModal = () => {
    setWhyModalData(null);
  };

  const saveTestResult = (result: QuizResult) => {
    setTestHistory(prev => [result, ...prev]);
  };

  const logMistake = (question: ExamQuestion, selectedOption: number) => {
    setMistakes(prev => {
      const existing = prev.find(m => m.questionId === question.id);
      if (existing) {
        return prev.map(m => m.questionId === question.id ? {
          ...m,
          selectedOptionIndex: selectedOption,
          timestamp: Date.now(),
          practiceCount: m.practiceCount + 1,
          lastMastered: false
        } : m);
      }
      return [
        {
          questionId: question.id,
          exam: question.exam,
          year: question.year,
          topic: question.topic,
          question: question.question,
          selectedOptionIndex: selectedOption,
          correctOptionIndex: question.correctOptionIndex,
          timestamp: Date.now(),
          practiceCount: 1,
          lastMastered: false
        },
        ...prev
      ];
    });
  };

  const markMistakeResolved = (questionId: string) => {
    setMistakes(prev => prev.filter(m => m.questionId !== questionId));
  };

  const clearAllMistakes = () => {
    setMistakes([]);
  };

  const resetAllProgress = () => {
    setCompletedLessons([]);
    setTestHistory([]);
    setMistakes([]);
    setPracticeStreak(1);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Calculate weak topics from testHistory and mistakes
  const weakTopics = React.useMemo(() => {
    const topicStats: { [topic: string]: { total: number; correct: number } } = {};

    testHistory.forEach(test => {
      Object.entries(test.topicBreakdown || {}).forEach(([topic, stats]) => {
        if (!topicStats[topic]) {
          topicStats[topic] = { total: 0, correct: 0 };
        }
        topicStats[topic].total += stats.total;
        topicStats[topic].correct += stats.correct;
      });
    });

    // Also factor in current mistakes
    mistakes.forEach(m => {
      if (!topicStats[m.topic]) {
        topicStats[m.topic] = { total: 2, correct: 0 };
      } else {
        topicStats[m.topic].total += 1;
      }
    });

    return Object.entries(topicStats)
      .map(([topic, stats]) => ({
        topic,
        scorePercent: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        count: stats.total
      }))
      .sort((a, b) => a.scorePercent - b.scorePercent);
  }, [testHistory, mistakes]);

  return (
    <ChemistryContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCompoundId,
        setSelectedCompoundId,
        selectedLessonId,
        setSelectedLessonId,
        practicePresetTopic,
        setPracticePresetTopic,
        whyModalData,
        openWhyModal,
        closeWhyModal,
        completedLessons,
        toggleLessonCompleted,
        practiceStreak,
        testHistory,
        saveTestResult,
        mistakes,
        logMistake,
        markMistakeResolved,
        clearAllMistakes,
        weakTopics,
        resetAllProgress
      }}
    >
      {children}
    </ChemistryContext.Provider>
  );
};

export const useChemistry = () => {
  const context = useContext(ChemistryContext);
  if (!context) {
    throw new Error('useChemistry must be used within a ChemistryProvider');
  }
  return context;
};
