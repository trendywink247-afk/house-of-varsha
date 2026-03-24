import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Global providers & overlays
import { SmoothScrollProvider } from '@/components/SmoothScroll';
import { CustomCursor } from '@/components/CustomCursor';
import { Preloader } from '@/components/Preloader';
import { PageTransition } from '@/components/PageTransition';
import { FilmGrain } from '@/components/FilmGrain';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Layout
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { FloatingButtons } from '@/components/FloatingButtons';

// Home sections
import { Hero } from '@/sections/Hero';
import { Marquee } from '@/components/Marquee';
import { FeaturedCollection } from '@/sections/FeaturedCollection';
import { Philosophy } from '@/sections/Philosophy';
import { LatestArrivals } from '@/sections/LatestArrivals';
import { CollectionShowcase } from '@/sections/CollectionShowcase';
import { WhatsAppCTA } from '@/sections/WhatsAppCTA';
import { Footer } from '@/sections/Footer';

// Pages (lazy-loaded for performance)
const Shop = lazy(() => import('@/pages/Shop').then((m) => ({ default: m.Shop })));
const ProductDetail = lazy(() => import('@/pages/ProductDetail').then((m) => ({ default: m.ProductDetail })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })));
const Privacy = lazy(() => import('@/pages/Privacy').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('@/pages/Terms').then((m) => ({ default: m.Terms })));
const FAQs = lazy(() => import('@/pages/FAQs').then((m) => ({ default: m.FAQs })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

import { CartProvider } from '@/hooks/useCart';

gsap.registerPlugin(ScrollTrigger);

// Loading fallback for lazy pages
function PageLoader() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border border-gold/40 border-t-gold rounded-full animate-spin" />
        <span className="micro-label text-text-secondary/50">Loading</span>
      </div>
    </div>
  );
}

// Home Page Component
function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <Marquee />
      <FeaturedCollection />
      <Philosophy />
      <LatestArrivals />
      <CollectionShowcase />
      <WhatsAppCTA />
      <Footer />
    </main>
  );
}

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <ErrorBoundary>
    <CartProvider>
      <BrowserRouter>
        <SmoothScrollProvider>
          {/* Preloader — shows once per session */}
          <Preloader onComplete={() => setPreloaderDone(true)} />

          {/* Custom cursor — desktop only */}
          <CustomCursor />

          {/* Film grain overlay */}
          <FilmGrain />

          <div
            className="relative min-h-screen bg-cream"
            style={{
              visibility: preloaderDone ? 'visible' : 'hidden',
            }}
          >
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>

            {/* Header */}
            <Header />

            {/* Cart Drawer */}
            <CartDrawer />

            {/* Routes with page transitions */}
            <div id="main-content">
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/collections" element={<Shop />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </PageTransition>
            </div>

            {/* Floating WhatsApp + Back to Top */}
            <FloatingButtons />
          </div>
        </SmoothScrollProvider>
      </BrowserRouter>
    </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
