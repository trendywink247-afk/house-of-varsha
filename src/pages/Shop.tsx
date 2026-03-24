import { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, X, Search, ArrowUpDown } from 'lucide-react';
import { categories } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { useStock } from '@/hooks/useStock';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { Footer } from '@/sections/Footer';
import { optimizeImg } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Skeleton Shimmer Card                                              */
/* ------------------------------------------------------------------ */

function SkeletonCard() {
  return (
    <div className="animate-shimmer">
      <div className="aspect-[3/4] bg-beige mb-3 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(201,177,138,0.08) 50%, transparent 100%)',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      </div>
      <div className="h-3 bg-beige rounded w-16 mb-2" />
      <div className="h-4 bg-beige rounded w-3/4 mb-1.5" />
      <div className="h-3 bg-beige rounded w-20" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shop Page                                                          */
/* ------------------------------------------------------------------ */

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = useMemo(
    () => searchParams.get('category') || 'all',
    [searchParams]
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'low' | 'high'>('default');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const animContextRef = useRef<gsap.Context | null>(null);
  const prevCategoryRef = useRef<string>(selectedCategory);

  const { products, isLoading } = useProducts();
  const { isAllSoldOut } = useStock();
  const prefersReducedMotion = usePrefersReducedMotion();

  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? products
      : products.filter(
          (p) => p.category.toLowerCase().replace(' ', '-') === selectedCategory
        );
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (sortBy !== 'default') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
        return sortBy === 'low' ? priceA - priceB : priceB - priceA;
      });
    }
    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy]);

  /* ---- Header entrance animation (runs once) ---- */
  useEffect(() => {
    const header = headerRef.current;
    if (!header || prefersReducedMotion) return;

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
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  /* ---- Grid entrance animation with filter transitions ---- */

  const animateGridEntrance = useCallback(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion) return;

    // Clean up previous animation context
    if (animContextRef.current) {
      animContextRef.current.revert();
    }

    const cards = Array.from(grid.children);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          clipPath: 'inset(100% 0 0 0)',
          y: 30,
          opacity: 0,
          rotate: -1,
        },
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          opacity: 1,
          rotate: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    animContextRef.current = ctx;
  }, [prefersReducedMotion]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const categoryChanged = prevCategoryRef.current !== selectedCategory;
    prevCategoryRef.current = selectedCategory;

    if (prefersReducedMotion) {
      gsap.set(grid.children, { opacity: 1, clipPath: 'inset(0)', y: 0, rotate: 0 });
      return;
    }

    if (categoryChanged && grid.children.length > 0) {
      // Animate out existing cards first, then animate in new ones
      const existingCards = Array.from(grid.children);
      gsap.to(existingCards, {
        opacity: 0,
        y: 15,
        stagger: 0.03,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          // After fade out, reset and animate entrance
          gsap.set(existingCards, { opacity: 0, y: 0 });
          animateGridEntrance();
        },
      });
    } else {
      animateGridEntrance();
    }

    return () => {
      if (animContextRef.current) {
        animContextRef.current.revert();
        animContextRef.current = null;
      }
    };
  }, [filteredProducts, selectedCategory, animateGridEntrance, prefersReducedMotion]);

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
      {/* Shimmer keyframe (injected once) */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

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

        {/* Search with focus animation */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" strokeWidth={1.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search products..."
            className="pl-10 pr-4 py-2.5 bg-white text-charcoal placeholder:text-charcoal/40 body-text text-sm focus:outline-none transition-all duration-500 border"
            style={{
              borderColor: isSearchFocused ? '#C9B18A' : 'rgba(44, 44, 44, 0.15)',
              width: isSearchFocused ? 'min(100%, 24rem)' : 'min(100%, 20rem)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}
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

          {/* Sort + Count */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-charcoal/50" strokeWidth={1.5} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'default' | 'low' | 'high')}
                className="bg-transparent micro-label text-charcoal/70 focus:outline-none cursor-pointer"
                aria-label="Sort products"
              >
                <option value="default">Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
            <span className="micro-label text-text-secondary/70">
              {isLoading ? 'Loading...' : `${filteredProducts.length} Products`}
            </span>
          </div>
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

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
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
                <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-3 transition-shadow duration-300 group-hover:shadow-lg">
                  <img
                    src={optimizeImg(product.image, 400)}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Hover Image */}
                  {product.hoverImage && (
                    <img
                      src={optimizeImg(product.hoverImage, 400)}
                      alt={`${product.name} - alternate view`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  )}
                  {/* Badge */}
                  {product.featured && !isAllSoldOut(product) && (
                    <span className="absolute top-2 left-2 micro-label bg-gold/90 text-white px-2 py-0.5">
                      New
                    </span>
                  )}
                  {/* Sold Out Badge */}
                  {isAllSoldOut(product) && (
                    <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                      <span className="micro-label bg-cream text-charcoal px-3 py-1">
                        Sold Out
                      </span>
                    </div>
                  )}
                  {/* Quick View Overlay — slides up from bottom */}
                  {!isAllSoldOut(product) && (
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pb-4 pt-8 bg-gradient-to-t from-charcoal/30 to-transparent">
                      <span className="px-3 py-1.5 bg-white/90 text-charcoal micro-label">
                        Quick View
                      </span>
                    </div>
                  )}
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
        )}

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
