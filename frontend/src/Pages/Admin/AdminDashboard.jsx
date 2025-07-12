import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

function AdminDashboard() {
  const userName = "John Doe"; // Placeholder for user name

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add logout logic here
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaUserCircle className="w-8 h-8 text-rose-500" />
          <h2 className="text-xl font-semibold text-gray-800">{userName}</h2>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 p-6 gap-6">
        {/* Left Sidebar (20%) */}
        <div className="w-1/5 bg-white rounded-lg shadow-md p-4">
          <ul className="space-y-3">
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500">
                Add Product
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500">
                List All Products
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500">
                Generate Bill
              </button>
            </li>
            <li>
              <button className="w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500">
                Show Monthly Budget
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content Area (80%) */}
        <div className="w-4/5 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Content</h3>
          <p className="text-gray-600">This is a placeholder for your dashboard content. Add your components or data here.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;