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
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  correctAnswers,
  incorrectAnswers,
  onQuestionSelect,
  isReviewMode = false
}) => {
  const getQuestionStatus = (questionNumber: number) => {
    if (correctAnswers.includes(questionNumber)) {
      return 'correct';
    }
    if (incorrectAnswers.includes(questionNumber)) {
      return 'incorrect';
    }
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
        // Current question
        "ring-2 ring-primary ring-offset-2": isCurrent && !isReviewMode,
        
        // Status colors
        "bg-green-500 text-white": status === 'correct',
        "bg-red-500 text-white": status === 'incorrect',
        "bg-blue-500 text-white": status === 'answered' && !correctAnswers.includes(questionNumber) && !incorrectAnswers.includes(questionNumber),
        "bg-gray-200 text-gray-700 hover:bg-gray-300": status === 'unanswered',
        
        // Current question highlight
        "bg-primary text-primary-foreground": isCurrent && status === 'unanswered' && !isReviewMode,
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