import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaBars, FaBell, FaBox, FaUser, FaHeart, FaShoppingCart, FaCog, FaPlus, FaEdit, FaMapMarkerAlt, FaListAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import AddProduct from './Components/AddProduct';
import ListAllProducts from './Components/ListAllProducts';
import GenerateBill from './Components/GenerateBill';
import ShowBudget from './Components/ShowBudget';
import Customers from './Components/Customers';
import Orders from './Components/Orders';
import Notifications from './Components/Notifications';

function AdminDashboard() {
  const [adminName, setAdminName] = useState('');
  const [adminMobile, setAdminMobile] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminLastLogin, setAdminLastLogin] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();
  const [adminNotifications, setAdminNotifications] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/AdminLogin');
    }
    const name = localStorage.getItem('adminName');
    if (name) setAdminName(name);
    // Fetch admin mobile from backend
    const fetchAdmin = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data && data.admin) {
          setAdminMobile(data.admin.mobile || '');
          setAdminEmail(data.admin.email || '');
          setAdminLastLogin(data.admin.lastLogin || '');
        }
      } catch (err) {}
    };
    fetchAdmin();
    setSelected(''); // Show details panel by default
    fetchAdminNotifications();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminName');
    navigate('/AdminLogin');
  };

  const renderComponent = () => {
    switch (selected) {
      case 'add':
        return <AddProduct />;
      case 'list':
        return <ListAllProducts />;
      case 'bill':
        return <GenerateBill />;
      case 'budget':
        return <ShowBudget />;
      case 'customers':
        return <Customers />;
      default:
        return null;
    }
  };

  const fetchAdminNotifications = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setAdminNotifications(data);
    } catch (err) {
      setAdminNotifications([]);
    }
  };
  const unreadCount = adminNotifications.filter(n => !n.read).length;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <div className="flex w-full items-center gap-3 sm:justify-between">
          <div className="flex items-center space-x-3">
            {/* Hamburger for mobile */}
            <button
              className="sm:hidden mr-2 p-2 rounded hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars className="w-6 h-6 text-rose-500" />
            </button>
            <FaUserCircle className="w-8 h-8 text-rose-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{adminName}</h2>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row p-2 sm:p-4 md:p-6 gap-4 md:gap-6">
        {/* Sidebar for desktop */}
        <div className="hidden md:block w-full md:w-1/5 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
          <ul className="space-y-3">
            <li>
              <button onClick={() => setSelected('add')} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'add' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                <FaPlus className="text-rose-400 w-4 h-4 mr-2" /> Add Product
              </button>
            </li>
            <li>
              <button onClick={() => setSelected('list')} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'list' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                <FaListAlt className="text-rose-400 w-4 h-4 mr-2" /> List All Products
              </button>
            </li>
            <li>
              <button onClick={() => setSelected('customers')} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'customers' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                <FaUser className="text-rose-400 w-4 h-4 mr-2" /> Manage Customers
              </button>
            </li>
            <li>
              <button onClick={() => setSelected('orders')} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'orders' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                <FaBox className="text-rose-400 w-4 h-4 mr-2" /> Orders
              </button>
            </li>
            <li>
              <button onClick={() => setSelected('bill')} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'bill' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                <FaHeart className="text-rose-400 w-4 h-4 mr-2" /> Generate Bill
              </button>
            </li>
            <li>
              <button onClick={() => setSelected('budget')} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'budget' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                <FaMapMarkerAlt className="text-rose-400 w-4 h-4 mr-2" /> Show Monthly Budget
              </button>
            </li>
            <li>
              <button
                className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'notifications' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                onClick={() => setSelected('notifications')}
              >
                <FaBell className="text-rose-400" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{unreadCount}</span>
                )}
              </button>
            </li>
            <li>
              <Link to="/Home" className={`w-full flex px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}>
                <FaShoppingCart className="text-rose-400 w-4 h-4 mr-2" /> Go to Website
              </Link>
            </li>
          </ul>
        </div>
        {/* Sidebar for mobile (side panel) */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-50 p-4 flex flex-col">
              <button
                className="mb-6 text-rose-500 hover:text-rose-700 text-3xl font-bold self-end"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                &times;
              </button>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => { setSelected('add'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'add' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                    <FaPlus className="text-rose-400 w-4 h-4 mr-2" /> Add Product
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelected('list'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'list' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                    <FaListAlt className="text-rose-400 w-4 h-4 mr-2" /> List All Products
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelected('customers'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'customers' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                    <FaUser className="text-rose-400 w-4 h-4 mr-2" /> Manage Customers
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelected('orders'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'orders' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                    <FaBox className="text-rose-400 w-4 h-4 mr-2" /> Orders
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelected('bill'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'bill' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                    <FaHeart className="text-rose-400 w-4 h-4 mr-2" /> Generate Bill
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelected('budget'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'budget' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}>
                    <FaMapMarkerAlt className="text-rose-400 w-4 h-4 mr-2" /> Show Monthly Budget
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selected === 'notifications' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                    onClick={() => { setSelected('notifications'); setSidebarOpen(false); }}
                  >
                    <FaBell className="text-rose-400" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{unreadCount}</span>
                    )}
                  </button>
                </li>
                <li>
                  <Link to="/Home" className={`w-full flex px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500`}>
                    <FaShoppingCart className="text-rose-400 w-4 h-4 mr-2" /> Go to Website
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Right Content Area (80%) */}
        <div className="w-full md:w-4/5 bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col md:flex-row gap-6">
          {selected === '' ? (
            <div className="flex flex-1 items-center justify-center w-full h-full">
              <div className="w-full max-w-2xl mx-auto">
                {/* Hero Section */}
                <div className="relative rounded-xl mb-6 sm:mb-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400/80 via-pink-300/60 to-blue-200/60">
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="200" cy="200" r="180" fill="url(#paint0_radial)" />
                      <defs>
                        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(200 200) scale(180)" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#fff" stopOpacity=".7" />
                          <stop offset="1" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="relative flex items-center gap-6 p-4 sm:p-8 backdrop-blur-md bg-white/40 rounded-xl shadow-lg">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center shadow-lg border-4 border-white/40">
                        <FaUserCircle className="text-white w-12 h-12 sm:w-16 sm:h-16" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 drop-shadow">Welcome, {adminName || 'Admin'}!</h2>
                      <p className="text-gray-700 text-sm sm:text-lg mb-3 sm:mb-4 font-medium">Here's your admin dashboard</p>
                    </div>
                  </div>
                </div>
                {/* Details Card */}
                <div className="rounded-xl shadow-xl border border-gray-100 bg-white/60 backdrop-blur-md p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-wide">Admin Information <span className="text-rose-400">:-</span></h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="flex items-center gap-3 py-3">
                      <FaUserCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">Full Name:</span>
                      <span className="text-sm sm:text-base text-gray-800 font-semibold">{adminName || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 01-8 0m8 0V8a4 4 0 10-8 0v4m8 0a4 4 0 01-8 0m8 0v4a4 4 0 01-8 0v-4" /></svg>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">Email:</span>
                      <span className="text-sm sm:text-base text-gray-800 font-semibold">{adminEmail || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" /></svg>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">Mobile:</span>
                      <span className="text-sm sm:text-base text-gray-800 font-semibold">{adminMobile || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 py-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">Last Login:</span>
                      <span className="text-sm sm:text-base text-gray-800 font-semibold">{adminLastLogin ? new Date(adminLastLogin).toLocaleString() : 'Never logged in'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selected === 'orders' ? (
            <div className="flex-1"><Orders /></div>
          ) : selected === 'notifications' ? (
            <Notifications onAllRead={() => setAdminNotifications(adminNotifications.map(n => ({ ...n, read: true })))} />
          ) : (
            <div className="flex-1">{renderComponent()}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;