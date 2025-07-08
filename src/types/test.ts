export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestSession {
  id: string;
  userName: string;
  type: 'exam' | 'training';
  questions: Question[];
  answers: Record<number, number>; // questionId -> selectedOption
  correctAnswers: number[];
  incorrectAnswers: number[];
  startTime: Date;
  endTime?: Date;
  isPaused: boolean;
  timeLimit: number; // in seconds
  timeRemaining?: number;
  subjects?: string[];
  score?: number;
  totalQuestions: number;
  currentQuestion: number;
  isCompleted: boolean;
}

export interface TestConfig {
  type: 'exam' | 'training';
  subjects: string[];
  questionCount: number;
  timeLimit: number; // in minutes
  userName: string;
}

export interface TestHistory {
  id: string;
  userName: string;
  type: 'exam' | 'training';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
  timeSpent: number; // in seconds
  subjects: string[];
}