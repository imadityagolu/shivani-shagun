import React from 'react';
import { FaUndo, FaShippingFast, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

function CancelReturnRefund() {
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cancel, Return & Refund Policy</h1>
          <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto">
            Your satisfaction is our priority. Learn about our flexible return and refund policies.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Quick Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClock className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">7-Day Return</h3>
            <p className="text-gray-600">Easy returns within 7 days of delivery</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShippingFast className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Free Return Shipping</h3>
            <p className="text-gray-600">We cover return shipping costs for eligible items</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUndo className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Refunds</h3>
            <p className="text-gray-600">Refunds processed within 5-7 business days</p>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaTimesCircle className="text-rose-500" />
            Order Cancellation Policy
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Before Shipment</h3>
              <p className="text-gray-600 mb-4">
                You can cancel your order free of charge before it has been shipped. Once your order is confirmed, 
                you have up to 24 hours to cancel it without any charges.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Log into your account and go to "My Orders"</li>
                <li>Find the order you want to cancel</li>
                <li>Click "Cancel Order" if the option is available</li>
                <li>Your refund will be processed within 3-5 business days</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">After Shipment</h3>
              <p className="text-gray-600 mb-4">
                Once your order has been shipped, you cannot cancel it. However, you can return the item 
                once you receive it, following our return policy guidelines.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Custom/Personalized Orders</h3>
              <p className="text-gray-600">
                Custom-made or personalized items cannot be cancelled once production has started. 
                Please review your order carefully before confirming.
              </p>
            </div>
          </div>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaUndo className="text-rose-500" />
            Return Policy
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Eligible for Return
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Items in original condition with tags attached
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Unworn and unwashed items
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Items with original packaging
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Defective or damaged items
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Wrong item received
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaTimesCircle className="text-red-500" />
                Not Eligible for Return
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Custom-made or personalized items
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Items worn or washed
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Items without original tags
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Intimate apparel and undergarments
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Items returned after 7 days
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Return an Item</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                <p className="text-sm text-gray-600">Contact our support team</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                <p className="text-sm text-gray-600">Receive return authorization</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                <p className="text-sm text-gray-600">Pack and ship the item</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">4</div>
                <p className="text-sm text-gray-600">Receive your refund</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaCheckCircle className="text-rose-500" />
            Refund Policy
          </h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Refund Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">1-2 Business Days</p>
                      <p className="text-sm text-gray-600">Item received and inspected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">3-5 Business Days</p>
                      <p className="text-sm text-gray-600">Refund processed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-800">5-7 Business Days</p>
                      <p className="text-sm text-gray-600">Amount credited to your account</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Refund Methods</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Original payment method (preferred)
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Bank transfer (for cash payments)
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Store credit (if requested)
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    UPI/Digital wallet refund
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-600 text-xl mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Important Notes</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Shipping charges are non-refundable unless the return is due to our error</li>
                    <li>• Custom/personalized items are eligible for refund only if defective</li>
                    <li>• Refund amount may be adjusted for return shipping costs (if applicable)</li>
                    <li>• Sale items may have different return policies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Exchange Policy</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Size Exchange</h3>
              <p className="text-gray-600 mb-4">
                We offer size exchanges within 7 days of delivery, subject to availability. 
                The item must be in original condition with tags attached.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Free size exchange for the first time</li>
                <li>• Additional shipping charges for subsequent exchanges</li>
                <li>• Subject to stock availability</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Color/Style Exchange</h3>
              <p className="text-gray-600 mb-4">
                Color or style exchanges are allowed only if the item received is different 
                from what was ordered or if there's a manufacturing defect.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Must be reported within 48 hours of delivery</li>
                <li>• Photo evidence may be required</li>
                <li>• Free exchange for our errors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with Returns or Refunds?</h2>
          <p className="text-rose-100 mb-6">
            Our customer service team is here to assist you with any questions about returns, exchanges, or refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/ContactUs" 
              className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
            >
              Contact Support
            </a>
            <a 
              href="mailto:support@shivanishagun.com" 
              className="bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-800 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default CancelReturnRefund;