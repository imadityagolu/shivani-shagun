import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/store/logo.png';
import { FaSignInAlt, FaUserCircle } from 'react-icons/fa';

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
        <Link to="/Home" className="flex items-center gap-3">
          <span className="rounded-lg shadow flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
          </span>
          <span className="text-white text-2xl tracking-wide drop-shadow">Shivani Shagun</span>
        </Link>
        {/* Centered Categories (Desktop) */}
        <div className="hidden sm:flex flex-1 justify-center gap-3">
          <Link to='/sections/saree' className='border rounded-lg bg-white text-rose-500 py-1.5 px-4 font-semibold shadow hover:bg-rose-100 transition'>Saree</Link>
          <Link to='/sections/lehnga' className='border rounded-lg bg-white text-rose-500 py-1.5 px-4 font-semibold shadow hover:bg-rose-100 transition'>Lehnga</Link>
          <Link to='/sections/chunni' className='border rounded-lg bg-white text-rose-500 py-1.5 px-4 font-semibold shadow hover:bg-rose-100 transition'>Chunni</Link>
          <Link to='/sections/sute' className='border rounded-lg bg-white text-rose-500 py-1.5 px-4 font-semibold shadow hover:bg-rose-100 transition'>Sute</Link>
          <Link to='/sections/allproduct' className='border rounded-lg bg-white text-rose-500 py-1.5 px-4 font-semibold shadow hover:bg-rose-100 transition'>All Products</Link>
        </div>
        {/* Login/Profile (Desktop) */}
        <div className="hidden sm:flex gap-3 justify-end min-w-[120px]">
          {customerName ? (
            <Link to='/Profile' className='rounded-lg text-black p-2 px-4 font-semibold shadow hover:bg-rose-100 transition flex items-center gap-2'>
              <span className="rounded-full bg-white shadow p-1"><FaUserCircle className="text-lg text-black" /></span>
              {customerName.split(' ')[0]}
            </Link>
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
        className={`fixed top-0 right-0 h-full w-2/3 max-w-xs bg-white shadow-lg z-50 transform transition-transform duration-300 sm:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ boxShadow: open ? '0 0 0 100vw rgba(0,0,0,0.3)' : 'none' }}
        onClick={() => setOpen(false)}
      >
        <div className="flex flex-col h-full justify-between">
          {/* Categories at top */}
          <div className="flex flex-col items-end p-4 gap-2">
            <button
              className="mb-4 text-rose-500 hover:text-rose-700 text-3xl font-bold self-end"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              &times;
            </button>
            <Link
              to='/sections/saree'
              className='w-full border rounded-lg bg-white text-rose-500 py-2 px-3 text-base font-semibold shadow hover:bg-rose-100 transition text-center'
              onClick={() => setOpen(false)}
            >
              Saree
            </Link>
            <Link
              to='/sections/lehnga'
              className='w-full border rounded-lg bg-white text-rose-500 py-2 px-3 text-base font-semibold shadow hover:bg-rose-100 transition text-center'
              onClick={() => setOpen(false)}
            >
              Lehnga
            </Link>
            <Link
              to='/sections/chunni'
              className='w-full border rounded-lg bg-white text-rose-500 py-2 px-3 text-base font-semibold shadow hover:bg-rose-100 transition text-center'
              onClick={() => setOpen(false)}
            >
              Chunni
            </Link>
            <Link
              to='/sections/sute'
              className='w-full border rounded-lg bg-white text-rose-500 py-2 px-3 text-base font-semibold shadow hover:bg-rose-100 transition text-center'
              onClick={() => setOpen(false)}
            >
              Sute
            </Link>
            <Link
              to='/sections/allproduct'
              className='w-full border rounded-lg bg-white text-rose-500 py-2 px-3 text-base font-semibold shadow hover:bg-rose-100 transition text-center'
              onClick={() => setOpen(false)}
            >
              All Products
            </Link>
          </div>
          {/* Login/Profile at bottom */}
          <div className="p-4">
            {customerName ? (
              <Link
                to='/Profile'
                className='w-full rounded-lg text-black p-3 text-lg font-semibold shadow hover:bg-rose-100 transition text-center block flex items-center justify-center gap-2'
                onClick={() => setOpen(false)}
              >
                <span className="rounded-full bg-white shadow p-1"><FaUserCircle className="text-xl text-black" /></span>
                {customerName.split(' ')[0]}
              </Link>
            ) : (
              <Link
                to='/Login'
                className='w-full border rounded-lg bg-amber-500 text-white p-3 text-lg font-semibold shadow hover:bg-amber-600 transition text-center block flex items-center justify-center gap-2'
                onClick={() => setOpen(false)}
              >
                <FaSignInAlt className="text-xl" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Overlay for mobile menu */}
      {open && (
        <div
          className="fixed inset-0 z-40 sm:hidden backdrop-blur bg-black/10"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </header>
  );
}

export default Header; 