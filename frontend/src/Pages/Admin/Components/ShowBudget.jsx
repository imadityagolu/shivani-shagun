import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa6';

function ShowBudget() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dateSort, setDateSort] = useState('desc');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showOnlyDue, setShowOnlyDue] = useState(false);

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

  // Helper to format date with time
  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const pad = n => n.toString().padStart(2, '0');
    let hours = d.getHours();
    const minutes = pad(d.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()} ${pad(hours)}:${minutes} ${ampm}`;
  };

  // Map productId to rate
  // products.forEach(p => { productRateMap[p._id] = p.rate; });

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
        <button
          type="button"
          className={`px-4 py-2 rounded-lg font-bold border transition shadow text-xs whitespace-nowrap ${showOnlyDue ? 'bg-red-500 text-white border-red-500' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'}`}
          onClick={() => setShowOnlyDue(v => !v)}
        >
          Due
        </button>
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
      {/* Summary Table */}
      {(() => {
        // Filtered orders (same logic as table)
        const filteredOrders = orders
          .filter(order => {
            const d = new Date(order.createdAt);
            if (monthFilter && d.getMonth() + 1 !== Number(monthFilter)) return false;
            if (yearFilter && d.getFullYear() !== Number(yearFilter)) return false;
            return true;
          })
          .filter(order => {
            if (!showOnlyDue) return true;
            return Number(order.due) > 0;
          })
          .sort((a, b) => {
            if (dateSort === 'asc') return new Date(a.createdAt) - new Date(b.createdAt);
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .filter(order => {
            const s = search.trim().toLowerCase();
            if (!s) return true;
            const customerMatch = (order.customer || '').toLowerCase().includes(s);
            const phoneMatch = (order.mobile || '').toLowerCase().includes(s);
            const productMatch = Array.isArray(order.products)
              ? order.products.some(p => (p.product || '').toLowerCase().includes(s))
              : (order.products || '').toLowerCase().includes(s);
            return customerMatch || phoneMatch || productMatch;
          });

        // XLSX download handler
        const handleDownloadXLSX = () => {
          if (filteredOrders.length === 0) return;
          // Use the same sort as the current view
          const exportOrders = [...filteredOrders];
          const headers = [
            'Customer', 'Mobile', 'Address', 'Products', 'Quantity', 'Total', 'PaymentMethod', 'Mode', 'Status', 'Paid', 'Due', 'Cost', 'Date & Time', 'P/L'
          ];
          const rows = exportOrders.map(order => {
            // Products as string
            let productsStr = '';
            if (Array.isArray(order.products)) {
              productsStr = order.products.map(p => {
                let name = '';
                if (Array.isArray(p.product)) {
                  name = p.product.join(', ');
                } else if (typeof p.product === 'string' && p.product.trim()) {
                  name = p.product;
                } else {
                  name = 'No Name';
                }
                return name + ' (' + (p.quantity || 1) + ')';
              }).join(', ');
            } else {
              productsStr = order.products + ' (' + (order.quantity || 1) + ')';
            }
            const cost = Number(order.cost) || 0;
            const pl = Number(order.total) - cost - Number(order.due);
            return [
              order.customer || '',
              order.mobile || '',
              order.address || '',
              productsStr,
              order.quantity !== undefined && order.quantity !== null ? order.quantity : '',
              order.total !== undefined && order.total !== null ? order.total : '',
              order.paymentMethod || '',
              order.mode || '',
              order.status || '',
              order.paid !== undefined && order.paid !== null ? order.paid : '',
              order.due !== undefined && order.due !== null ? order.due : '',
              order.cost !== undefined && order.cost !== null ? order.cost : '',
              formatDateTime(order.createdAt),
              pl
            ];
          });
          const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Report');
          const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'report.xlsx');
        };

        // CSV download handler
        const handleDownloadCSV = () => {
          if (filteredOrders.length === 0) return;
          // Use the same sort as the current view
          const exportOrders = [...filteredOrders];
          const headers = [
            'Customer', 'Mobile', 'Address', 'Products', 'Quantity', 'Total', 'PaymentMethod', 'Mode', 'Status', 'Paid', 'Due', 'Cost', 'Date & Time', 'P/L'
          ];
          const rows = exportOrders.map(order => {
            let productsStr = '';
            if (Array.isArray(order.products)) {
              productsStr = order.products.map(p => {
                let name = '';
                if (Array.isArray(p.product)) {
                  name = p.product.join(', ');
                } else if (typeof p.product === 'string' && p.product.trim()) {
                  name = p.product;
                } else {
                  name = 'No Name';
                }
                return name + ' (' + (p.quantity || 1) + ')';
              }).join(', ');
            } else {
              productsStr = order.products + ' (' + (order.quantity || 1) + ')';
            }
            const cost = Number(order.cost) || 0;
            const pl = Number(order.total) - cost - Number(order.due);
            return [
              order.customer || '',
              order.mobile || '',
              order.address || '',
              productsStr,
              order.quantity !== undefined && order.quantity !== null ? order.quantity : '',
              order.total !== undefined && order.total !== null ? order.total : '',
              order.paymentMethod || '',
              order.mode || '',
              order.status || '',
              order.paid !== undefined && order.paid !== null ? order.paid : '',
              order.due !== undefined && order.due !== null ? order.due : '',
              order.cost !== undefined && order.cost !== null ? order.cost : '',
              formatDateTime(order.createdAt),
              pl
            ];
          });
          const csvContent = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv' });
          saveAs(blob, 'report.csv');
        };

        // Place buttons at the right corner of the summary table
        if (filteredOrders.length === 0) return null;

        // Calculate sums for summary table
        let sumTotal = 0, sumPaid = 0, sumDue = 0, sumCost = 0, sumPL = 0, totalQuantity = 0;
        filteredOrders.forEach(order => {
          const total = Number(order.total) || 0;
          const paid = Number(order.paid) || 0;
          const due = Number(order.due) || 0;
          const cost = Number(order.cost) || 0;
          const pl = total - cost - due;
          sumTotal += total;
          sumPaid += paid;
          sumDue += due;
          sumCost += cost;
          sumPL += pl;
          
          // Calculate total quantity - simply sum the order quantity
          totalQuantity += Number(order.quantity || 0);
        });
        return (
          <div className="overflow-x-auto mb-4">
            <div className="flex flex-row items-start justify-between gap-4 w-full">
              <table className="min-w-max border text-xs md:text-sm bg-white shadow rounded">
                <thead className="bg-rose-100">
                  <tr>
                    <th className="border px-3 py-2">Total</th>
                    <th className="border px-3 py-2">Paid</th>
                    <th className="border px-3 py-2">Due</th>
                    <th className="border px-3 py-2">Cost</th>
                    <th className="border px-3 py-2">P/L</th>
                    <th className="border px-3 py-2">Orders</th>
                    <th className="border px-3 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-3 py-2 font-bold">₹{sumTotal.toLocaleString('en-IN')}</td>
                    <td className="border px-3 py-2 font-bold">₹{sumPaid.toLocaleString('en-IN')}</td>
                    <td className="border px-3 py-2 font-bold">₹{sumDue.toLocaleString('en-IN')}</td>
                    <td className="border px-3 py-2 font-bold">₹{sumCost.toLocaleString('en-IN')}</td>
                    <td className={"border px-3 py-2 font-bold " + (sumPL < 0 ? 'text-red-500' : 'text-green-700')}>{sumPL < 0 ? `-₹${Math.abs(sumPL).toLocaleString('en-IN')}` : `₹${sumPL.toLocaleString('en-IN')}`}</td>
                    <td className="border px-3 py-2 font-bold">{filteredOrders.length}</td>
                    <td className="border px-3 py-2 font-bold">{totalQuantity.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex flex-col items-end gap-2 min-w-fit">
                <button onClick={handleDownloadXLSX} className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600 transition">
                  <FaFileExcel className="w-4 h-4" /> Download XLSX
                </button>
                <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded text-xs font-semibold hover:bg-blue-600 transition">
                  <FaFileCsv className="w-4 h-4" /> Download CSV
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {loading ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-rose-500 text-xl font-bold">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-[10px]">customer</th>
                <th className="border px-2 py-1 text-[10px]">mobile</th>
                <th className="border px-2 py-1 text-[10px]">address</th>
                <th className="border px-2 py-1 text-[10px]">products</th>
                <th className="border px-2 py-1 text-[10px]">quantity</th>
                <th className="border px-2 py-1 text-[10px]">total</th>
                <th className="border px-2 py-1 text-[10px]">paymentMethod</th>
                <th className="border px-2 py-1 text-[10px]">mode</th>
                <th className="border px-2 py-1 text-[10px]">status</th>
                <th className="border px-2 py-1 text-[10px]">paid</th>
                <th className="border px-2 py-1 text-[10px]">due</th>
                <th className="border px-2 py-1 text-[10px]">cost</th>
                <th className="border px-2 py-1 text-[10px]">Date & Time</th>
                <th className="border px-2 py-1 text-[10px]">pl</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredOrders = orders
                  .slice()
                  .filter(order => {
                    const d = new Date(order.createdAt);
                    if (monthFilter && d.getMonth() + 1 !== Number(monthFilter)) return false;
                    if (yearFilter && d.getFullYear() !== Number(yearFilter)) return false;
                    return true;
                  })
                  .filter(order => {
                    if (!showOnlyDue) return true;
                    return Number(order.due) > 0;
                  })
                  .sort((a, b) => {
                    if (dateSort === 'asc') return new Date(a.createdAt) - new Date(b.createdAt);
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  })
                  .filter(order => {
                    const s = search.trim().toLowerCase();
                    if (!s) return true;
                    const customerMatch = (order.customer || '').toLowerCase().includes(s);
                    const phoneMatch = (order.mobile || '').toLowerCase().includes(s);
                    const productMatch = Array.isArray(order.products)
                      ? order.products.some(p => (p.product || '').toLowerCase().includes(s))
                      : (order.products || '').toLowerCase().includes(s);
                    return customerMatch || phoneMatch || productMatch;
                  });
                let lastMonth = null;
                let lastYear = null;
                const rows = [];
                filteredOrders.forEach((order, idx) => {
                  const d = new Date(order.createdAt);
                  const month = d.getMonth();
                  const year = d.getFullYear();
                  if (lastMonth !== month || lastYear !== year) {
                    rows.push(
                      <tr key={`month-${month}-${year}`}>
                        <td colSpan={14} className="bg-rose-50 text-rose-700 font-bold text-center text-xs py-2">
                          {d.toLocaleString('default', { month: 'long' })} {year}
                        </td>
                      </tr>
                    );
                    lastMonth = month;
                    lastYear = year;
                  }
                  const cost = Number(order.cost) || 0;
                  const pl = Number(order.total) - cost - Number(order.due);
                  rows.push(
                    <tr key={order._id} className="hover:bg-rose-50 transition">
                      <td className="border px-2 py-1 text-[10px]">{order.customer || ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{order.mobile || ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{order.address || ''}</td>
                      <td className="border px-2 py-1 text-[10px]">
                        {Array.isArray(order.products) ? (
                          order.products.map((p, i) => {
                            let name = '';
                            if (Array.isArray(p.product)) {
                              name = p.product.join(', ');
                            } else if (typeof p.product === 'string' && p.product.trim()) {
                              name = p.product;
                            } else {
                              name = 'No Name';
                            }
                            return (
                              <span key={i}>
                                {name + ' (' + (p.quantity || 1) + ')'}{i < order.products.length - 1 ? ', ' : ''}
                              </span>
                            );
                          })
                        ) : (
                          <span>
                            {order.products + ' (' + (order.quantity || 1) + ')'}
                          </span>
                        )}
                      </td>
                      <td className="border px-2 py-1 text-[10px]">{order.quantity !== undefined && order.quantity !== null ? order.quantity : ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{order.total !== undefined && order.total !== null ? `₹${order.total}` : ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{order.paymentMethod || ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{order.mode || ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{order.status || ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{order.paid !== undefined && order.paid !== null ? `₹${order.paid}` : ''}</td>
                      <td className={"border px-2 py-1 text-[10px] " + (Number(order.due) > 0 ? 'text-red-500' : '')}>{order.due !== undefined && order.due !== null ? `₹${order.due}` : ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{order.cost !== undefined && order.cost !== null ? `₹${order.cost}` : ''}</td>
                      <td className="border px-2 py-1 text-[10px]">{formatDateTime(order.createdAt)}</td>
                      <td className={"border px-2 py-1 font-bold text-[10px] " + (pl < 0 ? 'text-red-500' : 'text-green-700')}>{pl < 0 ? `-₹${Math.abs(pl)}` : `₹${pl}`}</td>
                    </tr>
                  );
                });
                return rows;
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShowBudget;