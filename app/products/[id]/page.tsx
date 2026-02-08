'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Truck, Shield, Heart } from 'lucide-react'
import { products } from '@/data/products'
import { getWhatsAppLink, defaultSettings } from '@/lib/utils'
import ProductCard, { ProductGrid } from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ProductPageProps {
  params: { id: string }
}

const getProductById = (id: string) => products.find(p => p.id === id)
const getRelatedProducts = (currentId: string, limit: number = 4) => 
  products.filter(p => p.id !== currentId).slice(0, limit)

export default function ProductPage({ params }: ProductPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  
  const product = getProductById(params.id)
  if (!product) notFound()

  const relatedProducts = getRelatedProducts(product.id, 4)
  const images = product.images?.length ? product.images : [product.image]
  const isOutOfStock = product.inStock === false

  const getWhatsAppMessage = () => {
    let message = `Hello! I'm interested in ordering:\n\n` +
      `Product: ${product.name}\n` +
      `Code: ${product.code}\n` +
      `Price: ${product.price}`
    if (selectedSize) message += `\nSize: ${selectedSize}`
    message += `\n\nPlease confirm availability.`
    return message
  }

  const whatsappLink = getWhatsAppLink(defaultSettings.whatsappNumber, getWhatsAppMessage())

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="border-b border-sand">
          <div className="container-editorial py-4">
            <nav className="flex items-center text-caption uppercase tracking-[0.1em] text-muted-gray">
              <Link href="/" className="hover:text-soft-black transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 mx-2" />
              <Link href="/shop" className="hover:text-soft-black transition-colors">Shop</Link>
              <ChevronRight className="w-3 h-3 mx-2" />
              <span className="text-soft-black">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <section className="section-padding-sm">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Product Images */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:sticky lg:top-32 lg:self-start"
              >
                {/* Main Image */}
                <div className="relative aspect-[3/4] bg-soft-cream overflow-hidden mb-4">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.featured && (
                    <span className="absolute top-4 left-4 badge badge-new">New</span>
                  )}
                </div>
                
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-20 h-20 bg-soft-cream overflow-hidden transition-all duration-300 ${
                          selectedImage === idx ? 'ring-1 ring-soft-black' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:py-8"
              >
                {/* Category */}
                <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-3">
                  {product.category}
                </p>

                {/* Product Name */}
                <h1 className="font-display text-display-sm text-soft-black mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-display text-2xl text-soft-black">{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-body-lg text-muted-gray line-through">{product.originalPrice}</span>
                      <span className="badge badge-sale">Sale</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-body text-warm-gray leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Color */}
                {product.color && (
                  <div className="mb-8 pb-8 border-b border-sand">
                    <p className="text-caption uppercase tracking-[0.15em] text-muted-gray mb-3">Color</p>
                    <p className="text-body text-soft-black">{product.color}</p>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8 pb-8 border-b border-sand">
                    <p className="text-caption uppercase tracking-[0.15em] text-muted-gray mb-4">
                      Size {selectedSize && <span className="text-blush">({selectedSize})</span>}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-14 h-14 flex items-center justify-center text-body-sm font-medium transition-all duration-300 ${
                            selectedSize === size
                              ? 'bg-soft-black text-warm-white'
                              : 'border border-sand text-soft-black hover:border-soft-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                {isOutOfStock && (
                  <div className="mb-8 p-4 bg-soft-cream border border-sand">
                    <p className="text-body-sm text-muted-gray">
                      <span className="font-medium text-soft-black">Currently Sold Out</span>
                      <br />
                      Contact us for availability updates
                    </p>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-4 mb-10">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn-primary w-full justify-center ${isOutOfStock ? 'opacity-75' : ''}`}
                  >
                    {isOutOfStock ? 'Inquire on WhatsApp' : selectedSize ? `Order ${selectedSize}` : 'Order via WhatsApp'}
                  </a>
                  
                  {!isOutOfStock && (
                    <p className="text-caption text-center text-muted-gray">
                      We'll respond within 24 hours to confirm your order
                    </p>
                  )}
                </div>

                {/* Product Details */}
                {product.details && product.details.length > 0 && (
                  <div className="mb-10 pb-10 border-b border-sand">
                    <p className="text-caption uppercase tracking-[0.15em] text-muted-gray mb-4">Details</p>
                    <ul className="space-y-2">
                      {product.details.map((detail, index) => (
                        <li key={index} className="flex items-start text-body-sm text-warm-gray">
                          <span className="w-1 h-1 bg-blush rounded-full mt-2 mr-3 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-blush mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="text-body-sm font-medium text-soft-black">Free Shipping</p>
                      <p className="text-caption text-muted-gray">Orders above Rs. 2000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blush mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="text-body-sm font-medium text-soft-black">Quality Assured</p>
                      <p className="text-caption text-muted-gray">Handpicked products</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="section-padding bg-soft-cream border-t border-sand">
            <div className="container-editorial">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-end justify-between mb-12"
              >
                <div>
                  <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-3">You May Also Like</p>
                  <h2 className="font-display text-display-sm text-soft-black">Similar Styles</h2>
                </div>
                <Link href="/shop" className="btn-text hidden md:flex">
                  View All
                </Link>
              </motion.div>

              <ProductGrid columns={4}>
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard 
                    key={relatedProduct.id} 
                    product={relatedProduct}
                    index={index}
                  />
                ))}
              </ProductGrid>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
