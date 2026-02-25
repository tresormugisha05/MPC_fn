export function formatTime(minutes: number, seconds: number): string {
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
}

export function formatTimeFromSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return formatTime(minutes, seconds);
}

export function calculateTimeRemaining(expiresAt: string): number {
  const expiryDate = new Date(expiresAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((expiryDate - now) / 1000));
}
