import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Footer from '../Footer';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

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

  useEffect(() => { setImgIdx(0); }, [product?._id]);
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setImgIdx(idx => (idx + 1) % product.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [product]);

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
            <div className="flex items-center mb-2">
              {product.images && product.images.length > 1 && (
                <button
                  onClick={() => setImgIdx(idx => (idx - 1 + product.images.length) % product.images.length)}
                  className="bg-transparent hover:bg-gray-200/60 text-rose-400 rounded-full p-2 transition shadow mr-2"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="w-6 h-6 text-rose-400" />
                </button>
              )}
              <div className="w-72 md:w-96 h-80 md:h-[32rem] max-w-full flex items-center justify-center bg-gray-50 rounded" style={{ minHeight: '20rem', maxHeight: '32rem' }}>
                {(product.images && product.images.length > 0) ? (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${product.images[imgIdx]}`}
                    alt={product.product}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/default-product-image.JPG`}
                    alt="Default"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <button
                  onClick={() => setImgIdx(idx => (idx + 1) % product.images.length)}
                  className="bg-transparent hover:bg-gray-200/60 text-rose-400 rounded-full p-2 transition shadow ml-2"
                  aria-label="Next image"
                >
                  <FaChevronRight className="w-6 h-6 text-rose-400" />
                </button>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-rose-500 mb-2">{product.product}</h2>
              <div className="text-gray-600 text-lg mb-2">{product.description}</div>
              {product.color && product.color.name && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: product.color.hex || '#ccc' }}></span>
                  <span className="text-sm text-gray-700 font-medium">{product.color.name}</span>
                  <span className="text-xs text-gray-400 italic ml-2">Color may vary from original</span>
                </div>
              )}
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
          Product are returnable within 24 hours of delivery.
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetail; 