import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { optimizeImg } from '@/lib/utils';
import { useIsDesktop, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ */
/*  Gold accent particles (CSS-only floating dots)                     */
/* ------------------------------------------------------------------ */

const PARTICLES = [
  { top: '12%', left: '8%', size: 6, delay: '0s', duration: '4.5s', opacity: 0.2 },
  { top: '28%', right: '12%', size: 5, delay: '1.2s', duration: '5.5s', opacity: 0.15 },
  { top: '65%', left: '15%', size: 8, delay: '0.6s', duration: '3.8s', opacity: 0.25 },
  { top: '80%', right: '20%', size: 4, delay: '2s', duration: '6s', opacity: 0.18 },
  { top: '45%', left: '85%', size: 7, delay: '0.3s', duration: '4s', opacity: 0.22 },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CollectionShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const imageEl = imageRef.current;
    const headingEl = headingRef.current;

    if (!section || !content) return;

    if (reducedMotion) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          content.children,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
              trigger: content,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }, section);
      return () => ctx.revert();
    }

    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      /* ---- Background color transition ---- */
      gsap.fromTo(
        section,
        { backgroundColor: '#FAFAF8' },
        {
          backgroundColor: '#2C2C2C',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: true,
          },
        },
      );

      /* ---- Heading: SplitText word reveal ---- */
      if (headingEl) {
        const headingSplit = new SplitText(headingEl, { type: 'words' });
        splits.push(headingSplit);

        gsap.fromTo(
          headingSplit.words,
          { y: '100%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            stagger: 0.06,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingEl,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      /* ---- Content children fade up ---- */
      const contentChildren = content.querySelectorAll<HTMLElement>('.showcase-animate');
      gsap.fromTo(
        contentChildren,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      /* ---- Image: Ken Burns slow zoom ---- */
      const imgEl = imageEl?.querySelector<HTMLImageElement>('img');
      if (imgEl) {
        gsap.fromTo(
          imgEl,
          { scale: 1.0 },
          {
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: imageEl,
              start: 'top 90%',
              end: 'bottom 10%',
              scrub: true,
            },
          },
        );
      }
    }, section);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, [isDesktop, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-charcoal overflow-hidden"
    >
      {/* Gradient transition overlay at top */}
      <div
        className="absolute top-0 left-0 w-full h-[200px] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, #FAFAF8, rgba(250,250,248,0.5) 40%, #2C2C2C)',
        }}
      />

      {/* Gold floating particles (desktop only) */}
      {isDesktop && !reducedMotion && (
        <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                top: p.top,
                left: 'left' in p ? p.left : undefined,
                right: 'right' in p ? p.right : undefined,
                width: p.size,
                height: p.size,
                backgroundColor: '#C9B18A',
                opacity: p.opacity,
                animation: `collectionFloat ${p.duration} ease-in-out ${p.delay} infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-30 w-full px-6 lg:px-12 py-20 lg:py-28 pt-[calc(200px+5rem)] lg:pt-[calc(200px+7rem)]">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <div ref={contentRef} className="order-2 lg:order-1">
            <span className="showcase-animate micro-label text-gold mb-3 block">
              The Collection
            </span>
            <div className="overflow-hidden mb-6">
              <h2
                ref={headingRef}
                className="section-title text-cream"
                style={{ textShadow: '0 0 40px rgba(201,177,138,0.2)' }}
              >
                Elegance in
                <span className="text-gold ml-2">Every Thread</span>
              </h2>
            </div>
            <p className="showcase-animate body-text text-cream/60 mb-8 max-w-md leading-relaxed">
              Discover our carefully curated collection of handcrafted Indian ethnic wear.
              Each piece is designed to bring out your inner elegance while honoring
              traditional craftsmanship.
            </p>
            <div className="showcase-animate">
              <MagneticButton className="inline-block">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-cream hover:text-gold transition-colors group"
                >
                  <span className="micro-label tracking-[0.15em]">Explore Now</span>
                  <ArrowRight
                    className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                    strokeWidth={1.5}
                  />
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Image */}
          <div
            ref={imageRef}
            className="order-1 lg:order-2 aspect-[4/5] overflow-hidden"
          >
            <img
              src={optimizeImg(
                'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545996/website/editorial-4.jpg',
                800,
              )}
              alt="The Collection"
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ willChange: 'transform' }}
            />
          </div>
        </div>
      </div>

      {/* Float keyframes (injected via style tag) */}
      <style>{`
        @keyframes collectionFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
