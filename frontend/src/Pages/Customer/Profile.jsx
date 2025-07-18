import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaBox, FaUser, FaHeart, FaShoppingCart, FaCog, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const userName = localStorage.getItem('customerName') || 'Customer';
  const userEmail = localStorage.getItem('customerEmail') || '';
  const userPhone = localStorage.getItem('customerMobile') || '';
  const userLastLogin = localStorage.getItem('customerLastLogin') || '';
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('profile');
  const showSettings = selectedSection === 'settings';
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/Login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Home');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 transition flex items-center gap-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FaBars className="w-6 h-6 text-rose-500" />
          </button>
          <FaUserCircle className="w-8 h-8 text-rose-500" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{userName}</h2>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row p-2 sm:p-4 md:p-6 gap-4 md:gap-6">
        {/* Sidebar for desktop */}
        <div className="hidden md:block w-full md:w-1/5 bg-white rounded-lg shadow-md p-4 mb-0 md:mb-0 order-1 md:order-none">
          <ul className="space-y-3">
            <li>
              <button
                className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'profile' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                onClick={() => setSelectedSection('profile')}
              >
                <FaUser className="text-rose-400" />
                Profile
              </button>
            </li>
            <li>
              <Link to="/Wishlist" className="block w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2">
                <FaHeart className="text-rose-400" />
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/Cart" className="block w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2">
                <FaShoppingCart className="text-rose-400" />
                Cart
              </Link>
            </li>
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2">
                <FaBox className="text-rose-400" />
                Orders
              </button>
            </li>
            <li>
              <button
                className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'settings' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                onClick={() => setSelectedSection('settings')}
              >
                <FaCog className="text-rose-400" />
                Settings
              </button>
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
                    <button
                        className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'profile' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                        onClick={() => { setSelectedSection('profile'); setSidebarOpen(false); }}
                    >
                        <FaUser className="text-rose-400" />
                        Profile
                </button>
                </li>
                <li>
                  <Link to="/Wishlist" className="block w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2">
                    <FaHeart className="text-rose-400" />
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/Cart" className="block w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2">
                    <FaShoppingCart className="text-rose-400" />
                    Cart
                  </Link>
                </li>
                <li>
                  <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2">
                    <FaBox className="text-rose-400" />
                    Orders
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'settings' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                    onClick={() => { setSelectedSection('settings'); setSidebarOpen(false); }}
                  >
                    <FaCog className="text-rose-400" />
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="w-full md:w-4/5 bg-white rounded-lg shadow-md p-4 sm:p-6 order-2 md:order-none">
          {selectedSection === 'settings' ? (
            <div className="max-w-md md:max-w-2xl mx-auto bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-4">Settings</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Change Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow"
                  placeholder="New Password"
                />
                <button className="mt-3 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition font-semibold">Change Password</button>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-semibold w-full">Delete My Account</button>
            </div>
          ) : selectedSection === 'profile' ? (
            <div className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Welcome, {userName} !!</h2>
              {userEmail && <div className="text-gray-600 text-base mt-2">Email: {userEmail}</div>}
              {userPhone && <div className="text-gray-600 text-base">Phone: +91 {userPhone}</div>}
              {userLastLogin && <div className="text-gray-500 text-sm mt-2">Last Login: {new Date(userLastLogin).toLocaleString()}</div>}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Profile;