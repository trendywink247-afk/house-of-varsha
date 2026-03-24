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
/*  Panel data                                                        */
/* ------------------------------------------------------------------ */

const PANELS = [
  {
    id: 'philosophy',
    layout: 'image-left' as const,
    tag: 'Est. 2024',
    headline: 'Our Philosophy',
    body: 'At House of Varsha, we believe in the timeless elegance of Indian ethnic wear. Each piece is carefully selected to bring you authentic craftsmanship, premium fabrics, and designs that celebrate tradition while embracing modern style.',
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545999/website/lifestyle-wide-1.jpg',
    imageAlt: 'Our Philosophy — lifestyle',
  },
  {
    id: 'craft',
    layout: 'text-left' as const,
    tag: 'Handcrafted',
    headline: 'The Craft',
    body: 'From exquisite Kalamkari prints to elegant kurti sets, each garment is crafted with premium fabrics and traditional techniques passed down through generations of master artisans.',
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545993/website/craft-detail.jpg',
    imageAlt: 'The Craft — artisan detail',
  },
  {
    id: 'collection',
    layout: 'full' as const,
    tag: 'Discover',
    headline: 'The Collection',
    body: 'Discover our carefully curated collection of handcrafted Indian ethnic wear, designed to bring out your inner elegance while honoring traditional craftsmanship.',
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545996/website/editorial-4.jpg',
    imageAlt: 'The Collection — editorial',
    cta: 'Explore the Collection',
    ctaLink: '/shop',
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function Philosophy() {
  const outerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLElement>(null);

  const isDesktop = useIsDesktop();
  const reducedMotion = usePrefersReducedMotion();

  /* ---- Desktop horizontal scroll ---- */
  useEffect(() => {
    if (!isDesktop || reducedMotion) return;

    const outer = outerRef.current;
    const panels = panelsRef.current;
    if (!outer || !panels) return;

    const ctx = gsap.context(() => {
      const panelEls = panels.querySelectorAll<HTMLElement>('.hscroll-panel');
      const totalPanels = panelEls.length;

      /* ---- Main horizontal tween ---- */
      const scrollTween = gsap.to(panels, {
        x: () => -(panels.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: () => `+=${panels.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: stickyRef.current!,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* ---- Per-panel animations ---- */
      panelEls.forEach((panel, i) => {
        const img = panel.querySelector<HTMLImageElement>('.panel-img');
        const headline = panel.querySelector<HTMLElement>('.panel-headline');
        const body = panel.querySelector<HTMLElement>('.panel-body');
        const tag = panel.querySelector<HTMLElement>('.panel-tag');
        const separator = panel.querySelector<HTMLElement>('.panel-separator');

        /* Parallax on images */
        if (img) {
          gsap.fromTo(
            img,
            { x: i === 0 ? 0 : 60, scale: i === 2 ? 1.1 : 1 },
            {
              x: i === 0 ? -60 : 0,
              scale: i === 2 ? 1.15 : i === 1 ? 1.04 : 1,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
        }

        /* SplitText on headline */
        if (headline) {
          const split = new SplitText(headline, { type: 'words' });
          gsap.fromTo(
            split.words,
            { y: '100%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              stagger: 0.06,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left 80%',
                end: 'left 40%',
                scrub: true,
              },
            },
          );
        }

        /* Body + tag fade up */
        const fadeEls = [tag, body].filter(Boolean) as HTMLElement[];
        if (fadeEls.length) {
          gsap.fromTo(
            fadeEls,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'left 70%',
                end: 'left 35%',
                scrub: true,
              },
            },
          );
        }

        /* Gold separator between panels */
        if (separator && i < totalPanels - 1) {
          gsap.fromTo(
            separator,
            { opacity: 0, scaleY: 0 },
            {
              opacity: 1,
              scaleY: 1,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: 'right 60%',
                end: 'right 30%',
                scrub: true,
              },
            },
          );
        }
      });
    }, outer);

    return () => ctx.revert();
  }, [isDesktop, reducedMotion]);

  /* ---- Mobile vertical fade-in ---- */
  useEffect(() => {
    if (isDesktop || reducedMotion) return;

    const section = mobileRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>('.mobile-panel').forEach((panel) => {
        const headline = panel.querySelector<HTMLElement>('.panel-headline');

        gsap.fromTo(
          panel.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        if (headline) {
          const split = new SplitText(headline, { type: 'words' });
          gsap.fromTo(
            split.words,
            { y: '100%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              stagger: 0.04,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: headline,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [isDesktop, reducedMotion]);

  /* ================================================================ */
  /*  Reduced motion — static vertical layout, no animations          */
  /* ================================================================ */
  if (reducedMotion) {
    return (
      <section className="relative w-full bg-beige/30">
        {PANELS.map((p) => (
          <div key={p.id} className="px-6 lg:px-12 py-16 lg:py-24">
            {p.layout === 'full' ? (
              <div className="relative aspect-[21/9] overflow-hidden rounded">
                <img
                  src={optimizeImg(p.image, 1400)}
                  alt={p.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/40 flex flex-col items-center justify-center text-center px-6">
                  <span className="micro-label text-gold mb-3">{p.tag}</span>
                  <h2 className="section-title text-cream mb-4">{p.headline}</h2>
                  <p className="body-text text-cream/80 max-w-lg mb-8">{p.body}</p>
                  {'cta' in p && p.cta && (
                    <Link
                      to={p.ctaLink}
                      className="inline-flex items-center gap-2 cta-link text-cream group"
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${p.layout === 'text-left' ? 'lg:[direction:rtl]' : ''}`}>
                <div className={`aspect-[4/5] overflow-hidden ${p.layout === 'text-left' ? 'lg:[direction:ltr]' : ''}`}>
                  <img
                    src={optimizeImg(p.image, 1200)}
                    alt={p.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={p.layout === 'text-left' ? 'lg:[direction:ltr]' : ''}>
                  <span className="micro-label text-gold mb-3 block">{p.tag}</span>
                  <h2 className="section-title text-charcoal mb-6">{p.headline}</h2>
                  <p className="body-text text-text-secondary max-w-md leading-relaxed">{p.body}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    );
  }

  /* ================================================================ */
  /*  Desktop — horizontal scroll                                     */
  /* ================================================================ */
  if (isDesktop) {
    return (
      <section ref={outerRef} className="relative w-full bg-beige/30" style={{ height: '300vh' }}>
        <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            ref={panelsRef}
            className="flex h-full"
            style={{ width: `${PANELS.length * 100}vw` }}
          >
            {/* ---- Panel 1: Our Philosophy (image left, text right) ---- */}
            <div className="hscroll-panel relative flex h-full w-screen flex-shrink-0">
              {/* Image */}
              <div className="relative w-[55%] h-full overflow-hidden">
                <img
                  src={optimizeImg(PANELS[0].image, 1600)}
                  alt={PANELS[0].imageAlt}
                  loading="lazy"
                  className="panel-img absolute inset-0 w-[120%] h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex w-[45%] flex-col justify-center px-[6vw]">
                <span className="panel-tag micro-label text-gold mb-4 block">
                  {PANELS[0].tag}
                </span>
                <div className="overflow-hidden mb-6">
                  <h2 className="panel-headline section-title text-charcoal">
                    {PANELS[0].headline}
                  </h2>
                </div>
                <p className="panel-body body-text text-text-secondary max-w-md leading-relaxed">
                  {PANELS[0].body}
                </p>
              </div>

              {/* Separator */}
              <div className="panel-separator absolute right-0 top-[15%] h-[70%] w-px bg-gold/40 origin-top" />
            </div>

            {/* ---- Panel 2: The Craft (text left, image right) ---- */}
            <div className="hscroll-panel relative flex h-full w-screen flex-shrink-0">
              {/* Text */}
              <div className="flex w-[45%] flex-col justify-center px-[6vw]">
                <span className="panel-tag micro-label text-gold mb-4 block">
                  {PANELS[1].tag}
                </span>
                <div className="overflow-hidden mb-6">
                  <h2 className="panel-headline section-title text-charcoal">
                    {PANELS[1].headline}
                  </h2>
                </div>
                <p className="panel-body body-text text-text-secondary max-w-md leading-relaxed">
                  {PANELS[1].body}
                </p>
              </div>

              {/* Image */}
              <div className="relative w-[55%] h-full overflow-hidden">
                <img
                  src={optimizeImg(PANELS[1].image, 1200)}
                  alt={PANELS[1].imageAlt}
                  loading="lazy"
                  className="panel-img w-full h-full object-cover"
                />
              </div>

              {/* Separator */}
              <div className="panel-separator absolute right-0 top-[15%] h-[70%] w-px bg-gold/40 origin-top" />
            </div>

            {/* ---- Panel 3: The Collection (full-width editorial) ---- */}
            <div className="hscroll-panel relative flex h-full w-screen flex-shrink-0 items-center justify-center">
              {/* Background image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={optimizeImg(PANELS[2].image, 1800)}
                  alt={PANELS[2].imageAlt}
                  loading="lazy"
                  className="panel-img w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/45" />
              </div>

              {/* Centered content */}
              <div className="relative z-10 text-center px-6 max-w-2xl">
                <span className="panel-tag micro-label text-gold mb-4 block">
                  {PANELS[2].tag}
                </span>
                <div className="overflow-hidden mb-6">
                  <h2 className="panel-headline section-title text-cream">
                    {PANELS[2].headline}
                  </h2>
                </div>
                <p className="panel-body body-text text-cream/80 mb-10 leading-relaxed">
                  {PANELS[2].body}
                </p>
                <MagneticButton className="inline-block">
                  <Link
                    to={PANELS[2].ctaLink}
                    className="inline-flex items-center gap-3 cta-link text-cream group"
                  >
                    <span>{PANELS[2].cta}</span>
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      strokeWidth={1.5}
                    />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ================================================================ */
  /*  Mobile — vertical stacked panels with fade animations           */
  /* ================================================================ */
  return (
    <section ref={mobileRef} className="relative w-full bg-beige/30">
      {/* Panel 1 */}
      <div className="mobile-panel px-6 py-16">
        <div className="aspect-[4/5] overflow-hidden mb-8">
          <img
            src={optimizeImg(PANELS[0].image, 800)}
            alt={PANELS[0].imageAlt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="micro-label text-gold mb-3 block">{PANELS[0].tag}</span>
        <div className="overflow-hidden mb-6">
          <h2 className="panel-headline section-title text-charcoal">{PANELS[0].headline}</h2>
        </div>
        <p className="body-text text-text-secondary max-w-md leading-relaxed">{PANELS[0].body}</p>
      </div>

      {/* Gold divider */}
      <div className="mx-6 h-px bg-gold/30" />

      {/* Panel 2 */}
      <div className="mobile-panel px-6 py-16">
        <span className="micro-label text-gold mb-3 block">{PANELS[1].tag}</span>
        <div className="overflow-hidden mb-6">
          <h2 className="panel-headline section-title text-charcoal">{PANELS[1].headline}</h2>
        </div>
        <p className="body-text text-text-secondary max-w-md leading-relaxed mb-8">{PANELS[1].body}</p>
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={optimizeImg(PANELS[1].image, 800)}
            alt={PANELS[1].imageAlt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Gold divider */}
      <div className="mx-6 h-px bg-gold/30" />

      {/* Panel 3 */}
      <div className="mobile-panel relative overflow-hidden">
        <div className="aspect-[3/4] relative">
          <img
            src={optimizeImg(PANELS[2].image, 800)}
            alt={PANELS[2].imageAlt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="micro-label text-gold mb-3">{PANELS[2].tag}</span>
            <div className="overflow-hidden mb-4">
              <h2 className="panel-headline section-title text-cream">{PANELS[2].headline}</h2>
            </div>
            <p className="body-text text-cream/80 max-w-sm mb-8 leading-relaxed">{PANELS[2].body}</p>
            <Link
              to={PANELS[2].ctaLink}
              className="inline-flex items-center gap-2 cta-link text-cream group"
            >
              <span>{PANELS[2].cta}</span>
              <ArrowRight
                className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
