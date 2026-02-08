import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function CollectionShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 bg-charcoal"
    >
      <div className="w-full px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <div ref={contentRef} className="order-2 lg:order-1">
            <span className="micro-label text-gold mb-3 block">The Collection</span>
            <h2 className="section-title text-cream mb-6">
              Elegance in
              <span className="text-gold ml-2">Every Thread</span>
            </h2>
            <p className="body-text text-cream/60 mb-8 max-w-md leading-relaxed">
              Discover our carefully curated collection of handcrafted Indian ethnic wear. 
              Each piece is designed to bring out your inner elegance while honoring 
              traditional craftsmanship.
            </p>
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
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 aspect-[4/5] overflow-hidden">
            <img
              src="https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545996/website/editorial-4.jpg"
              alt="The Collection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
