import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center max-w-6xl mx-auto px-4 py-6">
      <div className="text-2xl font-serif font-bold text-gray-900">House of Varsha</div>
      <nav>
        <ul className="flex space-x-6 font-sans text-gray-700">
          <li><a href="/" className="hover:text-gray-900">Home</a></li>
          <li><a href="/shop" className="hover:text-gray-900">Shop</a></li>
          <li><a href="/about" className="hover:text-gray-900">About</a></li>
          <li><a href="/contact" className="hover:text-gray-900">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
