import { useEffect, useRef, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Link } from 'react-router-dom';
import { optimizeImg } from '@/lib/utils';
import { usePrefersReducedMotion, useIsDesktop } from '@/hooks/useMediaQuery';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger, SplitText);

const FloatingThread = lazy(() =>
  import('@/components/FloatingThread').then((m) => ({ default: m.FloatingThread }))
);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const houseRef = useRef<HTMLSpanElement>(null);
  const ofRef = useRef<HTMLSpanElement>(null);
  const varshaRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<SVGLineElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const tagline = taglineRef.current;
    const houseEl = houseRef.current;
    const ofEl = ofRef.current;
    const varshaEl = varshaRef.current;
    const desc = descRef.current;
    const cta = ctaRef.current;

    if (!section || !image || !content || !tagline || !houseEl || !ofEl || !varshaEl || !desc || !cta) return;

    // Reduced motion: show everything immediately, no animations
    if (reducedMotion) {
      gsap.set([tagline, houseEl, ofEl, varshaEl, desc, cta], { opacity: 1 });
      return;
    }

    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      // --- Entry animations (timeline) ---
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Set initial states
      gsap.set([tagline, desc, cta], { opacity: 0, y: 30 });

      // Tagline fade up
      tl.to(tagline, { opacity: 1, y: 0, duration: 0.8 }, 0.2);

      // HOUSE — SplitText character reveal
      const houseSplit = new SplitText(houseEl, { type: 'chars' });
      splits.push(houseSplit);
      gsap.set(houseSplit.chars, { opacity: 0, y: 40 });
      tl.to(
        houseSplit.chars,
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.6 },
        0.3
      );

      // OF — SplitText character reveal
      const ofSplit = new SplitText(ofEl, { type: 'chars' });
      splits.push(ofSplit);
      gsap.set(ofSplit.chars, { opacity: 0, y: 40 });
      tl.to(
        ofSplit.chars,
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.6 },
        0.4
      );

      // VARSHA — SplitText character reveal with blur clear
      const varshaSplit = new SplitText(varshaEl, { type: 'chars' });
      splits.push(varshaSplit);
      gsap.set(varshaSplit.chars, { opacity: 0, y: 40, filter: 'blur(8px)' });
      tl.to(
        varshaSplit.chars,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.03,
          duration: 0.7,
        },
        0.45
      );

      // Description fade up
      tl.to(desc, { opacity: 1, y: 0, duration: 0.8 }, 0.8);

      // CTAs fade up
      tl.to(cta, { opacity: 1, y: 0, duration: 0.8 }, 0.95);

      // --- Scroll-driven parallax ---
      if (isDesktop) {
        // Background image parallax (moves slower — depth)
        gsap.to(image, {
          y: '15vh',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Foreground text parallax (moves opposite — foreground)
        gsap.to(content, {
          y: '-5vh',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Content fade-out on scroll (both mobile and desktop, lighter on mobile)
      gsap.to(content, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // --- Scroll indicator line draw ---
      const scrollLine = scrollLineRef.current;
      if (scrollLine) {
        const lineLength = scrollLine.getTotalLength();
        gsap.set(scrollLine, {
          strokeDasharray: lineLength,
          strokeDashoffset: lineLength,
        });
        gsap.to(scrollLine, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        });
      }
    }, section);

    return () => {
      // Revert all SplitText instances before GSAP context
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [reducedMotion, isDesktop]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-cream flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src={optimizeImg(
            'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545994/website/editorial-1.jpg',
            1600
          )}
          alt="House of Varsha — Luxury Indian Ethnic Wear"
          className="w-full h-[120%] object-cover will-change-transform"
          fetchPriority="high"
        />
        {/* Atmospheric gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/40 to-cream/80" />
      </div>

      {/* FloatingThread — desktop only, lazy-loaded */}
      {isDesktop && (
        <Suspense fallback={null}>
          <div className="absolute top-20 right-10 z-10 pointer-events-none">
            <FloatingThread />
          </div>
        </Suspense>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-20 will-change-transform"
      >
        {/* Tagline */}
        <span
          ref={taglineRef}
          className="micro-label text-text-secondary mb-6 block tracking-[0.2em]"
        >
          Handcrafted Indian Ethnic Wear
        </span>

        {/* Main Title */}
        <h1 className="mb-8">
          <span
            ref={houseRef}
            className="block font-display font-light uppercase tracking-[0.08em] text-charcoal text-5xl sm:text-6xl lg:text-7xl leading-[1]"
          >
            House
          </span>
          <span
            ref={ofRef}
            className="block font-display font-light uppercase tracking-[0.08em] text-charcoal text-5xl sm:text-6xl lg:text-7xl leading-[1] mt-1"
          >
            of
          </span>
          <span
            ref={varshaRef}
            className="block font-display font-light uppercase tracking-[0.08em] text-gold text-5xl sm:text-6xl lg:text-7xl leading-[1] mt-1"
          >
            Varsha
          </span>
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className="body-text text-text-secondary max-w-md mx-auto mb-10 leading-relaxed"
        >
          Where tradition meets contemporary elegance. Each piece tells a story of
          heritage, craftsmanship, and timeless beauty.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton>
            <Link to="/shop" className="btn-primary">
              Explore Collection
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link to="/about" className="btn-outline">
              Our Story
            </Link>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="micro-label text-text-secondary/60 text-[10px] tracking-[0.25em] uppercase">
          Scroll
        </span>
        <svg
          width="1"
          height="40"
          viewBox="0 0 1 40"
          className="overflow-visible"
          aria-hidden="true"
        >
          <line
            ref={scrollLineRef}
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="40"
            stroke="#9A9590"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
