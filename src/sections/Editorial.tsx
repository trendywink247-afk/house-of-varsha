import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsDesktop, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface EditorialProps {
  headline: string[];
  body: string;
  tag: string;
  cta: string;
  ctaLink: string;
  image: string;
  imagePosition: 'left' | 'right';
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Editorial({
  headline,
  body,
  tag,
  cta,
  ctaLink,
  image,
  imagePosition,
}: EditorialProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const isImageLeft = imagePosition === 'left';
  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const imageEl = imageRef.current;
    const textEl = textRef.current;

    if (!section || !imageEl || !textEl) return;

    /* Reduced motion — simple fade, no pin */
    if (reducedMotion) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          [imageEl, textEl],
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
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

    /* Collect SplitText instances for cleanup */
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

      const bodyEl = textEl.querySelector<HTMLElement>('.body-text');
      const tagEl = textEl.querySelector<HTMLElement>('.micro-label');
      const ctaEl = textEl.querySelector<HTMLElement>('.cta-link');
      const imgEl = imageEl.querySelector<HTMLImageElement>('img');

      /* ---- Headline: SplitText character reveal ---- */
      const headlineLines = textEl.querySelectorAll<HTMLElement>('.headline-line');
      const allChars: HTMLElement[] = [];

      headlineLines.forEach((line) => {
        const split = new SplitText(line, { type: 'chars' });
        splits.push(split);
        allChars.push(...(split.chars as HTMLElement[]));
      });

      /* ============================================================ */
      /*  ENTRANCE (0% — 30%)                                         */
      /* ============================================================ */

      /* Image: circular clip-path reveal + scale */
      scrollTl.fromTo(
        imageEl,
        {
          clipPath: 'circle(0% at 50% 50%)',
          scale: 1.05,
        },
        {
          clipPath: 'circle(75% at 50% 50%)',
          scale: 1.0,
          ease: 'none',
        },
        0,
      );

      /* Headline characters reveal from below */
      scrollTl.fromTo(
        allChars,
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          stagger: 0.02,
          ease: 'none',
        },
        0.05,
      );

      /* Tag + body fade up */
      scrollTl.fromTo(
        [tagEl, bodyEl].filter(Boolean),
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.14,
      );

      /* CTA fade up */
      scrollTl.fromTo(
        ctaEl,
        { y: '8vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.18,
      );

      /* ============================================================ */
      /*  HOLD PHASE (30% — 70%) — subtle image zoom                  */
      /* ============================================================ */
      if (imgEl) {
        scrollTl.fromTo(
          imgEl,
          { scale: 1.0 },
          { scale: 1.03, ease: 'none' },
          0.3,
        );
        /* Ensure zoom ends at 0.7 */
        scrollTl.to(imgEl, { scale: 1.03, duration: 0 }, 0.7);
      }

      /* ============================================================ */
      /*  EXIT (70% — 100%)                                           */
      /* ============================================================ */

      /* Image: scale down + fade */
      scrollTl.to(
        imageEl,
        { scale: 0.97, opacity: 0, ease: 'power2.in' },
        0.7,
      );

      /* Text characters scatter */
      scrollTl.to(
        allChars,
        {
          x: () => gsap.utils.random(-20, 20),
          y: () => gsap.utils.random(-30, 10),
          opacity: 0,
          stagger: 0.008,
          ease: 'power2.in',
        },
        0.72,
      );

      /* Body + tag + CTA fade */
      scrollTl.to(
        [tagEl, bodyEl, ctaEl].filter(Boolean),
        { y: '6vh', opacity: 0, stagger: 0.01, ease: 'power2.in' },
        0.74,
      );
    }, section);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [isImageLeft, isDesktop, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-cream overflow-hidden z-30"
    >
      {/* Image */}
      <div
        ref={imageRef}
        className={`absolute top-0 w-full lg:w-[50vw] h-[50vh] lg:h-full ${
          isImageLeft ? 'left-0' : 'lg:left-[50vw] left-0 top-[50vh] lg:top-0'
        }`}
        style={{ willChange: 'clip-path, transform' }}
      >
        <img
          src={image}
          alt={headline.join(' ')}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Content */}
      <div
        ref={textRef}
        className={`absolute top-0 w-full lg:w-[50vw] h-full flex flex-col justify-center px-8 lg:px-[8vw] pt-[55vh] lg:pt-0 ${
          isImageLeft ? 'lg:left-[50vw] left-0' : 'left-0'
        }`}
      >
        {/* Headline — each line wrapped in overflow-hidden for character mask */}
        <div className="mb-8">
          {headline.map((line, index) => (
            <div key={index} className="overflow-hidden">
              <div
                className={`headline-line font-display font-light uppercase tracking-[0.08em] leading-[1.05] text-charcoal text-3xl sm:text-4xl lg:text-5xl ${
                  index === headline.length - 1 ? 'text-gold' : ''
                }`}
              >
                {line}
              </div>
            </div>
          ))}
        </div>

        {/* Tag */}
        <span className="micro-label text-gold mb-4">{tag}</span>

        {/* Body */}
        <p className="body-text text-text-secondary max-w-md mb-8">{body}</p>

        {/* CTA */}
        <MagneticButton className="w-fit">
          <Link
            to={ctaLink}
            className="inline-flex items-center gap-3 cta-link text-charcoal group w-fit"
          >
            <span>{cta}</span>
            <ArrowRight
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              strokeWidth={1.5}
            />
          </Link>
        </MagneticButton>
      </div>
    </section>
  );
}
