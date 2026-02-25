import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  expiresAt: string | null;
  showWarning?: boolean;
  className?: string;
}

export function CountdownTimer({ expiresAt, showWarning = false, className = '' }: CountdownTimerProps) {
  const { formattedTime, expired, totalSeconds } = useCountdown(expiresAt);

  const isWarning = showWarning && totalSeconds < 60 && !expired;

  return (
    <div
      className={`font-mono text-2xl font-bold ${
        expired
          ? 'text-gray-400'
          : isWarning
          ? 'text-red-600'
          : 'text-gray-900'
      } ${className}`}
    >
      {expired ? 'EXPIRED' : formattedTime}
    </div>
  );
}
