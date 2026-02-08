import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface StatementProps {
  headline: string[];
  subheadline: string;
  caption: string;
  cta: string;
  ctaLink: string;
  image: string;
}

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

  useEffect(() => {
    const section = sectionRef.current;
    const headlineEl = headlineRef.current;
    const subheadlineEl = subheadlineRef.current;
    const imageEl = imageRef.current;
    const bottomEl = bottomRef.current;

    if (!section || !headlineEl || !subheadlineEl || !imageEl || !bottomEl) return;

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

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          headlineEl.querySelectorAll('.headline-line'),
          { y: '-40vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, ease: 'none' },
          0
        )
        .fromTo(
          subheadlineEl,
          { y: '10vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.08
        )
        .fromTo(
          imageEl,
          { y: '90vh', opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, ease: 'none' },
          0.1
        )
        .fromTo(
          bottomEl.children,
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.18
        );

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      scrollTl
        .to(
          headlineEl.querySelectorAll('.headline-line'),
          { y: '-12vh', opacity: 0.25, ease: 'power2.in' },
          0.7
        )
        .to(imageEl, { y: '-18vh', opacity: 0.25, ease: 'power2.in' }, 0.72)
        .to(bottomEl.children, { y: '8vh', opacity: 0.2, ease: 'power2.in' }, 0.74);
    }, section);

    return () => ctx.revert();
  }, []);

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
          <div
            key={index}
            className={`headline-line font-display font-light uppercase tracking-[0.08em] leading-[1.05] text-charcoal text-4xl sm:text-5xl lg:text-6xl ${
              index === headline.length - 1 ? 'text-gold' : ''
            }`}
          >
            {line}
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
        className="absolute left-[8vw] top-[38vh] lg:top-[42vh] w-[84vw] h-[40vh] lg:h-[44vh]"
      >
        <img
          src={image}
          alt={headline.join(' ')}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Content */}
      <div
        ref={bottomRef}
        className="absolute left-[8vw] right-[8vw] bottom-[6vh] flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4"
      >
        <p className="body-text text-text-secondary max-w-md">{caption}</p>
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
      </div>
    </section>
  );
}
