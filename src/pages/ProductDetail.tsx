import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Heart, ChevronRight } from 'lucide-react';
import { getProductById, products } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { Footer } from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  useEffect(() => {
    if (!product) return;

    const gallery = galleryRef.current;
    const info = infoRef.current;

    if (!gallery || !info) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gallery.children,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gallery,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        info.children,
        { y: 20, opacity: 0 },
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
    });

    return () => ctx.revert();
  }, [product]);

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }

    setIsAdding(true);
    addToCart(product, selectedSize);

    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

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
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-3">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
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
                      src={image}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div ref={infoRef} className="lg:pt-4">
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
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`w-11 h-11 flex items-center justify-center micro-label transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-charcoal text-cream'
                        : 'bg-white border border-charcoal/15 text-charcoal hover:border-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p className="text-gold text-sm mt-2">Please select a size</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 py-3 font-sans font-medium uppercase tracking-[0.12em] text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdding
                    ? 'bg-gold text-cream'
                    : 'bg-charcoal text-cream hover:bg-gold'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={1.5} />
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
                className="w-12 h-12 flex items-center justify-center border border-charcoal/15 text-charcoal hover:border-gold hover:text-gold transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-4 h-4" strokeWidth={1.5} />
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
                  product.inStock ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="micro-label text-text-secondary/70">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-2">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <img
                      src={relatedProduct.hoverImage}
                      alt={`${relatedProduct.name} - alternate view`}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
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
