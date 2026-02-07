'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultSettings } from '@/lib/utils';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function Header({ cartCount = 0, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container-editorial">
          <div className="flex justify-between items-center h-24 md:h-28">
            {/* Left Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-12 flex-1">
              {navLinks.slice(1, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs uppercase tracking-[0.25em] font-medium transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'text-burgundy'
                      : 'text-burgundy/60 hover:text-burgundy'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gold"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <Link
              href="/"
              className="flex items-center justify-center flex-shrink-0 group"
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="/logo.jpg" 
                  alt={defaultSettings.storeName}
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center justify-end space-x-12 flex-1">
              <Link
                href="/contact"
                className={`relative text-xs uppercase tracking-[0.25em] font-medium transition-colors duration-300 ${
                  isActive('/contact')
                    ? 'text-burgundy'
                    : 'text-burgundy/60 hover:text-burgundy'
                }`}
              >
                Contact
                {isActive('/contact') && (
                  <motion.span
                    layoutId="navIndicator"
                    className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gold"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
              
              {/* Cart Button */}
              <motion.button
                onClick={onCartClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative text-burgundy/60 hover:text-burgundy transition-colors duration-300"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-burgundy text-cream text-[10px] flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </div>

            {/* Mobile Right Side */}
            <div className="flex md:hidden items-center gap-4">
              <motion.button
                onClick={onCartClick}
                whileTap={{ scale: 0.95 }}
                className="relative text-burgundy"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-burgundy text-cream text-[10px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 flex items-center justify-center text-burgundy"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay - DRAMATIC */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-burgundy z-50 md:hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-cream border border-cream/20"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </motion.button>

            {/* Mobile Menu Content */}
            <div className="h-full flex flex-col justify-center items-center px-6 relative">
              <nav className="text-center space-y-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 30, rotateX: -45 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Link
                      href={link.href}
                      className={`block text-4xl font-display tracking-tight transition-colors duration-300 ${
                        isActive(link.href)
                          ? 'text-gold'
                          : 'text-cream/80 hover:text-gold'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Menu Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-12 left-0 right-0 text-center"
              >
                <span className="font-display text-xl text-cream/50">
                  {defaultSettings.storeName}
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-24 md:h-28" />
    </>
  );
}
