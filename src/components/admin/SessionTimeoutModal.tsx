import React from 'react';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  timeRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  timeRemaining,
  onExtend,
  onLogout,
}) => {
  const isUrgent = timeRemaining < 60000; // Less than 1 minute

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className={`h-8 w-8 ${isUrgent ? 'text-red-600 animate-pulse' : 'text-amber-600'}`} />
          </div>
          <DialogTitle className="text-center text-xl">Session Expiring Soon</DialogTitle>
          <DialogDescription className="text-center">
            Your session will expire due to inactivity. You will be automatically logged out in:
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <div className={`text-5xl font-bold tabular-nums ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Click "Stay Logged In" to continue your session, or "Log Out" to end your session now.
        </p>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onLogout} className="flex-1">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
          <Button onClick={onExtend} className="flex-1 bg-[#003B8E] hover:bg-[#002d6d]">
            <RefreshCw className="mr-2 h-4 w-4" />
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimeoutModal;
