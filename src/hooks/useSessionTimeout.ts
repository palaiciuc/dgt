import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiration

interface UseSessionTimeoutReturn {
  showWarning: boolean;
  timeRemaining: number;
  extendSession: () => void;
  dismissWarning: () => void;
}

export const useSessionTimeout = (): UseSessionTimeoutReturn => {
  const { isAuthenticated, signOut } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(WARNING_TIME);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const handleLogout = useCallback(async () => {
    clearAllTimers();
    setShowWarning(false);
    await signOut();
    window.location.href = '/admin/login';
  }, [signOut, clearAllTimers]);

  const startCountdown = useCallback(() => {
    setTimeRemaining(WARNING_TIME);
    countdownRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1000) {
          handleLogout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  }, [handleLogout]);

  const resetTimers = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    lastActivityRef.current = Date.now();

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, SESSION_TIMEOUT - WARNING_TIME);

    timeoutRef.current = setTimeout(handleLogout, SESSION_TIMEOUT);
  }, [clearAllTimers, handleLogout, startCountdown]);

  const extendSession = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      clearAllTimers();
      return;
    }

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      if (!showWarning) {
        resetTimers();
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    resetTimers();

    return () => {
      clearAllTimers();
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, showWarning, resetTimers, clearAllTimers]);

  return { showWarning, timeRemaining, extendSession, dismissWarning };
};
