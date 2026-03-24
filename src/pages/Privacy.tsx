import { Footer } from '@/sections/Footer';

export function Privacy() {
  return (
    <div className="min-h-screen bg-cream pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12 max-w-3xl mx-auto">
        <span className="micro-label text-gold mb-2 block">Legal</span>
        <h1 className="section-title text-charcoal mb-8">Privacy Policy</h1>

        <div className="space-y-6 body-text text-text-secondary leading-relaxed">
          <p><strong className="text-charcoal">Last updated:</strong> March 2026</p>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Information We Collect</h2>
            <p>When you make a purchase, we collect your name, phone number, delivery address, and email. Payment information is processed securely through Razorpay and is never stored on our servers.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">How We Use Your Information</h2>
            <p>We use your information to process orders, deliver products, and communicate order updates via WhatsApp. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Payment Security</h2>
            <p>All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. We do not store credit card details or banking information.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Cookies</h2>
            <p>We use essential cookies to maintain your shopping cart and wishlist. No tracking or advertising cookies are used.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Contact Us</h2>
            <p>For privacy-related queries, email us at <a href="mailto:hello@houseofvarsha.com" className="text-gold hover:underline">hello@houseofvarsha.com</a> or call <a href="tel:+917989733041" className="text-gold hover:underline">+91 79897 33041</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
