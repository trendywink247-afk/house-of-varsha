import Link from 'next/link'
import { getProducts, getSettings, getCategories } from '@/lib/data'
import { getWhatsAppLink } from '@/lib/googleSheets'
import ProductCard, { ProductGrid } from '@/components/ProductCard'

export const metadata = {
  title: 'Shop - House of Varsha',
  description: 'Explore our curated collection of premium handcrafted kurtis and kurti sets.',
}

// Revalidate every 60 seconds to pick up Google Sheets changes
export const revalidate = 60

export default async function Shop() {
  // Fetch data from Google Sheets (or fallback)
  const [products, settings, categories] = await Promise.all([
    getProducts(),
    getSettings(),
    getCategories(),
  ])

  const whatsappLink = getWhatsAppLink(
    settings.whatsappNumber,
    "Hello! I'm interested in a custom order from House of Varsha."
  )

  return (
    <>
      {/* Hero Section - Minimal */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-editorial text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
            Our Collection
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Shop All
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Discover our curated selection of handcrafted Indian ethnic wear.
            Each piece tells a story of tradition and craftsmanship.
          </p>

          {/* Category Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <span className="px-5 py-2 bg-gray-900 text-white text-xs uppercase tracking-widest">
                All
              </span>
              {categories.map((category) => (
                <span
                  key={category}
                  className="px-5 py-2 border border-gray-200 text-gray-600 text-xs uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Count Bar */}
      <div className="border-y border-gray-100 bg-white">
        <div className="container-editorial py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="text-sm text-gray-900 bg-transparent border-none focus:outline-none cursor-pointer">
              <option>Featured</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-gray-400 mb-4">
                No products available
              </p>
              <p className="text-gray-500">
                Check back soon for new arrivals!
              </p>
            </div>
          ) : (
            <ProductGrid columns={4}>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                />
              ))}
            </ProductGrid>
          )}
        </div>
      </section>

      {/* Custom Order CTA */}
      <section className="bg-ivory border-t border-gray-100">
        <div className="container-editorial py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
              Looking for something specific?
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6">
              Custom Orders Welcome
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Can't find exactly what you're looking for? We offer custom orders
              and personalized styling. Reach out to us on WhatsApp.
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
              Request Custom Order
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
