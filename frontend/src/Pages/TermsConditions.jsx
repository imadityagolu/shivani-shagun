import React from 'react';
import { FaGavel, FaHandshake, FaShoppingCart, FaUserCheck, FaExclamationTriangle, FaShieldAlt, FaGlobe, FaEnvelope } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

function TermsConditions() {
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms & Conditions</h1>
          <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto">
            Please read these terms carefully before using our website and services.
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
            These Terms and Conditions govern your use of the Shivani Shagun website and services. 
            By accessing or using our website, you agree to be bound by these terms.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHandshake className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fair Terms</h3>
            <p className="text-gray-600 text-sm">Clear and reasonable terms for all users</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserCheck className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">User Rights</h3>
            <p className="text-gray-600 text-sm">Your rights and responsibilities as a user</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingCart className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Purchase Terms</h3>
            <p className="text-gray-600 text-sm">Guidelines for orders and transactions</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Protection</h3>
            <p className="text-gray-600 text-sm">Safeguarding both customers and business</p>
          </div>
        </div>

        {/* Acceptance of Terms */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaGavel className="text-rose-500" />
            Acceptance of Terms
          </h2>

          <div className="space-y-6">
            <p className="text-gray-600 text-lg">
              By accessing and using the Shivani Shagun website (www.shivanishagun.com), you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">What This Means</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• You agree to follow all terms and conditions</li>
                  <li>• You confirm you are legally able to enter into contracts</li>
                  <li>• You understand your rights and responsibilities</li>
                  <li>• You accept our policies and procedures</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">If You Don't Agree</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Please do not use our website or services</li>
                  <li>• Contact us if you have questions about any terms</li>
                  <li>• We're happy to clarify any concerns</li>
                  <li>• Alternative arrangements may be possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Use of Website */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Use of Website</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Permitted Uses</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="font-semibold text-gray-800 mb-2">You May:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Browse and purchase products</li>
                    <li>• Create and manage your account</li>
                    <li>• Share product links on social media</li>
                    <li>• Contact customer support</li>
                    <li>• Leave reviews and feedback</li>
                    <li>• Subscribe to newsletters</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <h4 className="font-semibold text-gray-800 mb-2">You May Not:</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Use the site for illegal activities</li>
                    <li>• Attempt to hack or disrupt services</li>
                    <li>• Copy or redistribute content without permission</li>
                    <li>• Create fake accounts or impersonate others</li>
                    <li>• Spam or send unsolicited communications</li>
                    <li>• Violate intellectual property rights</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-600 text-xl mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Age Requirement</h4>
                  <p className="text-gray-600">
                    You must be at least 18 years old to make purchases on our website. 
                    If you are under 18, you may use the site with parental supervision and consent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Terms */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaUserCheck className="text-rose-500" />
            Account Terms
          </h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Creation</h3>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Provide accurate and complete information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Choose a secure password
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Keep your login credentials confidential
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    Update information when it changes
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Security</h3>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    You are responsible for all account activity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    Notify us immediately of unauthorized access
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    We may suspend accounts for security reasons
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    Account termination may result in data loss
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Termination</h3>
              <p className="text-gray-600 mb-3">
                We reserve the right to terminate or suspend accounts that violate these terms, 
                engage in fraudulent activity, or pose a security risk.
              </p>
              <p className="text-gray-600">
                You may close your account at any time by contacting customer support. 
                Some information may be retained for legal and business purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Orders and Payments */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaShoppingCart className="text-rose-500" />
            Orders and Payments
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Process</h3>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                  <p className="text-sm text-gray-600">Add items to cart</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                  <p className="text-sm text-gray-600">Review and checkout</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                  <p className="text-sm text-gray-600">Payment processing</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">4</div>
                  <p className="text-sm text-gray-600">Order confirmation</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Terms</h3>
                <ul className="text-gray-600 space-y-3">
                  <li>• All orders are subject to acceptance and availability</li>
                  <li>• Prices are subject to change without notice</li>
                  <li>• We reserve the right to limit quantities</li>
                  <li>• Order confirmation does not guarantee shipment</li>
                  <li>• Custom orders may have different terms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Terms</h3>
                <ul className="text-gray-600 space-y-3">
                  <li>• Payment is required at time of order</li>
                  <li>• We accept major credit cards and digital payments</li>
                  <li>• All transactions are processed securely</li>
                  <li>• Failed payments may result in order cancellation</li>
                  <li>• Refunds are processed according to our refund policy</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <h4 className="font-semibold text-gray-800 mb-2">Pricing and Taxes</h4>
              <p className="text-gray-600">
                All prices are listed in Indian Rupees (INR) and include applicable taxes unless otherwise stated. 
                Additional charges may apply for international shipping. Final prices will be confirmed at checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping and Delivery */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Shipping and Delivery</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Policy</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Domestic Shipping</h4>
                  <p className="text-gray-600 text-sm">3-7 business days for most locations within India</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">International Shipping</h4>
                  <p className="text-gray-600 text-sm">7-14 business days, subject to customs clearance</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Express Shipping</h4>
                  <p className="text-gray-600 text-sm">1-3 business days for urgent orders (additional charges apply)</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Terms</h3>
              <ul className="text-gray-600 space-y-3">
                <li>• Delivery times are estimates, not guarantees</li>
                <li>• Someone must be available to receive the package</li>
                <li>• We are not responsible for delays due to weather or customs</li>
                <li>• Incorrect addresses may result in additional charges</li>
                <li>• Signature confirmation may be required for high-value items</li>
                <li>• Risk of loss transfers upon delivery</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Intellectual Property</h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Rights</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Website content, design, and functionality</li>
                  <li>• Product images and descriptions</li>
                  <li>• Trademarks, logos, and brand names</li>
                  <li>• Software and technical systems</li>
                  <li>• Marketing materials and communications</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Rights</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Limited license to use the website</li>
                  <li>• Right to view and download content for personal use</li>
                  <li>• Permission to share product links</li>
                  <li>• Ownership of content you create (reviews, etc.)</li>
                  <li>• Right to request removal of your content</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Prohibited Uses</h3>
              <p className="text-red-700 mb-3">
                You may not reproduce, distribute, modify, or create derivative works from our content 
                without explicit written permission.
              </p>
              <ul className="text-red-700 space-y-1">
                <li>• Commercial use of product images</li>
                <li>• Copying website design or functionality</li>
                <li>• Using our trademarks without permission</li>
                <li>• Reverse engineering our software</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Limitation of Liability</h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Important Notice</h3>
                  <p className="text-gray-600">
                    Our liability is limited to the maximum extent permitted by law. 
                    We provide our services "as is" without warranties of any kind.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">We Are Not Liable For:</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Indirect or consequential damages</li>
                  <li>• Loss of profits or business opportunities</li>
                  <li>• Data loss or corruption</li>
                  <li>• Third-party actions or services</li>
                  <li>• Force majeure events</li>
                  <li>• Delays in shipping or delivery</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Maximum Liability:</h3>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-gray-600 mb-3">
                    Our total liability for any claim shall not exceed the amount you paid for the specific product or service that gave rise to the claim.
                  </p>
                  <p className="text-gray-600">
                    This limitation applies regardless of the legal theory on which the claim is based.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaGlobe className="text-rose-500" />
            Governing Law and Jurisdiction
          </h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Applicable Law</h3>
                <p className="text-gray-600 mb-4">
                  These Terms and Conditions are governed by and construed in accordance with the laws of India.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Indian Contract Act, 1872</li>
                  <li>• Consumer Protection Act, 2019</li>
                  <li>• Information Technology Act, 2000</li>
                  <li>• Other applicable Indian laws</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Dispute Resolution</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Step 1: Direct Resolution</h4>
                    <p className="text-gray-600 text-sm">Contact our customer support team first</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Step 2: Mediation</h4>
                    <p className="text-gray-600 text-sm">Attempt resolution through mediation</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Step 3: Legal Action</h4>
                    <p className="text-gray-600 text-sm">Courts in Mumbai, Maharashtra have jurisdiction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Changes to These Terms</h2>

          <div className="space-y-6">
            <p className="text-gray-600 text-lg">
              We reserve the right to modify these Terms and Conditions at any time. 
              Changes will be effective immediately upon posting on our website.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">How We Notify You</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Updated "Last Modified" date on this page</li>
                  <li>• Email notification for significant changes</li>
                  <li>• Website banner for major updates</li>
                  <li>• Account dashboard notifications</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Responsibility</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Review terms periodically</li>
                  <li>• Check for updates before making purchases</li>
                  <li>• Contact us if you have questions</li>
                  <li>• Discontinue use if you disagree with changes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaEnvelope />
            Questions About These Terms?
          </h2>
          <p className="text-rose-100 mb-6">
            If you have any questions about these Terms and Conditions, please contact us. 
            We're here to help clarify any concerns you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/ContactUs" 
              className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
            >
              Contact Support
            </a>
            <a 
              href="mailto:legal@shivanishagun.com" 
              className="bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-800 transition-colors"
            >
              legal@shivanishagun.com
            </a>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default TermsConditions;