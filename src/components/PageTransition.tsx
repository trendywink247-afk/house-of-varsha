import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface PageTransitionProps {
  children: ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [displayChildren, setDisplayChildren] = useState<ReactNode>(children);
  const [displayKey, setDisplayKey] = useState(location.key);

  // Track whether this is the first render (no exit animation needed)
  const isFirstRender = useRef(true);

  useEffect(() => {
    // On first mount just show content — no transition
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayChildren(children);
      setDisplayKey(location.key);
      return;
    }

    // If route hasn't changed, nothing to do
    if (location.key === displayKey) {
      setDisplayChildren(children);
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) {
      setDisplayChildren(children);
      setDisplayKey(location.key);
      return;
    }

    // Reduced motion — instant switch
    if (reducedMotion) {
      setDisplayChildren(children);
      setDisplayKey(location.key);
      return;
    }

    const ctx = gsap.context(() => {
      // Exit: current page fades out + slides up
      gsap.to(wrapper, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Swap to new content
          setDisplayChildren(children);
          setDisplayKey(location.key);

          // Enter: new page fades in + slides up from below
          gsap.fromTo(
            wrapper,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
            },
          );

          // Scroll to top for new page
          window.scrollTo(0, 0);
        },
      });
    }, wrapper);

    return () => ctx.revert();
    // We intentionally only trigger on location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, reducedMotion]);

  return (
    <div ref={wrapperRef} style={{ willChange: 'transform, opacity' }}>
      {displayChildren}
    </div>
  );
}
