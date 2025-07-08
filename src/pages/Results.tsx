import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Target, Home } from 'lucide-react';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = location.state || {};

  if (!session) {
    navigate('/');
    return null;
  }

  const correctAnswers = Object.entries(session.answers).filter(
    ([questionId, answer]) => {
      const question = session.questions.find(q => q.id === parseInt(questionId));
      return question && answer === question.correctAnswer;
    }
  ).length;

  const score = Math.round((correctAnswers / session.questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Test Completato!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{score}%</div>
              <div className="text-sm text-muted-foreground">Punteggio</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg">
              <div className="text-2xl font-bold text-secondary-foreground">{correctAnswers}/{session.questions.length}</div>
              <div className="text-sm text-muted-foreground">Risposte corrette</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Modalità:</span>
              <span className="font-medium">{session.type === 'exam' ? 'Esame' : 'Allenamento'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tempo impiegato:</span>
              <span className="font-medium">
                {Math.floor((session.endTime - session.startTime) / (1000 * 60))} minuti
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Materie:</span>
              <span className="font-medium">{session.subjects?.length || 0} materie</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => navigate('/')} className="flex-1 gap-2">
              <Home className="h-4 w-4" />
              Torna alla Home
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/history')}
              className="flex-1 gap-2"
            >
              <Clock className="h-4 w-4" />
              Visualizza Storico
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};