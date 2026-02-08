import { getWhatsAppLink, getInstagramLink, defaultSettings } from '@/lib/utils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Contact Us - House of Varsha',
  description: "Get in touch with House of Varsha. We'd love to hear from you!",
}

export default function Contact() {
  const whatsappLink = getWhatsAppLink(
    defaultSettings.whatsappNumber,
    "Hello! I'm reaching out from the House of Varsha website."
  )
  const instagramLink = getInstagramLink(defaultSettings.instagramHandle)

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container-narrow text-center">
            <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
              Contact
            </p>
            <h1 className="font-display text-display text-soft-black mb-6">
              Get in Touch
            </h1>
            <p className="text-body-lg text-warm-gray leading-relaxed max-w-xl mx-auto">
              We'd love to hear from you. Reach out through any of our channels below.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="section-padding-sm bg-warm-white">
          <div className="container-editorial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 md:p-10 border border-sand hover:border-soft-black transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 flex items-center justify-center bg-blush/20 text-blush flex-shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-body-lg text-soft-black mb-1">WhatsApp</h3>
                    <p className="text-body-sm text-muted-gray mb-3">Quick responses, personal service</p>
                    <span className="text-body-sm text-soft-black group-hover:text-blush transition-colors">
                      +91-7569619390
                    </span>
                  </div>
                </div>
              </a>

              {/* Instagram */}
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 md:p-10 border border-sand hover:border-soft-black transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 flex items-center justify-center bg-blush/20 text-blush flex-shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-body-lg text-soft-black mb-1">Instagram</h3>
                    <p className="text-body-sm text-muted-gray mb-3">Follow our journey and updates</p>
                    <span className="text-body-sm text-soft-black group-hover:text-blush transition-colors">
                      @{defaultSettings.instagramHandle}
                    </span>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${defaultSettings.email}`}
                className="group p-8 md:p-10 border border-sand hover:border-soft-black transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 flex items-center justify-center bg-blush/20 text-blush flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-body-lg text-soft-black mb-1">Email</h3>
                    <p className="text-body-sm text-muted-gray mb-3">For detailed inquiries</p>
                    <span className="text-body-sm text-soft-black group-hover:text-blush transition-colors">
                      {defaultSettings.email}
                    </span>
                  </div>
                </div>
              </a>

              {/* Location */}
              <div className="p-8 md:p-10 border border-sand">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 flex items-center justify-center bg-blush/20 text-blush flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-body-lg text-soft-black mb-1">Location</h3>
                    <p className="text-body-sm text-muted-gray mb-3">Based in India</p>
                    <span className="text-body-sm text-warm-gray">
                      Shipping Worldwide
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding bg-soft-cream">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
                FAQ
              </p>
              <h2 className="font-display text-display-sm text-soft-black">
                Common Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How do I place an order?',
                  a: 'Simply browse our collection, click on the product you like, and use the WhatsApp button to connect with us directly. We\'ll guide you through the process!'
                },
                {
                  q: 'What sizes are available?',
                  a: 'Most of our kurtis and kurti sets are available in M, L, XL, and XXL sizes. Contact us for specific measurements or custom sizing.'
                },
                {
                  q: 'Do you ship internationally?',
                  a: 'Yes! We ship worldwide. Shipping costs and delivery times vary by location. Contact us for specific details.'
                },
                {
                  q: 'Can I request custom products?',
                  a: 'Absolutely! We love creating custom pieces. Reach out via WhatsApp to discuss your ideas and we\'ll make it happen.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-warm-white p-6 md:p-8">
                  <h3 className="font-display text-body-lg text-soft-black mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-body-sm text-muted-gray leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-soft-black text-warm-white">
          <div className="container-narrow text-center">
            <h2 className="font-display text-display-sm mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-body text-muted-gray mb-8 max-w-lg mx-auto">
              Explore our curated collection of handcrafted Indian ethnic wear.
            </p>
            <a href="/shop" className="btn-secondary border-warm-white text-warm-white hover:bg-warm-white hover:text-soft-black">
              Browse Collection
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
