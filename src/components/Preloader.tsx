import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const BRAND_TEXT = 'HOUSE OF VARSHA';
const SESSION_KEY = 'hov-preloader-shown';

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface PreloaderProps {
  onComplete: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [alreadyShown] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_KEY) === '1';
  });

  useEffect(() => {
    // If already shown this session, fire callback immediately
    if (alreadyShown) {
      onComplete();
      return;
    }

    // Mark as shown for the rest of the session
    sessionStorage.setItem(SESSION_KEY, '1');

    // Reduced motion — show briefly then finish
    if (reducedMotion) {
      const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
      letters.forEach((l) => {
        l.style.opacity = '1';
        l.style.transform = 'translateY(0)';
      });
      // Short delay so the brand name is visible, then complete
      const timer = setTimeout(() => onComplete(), 400);
      return () => clearTimeout(timer);
    }

    const container = containerRef.current;
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || letters.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onComplete(),
      });

      // 1. Letters fade + slide in one by one
      tl.fromTo(
        letters,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power3.out',
        },
      );

      // 2. Brief hold
      tl.addLabel('hold', '+=0.5');

      // 3. Letters slide up and fade out
      tl.to(
        letters,
        {
          opacity: 0,
          y: -20,
          duration: 0.4,
          stagger: 0.02,
          ease: 'power3.in',
        },
        'hold',
      );

      // 4. Background curtain slides up
      tl.to(
        container,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.7,
          ease: 'power4.inOut',
        },
        '-=0.1',
      );
    }, container);

    return () => ctx.revert();
  }, [alreadyShown, onComplete, reducedMotion]);

  // Don't render anything if already shown this session
  if (alreadyShown) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAFAF8]"
      style={{ clipPath: 'inset(0)' }}
    >
      <span
        className="flex select-none font-display text-2xl tracking-[0.35em] text-[#2C2C2C] sm:text-3xl md:text-4xl"
        aria-label={BRAND_TEXT}
      >
        {BRAND_TEXT.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              lettersRef.current[i] = el;
            }}
            className="inline-block opacity-0"
            style={{ willChange: 'transform, opacity' }}
            aria-hidden="true"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </div>
  );
}
