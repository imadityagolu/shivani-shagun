import React from 'react';
import { FaShieldAlt, FaUserShield, FaLock, FaEye, FaDatabase, FaCookieBite, FaEnvelope, FaGavel } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

function PrivacyPolicy() {
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Last Updated */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-12">
          <p className="text-blue-800">
            <strong>Last Updated:</strong> January 1, 2024
          </p>
          <p className="text-blue-700 mt-2">
            This Privacy Policy explains how Shivani Shagun collects, uses, and protects your personal information 
            when you use our website and services.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Protection</h3>
            <p className="text-gray-600 text-sm">We use industry-standard security measures</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserShield className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Rights</h3>
            <p className="text-gray-600 text-sm">You control your personal information</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Transactions</h3>
            <p className="text-gray-600 text-sm">All payments are encrypted and secure</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEye className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Transparency</h3>
            <p className="text-gray-600 text-sm">Clear information about data usage</p>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaDatabase className="text-rose-500" />
            Information We Collect
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">Account Information</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Full name and contact details</li>
                    <li>• Email address and phone number</li>
                    <li>• Shipping and billing addresses</li>
                    <li>• Account preferences and settings</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-3">Transaction Information</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Purchase history and order details</li>
                    <li>• Payment information (encrypted)</li>
                    <li>• Shipping and delivery information</li>
                    <li>• Return and exchange records</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Automatically Collected Information</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Device Information</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• IP address and location</li>
                      <li>• Browser type and version</li>
                      <li>• Device type and operating system</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Usage Data</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Pages visited and time spent</li>
                      <li>• Click patterns and navigation</li>
                      <li>• Search queries and preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Performance Data</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Page load times</li>
                      <li>• Error reports and crashes</li>
                      <li>• Feature usage statistics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">How We Use Your Information</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Delivery</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Process and fulfill your orders</li>
                  <li>• Manage your account and preferences</li>
                  <li>• Provide customer support</li>
                  <li>• Send order confirmations and updates</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Communication</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Send promotional emails (with consent)</li>
                  <li>• Notify about new products and offers</li>
                  <li>• Share important policy updates</li>
                  <li>• Respond to your inquiries</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Improvement & Analytics</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Analyze website usage and performance</li>
                  <li>• Improve our products and services</li>
                  <li>• Personalize your shopping experience</li>
                  <li>• Conduct market research</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal & Security</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• Prevent fraud and unauthorized access</li>
                  <li>• Comply with legal obligations</li>
                  <li>• Protect our rights and property</li>
                  <li>• Ensure platform security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Cookies and Tracking */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaCookieBite className="text-rose-500" />
            Cookies and Tracking Technologies
          </h2>

          <div className="space-y-6">
            <p className="text-gray-600 text-lg">
              We use cookies and similar technologies to enhance your browsing experience, 
              analyze site traffic, and personalize content.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Essential Cookies</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Required for basic website functionality, shopping cart, and security.
                </p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Always Active
                </span>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Analytics Cookies</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Help us understand how visitors interact with our website.
                </p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  Optional
                </span>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Marketing Cookies</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Used to deliver personalized advertisements and track campaign effectiveness.
                </p>
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                  Optional
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <p className="text-yellow-800">
                <strong>Cookie Control:</strong> You can manage your cookie preferences through your browser settings. 
                However, disabling certain cookies may affect website functionality.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sharing and Disclosure */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Data Sharing and Disclosure</h2>

          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-red-800 mb-3">We DO NOT sell your personal information</h3>
              <p className="text-red-700">
                Your personal data is never sold to third parties for marketing purposes. 
                We only share information in specific circumstances outlined below.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">When We May Share Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Service Providers</p>
                      <p className="text-gray-600 text-sm">Payment processors, shipping companies, and IT service providers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Legal Requirements</p>
                      <p className="text-gray-600 text-sm">When required by law, court orders, or government requests</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Business Transfers</p>
                      <p className="text-gray-600 text-sm">In case of merger, acquisition, or sale of business assets</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Data Protection Measures</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Contractual Agreements</p>
                      <p className="text-gray-600 text-sm">All third parties sign data protection agreements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Limited Access</p>
                      <p className="text-gray-600 text-sm">Only necessary information is shared for specific purposes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Regular Audits</p>
                      <p className="text-gray-600 text-sm">We regularly review and audit our data sharing practices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaUserShield className="text-rose-500" />
            Your Privacy Rights
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Access & Portability</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Request a copy of your personal data</li>
                  <li>• Download your information in a portable format</li>
                  <li>• View how your data is being used</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Correction & Updates</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Update incorrect or outdated information</li>
                  <li>• Modify your account preferences</li>
                  <li>• Change communication settings</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Deletion & Restriction</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Request deletion of your personal data</li>
                  <li>• Restrict processing of your information</li>
                  <li>• Object to certain data processing activities</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Communication Control</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Unsubscribe from marketing emails</li>
                  <li>• Opt-out of promotional communications</li>
                  <li>• Manage notification preferences</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Exercise Your Rights</h3>
            <p className="text-gray-600 mb-4">
              To exercise any of these rights, please contact us using the information provided below. 
              We will respond to your request within 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/ContactUs" 
                className="bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors text-center"
              >
                Contact Us
              </a>
              <a 
                href="mailto:privacy@shivanishagun.com" 
                className="bg-white text-rose-600 border-2 border-rose-500 px-6 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors text-center"
              >
                Email Privacy Team
              </a>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaLock className="text-rose-500" />
            Data Security
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Encryption</h3>
              <p className="text-gray-600 text-sm">All sensitive data is encrypted using industry-standard protocols</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDatabase className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Storage</h3>
              <p className="text-gray-600 text-sm">Data is stored in secure, access-controlled environments</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserShield className="text-white text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Control</h3>
              <p className="text-gray-600 text-sm">Strict access controls and regular security audits</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Breach Notification</h3>
            <p className="text-gray-600">
              In the unlikely event of a data breach that affects your personal information, 
              we will notify you within 72 hours and provide details about the incident and steps being taken to address it.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaEnvelope />
            Questions About This Privacy Policy?
          </h2>
          <p className="text-rose-100 mb-6">
            If you have any questions about this Privacy Policy or how we handle your personal information, 
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/ContactUs" 
              className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
            >
              Contact Support
            </a>
            <a 
              href="mailto:privacy@shivanishagun.com" 
              className="bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-800 transition-colors"
            >
              privacy@shivanishagun.com
            </a>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default PrivacyPolicy;