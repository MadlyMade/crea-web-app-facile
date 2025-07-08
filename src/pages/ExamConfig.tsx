import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Clock, BookOpen, Users } from 'lucide-react';
import questionsData from '@/data/questions.json';

export const ExamConfig: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, userName } = location.state || {};
  
  const [questionCount, setQuestionCount] = useState('30');
  const [timeLimit, setTimeLimit] = useState('60');

  const allSubjects = [...new Set(questionsData.map(q => q.subject))];
  
  const handleStartTest = () => {
    const config = {
      type: 'exam',
      subjects: allSubjects, // Exam mode uses all subjects
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
            <h1 className="text-2xl font-bold">Configurazione Esame</h1>
            <p className="text-muted-foreground">Benvenuto, {userName}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Impostazioni Esame
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Exam Info */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Modalità Esame
              </h3>
              <p className="text-sm text-muted-foreground">
                Tutte le materie disponibili saranno incluse nel test. 
                Non è possibile mettere in pausa durante l'esame.
              </p>
            </div>

            {/* Question Count */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Numero di domande</label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 domande</SelectItem>
                  <SelectItem value="20">20 domande</SelectItem>
                  <SelectItem value="25">25 domande</SelectItem>
                  <SelectItem value="30">30 domande (Consigliato)</SelectItem>
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
                  <SelectItem value="30">30 minuti</SelectItem>
                  <SelectItem value="45">45 minuti</SelectItem>
                  <SelectItem value="60">60 minuti (Consigliato)</SelectItem>
                  <SelectItem value="90">90 minuti</SelectItem>
                  <SelectItem value="120">120 minuti</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subjects Display */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Materie incluse</label>
              <div className="flex flex-wrap gap-2">
                {allSubjects.map(subject => (
                  <span 
                    key={subject}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-primary mb-2">Riepilogo Esame</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Domande:</span>
                  <span className="font-medium">{questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo:</span>
                  <span className="font-medium">{timeLimit} minuti</span>
                </div>
                <div className="flex justify-between">
                  <span>Materie:</span>
                  <span className="font-medium">{allSubjects.length} materie</span>
                </div>
                <div className="flex justify-between">
                  <span>Modalità:</span>
                  <span className="font-medium">Esame ufficiale</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Attenzione:</strong> Una volta iniziato l'esame, non potrai metterlo in pausa. 
                Assicurati di avere abbastanza tempo a disposizione.
              </p>
            </div>

            {/* Start Button */}
            <Button 
              onClick={handleStartTest}
              className="w-full"
              size="lg"
            >
              Inizia Esame
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};