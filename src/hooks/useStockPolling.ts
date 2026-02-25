import { useState, useEffect, useCallback } from 'react';
import { getProduct } from '../services/products';

interface UseStockPollingResult {
  stock: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const POLLING_INTERVAL = 5000; // 5 seconds

export function useStockPolling(productId: string): UseStockPollingResult {
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    try {
      const product = await getProduct(productId);
      setStock(product.stock);
      setError(null);
    } catch (err) {
      const error = err as Error;
      // Only set error if it's not a timeout (we want to keep polling on timeout)
      if (!error.message.includes('timed out')) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    // Initial fetch
    fetchStock();

    // Set up polling interval
    const intervalId = setInterval(fetchStock, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchStock]);

  return { stock, loading, error, refresh: fetchStock };
}
