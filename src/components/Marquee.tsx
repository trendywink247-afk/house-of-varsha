import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

export function Marquee() {
  const barRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const items = [
    'Free Shipping on Orders Above \u20B92000',
    'Handcrafted with Love',
    'Premium Quality Fabrics',
    'Made in India',
  ];

  useEffect(() => {
    const bar = barRef.current;
    const track = trackRef.current;

    if (!bar || !track || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Base marquee animation — continuous infinite scroll
      const marqueeAnim = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: 'none',
      });

      // On scroll, speed up the marquee slightly
      ScrollTrigger.create({
        trigger: bar,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          // Scale timeScale from 1 to 2.5 based on scroll velocity
          const velocity = Math.abs(self.getVelocity());
          const speedMultiplier = gsap.utils.clamp(1, 2.5, 1 + velocity / 2000);
          gsap.to(marqueeAnim, {
            timeScale: speedMultiplier,
            duration: 0.3,
            overwrite: true,
          });
        },
      });

      // Hover slow effect
      const onEnter = () => {
        gsap.to(marqueeAnim, { timeScale: 0.3, duration: 0.6, ease: 'power2.out' });
      };
      const onLeave = () => {
        gsap.to(marqueeAnim, { timeScale: 1, duration: 0.6, ease: 'power2.out' });
      };

      bar.addEventListener('mouseenter', onEnter);
      bar.addEventListener('mouseleave', onLeave);

      // Store for cleanup
      return () => {
        bar.removeEventListener('mouseenter', onEnter);
        bar.removeEventListener('mouseleave', onLeave);
      };
    }, bar);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={barRef}
      className="relative w-full overflow-hidden"
      style={{ transform: 'skewY(-1deg)' }}
    >
      {/* Top gold line */}
      <div className="w-full h-px bg-gold/40" />

      <div className="bg-charcoal py-2.5">
        {/* Counter-skew the content so text stays level */}
        <div style={{ transform: 'skewY(1deg)' }}>
          <div
            ref={trackRef}
            className="flex whitespace-nowrap will-change-transform"
          >
            {[...Array(8)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center">
                {items.map((item, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className="flex items-center mx-6"
                  >
                    <Sparkles
                      className="w-3 h-3 text-gold/80 mr-2 flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="micro-label text-cream/80 tracking-[0.14em]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="w-full h-px bg-gold/40" />
    </div>
  );
}
