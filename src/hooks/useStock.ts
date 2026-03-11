import { useState, useEffect, useCallback } from 'react';
import type { Product, StockState } from '@/types';

interface UseStockReturn {
  soldSizes: StockState;
  isLoading: boolean;
  isSoldOut: (productId: string, size: string) => boolean;
  isAllSoldOut: (product: Product) => boolean;
  refresh: () => void;
}

export function useStock(): UseStockReturn {
  const [soldSizes, setSoldSizes] = useState<StockState>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/stock`);
      if (res.ok) {
        const data = await res.json();
        setSoldSizes(data);
      }
    } catch {
      // Silently fail — no stock data means nothing is blocked
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const isSoldOut = useCallback(
    (productId: string, size: string) => {
      return soldSizes[`${productId}-${size}`] === true;
    },
    [soldSizes]
  );

  const isAllSoldOut = useCallback(
    (product: Product) => {
      if (!product.sizes || product.sizes.length === 0) return false;
      return product.sizes.every((size) => soldSizes[`${product.id}-${size}`] === true);
    },
    [soldSizes]
  );

  return { soldSizes, isLoading, isSoldOut, isAllSoldOut, refresh: fetchStock };
}
