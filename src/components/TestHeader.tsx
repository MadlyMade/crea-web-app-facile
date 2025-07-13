import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from '@/components/Timer';
import { EndTestButton } from '@/components/EndTestButton';
import { TestSession } from '@/types/test';
import { ArrowLeft, Save, Flag } from 'lucide-react';

interface TestHeaderProps {
  currentSession: TestSession;
  isTimerActive: boolean;
  onSaveAndExit: () => void;
  onEndTest: () => void;
  onTimeUp: () => void;
  onPause: () => void;
  onResume: () => void;
}

export const TestHeader: React.FC<TestHeaderProps> = ({
  currentSession,
  isTimerActive,
  onSaveAndExit,
  onEndTest,
  onTimeUp,
  onPause,
  onResume,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSaveAndExit}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                {currentSession.type === 'exam' ? 'Esame' : 'Allenamento'} - {currentSession.userName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Punteggio: {Object.keys(currentSession.answers).length}/{currentSession.questions.length} domande completate
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {currentSession.type === 'training' && (
              <Button
                variant="outline"
                onClick={onSaveAndExit}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Salva ed Esci
              </Button>
            )}
            
            <EndTestButton
              onEndTest={onEndTest}
              testType={currentSession.type}
              answeredQuestions={Object.keys(currentSession.answers).length}
              totalQuestions={currentSession.questions.length}
            />
            
            {currentSession.timeLimit > 0 && (
              <Timer
                initialTime={currentSession.timeRemaining || currentSession.timeLimit}
                onTimeUp={onTimeUp}
                isActive={isTimerActive}
                onPause={onPause}
                onResume={onResume}
                canPause={currentSession.type === 'training'}
              />
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};