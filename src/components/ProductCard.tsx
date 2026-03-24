import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { optimizeImg } from '@/lib/utils';
import type { Product } from '@/types';

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface ProductCardProps {
  product: Product;
  index: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();

  /* ---- 3D Tilt on hover (desktop only) ---- */

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hasFinePointer || !cardRef.current || !imageRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      // Tilt the card
      gsap.to(cardRef.current, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });

      // Parallax the image in the opposite direction
      gsap.to(imageRef.current, {
        x: -rotateY * 0.625,
        y: rotateX * 0.625,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Dynamic shadow based on tilt direction
      const shadowX = rotateY * 0.8;
      const shadowY = -rotateX * 0.8;
      gsap.to(cardRef.current, {
        boxShadow: `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.12)`,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    [hasFinePointer],
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current || !imageRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
      transformPerspective: 1000,
    });

    gsap.to(imageRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  /* ---- "New" badge pulse animation ---- */

  useEffect(() => {
    if (!badgeRef.current || prefersReducedMotion) return;

    const pulse = gsap.to(badgeRef.current, {
      scale: 1.05,
      duration: 0.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      pulse.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={cardRef}
      className="group will-change-transform"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-card-index={index}
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-3">
          <img
            ref={imageRef}
            src={optimizeImg(product.image, 400)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ willChange: 'transform' }}
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

          {/* "New" Badge with pulse */}
          {product.featured && (
            <span
              ref={badgeRef}
              className="absolute top-2 left-2 micro-label bg-gold/90 text-white px-2 py-0.5"
            >
              New
            </span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="micro-label text-text-secondary/70">
            {product.category}
          </span>
          <h3 className="font-display text-base text-charcoal group-hover:text-gold transition-colors mt-0.5">
            {product.name}
          </h3>
          <p className="body-text text-charcoal/80 mt-0.5">{product.price}</p>
        </div>
      </Link>
    </div>
  );
}
