import Link from 'next/link'
import Image from 'next/image'
import { products } from '@/data/products'
import { getWhatsAppLink, defaultSettings } from '@/lib/googleSheets'

export default function Home() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 3)
  const whatsappLink = getWhatsAppLink(
    defaultSettings.whatsappNumber,
    "Hello! I'm interested in House of Varsha products."
  )

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream to-ivory section-padding">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
              {defaultSettings.logoText}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              {defaultSettings.tagline}
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                House of Varsha brings you authentic Indian ethnic wear crafted with love
                and tradition. Our collection features beautiful Kalamkari kurtis and
                elegant kurti sets perfect for every occasion.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We believe in quality fabrics, traditional prints, and comfortable fits
                that make you feel confident and beautiful.
              </p>
              <Link href="/about" className="text-gold font-medium hover:underline">
                Learn more about us &rarr;
              </Link>
            </div>
            <div className="bg-gradient-to-br from-coral/20 to-teal/20 rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl font-serif text-gold">HoV</span>
                <p className="mt-4 text-gray-500 text-sm">Est. 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most beloved pieces, each crafted with intention and care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="card group">
                <div className="aspect-square bg-gradient-to-br from-teal/20 to-coral/20 flex items-center justify-center relative overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <span className="text-4xl font-serif text-gold/50 group-hover:scale-110 transition-transform">
                      {product.name.charAt(0)}
                    </span>
                  )}
                  {product.code && (
                    <span className="absolute top-4 right-4 bg-white/90 text-gray-600 text-xs px-2 py-1 rounded z-10">
                      {product.code}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.sizes.map((size) => (
                        <span key={size} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gold font-medium">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop" className="btn-primary inline-block">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-teal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl opacity-90 mb-8">
            Connect with us on WhatsApp for personalized recommendations
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat with Us
          </a>
        </div>
      </section>
    </>
  )
}
