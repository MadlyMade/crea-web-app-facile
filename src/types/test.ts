export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string; // Spiegazione della risposta corretta
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  examTimeLimit: number; // in minutes
  subjects: string[];
  questions: Question[];
  isDefault: boolean;
  createdAt: Date;
}

export interface TestSession {
  id: string;
  userName: string;
  competitionId: string; // ID del concorso
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
  competitionId?: string;
}

export interface TestHistory {
  id: string;
  userName: string;
  competitionId: string; // ID del concorso
  competitionName: string;
  type: 'exam' | 'training';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
  timeSpent: number; // in seconds
  subjects: string[];
  questions: Question[]; // Per consultazione
  answers: Record<number, number>; // Per consultazione
}