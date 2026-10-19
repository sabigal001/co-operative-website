export type NavigationTab = 
  | 'home' 
  | 'learn' 
  | 'nomenclature' 
  | 'isomers' 
  | 'practice' 
  | 'quiz' 
  | 'mistakes'
  | 'progress';

export type ExamCategory = 'JAMB' | 'WAEC' | 'NECO' | 'IJMB' | 'ALL';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'IJMB/JAMB Challenge';

export type ChemistryTopic = 
  | 'chain_identification'
  | 'numbering_rules'
  | 'prefixes_alkanes'
  | 'alkenes_alkynes'
  | 'alkyl_substituents'
  | 'alcohols'
  | 'aldehydes'
  | 'ketones'
  | 'carboxylic_acids'
  | 'esters'
  | 'amines_amides'
  | 'haloalkanes'
  | 'aromatics'
  | 'multifunctional'
  | 'isomerism_structural'
  | 'isomerism_stereoisomers';

export interface Lesson {
  id: string;
  topicId: ChemistryTopic;
  title: string;
  category: 'Fundamentals' | 'Hydrocarbons' | 'Functional Groups' | 'Special Topics';
  difficulty: DifficultyLevel;
  duration: string;
  summary: string;
  explanation: string;
  keyRule: string;
  whyExplanation: string;
  visualMolecule: {
    condensed: string;
    iupacName: string;
    parentChainCarbons: number;
    highlights?: { [carbonIndex: number]: string }; // e.g. 1: 'Parent Chain', 3: 'Methyl Branch'
    notes?: string;
  };
  keyTakeaways: string[];
  commonMistakes: string[];
}

export interface NamingStep {
  stepNumber: number;
  title: string; // e.g. "Step 1: Identify the main functional group"
  highlightedFocus: 'functional_group' | 'parent_chain' | 'numbering' | 'substituents' | 'locants' | 'assembly' | 'final';
  explanation: string;
  whyThisStep: string;
  ruleCitation: string;
  visualFeedback: {
    condensedFormula: string;
    highlightedIndices?: number[]; // Carbon numbers or parts
    badge?: string;
  };
}

export interface CompoundNomenclatureModel {
  id: string;
  name: string;
  commonName?: string;
  formula: string;
  condensedFormula: string;
  difficulty: DifficultyLevel;
  family: string;
  description: string;
  carbonsCount: number;
  functionalGroup: string;
  carbonNodes: {
    id: number;
    label: string; // e.g. "CH3", "CH2", "CH", "C", "OH"
    numberLtoR: number; // numbering left to right
    numberRtoL: number; // numbering right to left
    correctNumber: number; // IUPAC chosen number
    isParentChain: boolean;
    substituent?: string;
    isFunctionalGroup?: boolean;
  }[];
  steps: NamingStep[];
}

export interface IsomerPairModel {
  id: string;
  type: 'Chain' | 'Position' | 'Functional Group' | 'Geometric (Cis/Trans & E/Z)' | 'Optical (Enantiomers)';
  molecularFormula: string;
  title: string;
  conceptSummary: string;
  whyAreTheyIsomers: string;
  keyDifferentiatingRule: string;
  compoundA: {
    name: string;
    condensed: string;
    structuralType: string;
    boilingPoint?: string;
    notes: string;
    diagramType?: 'chain' | 'branched' | 'cis' | 'trans' | 'chiral';
  };
  compoundB: {
    name: string;
    condensed: string;
    structuralType: string;
    boilingPoint?: string;
    notes: string;
    diagramType?: 'chain' | 'branched' | 'cis' | 'trans' | 'chiral';
  };
  educationalInsight: string;
}

export interface ExamQuestion {
  id: string;
  exam: 'JAMB' | 'WAEC' | 'NECO' | 'IJMB';
  year: number;
  topic: string;
  subtopic: string;
  difficulty: DifficultyLevel;
  question: string;
  condensedMolecule?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  whyExplanation: string;
  ruleToRemember: string;
  namingStepsBreakdown?: string[];
}

export interface QuizTestConfig {
  mode: 'practice' | 'test';
  exam: ExamCategory;
  topic: string;
  difficulty: string;
  questionCount: number;
  timeLimitMinutes: number; // 0 for untimed
}

export interface QuizResult {
  id: string;
  timestamp: number;
  config: QuizTestConfig;
  totalQuestions: number;
  score: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  timeSpentSeconds: number;
  topicBreakdown: {
    [topic: string]: {
      total: number;
      correct: number;
      percentage: number;
    };
  };
  userAnswers: {
    questionId: string;
    selectedOptionIndex: number | null;
    isCorrect: boolean;
  }[];
}

export interface UserMistakeRecord {
  questionId: string;
  exam: string;
  year: number;
  topic: string;
  question: string;
  selectedOptionIndex: number;
  correctOptionIndex: number;
  timestamp: number;
  practiceCount: number;
  lastMastered: boolean;
}

export interface UserProgressState {
  completedLessons: string[];
  practiceStreak: number;
  lastActiveDate: string;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  testHistory: QuizResult[];
  mistakes: UserMistakeRecord[];
}
