import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TestHistory, Question } from '@/types/test';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, XCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TestReview: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [testHistory] = useLocalStorage<TestHistory[]>('testHistory', []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const test = testHistory.find(t => t.id === testId);

  if (!test) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Test non trovato</h2>
          <Button onClick={() => navigate('/history')} className="mt-4">
            Torna allo storico
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const userAnswer = test.answers[currentQuestion.id];
  const isCorrect = userAnswer === currentQuestion.correctAnswer;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAnswerLabel = (index: number) => String.fromCharCode(65 + index);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/competition/${test.competitionId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Revisione Test</h1>
            <p className="text-muted-foreground">{test.competitionName}</p>
          </div>
        </div>

        {/* Test Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Riepilogo Test</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Modalità</p>
              <p className="font-semibold">
                {test.type === 'exam' ? 'Esame' : 'Allenamento'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Punteggio</p>
              <p className="font-semibold text-2xl">{test.score}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risposte Corrette</p>
              <p className="font-semibold">{test.correctAnswers}/{test.totalQuestions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo Impiegato</p>
              <p className="font-semibold">{formatTime(test.timeSpent)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data Completamento</p>
              <p className="font-semibold">{formatDate(test.completedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Argomenti</p>
              <p className="font-semibold">{test.subjects.join(', ')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Navigazione Domande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {test.questions.map((question, index) => {
                const userAnswer = test.answers[question.id];
                const isQuestionCorrect = userAnswer === question.correctAnswer;
                const isSelected = index === currentQuestionIndex;
                
                return (
                  <Button
                    key={question.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`relative ${
                      isQuestionCorrect 
                        ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                        : userAnswer !== undefined 
                          ? 'border-red-500 bg-red-50 hover:bg-red-100'
                          : ''
                    }`}
                    onClick={() => handleQuestionSelect(index)}
                  >
                    {index + 1}
                    {userAnswer !== undefined && (
                      <div className="absolute -top-1 -right-1">
                        {isQuestionCorrect ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Domanda {currentQuestionIndex + 1} di {test.questions.length}
              </CardTitle>
              <Badge variant={isCorrect ? "default" : "destructive"}>
                {isCorrect ? "Corretta" : "Errata"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => {
                  const isUserAnswer = userAnswer === index;
                  const isCorrectAnswer = index === currentQuestion.correctAnswer;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        isCorrectAnswer
                          ? 'border-green-500 bg-green-50'
                          : isUserAnswer && !isCorrectAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">
                          {getAnswerLabel(index)}.
                        </span>
                        <span>{option}</span>
                        {isCorrectAnswer && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {currentQuestion.explanation && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <h4 className="font-semibold">Spiegazione</h4>
                </div>
                <p className="text-muted-foreground">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Question Info */}
            <div className="flex gap-4 text-sm text-muted-foreground border-t pt-4">
              <span><strong>Argomento:</strong> {currentQuestion.subject}</span>
              <span><strong>Difficoltà:</strong> {currentQuestion.difficulty}</span>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Precedente
          </Button>
          
          <div className="text-sm text-muted-foreground self-center">
            {currentQuestionIndex + 1} di {test.questions.length}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentQuestionIndex === test.questions.length - 1}
            className="gap-2"
          >
            Successiva
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};