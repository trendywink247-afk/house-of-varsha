import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Heart, ChevronRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useStock } from '@/hooks/useStock';
import { useWishlist } from '@/hooks/useWishlist';
import { useIsDesktop, useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Footer } from '@/sections/Footer';
import { optimizeImg } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  SVG Check Draw-in Animation Component                             */
/* ------------------------------------------------------------------ */

function AnimatedCheck({ className }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, []);

  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path ref={pathRef} d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  ProductDetail Page                                                 */
/* ------------------------------------------------------------------ */

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const { isSoldOut, isAllSoldOut } = useStock();
  const { toggle: toggleWishlist, isWishlisted } = useWishlist();

  const isDesktop = useIsDesktop();
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();

  usePageMeta({
    title: product ? product.name : 'Product',
    description: product ? product.description : undefined
  });

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');

  const galleryRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLImageElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const sizeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  /* ---- Entrance Animations ---- */

  useEffect(() => {
    if (!product) return;

    const gallery = galleryRef.current;
    const info = infoRef.current;
    const related = relatedRef.current;

    if (!gallery || !info) return;

    if (prefersReducedMotion) {
      gsap.set(gallery.children, { opacity: 1, clipPath: 'inset(0)' });
      gsap.set(info.children, { opacity: 1, y: 0 });
      if (related) gsap.set(related.children, { opacity: 1, clipPath: 'inset(0)', y: 0, rotate: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Gallery: clipPath reveal
      gsap.fromTo(
        gallery.children,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0% 0 0 0)',
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gallery,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Info panel: stagger up
      gsap.fromTo(
        info.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: info,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Related products: stagger cascade (same as FeaturedCollection)
      if (related && related.children.length > 0) {
        gsap.fromTo(
          related.children,
          {
            clipPath: 'inset(100% 0 0 0)',
            y: 40,
            opacity: 0,
            rotate: -1,
          },
          {
            clipPath: 'inset(0% 0 0 0)',
            y: 0,
            opacity: 1,
            rotate: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: related,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [product, prefersReducedMotion]);

  /* ---- Image Zoom Handlers (desktop fine pointer only) ---- */

  const handleImageMouseEnter = useCallback(() => {
    if (!hasFinePointer) return;
    setIsZooming(true);
  }, [hasFinePointer]);

  const handleImageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hasFinePointer) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin(`${x}% ${y}%`);
    },
    [hasFinePointer]
  );

  const handleImageMouseLeave = useCallback(() => {
    if (!hasFinePointer) return;
    setIsZooming(false);
  }, [hasFinePointer]);

  /* ---- Size Select Animation ---- */

  const handleSizeSelect = (size: string) => {
    if (product && isSoldOut(product.id, size)) return;
    setSelectedSize(size);
    setShowSizeError(false);

    // Pulse animation on the size button
    const btn = sizeButtonRefs.current.get(size);
    if (btn && !prefersReducedMotion) {
      gsap.fromTo(
        btn,
        { scale: 1 },
        {
          scale: 1.15,
          duration: 0.15,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      );
    }
  };

  /* ---- Add to Cart ---- */

  const addToCartBtnRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    if (!product || isSoldOut(product.id, selectedSize)) return;

    setIsAdding(true);
    addToCart(product, selectedSize);

    // Animate button bg from charcoal to gold
    const btn = addToCartBtnRef.current;
    if (btn && !prefersReducedMotion) {
      gsap.to(btn, {
        backgroundColor: '#C9B18A',
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    setTimeout(() => {
      setIsAdding(false);
      // Animate back
      if (btn && !prefersReducedMotion) {
        gsap.to(btn, {
          backgroundColor: '#2C2C2C',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }, 1500);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-xl text-charcoal mb-3">Product not found</p>
          <Link to="/shop" className="cta-link text-charcoal">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productAllSoldOut = product ? isAllSoldOut(product) : false;

  return (
    <div className="min-h-screen bg-cream pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6">
          <Link to="/" className="micro-label text-text-secondary/70 hover:text-charcoal transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-text-secondary/50" strokeWidth={1.5} />
          <Link to="/shop" className="micro-label text-text-secondary/70 hover:text-charcoal transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-text-secondary/50" strokeWidth={1.5} />
          <span className="micro-label text-charcoal">{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Gallery */}
          <div ref={galleryRef}>
            {/* Main Image with Zoom */}
            <div
              className="relative aspect-[3/4] overflow-hidden bg-beige mb-3 cursor-crosshair"
              onMouseEnter={handleImageMouseEnter}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
            >
              <img
                ref={mainImageRef}
                src={optimizeImg(product.images[selectedImage], 800)}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 ease-out"
                style={{
                  transform: isZooming && hasFinePointer ? 'scale(2)' : 'scale(1)',
                  transformOrigin: zoomOrigin,
                }}
              />
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-20 flex-shrink-0 overflow-hidden bg-beige border transition-colors ${
                      selectedImage === index
                        ? 'border-gold'
                        : 'border-transparent hover:border-charcoal/20'
                    }`}
                  >
                    <img
                      src={optimizeImg(image, 80)}
                      alt={`${product.name} - view ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info — Sticky on Desktop */}
          <div
            ref={infoRef}
            className={`lg:pt-4 ${isDesktop ? 'lg:self-start' : ''}`}
            style={isDesktop ? { position: 'sticky', top: '120px' } : undefined}
          >
            {/* Category & Name */}
            <span className="micro-label text-gold mb-2 block">{product.category}</span>
            <h1 className="font-display text-2xl lg:text-3xl text-charcoal mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <p className="font-display text-xl text-charcoal mb-5">{product.price}</p>

            {/* Description */}
            <p className="body-text text-text-secondary mb-6 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="micro-label text-charcoal">Select Size</span>
                <span className="micro-label text-text-secondary/70">Code: {product.code}</span>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((size) => {
                  const sold = isSoldOut(product.id, size);
                  return (
                    <button
                      key={size}
                      ref={(el) => {
                        if (el) sizeButtonRefs.current.set(size, el);
                      }}
                      onClick={() => handleSizeSelect(size)}
                      disabled={sold}
                      title={sold ? 'Sold out' : undefined}
                      className={`w-11 h-11 flex items-center justify-center micro-label transition-all duration-300 relative overflow-hidden ${
                        sold
                          ? 'bg-beige border border-charcoal/10 text-charcoal/30 cursor-not-allowed line-through'
                          : selectedSize === size
                          ? 'bg-charcoal text-cream'
                          : 'bg-white border border-charcoal/15 text-charcoal hover:border-gold'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {showSizeError && (
                <p className="text-gold text-sm mt-2">Please select a size</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                ref={addToCartBtnRef}
                onClick={handleAddToCart}
                disabled={isAdding || productAllSoldOut}
                className={`flex-1 py-3 font-sans font-medium uppercase tracking-[0.12em] text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
                  productAllSoldOut
                    ? 'bg-beige text-charcoal/40 cursor-not-allowed border border-charcoal/10'
                    : isAdding
                    ? 'bg-gold text-cream'
                    : 'bg-charcoal text-cream hover:bg-gold'
                }`}
              >
                {productAllSoldOut ? (
                  <span>Sold Out</span>
                ) : isAdding ? (
                  <>
                    <AnimatedCheck className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              <button
                onClick={() => product && toggleWishlist(product.id)}
                className={`w-12 h-12 flex items-center justify-center border transition-colors ${
                  product && isWishlisted(product.id)
                    ? 'border-gold text-gold bg-gold/10'
                    : 'border-charcoal/15 text-charcoal hover:border-gold hover:text-gold'
                }`}
                aria-label={product && isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className="w-4 h-4" strokeWidth={1.5} fill={product && isWishlisted(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Details */}
            <div className="border-t border-charcoal/10 pt-5">
              <h3 className="micro-label text-charcoal mb-3">Product Details</h3>
              <ul className="space-y-1.5">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gold rounded-full mt-1.5 flex-shrink-0" />
                    <span className="body-text text-text-secondary">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock Status */}
            <div className="mt-5 flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  productAllSoldOut ? 'bg-red-500' : 'bg-green-500'
                }`}
              />
              <span className="micro-label text-text-secondary/70">
                {productAllSoldOut ? 'All Sizes Sold Out' : 'In Stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display text-xl text-charcoal">
                You May Also Like
              </h2>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-charcoal hover:text-gold transition-colors group"
              >
                <span className="micro-label tracking-[0.12em]">View All</span>
                <ArrowRight
                  className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
            <div
              ref={relatedRef}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
            >
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-2">
                    <img
                      src={optimizeImg(relatedProduct.image, 400)}
                      alt={relatedProduct.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {relatedProduct.hoverImage && (
                      <img
                        src={optimizeImg(relatedProduct.hoverImage, 400)}
                        alt={`${relatedProduct.name} - alternate view`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}
                  </div>
                  <span className="micro-label text-text-secondary/70">
                    {relatedProduct.category}
                  </span>
                  <h3 className="font-display text-base text-charcoal group-hover:text-gold transition-colors mt-0.5">
                    {relatedProduct.name}
                  </h3>
                  <p className="body-text text-charcoal/80 mt-0.5">{relatedProduct.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
