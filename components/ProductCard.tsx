'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
}

export default function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
  const isOutOfStock = !product.inStock;
  const hasHoverImage = product.hoverImage && product.hoverImage !== product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      <Link
        href={`/products/${product.id}`}
        className={`group block ${isOutOfStock ? 'opacity-60' : ''}`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-soft-cream aspect-[3/4]">
          {product.image ? (
            <>
              {/* Primary Image */}
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                loading={priority ? 'eager' : 'lazy'}
              />
              {/* Hover Image */}
              {hasHoverImage && (
                <img
                  src={product.hoverImage}
                  alt={`${product.name} - alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-editorial group-hover:opacity-100"
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-soft-cream">
              <span className="font-display text-6xl text-light-gray">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-soft-black/0 transition-all duration-500 group-hover:bg-soft-black/5" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && !product.originalPrice && (
              <span className="badge badge-new">New</span>
            )}
            {product.originalPrice && !isOutOfStock && (
              <span className="badge badge-sale">Sale</span>
            )}
            {isOutOfStock && (
              <span className="badge badge-sold-out">Sold Out</span>
            )}
          </div>

          {/* Quick View - subtle slide up */}
          <div className="absolute bottom-0 left-0 right-0 bg-warm-white/95 backdrop-blur-sm py-3 text-center transform translate-y-full transition-transform duration-500 ease-editorial group-hover:translate-y-0">
            <span className="text-caption uppercase tracking-[0.15em] text-soft-black font-medium">
              View Details
            </span>
          </div>
        </div>

        {/* Product Info - minimal, elegant */}
        <div className="pt-5 text-center">
          {product.category && (
            <p className="text-caption uppercase tracking-[0.15em] text-muted-gray mb-2">
              {product.category}
            </p>
          )}
          <h3 className="font-display text-body-lg text-soft-black mb-2 group-hover:text-blush transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-3">
            <span className="text-body text-warm-gray">{product.price}</span>
            {product.originalPrice && (
              <span className="text-body-sm text-light-gray line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Grid wrapper for consistent product layouts
interface ProductGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ children, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12`}>
      {children}
    </div>
  );
}
