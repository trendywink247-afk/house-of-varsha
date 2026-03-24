import { useState, useEffect, useCallback } from 'react';

/**
 * Standard media query hook with SSR safety.
 * Returns false during SSR / initial render, then updates on mount.
 */
export function useMediaQuery(query: string): boolean {
  const getMatch = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState<boolean>(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(query);
    // Sync immediately in case SSR value differs
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Returns true when the user has prefers-reduced-motion: reduce enabled.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Returns true on desktop-width viewports (min-width: 1024px).
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * Returns true when the device has a fine pointer (mouse / trackpad).
 * Touch-only devices return false.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)');
}
