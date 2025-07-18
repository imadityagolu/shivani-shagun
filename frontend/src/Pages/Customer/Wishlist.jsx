import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header';

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Login');
      return;
    }
    const fetchWishlist = async () => {
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
    fetchWishlist();
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold text-rose-500 mb-6 text-center">My Wishlist</h2>
        {loading ? (
          <div className="text-center py-8 text-lg">Loading...</div>
        ) : products.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center text-3xl font-bold text-rose-500">
            No products in wishlist.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link to={`/sections/product/${p._id}`} key={p._id} className="bg-white rounded-xl shadow-lg flex flex-col items-center p-4 hover:shadow-2xl transition cursor-pointer">
                {p.image && (
                  <img src={`${import.meta.env.VITE_BACKEND_URL}${p.image}`} alt={p.product} className="w-full h-64 object-contain rounded mb-3 bg-gray-50" />
                )}
                <h3 className="text-lg font-bold text-rose-500 mb-1 text-center w-full truncate">{p.product || 'No Name'}</h3>
                <div className="text-gray-500 text-sm mb-2 text-center w-full truncate">{p.category || ''}</div>
                <div className="text-gray-700 font-semibold mb-1">MRP: ₹{p.mrp || ''}</div>
                <div className="text-gray-600 text-xs mb-2 text-center w-full truncate">{p.description || ''}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist; 