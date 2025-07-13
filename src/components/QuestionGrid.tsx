
import React from 'react';
import { cn } from '@/lib/utils';

interface QuestionGridProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[];
  correctAnswers: number[];
  incorrectAnswers: number[];
  onQuestionSelect: (questionNumber: number) => void;
  isReviewMode?: boolean;
  testType?: 'exam' | 'training';
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  correctAnswers,
  incorrectAnswers,
  onQuestionSelect,
  isReviewMode = false,
  testType = 'training'
}) => {
  const getQuestionStatus = (questionNumber: number) => {
    // In review mode, show correct/incorrect status
    if (isReviewMode) {
      if (correctAnswers.includes(questionNumber)) {
        return 'correct';
      }
      if (incorrectAnswers.includes(questionNumber)) {
        return 'incorrect';
      }
    }
    
    // During active test, only show answered/unanswered
    if (answeredQuestions.includes(questionNumber)) {
      return 'answered';
    }
    return 'unanswered';
  };

  const getQuestionClasses = (questionNumber: number) => {
    const status = getQuestionStatus(questionNumber);
    const isCurrent = questionNumber === currentQuestion;
    
    return cn(
      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-105",
      {
        // Current question ring
        "ring-2 ring-primary ring-offset-2": isCurrent && !isReviewMode,
        
        // Review mode status colors
        "bg-green-500 text-white": isReviewMode && status === 'correct',
        "bg-red-500 text-white": isReviewMode && status === 'incorrect',
        
        // Active test status colors
        "bg-blue-600 text-white": !isReviewMode && status === 'answered' && testType === 'exam',
        "bg-green-500 text-white": !isReviewMode && status === 'answered' && testType === 'training' && correctAnswers.includes(questionNumber),
        "bg-red-500 text-white": !isReviewMode && status === 'answered' && testType === 'training' && incorrectAnswers.includes(questionNumber),
        
        // Unanswered questions
        "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600": status === 'unanswered',
        
        // Current question highlight (override other colors)
        "!bg-primary !text-primary-foreground": isCurrent && !isReviewMode,
      }
    );
  };

  return (
    <div className="grid grid-cols-9 sm:grid-cols-12 lg:grid-cols-18 gap-2 p-4 bg-card rounded-lg shadow-sm">
      {Array.from({ length: totalQuestions }, (_, index) => {
        const questionNumber = index + 1;
        return (
          <button
            key={questionNumber}
            onClick={() => onQuestionSelect(questionNumber)}
            className={getQuestionClasses(questionNumber)}
            disabled={isReviewMode && !answeredQuestions.includes(questionNumber)}
          >
            {questionNumber}
          </button>
        );
      })}
    </div>
  );
};
