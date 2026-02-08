'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { products } from '@/data/products';
import { defaultSettings, getWhatsAppLink } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import ProductCard, { ProductGrid } from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Animated Section Component
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const latestProducts = products.slice(0, 4);
  
  const whatsappLink = getWhatsAppLink(
    defaultSettings.whatsappNumber,
    "Hello! I'm interested in House of Varsha products."
  );

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Header />
      
      <main className="flex-grow">
        {/* HERO SECTION - Editorial, Calm */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-warm-white">
          {/* Background with subtle parallax */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: heroY }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-warm-white via-warm-white/90 to-warm-white z-10" />
            {/* Soft decorative shapes */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blush/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-clay/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Hero Content */}
          <motion.div 
            className="relative z-20 container-editorial w-full pt-32 pb-20"
            style={{ opacity: heroOpacity }}
          >
            <div className="max-w-3xl mx-auto text-center">
              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-caption uppercase tracking-[0.3em] text-muted-gray mb-8"
              >
                Handcrafted Indian Ethnic Wear
              </motion.p>

              {/* Main Title - Editorial */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-display-xl text-soft-black leading-[0.95] mb-8"
              >
                House of Varsha
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-body-lg text-warm-gray mb-12 max-w-xl mx-auto leading-relaxed"
              >
                Where tradition meets contemporary elegance. 
                Each piece tells a story of heritage and timeless beauty.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/shop" className="btn-primary">
                  Explore Collection
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
                <Link href="/about" className="btn-secondary">
                  Our Story
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-caption uppercase tracking-[0.3em] text-muted-gray">Scroll</span>
              <ArrowDown className="w-4 h-4 text-muted-gray" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </section>

        {/* MARQUEE BANNER - Subtle */}
        <div className="bg-soft-cream py-4 overflow-hidden border-y border-sand">
          <div className="marquee-container">
            <div className="marquee-content">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="mx-12 text-caption uppercase tracking-[0.2em] text-muted-gray">
                  Free Shipping on Orders Above Rs. 2000
                  <span className="mx-8 text-blush">—</span>
                  Handcrafted with Love
                  <span className="mx-8 text-blush">—</span>
                  Premium Quality Fabrics
                  <span className="mx-8 text-blush">—</span>
                  Made in India
                  <span className="mx-8 text-blush">—</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURED COLLECTION */}
        <section className="section-padding bg-warm-white">
          <div className="container-editorial">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-20">
              <AnimatedSection>
                <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
                  Curated Selection
                </p>
                <h2 className="font-display text-display text-soft-black">
                  Featured Collection
                </h2>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2} className="mt-6 md:mt-0">
                <Link href="/shop" className="btn-ghost">
                  View All
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </Link>
              </AnimatedSection>
            </div>

            <ProductGrid columns={4}>
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 2}
                  index={index}
                />
              ))}
            </ProductGrid>
          </div>
        </section>

        {/* STORY SECTION - Split Layout */}
        <section className="bg-soft-cream">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Side */}
            <div className="relative aspect-square lg:aspect-auto overflow-hidden min-h-[500px] lg:min-h-[700px]">
              <motion.div
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={getOptimizedImageUrl('editorial/story-craftsmanship', 1200)}
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-soft-cream/30 lg:to-transparent" />
            </div>

            {/* Text Side */}
            <div className="flex items-center justify-center p-10 md:p-16 lg:p-24">
              <div className="max-w-lg">
                <AnimatedSection>
                  <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-6">
                    Our Philosophy
                  </p>
                  
                  <h2 className="font-display text-display-sm text-soft-black mb-8 leading-tight">
                    Crafted with Intention
                  </h2>
                  
                  <p className="text-body-lg text-warm-gray leading-relaxed mb-6">
                    At House of Varsha, we believe in the timeless elegance of Indian ethnic wear.
                    Each piece is carefully selected to bring you authentic craftsmanship
                    and designs that celebrate tradition while embracing modern style.
                  </p>
                  
                  <p className="text-body text-muted-gray leading-relaxed mb-10">
                    From exquisite Kalamkari prints to elegant kurti sets, our collection
                    offers something special for every occasion.
                  </p>
                  
                  <Link href="/about" className="btn-text">
                    Learn More About Us
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </Link>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS */}
        <section className="section-padding bg-warm-white">
          <div className="container-editorial">
            <AnimatedSection className="text-center mb-16">
              <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
                Just In
              </p>
              <h2 className="font-display text-display text-soft-black mb-6">
                Latest Arrivals
              </h2>
              <div className="w-16 h-px bg-blush mx-auto" />
            </AnimatedSection>

            <ProductGrid columns={4}>
              {latestProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </ProductGrid>

            <AnimatedSection delay={0.4} className="text-center mt-14">
              <Link href="/shop" className="btn-secondary">
                View All Products
              </Link>
            </AnimatedSection>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="section-padding-sm bg-soft-cream">
          <div className="container-editorial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                { title: 'Handcrafted', desc: 'Each piece crafted with attention to detail' },
                { title: 'Premium Quality', desc: 'Only the finest fabrics and materials' },
                { title: 'Personal Touch', desc: 'Dedicated styling advice just for you' },
              ].map((item, index) => (
                <AnimatedSection key={item.title} delay={index * 0.15} className="text-center">
                  <h3 className="font-display text-body-lg text-soft-black mb-4">{item.title}</h3>
                  <p className="text-body-sm text-muted-gray leading-relaxed">{item.desc}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* WHATSAPP CTA */}
        <section className="section-padding bg-warm-white">
          <div className="container-narrow text-center">
            <AnimatedSection>
              <div className="w-16 h-16 bg-blush/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-7 h-7 text-blush" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              
              <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
                Need Help?
              </p>
              <h2 className="font-display text-display-sm text-soft-black mb-6">
                Let's Find Your Perfect Look
              </h2>
              <p className="text-body text-muted-gray max-w-md mx-auto mb-10">
                Not sure what to choose? Chat with us on WhatsApp for personalized recommendations
                and styling advice.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* INSTAGRAM CTA */}
        <section className="section-padding-sm bg-soft-cream border-t border-sand">
          <div className="container-narrow text-center">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-3 mb-6">
                <svg className="w-5 h-5 text-blush" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-display text-body-lg text-soft-black">@{defaultSettings.instagramHandle}</span>
              </div>
              <p className="text-body-sm text-muted-gray mb-8">
                Follow us for the latest collections, styling tips, and exclusive offers.
              </p>
              <a
                href={`https://instagram.com/${defaultSettings.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Follow Us
              </a>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
