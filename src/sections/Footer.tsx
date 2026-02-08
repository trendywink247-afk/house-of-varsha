import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Instagram, Mail, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const shopLinks = [
    { name: 'All Products', href: '/shop' },
    { name: 'Kurtis', href: '/shop?category=kurtis' },
    { name: 'Kurti Sets', href: '/shop?category=kurti-sets' },
    { name: 'Anarkali', href: '/shop?category=anarkali' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
  ];

  return (
    <footer
      ref={sectionRef}
      className="relative w-full py-12 lg:py-16 bg-cream border-t border-charcoal/10"
    >
      <div className="w-full px-6 lg:px-12">
        <div ref={contentRef}>
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-block mb-4">
                <span className="font-display text-xl tracking-[0.15em] uppercase text-charcoal">
                  House of Varsha
                </span>
              </Link>
              <p className="body-text text-text-secondary mb-4 max-w-xs leading-relaxed">
                Celebrating the art of Indian craftsmanship. Each piece tells a story 
                of heritage, passion, and timeless elegance.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/houseofvarsha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-charcoal/60 hover:text-gold transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                </a>
                <a
                  href="mailto:hello@houseofvarsha.com"
                  className="p-2 text-charcoal/60 hover:text-gold transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="micro-label text-charcoal mb-4">Shop</h3>
              <ul className="space-y-2">
                {shopLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="body-text text-text-secondary hover:text-charcoal transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="micro-label text-charcoal mb-4">Company</h3>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="body-text text-text-secondary hover:text-charcoal transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="micro-label text-charcoal mb-4">Stay Connected</h3>
              <p className="body-text text-text-secondary mb-3">
                Join our newsletter for exclusive offers.
              </p>
              {subscribed ? (
                <p className="body-text text-gold">Thank you for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2.5 bg-white border border-charcoal/15 border-r-0 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold body-text text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-2.5 bg-charcoal text-cream hover:bg-gold transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row md:justify-between gap-3 pt-8 border-t border-charcoal/10">
            <p className="micro-label text-text-secondary/70">
              © 2026 House of Varsha. All rights reserved.
            </p>
            <div className="flex gap-5">
              <Link to="/privacy" className="micro-label text-text-secondary/70 hover:text-charcoal transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="micro-label text-text-secondary/70 hover:text-charcoal transition-colors">
                Terms
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
