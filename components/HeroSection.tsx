'use client'

import Image from 'next/image'
import Link from 'next/link'

interface HeroSectionProps {
  storeName: string
  tagline: string
  /** Array of fully-resolved image URLs for the hero mosaic */
  heroImages: string[]
}

/**
 * HeroSection - Editorial mosaic hero with multiple images
 *
 * Layout: A striking mosaic grid of images with an overlay text panel.
 * On mobile: stacked image collage with text overlay.
 * On desktop: asymmetric grid with 5 images creating a magazine-style layout.
 *
 * Note: Image URLs must be fully resolved before passing to this component.
 * URL resolution happens on the server side in page.tsx.
 */
export default function HeroSection({ storeName, tagline, heroImages }: HeroSectionProps) {
  // Use provided images or show gradient placeholders
  const images = heroImages.filter(Boolean)
  const hasImages = images.length > 0

  // Pad to at least 5 images by repeating
  const displayImages: string[] = []
  if (hasImages) {
    for (let i = 0; i < 5; i++) {
      displayImages.push(images[i % images.length])
    }
  }

  return (
    <section className="relative min-h-[100vh] md:min-h-screen bg-cream overflow-hidden">
      {/* Image Mosaic Grid */}
      {hasImages ? (
        <div className="absolute inset-0 hero-mosaic-grid">
          {/* Image 1 - Large left panel */}
          <div className="hero-mosaic-item hero-mosaic-1 relative overflow-hidden">
            <Image
              src={displayImages[0]}
              alt="Collection highlight"
              fill
              className="object-cover hero-image-zoom"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Image 2 - Top right */}
          <div className="hero-mosaic-item hero-mosaic-2 relative overflow-hidden">
            <Image
              src={displayImages[1]}
              alt="Collection highlight"
              fill
              className="object-cover hero-image-zoom"
              sizes="(max-width: 768px) 50vw, 30vw"
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Image 3 - Middle right */}
          <div className="hero-mosaic-item hero-mosaic-3 relative overflow-hidden">
            <Image
              src={displayImages[2]}
              alt="Collection highlight"
              fill
              className="object-cover hero-image-zoom"
              sizes="(max-width: 768px) 50vw, 30vw"
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Image 4 - Bottom left */}
          <div className="hero-mosaic-item hero-mosaic-4 relative overflow-hidden">
            <Image
              src={displayImages[3]}
              alt="Collection highlight"
              fill
              className="object-cover hero-image-zoom"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Image 5 - Bottom right */}
          <div className="hero-mosaic-item hero-mosaic-5 relative overflow-hidden">
            <Image
              src={displayImages[4]}
              alt="Collection highlight"
              fill
              className="object-cover hero-image-zoom"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 z-10" />
        </div>
      ) : (
        /* Fallback gradient when no images */
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-coral/30 via-cream to-teal/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-coral/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Hero Content Overlay */}
      <div className="relative z-20 min-h-[100vh] md:min-h-screen flex items-center justify-center">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <p className={`animate-fade-in-up stagger-1 text-xs md:text-sm uppercase tracking-[0.3em] mb-6 ${
            hasImages ? 'text-white/80' : 'text-gray-500'
          }`}>
            Handcrafted Indian Ethnic Wear
          </p>
          <h1 className={`animate-fade-in-up stagger-2 font-serif text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-[1.1] ${
            hasImages ? 'text-white' : 'text-gray-900'
          }`}>
            {storeName}
          </h1>
          <p className={`animate-fade-in-up stagger-3 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed ${
            hasImages ? 'text-white/90' : 'text-gray-600'
          }`}>
            {tagline}
          </p>
          <div className="animate-fade-in-up stagger-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {hasImages ? (
              <>
                <Link
                  href="/shop"
                  className="bg-white text-gray-900 px-8 py-4 font-sans text-sm uppercase tracking-widest transition-all duration-300 ease-out hover:bg-gray-100 hover:-translate-y-0.5"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/about"
                  className="border border-white text-white px-8 py-4 font-sans text-sm uppercase tracking-widest bg-transparent transition-all duration-300 ease-out hover:bg-white hover:text-gray-900"
                >
                  Our Story
                </Link>
              </>
            ) : (
              <>
                <Link href="/shop" className="btn-primary">
                  Explore Collection
                </Link>
                <Link href="/about" className="btn-secondary">
                  Our Story
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg
          className={`w-6 h-6 ${hasImages ? 'text-white/60' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
