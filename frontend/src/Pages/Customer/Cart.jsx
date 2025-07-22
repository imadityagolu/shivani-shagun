import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header';
import { toast } from 'react-toastify';
import { FaHeart, FaTimes } from 'react-icons/fa';

function Cart() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingWishlistId, setAddingWishlistId] = useState(null);
  const [wishlistProductIds, setWishlistProductIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchWishlistProductIds();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Login');
      return;
    }
    setLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {}
    setLoading(false);
  };

  const fetchWishlistProductIds = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setWishlistProductIds(data.map((p) => p._id));
      }
    } catch (err) {}
  };

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setRemovingId(productId);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productId));
      }
    } catch (err) {}
    setRemovingId(null);
  };

  const handleAddToWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setAddingWishlistId(productId);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/wishlist`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        toast.success('Added to wishlist!');
        setWishlistProductIds((prev) => [...prev, productId]);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to add to wishlist');
      }
    } catch (err) {
      toast.error('Failed to add to wishlist');
    }
    setAddingWishlistId(null);
  };

  const inStockProducts = products.filter(p => p.quantity && p.quantity > 0);
  const total = inStockProducts.reduce((sum, p) => sum + (Number(p.mrp) || 0), 0);
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold text-rose-500 mb-6 text-center">My Cart</h2>
        {loading ? (
          <div className="text-center py-8 text-lg">Loading...</div>
        ) : inStockProducts.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center text-3xl font-bold text-rose-500">
            No products in cart.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-rose-100">
                  <tr>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Image</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">MRP</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inStockProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-rose-50 transition">
                      <td className="px-2 py-2 sm:px-4 sm:py-3">
                        <Link to={`/sections/product/${p._id}`}>
                          {(p.image || (p.images && p.images[0])) ? (
                            <img src={`${import.meta.env.VITE_BACKEND_URL}${p.image || (p.images && p.images[0])}`} alt={p.product} className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded bg-gray-50 border" />
                          ) : (
                            <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/default-product-image.JPG`} alt="Default" className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded bg-gray-50 border" />
                          )}
                        </Link>
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 font-bold text-rose-600 text-xs sm:text-sm md:text-base">
                        <Link to={`/sections/product/${p._id}`}>{p.product || 'No Name'}</Link>
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-500 text-xs sm:text-sm md:text-base">{p.category || ''}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-500 text-xs sm:text-sm md:text-base">X 1</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-700 font-semibold text-xs sm:text-sm md:text-base">₹{p.mrp || ''}</td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 h-full align-middle">
                        <div className="flex flex-col sm:flex-row gap-2 items-center justify-center h-full">
                          <button
                            onClick={() => handleRemove(p._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-2 sm:py-1 rounded shadow text-xs font-semibold disabled:opacity-60 inline-flex items-center justify-center"
                            disabled={removingId === p._id}
                          >
                            <FaTimes className="text-base" />
                          </button>
                          {!wishlistProductIds.includes(p._id) && (
                            <button
                              onClick={() => handleAddToWishlist(p._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 sm:px-2 sm:py-1 rounded shadow text-xs font-semibold disabled:opacity-60 inline-flex items-center justify-center"
                              disabled={addingWishlistId === p._id}
                            >
                              <FaHeart className="text-base" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Total and Proceed Button */}
            <div className="flex flex-row justify-between items-center mt-8 gap-4 bg-rose-50 rounded-lg shadow px-3 py-2">
              <div className="font-bold text-base sm:text-xl text-gray-800">
                Total Amount: <span className="text-rose-600">₹{total}</span>
              </div>
              <button
                onClick={() => navigate('/Order', { state: { products: inStockProducts, total } })}
                className="px-4 py-2 sm:px-8 sm:py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow transition text-sm sm:text-lg"
              >
                Confirm Order
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart; 