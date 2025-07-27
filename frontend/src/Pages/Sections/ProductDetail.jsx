import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Footer from '../Footer';
import { FaStar } from 'react-icons/fa';
import { CiShoppingTag } from "react-icons/ci";

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
          <div className="text-gray-700 text-md text-red-500 font-semibold mb-1">
              
          Price: <span className="text-xs text-gray-400 line-through">₹{product.rate ? (product.rate*3) : ''}</span>
          {product.rate && product.mrp && product.rate*3 > product.mrp && (
            <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full ml-1">
              {Math.round(100 - (product.mrp / (product.rate*3)) * 100)}% OFF
            </span>
          )}
          </div>
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
          Product(s) are returnable only within 24 hours of the delivery.
        </div>
        {/* Related Products */}
        {product && (
          <RelatedProducts category={product.category} price={product.mrp} excludeId={product._id} />
        )}
      </div>
      <Footer />
    </>
  );
}

function RelatedProducts({ category, price, excludeId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          // Filter by category, price range, and exclude current product
          const minPrice = price * 0.8;
          const maxPrice = price * 1.2;
          const filtered = data.filter(p =>
            p._id !== excludeId &&
            p.category === category &&
            Number(p.mrp) >= minPrice && Number(p.mrp) <= maxPrice
          ).slice(0, 4);
          setRelated(filtered);
        } else {
          setRelated([]);
        }
      } catch {
        setRelated([]);
      }
      setLoading(false);
    };
    if (category && price && excludeId) fetchRelated();
  }, [category, price, excludeId]);

  if (loading) return <div className="text-gray-400 text-sm py-2">Loading related products...</div>;
  if (!related.length) return <div className="text-gray-400 text-sm py-2">No related products found.</div>;
  return (
    <div className="mt-8">
      <h4 className="text-md font-bold text-gray-700 mb-4">Related Products</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((p) => (
          <RelatedProductCard key={p._id} product={p} BACKEND_URL={import.meta.env.VITE_BACKEND_URL} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductCard({ product, BACKEND_URL }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : ["/uploads/products/default-product-image.JPG"];
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setImgIdx(idx => (idx + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);
  useEffect(() => { setImgIdx(0); }, [product._id]);
  
  // Check if product is new (within 7 days)
  let isNew = false;
  if (product.date) {
    const now = new Date();
    const prodDate = new Date(product.date);
    const diff = (now - prodDate) / (1000 * 60 * 60 * 24);
    isNew = diff <= 7;
  }
  return (
    <div className="relative group bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-rose-200 transition-all flex flex-col overflow-hidden">
      {isNew && (
        <span className="absolute flex gap-1 items-center top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow"><CiShoppingTag /> New</span>
      )}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative w-full aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            src={`${BACKEND_URL}${images[imgIdx]}`}
            alt={product.product}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="flex-1 flex flex-col px-4 py-3 gap-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-gray-900 truncate max-w-[70%]">{product.product || 'No Name'}</h3>
          {product.color && product.color.name && (
            <span className="flex items-center gap-1">
              <span className="inline-block w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: product.color.hex || '#ccc' }}></span>
              <span className="text-xs text-gray-500 font-medium">{product.color.name}</span>
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mb-1 truncate">{product.category || ''}</div>
        <div className="text-xs text-gray-600 mb-2 min-h-[2.2em] line-clamp-2">{product.description || ''}</div>
        <div className="items-end gap-2 mb-2">
          Price: <span className="text-xs text-gray-400 line-through">₹{product.rate ? (product.rate*3) : ''}</span>
          {product.rate && product.mrp && product.rate*3 > product.mrp && (
            <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full ml-1">
              {Math.round(100 - (product.mrp / (product.rate*3)) * 100)}% OFF
            </span>
          )}
          <br/>
          <span className="text-lg font-bold text-green-600">MRP: ₹{product.mrp || ''}</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          {[1,2,3,4,5].map(star => (
            <FaStar key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-xs text-gray-500 ml-1">{avgRating > 0 ? avgRating.toFixed(1) : 'No rating'}</span>
        </div>
        <Link to={`/product/${product._id}`} className="mt-auto w-full block">
          <button className="w-full py-2 rounded-lg bg-rose-500 text-white font-bold text-sm shadow hover:bg-rose-600 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400">View</button>
        </Link>
      </div>
    </div>
  );
}

export default ProductDetail; 