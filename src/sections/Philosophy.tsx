import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;

    if (!section || !content || !image) return;

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

      gsap.fromTo(
        image,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: image,
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
      className="relative w-full py-20 lg:py-28 bg-beige/30"
    >
      <div className="w-full px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div ref={imageRef} className="aspect-[4/5] overflow-hidden">
            <img
              src="https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545999/website/lifestyle-wide-1.jpg"
              alt="Our Philosophy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div ref={contentRef}>
            <span className="micro-label text-gold mb-3 block">Est. 2024</span>
            <h2 className="section-title text-charcoal mb-6">
              Our Philosophy
            </h2>
            <p className="body-text text-text-secondary mb-4 max-w-md leading-relaxed">
              At House of Varsha, we believe in the timeless elegance of Indian ethnic wear. 
              Each piece is carefully selected to bring you authentic craftsmanship, premium 
              fabrics, and designs that celebrate tradition while embracing modern style.
            </p>
            <p className="body-text text-text-secondary mb-8 max-w-md leading-relaxed">
              From exquisite Kalamkari prints to elegant kurti sets, our collection offers 
              something special for every occasion.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 cta-link text-charcoal group"
            >
              <span>Learn More About Us</span>
              <ArrowRight
                className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
