'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import { getWhatsAppLink, defaultSettings } from '@/lib/utils'
import ProductGallery from '@/components/ProductGallery'
import ProductCard, { ProductGrid } from '@/components/ProductCard'

interface ProductPageProps {
  params: { id: string }
}

// Get product by ID
const getProductById = (id: string) => {
  return products.find(p => p.id === id)
}

// Get related products
const getRelatedProducts = (currentId: string, limit: number = 4) => {
  return products
    .filter(p => p.id !== currentId)
    .slice(0, limit)
}

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  
  // Fetch product data
  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  // Fetch related products
  const relatedProducts = getRelatedProducts(product.id, 4)

  // Generate WhatsApp order link with selected size
  const getWhatsAppMessage = () => {
    let message = `Hello! I'm interested in ordering:\n\n` +
      `Product: ${product.name}\n` +
      `Code: ${product.code}\n` +
      `Price: ${product.price}`
    
    if (selectedSize) {
      message += `\nSize: ${selectedSize}`
    }
    
    message += `\n\nPlease confirm availability.`
    return message
  }

  const whatsappLink = getWhatsAppLink(
    defaultSettings.whatsappNumber, 
    getWhatsAppMessage()
  )

  const isOutOfStock = product.inStock === false

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-editorial py-4">
          <nav className="text-xs uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="mx-3">/</span>
            <Link href="/shop" className="hover:text-gray-900 transition-colors">
              Shop
            </Link>
            <span className="mx-3">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="bg-white">
        <div className="container-editorial py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery
                productName={product.name}
                image={product.image}
                images={product.images}
                color={product.color}
              />
            </div>

            {/* Product Info */}
            <div className="lg:py-8">
              {/* Category & Code */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  {product.category}
                </p>
                {product.code && (
                  <p className="text-xs text-gray-400">
                    Code: {product.code}
                  </p>
                )}
              </div>

              {/* Product Name */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-2xl text-gray-900">{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                    <span className="badge badge-sale">Sale</span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              {isOutOfStock && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Currently Sold Out</span>
                    <br />
                    <span className="text-gray-500">
                      Contact us for availability updates
                    </span>
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Color */}
              {product.color && (
                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                    Color
                  </h3>
                  <p className="text-gray-900">{product.color}</p>
                </div>
              )}

              {/* Available Sizes with Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                    Select Size {selectedSize && <span className="text-gold">({selectedSize})</span>}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                          selectedSize === size
                            ? 'bg-gray-900 text-white border-2 border-gray-900 shadow-lg transform scale-105'
                            : 'border-2 border-gray-200 text-gray-700 hover:border-gray-900 hover:shadow-md'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="text-xs text-gray-400 mt-2">
                      Please select a size to continue
                    </p>
                  )}
                </div>
              )}

              {/* Product Details */}
              {product.details && product.details.length > 0 && (
                <div className="mb-10 pt-8 border-t border-gray-100">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                    Product Details
                  </h3>
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-gray-600"
                      >
                        <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2 mr-3 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* WhatsApp Order Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-whatsapp w-full flex items-center justify-center gap-3 ${
                  isOutOfStock ? 'opacity-75' : ''
                } ${!selectedSize ? 'opacity-90' : ''}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {isOutOfStock ? 'Inquire on WhatsApp' : selectedSize ? `Order ${selectedSize} via WhatsApp` : 'Select Size to Order'}
              </a>

              <p className="text-xs text-center text-gray-400 mt-4">
                We'll respond within 24 hours to confirm your order
              </p>

              {/* Shipping & Returns Info */}
              <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gold mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-500">
                      On orders above Rs. 2000
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gold mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-900">Quality Assured</p>
                    <p className="text-xs text-gray-500">
                      Handpicked premium products
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-cream border-t border-gray-100">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
                  You May Also Like
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
                  Similar Styles
                </h2>
              </div>
              <Link
                href="/shop"
                className="link-underline text-sm uppercase tracking-widest text-gray-600 hidden md:block"
              >
                View All
              </Link>
            </div>

            <ProductGrid columns={4}>
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </ProductGrid>
          </div>
        </section>
      )}
    </>
  )
}
