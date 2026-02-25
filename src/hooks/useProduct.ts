import { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import { getProduct } from '../services/products';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(productId: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProduct(productId);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          const error = err as Error;
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return { product, loading, error };
}
