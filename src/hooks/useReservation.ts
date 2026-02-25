import { useState, useCallback } from 'react';
import type { Reservation } from '../types/reservation';
import { createReservation } from '../services/reservations';
interface UseReservationResult {
  reservation: Reservation | null;
  loading: boolean;
  error: string | null;
  reserve: (productId: string, quantity?: number) => Promise<Reservation | null>;
  reset: () => void;
}

export function useReservation(): UseReservationResult {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserve = useCallback(async (productId: string, quantity: number = 1): Promise<Reservation | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await createReservation(productId, quantity);
      setReservation(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setReservation(null);
    setLoading(false);
    setError(null);
  }, []);

  return { reservation, loading, error, reserve, reset };
}
