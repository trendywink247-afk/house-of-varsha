import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import { Footer } from '@/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-cream pt-24 lg:pt-32 pb-16">
      <div className="w-full px-6 lg:px-12">
        <div ref={contentRef}>
          {/* Header */}
          <div className="mb-12">
            <span className="micro-label text-gold mb-2 block">Get in Touch</span>
            <h1 className="section-title text-charcoal mb-4">
              Let's Create
              <span className="text-gold ml-2">Something Beautiful</span>
            </h1>
            <p className="body-text text-text-secondary max-w-md leading-relaxed">
              For orders, collaborations, or questions—reach out. We reply within 
              1–2 business days.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Contact Info */}
            <div>
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-beige">
                    <Mail className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="micro-label text-charcoal mb-0.5">Email</h3>
                    <a
                      href="mailto:hello@houseofvarsha.com"
                      className="body-text text-text-secondary hover:text-charcoal transition-colors"
                    >
                      hello@houseofvarsha.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-beige">
                    <Phone className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="micro-label text-charcoal mb-0.5">Phone</h3>
                    <a
                      href="tel:+919876543210"
                      className="body-text text-text-secondary hover:text-charcoal transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-beige">
                    <MapPin className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="micro-label text-charcoal mb-0.5">Address</h3>
                    <p className="body-text text-text-secondary">
                      12, Craftsmen Lane
                      <br />
                      Jaipur, Rajasthan 302001
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-beige">
                    <MessageCircle className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="micro-label text-charcoal mb-0.5">WhatsApp</h3>
                    <a
                      href="https://wa.me/917569619390?text=Hello! I'm interested in House of Varsha products."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-text text-text-secondary hover:text-charcoal transition-colors"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="p-5 bg-beige/30 border border-charcoal/5">
                <h3 className="micro-label text-charcoal mb-3">Business Hours</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="body-text text-text-secondary">Monday - Friday</span>
                    <span className="body-text text-charcoal">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-text text-text-secondary">Saturday</span>
                    <span className="body-text text-charcoal">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-text text-text-secondary">Sunday</span>
                    <span className="body-text text-charcoal">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted ? (
                <div className="p-6 bg-beige/30 border border-charcoal/5 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gold/10 rounded-full">
                    <Send className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl text-charcoal mb-1">
                    Message Sent!
                  </h3>
                  <p className="body-text text-text-secondary">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="micro-label text-charcoal mb-1.5 block">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-charcoal/15 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold body-text text-sm"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="micro-label text-charcoal mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 bg-white border border-charcoal/15 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold body-text text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="micro-label text-charcoal mb-1.5 block">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-white border border-charcoal/15 text-charcoal focus:outline-none focus:border-gold body-text text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="micro-label text-charcoal mb-1.5 block">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2.5 bg-white border border-charcoal/15 text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold body-text text-sm resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-charcoal text-cream font-sans font-medium uppercase tracking-[0.12em] text-xs hover:bg-gold transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
