'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown, Sparkles } from 'lucide-react';
import { products } from '@/data/products';
import { defaultSettings, getWhatsAppLink } from '@/lib/utils';
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
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  // Get featured and latest products
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
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      
      <main className="flex-grow">
        {/* HERO SECTION - DRAMATIC */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-cream">
          {/* Background with Parallax */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: heroY }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-cream/70 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent z-10" />
            {/* Decorative pattern background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%238B1538\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 border border-gold/30 rounded-full animate-spin-slow z-20 hidden lg:block" />
          <div className="absolute bottom-40 right-40 w-4 h-4 bg-burgundy rounded-full z-20 hidden lg:block" />
          <div className="absolute top-1/3 left-10 w-2 h-2 bg-gold rounded-full z-20 hidden lg:block" />

          {/* Hero Content */}
          <motion.div 
            className="relative z-20 container-editorial w-full pt-20"
            style={{ opacity: heroOpacity }}
          >
            <div className="max-w-2xl">
              {/* Tagline with sparkle */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <Sparkles className="w-5 h-5 text-gold" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-[0.4em] text-burgundy/70 font-medium">
                  Handcrafted Indian Ethnic Wear
                </span>
              </motion.div>

              {/* Main Title - Dramatic */}
              <div className="mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-6xl md:text-7xl lg:text-8xl text-burgundy leading-[0.95] mb-4"
                >
                  <span className="block">House</span>
                  <span className="block text-stroke text-burgundy/80">of</span>
                  <span className="block">Varsha</span>
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-lg md:text-xl text-burgundy/70 mb-12 font-light leading-relaxed max-w-lg"
              >
                Where tradition meets contemporary elegance. 
                Each piece tells a story of heritage, craftsmanship, and timeless beauty.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-col sm:flex-row items-start gap-5"
              >
                <Link href="/shop" className="btn-primary group">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" strokeWidth={2} />
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
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-burgundy/50 font-medium">Scroll</span>
              <ArrowDown className="w-4 h-4 text-burgundy/50" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </section>

        {/* MARQUEE BANNER - BOLD */}
        <div className="bg-burgundy text-cream py-4 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          </div>
          <div className="marquee-container relative z-10">
            <div className="marquee-content">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="mx-10 text-xs tracking-[0.3em] uppercase font-semibold">
                  Free Shipping on Orders Above Rs. 2000
                  <span className="mx-10 text-gold">✦</span>
                  Handcrafted with Love
                  <span className="mx-10 text-gold">✦</span>
                  Premium Quality Fabrics
                  <span className="mx-10 text-gold">✦</span>
                  Made in India
                  <span className="mx-10 text-gold">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURED COLLECTION - DRAMATIC */}
        <section className="section-padding bg-cream relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          
          <div className="container-editorial relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-20">
              <AnimatedSection>
                <p className="text-xs uppercase tracking-[0.4em] text-burgundy/60 mb-4 font-medium">
                  Curated Selection
                </p>
                <h2 className="font-display text-5xl md:text-6xl text-burgundy">
                  Featured
                </h2>
                <h2 className="font-display text-5xl md:text-6xl text-stroke text-burgundy/40 -mt-2">
                  Collection
                </h2>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2} className="mt-6 md:mt-0">
                <Link href="/shop" className="btn-ghost group">
                  View All
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" strokeWidth={2} />
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

        {/* STORY SECTION - SPLIT WITH DRAMATIC EFFECTS */}
        <section className="bg-cream-dark relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Side with reveal effect */}
            <div className="relative aspect-square lg:aspect-auto overflow-hidden min-h-[500px] lg:min-h-[700px]">
              <motion.div
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src="/images/story-craftsmanship.jpg"
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cream-dark/20 lg:to-transparent" />
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute bottom-8 left-8 bg-cream px-6 py-4 shadow-xl"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-burgundy/60">Est.</p>
                <p className="font-display text-3xl text-burgundy">2024</p>
              </motion.div>
            </div>

            {/* Text Side */}
            <div className="flex items-center justify-center p-10 md:p-16 lg:p-20">
              <div className="max-w-lg">
                <AnimatedSection>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-[2px] bg-gold" />
                    <span className="text-xs uppercase tracking-[0.4em] text-burgundy/60 font-medium">
                      Our Philosophy
                    </span>
                  </div>
                  
                  <h2 className="font-display text-4xl md:text-5xl text-burgundy mb-8 leading-tight">
                    Crafted with
                    <span className="block text-gold">Intention</span>
                  </h2>
                  
                  <p className="text-burgundy/70 leading-relaxed mb-6 text-lg">
                    At House of Varsha, we believe in the timeless elegance of Indian ethnic wear.
                    Each piece is carefully selected to bring you authentic craftsmanship,
                    premium fabrics, and designs that celebrate tradition while embracing modern style.
                  </p>
                  
                  <p className="text-burgundy/60 leading-relaxed mb-10">
                    From exquisite Kalamkari prints to elegant kurti sets, our collection
                    offers something special for every occasion.
                  </p>
                  
                  <Link href="/about" className="link-underline text-xs uppercase tracking-[0.3em] text-burgundy font-semibold">
                    Learn More About Us
                  </Link>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* NEW ARRIVALS - BOLD */}
        <section className="section-padding bg-cream relative">
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl translate-x-1/2" />
          
          <div className="container-editorial relative">
            <AnimatedSection className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.4em] text-burgundy/60 mb-4 font-medium">
                Just In
              </p>
              <h2 className="font-display text-5xl md:text-6xl text-burgundy mb-4">
                Latest Arrivals
              </h2>
              <div className="w-24 h-1 bg-gold mx-auto" />
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

        {/* VALUES SECTION - ICONIC */}
        <section className="section-padding-sm bg-burgundy text-cream relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')]" />
          </div>
          
          <div className="container-editorial relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {[
                { title: 'Handcrafted', desc: 'Each piece crafted with attention to detail', num: '01' },
                { title: 'Premium Quality', desc: 'Only the finest fabrics and materials', num: '02' },
                { title: 'Personal Touch', desc: 'Dedicated styling advice just for you', num: '03' },
              ].map((item, index) => (
                <AnimatedSection key={item.title} delay={index * 0.15} className="text-center relative">
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-display text-8xl text-cream/5">
                    {item.num}
                  </span>
                  <h3 className="font-display text-2xl text-gold mb-4">{item.title}</h3>
                  <p className="text-cream/70 leading-relaxed">{item.desc}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* WHATSAPP CTA - BOLD */}
        <section className="section-padding bg-cream relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-burgundy/5 rounded-full blur-3xl" />
          
          <div className="container-narrow text-center relative">
            <AnimatedSection>
              <div className="w-16 h-16 bg-burgundy rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-8 h-8 text-cream" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              
              <p className="text-xs uppercase tracking-[0.4em] text-burgundy/60 mb-4 font-medium">
                Need Help?
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-burgundy mb-6">
                Let's Find Your
                <span className="block text-gold">Perfect Look</span>
              </h2>
              <p className="text-burgundy/60 max-w-lg mx-auto mb-10 leading-relaxed">
                Not sure what to choose? Chat with us on WhatsApp for personalized recommendations
                and styling advice.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp inline-flex"
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
        <section className="section-padding-sm bg-cream-dark border-t border-burgundy/10">
          <div className="container-narrow text-center">
            <AnimatedSection>
              <div className="flex items-center justify-center gap-3 mb-6">
                <svg className="w-6 h-6 text-burgundy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-display text-2xl text-burgundy">@{defaultSettings.instagramHandle}</span>
              </div>
              <p className="text-burgundy/60 mb-8">
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
