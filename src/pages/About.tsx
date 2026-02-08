import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Footer } from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const contents = contentRefs.current.filter(Boolean);

    if (!section || contents.length === 0) return;

    const ctx = gsap.context(() => {
      contents.forEach((content) => {
        gsap.fromTo(
          content?.children || [],
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: content,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const setContentRef = (index: number) => (el: HTMLDivElement | null) => {
    contentRefs.current[index] = el;
  };

  return (
    <div className="min-h-screen bg-cream pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12">
        {/* Hero Section */}
        <div ref={setContentRef(0)} className="mb-16">
          <span className="micro-label text-gold mb-2 block">Our Story</span>
          <h1 className="section-title text-charcoal max-w-2xl mb-6">
            Celebrating the Art of
            <span className="text-gold ml-2">Indian Craftsmanship</span>
          </h1>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
            <p className="body-text text-text-secondary leading-relaxed">
              House of Varsha was born from a deep appreciation for India's rich textile 
              heritage. Founded in 2024 in the heart of Jaipur, Rajasthan, we set out to 
              create a brand that honors traditional craftsmanship while embracing 
              contemporary design sensibilities.
            </p>
            <p className="body-text text-text-secondary leading-relaxed">
              Each piece in our collection is a testament to the skill and dedication 
              of Indian artisans who have perfected their craft over generations.
            </p>
          </div>
        </div>

        {/* Image */}
        <div ref={setContentRef(1)} className="mb-16">
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src="https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545999/website/lifestyle-wide-1.jpg"
              alt="House of Varsha - Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div ref={setContentRef(2)} className="mb-16">
          <h2 className="section-title text-charcoal mb-8">
            Our
            <span className="text-gold ml-2">Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Authenticity',
                description:
                  'We work directly with artisans to ensure every piece is genuinely handcrafted using traditional techniques.',
              },
              {
                title: 'Quality',
                description:
                  'We use only the finest natural fabrics and materials, ensuring exceptional quality in every garment.',
              },
              {
                title: 'Sustainability',
                description:
                  'Our small-batch production reduces waste and ensures attention to detail in every piece.',
              },
            ].map((value) => (
              <div key={value.title} className="p-5 bg-beige/30 border border-charcoal/5">
                <h3 className="font-display text-lg text-charcoal mb-2">{value.title}</h3>
                <p className="body-text text-text-secondary leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Craft Section */}
        <div ref={setContentRef(3)} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="aspect-square overflow-hidden">
            <img
              src="https://res.cloudinary.com/dv6de0ucq/image/upload/v1770545993/website/craft-detail.jpg"
              alt="Traditional Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="micro-label text-gold mb-2 block">The Craft</span>
            <h2 className="section-title text-charcoal mb-4">
              Preserving
              <span className="text-gold ml-2">Heritage</span>
            </h2>
            <p className="body-text text-text-secondary mb-4 leading-relaxed">
              Our Kalamkari collection showcases the ancient art of hand-painted 
              textiles, where skilled artisans use natural dyes and fine brushes to 
              create intricate patterns inspired by nature and mythology.
            </p>
            <p className="body-text text-text-secondary mb-4 leading-relaxed">
              Each Kurti set is carefully constructed with attention to fit and 
              comfort, using breathable cotton fabrics perfect for India's climate.
            </p>
            <p className="body-text text-text-secondary leading-relaxed">
              By choosing House of Varsha, you support artisan communities and help 
              preserve India's rich cultural heritage.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
