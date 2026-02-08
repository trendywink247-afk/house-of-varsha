import { Sparkles } from 'lucide-react';

export function Marquee() {
  const items = [
    'Free Shipping on Orders Above ₹2000',
    'Handcrafted with Love',
    'Premium Quality Fabrics',
    'Made in India',
  ];

  return (
    <div className="w-full bg-charcoal py-2.5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, setIndex) => (
          <div key={setIndex} className="flex items-center">
            {items.map((item, index) => (
              <div key={`${setIndex}-${index}`} className="flex items-center mx-6">
                <Sparkles className="w-3 h-3 text-gold/80 mr-2" strokeWidth={1.5} />
                <span className="micro-label text-cream/80 tracking-[0.14em]">{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
