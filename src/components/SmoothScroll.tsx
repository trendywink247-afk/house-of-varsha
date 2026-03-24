import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  useHasFinePointer,
  usePrefersReducedMotion,
} from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

const LenisContext = createContext<Lenis | null>(null);

/**
 * Returns the current Lenis instance, or null if smooth-scroll is
 * disabled (mobile / reduced-motion / SSR).
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Disable smooth scroll entirely when the user prefers reduced motion
    if (reducedMotion) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      lerp: hasFinePointer ? 0.1 : 0.12,
      duration: hasFinePointer ? 1.2 : 1.0,
      smoothWheel: true,
    });

    lenisRef.current = instance;
    setLenis(instance);

    // Sync Lenis scroll position with GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP's shared ticker so raf stays in sync
    const tickerCallback = (time: number) => {
      instance.raf(time * 1000); // GSAP ticker uses seconds
    };
    gsap.ticker.add(tickerCallback);

    // Lenis manages its own raf when tied to the GSAP ticker,
    // so we disable its internal raf to avoid double-ticking.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [hasFinePointer, reducedMotion]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
