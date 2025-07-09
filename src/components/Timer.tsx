import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onPause?: () => void;
  onResume?: () => void;
  canPause?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  initialTime,
  onTimeUp,
  isActive,
  onPause,
  onResume,
  canPause = false
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(!isActive);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    setIsPaused(!isActive);
  }, [isActive]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume?.();
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage <= 10) return 'text-red-500';
    if (percentage <= 25) return 'text-orange-500';
    return 'text-foreground';
  };

  return (
    <div className="flex items-center gap-3 bg-card p-3 rounded-lg shadow-sm">
      <Clock className="h-5 w-5 text-muted-foreground" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Tempo residuo:</span>
        <span className={`text-lg font-bold ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      {canPause && isActive && (
        <div className="ml-auto">
          {isPaused ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResume}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Riprendi
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePause}
              className="gap-2"
            >
              <Pause className="h-4 w-4" />
              Pausa
            </Button>
          )}
        </div>
      )}
    </div>
  );
};