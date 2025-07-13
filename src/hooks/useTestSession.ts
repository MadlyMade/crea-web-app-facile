import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TestSession, Question, TestConfig, TestHistory } from '@/types/test';
import questionsData from '@/data/questions.json';
import { useToast } from '@/hooks/use-toast';

export const useTestSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { config } = location.state || {};
  
  const [currentSession, setCurrentSession] = useLocalStorage<TestSession | null>('currentTestSession', null);
  const [testHistory, setTestHistory] = useLocalStorage<TestHistory[]>('testHistory', []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [userName, setUserName] = useLocalStorage<string>('userName', '');

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

  // Initialize or resume test session
  useEffect(() => {
    if (!config && !currentSession) {
      navigate('/');
      return;
    }

    if (config && !currentSession) {
      // Save user name
      if (config.userName && config.userName !== userName) {
        setUserName(config.userName);
      }
      
      // Create new test session with unique questions
      const selectedQuestions = getRandomQuestions(config);
      const newSession: TestSession = {
        id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userName: config.userName,
        competitionId: config.competitionId || 'default',
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
      setIsTimerActive(true);
    } else if (currentSession) {
      // Resume existing session
      setCurrentQuestionIndex(currentSession.currentQuestion - 1);
      setIsTimerActive(!currentSession.isPaused);
    }
  }, [config, currentSession, navigate, setCurrentSession, userName, setUserName]);

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
      competitionId: currentSession.competitionId,
      competitionName: 'Concorso', // Will be updated with actual competition name
      type: currentSession.type,
      score,
      totalQuestions: currentSession.questions.length,
      correctAnswers: correctCount,
      completedAt: endTime,
      timeSpent,
      subjects: currentSession.subjects || [],
      questions: currentSession.questions,
      answers: currentSession.answers
    };

    // Save to history and clear current session
    setTestHistory(prev => {
      const newHistory = [...prev, historyEntry];
      console.log('Saving to history:', historyEntry);
      console.log('Full history:', newHistory);
      return newHistory;
    });
    
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

    // Show immediate feedback only in training mode
    if (currentSession.type === 'training') {
      toast({
        title: isCorrect ? "Risposta corretta!" : "Risposta errata",
        description: isCorrect 
          ? "Ottimo lavoro!" 
          : `La risposta corretta è: ${String.fromCharCode(65 + currentQuestion.correctAnswer)}`,
        variant: isCorrect ? "default" : "destructive"
      });
    }

    // Auto-advance to next question after a short delay (except on last question)
    if (currentQuestionIndex < currentSession.questions.length - 1) {
      setTimeout(() => {
        if (currentQuestionIndex < currentSession.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setCurrentSession(prev => prev ? { ...prev, currentQuestion: currentQuestionIndex + 2 } : prev);
        }
      }, currentSession.type === 'training' ? 1500 : 500); // Longer delay in training to see feedback
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
  }, [currentSession, currentQuestionIndex, setCurrentSession, completeTest]);

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
  }, [completeTest]);

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

  return {
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
  };
};