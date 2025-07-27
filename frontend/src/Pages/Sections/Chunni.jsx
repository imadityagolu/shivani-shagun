import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { CiShoppingTag } from "react-icons/ci";

function Chunni() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PRODUCTS_PER_PAGE = 32;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const filtered = data.filter(p => (p.category || '').toLowerCase() === 'chunni');
          setProducts(filtered);
        }
      } catch (err) {}
      setLoading(false);
    };
    fetchProducts();
  }, []);

  let filtered = products.filter(p => {
    const matchesSearch =
      search === '' ||
      (p.product && p.product.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });
  filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePage = (n) => setPage(n);
  useEffect(() => { setPage(1); }, [search, products]);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold text-rose-500 mb-6 text-center">Chunnis</h2>
        <div className="flex flex-row items-center mb-6 px-2 w-full">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chunni..."
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full"
          />
        </div>
        {loading ? (
          <div className="text-center py-8 text-lg">Loading...</div>
        ) : paginated.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center text-3xl font-bold text-rose-500">
            No Chunni to Show.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {paginated.map((p) => (
              <ProductCardWithRating key={p._id} product={p} BACKEND_URL={BACKEND_URL} avgRating={ratings[p._id] || 0} />
            ))}
          </div>
        )}
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-0.5 mt-8" style={{marginTop: '2rem'}}>
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-1.5 py-0.5 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePage(i + 1)}
                className={`px-1.5 py-0.5 text-xs rounded ${page === i + 1 ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-1.5 py-0.5 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

function ProductCardWithRating({ product, BACKEND_URL, avgRating }) {
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

export default Chunni; 