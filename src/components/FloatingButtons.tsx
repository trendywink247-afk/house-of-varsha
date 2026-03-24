import { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

export function FloatingButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`w-12 h-12 bg-charcoal text-cream rounded-full flex items-center justify-center shadow-lg hover:bg-gold transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* WhatsApp */}
      <a
        href="https://wa.me/917989733041?text=Hello! I'm interested in House of Varsha products."
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20bd5a] transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
      </a>
    </div>
  );
}
