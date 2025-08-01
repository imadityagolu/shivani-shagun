import React, { useEffect, useState } from 'react';
import { FaBox, FaSearch, FaChevronDown, FaChevronUp, FaSave, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ORDER_STATUSES = [
  'order placed',
  'confirmed',
  'packed',
  'shipped',
  'out for delivery',
  'delivered',
  'cancelled'
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [statusEdits, setStatusEdits] = useState({});
  const [savingStatus, setSavingStatus] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      setOrders([]);
    }
    setLoading(false);
  };

  const handleStatusChange = (orderId, value) => {
    setStatusEdits(prev => ({ ...prev, [orderId]: value }));
  };

  const handleSaveStatus = async (orderId) => {
    setSavingStatus(prev => ({ ...prev, [orderId]: true }));
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const status = statusEdits[orderId];
      const res = await fetch(`${BACKEND_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        // Update order in UI
        setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status } : o));
        toast.success(data.message || 'Order status updated');
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
    setSavingStatus(prev => ({ ...prev, [orderId]: false }));
  };

  const handleMarkComplete = async (orderId) => {
    setSavingStatus(prev => ({ ...prev, [orderId]: true }));
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'complete' })
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: 'complete' } : o));
        toast.success(data.message || 'Order marked as complete');
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
    setSavingStatus(prev => ({ ...prev, [orderId]: false }));
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

  // Filtering logic
  const filteredOrders = orders.filter(order => {
    // Search by customer name, email, mobile, or order ID
    const customer = order.customer || {};
    const searchText = search.toLowerCase();
    const matchesSearch =
      order._id?.toLowerCase().includes(searchText) ||
      customer.name?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText) ||
      customer.mobile?.toString().includes(searchText);
    // Payment filter
    const matchesPayment = paymentFilter ? order.paymentMethod === paymentFilter : true;
    // Status filter
    const matchesStatus = statusFilter ? (order.status || 'order placed') === statusFilter : true;
    // Mode filter
    const matchesMode = modeFilter ? order.mode === modeFilter : true;
    // Date filter
    let matchesDate = true;
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (dateFilter === 'today') {
      matchesDate = orderDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      matchesDate = orderDate.toDateString() === tomorrow.toDateString();
    } else if (dateFilter === 'select' && selectedDate) {
      const sel = new Date(selectedDate);
      sel.setHours(0,0,0,0);
      matchesDate = orderDate.toDateString() === sel.toDateString();
    }
    return matchesSearch && matchesPayment && matchesStatus && matchesMode && matchesDate;
  });

  return (
    <div className="overflow-x-auto w-full">
      <h2 className="text-2xl font-bold text-rose-500 mb-4 text-center flex items-center justify-center gap-4">
        <FaBox className="text-rose-400" /> All Orders
      </h2>
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, email, mobile, order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg w-full sm:w-80 md:w-96 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            <option value="">All Payments</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Online Payment">Online Payment</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
            <option value="complete">complete</option>
            <option value="due">due</option>
          </select>
          <select
            value={modeFilter}
            onChange={e => setModeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            <option value="">All Modes</option>
            <option value="website">Website</option>
            <option value="shop">Shop</option>
          </select>
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            <option value="all">All Orders</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="select">Select Date</option>
          </select>
          {dateFilter === 'select' && (
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
              title="Select date"
            />
          )}
          <button
            onClick={() => { setSearch(''); setPaymentFilter(''); setStatusFilter(''); setDateFilter('all'); setSelectedDate(''); }}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold text-xs sm:text-sm ml-2"
          >
            Reset
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-rose-500 text-xl font-bold">No orders found.</div>
      ) : (
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mode</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className="hover:bg-rose-50 transition">
                  <td className="px-4 py-3 text-xs sm:text-sm text-gray-700">{order._id}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-gray-700 capitalize">{order.mode}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm">
                    <span className="inline-block px-2 py-1 rounded bg-rose-100 text-rose-700 font-semibold text-xs">
                      {order.status || 'order placed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-gray-700">{order.customer}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-gray-700">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm text-rose-600 font-bold">₹{order.total}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.paymentMethod === 'Cash on Delivery' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.paymentMethod}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-rose-500 hover:text-rose-700 text-lg"
                      onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                      aria-label="Show details"
                    >
                      {expanded === order._id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </td>
                </tr>
                {expanded === order._id && (
                  <tr>
                    <td colSpan={7} className="bg-rose-50 px-4 py-4">
                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-bold text-gray-700 mb-2">Customer Details</h4>
                          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Name:</span> {order.customer}</div>
                          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Mobile:</span> {order.mobile}</div>
                          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Order Time:</span> {formatDate(order.createdAt)}</div>
                          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Payment:</span> {order.paymentMethod}</div>
                          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Total:</span> ₹{order.total}</div>
                          {order.mode === 'shop' && (
                            <>
                              <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Paid:</span> ₹{order.paid || 0}</div>
                              <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Due:</span> ₹{order.due || 0}</div>
                            </>
                          )}
                          <div className="text-sm text-gray-700 mb-1"><span className="font-semibold">Address:</span> {order.address}</div>
                          <div className="mt-4">
                            {order.status === 'cancelled' ? (
                              <div className="w-full flex justify-center items-center mt-6 mb-2">
                                <span className="text-lg sm:text-xl font-bold text-red-500 bg-red-100 px-6 py-3 rounded-lg shadow">Order Cancelled</span>
                              </div>
                            ) : order.status === 'delivered' ? (
                              <div className="w-full flex justify-center items-center mt-6 mb-2">
                                <span className="text-lg sm:text-xl font-bold text-green-600 bg-green-100 px-6 py-3 rounded-lg shadow">Order Delivered</span>
                              </div>
                            ) : (
                              <>
                                {order.mode !== 'shop' ? (
                                  <>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Order Status</label>
                                    <div className="flex gap-2 items-center">
                                      <select
                                        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-rose-200 text-xs"
                                        value={statusEdits[order._id] !== undefined ? statusEdits[order._id] : (order.status || 'order placed')}
                                        onChange={e => handleStatusChange(order._id, e.target.value)}
                                      >
                                        {ORDER_STATUSES.map(status => (
                                          <option key={status} value={status}>{status}</option>
                                        ))}
                                      </select>
                                      <button
                                        className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs font-semibold disabled:opacity-60"
                                        onClick={() => handleSaveStatus(order._id)}
                                        disabled={savingStatus[order._id] || (statusEdits[order._id] === (order.status || 'order placed'))}
                                      >
                                        {savingStatus[order._id] ? (
                                          <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></span>
                                        ) : (
                                          <FaSave className="inline-block" />
                                        )}
                                        Save
                                      </button>
                                    </div>
                                  </>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-700 mb-2">Products</h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border rounded-lg">
                              <thead className="bg-rose-100">
                                <tr>
                                  <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">Image</th>
                                  <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">Product</th>
                                  <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">Category</th>
                                  <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">MRP</th>
                                  <th className="px-2 py-2 text-xs font-semibold text-gray-700 text-left">Quantity</th>
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
                                    <td className="px-2 py-2 text-gray-700 font-semibold text-xs sm:text-sm">₹{p.mrp || ''}</td>
                                    <td className="px-2 py-2 text-gray-700 font-semibold text-xs sm:text-sm">{p.quantity || 1}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {order.status === 'due' && (
                          <div className="flex justify-end mt-4">
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow transition"
                              onClick={() => handleMarkComplete(order._id)}
                              disabled={savingStatus[order._id]}
                            >
                              {savingStatus[order._id] ? 'Marking...' : 'Mark as Complete'}
                            </button>
                          </div>
                        )}
                      </div>
                      {/* Order Status Progress Bar */}
                      {order.status !== 'cancelled' && order.mode !== 'shop' && (
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
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders; 