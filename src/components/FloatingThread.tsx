import { lazy, Suspense, useMemo, useRef } from 'react';
import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface FloatingThreadProps {
  /** Normalised scroll progress 0-1 — controls tilt */
  scrollProgress?: number;
}

/* ------------------------------------------------------------------ */
/*  Lazy-loaded Three.js scene                                        */
/*  The dynamic import ensures three / r3f bundles are code-split     */
/*  and never shipped to mobile clients.                              */
/* ------------------------------------------------------------------ */

const ThreadScene = lazy(() =>
  import('./FloatingThread.scene').then((mod) => ({
    default: mod.ThreadScene,
  })),
);

/* ------------------------------------------------------------------ */
/*  Public component                                                  */
/* ------------------------------------------------------------------ */

export function FloatingThread({ scrollProgress = 0 }: FloatingThreadProps) {
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  // Don't load Three.js on mobile or when motion is reduced
  if (!hasFinePointer || reducedMotion) return null;

  return (
    <Suspense fallback={null}>
      <ThreadScene scrollProgress={scrollProgress} />
    </Suspense>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene file (co-located for single-import convenience)             */
/*  This module is also exported from FloatingThread.scene.tsx        */
/* ------------------------------------------------------------------ */
// The actual Three.js scene lives in a separate file so the dynamic
// import works correctly. See FloatingThread.scene.tsx.
