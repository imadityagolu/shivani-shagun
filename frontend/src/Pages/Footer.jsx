import React from 'react';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-rose-100 to-pink-100 text-gray-700 py-10 mt-12 border-t border-rose-200">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-bold text-rose-500 mb-3">About Us</h3>
          <p className="text-sm text-gray-600">
            Shivani Shagun is your one-stop destination for the latest ethnic fashion. We bring you a curated collection of sarees, lehngas, suits, and more, blending tradition with modern style.
          </p>
        </div>
        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-bold text-rose-500 mb-3">Contact Us</h3>
          <p className="text-sm mb-1">Email: <a href="mailto:shivani.shagun007@gmail.com" className="text-rose-600 hover:underline">shivani.shagun007@gmail.com</a></p>
          <p className="text-sm mb-1">Phone: <a href="tel:+91 9905 120 849" className="text-rose-600 hover:underline">+91 99999 99999</a></p>
          <p className="text-sm">Address: 1st Floor Gayatri Palace, Shadikpur Gulzarbagh,<br/>Patna City - 800007, Patna, Bihar, India.</p>
        </div>
        {/* Social Media */}
        <div>
          <h3 className="text-lg font-bold text-rose-500 mb-3">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://instagram.com/shivani_shagun" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:text-rose-700 text-2xl transition"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-2xl transition"><FaFacebook /></a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 text-2xl transition"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-8">&copy; {new Date().getFullYear()} Shivani Shagun. All rights reserved.</div>
    </footer>
  );
}

export default Footer; 