import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddProduct from './Components/AddProduct';
import ListAllProducts from './Components/ListAllProducts';
import GenerateBill from './Components/GenerateBill';
import ShowBudget from './Components/ShowBudget';

function AdminDashboard() {
  const [adminName, setAdminName] = useState('');
  const [adminMobile, setAdminMobile] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminLastLogin, setAdminLastLogin] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

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
      default:
        return null;
    }
  };

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
              <button onClick={() => setSelected('add')} className={`w-full px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${selected === 'add' ? 'bg-rose-200 text-rose-700 font-bold' : 'bg-rose-100 text-gray-800 hover:bg-rose-200'}`}>
                Add Product
              </button>
            </li>
            <li>
              <button onClick={() => setSelected('list')} className={`w-full px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${selected === 'list' ? 'bg-rose-200 text-rose-700 font-bold' : 'bg-rose-100 text-gray-800 hover:bg-rose-200'}`}>
                List All Products
              </button>
            </li>
            <li>
              <button onClick={() => setSelected('bill')} className={`w-full px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${selected === 'bill' ? 'bg-rose-200 text-rose-700 font-bold' : 'bg-rose-100 text-gray-800 hover:bg-rose-200'}`}>
                Generate Bill
              </button>
            </li>
            <li>
              <button onClick={() => setSelected('budget')} className={`w-full px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${selected === 'budget' ? 'bg-rose-200 text-rose-700 font-bold' : 'bg-rose-100 text-gray-800 hover:bg-rose-200'}`}>
                Show Monthly Budget
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
                  <button onClick={() => { setSelected('add'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${selected === 'add' ? 'bg-rose-200 text-rose-700 font-bold' : 'bg-rose-100 text-gray-800 hover:bg-rose-200'}`}>
                    Add Product
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelected('list'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${selected === 'list' ? 'bg-rose-200 text-rose-700 font-bold' : 'bg-rose-100 text-gray-800 hover:bg-rose-200'}`}>
                    List All Products
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelected('bill'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${selected === 'bill' ? 'bg-rose-200 text-rose-700 font-bold' : 'bg-rose-100 text-gray-800 hover:bg-rose-200'}`}>
                    Generate Bill
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelected('budget'); setSidebarOpen(false); }} className={`w-full px-4 py-2 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${selected === 'budget' ? 'bg-rose-200 text-rose-700 font-bold' : 'bg-rose-100 text-gray-800 hover:bg-rose-200'}`}>
                    Show Monthly Budget
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Right Content Area (80%) */}
        <div className="w-full md:w-4/5 bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col md:flex-row gap-6">
          {selected === '' ? (
            <div className="flex flex-1 items-center justify-center w-full h-full">
              <div className="flex flex-col items-center justify-center min-w-[220px] bg-rose-50 rounded-lg shadow p-8">
                <div className="flex items-center gap-2 mb-2">
                  <FaUserCircle className="w-10 h-10 text-rose-500" />
                  <span className="text-xl font-semibold text-gray-800">Welcome, {adminName || 'Admin'}</span>
                </div>
                {adminEmail && <div className="text-gray-600 text-base">Email: {adminEmail}</div>}
                {adminMobile && <div className="text-gray-600 text-base">Mobile: {adminMobile}</div>}
                {adminLastLogin && <div className="text-gray-500 text-sm mt-2">Last Login: {new Date(adminLastLogin).toLocaleString()}</div>}
              </div>
            </div>
          ) : (
            <div className="flex-1">{renderComponent()}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;