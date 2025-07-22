import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaBox, FaUser, FaHeart, FaShoppingCart, FaCog, FaBars, FaBell, FaEdit, FaMapMarkerAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../Images/store/logo.png';
import Wishlist from './Wishlist';
import Cart from './Cart';

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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [cancelPopupOrderId, setCancelPopupOrderId] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/Login');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch notifications on component mount to get the count for the badge
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (selectedSection === 'notifications') {
      fetchNotifications();
      // Automatically mark all notifications as read when opening notifications
      markAllAsRead();
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedSection === 'profile') {
      fetchProfileData();
    }
  }, [selectedSection]);

  useEffect(() => {
    if (selectedSection === 'orders') {
      fetchOrders();
    }
  }, [selectedSection]);

  const fetchProfileData = async () => {
    if (!token) return;
    
    setProfileLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/customer/profile-details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        // Pre-fill address form if address exists
        if (data.address) {
          setAddressForm({
            street: data.address.street || '',
            city: data.address.city || '',
            state: data.address.state || '',
            pincode: data.address.pincode || '',
            country: data.address.country || 'India'
          });
        }
        // Pre-fill profile form
        setProfileForm({
          name: data.name || '',
          street: data.address?.street || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          pincode: data.address?.pincode || '',
          country: data.address?.country || 'India'
        });
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/customer/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/customer/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      } else {
        console.error('Failed to mark notifications as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/customer/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, '0');
    return `${day}/${month}/${year} at ${formattedHours}:${minutes} ${ampm}`;
  };

  const handleAddressInput = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.street.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.pincode.trim()) {
      toast.error('Please fill in all required address fields');
      return;
    }

    setSavingAddress(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/customer/address`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        toast.success('Address saved successfully');
        setShowAddressPopup(false);
        // Refresh profile data to show updated address
        fetchProfileData();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Error saving address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleAddressCancel = () => {
    setShowAddressPopup(false);
    // Reset form to current address data
    if (profileData && profileData.address) {
      setAddressForm({
        street: profileData.address.street || '',
        city: profileData.address.city || '',
        state: profileData.address.state || '',
        pincode: profileData.address.pincode || '',
        country: profileData.address.country || 'India'
      });
    }
  };

  const handleProfileInput = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.street.trim() || !profileForm.city.trim() || !profileForm.state.trim() || !profileForm.pincode.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSavingProfile(true);
    try {
      // Update name
      const nameResponse = await fetch(`${BACKEND_URL}/api/customer/update-name`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: profileForm.name })
      });

      // Update address
      const addressResponse = await fetch(`${BACKEND_URL}/api/customer/address`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          pincode: profileForm.pincode,
          country: profileForm.country
        })
      });

      if (nameResponse.ok && addressResponse.ok) {
        toast.success('Profile updated successfully');
        setShowProfilePopup(false);
        // Update localStorage with new name
        localStorage.setItem('customerName', profileForm.name);
        // Refresh profile data to show updated information
        fetchProfileData();
      } else {
        const nameData = await nameResponse.json();
        const addressData = await addressResponse.json();
        toast.error(nameData.message || addressData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleProfileCancel = () => {
    setShowProfilePopup(false);
    // Reset form to current profile data
    if (profileData) {
      setProfileForm({
        name: profileData.name || '',
        street: profileData.address?.street || '',
        city: profileData.address?.city || '',
        state: profileData.address?.state || '',
        pincode: profileData.address?.pincode || '',
        country: profileData.address?.country || 'India'
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setPasswordError('');
    
    // Validate passwords
    if (!newPassword.trim()) {
      setPasswordError('New password is required');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/customer/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      } else {
        const data = await response.json();
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Error changing password');
    }
  };

  const hasAddress = profileData && profileData.address && 
    (profileData.address.street || profileData.address.city || profileData.address.state || profileData.address.pincode);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Home');
  };

  const ORDER_STATUSES = [
    'order placed',
    'confirmed',
    'packed',
    'shipped',
    'out for delivery',
    'delivered'
  ];

  const handleCancelOrder = async (orderId) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/customer/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (err) {
      toast.error('Failed to cancel order');
    }
  }

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
          <Link to="/Home" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-lg sm:text-xl font-bold text-rose-600 tracking-wide">Shivani Shagun</h2>
          </Link>
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
              <button
                className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'notifications' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                onClick={() => setSelectedSection('notifications')}
              >
                <FaBell className="text-rose-400" />
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'wishlist' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                onClick={() => setSelectedSection('wishlist')}
              >
                <FaHeart className="text-rose-400" />
                Wishlist
              </button>
            </li>
            <li>
              <button
                className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'cart' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                onClick={() => setSelectedSection('cart')}
              >
                <FaShoppingCart className="text-rose-400" />
                Cart
              </button>
            </li>
            <li>
              <button
                className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'orders' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                onClick={() => setSelectedSection('orders')}
              >
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
                  <button
                    className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'notifications' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                    onClick={() => { setSelectedSection('notifications'); setSidebarOpen(false); }}
                  >
                    <FaBell className="text-rose-400" />
                    Notifications
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'wishlist' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                    onClick={() => { setSelectedSection('wishlist'); setSidebarOpen(false); }}
                  >
                    <FaHeart className="text-rose-400" />
                    Wishlist
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'cart' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                    onClick={() => { setSelectedSection('cart'); setSidebarOpen(false); }}
                  >
                    <FaShoppingCart className="text-rose-400" />
                    Cart
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full px-4 py-2 text-left text-gray-800 bg-rose-100 rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center gap-2 ${selectedSection === 'orders' ? 'bg-rose-200 text-rose-700 font-bold' : ''}`}
                    onClick={() => { setSelectedSection('orders'); setSidebarOpen(false); }}
                  >
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
          {selectedSection === 'orders' ? (
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-rose-500 mb-6">My Orders</h3>
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <FaBox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                      {/* Order Header */}
                      <div className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FaBox className="text-rose-400 w-5 h-5" />
                          <span className="font-semibold text-gray-700 text-sm sm:text-base">Order ID:</span>
                          <span className="text-xs sm:text-sm text-gray-600">{order._id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700 text-sm sm:text-base">Date:</span>
                          <span className="text-xs sm:text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      {/* Order Details */}
                      <div className="p-4 sm:p-6">
                        <div className="overflow-x-auto mt-1">
                          <table className="min-w-full bg-white border rounded-lg">
                            <thead className="bg-rose-50">
                              <tr>
                                <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">Image</th>
                                <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">Product</th>
                                <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">Category</th>
                                <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">Quantity</th>
                                <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">MRP</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((p, idx) => (
                                <tr key={p._id || idx} className="border-b last:border-0">
                                  <td className="px-2 py-2">
                                    {(p.image || (p.images && p.images[0])) ? (
                                      <img src={`${import.meta.env.VITE_BACKEND_URL}${p.image || (p.images && p.images[0])}`} alt={p.product} className="w-10 h-10 object-contain rounded bg-gray-50 border" />
                                    ) : (
                                      <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/default-product-image.JPG`} alt="Default" className="w-10 h-10 object-contain rounded bg-gray-50 border" />
                                    )}
                                  </td>
                                  <td className="px-2 py-2 font-bold text-rose-600 text-xs sm:text-sm">{p.product || 'No Name'}</td>
                                  <td className="px-2 py-2 text-gray-500 text-xs sm:text-sm">{p.category || ''}</td>
                                  <td className="px-2 py-2 text-gray-500 text-xs sm:text-sm">X 1</td>
                                  <td className="px-2 py-2 text-gray-700 font-semibold text-xs sm:text-sm">₹{p.mrp || ''}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Payment:</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentMethod === 'Cash on Delivery' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.paymentMethod}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Total:</span>
                            <span className="text-rose-600 font-bold text-base">₹{order.total}</span>
                          </div>
                        </div>
                        <div className="mb-2 text-sm text-gray-700 mt-4">
                          <span className="font-semibold">Address:</span> {order.address}
                        </div>
                        {order.status === 'cancelled' ? (
                          <div className="w-full flex justify-center items-center mt-6 mb-2">
                            <span className="text-lg sm:text-xl font-bold text-red-500 bg-red-100 px-6 py-3 rounded-lg shadow">Order Cancelled</span>
                          </div>
                        ) : (
                          <div className="w-full mt-4 px-4 sm:px-8">
                            <div className="relative h-10 flex items-center">
                              {/* Progress Bar Background */}
                              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-2 bg-gray-200 rounded-full z-0" />
                              {/* Progress Bar Foreground */}
                              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full z-10 transition-all duration-500"
                                style={{ width: `${((ORDER_STATUSES.indexOf(order.status || 'order placed')) / (ORDER_STATUSES.length - 1)) * 100}%` }}
                              />
                              {/* Steps */}
                              {ORDER_STATUSES.map((status, idx) => {
                                const currentIdx = ORDER_STATUSES.indexOf(order.status || 'order placed');
                                const isCompleted = idx < currentIdx;
                                const isCurrent = idx === currentIdx;
                                return (
                                  <div
                                    key={status}
                                    className="z-20 flex flex-col items-center"
                                    style={{ left: `${(idx / (ORDER_STATUSES.length - 1)) * 100}%`, position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)' }}
                                  >
                                    <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 text-xs font-bold
                                      ${isCompleted || isCurrent ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-400'}`}
                                    >
                                      {(isCompleted || isCurrent) ? <FaCheckCircle className="w-5 h-5" /> : idx + 1}
                                    </div>
                                    <span className={`mt-1 text-[10px] sm:text-xs text-center w-20 whitespace-nowrap ${isCurrent ? 'text-rose-600 font-bold' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{status}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {order.status !== 'out for delivery' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => setCancelPopupOrderId(order._id)}
                            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : selectedSection === 'wishlist' ? (
            <div className="max-w-4xl mx-auto">
              <Wishlist hideHeader />
            </div>
          ) : selectedSection === 'cart' ? (
            <div className="max-w-4xl mx-auto">
              <Cart hideHeader />
            </div>
          ) : selectedSection === 'settings' ? (
            <div className="max-w-md md:max-w-2xl mx-auto bg-gray-50 rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-4">Settings</h3>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Change Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow bg-white"
                  placeholder="New Password"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow mt-2 bg-white"
                  placeholder="Confirm New Password"
                />
                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                <button onClick={handleChangePassword} className="mt-3 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition font-semibold">Change Password</button>
              </div>
            </div>
          ) : selectedSection === 'notifications' ? (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-rose-500">Notifications</h3>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <FaBell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div 
                      key={notification._id}
                      className={`p-4 rounded-lg border-l-4 transition-all duration-200 ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-300' 
                          : 'bg-rose-50 border-rose-400 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm ${
                            notification.read ? 'text-gray-600' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-rose-500 rounded-full ml-3 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : selectedSection === 'profile' ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 sm:p-8 mb-6 sm:mb-8">
                <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl sm:text-2xl font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Welcome, {userName}!</h2>
                    <p className="text-gray-600 text-sm sm:text-lg">Here's your account information</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button 
                      onClick={() => setShowProfilePopup(true)}
                      className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Personal Information Card */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Personal Information</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Full Name</p>
                        <p className="text-sm sm:text-base text-gray-800 font-semibold">{userName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Email Address</p>
                        <p className="text-sm sm:text-base text-gray-800 font-semibold">{userEmail || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 sm:py-3">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Phone Number</p>
                        <p className="text-sm sm:text-base text-gray-800 font-semibold">{userPhone ? `+91 ${userPhone}` : 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Activity Card */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FaBell className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Account Activity</h3>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Last Login</p>
                        {profileLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-rose-500"></div>
                            <span className="text-gray-400 text-xs sm:text-sm">Loading...</span>
                          </div>
                        ) : profileData && profileData.lastLogin ? (
                          <p className="text-sm sm:text-base text-gray-800 font-semibold">{formatDate(profileData.lastLogin)}</p>
                        ) : userLastLogin ? (
                          <p className="text-sm sm:text-base text-gray-800 font-semibold">{formatDate(userLastLogin)}</p>
                        ) : (
                          <p className="text-gray-400 text-xs sm:text-sm">Never logged in</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Account Status</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-green-600 font-semibold text-sm sm:text-base">Active</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 sm:py-3">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Member Since</p>
                        {profileData && profileData.createdAt ? (
                          <p className="text-sm sm:text-base text-gray-800 font-semibold">{formatDate(profileData.createdAt)}</p>
                        ) : (
                          <p className="text-gray-400 text-xs sm:text-sm">Information not available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="mt-6 sm:mt-8">
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Address Information</h3>
                  </div>
                  
                  {hasAddress ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaMapMarkerAlt className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm sm:text-base text-gray-800 font-medium">
                            {profileData.address.street}
                          </p>
                          <p className="text-sm text-gray-600">
                            {profileData.address.city}, {profileData.address.state} {profileData.address.pincode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {profileData.address.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaMapMarkerAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No address information available</p>
                      <button
                        onClick={() => setShowAddressPopup(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Add Your Address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Popup */}
              {showAddressPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                  <button 
                    onClick={handleAddressCancel} 
                    className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-orange-500"
                    disabled={savingAddress}
                  >
                    &times;
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <FaMapMarkerAlt className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {hasAddress ? 'Edit' : 'Add'} Address
                      </h3>
                      <p className="text-sm text-gray-600">Update your delivery address</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={addressForm.street}
                        onChange={handleAddressInput}
                        placeholder="Enter your street address..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                        disabled={savingAddress}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={addressForm.city}
                          onChange={handleAddressInput}
                          placeholder="City"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                          disabled={savingAddress}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={addressForm.state}
                          onChange={handleAddressInput}
                          placeholder="State"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                          disabled={savingAddress}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressForm.pincode}
                          onChange={handleAddressInput}
                          placeholder="Pincode"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                          disabled={savingAddress}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={addressForm.country}
                          onChange={handleAddressInput}
                          placeholder="Country"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={savingAddress}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleAddressCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        disabled={savingAddress}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={savingAddress}
                      >
                        {savingAddress ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaMapMarkerAlt className="w-4 h-4" />
                            Save Address
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Profile Edit Popup */}
            {showProfilePopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                  <button 
                    onClick={handleProfileCancel} 
                    className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-rose-500"
                    disabled={savingProfile}
                  >
                    &times;
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
                        <FaEdit className="w-6 h-6 text-rose-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
                      <p className="text-sm text-gray-600">Update your personal information</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileInput}
                        placeholder="Enter your full name..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                        disabled={savingProfile}
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Address Information</h4>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={profileForm.street}
                        onChange={handleProfileInput}
                        placeholder="Enter your street address..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                        disabled={savingProfile}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profileForm.city}
                          onChange={handleProfileInput}
                          placeholder="City"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          required
                          disabled={savingProfile}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profileForm.state}
                          onChange={handleProfileInput}
                          placeholder="State"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          required
                          disabled={savingProfile}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={profileForm.pincode}
                          onChange={handleProfileInput}
                          placeholder="Pincode"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          required
                          disabled={savingProfile}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={profileForm.country}
                          onChange={handleProfileInput}
                          placeholder="Country"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                          disabled={savingProfile}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleProfileCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        disabled={savingProfile}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={savingProfile}
                      >
                        {savingProfile ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaEdit className="w-4 h-4" />
                            Save Profile
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            </div>
          ) : null}
        </div>
      </div>
      {cancelPopupOrderId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative">
      <button
        onClick={() => setCancelPopupOrderId(null)}
        className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-red-500"
      >
        &times;
      </button>
      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Cancel Order?</h3>
      <p className="text-gray-600 text-center mb-4">Are you sure you want to cancel this order?</p>
      <div className="flex gap-3">
        <button
          onClick={() => setCancelPopupOrderId(null)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          No
        </button>
        <button
          onClick={() => { handleCancelOrder(cancelPopupOrderId); setCancelPopupOrderId(null); }}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
        >
          Yes, Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Profile;