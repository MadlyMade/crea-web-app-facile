import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Clock, BookOpen, Target, Shuffle } from 'lucide-react';
import questionsData from '@/data/questions.json';

export const TrainingConfig: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, userName } = location.state || {};
  
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState('20');
  const [timeLimit, setTimeLimit] = useState('30');
  const [isRandomMode, setIsRandomMode] = useState(false);

  const allSubjects = [...new Set(questionsData.map(q => q.subject))];
  
  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSelectAll = () => {
    setSelectedSubjects(allSubjects);
  };

  const handleDeselectAll = () => {
    setSelectedSubjects([]);
  };

  const handleRandomToggle = () => {
    setIsRandomMode(!isRandomMode);
    if (!isRandomMode) {
      setSelectedSubjects(allSubjects);
    }
  };

  const handleStartTest = () => {
    if (!isRandomMode && selectedSubjects.length === 0) {
      alert('Seleziona almeno una materia o attiva la modalità casuale');
      return;
    }

    const config = {
      type: 'training',
      subjects: isRandomMode ? allSubjects : selectedSubjects,
      questionCount: parseInt(questionCount),
      timeLimit: parseInt(timeLimit),
      userName
    };

    navigate('/test', { state: { config } });
  };

  if (!type || !userName) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Configurazione Allenamento</h1>
            <p className="text-muted-foreground">Benvenuto, {userName}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Impostazioni Allenamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Training Info */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Modalità Allenamento
              </h3>
              <p className="text-sm text-muted-foreground">
                Personalizza il tuo allenamento scegliendo materie specifiche, tempo e modalità. 
                Potrai mettere in pausa e ricevere feedback immediato.
              </p>
            </div>

            {/* Random Mode Toggle */}
            <div className="flex items-center space-x-3 p-4 bg-secondary/10 rounded-lg">
              <Checkbox
                id="randomMode"
                checked={isRandomMode}
                onCheckedChange={handleRandomToggle}
              />
              <div className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                <label htmlFor="randomMode" className="text-sm font-medium cursor-pointer">
                  Modalità casuale (tutte le materie)
                </label>
              </div>
            </div>

            {/* Subject Selection */}
            {!isRandomMode && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Seleziona materie</label>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      Tutte
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                    >
                      Nessuna
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-2">
                  {allSubjects.map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={selectedSubjects.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <label
                        htmlFor={subject}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question Count */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Numero di domande</label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 domande</SelectItem>
                  <SelectItem value="15">15 domande</SelectItem>
                  <SelectItem value="20">20 domande (Consigliato)</SelectItem>
                  <SelectItem value="25">25 domande</SelectItem>
                  <SelectItem value="30">30 domande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Limit */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tempo limite
              </label>
              <Select value={timeLimit} onValueChange={setTimeLimit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minuti</SelectItem>
                  <SelectItem value="20">20 minuti</SelectItem>
                  <SelectItem value="30">30 minuti (Consigliato)</SelectItem>
                  <SelectItem value="45">45 minuti</SelectItem>
                  <SelectItem value="60">60 minuti</SelectItem>
                  <SelectItem value="0">Senza limite di tempo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-primary mb-2">Riepilogo Allenamento</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Domande:</span>
                  <span className="font-medium">{questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo:</span>
                  <span className="font-medium">
                    {timeLimit === '0' ? 'Illimitato' : `${timeLimit} minuti`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Materie:</span>
                  <span className="font-medium">
                    {isRandomMode ? 'Tutte (casuali)' : `${selectedSubjects.length} selezionate`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Modalità:</span>
                  <span className="font-medium">Allenamento</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-sm text-green-800 space-y-1">
                <strong>Vantaggi dell'allenamento:</strong>
                <br />• Feedback immediato su ogni risposta
                <br />• Possibilità di mettere in pausa
                <br />• Navigazione libera tra le domande
              </p>
            </div>

            {/* Start Button */}
            <Button 
              onClick={handleStartTest}
              className="w-full"
              size="lg"
              disabled={!isRandomMode && selectedSubjects.length === 0}
            >
              Inizia Allenamento
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};