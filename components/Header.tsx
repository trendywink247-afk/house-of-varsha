'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container-editorial">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Left Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm uppercase tracking-widest text-gray-700 hover:text-gray-900 link-underline transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300"
            >
              <Image
                src="/logo.png"
                alt="House of Varsha"
                width={44}
                height={44}
                className="w-10 h-10 md:w-11 md:h-11"
              />
              <div className="hidden sm:block">
                <span className="text-lg md:text-xl font-serif font-medium text-gray-900 tracking-tight">
                  House of Varsha
                </span>
              </div>
            </Link>

            {/* Right Side - Desktop */}
            <div className="hidden md:flex items-center justify-end space-x-6 flex-1">
              <Link
                href="/shop"
                className="text-sm uppercase tracking-widest text-gray-700 hover:text-gray-900 link-underline transition-colors duration-300"
              >
                View All
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-4 flex flex-col justify-between">
                <span
                  className={`block h-[1.5px] bg-gray-900 transform transition-all duration-300 origin-center ${
                    isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-gray-900 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-gray-900 transform transition-all duration-300 origin-center ${
                    isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 transform transition-transform duration-500 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
          <div className="relative w-6 h-6">
            <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-gray-900 transform -translate-y-1/2 rotate-45" />
            <span className="absolute top-1/2 left-0 w-full h-[1.5px] bg-gray-900 transform -translate-y-1/2 -rotate-45" />
          </div>
        </button>

        {/* Mobile Menu Content */}
        <div className="h-full flex flex-col justify-center items-center px-6">
          <nav className="text-center space-y-8">
            <Link
              href="/"
              className="block text-3xl font-serif text-gray-900 hover:text-gold transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-3xl font-serif text-gray-900 hover:text-gold transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 opacity-60"
              onClick={() => setIsMenuOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="House of Varsha"
                width={32}
                height={32}
              />
              <span className="text-sm font-serif text-gray-600">
                House of Varsha
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  )
}
