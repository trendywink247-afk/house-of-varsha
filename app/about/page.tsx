import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About Us - House of Varsha',
  description: 'Learn about our story, our passion for craftsmanship, and our commitment to quality.',
}

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container-narrow text-center">
            <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
              Our Story
            </p>
            <h1 className="font-display text-display text-soft-black mb-6">
              Crafted with Intention
            </h1>
            <p className="text-body-lg text-warm-gray leading-relaxed max-w-2xl mx-auto">
              A journey of passion, craftsmanship, and the pursuit of timeless elegance
              in Indian ethnic wear.
            </p>
          </div>
        </section>

        {/* The Beginning */}
        <section className="section-padding bg-soft-cream">
          <div className="container-narrow">
            <div className="max-w-2xl mx-auto">
              <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
                Est. 2024
              </p>
              <h2 className="font-display text-display-sm text-soft-black mb-8">
                The Beginning
              </h2>
              <div className="space-y-6 text-body text-warm-gray leading-relaxed">
                <p>
                  House of Varsha was born from a deep appreciation for artisanal craftsmanship
                  and the belief that every piece of clothing should tell a story. Founded in 2024,
                  our journey began with a simple vision: to bring exceptional, handcrafted Indian
                  ethnic wear to those who appreciate the finer things in life.
                </p>
                <p>
                  We started with a curated collection of Kalamkari kurtis and elegant kurti sets,
                  each piece carefully selected for its quality, design, and the story of its creation.
                  Today, we continue to grow our collection while staying true to our founding principles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section - Split */}
        <section className="bg-warm-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Text Side */}
            <div className="flex items-center justify-center p-10 md:p-16 lg:p-24 order-2 lg:order-1">
              <div className="max-w-md">
                <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
                  Our Philosophy
                </p>
                <h2 className="font-display text-display-sm text-soft-black mb-6 leading-tight">
                  Slow Fashion, Mindful Choices
                </h2>
                <p className="text-body text-warm-gray leading-relaxed mb-6">
                  We believe in slow fashion and mindful consumption. Each piece in our
                  collection is carefully curated with attention to detail, quality materials,
                  and sustainable practices.
                </p>
                <p className="text-body text-muted-gray leading-relaxed">
                  We work directly with skilled artisans who share our commitment to excellence,
                  ensuring that every garment that reaches you carries the touch of true craftsmanship.
                </p>
              </div>
            </div>
            {/* Image Side */}
            <div className="relative aspect-square lg:aspect-auto min-h-[400px] lg:min-h-[600px] order-1 lg:order-2">
              <img
                src="/images/story-philosophy.jpg"
                alt="Our Philosophy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-warm-white">
          <div className="container-editorial">
            <div className="text-center mb-16">
              <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
                What We Stand For
              </p>
              <h2 className="font-display text-display-sm text-soft-black">
                Our Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-sand">
                  <svg className="w-6 h-6 text-blush" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-display text-body-lg text-soft-black mb-3">Quality First</h3>
                <p className="text-body-sm text-muted-gray leading-relaxed">
                  Every product meets our exacting standards for fabric, finish, and craftsmanship.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-sand">
                  <svg className="w-6 h-6 text-blush" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-body-lg text-soft-black mb-3">Personal Touch</h3>
                <p className="text-body-sm text-muted-gray leading-relaxed">
                  Direct connection with every customer. Your experience matters to us.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-sand">
                  <svg className="w-6 h-6 text-blush" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-body-lg text-soft-black mb-3">Sustainable</h3>
                <p className="text-body-sm text-muted-gray leading-relaxed">
                  Mindful practices for a better tomorrow. Quality over quantity, always.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Name Section */}
        <section className="section-padding bg-soft-cream">
          <div className="container-narrow text-center">
            <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-4">
              The Meaning
            </p>
            <h2 className="font-display text-display-sm text-soft-black mb-8">
              Why "Varsha"?
            </h2>
            <p className="text-body text-warm-gray leading-relaxed max-w-2xl mx-auto mb-6">
              "Varsha" means "rain" in Sanskrit, symbolizing renewal, blessing, and
              the nurturing spirit we bring to everything we do.
            </p>
            <p className="text-body text-muted-gray leading-relaxed max-w-2xl mx-auto">
              Just as rain brings life and freshness to the earth, we aim to bring joy
              and beauty into the lives of our customers through our carefully curated collection.
            </p>
          </div>
        </section>

        {/* Promise Section */}
        <section className="section-padding bg-soft-black text-warm-white">
          <div className="container-narrow text-center">
            <p className="text-caption uppercase tracking-[0.2em] text-muted-gray mb-6">
              Our Promise
            </p>
            <blockquote className="font-display text-body-lg md:text-display-sm font-light leading-relaxed mb-8">
              "Every product that leaves House of Varsha carries with it our commitment
              to excellence, authenticity, and the belief that beautiful things make
              life more meaningful."
            </blockquote>
            <p className="text-caption text-muted-gray uppercase tracking-[0.2em]">
              The House of Varsha Team
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding-sm bg-warm-white border-t border-sand">
          <div className="container-narrow text-center">
            <p className="text-body text-muted-gray mb-6">
              Ready to explore our collection?
            </p>
            <Link href="/shop" className="btn-primary inline-flex">
              Shop Now
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
