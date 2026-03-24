import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'hov-wishlist';

function loadWishlist(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Set<string>>(loadWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...wishlist]));
  }, [wishlist]);

  const toggle = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.has(productId),
    [wishlist]
  );

  return { toggle, isWishlisted, count: wishlist.size };
}
