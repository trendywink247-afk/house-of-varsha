import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { Footer } from '@/sections/Footer';

const faqs = [
  {
    q: 'What sizes do you offer?',
    a: 'We offer sizes M, L, XL, and XXL across all our products. Please refer to the size chart on each product page for measurements.',
  },
  {
    q: 'What fabrics do you use?',
    a: 'Our kurtis and kurti sets are made from pure cotton fabric, perfect for Indian weather. Our coordsets use premium rayon fabric for comfort and style.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are dispatched within 2-3 business days. Delivery takes 5-7 business days across India. You\'ll receive tracking details via WhatsApp.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major payment methods through Razorpay — UPI, credit/debit cards, net banking, and popular wallets like Paytm and PhonePe.',
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'Yes, we accept returns within 7 days of delivery for unused items in original packaging. Contact us via WhatsApp or email to initiate a return.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order is shipped, we\'ll send you the tracking details via WhatsApp. You can also reach out to us for updates.',
  },
  {
    q: 'Are your products handcrafted?',
    a: 'Yes! Our Kalamkari collection features traditional hand-painted textiles. Each piece is crafted by skilled artisans using time-honored techniques.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Currently, we ship only within India. We\'re working on international shipping and will announce it soon.',
  },
];

export function FAQs() {
  usePageMeta({ title: 'FAQs', description: 'Frequently asked questions about House of Varsha orders, shipping, returns, and more.' });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-cream pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12 max-w-3xl mx-auto">
        <span className="micro-label text-gold mb-2 block">Help</span>
        <h1 className="section-title text-charcoal mb-3">Frequently Asked Questions</h1>
        <p className="body-text text-text-secondary mb-10">
          Can't find what you're looking for? Reach out via{' '}
          <a href="https://wa.me/917989733041" className="text-gold hover:underline">WhatsApp</a>
          {' '}or{' '}
          <a href="mailto:hello@houseofvarsha.com" className="text-gold hover:underline">email</a>.
        </p>

        <div className="space-y-0 border-t border-charcoal/10">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-charcoal/10">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className="font-display text-base lg:text-lg text-charcoal group-hover:text-gold transition-colors pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-charcoal/50 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-40 pb-5' : 'max-h-0'
                }`}
              >
                <p className="body-text text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
