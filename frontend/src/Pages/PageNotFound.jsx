import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FcFinePrint } from "react-icons/fc";
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          {/* <FaExclamationTriangle className="w-12 h-12 text-rose-500" /> */}
          <FcFinePrint  className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/Home"
          className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          Back to Website
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;