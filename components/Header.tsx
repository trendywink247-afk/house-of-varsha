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
    { href: '/shop', label: 'Collection' },
    { href: '/about', label: 'Our Story' },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-warm-white/95 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container-editorial">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Left Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-10 flex-1">
              {navLinks.slice(1, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-caption uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${
                    isActive(link.href)
                      ? 'text-soft-black'
                      : 'text-muted-gray hover:text-soft-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <Link
              href="/"
              className="flex items-center justify-center flex-shrink-0"
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-display text-xl md:text-2xl text-soft-black tracking-tight">
                  {defaultSettings.storeName}
                </span>
              </motion.div>
            </Link>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center justify-end space-x-10 flex-1">
              <Link
                href="/contact"
                className={`relative text-caption uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${
                  isActive('/contact')
                    ? 'text-soft-black'
                    : 'text-muted-gray hover:text-soft-black'
                }`}
              >
                Contact
              </Link>
              
              {/* Cart Button */}
              <motion.button
                onClick={onCartClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative text-muted-gray hover:text-soft-black transition-colors duration-300"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-blush text-soft-black text-[9px] flex items-center justify-center font-medium"
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
                className="relative text-soft-black"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blush text-soft-black text-[9px] flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 flex items-center justify-center text-soft-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.5} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-warm-white z-40 md:hidden"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-soft-black"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>

            {/* Mobile Menu Content */}
            <div className="h-full flex flex-col justify-center items-center px-8">
              <nav className="text-center space-y-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      className={`block text-3xl font-display tracking-tight transition-colors duration-300 ${
                        isActive(link.href)
                          ? 'text-blush'
                          : 'text-soft-black hover:text-blush'
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
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute bottom-12 left-0 right-0 text-center"
              >
                <p className="text-caption uppercase tracking-[0.3em] text-muted-gray">
                  {defaultSettings.storeName}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-24" />
    </>
  );
}
