import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { MagneticButton } from '@/components/MagneticButton';
import { ProductCard } from '@/components/ProductCard';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function LatestArrivals() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();

  const { products } = useProducts();
  // Get latest 4 products
  const latestProducts = products.slice(0, 4);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const title = titleRef.current;
    const productsGrid = productsRef.current;

    if (!section || !header || !title || !productsGrid) return;

    // If reduced motion, show everything immediately
    if (prefersReducedMotion) {
      gsap.set(header.children, { opacity: 1, y: 0 });
      gsap.set(productsGrid.children, {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0 0 0)',
        rotate: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      /* ---- SplitText title reveal ---- */
      const split = new SplitText(title, { type: 'words' });

      // "Latest" revealed word-by-word, then "Arrivals" in gold
      const allWords = split.words;
      gsap.set(allWords, { opacity: 0, y: 30 });

      gsap.to(allWords, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      /* ---- Header elements (micro-label, link) fade in ---- */
      const headerChildren = Array.from(header.children).filter(
        (el) => el !== title && !el.contains(title),
      );

      gsap.fromTo(
        headerChildren,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      /* ---- Card entrance: clip-path reveal from bottom ---- */
      const cards = productsGrid.children;

      gsap.fromTo(
        cards,
        {
          clipPath: 'inset(100% 0 0 0)',
          y: 40,
          opacity: 0,
          rotate: -2,
        },
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          opacity: 1,
          rotate: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: productsGrid,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion, hasFinePointer]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 lg:py-28 bg-cream"
    >
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-10"
        >
          <div>
            <span className="micro-label text-gold mb-2 block">Just In</span>
            <h2 ref={titleRef} className="section-title text-charcoal">
              Latest
              <span className="text-gold ml-2">Arrivals</span>
            </h2>
          </div>

          <MagneticButton>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 cta-link text-charcoal group"
            >
              <span>View All Products</span>
              <ArrowRight
                className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </Link>
          </MagneticButton>
        </div>

        {/* Products Grid */}
        <div
          ref={productsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {latestProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
