import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useLocalStorage<string>('userName', '');
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    // Se l'utente ha già un nome salvato, vai direttamente ai concorsi
    if (userName.trim()) {
      navigate('/competitions');
    }
  }, [userName, navigate]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim()) {
      setUserName(inputName.trim());
      // Dopo aver salvato il nome, vai ai concorsi
      navigate('/competitions');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz App
          </CardTitle>
          <p className="text-muted-foreground">
            Inserisci il tuo nome per accedere ai concorsi
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Il tuo nome</Label>
              <Input
                id="userName"
                type="text"
                placeholder="Inserisci il tuo nome"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Accedi ai Concorsi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};