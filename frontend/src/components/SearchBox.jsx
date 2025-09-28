import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBox.css';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchProducts(query);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchProducts = async (searchQuery) => {
    setIsLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3210';
      const response = await fetch(`${BACKEND_URL}/api/products/search?query=${encodeURIComponent(searchQuery)}&limit=8`);
      if (response.ok) {
        const products = await response.json();
        setSuggestions(products);
        setShowDropdown(products.length > 0);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleProductSelect = (product) => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    navigate(`/product/${product._id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to AllProducts page with search query
      setQuery('');
      setSuggestions([]);
      setShowDropdown(false);
      navigate(`/AllProduct?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="search-box-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for products, categories..."
            className="search-input"
            autoComplete="off"
          />
          <button type="submit" className="search-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {isLoading && (
            <div className="search-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <div className="search-dropdown" ref={dropdownRef}>
          {suggestions.map((product) => (
            <div
              key={product._id}
              className="search-suggestion"
              onClick={() => handleProductSelect(product)}
            >
              <div className="suggestion-image">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3210'}${product.images[0]}`} 
                    alt={product.product}
                    onError={(e) => {
                      // If the product image fails to load, show the default image
                      e.target.src = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3210'}/uploads/products/default-product-image.JPG`;
                    }}
                  />
                ) : (
                  <img 
                    src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3210'}/uploads/products/default-product-image.JPG`} 
                    alt="Default product image"
                    onError={(e) => {
                      // If default image also fails, show the SVG placeholder
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                )}
                <div className="no-image" style={{ display: 'none' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#9CA3AF"/>
                  </svg>
                </div>
              </div>
              <div className="suggestion-details">
                <h4 className="suggestion-name">{product.product}</h4>
                <p className="suggestion-category">{product.category}</p>
                <div className="suggestion-price">
                  <span className="current-price">{formatPrice(product.rate)}</span>
                  {product.mrp > product.rate && (
                    <span className="original-price">{formatPrice(product.mrp)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;