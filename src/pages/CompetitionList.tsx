import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Competition } from '@/types/test';
import { Trophy, BookOpen, Plus, Calendar } from 'lucide-react';
import questionsData from '@/data/questions.json';

export const CompetitionList: React.FC = () => {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useLocalStorage<Competition[]>('competitions', []);
  const [userName] = useLocalStorage<string>('userName', '');

  // Concorso di default se non esiste
  React.useEffect(() => {
    const defaultExists = competitions.find(c => c.isDefault);
    if (!defaultExists) {
      const defaultCompetition: Competition = {
        id: 'default',
        name: 'Concorso Generico',
        description: 'Concorso predefinito per testare le funzionalità dell\'app',
        examTimeLimit: 60,
        subjects: ['Italiano', 'Matematica', 'Storia', 'Geografia'],
        questions: questionsData.map(q => ({
          ...q,
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
          explanation: 'Spiegazione non disponibile'
        })),
        isDefault: true,
        createdAt: new Date()
      };
      setCompetitions([defaultCompetition]);
    }
  }, [competitions, setCompetitions]);

  const handleSelectCompetition = (competitionId: string) => {
    navigate(`/competition/${competitionId}`);
  };

  const handleCreateCompetition = () => {
    navigate('/competition-manager');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Benvenuto, {userName}!</h1>
          <p className="text-muted-foreground">Seleziona un concorso per iniziare</p>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">I tuoi Concorsi</h2>
          <div className="flex gap-2">
            <Button onClick={handleViewHistory} variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Storico Generale
            </Button>
            <Button onClick={handleCreateCompetition} className="gap-2">
              <Plus className="h-4 w-4" />
              Crea Concorso
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((competition) => (
            <Card 
              key={competition.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectCompetition(competition.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {competition.isDefault ? (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  )}
                  {competition.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {competition.description}
                </p>
                <div className="text-xs space-y-1">
                  <p><strong>Tempo esame:</strong> {competition.examTimeLimit} minuti</p>
                  <p><strong>Domande:</strong> {competition.questions.length}</p>
                  <p><strong>Argomenti:</strong> {competition.subjects.join(', ')}</p>
                </div>
                {competition.isDefault && (
                  <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800">
                    Concorso predefinito
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {competitions.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground">
              Nessun concorso disponibile
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Crea il tuo primo concorso per iniziare
            </p>
            <Button onClick={handleCreateCompetition} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Crea il tuo primo concorso
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};