import Link from 'next/link'
import { products } from '@/data/products'

export const metadata = {
  title: 'Shop - House of Varsha',
  description: 'Explore our curated collection of premium handcrafted products.',
}

export default function Shop() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream to-ivory py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif text-gray-900 mb-4">Our Collection</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Each piece in our collection tells a unique story of craftsmanship and care
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="card group">
                <div className="aspect-square bg-gradient-to-br from-sage/20 to-dustyrose/20 flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl font-serif text-taupe/40 group-hover:scale-110 transition-transform duration-500">
                    {product.name.charAt(0)}
                  </span>
                  {product.featured && (
                    <span className="absolute top-4 left-4 bg-taupe text-white text-xs px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs text-taupe uppercase tracking-wider mb-2">{product.category}</p>
                  <h3 className="text-xl font-serif text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-taupe font-semibold text-lg">{product.price}</p>
                    <span className="text-sm text-gray-400 group-hover:text-taupe transition-colors">
                      View Details &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-gray-600 mb-8">
            We offer custom orders and personalized products. Reach out to us directly!
          </p>
          <a
            href="https://wa.me/1234567890?text=Hello! I'm interested in a custom order from House of Varsha."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Request Custom Order
          </a>
        </div>
      </section>
    </>
  )
}
