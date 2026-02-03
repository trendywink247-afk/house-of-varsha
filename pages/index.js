import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <section className="hero bg-cream p-10 rounded-lg shadow-md mb-10">
          <h1 className="text-5xl font-serif text-gray-900 mb-4">House of Varsha</h1>
          <p className="text-xl font-sans text-gray-700 max-w-3xl">
            Celebrating elegance and storytelling through premium handcrafted products.
          </p>
        </section>

        <section className="brand-story grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-serif mb-4">Our Story</h2>
            <p className="font-sans text-gray-700 leading-relaxed">
              The House of Varsha is born from a passion for refined craftsmanship and timeless beauty. Each product carries a story, an essence of heritage and care.
            </p>
          </div>
          <div>
            <img src="/images/brand-story.jpg" alt="Brand Story" className="rounded-lg shadow-md" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
