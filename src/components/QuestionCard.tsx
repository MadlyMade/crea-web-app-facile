import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, X, ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: string;
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  selectedAnswer?: number;
  showFeedback?: boolean;
  isReviewMode?: boolean;
  canNavigate?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  onPrevious,
  selectedAnswer,
  showFeedback = false,
  isReviewMode = false,
  canNavigate = true
}) => {
  const [tempSelected, setTempSelected] = useState<number | undefined>(selectedAnswer);

  const handleOptionSelect = (optionIndex: number) => {
    if (isReviewMode) return;
    
    setTempSelected(optionIndex);
    onAnswer(optionIndex);
  };

  const getOptionClasses = (optionIndex: number) => {
    const isSelected = (tempSelected ?? selectedAnswer) === optionIndex;
    const isCorrect = optionIndex === question.correctAnswer;
    const isIncorrect = isSelected && !isCorrect && showFeedback;

    return cn(
      "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md",
      {
        // Normal state
        "border-border bg-background hover:border-primary/50": !isSelected && !showFeedback,
        
        // Selected state (no feedback yet)
        "border-primary bg-primary/5": isSelected && !showFeedback,
        
        // Feedback states
        "border-green-500 bg-green-50 text-green-800": showFeedback && isCorrect,
        "border-red-500 bg-red-50 text-red-800": showFeedback && isIncorrect,
        "border-border bg-background": showFeedback && !isSelected && !isCorrect,
        
        // Review mode
        "cursor-default": isReviewMode,
        "cursor-pointer": !isReviewMode,
      }
    );
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!showFeedback) return null;
    
    const isCorrect = optionIndex === question.correctAnswer;
    const isSelected = (tempSelected ?? selectedAnswer) === optionIndex;
    
    if (isCorrect) {
      return <Check className="h-5 w-5 text-green-600 ml-auto flex-shrink-0" />;
    }
    
    if (isSelected && !isCorrect) {
      return <X className="h-5 w-5 text-red-600 ml-auto flex-shrink-0" />;
    }
    
    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Domanda {questionNumber} di {totalQuestions}
            </span>
            <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
              {question.subject}
            </span>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              {
                "bg-green-100 text-green-800": question.difficulty === 'easy',
                "bg-yellow-100 text-yellow-800": question.difficulty === 'medium',
                "bg-red-100 text-red-800": question.difficulty === 'hard',
              }
            )}>
              {question.difficulty === 'easy' ? 'Facile' : 
               question.difficulty === 'medium' ? 'Medio' : 'Difficile'}
            </span>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold leading-relaxed">
          {question.question}
        </h2>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={getOptionClasses(index)}
              disabled={isReviewMode}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 border-2 border-current rounded-full flex items-center justify-center text-sm font-semibold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-sm">{option}</span>
                {getOptionIcon(index)}
              </div>
            </button>
          ))}
        </div>

        {showFeedback && selectedAnswer !== undefined && (
          <div className="space-y-4">
            <div className={cn(
              "p-4 rounded-lg border-2",
              {
                "border-green-500 bg-green-50": selectedAnswer === question.correctAnswer,
                "border-red-500 bg-red-50": selectedAnswer !== question.correctAnswer,
              }
            )}>
              <div className="flex items-center gap-2">
                {selectedAnswer === question.correctAnswer ? (
                  <>
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Risposta esatta!</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Risposta errata</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Show correct answer and explanation */}
            <div className="bg-blue-50 border-2 border-blue-200 text-blue-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-green-600">
                  ✓ Risposta Corretta: {String.fromCharCode(65 + question.correctAnswer)}
                </span>
              </div>
              {question.explanation && (
                <p className="text-sm mt-2 leading-relaxed text-blue-700">
                  {question.explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {canNavigate && (
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={questionNumber === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Precedente
            </Button>

            <Button
              onClick={onNext}
              disabled={questionNumber === totalQuestions && !isReviewMode}
              className="gap-2"
            >
              {questionNumber === totalQuestions && !isReviewMode ? 'Termina' : 'Successiva'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};