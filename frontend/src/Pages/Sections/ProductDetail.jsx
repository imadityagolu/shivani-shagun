import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isCustomer = Boolean(localStorage.getItem('token'));
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);
  useEffect(() => {
    if (!isCustomer || !id) return;
    const fetchStatus = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem('token');
        const [wishlistRes, cartRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/customer/wishlist`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BACKEND_URL}/api/customer/cart`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const wishlist = await wishlistRes.json();
        const cart = await cartRes.json();
        setInWishlist(Array.isArray(wishlist) && wishlist.some(p => p._id === id));
        setInCart(Array.isArray(cart) && cart.some(p => p._id === id));
      } catch {}
    };
    fetchStatus();
  }, [isCustomer, id]);

  const handleAdd = async (type) => {
    if (!isCustomer) {
      toast.error('Login required');
      navigate('/Login');
      return;
    }
    if (type === 'wishlist' && inWishlist) {
      navigate('/Wishlist');
      return;
    }
    if (type === 'cart' && inCart) {
      navigate('/Cart');
      return;
    }
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/customer/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(type === 'wishlist' ? 'Added to wishlist!' : 'Added to cart!');
        if (type === 'wishlist') setInWishlist(true);
        if (type === 'cart') setInCart(true);
      } else {
        toast.error(data.message || 'Failed to add');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto mt-8 px-4">
        {loading ? (
          <div className="text-center py-8 text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-rose-500 text-xl font-bold">{error}</div>
        ) : product ? (
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8 items-center">
            {product.image && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}${product.image}`}
                alt={product.product}
                className="w-full max-w-xs h-80 md:max-w-2xl md:h-[32rem] object-contain rounded bg-gray-50"
              />
            )}
            <div className="flex-1 flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-rose-500 mb-2">{product.product}</h2>
              <div className="text-gray-600 text-lg mb-2">{product.description}</div>
              <div className="text-gray-500 text-base mb-1">Category: {product.category}</div>
              <div className="text-gray-700 text-md text-red-500 font-semibold mb-1">Price: ₹<span className='line-through'> {(product.rate)*3} </span></div>
              <div className="text-gray-700 text-xl text-green-500 font-semibold mb-1">MRP: ₹{product.mrp} /-</div>
              
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleAdd('wishlist')}
                  className={`bg-rose-100 text-rose-500 font-semibold px-5 py-2 rounded-lg shadow hover:bg-rose-200 transition flex items-center gap-2 ${inWishlist ? 'bg-rose-200 text-rose-700' : ''}`}
                >
                  <FaHeart className="text-lg" />
                  {inWishlist ? 'View My Wishlist' : 'Add to Wishlist'}
                </button>
                {(!inCart && product.quantity > 0) ? (
                  <button
                    onClick={() => handleAdd('cart')}
                    className={`bg-green-100 text-green-700 font-semibold px-5 py-2 rounded-lg shadow hover:bg-green-200 transition flex items-center gap-2`}
                  >
                    <FaShoppingCart className="text-lg" />
                    Add to Cart
                  </button>
                ) : (inCart && product.quantity > 0) ? (
                  <button
                    onClick={() => navigate('/Cart')}
                    className="bg-gray-200 text-gray-400 font-semibold px-5 py-2 rounded-lg shadow flex items-center gap-2 hover:bg-gray-300"
                  >
                    <FaShoppingCart className="text-lg" />
                    In Cart
                  </button>
                ) : null}
              </div>
              {(!product.quantity || product.quantity === 0) && (
                <div className="text-red-500 font-semibold mt-2 text-base">Out of Stock</div>
              )}
            </div>
          </div>
        ) : null}
      </div>
      <div className="max-w-7xl mx-auto mt-4 px-4">
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-lg shadow flex items-center gap-3">
          <span className="font-bold">Note:</span>
          Product can be returned within only <span className="font-bold">24 hours</span> of delivery, not after that.
        </div>
      </div>
    </>
  );
}

export default ProductDetail; 