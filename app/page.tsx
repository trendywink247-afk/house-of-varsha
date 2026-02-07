import Link from 'next/link'
import Image from 'next/image'
import { products, type Product } from '@/lib/data'
import { getWhatsAppLink, defaultSettings } from '@/lib/utils'
import ProductCard, { ProductGrid } from '@/components/ProductCard'

export default function Home() {
  // Get featured products
  const featuredProducts = products.filter(p => p.featured).slice(0, 4)
  
  // Get latest products for the grid
  const latestProducts = products.slice(0, 8)

  const whatsappLink = getWhatsAppLink(
    defaultSettings.whatsappNumber,
    "Hello! I'm interested in House of Varsha products."
  )

  return (
    <>
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center bg-cream overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-coral/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="animate-fade-in-up stagger-1 text-xs md:text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
            Handcrafted Indian Ethnic Wear
          </p>
          <h1 className="animate-fade-in-up stagger-2 font-serif text-5xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-6 leading-[1.1]">
            {defaultSettings.storeName}
          </h1>
          <p className="animate-fade-in-up stagger-3 text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-10 font-light leading-relaxed">
            {defaultSettings.tagline}
          </p>
          <div className="animate-fade-in-up stagger-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="btn-primary">
              Explore Collection
            </Link>
            <Link href="/about" className="btn-secondary">
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-gray-900 text-white py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-8 text-sm tracking-widest uppercase">
              Free Shipping on Orders Above Rs. 2000
              <span className="mx-8 opacity-50">*</span>
              Handcrafted with Love
              <span className="mx-8 opacity-50">*</span>
              Premium Quality Fabrics
              <span className="mx-8 opacity-50">*</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured Collection Grid */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-editorial">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
                Curated Selection
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900">
                Featured Collection
              </h2>
            </div>

            <ProductGrid columns={4}>
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 2}
                />
              ))}
            </ProductGrid>

            <div className="text-center mt-12">
              <Link href="/shop" className="btn-secondary">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Split Image + Text Section */}
      <section className="bg-cream">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Image Side */}
          <div className="relative aspect-square lg:aspect-auto bg-gray-100">
            {latestProducts[0]?.image ? (
              <Image
                src={latestProducts[0].image}
                alt="House of Varsha Collection"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-coral/20 to-teal/20">
                <span className="text-8xl font-serif text-gold/30">HoV</span>
              </div>
            )}
          </div>

          {/* Text Side */}
          <div className="flex items-center justify-center p-8 md:p-16 lg:p-20">
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
                Our Philosophy
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6 leading-tight">
                Crafted with Intention, Worn with Pride
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At House of Varsha, we believe in the timeless elegance of Indian ethnic wear.
                Each piece is carefully selected to bring you authentic craftsmanship,
                premium fabrics, and designs that celebrate tradition while embracing modern style.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                From exquisite Kalamkari prints to elegant kurti sets, our collection
                offers something special for every occasion.
              </p>
              <Link href="/about" className="link-underline text-sm uppercase tracking-widest text-gray-900">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals / Latest Products */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">
                Just In
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-900">
                Latest Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="link-underline text-sm uppercase tracking-widest text-gray-600 mt-4 md:mt-0"
            >
              Shop All
            </Link>
          </div>

          <ProductGrid columns={4}>
            {latestProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding-sm bg-ivory border-y border-gray-100">
        <div className="container-editorial">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-900">Handcrafted Quality</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Each piece is carefully crafted with attention to detail and quality materials.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-900">Personal Touch</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We offer personalized styling advice and curated recommendations just for you.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-900">Fast Response</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Quick responses on WhatsApp and seamless ordering experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container-narrow text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
            Need Help?
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
            Let's Find Your Perfect Look
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
            Not sure what to choose? Chat with us on WhatsApp for personalized recommendations
            and styling advice.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-cream">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
            Stay in Touch
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Follow us on Instagram for the latest collections, styling tips, and exclusive offers.
          </p>
          <a
            href={`https://instagram.com/${defaultSettings.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow @{defaultSettings.instagramHandle}
          </a>
        </div>
      </section>
    </>
  )
}
