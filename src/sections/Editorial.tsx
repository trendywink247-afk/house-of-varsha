import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface EditorialProps {
  headline: string[];
  body: string;
  tag: string;
  cta: string;
  ctaLink: string;
  image: string;
  imagePosition: 'left' | 'right';
}

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

  useEffect(() => {
    const section = sectionRef.current;
    const imageEl = imageRef.current;
    const textEl = textRef.current;

    if (!section || !imageEl || !textEl) return;

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

      const headlineEl = textEl.querySelectorAll('.headline-line');
      const bodyEl = textEl.querySelector('.body-text');
      const tagEl = textEl.querySelector('.micro-label');
      const ctaEl = textEl.querySelector('.cta-link');

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          imageEl,
          { x: isImageLeft ? '-60vw' : '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          headlineEl,
          { x: isImageLeft ? '30vw' : '-30vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.05, ease: 'none' },
          0.1
        )
        .fromTo(
          [bodyEl, tagEl],
          { y: '10vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.14
        )
        .fromTo(
          ctaEl,
          { y: '8vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.18
        );

      // SETTLE (30% - 70%) - hold

      // EXIT (70% - 100%)
      scrollTl
        .to(imageEl, { x: isImageLeft ? '-10vw' : '10vw', opacity: 0.25, ease: 'power2.in' }, 0.7)
        .to(textEl, { x: isImageLeft ? '10vw' : '-10vw', opacity: 0.25, ease: 'power2.in' }, 0.72);
    }, section);

    return () => ctx.revert();
  }, [isImageLeft]);

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
      >
        <img
          src={image}
          alt={headline.join(' ')}
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
        {/* Headline */}
        <div className="mb-8">
          {headline.map((line, index) => (
            <div
              key={index}
              className={`headline-line font-display font-light uppercase tracking-[0.08em] leading-[1.05] text-charcoal text-3xl sm:text-4xl lg:text-5xl ${
                index === headline.length - 1 ? 'text-gold' : ''
              }`}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Tag */}
        <span className="micro-label text-gold mb-4">{tag}</span>

        {/* Body */}
        <p className="body-text text-text-secondary max-w-md mb-8">{body}</p>

        {/* CTA */}
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
      </div>
    </section>
  );
}
