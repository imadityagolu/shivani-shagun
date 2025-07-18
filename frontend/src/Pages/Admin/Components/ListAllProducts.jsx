import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaFileCsv } from 'react-icons/fa6';
import { toast } from 'react-toastify';

function ListAllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateSort, setDateSort] = useState('desc');
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({ product: '', mrp: '', description: '', quantity: '', rate: '' });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Get unique sellers and categories for filter dropdowns
  const uniqueSellers = Array.from(new Set(products.map(p => p.seller).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Filter and sort products
  let filtered = products.filter(p => {
    const matchesSearch =
      search === '' ||
      (p.product && p.product.toLowerCase().includes(search.toLowerCase())) ||
      (p.seller && p.seller.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    const matchesSeller = sellerFilter === '' || p.seller === sellerFilter;
    const matchesCategory = categoryFilter === '' || p.category === categoryFilter;
    return matchesSearch && matchesSeller && matchesCategory;
  });

  filtered = filtered.sort((a, b) => {
    // Prefer date sort if available
    if (a.date && b.date && a.date !== b.date) {
      const toNum = d => d.split('-').reverse().join('');
      if (dateSort === 'asc') {
        return toNum(a.date) > toNum(b.date) ? 1 : -1;
      } else {
        return toNum(a.date) < toNum(b.date) ? 1 : -1;
      }
    }
    // Fallback: LIFO by MongoDB _id timestamp
    if (a._id > b._id) return -1;
    if (a._id < b._id) return 1;
    return 0;
  });

  // Edit handlers
  const handleEdit = (p) => {
    setEditId(p._id);
    setEditFields({
      product: p.product || '',
      mrp: p.mrp || '',
      description: p.description || '',
      quantity: p.quantity || '',
      rate: p.rate || ''
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFields(prev => ({ ...prev, [name]: value }));
  };
  const handleEditSave = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFields)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product updated!');
        setEditId(null);
        fetchProducts();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };
  const handleEditCancel = () => setEditId(null);

  // Delete handlers
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product deleted!');
        setDeleteId(null);
        fetchProducts();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  // CSV download handler
  const handleDownloadCSV = () => {
    if (filtered.length === 0) {
      toast.info('No products to export.');
      return;
    }
    const headers = ['Seller', 'Product', 'Description', 'Category', 'Quantity', 'Rate', 'MRP', 'Date', 'Image'];
    const rows = filtered.map(p => [
      p.seller || '',
      p.product || '',
      p.description || '',
      p.category || '',
      p.quantity || '',
      p.rate || '',
      p.mrp || '',
      p.date || '',
      p.image ? `${BACKEND_URL}${p.image}` : ''
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-x-auto w-full">
      <h2 className="text-2xl font-bold text-rose-500 mb-4 text-center flex items-center justify-center gap-4">
        All Products : 
        <span className="text-base font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">{filtered.length}</span>
      </h2>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4 px-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by product, seller, or category"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/3"
        />
        <select
          value={sellerFilter}
          onChange={e => setSellerFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/4"
        >
          <option value="">All Sellers</option>
          {uniqueSellers.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/4"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={dateSort}
          onChange={e => setDateSort(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/6"
        >
          <option value="desc">Date Descending</option>
          <option value="asc">Date Ascending</option>
        </select>
        {/* CSV Download Icon */}
        <button
          onClick={handleDownloadCSV}
          className="ml-2 p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center"
          title="Download CSV"
        >
          <FaFileCsv className="w-6 h-6" />
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr className="bg-rose-100 text-rose-600">
              <th className="py-3 px-4 text-left">Seller</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Rate</th>
              <th className="py-3 px-4 text-left">MRP</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-8 text-gray-400">No products found.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} className="border-b hover:bg-rose-50">
                  <td className="py-2 px-4">{p.seller || ''}</td>
                  <td className="py-2 px-4">
                    {editId === p._id ? (
                      <input name="product" value={editFields.product} onChange={handleEditChange} className="px-2 py-1 border rounded w-28" />
                    ) : (
                      p.product || ''
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editId === p._id ? (
                      <input name="description" value={editFields.description} onChange={handleEditChange} className="px-2 py-1 border rounded w-40" />
                    ) : (
                      p.description || ''
                    )}
                  </td>
                  <td className="py-2 px-4">{p.category || ''}</td>
                  <td className="py-2 px-4">
                    {editId === p._id ? (
                      <input name="quantity" value={editFields.quantity} onChange={handleEditChange} className="px-2 py-1 border rounded w-16" />
                    ) : (
                      p.quantity || ''
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editId === p._id ? (
                      <input name="rate" value={editFields.rate} onChange={handleEditChange} className="px-2 py-1 border rounded w-16" />
                    ) : (
                      p.rate || ''
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editId === p._id ? (
                      <input name="mrp" value={editFields.mrp} onChange={handleEditChange} className="px-2 py-1 border rounded w-16" />
                    ) : (
                      p.mrp || ''
                    )}
                  </td>
                  <td className="py-2 px-4">{p.date || ''}</td>
                  <td className="py-2 px-4">
                    {p.image ? (
                      <img src={`${BACKEND_URL}${p.image}`} alt="Product" className="h-12 w-12 object-cover rounded" />
                    ) : ''}
                  </td>
                  <td className="py-2 px-4 flex gap-2 items-center">
                    {editId === p._id ? (
                      <>
                        <button onClick={() => handleEditSave(p._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Save</button>
                        <button onClick={handleEditCancel} className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700" title="Edit"><FaEdit /></button>
                        <button onClick={() => setDeleteId(p._id)} className="text-red-500 hover:text-red-700" title="Delete"><FaTrash /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {/* Delete confirmation popup */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <h3 className="text-xl font-bold text-rose-500 mb-4 text-center">Delete Product</h3>
            <p className="mb-6 text-center">Are you sure you want to delete this product?</p>
            <div className="flex justify-center gap-6">
              <button onClick={() => handleDelete(deleteId)} className="bg-rose-500 text-white px-6 py-2 rounded hover:bg-rose-600">Yes</button>
              <button onClick={() => setDeleteId(null)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListAllProducts;