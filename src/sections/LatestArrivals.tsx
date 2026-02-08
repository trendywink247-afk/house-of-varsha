import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

gsap.registerPlugin(ScrollTrigger);

export function LatestArrivals() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const { products } = useProducts();
  // Get latest 4 products
  const latestProducts = products.slice(0, 4);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const products = productsRef.current;

    if (!section || !header || !products) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header.children,
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
        }
      );

      gsap.fromTo(
        products.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: products,
            start: 'top 80%',
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
            <h2 className="section-title text-charcoal">
              Latest
              <span className="text-gold ml-2">Arrivals</span>
            </h2>
          </div>
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
        </div>

        {/* Products Grid */}
        <div
          ref={productsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {latestProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover Image */}
                {product.hoverImage && (
                  <img
                    src={product.hoverImage}
                    alt={`${product.name} - alternate view`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                )}
                {/* Badge */}
                {product.featured && (
                  <span className="absolute top-2 left-2 micro-label bg-gold/90 text-white px-2 py-0.5">
                    New
                  </span>
                )}
              </div>

              {/* Info */}
              <div>
                <span className="micro-label text-text-secondary/70">{product.category}</span>
                <h3 className="font-display text-base text-charcoal group-hover:text-gold transition-colors mt-0.5">
                  {product.name}
                </h3>
                <p className="body-text text-charcoal/80 mt-0.5">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
