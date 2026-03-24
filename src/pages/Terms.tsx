import { Footer } from '@/sections/Footer';

export function Terms() {
  return (
    <div className="min-h-screen bg-cream pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12 max-w-3xl mx-auto">
        <span className="micro-label text-gold mb-2 block">Legal</span>
        <h1 className="section-title text-charcoal mb-8">Terms of Service</h1>

        <div className="space-y-6 body-text text-text-secondary leading-relaxed">
          <p><strong className="text-charcoal">Last updated:</strong> March 2026</p>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Orders & Payment</h2>
            <p>All orders are confirmed upon successful payment through Razorpay. Prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to cancel orders if items are out of stock.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Shipping</h2>
            <p>We ship across India. Orders are dispatched within 2-3 business days. Delivery typically takes 5-7 business days depending on your location. You will receive tracking details via WhatsApp.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Returns & Exchanges</h2>
            <p>We accept returns within 7 days of delivery for unused items in original packaging. To initiate a return, contact us via WhatsApp or email with your order details. Refunds are processed within 5-7 business days after we receive the returned item.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Product Care</h2>
            <p>Our handcrafted garments require gentle care. We recommend hand washing or dry cleaning for best results. Please refer to the care label on each garment.</p>
          </section>

          <section>
            <h2 className="font-display text-xl text-charcoal mb-3">Contact</h2>
            <p>For any queries, reach us at <a href="mailto:hello@houseofvarsha.com" className="text-gold hover:underline">hello@houseofvarsha.com</a> or WhatsApp at <a href="https://wa.me/917989733041" className="text-gold hover:underline">+91 79897 33041</a>.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
