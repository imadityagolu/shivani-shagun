import React, { useEffect, useState } from 'react';
import Header from './Header';
import banner1 from '../images/banners/banner-1.png';
import banner2 from '../images/banners/banner-2.png';
import leh1 from '../images/store/leh-1.mp4';
import leh2 from '../images/store/leh-2.mp4';
import sareeImg from '../images/store/saree.JPG';
import suteImg from '../images/store/sute.jpg';
import chunniImg from '../images/store/chunni.jpg';
import lehngaImg from '../images/store/lehnga.jpg';
import Footer from './Footer';
import { Link } from 'react-router-dom';

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
          className={`rounded-lg shadow-md max-h-72 w-auto object-cover transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
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
        <CategoryCircle to="/sections/lehnga" img={lehngaImg} label="Lehnga" isFirst />
        <CategoryCircle to="/sections/saree" img={sareeImg} label="Saree" />
        <CategoryCircle to="/sections/chunni" img={chunniImg} label="Chunni" />
        <CategoryCircle to="/sections/sute" img={suteImg} label="Sute" isLast />
      </div>
      <div className="flex justify-center mt-2 mb-8">
        <Link to="/sections/allproduct" className="px-6 py-2 rounded-lg bg-rose-500 text-white font-bold text-base shadow hover:bg-rose-600 transition">
          Show All Products
        </Link>
      </div>
      
      {/* Video Section Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-rose-500 text-center mt-8 mb-4">Our latest Collections</h2>
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

export default Home;