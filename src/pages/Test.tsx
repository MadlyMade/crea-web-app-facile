
import React from 'react';
import { QuestionGrid } from '@/components/QuestionGrid';
import { QuestionCard } from '@/components/QuestionCard';
import { TestHeader } from '@/components/TestHeader';
import { useTestSession } from '@/hooks/useTestSession';

export const Test: React.FC = () => {
  const {
    currentSession,
    currentQuestionIndex,
    isTimerActive,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleQuestionSelect,
    handlePause,
    handleResume,
    handleTimeUp,
    handleSaveAndExit,
    completeTest
  } = useTestSession();

  if (!currentSession) {
    return <div>Caricamento...</div>;
  }

  const currentQuestion = currentSession.questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(currentSession.answers).map(Number);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <TestHeader
          currentSession={currentSession}
          isTimerActive={isTimerActive}
          onSaveAndExit={handleSaveAndExit}
          onEndTest={completeTest}
          onTimeUp={handleTimeUp}
          onPause={handlePause}
          onResume={handleResume}
        />

        {/* Question Grid */}
        <QuestionGrid
          totalQuestions={currentSession.questions.length}
          currentQuestion={currentSession.currentQuestion}
          answeredQuestions={answeredQuestions}
          correctAnswers={currentSession.correctAnswers}
          incorrectAnswers={currentSession.incorrectAnswers}
          onQuestionSelect={handleQuestionSelect}
          testType={currentSession.type}
        />

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={currentSession.questions.length}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          selectedAnswer={currentSession.answers[currentQuestion.id]}
          showFeedback={currentSession.type === 'training' && currentSession.answers[currentQuestion.id] !== undefined}
        />
      </div>
    </div>
  );
};
