import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, GraduationCap, History, User } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useLocalStorage('examAppUserName', '');
  const [tempUserName, setTempUserName] = useState(userName);

  const handleStartExam = () => {
    if (!tempUserName.trim()) {
      alert('Inserisci il tuo nome per continuare');
      return;
    }
    setUserName(tempUserName.trim());
    navigate('/exam-config', { state: { type: 'exam', userName: tempUserName.trim() } });
  };

  const handleStartTraining = () => {
    if (!tempUserName.trim()) {
      alert('Inserisci il tuo nome per continuare');
      return;
    }
    setUserName(tempUserName.trim());
    navigate('/training-config', { state: { type: 'training', userName: tempUserName.trim() } });
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GraduationCap className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ExamPro
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Piattaforma avanzata per esami e allenamenti con simulazioni realistiche e feedback immediato
          </p>
        </div>

        {/* User Input */}
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Benvenuto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Il tuo nome</Label>
              <Input
                id="userName"
                placeholder="Inserisci il tuo nome"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="text-center"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Modalità Esame</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Simula un vero esame con condizioni realistiche, tempo limitato e valutazione finale
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tempo fisso e controllato</li>
                <li>• Nessuna pausa consentita</li>
                <li>• Feedback solo alla fine</li>
                <li>• Valutazione completa</li>
              </ul>
              <Button 
                onClick={handleStartExam}
                className="w-full"
                size="lg"
              >
                Inizia Esame
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-secondary/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <BookOpen className="h-8 w-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Modalità Allenamento</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Pratica con flessibilità, scegli materie specifiche e ricevi feedback immediato
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Scegli le materie da studiare</li>
                <li>• Pausa e riprendi quando vuoi</li>
                <li>• Feedback immediato</li>
                <li>• Tempo personalizzabile</li>
              </ul>
              <Button 
                onClick={handleStartTraining}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                Inizia Allenamento
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* History Button */}
        <div className="text-center">
          <Button
            onClick={handleViewHistory}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <History className="h-5 w-5" />
            Visualizza Storico Test
          </Button>
        </div>

        {/* Features */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="font-semibold text-foreground">Simulazione Realistica</div>
              <p>Interfaccia identica agli esami reali con griglia di navigazione e timer preciso</p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-foreground">Feedback Intelligente</div>
              <p>Correzioni immediate e spiegazioni dettagliate per ogni risposta</p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-foreground">Progressi Salvati</div>
              <p>Tutti i tuoi test vengono salvati automaticamente per il ripasso futuro</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};