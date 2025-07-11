import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ArrowLeft, Upload, Plus, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Competition {
  id: string;
  name: string;
  description: string;
  questions: any[];
  subjects: string[];
  createdAt: Date;
}

export const CompetitionManager: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [competitions, setCompetitions] = useLocalStorage<Competition[]>('competitions', []);
  const [newCompetitionName, setNewCompetitionName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
      toast({
        title: "Formato non supportato",
        description: "Carica solo file .json o .csv",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Expected headers: question, option1, option2, option3, option4, correct_answer, subject, difficulty
    const expectedHeaders = ['question', 'option1', 'option2', 'option3', 'option4', 'correct_answer', 'subject', 'difficulty'];
    
    if (!expectedHeaders.every(header => headers.includes(header))) {
      throw new Error('CSV deve contenere le colonne: question, option1, option2, option3, option4, correct_answer, subject, difficulty');
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/\"/g, ''));
      const question: any = { id: Date.now() + index };
      
      headers.forEach((header, i) => {
        if (header === 'correct_answer') {
          question.correctAnswer = parseInt(values[i]) - 1; // Convert 1-4 to 0-3
        } else if (header.startsWith('option')) {
          if (!question.options) question.options = [];
          question.options.push(values[i]);
        } else {
          question[header] = values[i];
        }
      });

      return question;
    });
  };

  const processUploadedFile = async () => {
    if (!uploadedFile || !newCompetitionName.trim()) {
      toast({
        title: "Dati mancanti",
        description: "Inserisci nome del concorso e carica un file",
        variant: "destructive"
      });
      return;
    }

    try {
      const text = await uploadedFile.text();
      let questions;

      if (uploadedFile.name.endsWith('.json')) {
        questions = JSON.parse(text);
      } else {
        questions = parseCSV(text);
      }

      const subjects = [...new Set(questions.map((q: any) => q.subject))].filter(Boolean) as string[];
      
      const newCompetition: Competition = {
        id: `comp_${Date.now()}`,
        name: newCompetitionName.trim(),
        description: `Concorso caricato da ${uploadedFile.name}`,
        questions,
        subjects,
        createdAt: new Date()
      };

      setCompetitions(prev => [...prev, newCompetition]);
      setNewCompetitionName('');
      setUploadedFile(null);

      toast({
        title: "Concorso creato",
        description: `${questions.length} domande caricate con successo`
      });

    } catch (error) {
      toast({
        title: "Errore nel caricamento",
        description: error instanceof Error ? error.message : "Formato file non valido",
        variant: "destructive"
      });
    }
  };

  const deleteCompetition = (competitionId: string) => {
    setCompetitions(prev => prev.filter(comp => comp.id !== competitionId));
    toast({
      title: "Concorso eliminato",
      description: "Il concorso è stato rimosso"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gestione Concorsi</h1>
            <p className="text-muted-foreground">Carica e gestisci i tuoi database di domande personalizzati</p>
          </div>
        </div>

        {/* Upload New Competition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crea Nuovo Concorso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="competitionName">Nome del Concorso</Label>
                <Input
                  id="competitionName"
                  placeholder="es. Concorso Pubblico 2024"
                  value={newCompetitionName}
                  onChange={(e) => setNewCompetitionName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Carica Database (.json o .csv)</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {uploadedFile && (
              <div className="p-3 bg-secondary/20 rounded-lg">
                <p className="text-sm">
                  <strong>File selezionato:</strong> {uploadedFile.name}
                </p>
              </div>
            )}

            <Button 
              onClick={processUploadedFile}
              disabled={!uploadedFile || !newCompetitionName.trim()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Crea Concorso
            </Button>

            {/* Format Instructions */}
            <div className="bg-muted/50 p-4 rounded-lg text-sm">
              <h4 className="font-semibold mb-2">Formato CSV richiesto:</h4>
              <p>question, option1, option2, option3, option4, correct_answer, subject, difficulty</p>
              <p className="mt-2 text-muted-foreground">
                - correct_answer: numero da 1 a 4<br/>
                - difficulty: easy, medium, hard
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Existing Competitions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Concorsi Disponibili ({competitions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {competitions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nessun concorso personalizzato creato. Carica il tuo primo database sopra.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {competitions.map(competition => (
                  <Card key={competition.id} className="relative">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{competition.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{competition.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-1">
                        <div>Domande: <strong>{competition.questions.length}</strong></div>
                        <div>Materie: <strong>{competition.subjects.length}</strong></div>
                        <div>Creato: <strong>{new Date(competition.createdAt).toLocaleDateString('it-IT')}</strong></div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate('/exam-config', { 
                            state: { 
                              type: 'exam', 
                              userName: 'User',
                              competitionId: competition.id 
                            } 
                          })}
                        >
                          Esame
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate('/training-config', { 
                            state: { 
                              type: 'training', 
                              userName: 'User',
                              competitionId: competition.id 
                            } 
                          })}
                        >
                          Allenamento
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCompetition(competition.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompetitionManager;
