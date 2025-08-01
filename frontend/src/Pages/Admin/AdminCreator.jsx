import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminCreator() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !mobile) {
      toast.error('All fields are required');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error('Mobile number must be exactly 10 digits');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, mobile })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Admin registered successfully!');
        navigate('/AdminLogin');
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-1 sm:p-0">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md mx-2 sm:mx-auto">
        <div className="flex justify-center mb-6">
          <FaUserCircle className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-6">Create Account for Admin</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 placeholder-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 placeholder-gray-400"
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) setMobile(value);
            }}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 placeholder-gray-400"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Choose Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-rose-500"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              )}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2 sm:gap-0">
            <Link to="/AdminLogin" className="text-rose-500 font-medium hover:underline">Already have an account? Sign in</Link>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-auto"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreator;