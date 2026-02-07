'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/data'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const isOutOfStock = product.inStock === false
  
  // Get primary and hover images
  const primaryImage = product.image
  const hoverImage = product.hoverImage || (product.images && product.images.length > 1 ? product.images[1] : null)
  const hasHoverImage = !!hoverImage && hoverImage !== primaryImage

  return (
    <Link
      href={`/products/${product.id}`}
      className={`product-card group block ${!hasHoverImage ? 'single-image' : ''} ${
        isOutOfStock ? 'opacity-70' : ''
      }`}
    >
      {/* Image Container */}
      <div className="image-container bg-gray-50">
        {primaryImage ? (
          <>
            {/* Primary Image */}
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="primary-image"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
            {/* Hover Image */}
            {hoverImage && (
              <Image
                src={hoverImage}
                alt={`${product.name} - alternate view`}
                fill
                className="hover-image"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-cream">
            <span className="text-5xl font-serif text-gray-300">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.featured && !product.originalPrice && (
            <span className="badge badge-new">New</span>
          )}
          {product.originalPrice && !isOutOfStock && (
            <span className="badge badge-sale">Sale</span>
          )}
          {isOutOfStock && (
            <span className="badge bg-gray-100 text-gray-500">Sold Out</span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="quick-add">
          <span className="text-xs uppercase tracking-widest text-gray-600">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="info">
        {product.category && (
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            {product.category}
          </p>
        )}
        <h3 className="name">{product.name}</h3>
        <div className="flex items-center justify-center gap-2">
          <span className="price">{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>
        {product.color && (
          <p className="text-xs text-gray-400 mt-1">{product.color}</p>
        )}
      </div>
    </Link>
  )
}

// Grid wrapper for consistent product layouts
export function ProductGrid({
  children,
  columns = 4,
}: {
  children: React.ReactNode
  columns?: 2 | 3 | 4
}) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {children}
    </div>
  )
}
