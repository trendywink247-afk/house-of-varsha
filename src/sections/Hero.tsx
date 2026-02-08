import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // Subtle fade-in animation on load
      gsap.fromTo(
        content.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-cream flex items-center justify-center"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545994/website/editorial-1.jpg"
          alt="House of Varsha"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/40 to-cream" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-20"
      >
        {/* Tagline */}
        <span className="micro-label text-text-secondary mb-6 block tracking-[0.2em]">
          Handcrafted Indian Ethnic Wear
        </span>

        {/* Main Title */}
        <h1 className="mb-8">
          <span className="block font-display font-light uppercase tracking-[0.08em] text-charcoal text-5xl sm:text-6xl lg:text-7xl leading-[1]">
            House
          </span>
          <span className="block font-display font-light uppercase tracking-[0.08em] text-charcoal text-5xl sm:text-6xl lg:text-7xl leading-[1] mt-1">
            of
          </span>
          <span className="block font-display font-light uppercase tracking-[0.08em] text-gold text-5xl sm:text-6xl lg:text-7xl leading-[1] mt-1">
            Varsha
          </span>
        </h1>

        {/* Description */}
        <p className="body-text text-text-secondary max-w-md mx-auto mb-10 leading-relaxed">
          Where tradition meets contemporary elegance. Each piece tells a story of 
          heritage, craftsmanship, and timeless beauty.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop" className="btn-primary">
            Explore Collection
          </Link>
          <Link to="/about" className="btn-outline">
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="micro-label text-text-secondary/60">Scroll</span>
        <ChevronDown className="w-4 h-4 text-text-secondary/60 animate-bounce" strokeWidth={1} />
      </div>
    </section>
  );
}
