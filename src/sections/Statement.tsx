import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface StatementProps {
  headline: string[];
  subheadline: string;
  caption: string;
  cta: string;
  ctaLink: string;
  image: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Statement({
  headline,
  subheadline,
  caption,
  cta,
  ctaLink,
  image,
}: StatementProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const headlineEl = headlineRef.current;
    const subheadlineEl = subheadlineRef.current;
    const imageEl = imageRef.current;
    const bottomEl = bottomRef.current;
    const captionEl = captionRef.current;

    if (!section || !headlineEl || !subheadlineEl || !imageEl || !bottomEl) return;

    /* Reduced motion — simple fade, no pin */
    if (reducedMotion) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          [headlineEl, subheadlineEl, imageEl, bottomEl],
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }, section);
      return () => ctx.revert();
    }

    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      const imgEl = imageEl.querySelector<HTMLImageElement>('img');

      /* ---- Headline: SplitText character reveal ---- */
      const headlineLines = headlineEl.querySelectorAll<HTMLElement>('.headline-line');
      const allChars: HTMLElement[] = [];

      headlineLines.forEach((line) => {
        const split = new SplitText(line, { type: 'chars' });
        splits.push(split);
        allChars.push(...(split.chars as HTMLElement[]));
      });

      /* ---- Caption: SplitText word reveal ---- */
      let captionSplit: SplitText | null = null;
      if (captionEl) {
        captionSplit = new SplitText(captionEl, { type: 'words' });
        splits.push(captionSplit);
      }

      /* ============================================================ */
      /*  ENTRANCE (0% — 30%)                                         */
      /* ============================================================ */

      /* Headline characters: drop from above with rotation */
      scrollTl.fromTo(
        allChars,
        { y: '-100%', opacity: 0, rotation: -10 },
        {
          y: '0%',
          opacity: 1,
          rotation: 0,
          stagger: 0.02,
          ease: 'none',
        },
        0,
      );

      /* Subheadline */
      scrollTl.fromTo(
        subheadlineEl,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08,
      );

      /* Image: slide up from below + blur clear */
      if (imgEl) {
        scrollTl.fromTo(
          imageEl,
          { y: '50vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.1,
        );
        scrollTl.fromTo(
          imgEl,
          { scale: 0.98, filter: 'blur(10px)' },
          { scale: 1, filter: 'blur(0px)', ease: 'none' },
          0.1,
        );
      } else {
        scrollTl.fromTo(
          imageEl,
          { y: '50vh', opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, ease: 'none' },
          0.1,
        );
      }

      /* Bottom content: caption word-by-word reveal */
      if (captionSplit) {
        scrollTl.fromTo(
          captionSplit.words,
          { y: '100%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            stagger: 0.03,
            ease: 'none',
          },
          0.18,
        );
      }

      /* CTA fade up */
      const ctaEl = bottomEl.querySelector<HTMLElement>('.cta-wrap');
      if (ctaEl) {
        scrollTl.fromTo(
          ctaEl,
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.22,
        );
      }

      /* ============================================================ */
      /*  HOLD PHASE (30% — 70%) — Ken Burns on image                 */
      /* ============================================================ */
      if (imgEl) {
        scrollTl.to(
          imgEl,
          {
            scale: 1.02,
            x: 5,
            y: -3,
            ease: 'none',
          },
          0.3,
        );
        /* Anchor at 0.7 */
        scrollTl.to(imgEl, { scale: 1.02, x: 5, y: -3, duration: 0 }, 0.7);
      }

      /* ============================================================ */
      /*  EXIT (70% — 100%)                                           */
      /* ============================================================ */
      scrollTl.to(
        allChars,
        { y: '-12vh', opacity: 0.25, ease: 'power2.in' },
        0.7,
      );
      scrollTl.to(
        imageEl,
        { y: '-18vh', opacity: 0.25, ease: 'power2.in' },
        0.72,
      );
      if (captionSplit) {
        scrollTl.to(
          captionSplit.words,
          { y: '8vh', opacity: 0.2, stagger: 0.01, ease: 'power2.in' },
          0.74,
        );
      }
      if (ctaEl) {
        scrollTl.to(
          ctaEl,
          { y: '8vh', opacity: 0.2, ease: 'power2.in' },
          0.76,
        );
      }
    }, section);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-cream overflow-hidden z-20"
    >
      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute left-[8vw] top-[10vh] w-[84vw]"
      >
        {headline.map((line, index) => (
          <div key={index} className="overflow-hidden">
            <div
              className={`headline-line font-display font-light uppercase tracking-[0.08em] leading-[1.05] text-charcoal text-4xl sm:text-5xl lg:text-6xl ${
                index === headline.length - 1 ? 'text-gold' : ''
              }`}
            >
              {line}
            </div>
          </div>
        ))}
      </div>

      {/* Subheadline */}
      <p
        ref={subheadlineRef}
        className="absolute left-[8vw] top-[30vh] w-[34vw] body-text text-text-secondary hidden lg:block"
      >
        {subheadline}
      </p>

      {/* Wide Image */}
      <div
        ref={imageRef}
        className="absolute left-[8vw] top-[38vh] lg:top-[42vh] w-[84vw] h-[40vh] lg:h-[44vh] overflow-hidden"
      >
        <img
          src={image}
          alt={headline.join(' ')}
          loading="lazy"
          className="w-full h-full object-cover"
          style={{ willChange: 'transform, filter' }}
        />
      </div>

      {/* Bottom Content */}
      <div
        ref={bottomRef}
        className="absolute left-[8vw] right-[8vw] bottom-[6vh] flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4"
      >
        <p
          ref={captionRef}
          className="body-text text-text-secondary max-w-md overflow-hidden"
        >
          {caption}
        </p>
        <div className="cta-wrap">
          <MagneticButton className="inline-block">
            <Link
              to={ctaLink}
              className="inline-flex items-center gap-3 cta-link text-charcoal group"
            >
              <span>{cta}</span>
              <ArrowRight
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
