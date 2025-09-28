import React from 'react';
import { FaInstagram, FaFacebook, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import logo from '../Images/store/logo.png';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-rose-600 to-pink-500 text-white pt-12 pb-6 mt-12 border-t border-rose-200">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div className="flex flex-col items-start gap-3">
        <h3 className="text-lg font-bold mb-3">About Us</h3>
          <img src={logo} alt="Shivani Shagun Logo" className="w-28 h-16 object-contain mb-2" />
          <p className="text-sm text-rose-100">
            Shivani Shagun is your one-stop destination for the latest ethnic fashion. We bring you a curated collection of sarees, lehngas, suits, and more, blending tradition with modern style.
          </p>
        </div>
        {/* Navigation */}
        <div>
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline hover:text-rose-200 transition">Home</Link></li>
            <li><Link to="/Login" className="hover:underline hover:text-rose-200 transition">Login / signup</Link></li>
            <li><Link to="/AboutUs" className="hover:underline hover:text-rose-200 transition">About Us</Link></li>
            <li><Link to="/ContactUs" className="hover:underline hover:text-rose-200 transition">Contact Us</Link></li>
            <li><Link to="/CancelReturnRefund" className="hover:underline hover:text-rose-200 transition">Cancel/Return & Refund</Link></li>
            <li><Link to="/PrivacyPolicy" className="hover:underline hover:text-rose-200 transition">Privacy Policy</Link></li>
            <li><Link to="/TermsConditions" className="hover:underline hover:text-rose-200 transition">Terms & Conditions</Link></li>
          </ul>
        </div>
        {/* Contact & Social */}
        <div>
          <h3 className="text-lg font-bold mb-3">Contact Us</h3>
          <div className="flex items-center gap-2 text-sm mb-1"><FaEnvelope className="text-rose-200" /> <a href="mailto:shivani.shagun007@gmail.com" className="hover:underline">shivani.shagun007@gmail.com</a></div>
          <div className="flex items-center gap-2 text-sm mb-1"><FaPhoneAlt className="text-rose-200" /> <a href="tel:+919905120849" className="hover:underline">+91 9905 120 849</a></div>
          <div className="flex gap-2 text-sm mb-3"><FaMapMarkerAlt className="text-rose-200 mt-1" /> 1st Floor Gayatri Palace, Shadikpur <br/> Gulzarbagh, Patna City - 800007,<br/>Patna, Bihar, India.</div>
        </div>
        {/* Join Us / Social Media */}
        <div>
          <h3 className="text-lg font-bold mb-3">Join Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://instagram.com/_shivani_shagun" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-2xl text-white transition"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-2xl text-white transition"><FaFacebook /></a>
            <a href="https://wa.me/919905120849" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-2xl text-white transition"><FaWhatsapp /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-rose-100 mt-10 border-t border-rose-300 pt-6">&copy; {new Date().getFullYear()} Shivani Shagun. All rights reserved.</div>
    </footer>
  );
}

export default Footer; 