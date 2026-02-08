'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { products } from '@/data/products'
import { getWhatsAppLink, defaultSettings } from '@/lib/utils'
import ProductCard, { ProductGrid } from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChevronDown } from 'lucide-react'

// Get unique categories from products
const getCategories = () => {
  const categories = new Set(products.map(p => p.category).filter(Boolean))
  return ['All', ...Array.from(categories)]
}

// Parse price for sorting
const parsePrice = (price: string): number => {
  const num = price.replace(/[^0-9]/g, '')
  return parseInt(num) || 0
}

export default function Shop() {
  const [sortBy, setSortBy] = useState('Featured')
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = getCategories()

  const whatsappLink = getWhatsAppLink(
    defaultSettings.whatsappNumber,
    "Hello! I'm interested in a custom order from House of Varsha."
  )

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === activeCategory)
    }
    
    // Sort
    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
        break
      case 'Price: High to Low':
        filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        break
      case 'Newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      case 'Featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return 0
        })
        break
    }
    
    return filtered
  }, [sortBy, activeCategory])

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Editorial */}
        <section className="bg-warm-white pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container-editorial text-center">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4"
            >
              Our Collection
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-display text-soft-black mb-6"
            >
              {activeCategory === 'All' ? 'Shop All' : activeCategory}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-body text-muted-gray max-w-xl mx-auto leading-relaxed"
            >
              Discover our curated selection of handcrafted Indian ethnic wear.
            </motion.p>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="border-y border-sand bg-warm-white sticky top-20 md:top-24 z-30">
          <div className="container-editorial py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-caption uppercase tracking-[0.1em] transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-soft-black text-warm-white'
                        : 'bg-transparent text-muted-gray hover:text-soft-black border border-sand hover:border-soft-black'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-body-sm text-muted-gray">Sort by:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent border border-sand px-4 py-2 pr-10 text-body-sm text-soft-black focus:outline-none focus:border-soft-black cursor-pointer"
                  >
                    <option>Featured</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gray pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-body-sm text-muted-gray mt-4">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="section-padding bg-warm-white">
          <div className="container-editorial">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-muted-gray mb-4">
                  No products found
                </p>
                <p className="text-body text-muted-gray mb-8">
                  Try selecting a different category
                </p>
                <button 
                  onClick={() => setActiveCategory('All')}
                  className="btn-primary"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <ProductGrid columns={4}>
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 4}
                    index={index}
                  />
                ))}
              </ProductGrid>
            )}
          </div>
        </section>

        {/* Custom Order CTA */}
        <section className="section-padding-sm bg-soft-cream">
          <div className="container-narrow text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
                Looking for something specific?
              </p>
              <h2 className="font-display text-display-sm text-soft-black mb-6">
                Custom Orders Welcome
              </h2>
              <p className="text-body text-muted-gray mb-8 max-w-md mx-auto">
                Can't find exactly what you're looking for? We offer custom orders
                and personalized styling advice.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Request Custom Order
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
