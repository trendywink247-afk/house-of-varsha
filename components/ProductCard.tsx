'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      <Link
        href={`/products/${product.id}`}
        className={`group block ${!hasHoverImage ? 'single-image' : ''} ${
          isOutOfStock ? 'opacity-60' : ''
        }`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-cream-dark aspect-[3/4]">
          {product.image ? (
            <>
              {/* Primary Image */}
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-editorial group-hover:scale-110"
                loading={priority ? 'eager' : 'lazy'}
              />
              {/* Hover Image */}
              {hasHoverImage && (
                <img
                  src={product.hoverImage}
                  alt={`${product.name} - alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 scale-110 transition-all duration-1000 ease-editorial group-hover:opacity-100 group-hover:scale-100"
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream">
              <span className="text-7xl font-display text-burgundy/10">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
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

          {/* Quick View Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-burgundy text-cream py-5 text-center transform translate-y-full transition-transform duration-500 ease-editorial group-hover:translate-y-0">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-medium">
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              Quick View
            </span>
          </div>

          {/* Corner accent */}
          <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[60px] border-b-burgundy border-l-[60px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Product Info */}
        <div className="py-6 px-1 text-center">
          {product.category && (
            <p className="text-[10px] uppercase tracking-[0.25em] text-burgundy/50 mb-2 font-medium">
              {product.category}
            </p>
          )}
          <h3 className="font-display text-lg text-burgundy mb-2 tracking-tight group-hover:text-burgundy-light transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-burgundy tracking-wide font-semibold">{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-burgundy/40 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
          {product.color && (
            <p className="text-xs text-burgundy/50 mt-2">{product.color}</p>
          )}
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
    <div className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
      {children}
    </div>
  );
}
