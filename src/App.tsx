import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { Marquee } from '@/components/Marquee';
import { Hero } from '@/sections/Hero';
import { FeaturedCollection } from '@/sections/FeaturedCollection';
import { Philosophy } from '@/sections/Philosophy';
import { LatestArrivals } from '@/sections/LatestArrivals';
import { CollectionShowcase } from '@/sections/CollectionShowcase';
import { WhatsAppCTA } from '@/sections/WhatsAppCTA';
import { Footer } from '@/sections/Footer';
import { Shop } from '@/pages/Shop';
import { ProductDetail } from '@/pages/ProductDetail';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { CartProvider } from '@/hooks/useCart';

gsap.registerPlugin(ScrollTrigger);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Home Page Component - Minimalistic Design
function HomePage() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <Hero />

      {/* Marquee */}
      <Marquee />

      {/* Featured Collection */}
      <FeaturedCollection />

      {/* Philosophy Section */}
      <Philosophy />

      {/* Latest Arrivals */}
      <LatestArrivals />

      {/* Collection Showcase */}
      <CollectionShowcase />

      {/* WhatsApp CTA */}
      <WhatsAppCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}

function App() {
  return (
    <CartProvider>
      <HashRouter>
        <ScrollToTop />
        <div className="relative min-h-screen bg-cream">
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>

          {/* Header */}
          <Header />

          {/* Cart Drawer */}
          <CartDrawer />

          {/* Routes */}
          <div id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/collections" element={<Shop />} />
          </Routes>
          </div>
        </div>
      </HashRouter>
    </CartProvider>
  );
}

export default App;
