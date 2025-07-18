import React, { useEffect, useState } from 'react';
import Header from './Header';
import banner1 from '../images/banners/banner-1.png';
import banner2 from '../images/banners/banner-2.png';
import leh1 from '../images/store/leh-1.mp4';
import leh2 from '../images/store/leh-2.mp4';

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
      {/* Card Sections */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-8 py-8">
        {[1,2,3,4].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-lg flex flex-col items-center p-6 hover:shadow-2xl transition">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-rose-400">🛍️</span>
            </div>
            <h3 className="text-lg font-bold text-rose-500 mb-2">Card Title {n}</h3>
            <p className="text-gray-500 text-center text-sm">This is a short description for card section {n}. You can customize this content as needed.</p>
          </div>
        ))}
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
    </>
  );
}

export default Home;