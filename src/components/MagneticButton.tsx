import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import gsap from 'gsap';
import { useHasFinePointer } from '@/hooks/useMediaQuery';

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Hover scale factor (default 1.1) */
  scale?: number;
  /** Magnetic pull tolerance — 0-1, fraction of element size (default 0.35) */
  tolerance?: number;
  /** HTML element to render as (default 'div') */
  as?: keyof JSX.IntrinsicElements;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function MagneticButton({
  children,
  className,
  scale = 1.1,
  tolerance = 0.35,
  as: Tag = 'div',
}: MagneticButtonProps) {
  const hasFinePointer = useHasFinePointer();
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      gsap.to(el, {
        x: dx * tolerance,
        y: dy * tolerance,
        scale,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    [tolerance, scale],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  useEffect(() => {
    if (!hasFinePointer) return;

    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      // Reset transform on cleanup
      gsap.set(el, { x: 0, y: 0, scale: 1 });
    };
  }, [hasFinePointer, handleMouseMove, handleMouseLeave]);

  // Cast Tag to a usable component type
  const Element = Tag as React.ElementType;

  return (
    <Element
      ref={ref}
      className={className}
      data-cursor="magnetic"
      style={{ willChange: hasFinePointer ? 'transform' : undefined }}
    >
      {children}
    </Element>
  );
}
