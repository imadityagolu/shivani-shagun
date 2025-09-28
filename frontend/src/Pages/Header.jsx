import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Images/store/logo.png';
import { FaSignInAlt, FaUserCircle, FaHeart, FaShoppingCart, FaTimes, FaHome, FaTags } from 'react-icons/fa';

function Header() {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('customerName');
    setCustomerName(token && name ? name : null);
    // Listen for storage changes (e.g., login/logout in other tabs)
    const handleStorage = () => {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('customerName');
      setCustomerName(token && name ? name : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customerName');
    setCustomerName(null);
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-rose-500 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Logo and Name */}
        <Link to="/Home" className="flex items-center gap-2 lg:gap-3">
          <span className="rounded-lg shadow flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-8 sm:h-10 w-8 sm:w-10 object-contain rounded-lg" />
          </span>
          <span className="text-white text-lg sm:text-xl lg:text-2xl tracking-wide drop-shadow">Shivani Shagun</span>
        </Link>
        {/* Centered Categories (Desktop) */}
        <div className="hidden sm:flex flex-1 justify-center gap-1 lg:gap-2">
          <Link to='/AllProduct?category=Saree' className='border rounded-lg bg-white text-rose-500 py-1 px-1.5 sm:py-1.5 sm:px-2 lg:px-3 text-sm lg:text-base font-medium lg:font-semibold shadow hover:bg-rose-100 transition'>Saree</Link>
          <Link to='/AllProduct?category=Lehnga' className='border rounded-lg bg-white text-rose-500 py-1 px-1.5 sm:py-1.5 sm:px-2 lg:px-3 text-sm lg:text-base font-medium lg:font-semibold shadow hover:bg-rose-100 transition'>Lehnga</Link>
          <Link to='/AllProduct?category=Chunni' className='border rounded-lg bg-white text-rose-500 py-1 px-1.5 sm:py-1.5 sm:px-2 lg:px-3 text-sm lg:text-base font-medium lg:font-semibold shadow hover:bg-rose-100 transition'>Chunni</Link>
          <Link to='/AllProduct?category=Sute' className='border rounded-lg bg-white text-rose-500 py-1 px-1.5 sm:py-1.5 sm:px-2 lg:px-3 text-sm lg:text-base font-medium lg:font-semibold shadow hover:bg-rose-100 transition'>Sute</Link>
          <Link to='/AllProduct?category=Others' className='border rounded-lg bg-white text-rose-500 py-1 px-1.5 sm:py-1.5 sm:px-2 lg:px-3 text-sm lg:text-base font-medium lg:font-semibold shadow hover:bg-rose-100 transition'>Other</Link>
          <Link to='/AllProduct' className='border rounded-lg bg-white text-rose-500 py-1 px-1.5 sm:py-1.5 sm:px-2 lg:px-3 text-sm lg:text-base font-medium lg:font-semibold shadow hover:bg-rose-100 transition'>All Product</Link>
        </div>
        {/* Login/Profile (Desktop) */}
        <div className="hidden sm:flex gap-3 justify-end min-w-[120px]">
          {customerName ? (
            <>
            <Link to='/wishlist' className='rounded-lg text-black p-2 px-4 font-semibold shadow hover:bg-rose-700 transition flex items-center gap-2'>
              <FaHeart className="text-lg text-white" />
            </Link>
            <Link to='/cart' className='rounded-lg text-black p-2 px-4 font-semibold shadow hover:bg-rose-700 transition flex items-center gap-2'>
              <FaShoppingCart className="text-lg text-white" />
            </Link>
            <Link to='/Profile' className='rounded-lg text-black p-2 px-4 font-semibold shadow hover:bg-rose-700 transition flex items-center gap-2'>
              <FaUserCircle className="text-lg text-white" />
              <span className='text-white'>{customerName.split(' ')[0]}</span>
            </Link>
            </>
          ) : (
            <Link to='/Login' className='border rounded-lg bg-amber-500 text-white p-2 px-4 font-semibold shadow hover:bg-amber-600 transition flex items-center gap-2'>
              <FaSignInAlt className="text-lg" />
              Login
            </Link>
          )}
        </div>
        {/* Hamburger for Mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-rose-600 transition"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-white rounded my-1 transition-all duration-300 ${open ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>
      {/* Side Nav for Mobile */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-rose-50 to-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out sm:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 relative">
            <button
              className="absolute top-4 right-4 text-white hover:text-rose-200 text-2xl transition-colors duration-200"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
            <div className="flex items-center gap-3 mt-2">
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain rounded-lg shadow-md" />
              <div>
                <h2 className="text-white text-xl font-bold">Shivani Shagun</h2>
                <p className="text-rose-100 text-sm">Traditional Wear</p>
              </div>
            </div>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Home Link */}
            <div className="p-4 border-b border-rose-100">
              <Link
                to='/Home'
                className='w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 font-medium'
                onClick={() => setOpen(false)}
              >
                <FaHome className="text-lg" />
                Home
              </Link>
            </div>

            {/* Categories Section */}
            <div className="p-4">
              <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-2">
                <FaTags className="text-rose-500" />
                Categorie List :-
              </h3>
              <div className="space-y-2">
                <Link
                  to='/AllProduct?category=Saree'
                  className='w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 font-medium border border-transparent hover:border-rose-200'
                  onClick={() => setOpen(false)}
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">S</span>
                  Saree
                </Link>
                <Link
                  to='/AllProduct?category=Lehnga'
                  className='w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 font-medium border border-transparent hover:border-rose-200'
                  onClick={() => setOpen(false)}
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">L</span>
                  Lehnga
                </Link>
                <Link
                  to='/AllProduct?category=Chunni'
                  className='w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 font-medium border border-transparent hover:border-rose-200'
                  onClick={() => setOpen(false)}
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">C</span>
                  Chunni
                </Link>
                <Link
                  to='/AllProduct?category=Sute'
                  className='w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 font-medium border border-transparent hover:border-rose-200'
                  onClick={() => setOpen(false)}
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">Su</span>
                  Sute
                </Link>
                <Link
                  to='/AllProduct?category=Others'
                  className='w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 font-medium border border-transparent hover:border-rose-200'
                  onClick={() => setOpen(false)}
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">O</span>
                  Others
                </Link>
                <Link
                  to='/AllProduct'
                  className='w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 font-medium border border-transparent hover:border-rose-200'
                  onClick={() => setOpen(false)}
                >
                  <span className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">All</span>
                  All Products
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Section - User Actions */}
          <div className="p-4 border-t border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
            {customerName ? (
              <div className="space-y-3">
                <Link
                  to='/Profile'
                  className='w-full flex items-center gap-3 p-3 rounded-xl bg-white text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 font-medium shadow-sm border border-rose-100'
                  onClick={() => setOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full flex items-center justify-center">
                    <FaUserCircle className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold">{customerName.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">View Profile</p>
                  </div>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to='/wishlist'
                    className='flex flex-col items-center gap-2 p-3 rounded-xl bg-white text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 shadow-sm border border-rose-100'
                    onClick={() => setOpen(false)}
                  >
                    <FaHeart className="text-lg text-rose-500" />
                    <span className="text-sm font-medium">Wishlist</span>
                  </Link>
                  <Link
                    to='/cart'
                    className='flex flex-col items-center gap-2 p-3 rounded-xl bg-white text-gray-700 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 shadow-sm border border-rose-100'
                    onClick={() => setOpen(false)}
                  >
                    <FaShoppingCart className="text-lg text-rose-500" />
                    <span className="text-sm font-medium">Cart</span>
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                to='/Login'
                className='w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105'
                onClick={() => setOpen(false)}
              >
                <FaSignInAlt className="text-lg" />
                Login to Continue
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Overlay for mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 sm:hidden backdrop-blur-sm bg-black/30 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </header>
  );
}

export default Header;