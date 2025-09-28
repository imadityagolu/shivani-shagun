import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto">
            We'd love to hear from you. Get in touch with us for any queries or assistance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Related</option>
                    <option value="product">Product Information</option>
                    <option value="return">Return/Exchange</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Please describe your inquiry in detail..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-gray-600">+91 87654 32109</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">info@shivanishagun.com</p>
                    <p className="text-gray-600">support@shivanishagun.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Fashion Street,<br />
                      Traditional Wear Plaza,<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sunday: 11:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media & Quick Contact */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Connect With Us</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <FaFacebook className="text-blue-600 text-xl" />
                  <span className="text-gray-700 font-medium">Facebook</span>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <FaInstagram className="text-pink-600 text-xl" />
                  <span className="text-gray-700 font-medium">Instagram</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <FaTwitter className="text-blue-400 text-xl" />
                  <span className="text-gray-700 font-medium">Twitter</span>
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                >
                  <FaWhatsapp className="text-green-600 text-xl" />
                  <span className="text-gray-700 font-medium">WhatsApp</span>
                </a>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-center">
                  <strong>Quick Response:</strong> For urgent queries, WhatsApp us for faster assistance!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How long does delivery take?</h3>
              <p className="text-gray-600 mb-6">We typically deliver within 3-7 business days for domestic orders and 7-14 days for international orders.</p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Do you offer custom sizing?</h3>
              <p className="text-gray-600 mb-6">Yes, we offer custom sizing for most of our products. Please contact us with your measurements for a personalized fit.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What is your return policy?</h3>
              <p className="text-gray-600 mb-6">We offer a 7-day return policy for unused items in original condition. Please check our Return Policy page for detailed terms.</p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Do you ship internationally?</h3>
              <p className="text-gray-600">Yes, we ship to most countries worldwide. Shipping charges and delivery times may vary based on the destination.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default ContactUs;