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
  const [feedback, setFeedback] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({
    averageRating: 0,
    totalFeedback: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

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

  // Fetch product feedback
  useEffect(() => {
    if (!product?._id) return;
    
    const fetchFeedback = async () => {
      setFeedbackLoading(true);
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/customer/feedback/${product._id}?page=${feedbackPage}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setFeedback(data.feedback || []);
          setFeedbackStats({
            averageRating: data.averageRating || 0,
            totalFeedback: data.totalFeedback || 0,
            ratingDistribution: data.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          });
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedback();
  }, [product?._id, feedbackPage]);

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
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            <span className="ml-4 text-lg text-gray-600">Loading product details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <div className="text-red-600 text-xl font-bold">{error}</div>
              <p className="text-red-500 mt-2">Please try again or contact support</p>
            </div>
          </div>
        ) : product ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Image Gallery Section */}
              <div className="lg:w-1/2 p-8 bg-white">
                <div className="relative group">
                  {/* Main Image Container */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-inner">
                    {(product.images && product.images.length > 0) ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${product.images[imgIdx]}`}
                        alt={product.product}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/default-product-image.JPG`}
                        alt="Default"
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    
                    {/* Navigation Arrows */}
                    {product.images && product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setImgIdx(idx => (idx - 1 + product.images.length) % product.images.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-rose-500 rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
                          aria-label="Previous image"
                        >
                          <FaChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setImgIdx(idx => (idx + 1) % product.images.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-rose-500 rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
                          aria-label="Next image"
                        >
                          <FaChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Image Indicators */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setImgIdx(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === imgIdx 
                              ? 'bg-rose-500 scale-125' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information Section */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Product Title */}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
                      {product.product}
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    {/* Category */}
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {product.category}
                      </span>
                    </div>

                    {/* Color */}
                    {product.color && product.color.name && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-md" 
                            style={{ backgroundColor: product.color.hex || '#ccc' }}
                          ></span>
                          <span className="text-gray-700 font-medium">{product.color.name}</span>
                        </div>
                        <span className="text-xs text-gray-400 italic">*Color may vary</span>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="p-6 ">
                      <div className="space-y-2">
                        {product.rate && product.mrp && product.rate*3 > product.mrp && (
                          <div className="flex items-center gap-3">
                            <span className="text-lg text-gray-500 line-through">₹{product.rate*3}</span>
                            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                              {Math.round(100 - (product.mrp / (product.rate*3)) * 100)}% OFF
                            </span>
                          </div>
                        )}
                        <div className="text-3xl font-bold text-green-600">
                          ₹{product.mrp}
                          <span className="text-lg font-normal text-gray-500 ml-2">/-</span>
                        </div>
                      </div>
                    </div>

                    {/* Stock Status */}
                    {(!product.quantity || product.quantity === 0) ? (
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-red-600">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span className="font-semibold">Out of Stock</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="font-semibold">In Stock</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      onClick={() => handleAdd('wishlist')}
                      className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                        inWishlist 
                          ? 'bg-rose-500 text-white shadow-lg hover:bg-rose-600' 
                          : 'bg-rose-50 text-rose-600 border-2 border-rose-200 hover:bg-rose-100 hover:border-rose-300'
                      }`}
                    >
                      <FaHeart className="text-xl" />
                      <span>{inWishlist ? 'View Wishlist' : 'Add to Wishlist'}</span>
                    </button>
                    
                    {(!inCart && product.quantity > 0) ? (
                      <button
                        onClick={() => handleAdd('cart')}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl"
                      >
                        <FaShoppingCart className="text-xl" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (inCart && product.quantity > 0) ? (
                      <button
                        onClick={() => navigate('/Cart')}
                        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-200 border-2 border-gray-200"
                      >
                        <FaShoppingCart className="text-xl" />
                        <span>View Cart</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="max-w-7xl mx-auto mt-4 px-4">
        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 p-4 rounded-lg shadow flex items-center gap-3">
          <span className="font-bold">Note:</span>
          Product(s) are returnable only within 24 hours of the delivery.
        </div>

        {/* Product Feedback Section */}
        {product && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mt-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              
              {/* Feedback Stats */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{feedbackStats.averageRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-lg ${star <= Math.round(feedbackStats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{feedbackStats.totalFeedback} reviews</div>
                  </div>
                  
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: feedbackStats.totalFeedback > 0 
                                ? `${(feedbackStats.ratingDistribution[rating] / feedbackStats.totalFeedback) * 100}%` 
                                : '0%'
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{feedbackStats.ratingDistribution[rating] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback List */}
              {feedbackLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                  <span className="ml-3 text-gray-600">Loading reviews...</span>
                </div>
              ) : feedback.length > 0 ? (
                <div className="space-y-6">
                  {feedback.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {review.customer?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{review.customer?.name || 'Anonymous'}</h4>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {review.images.map((image, idx) => (
                                <img
                                  key={idx}
                                  src={`${import.meta.env.VITE_BACKEND_URL}${image}`}
                                  alt={`Review image ${idx + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
                  <p className="text-gray-500">Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        )}
        
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
  const [isRandomProducts, setIsRandomProducts] = useState(false);

  // Function to shuffle array and get random items
  const getRandomProducts = (products, count = 4) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      setIsRandomProducts(false);
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          
          // First, try to filter by category, price range, and exclude current product
          const minPrice = price * 0.8;
          const maxPrice = price * 1.2;
          const priceFiltered = data.filter(p =>
            p._id !== excludeId &&
            p.category === category &&
            Number(p.mrp) >= minPrice && Number(p.mrp) <= maxPrice
          ).slice(0, 4);

          if (priceFiltered.length > 0) {
            // Found related products based on price range
            setRelated(priceFiltered);
          } else {
            // No products found in price range, get random products from same category
            const categoryProducts = data.filter(p =>
              p._id !== excludeId && p.category === category
            );
            
            if (categoryProducts.length > 0) {
              const randomProducts = getRandomProducts(categoryProducts, 4);
              setRelated(randomProducts);
              setIsRandomProducts(true);
            } else {
              // No products in same category, get random products from all categories
              const allOtherProducts = data.filter(p => p._id !== excludeId);
              if (allOtherProducts.length > 0) {
                const randomProducts = getRandomProducts(allOtherProducts, 4);
                setRelated(randomProducts);
                setIsRandomProducts(true);
              } else {
                setRelated([]);
              }
            }
          }
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
  if (!related.length) return <div className="text-gray-400 text-sm py-2">No products found.</div>;
  
  return (
    <div className="mt-8">
      <h4 className="text-md font-bold text-gray-700 mb-4">
        {isRandomProducts ? `More from ${category}` : 'Related Products'}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((p) => (
          <RelatedProductCard key={p._id} product={p} BACKEND_URL={import.meta.env.VITE_BACKEND_URL} />
        ))}
      </div>
    </div>
  );
}

function RelatedProductCard({ product, BACKEND_URL, avgRating = 0 }) {
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