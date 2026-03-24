import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { MessageCircle } from 'lucide-react';
import { useIsDesktop, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { MagneticButton } from '@/components/MagneticButton';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ------------------------------------------------------------------ */
/*  Ambient Sparkle (CSS-only floating gold dot)                       */
/* ------------------------------------------------------------------ */

interface SparkleProps {
  size: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
  opacity: number;
}

function Sparkle({ size, top, left, delay, duration, opacity }: SparkleProps) {
  return (
    <span
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        backgroundColor: '#C9B18A',
        opacity,
        animation: `sparkle-float ${duration} ${delay} ease-in-out infinite`,
      }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Sparkle data                                                       */
/* ------------------------------------------------------------------ */

const sparkles: SparkleProps[] = [
  { size: 4, top: '15%', left: '10%', delay: '0s', duration: '3.5s', opacity: 0.2 },
  { size: 3, top: '25%', left: '85%', delay: '0.8s', duration: '4s', opacity: 0.18 },
  { size: 5, top: '70%', left: '15%', delay: '1.2s', duration: '3s', opacity: 0.22 },
  { size: 3, top: '80%', left: '90%', delay: '0.4s', duration: '4.5s', opacity: 0.15 },
  { size: 6, top: '45%', left: '5%', delay: '1.8s', duration: '3.8s', opacity: 0.2 },
  { size: 4, top: '35%', left: '92%', delay: '2s', duration: '3.2s', opacity: 0.25 },
];

/* ------------------------------------------------------------------ */
/*  WhatsAppCTA Section                                                */
/* ------------------------------------------------------------------ */

export function WhatsAppCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const isDesktop = useIsDesktop();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const title = titleRef.current;

    if (!section || !content || !title) return;

    if (prefersReducedMotion) {
      gsap.set(content.children, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      /* ---- SplitText word-by-word reveal on heading ---- */
      const split = new SplitText(title, { type: 'words' });

      gsap.set(split.words, { opacity: 0, y: 25 });

      gsap.to(split.words, {
        opacity: 1,
        y: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      /* ---- Other content elements fade up ---- */
      const otherElements = Array.from(content.children).filter(
        (el) => el !== title && !el.contains(title),
      );

      gsap.fromTo(
        otherElements,
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
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 bg-beige/30 overflow-hidden"
    >
      {/* Sparkle float keyframes */}
      <style>{`
        @keyframes sparkle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(201, 177, 138, 0.25); }
          50% { box-shadow: 0 0 24px rgba(201, 177, 138, 0.45); }
        }
      `}</style>

      {/* Ambient Sparkles (desktop only) */}
      {isDesktop && !prefersReducedMotion && sparkles.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      <div className="w-full px-6 lg:px-12">
        <div
          ref={contentRef}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="micro-label text-gold mb-3 block">Need Help?</span>
          <h2
            ref={titleRef}
            className="section-title text-charcoal mb-4"
          >
            Let's Find Your
            <span className="text-gold ml-2">Perfect Look</span>
          </h2>
          <p className="body-text text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
            Not sure what to choose? Chat with us on WhatsApp for personalized
            recommendations and styling advice.
          </p>

          {/* Magnetic CTA with glow */}
          <MagneticButton className="inline-block">
            <a
              href="https://wa.me/917989733041?text=Hello! I'm interested in House of Varsha products."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-charcoal text-cream hover:bg-gold transition-colors duration-300"
              style={{
                animation: prefersReducedMotion ? 'none' : 'glow-pulse 3s ease-in-out infinite',
              }}
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              <span className="micro-label tracking-[0.12em]">Chat on WhatsApp</span>
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
