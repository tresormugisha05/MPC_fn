import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateTimeRemaining, formatTimeFromSeconds } from '../utils/formatTime';

interface UseCountdownResult {
  minutes: number;
  seconds: number;
  formattedTime: string;
  expired: boolean;
  totalSeconds: number;
}

export function useCountdown(expiresAt: string | null): UseCountdownResult {
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const updateCountdown = useCallback(() => {
    if (!expiresAt) {
      setTotalSeconds(0);
      setExpired(true);
      return;
    }

    const remaining = calculateTimeRemaining(expiresAt);
    
    if (remaining <= 0) {
      setTotalSeconds(0);
      setExpired(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      setTotalSeconds(remaining);
      setExpired(false);
    }
  }, [expiresAt]);

  useEffect(() => {
    // Initial calculation
    updateCountdown();

    // Update every second
    intervalRef.current = window.setInterval(updateCountdown, 1000);

    // Cleanup on unmount or when expiresAt changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateCountdown]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = formatTimeFromSeconds(totalSeconds);

  return {
    minutes,
    seconds,
    formattedTime,
    expired,
    totalSeconds,
  };
}
