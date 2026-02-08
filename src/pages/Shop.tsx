import { useMemo, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, X } from 'lucide-react';
import { categories } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { Footer } from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = useMemo(
    () => searchParams.get('category') || 'all',
    [searchParams]
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { products, isLoading } = useProducts();

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter(
          (p) => p.category.toLowerCase().replace(' ', '-') === selectedCategory
        );

  useEffect(() => {
    const header = headerRef.current;
    const grid = gridRef.current;

    if (!header || !grid) return;

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
        grid.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [filteredProducts]);

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <span className="micro-label text-gold mb-2 block">Explore</span>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
            <h1 className="section-title text-charcoal">
              Our
              <span className="text-gold ml-2">Collection</span>
            </h1>
            <p className="body-text text-text-secondary max-w-sm leading-relaxed">
              Discover our curated selection of handcrafted Indian ethnic wear.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8 pb-6 border-b border-charcoal/10">
          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-4 py-2 micro-label transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'bg-charcoal text-cream'
                    : 'bg-transparent text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-charcoal/15 text-charcoal w-fit"
            aria-label="Toggle category filters"
          >
            <Filter className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="micro-label">Filter</span>
          </button>

          {/* Results Count */}
          <span className="micro-label text-text-secondary/70">
            {isLoading ? 'Loading...' : `${filteredProducts.length} Products`}
          </span>
        </div>

        {/* Mobile Filter Dropdown */}
        {isFilterOpen && (
          <div className="lg:hidden mb-6 p-4 bg-beige/30 border border-charcoal/10">
            <div className="flex justify-between items-center mb-3">
              <span className="micro-label text-charcoal">Categories</span>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 text-charcoal"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-4 py-2 micro-label transition-all duration-300 ${
                    selectedCategory === category.slug
                      ? 'bg-charcoal text-cream'
                      : 'bg-white text-charcoal'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {filteredProducts.map((product) => (
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
                {/* Quick View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-3 py-1.5 bg-white/90 text-charcoal micro-label">
                    Quick View
                  </span>
                </div>
              </div>

              {/* Info */}
              <div>
                <span className="micro-label text-text-secondary/70">{product.category}</span>
                <h3 className="font-display text-base text-charcoal group-hover:text-gold transition-colors mt-0.5 line-clamp-1">
                  {product.name}
                </h3>
                <p className="body-text text-charcoal/80 mt-0.5">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="font-display text-xl text-charcoal mb-3">
              No products found
            </p>
            <p className="body-text text-text-secondary mb-6">
              Try selecting a different category.
            </p>
            <button
              onClick={() => handleCategoryChange('all')}
              className="inline-flex items-center gap-2 cta-link text-charcoal group"
            >
              <span>View All Products</span>
              <ArrowRight
                className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
