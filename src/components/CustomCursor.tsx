import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useHasFinePointer } from '@/hooks/useMediaQuery';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type QuickToFunc = ReturnType<typeof gsap.quickTo>;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function CustomCursor() {
  const hasFinePointer = useHasFinePointer();

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // Persist quickTo functions across renders
  const quickToOuter = useRef<{ x: QuickToFunc; y: QuickToFunc } | null>(null);
  const quickToInner = useRef<{ x: QuickToFunc; y: QuickToFunc } | null>(null);

  /* ---- helpers ---- */

  const getHoverTarget = useCallback(
    (el: EventTarget | null): 'link' | 'image' | 'magnetic' | null => {
      if (!el || !(el instanceof HTMLElement)) return null;
      const target = el.closest(
        'a, button, [data-cursor="magnetic"], img, [data-cursor="image"]',
      );
      if (!target) return null;
      if (target.getAttribute('data-cursor') === 'magnetic') return 'magnetic';
      if (
        target.tagName === 'IMG' ||
        target.getAttribute('data-cursor') === 'image'
      )
        return 'image';
      if (target.tagName === 'A' || target.tagName === 'BUTTON') return 'link';
      return null;
    },
    [],
  );

  /* ---- effect ---- */

  useEffect(() => {
    if (!hasFinePointer) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    const text = textRef.current;
    if (!outer || !inner || !text) return;

    // Hide default cursor
    document.body.classList.add('cursor-none');

    // Build quickTo animators
    quickToOuter.current = {
      x: gsap.quickTo(outer, 'x', { duration: 0.5, ease: 'power3' }),
      y: gsap.quickTo(outer, 'y', { duration: 0.5, ease: 'power3' }),
    };
    quickToInner.current = {
      x: gsap.quickTo(inner, 'x', { duration: 0.15, ease: 'power3' }),
      y: gsap.quickTo(inner, 'y', { duration: 0.15, ease: 'power3' }),
    };

    /* ---- mouse move ---- */
    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      quickToOuter.current?.x(x);
      quickToOuter.current?.y(y);
      quickToInner.current?.x(x);
      quickToInner.current?.y(y);

      // Determine hover type
      const hoverType = getHoverTarget(e.target);

      if (hoverType === 'magnetic') {
        const el = (e.target as HTMLElement).closest(
          '[data-cursor="magnetic"]',
        ) as HTMLElement | null;
        if (el) {
          const rect = el.getBoundingClientRect();
          gsap.to(outer, {
            width: rect.width + 16,
            height: rect.height + 16,
            borderRadius: 8,
            duration: 0.35,
            ease: 'power2.out',
          });
        }
        gsap.to(inner, { scale: 0, duration: 0.2 });
        text.textContent = '';
      } else if (hoverType === 'image') {
        gsap.to(outer, {
          scale: 2,
          width: 40,
          height: 40,
          borderRadius: '50%',
          duration: 0.35,
          ease: 'power2.out',
        });
        gsap.to(inner, { scale: 0, duration: 0.2 });
        text.textContent = 'View';
      } else if (hoverType === 'link') {
        gsap.to(outer, {
          scale: 1.5,
          width: 40,
          height: 40,
          borderRadius: '50%',
          duration: 0.35,
          ease: 'power2.out',
        });
        gsap.to(inner, { scale: 0, duration: 0.2 });
        text.textContent = '';
      } else {
        gsap.to(outer, {
          scale: 1,
          width: 40,
          height: 40,
          borderRadius: '50%',
          duration: 0.35,
          ease: 'power2.out',
        });
        gsap.to(inner, { scale: 1, duration: 0.2 });
        text.textContent = '';
      }
    };

    /* ---- visibility ---- */
    const onMouseEnter = () => {
      gsap.to(outer, { opacity: 1, duration: 0.3 });
      gsap.to(inner, { opacity: 1, duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to(outer, { opacity: 0, duration: 0.3 });
      gsap.to(inner, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.body.classList.remove('cursor-none');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [hasFinePointer, getHoverTarget]);

  /* ---- render nothing on touch devices ---- */
  if (!hasFinePointer) return null;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border border-[#C9B18A] opacity-0"
        style={{
          width: 40,
          height: 40,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      >
        <span
          ref={textRef}
          className="select-none text-[10px] font-medium tracking-wider text-[#C9B18A]"
        />
      </div>

      {/* Inner dot */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-[#C9B18A] opacity-0"
        style={{
          width: 6,
          height: 6,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
