import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import banner1 from '../Images/banners/banner-1.png';
import banner2 from '../Images/banners/banner-2.png';
import banner3 from '../Images/banners/banner-3.png';

function Slideshow() {
  const heroSlides = [
    {
      title: "Elegant",
      subtitle: "Traditional Wearss",
      description: "Discover our exquisite collection of handcrafted traditional Indian clothing, designed with love and attention to detail.",
      image: banner1,
      bgColor: "from-rose-100 to-pink-200"
    },
    {
      title: "Premium",
      subtitle: "Designer Collection",
      description: "Experience luxury with our premium designer sarees, lehengas, and suits crafted by skilled artisans.",
      image: banner2,
      bgColor: "from-rose-100 to-pink-200"
    },
    {
      title: "Elegant",
      subtitle: "Traditional Wearss",
      description: "Discover our exquisite collection of handcrafted traditional Indian clothing, designed with love and attention to detail.",
      image: banner1,
      bgColor: "from-rose-100 to-pink-200"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);

  useEffect(() => {
    if (!autoSlide) return;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAnimating(false);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length, autoSlide]);

  const goToPrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 400);
    setAutoSlide(false);
  };

  const goToNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 400);
    setAutoSlide(false);
  };

  return (
    <section className={`relative bg-gradient-to-br ${heroSlides[currentSlide].bgColor} overflow-hidden transition-all duration-1000 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between">
          <div className={`flex-1 max-w-2xl transform transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              <span className="block">{heroSlides[currentSlide].title}</span>
              <span className="block text-amber-600 italic font-serif">
                {heroSlides[currentSlide].subtitle}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {heroSlides[currentSlide].description}
            </p>
            <div className="flex space-x-4">
              <Link to="/AllProduct" className="bg-amber-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-lg">
                Order now
              </Link>
              <Link to="/AllProduct" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-amber-600 hover:text-amber-600 transition-colors">
                Open catalog
              </Link>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center items-center">
            <div className={`relative transform transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0 translate-x-[20px] scale-95' : 'opacity-100 translate-x-0 scale-100'}`}>
              <div className="w-[500px] h-80 rounded-3xl transform rotate-12 shadow-2xl overflow-hidden transition-all duration-500 hover:rotate-6 hover:scale-105">
                <img 
                  src={heroSlides[currentSlide].image} 
                  alt={`${heroSlides[currentSlide].title} ${heroSlides[currentSlide].subtitle}`}
                  className={`w-full h-full object-cover transition-all duration-500 ${isAnimating ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}
                />
                <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Premium Quality
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <button
          onClick={goToPrev}
          className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110'
          aria-label='Previous'
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className='absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110'
          aria-label='Next'
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentSlide(index);
                  setIsAnimating(false);
                }, 400);
                setAutoSlide(false);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-amber-600 scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Slideshow;