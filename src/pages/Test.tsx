import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionGrid } from '@/components/QuestionGrid';
import { QuestionCard } from '@/components/QuestionCard';
import { Timer } from '@/components/Timer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TestSession, Question, TestConfig, TestHistory } from '@/types/test';
import questionsData from '@/data/questions.json';
import { ArrowLeft, Save, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Test: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { config } = location.state || {};
  
  const [currentSession, setCurrentSession] = useLocalStorage<TestSession | null>('currentTestSession', null);
  const [testHistory, setTestHistory] = useLocalStorage<TestHistory[]>('testHistory', []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Initialize or resume test session
  useEffect(() => {
    if (!config && !currentSession) {
      navigate('/');
      return;
    }

    if (config && !currentSession) {
      // Create new test session
      const selectedQuestions = getRandomQuestions(config);
      const newSession: TestSession = {
        id: `test_${Date.now()}`,
        userName: config.userName,
        type: config.type,
        questions: selectedQuestions,
        answers: {},
        correctAnswers: [],
        incorrectAnswers: [],
        startTime: new Date(),
        isPaused: false,
        timeLimit: config.timeLimit * 60, // convert to seconds
        timeRemaining: config.timeLimit * 60,
        subjects: config.subjects,
        totalQuestions: selectedQuestions.length,
        currentQuestion: 1,
        isCompleted: false
      };
      setCurrentSession(newSession);
      setCurrentQuestionIndex(0);
    } else if (currentSession) {
      // Resume existing session
      setCurrentQuestionIndex(currentSession.currentQuestion - 1);
      setIsTimerActive(!currentSession.isPaused);
    }
  }, [config, currentSession, navigate, setCurrentSession]);

  const getRandomQuestions = (config: TestConfig): Question[] => {
    const availableQuestions = questionsData.filter(q => 
      config.subjects.includes(q.subject)
    );
    
    // Shuffle and take required number
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, config.questionCount).map(q => ({
      ...q,
      difficulty: q.difficulty as 'easy' | 'medium' | 'hard'
    }));
  };

  const handleAnswer = useCallback((selectedOption: number) => {
    if (!currentSession) return;

    const currentQuestion = currentSession.questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    setCurrentSession(prev => {
      if (!prev) return prev;
      
      const newAnswers = { ...prev.answers, [currentQuestion.id]: selectedOption };
      const newCorrectAnswers = isCorrect && currentSession.type === 'training' 
        ? [...prev.correctAnswers.filter(id => id !== currentQuestion.id), currentQuestion.id]
        : prev.correctAnswers;
      const newIncorrectAnswers = !isCorrect && currentSession.type === 'training'
        ? [...prev.incorrectAnswers.filter(id => id !== currentQuestion.id), currentQuestion.id]
        : prev.incorrectAnswers;

      return {
        ...prev,
        answers: newAnswers,
        correctAnswers: newCorrectAnswers,
        incorrectAnswers: newIncorrectAnswers
      };
    });

    if (currentSession.type === 'training') {
      toast({
        title: isCorrect ? "Risposta corretta!" : "Risposta errata",
        description: isCorrect 
          ? "Ottimo lavoro!" 
          : `La risposta corretta è: ${String.fromCharCode(65 + currentQuestion.correctAnswer)}`,
        variant: isCorrect ? "default" : "destructive"
      });
    }
  }, [currentSession, currentQuestionIndex, setCurrentSession, toast]);

  const handleNext = useCallback(() => {
    if (!currentSession) return;

    if (currentQuestionIndex < currentSession.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentSession(prev => prev ? { ...prev, currentQuestion: currentQuestionIndex + 2 } : prev);
    } else {
      // Test completed
      completeTest();
    }
  }, [currentSession, currentQuestionIndex, setCurrentSession]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentSession(prev => prev ? { ...prev, currentQuestion: currentQuestionIndex } : prev);
    }
  }, [currentQuestionIndex, setCurrentSession]);

  const handleQuestionSelect = useCallback((questionNumber: number) => {
    setCurrentQuestionIndex(questionNumber - 1);
    setCurrentSession(prev => prev ? { ...prev, currentQuestion: questionNumber } : prev);
  }, [setCurrentSession]);

  const handlePause = useCallback(() => {
    if (currentSession?.type === 'training') {
      setIsTimerActive(false);
      setCurrentSession(prev => prev ? { ...prev, isPaused: true } : prev);
      toast({
        title: "Test in pausa",
        description: "Il test è stato messo in pausa. Puoi riprenderlo in qualsiasi momento."
      });
    }
  }, [currentSession, setCurrentSession, toast]);

  const handleResume = useCallback(() => {
    setIsTimerActive(true);
    setCurrentSession(prev => prev ? { ...prev, isPaused: false } : prev);
    toast({
      title: "Test ripreso",
      description: "Il test è stato ripreso."
    });
  }, [setCurrentSession, toast]);

  const handleTimeUp = useCallback(() => {
    completeTest();
  }, []);

  const completeTest = useCallback(() => {
    if (!currentSession) return;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - currentSession.startTime.getTime()) / 1000);
    
    // Calculate final score
    let correctCount = 0;
    currentSession.questions.forEach(question => {
      const userAnswer = currentSession.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / currentSession.questions.length) * 100);

    // Create history entry
    const historyEntry: TestHistory = {
      id: currentSession.id,
      userName: currentSession.userName,
      type: currentSession.type,
      score,
      totalQuestions: currentSession.questions.length,
      correctAnswers: correctCount,
      completedAt: endTime,
      timeSpent,
      subjects: currentSession.subjects || []
    };

    // Save to history
    setTestHistory(prev => [...prev, historyEntry]);

    // Clear current session
    setCurrentSession(null);

    // Navigate to results
    navigate('/results', { 
      state: { 
        session: {
          ...currentSession,
          endTime,
          score,
          isCompleted: true
        }
      } 
    });
  }, [currentSession, navigate, setCurrentSession, setTestHistory]);

  const handleSaveAndExit = useCallback(() => {
    if (currentSession?.type === 'training') {
      setCurrentSession(prev => prev ? { ...prev, isPaused: true } : prev);
      toast({
        title: "Progresso salvato",
        description: "Il tuo progresso è stato salvato. Puoi continuare più tardi."
      });
      navigate('/');
    } else {
      // For exam mode, ask for confirmation
      if (window.confirm('Sei sicuro di voler uscire dall\'esame? Il progresso verrà perso.')) {
        setCurrentSession(null);
        navigate('/');
      }
    }
  }, [currentSession, navigate, setCurrentSession, toast]);

  if (!currentSession) {
    return <div>Caricamento...</div>;
  }

  const currentQuestion = currentSession.questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(currentSession.answers).map(Number);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveAndExit}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    {currentSession.type === 'exam' ? 'Esame' : 'Allenamento'} - {currentSession.userName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Punteggio: {Object.keys(currentSession.answers).length}/{currentSession.questions.length} domande completate
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {currentSession.type === 'training' && (
                  <Button
                    variant="outline"
                    onClick={handleSaveAndExit}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Salva ed Esci
                  </Button>
                )}
                
                {currentSession.timeLimit > 0 && (
                  <Timer
                    initialTime={currentSession.timeRemaining || currentSession.timeLimit}
                    onTimeUp={handleTimeUp}
                    isActive={isTimerActive}
                    onPause={handlePause}
                    onResume={handleResume}
                    canPause={currentSession.type === 'training'}
                  />
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Question Grid */}
        <QuestionGrid
          totalQuestions={currentSession.questions.length}
          currentQuestion={currentSession.currentQuestion}
          answeredQuestions={answeredQuestions}
          correctAnswers={currentSession.correctAnswers}
          incorrectAnswers={currentSession.incorrectAnswers}
          onQuestionSelect={handleQuestionSelect}
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