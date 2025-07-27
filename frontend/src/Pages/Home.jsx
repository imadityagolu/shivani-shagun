import React, { useEffect, useState } from 'react';
import Header from './Header';
import banner1 from '../Images/banners/banner-1.png';
import banner2 from '../Images/banners/banner-2.png';
import leh1 from '../Images/store/leh-1.mp4';
import leh2 from '../Images/store/leh-2.mp4';
import sareeImg from '../Images/store/saree.JPG';
import suteImg from '../Images/store/sute.jpg';
import chunniImg from '../Images/store/chunni.jpg';
import lehngaImg from '../Images/store/lehnga.jpg';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { CiShoppingTag } from "react-icons/ci";

function Home() {
  const images = [banner1, banner2];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length, autoSlide]);

  const goToPrev = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
      setFade(true);
    }, 400);
    setAutoSlide(false);
  };

  const goToNext = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 400);
    setAutoSlide(false);
  };

  return (
    <>
      <Header />
      {/* slideshow */}
      <div className='flex justify-center items-center bg-white pt-2 pb-4 relative mx-2 sm:mx-0'>
        <button
          onClick={goToPrev}
          className='absolute left-2 sm:left-8 z-10 bg-white/70 hover:bg-white rounded-full p-2 shadow transition'
          aria-label='Previous'
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-rose-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <img
          src={images[index]}
          alt={`Banner ${index + 1}`}
          className={`rounded-lg shadow-md max-h-96 w-auto object-cover transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
        />
        <button
          onClick={goToNext}
          className='absolute right-2 sm:right-8 z-10 bg-white/70 hover:bg-white rounded-full p-2 shadow transition'
          aria-label='Next'
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-rose-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      
      {/* Category Circles */}
      <div className="flex flex-row justify-center gap-4 sm:gap-8 py-8 overflow-x-auto scrollbar-hide min-w-0 pl-0 pr-0 sm:pl-0 sm:pr-0 snap-x snap-mandatory">
        <CategoryCircle to="/Lehnga" img={lehngaImg} label="Lehnga" isFirst />
        <CategoryCircle to="/Saree" img={sareeImg} label="Saree" />
        <CategoryCircle to="/Chunni" img={chunniImg} label="Chunni" />
        <CategoryCircle to="/Sute" img={suteImg} label="Sute" isLast />
      </div>
      
      {/* Video Section Title */}
      {/* <h2 className="text-2xl sm:text-3xl font-bold text-rose-500 text-center mt-8 mb-4">Our latest Collections</h2> */}
      {/* Video Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-8 pb-8">
        {[leh1, leh2].map((src, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg flex flex-col items-center p-4">
            <video
              src={src}
              className="rounded-lg w-full h-56 md:h-96 object-cover shadow"
              autoPlay
              loop
              playsInline
              controls
              muted
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-2 mb-8">
        <Link to="/AllProduct" className="px-6 py-2 rounded-lg bg-rose-500 text-white font-bold text-base shadow hover:bg-rose-600 transition">
          Show All Products
        </Link>
      </div>
      
      {/* <h2 className="text-2xl sm:text-3xl font-bold text-rose-500 text-left mt-8 mb-4 px-35">Our latest Collections</h2> */}
      <h3 className="max-w-7xl mx-auto px-4 text-xl sm:text-2xl font-bold text-rose-500 mb-6 mt-8">Our latest Collections</h3>
      {/* Latest Products Showcase */}
      <LatestProductsShowcase />
      {/* Category-wise latest products */}
      <CategoryLatestShowcase />
      <Footer />
    </>
  );
}

function CategoryCircle({ to, img, label, isFirst, isLast }) {
  return (
    <a
      href={to}
      className={
        `flex flex-col items-center group min-w-[4.5rem] sm:min-w-[10rem] snap-center ` +
        (isFirst ? 'ml-4 ' : '') +
        (isLast ? 'mr-4 ' : '')
      }
    >
      <div className="w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-gray-100 shadow-lg flex items-center justify-center overflow-hidden border-4 border-rose-100 group-hover:border-rose-400 transition">
        <img src={img} alt={label} className="object-cover w-full h-full max-w-[3.5rem] sm:max-w-none" />
      </div>
      <span className="mt-2 text-xs sm:mt-3 sm:text-lg font-bold text-rose-500 group-hover:text-rose-700 transition">{label}</span>
    </a>
  );
}

function LatestProductsShowcase() {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({}); // { productId: avgRating }
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const latest = data.slice(0, 4);
          setProducts(latest);
          // Fetch feedbacks for each product
          latest.forEach(async (p) => {
            try {
              const fbRes = await fetch(`${BACKEND_URL}/api/product/${p._id}/feedback`);
              if (fbRes.ok) {
                const feedbacks = await fbRes.json();
                if (Array.isArray(feedbacks) && feedbacks.length > 0) {
                  const avg = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length;
                  setRatings(r => ({ ...r, [p._id]: avg }));
                } else {
                  setRatings(r => ({ ...r, [p._id]: 0 }));
                }
              } else {
                setRatings(r => ({ ...r, [p._id]: 0 }));
              }
            } catch {
              setRatings(r => ({ ...r, [p._id]: 0 }));
            }
          });
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-8 text-lg">Loading latest products...</div>;
  if (!products.length) return <div className="text-center py-8 text-lg text-rose-500">No products to show.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCardWithRating key={p._id} product={p} BACKEND_URL={BACKEND_URL} avgRating={ratings[p._id] || 0} />
        ))}
      </div>
    </div>
  );
}

function CategoryLatestShowcase() {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({}); // { productId: avgRating }
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const categories = [
    { key: 'saree', label: 'Sarees' },
    { key: 'lehnga', label: 'Lehngas' },
    { key: 'chunni', label: 'Chunnis' },
    { key: 'sute', label: 'Sutes' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          // Fetch feedbacks for each product
          data.forEach(async (p) => {
            try {
              const fbRes = await fetch(`${BACKEND_URL}/api/product/${p._id}/feedback`);
              if (fbRes.ok) {
                const feedbacks = await fbRes.json();
                if (Array.isArray(feedbacks) && feedbacks.length > 0) {
                  const avg = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length;
                  setRatings(r => ({ ...r, [p._id]: avg }));
                } else {
                  setRatings(r => ({ ...r, [p._id]: 0 }));
                }
              } else {
                setRatings(r => ({ ...r, [p._id]: 0 }));
              }
            } catch {
              setRatings(r => ({ ...r, [p._id]: 0 }));
            }
          });
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-8 text-lg">Loading category products...</div>;
  if (!products.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 mb-12">
      {categories.map(cat => {
        const catProducts = products
          .filter(p => (p.category || '').toLowerCase() === cat.key)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4);
        if (!catProducts.length) return null;
        return (
          <div key={cat.key} className="mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-rose-500 mb-6 mt-8">Latest {cat.label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {catProducts.map((p) => (
                <ProductCardWithRating key={p._id} product={p} BACKEND_URL={BACKEND_URL} avgRating={ratings[p._id] || 0} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
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
      {/* New badge */}
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

export default Home;