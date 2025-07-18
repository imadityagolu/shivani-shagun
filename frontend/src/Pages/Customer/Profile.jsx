import React, { useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const userName = "Customer Name"; // Placeholder for customer name
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/Login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <FaUserCircle className="w-8 h-8 text-rose-500" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{userName}</h2>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 w-full sm:w-auto"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row p-2 sm:p-4 md:p-6 gap-4 md:gap-6">
        {/* Left Sidebar (20%) */}
        <div className="w-full md:w-1/5 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0">
          <ul className="space-y-3">
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500">
                My Orders
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500">
                My Profile
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500">
                Wishlist
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500">
                Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content Area (80%) */}
        <div className="w-full md:w-4/5 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Profile Content</h3>
          <p className="text-gray-600">This is a placeholder for your profile content. Add your components or data here.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;