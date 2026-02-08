import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-sm py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-display text-lg tracking-[0.2em] uppercase text-charcoal">
              House of Varsha
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative micro-label text-charcoal/70 hover:text-charcoal transition-colors duration-300 group ${
                  isActive(link.href) ? 'text-charcoal' : ''
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[1px] bg-gold transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-charcoal/70 hover:text-charcoal transition-colors duration-300"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-charcoal"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Menu className="w-4 h-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-cream transition-transform duration-500 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-display text-2xl uppercase tracking-[0.1em] text-charcoal hover:text-gold transition-colors duration-300 ${
                isActive(link.href) ? 'text-gold' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
