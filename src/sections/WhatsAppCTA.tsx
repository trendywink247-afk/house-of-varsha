import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function WhatsAppCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
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
        <div
          ref={contentRef}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="micro-label text-gold mb-3 block">Need Help?</span>
          <h2 className="section-title text-charcoal mb-4">
            Let's Find Your
            <span className="text-gold ml-2">Perfect Look</span>
          </h2>
          <p className="body-text text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
            Not sure what to choose? Chat with us on WhatsApp for personalized 
            recommendations and styling advice.
          </p>
          <a
            href="https://wa.me/917989733041?text=Hello! I'm interested in House of Varsha products."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-charcoal text-cream hover:bg-gold transition-colors duration-300"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
            <span className="micro-label tracking-[0.12em]">Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
