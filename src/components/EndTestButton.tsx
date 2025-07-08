import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Flag } from 'lucide-react';

interface EndTestButtonProps {
  onEndTest: () => void;
  testType: 'exam' | 'training';
  answeredQuestions: number;
  totalQuestions: number;
}

export const EndTestButton: React.FC<EndTestButtonProps> = ({
  onEndTest,
  testType,
  answeredQuestions,
  totalQuestions
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Flag className="h-4 w-4" />
          Termina Test
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Conferma fine test</AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler terminare il test? 
            {answeredQuestions < totalQuestions && (
              <span className="block mt-2 font-medium text-orange-600">
                Hai risposto a {answeredQuestions} domande su {totalQuestions}.
              </span>
            )}
            {testType === 'exam' && (
              <span className="block mt-2 text-red-600">
                In modalità esame non potrai più modificare le risposte.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction onClick={onEndTest}>
            Termina Test
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};