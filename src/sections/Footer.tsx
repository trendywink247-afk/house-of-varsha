import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Instagram, Mail, ArrowRight, Youtube } from 'lucide-react';
import { useHasFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Brand Name with Letter Wave Hover                                  */
/* ------------------------------------------------------------------ */

function BrandName({ hasFinePointer }: { hasFinePointer: boolean }) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!hasFinePointer || !containerRef.current) return;

    const letters = containerRef.current.querySelectorAll<HTMLSpanElement>('[data-letter]');
    gsap.to(letters, {
      y: -3,
      stagger: {
        each: 0.03,
        from: 'start',
      },
      duration: 0.3,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    });
  }, [hasFinePointer]);

  const text = 'House of Varsha';

  return (
    <span
      ref={containerRef}
      className="font-display text-xl tracking-[0.15em] uppercase text-charcoal inline-flex cursor-default"
      onMouseEnter={handleMouseEnter}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          data-letter
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Social Icon with Hover Bounce                                      */
/* ------------------------------------------------------------------ */

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const iconRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, {
      scale: 1.2,
      y: -2,
      color: '#C9B18A',
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!iconRef.current) return;
    gsap.to(iconRef.current, {
      scale: 1,
      y: 0,
      color: '',
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  return (
    <a
      ref={iconRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 -m-1 text-charcoal/60 transition-colors inline-block"
      aria-label={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const hasFinePointer = useHasFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const columns = columnsRef.current;
    const divider = dividerRef.current;
    const copyright = copyrightRef.current;

    if (!section || !columns || !divider || !copyright) return;

    if (prefersReducedMotion) {
      gsap.set(columns.children, { opacity: 1, y: 0 });
      gsap.set(divider, { width: '100%' });
      gsap.set(copyright, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      /* ---- Column stagger entrance ---- */
      gsap.fromTo(
        columns.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      /* ---- Gold divider line draws in ---- */
      gsap.fromTo(
        divider,
        { width: '0%' },
        {
          width: '100%',
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: divider,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      /* ---- Copyright fades in last ---- */
      gsap.fromTo(
        copyright,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: copyright,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleSubmitHover = useCallback(() => {
    if (!submitBtnRef.current || prefersReducedMotion) return;
    gsap.to(submitBtnRef.current, {
      scale: 1.08,
      duration: 0.2,
      ease: 'power2.out',
    });
  }, [prefersReducedMotion]);

  const handleSubmitLeave = useCallback(() => {
    if (!submitBtnRef.current) return;
    gsap.to(submitBtnRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

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
        {/* Main Footer Content */}
        <div
          ref={columnsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12"
        >
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <BrandName hasFinePointer={hasFinePointer} />
            </Link>
            <p className="body-text text-text-secondary mb-4 max-w-xs leading-relaxed">
              Celebrating the art of Indian craftsmanship. Each piece tells a story
              of heritage, passion, and timeless elegance.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon
                href="https://www.instagram.com/houseof_varsha"
                label="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </SocialIcon>
              <SocialIcon
                href="https://youtube.com/@houseofvarsha"
                label="YouTube"
              >
                <Youtube className="w-4 h-4" strokeWidth={1.5} />
              </SocialIcon>
              <SocialIcon
                href="mailto:hello@houseofvarsha.com"
                label="Email"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </SocialIcon>
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
              <form onSubmit={handleSubscribe} className="relative">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2.5 bg-white border border-r-0 text-charcoal placeholder:text-charcoal/40 focus:outline-none body-text text-sm transition-colors duration-500"
                    style={{
                      borderColor: isInputFocused
                        ? '#C9B18A'
                        : 'rgba(44, 44, 44, 0.15)',
                    }}
                    required
                  />
                  <button
                    ref={submitBtnRef}
                    type="submit"
                    className="px-3 py-2.5 bg-charcoal text-cream hover:bg-gold transition-colors"
                    aria-label="Subscribe"
                    onMouseEnter={handleSubmitHover}
                    onMouseLeave={handleSubmitLeave}
                  >
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
                {/* Gold underline that expands from center on focus */}
                <div
                  className="absolute bottom-0 left-1/2 h-[1.5px] bg-gold transition-all duration-500 ease-out"
                  style={{
                    width: isInputFocused ? '100%' : '0%',
                    transform: 'translateX(-50%)',
                  }}
                />
              </form>
            )}
          </div>
        </div>

        {/* Gold Divider Line */}
        <div className="overflow-hidden">
          <div
            ref={dividerRef}
            className="h-px bg-charcoal/10"
            style={{ width: prefersReducedMotion ? '100%' : '0%' }}
          />
        </div>

        {/* Copyright */}
        <div
          ref={copyrightRef}
          className="flex flex-col md:flex-row md:justify-between gap-3 pt-8"
        >
          <p className="micro-label text-text-secondary/70">
            &copy; 2026 House of Varsha. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="micro-label text-text-secondary/70 hover:text-charcoal transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="micro-label text-text-secondary/70 hover:text-charcoal transition-colors">
              Terms
            </Link>
            <span className="micro-label text-text-secondary/40">|</span>
            <a
              href="https://ai.geekspace.space"
              target="_blank"
              rel="noopener noreferrer"
              className="micro-label text-text-secondary/40 hover:text-gold transition-colors duration-300"
            >
              Powered by GeekSpace
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
