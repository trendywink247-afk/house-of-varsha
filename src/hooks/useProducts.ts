/**
 * useProducts hook - Fetches products from Google Sheets or static fallback.
 *
 * Usage:
 *   const { products, isLoading, source } = useProducts();
 *
 * The hook automatically:
 * - Tries Google Sheets CSV if VITE_GOOGLE_SHEETS_CSV_URL is set
 * - Tries the server API endpoint if configured
 * - Falls back to static products from data/products.ts
 * - Caches results for 5 minutes client-side
 */

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { products as staticProducts } from '@/data/products';
import { getProducts, type ProductSource } from '@/lib/google-sheets';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  source: ProductSource;
  refetch: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ProductSource>('static');
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getProducts();
        if (!cancelled) {
          setProducts(result.products);
          setSource(result.source);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
          // Keep existing products on error
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [fetchKey]);

  const refetch = () => setFetchKey((k) => k + 1);

  return { products, isLoading, error, source, refetch };
}
