export const metadata = {
  title: 'About Us - House of Varsha',
  description: 'Learn about our story, our passion for craftsmanship, and our commitment to quality.',
}

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream to-ivory section-padding">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif text-gray-900 mb-6">Our Story</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            A journey of passion, craftsmanship, and the pursuit of timeless elegance
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg mx-auto">
            <h2 className="text-3xl font-serif text-gray-900 mb-6">The Beginning</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              House of Varsha was born from a deep appreciation for artisanal craftsmanship
              and the belief that every product should tell a story. Founded in 2024,
              our journey began with a simple vision: to bring exceptional, handcrafted
              products to those who appreciate the finer things in life.
            </p>

            <h2 className="text-3xl font-serif text-gray-900 mb-6 mt-12">Our Philosophy</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We believe in slow fashion and mindful consumption. Each piece in our
              collection is carefully curated or crafted with attention to detail,
              quality materials, and sustainable practices. We work directly with
              skilled artisans who share our commitment to excellence.
            </p>

            <h2 className="text-3xl font-serif text-gray-900 mb-6 mt-12">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
              <div className="text-center p-6 bg-cream rounded-xl">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-serif text-xl mb-2">Quality First</h3>
                <p className="text-gray-600 text-sm">Every product meets our exacting standards</p>
              </div>
              <div className="text-center p-6 bg-cream rounded-xl">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="font-serif text-xl mb-2">Personal Touch</h3>
                <p className="text-gray-600 text-sm">Direct connection with every customer</p>
              </div>
              <div className="text-center p-6 bg-cream rounded-xl">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="font-serif text-xl mb-2">Sustainable</h3>
                <p className="text-gray-600 text-sm">Mindful practices for a better tomorrow</p>
              </div>
            </div>

            <h2 className="text-3xl font-serif text-gray-900 mb-6 mt-12">The Name</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              "Varsha" means "rain" in Sanskrit, symbolizing renewal, blessing, and
              the nurturing spirit we bring to everything we do. Just as rain brings
              life and freshness to the earth, we aim to bring joy and beauty into
              the lives of our customers.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-taupe text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-8">Our Promise</h2>
          <p className="text-xl opacity-90 leading-relaxed">
            "Every product that leaves House of Varsha carries with it our commitment
            to excellence, authenticity, and the belief that beautiful things make
            life more meaningful."
          </p>
          <p className="mt-6 text-lg opacity-75">— The House of Varsha Team</p>
        </div>
      </section>
    </>
  )
}
