import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Competition, TestHistory } from '@/types/test';
import { ArrowLeft, BookOpen, Trophy, Clock, History } from 'lucide-react';

export const CompetitionDetail: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();
  const [competitions] = useLocalStorage<Competition[]>('competitions', []);
  const [testHistory] = useLocalStorage<TestHistory[]>('testHistory', []);

  const competition = competitions.find(c => c.id === competitionId);
  const competitionHistory = testHistory.filter(h => h.competitionId === competitionId);
  const examHistory = competitionHistory.filter(h => h.type === 'exam');
  const trainingHistory = competitionHistory.filter(h => h.type === 'training');

  if (!competition) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Concorso non trovato</h2>
          <Button onClick={() => navigate('/competitions')} className="mt-4">
            Torna ai concorsi
          </Button>
        </div>
      </div>
    );
  }

  const handleStartExam = () => {
    const config = {
      type: 'exam' as const,
      subjects: competition.subjects,
      questionCount: Math.min(30, competition.questions.length),
      timeLimit: competition.examTimeLimit,
      userName: '', // Will be filled from localStorage
      competitionId: competition.id
    };
    navigate('/test', { state: { config } });
  };

  const handleStartTraining = () => {
    const config = {
      type: 'training' as const,
      subjects: competition.subjects,
      questionCount: Math.min(20, competition.questions.length),
      timeLimit: 0, // No time limit for training
      userName: '', // Will be filled from localStorage
      competitionId: competition.id
    };
    navigate('/test', { state: { config } });
  };

  const handleViewTest = (testId: string) => {
    navigate(`/test-review/${testId}`);
  };

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/competitions')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {competition.isDefault ? (
                <Trophy className="h-6 w-6 text-yellow-500" />
              ) : (
                <BookOpen className="h-6 w-6 text-blue-500" />
              )}
              {competition.name}
            </h1>
            <p className="text-muted-foreground">{competition.description}</p>
          </div>
        </div>

        {/* Competition Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Concorso</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tempo Esame</p>
              <p className="font-semibold">{competition.examTimeLimit} minuti</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Domande Totali</p>
              <p className="font-semibold">{competition.questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Argomenti</p>
              <p className="font-semibold">{competition.subjects.join(', ')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Test Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleStartExam}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-red-500" />
                Modalità Esame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Simula un vero esame con tempo limitato e senza feedback immediato
              </p>
              <div className="space-y-2 text-xs">
                <p><strong>Durata:</strong> {competition.examTimeLimit} minuti</p>
                <p><strong>Domande:</strong> Massimo 30</p>
                <p><strong>Feedback:</strong> Solo alla fine</p>
              </div>
              <Button className="w-full mt-4" onClick={handleStartExam}>
                <Clock className="h-4 w-4 mr-2" />
                Inizia Esame
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleStartTraining}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Modalità Allenamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Allenati senza pressione, con feedback immediato
              </p>
              <div className="space-y-2 text-xs">
                <p><strong>Durata:</strong> Illimitata</p>
                <p><strong>Domande:</strong> Massimo 20</p>
                <p><strong>Feedback:</strong> Immediato</p>
              </div>
              <Button className="w-full mt-4" variant="outline" onClick={handleStartTraining}>
                <BookOpen className="h-4 w-4 mr-2" />
                Inizia Allenamento
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-red-500" />
                Storico Esami ({examHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {examHistory.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {examHistory.slice(-10).reverse().map((test, index) => (
                    <div 
                      key={test.id}
                      className="border rounded p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleViewTest(test.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Esame #{examHistory.length - index}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(test.completedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{test.score}%</p>
                          <p className="text-xs text-muted-foreground">
                            {test.correctAnswers}/{test.totalQuestions}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Tempo: {formatTime(test.timeSpent)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2" />
                  <p>Nessun esame completato</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Storico Allenamenti ({trainingHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trainingHistory.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {trainingHistory.slice(-10).reverse().map((test, index) => (
                    <div 
                      key={test.id}
                      className="border rounded p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleViewTest(test.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Allenamento #{trainingHistory.length - index}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(test.completedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{test.score}%</p>
                          <p className="text-xs text-muted-foreground">
                            {test.correctAnswers}/{test.totalQuestions}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Tempo: {formatTime(test.timeSpent)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2" />
                  <p>Nessun allenamento completato</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};