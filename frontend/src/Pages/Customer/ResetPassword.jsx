import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

function ResetPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email for password reset:', email);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-1 sm:p-0">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md mx-2 sm:mx-auto">
        <div className="flex justify-center mb-6">
          <FaUserCircle className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-6">Reset Password ?</h2>
        <p className="text-gray-600 text-center mb-6">Enter your credential to reset your password</p>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 placeholder-gray-400"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2 sm:gap-0">
            <a href="/Login" className="text-rose-500 font-medium hover:underline">Back to Sign in</a>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;