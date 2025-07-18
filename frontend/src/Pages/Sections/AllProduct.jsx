import React from 'react';
import Header from '../Header';
import { FaSearch } from 'react-icons/fa';

function AllProduct() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-3/5">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow pr-10"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
          </div>
          <select
            className="w-full sm:w-2/5 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow"
          >
            <option value="">Select Category</option>
            <option value="saree">Saree</option>
            <option value="lehnga">Lehnga</option>
            <option value="chunni">Chunni</option>
          </select>
        </div>
      </div>
      <div className="min-h-[60vh] flex items-center justify-center text-3xl font-bold text-rose-500">
        No Product to Show.
      </div>
    </>
  );
}

export default AllProduct; 