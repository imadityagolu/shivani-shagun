import React from 'react';
import { FaHeart, FaStar, FaUsers, FaGift } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

function AboutUs() {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Shivani Shagun</h1>
          <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto">
            Celebrating the timeless beauty of traditional Indian wear with modern elegance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Our Story Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Founded with a passion for preserving and celebrating India's rich textile heritage, 
                Shivani Shagun has been a trusted name in traditional wear for years. We believe that 
                every woman deserves to feel beautiful and confident in authentic, high-quality traditional attire.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our journey began with a simple vision: to make exquisite traditional Indian clothing 
                accessible to women everywhere, while maintaining the authenticity and craftsmanship 
                that makes each piece special.
              </p>
              <div className="flex items-center gap-4">
                <FaHeart className="text-rose-500 text-2xl" />
                <span className="text-gray-700 font-medium">Made with love and tradition</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaGift className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To bring you the finest collection of traditional Indian wear, 
                  combining timeless designs with contemporary comfort and style.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">S</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Sarees</h3>
              <p className="text-gray-600">Elegant sarees in silk, cotton, and designer fabrics for every occasion</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">L</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Lehengas</h3>
              <p className="text-gray-600">Stunning lehengas perfect for weddings, festivals, and celebrations</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Chunnis</h3>
              <p className="text-gray-600">Beautiful dupattas and chunnis to complete your traditional look</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">Su</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Suits</h3>
              <p className="text-gray-600">Comfortable and stylish salwar suits for daily wear and special occasions</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose Shivani Shagun?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-xl">
              <FaStar className="text-rose-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                We source only the finest fabrics and work with skilled artisans to ensure 
                every piece meets our high standards of quality and craftsmanship.
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-xl">
              <FaUsers className="text-rose-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We provide excellent customer service 
                and ensure a smooth shopping experience from browsing to delivery.
              </p>
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-xl">
              <FaHeart className="text-rose-500 text-3xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Authentic Designs</h3>
              <p className="text-gray-600">
                Each piece in our collection reflects the rich cultural heritage of India, 
                bringing you authentic traditional wear with a contemporary touch.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-rose-500 to-rose-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Experience the Beauty of Tradition</h2>
          <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto">
            Discover our exquisite collection and find the perfect traditional outfit for your special moments.
          </p>
          <a 
            href="/AllProduct" 
            className="inline-block bg-white text-rose-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-rose-50 transition-colors duration-200 shadow-lg"
          >
            Shop Our Collection
          </a>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default AboutUs;