import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [cartProductIds, setCartProductIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
    fetchCartProductIds();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Login');
      return;
    }
    setLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {}
    setLoading(false);
  };

  const fetchCartProductIds = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCartProductIds(data.map((p) => p._id));
      }
    } catch (err) {}
  };

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setRemovingId(productId);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (err) {}
    setRemovingId(null);
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setAddingId(productId);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/cart`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        toast.success('Added to cart!');
        setCartProductIds((prev) => [...prev, productId]);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      toast.error('Failed to add to cart');
    }
    setAddingId(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold text-rose-500 mb-6 text-center">My Wishlist</h2>
        {loading ? (
          <div className="text-center py-8 text-lg">Loading...</div>
        ) : products.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center text-3xl font-bold text-rose-500">
            No products in wishlist.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-rose-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MRP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-rose-50 transition">
                    <td className="px-4 py-3">
                      <Link to={`/product/${p._id}`}>
                        {(p.image || (p.images && p.images[0])) ? (
                          <img src={`${import.meta.env.VITE_BACKEND_URL}${p.image || (p.images && p.images[0])}`} alt={p.product} className="w-20 h-20 object-contain rounded bg-gray-50 border" />
                        ) : (
                          <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/default-product-image.JPG`} alt="Default" className="w-20 h-20 object-contain rounded bg-gray-50 border" />
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-bold text-rose-600">
                      <Link to={`/product/${p._id}`}>{p.product || 'No Name'}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category || ''}</td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">₹{p.mrp || ''}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{p.description || ''}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                        <button
                          onClick={() => handleRemove(p._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-xs font-semibold disabled:opacity-60 inline-flex items-center justify-center"
                          disabled={removingId === p._id}
                        >
                          <FaTimes className="text-base" />
                        </button>
                        {(p.quantity === 0 || p.quantity === null || p.quantity === '') ? (
                          <div className="text-red-500 font-semibold text-xs mt-1">Out of Stock</div>
                        ) : (!cartProductIds.includes(p._id) ? (
                          <button
                            onClick={() => handleAddToCart(p._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow text-xs font-semibold disabled:opacity-60 inline-flex items-center justify-center"
                            disabled={addingId === p._id}
                          >
                            {addingId === p._id ? 'Adding...' : 'Add to Cart'}
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate('/Cart')}
                            className="bg-gray-200 text-gray-400 px-3 py-1 rounded shadow text-xs font-semibold hover:bg-gray-300 inline-flex items-center justify-center"
                          >
                            <FaShoppingCart className="text-base" />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist; 