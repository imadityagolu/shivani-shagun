import React, { useEffect, useState } from 'react';

function ShowBudget() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateSort, setDateSort] = useState('desc');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem('token');
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BACKEND_URL}/api/products`)
        ]);
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        if (ordersRes.ok && Array.isArray(ordersData) && Array.isArray(productsData)) {
          setOrders(ordersData);
          setProducts(productsData);
        } else {
          setError(ordersData.message || 'Failed to fetch orders/products');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersAndProducts();
  }, []);

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  // Map productId to rate
  const productRateMap = {};
  products.forEach(p => { productRateMap[p._id] = p.rate; });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-rose-500 mb-4">Monthly Budget</h2>
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer, phone, or product name"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/2"
        />
        <select
          value={dateSort}
          onChange={e => setDateSort(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow"
          style={{ minWidth: 120 }}
        >
          <option value="desc">Newest First (LIFO)</option>
          <option value="asc">Oldest First (FIFO)</option>
        </select>
        <select
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow"
          style={{ minWidth: 120 }}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow"
          style={{ minWidth: 120 }}
        >
          <option value="">All Years</option>
          {Array.from(new Set(orders.map(o => (new Date(o.createdAt)).getFullYear()))).sort((a, b) => b - a).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <button
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition"
          onClick={() => {
            setSearch('');
            setDateSort('desc');
            setMonthFilter('');
            setYearFilter('');
          }}
        >
          Reset
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-rose-500 text-xl font-bold">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">customer</th>
                <th className="border px-2 py-1">mobile</th>
                <th className="border px-2 py-1">address</th>
                <th className="border px-2 py-1">products</th>
                <th className="border px-2 py-1">total</th>
                <th className="border px-2 py-1">paymentMethod</th>
                <th className="border px-2 py-1">mode</th>
                <th className="border px-2 py-1">status</th>
                <th className="border px-2 py-1">paid</th>
                <th className="border px-2 py-1">due</th>
                <th className="border px-2 py-1">cost</th>
                <th className="border px-2 py-1">pl</th>
                <th className="border px-2 py-1">createdAt</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .slice() // copy array to avoid mutating state
                .filter(order => {
                  // Month/year filter
                  const d = new Date(order.createdAt);
                  if (monthFilter && d.getMonth() + 1 !== Number(monthFilter)) return false;
                  if (yearFilter && d.getFullYear() !== Number(yearFilter)) return false;
                  return true;
                })
                .sort((a, b) => {
                  if (dateSort === 'asc') return new Date(a.createdAt) - new Date(b.createdAt);
                  return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .filter(order => {
                  const s = search.trim().toLowerCase();
                  if (!s) return true;
                  // Check customer name, phone, or any product name
                  const customerMatch = (order.customer || '').toLowerCase().includes(s);
                  const phoneMatch = (order.mobile || '').toLowerCase().includes(s);
                  const productMatch = order.products.some(p => (p.product || '').toLowerCase().includes(s));
                  return customerMatch || phoneMatch || productMatch;
                })
                .map((order) => {
                const totalQty = order.products.reduce((sum, p) => sum + (Number(p.quantity) || 1), 0);
                // Calculate cost: sum of (rate * quantity) for all products in the order
                const cost = order.products.reduce((sum, p) => {
                  const rate = productRateMap[p._id] || 0;
                  return sum + rate * (Number(p.quantity) || 1);
                }, 0);
                // Calculate PL: total - cost - due
                const pl = Number(order.total) - cost - Number(order.due);
                return (
                  <tr key={order._id} className="hover:bg-rose-50 transition">
                    <td className="border px-2 py-1">{order.customer || ''}</td>
                    <td className="border px-2 py-1">{order.mobile || ''}</td>
                    <td className="border px-2 py-1">{order.address || ''}</td>
                    <td className="border px-2 py-1">
                      {order.products.map((p, i) => (
                        <span key={i}>
                          {(p.product || '') + ' (' + (p.quantity || 1) + ')'}{i < order.products.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </td>
                    <td className="border px-2 py-1">{order.total !== undefined && order.total !== null ? `₹${order.total}` : ''}</td>
                    <td className="border px-2 py-1">{order.paymentMethod || ''}</td>
                    <td className="border px-2 py-1">{order.mode || ''}</td>
                    <td className="border px-2 py-1">{order.status || ''}</td>
                    <td className="border px-2 py-1">{order.paid !== undefined && order.paid !== null ? `₹${order.paid}` : ''}</td>
                    <td className="border px-2 py-1">{order.due !== undefined && order.due !== null ? `₹${order.due}` : ''}</td>
                    <td className="border px-2 py-1">{cost !== undefined && cost !== null ? `₹${cost}` : ''}</td>
                    <td className={"border px-2 py-1 font-bold " + (pl < 0 ? 'text-red-500' : 'text-green-700')}>{pl !== undefined && pl !== null ? (pl < 0 ? `-₹${Math.abs(pl)}` : `₹${pl}`) : ''}</td>
                    <td className="border px-2 py-1 whitespace-nowrap">{formatDate(order.createdAt) || ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShowBudget;