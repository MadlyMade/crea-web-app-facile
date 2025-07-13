
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TestHistory } from '@/types/test';
import { ArrowLeft, Trophy, Clock, BookOpen, GraduationCap, Eye } from 'lucide-react';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [testHistory] = useLocalStorage<TestHistory[]>('testHistory', []);

  const examHistory = testHistory.filter(t => t.type === 'exam');
  const trainingHistory = testHistory.filter(t => t.type === 'training');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const handleViewTest = (testId: string) => {
    navigate(`/test-review/${testId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Storico Test</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Exam History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Esami ({examHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {examHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nessun esame completato</p>
              ) : (
                examHistory.slice(-5).reverse().map((test) => (
                  <div key={test.id} className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => handleViewTest(test.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium">{formatDate(test.completedAt)}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-primary">{test.score}%</div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Domande: {test.correctAnswers}/{test.totalQuestions}</div>
                      <div>Tempo: {formatTime(test.timeSpent)}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Training History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Allenamenti ({trainingHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trainingHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nessun allenamento completato</p>
              ) : (
                trainingHistory.slice(-5).reverse().map((test) => (
                  <div key={test.id} className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => handleViewTest(test.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-medium">{formatDate(test.completedAt)}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-primary">{test.score}%</div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Domande: {test.correctAnswers}/{test.totalQuestions}</div>
                      <div>Tempo: {formatTime(test.timeSpent)}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
