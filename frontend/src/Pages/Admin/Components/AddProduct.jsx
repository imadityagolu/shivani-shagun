import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaBoxOpen, FaAlignLeft, FaTags, FaSortNumericUp, FaRupeeSign, FaImage, FaPalette, FaChevronDown } from 'react-icons/fa';

function AddProduct() {
  const [form, setForm] = useState({
    seller: '',
    product: '',
    description: '',
    category: '',
    color: { name: '', hex: '' },
    quantity: '',
    rate: '',
    mrp: '',
    images: []
  });
  const [showSellerPopup, setShowSellerPopup] = useState(false);
  const [sellerForm, setSellerForm] = useState({ name: '', mobile: '', address: '' });
  const [addingSeller, setAddingSeller] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellerSearch, setSellerSearch] = useState('');
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const sellerInputRef = useRef();

  // Predefined colors categorized by spectrum
  const colorCategories = {
    'Reds & Pinks': [
      { name: 'Red', hex: '#FF0000' },
      { name: 'Pink', hex: '#FFC0CB' },
      { name: 'Maroon', hex: '#800000' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Coral', hex: '#FF7F50' },
      { name: 'Rose', hex: '#FF007F' },
      { name: 'Crimson', hex: '#DC143C' },
      { name: 'Salmon', hex: '#FA8072' },
      { name: 'Ruby', hex: '#E0115F' },
      { name: 'Cherry', hex: '#990000' },
      { name: 'Blush', hex: '#FFB6C1' },
      { name: 'Fuchsia', hex: '#FF00FF' }
    ],
    'Blues & Purples': [
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Purple', hex: '#800080' },
      { name: 'Violet', hex: '#EE82EE' },
      { name: 'Indigo', hex: '#4B0082' },
      { name: 'Lavender', hex: '#E6E6FA' },
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Cobalt', hex: '#0047AB' },
      { name: 'Periwinkle', hex: '#CCCCFF' },
      { name: 'Plum', hex: '#8B4513' },
      { name: 'Orchid', hex: '#DA70D6' },
      { name: 'Slate Blue', hex: '#6A5ACD' },
      { name: 'Steel Blue', hex: '#4682B4' }
    ],
    'Greens & Teals': [
      { name: 'Green', hex: '#008000' },
      { name: 'Teal', hex: '#008080' },
      { name: 'Turquoise', hex: '#40E0D0' },
      { name: 'Lime', hex: '#00FF00' },
      { name: 'Olive', hex: '#808000' },
      { name: 'Sage', hex: '#9CAF88' },
      { name: 'Emerald', hex: '#50C878' },
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Mint', hex: '#98FF98' },
      { name: 'Sea Green', hex: '#2E8B57' },
      { name: 'Jade', hex: '#00A36C' },
      { name: 'Hunter Green', hex: '#355E35' },
      { name: 'Kelly Green', hex: '#4CBB17' },
      { name: 'Spring Green', hex: '#00FF7F' },
      { name: 'Chartreuse', hex: '#7FFF00' }
    ],
    'Yellows & Oranges': [
      { name: 'Yellow', hex: '#FFFF00' },
      { name: 'Orange', hex: '#FFA500' },
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Amber', hex: '#FFBF00' },
      { name: 'Peach', hex: '#FFCBA4' },
      { name: 'Lemon', hex: '#FFF700' },
      { name: 'Canary', hex: '#FFFF99' },
      { name: 'Tangerine', hex: '#FFA500' },
      { name: 'Apricot', hex: '#FFB347' },
      { name: 'Mango', hex: '#FF8243' },
      { name: 'Honey', hex: '#FDB347' },
      { name: 'Marigold', hex: '#FFA500' },
      { name: 'Sunset', hex: '#FD5E53' },
      { name: 'Pumpkin', hex: '#FF7518' }
    ],
    'Neutrals': [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#808080' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Beige', hex: '#F5F5DC' },
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Pearl', hex: '#F0EAD6' },
      { name: 'Aluminum', hex: '#C0C0C0' },
      { name: 'Platinum', hex: '#E5E4E2' },
      { name: 'Smoke', hex: '#848884' },
      { name: 'Ash', hex: '#B2BEB5' }
    ],
    'Bright & Vibrant': [
      { name: 'Magenta', hex: '#FF00FF' },
      { name: 'Cyan', hex: '#00FFFF' },
      { name: 'Neon Green', hex: '#39FF14' },
      { name: 'Hot Pink', hex: '#FF69B4' },
      { name: 'Electric Blue', hex: '#7DF9FF' },
      { name: 'Neon Yellow', hex: '#FFFF00' },
      { name: 'Electric Purple', hex: '#BF00FF' },
      { name: 'Neon Orange', hex: '#FF6B35' },
      { name: 'Electric Green', hex: '#00FF00' },
      { name: 'Neon Pink', hex: '#FF1493' },
      { name: 'Electric Red', hex: '#FF0000' },
      { name: 'Neon Blue', hex: '#00FFFF' },
      { name: 'Fluorescent Yellow', hex: '#CCFF00' },
      { name: 'Electric Lime', hex: '#00FF00' }
    ],
    'Earthy Tones': [
      { name: 'Brown', hex: '#A52A2A' },
      { name: 'Khaki', hex: '#C3B091' },
      { name: 'Moss', hex: '#8A9A5B' },
      { name: 'Taupe', hex: '#483C32' },
      { name: 'Terracotta', hex: '#E2725B' },
      { name: 'Sienna', hex: '#A0522D' },
      { name: 'Umber', hex: '#635147' },
      { name: 'Ochre', hex: '#CC7722' },
      { name: 'Sepia', hex: '#704214' },
      { name: 'Rust', hex: '#B7410E' },
      { name: 'Copper', hex: '#B87333' },
      { name: 'Bronze', hex: '#CD7F32' },
      { name: 'Sand', hex: '#F4A460' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Fawn', hex: '#E5AA70' }
    ]
  };

  useEffect(() => {
    // Fetch sellers on mount
    const fetchSellers = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/sellers`);
        const data = await res.json();
        if (Array.isArray(data)) setSellers(data);
      } catch (err) {
        // ignore
      }
    };
    fetchSellers();
    // Fetch categories from products
    const fetchCategories = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const unique = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
          setCategories(unique);
        }
      } catch (err) {}
    };
    fetchCategories();
    const fetchProducts = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${BACKEND_URL}/api/products`);
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {}
    };
    fetchProducts();
  }, [showSellerPopup]); // refetch after adding seller

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && name === 'images') {
      // Convert FileList to Array and add to existing images
      const newImages = Array.from(files);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
    if (name === 'seller') {
      setSellerSearch(value);
      setShowSellerDropdown(true);
    }
  };

  // Helper to get current date in dd/mm/yyyy format
  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSellerInput = (e) => {
    const { name, value } = e.target;
    setSellerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSeller = async (e) => {
    e.preventDefault();
    if (!sellerForm.name) {
      toast.error('Seller name is required');
      return;
    }
    setAddingSeller(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/sellers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sellerForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Seller added!');
        setForm((prev) => ({ ...prev, seller: sellerForm.name }));
        setShowSellerPopup(false);
        setSellerForm({ name: '', mobile: '', address: '' });
      } else {
        toast.error(data.message || 'Failed to add seller');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setAddingSeller(false);
    }
  };

  // Filter sellers by search
  const filteredSellers = sellers.filter(s =>
    s.name.toLowerCase().includes(sellerSearch.toLowerCase())
  );

  // Handle seller select
  const handleSelectSeller = (name) => {
    setForm((prev) => ({ ...prev, seller: name }));
    setSellerSearch(name);
    setShowSellerDropdown(false);
  };

  // Handle color select
  const handleSelectColor = (colorName, colorHex) => {
    setForm((prev) => ({ ...prev, color: { name: colorName, hex: colorHex } }));
    setShowColorDropdown(false);
  };

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sellerInputRef.current && !sellerInputRef.current.contains(e.target)) {
        setShowSellerDropdown(false);
      }
      // Close color dropdown when clicking outside
      if (!e.target.closest('.color-dropdown-container')) {
        setShowColorDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields except date (which will be auto-generated)
    const requiredFields = ['seller', 'product', 'description', 'category', 'quantity', 'rate', 'mrp'];
    for (const key of requiredFields) {
      if (!form[key]) {
        toast.error('All fields are required');
        return;
      }
    }
    // Validate color separately
    if (!form.color.name || !form.color.hex) {
      toast.error('Color is required');
      return;
    }
    if (!form.images || form.images.length === 0) {
      toast.error('At least one image is required');
      return;
    }
    try {
      // 1. Upload all images to backend
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const currentDate = getCurrentDate();
      const uploadedImagePaths = [];

      // Upload each image
      for (let i = 0; i < form.images.length; i++) {
        const imageForm = new FormData();
        imageForm.append('image', form.images[i]);
        imageForm.append('seller', form.seller);
        imageForm.append('product', form.product);
        imageForm.append('date', currentDate);
        imageForm.append('index', i); // Add index for multiple images

        const uploadRes = await fetch(`${BACKEND_URL}/api/products/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: imageForm
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          toast.error(uploadData.message || `Image ${i + 1} upload failed`);
          return;
        }
        uploadedImagePaths.push(uploadData.imagePath);
      }

      // 2. Create product with image paths
      const payload = {
        ...form,
        date: currentDate,
        images: uploadedImagePaths
      };
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product added successfully!');
        setForm({
          seller: '',
          product: '',
          description: '',
          category: '',
          color: { name: '', hex: '' },
          quantity: '',
          rate: '',
          mrp: '',
          images: []
        });
        setSellerSearch('');
      } else {
        toast.error(data.message || 'Failed to add product');
      }
    } catch (err) {
      toast.error('Error uploading image or saving product');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-3xl w-full mx-auto bg-white/60 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-rose-500 mb-2 text-center tracking-wide drop-shadow">Add Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Seller input with icon and add button */}
          <div className="col-span-1 flex flex-col gap-2" ref={sellerInputRef}>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaUser className="text-rose-400" /> Seller</label>
            <div className="w-full relative flex items-center gap-2">
              <input
                name="seller"
                value={form.seller}
                onChange={handleChange}
                onFocus={() => setShowSellerDropdown(true)}
                placeholder="Seller"
                autoComplete="off"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm"
                required
              />
              <button type="button" onClick={() => setShowSellerPopup(true)} className="bg-rose-500 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold hover:bg-rose-600 transition" title="Add Seller">+</button>
              {showSellerDropdown && filteredSellers.length > 0 && (
                <ul className="absolute left-0 right-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto w-full mt-2">
                  <li className="px-4 py-2 text-xs text-gray-500 font-semibold bg-gray-50 sticky top-0">Sellers</li>
                  {filteredSellers.map((s) => (
                    <li
                      key={s._id}
                      className="px-4 py-2 hover:bg-rose-100 cursor-pointer"
                      onClick={() => handleSelectSeller(s.name)}
                    >
                      {s.name}
                      {s.mobile ? <span className="text-xs text-gray-400 ml-2">({s.mobile})</span> : null}
                    </li>
                  ))}
                  {filteredSellers.length === 0 && (
                    <li className="px-4 py-2 text-gray-400 text-sm">No sellers found.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
          {/* Product Name */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaBoxOpen className="text-rose-400" /> Product Name</label>
            <input name="product" value={form.product} onChange={handleChange} placeholder="Product" className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
          </div>
          {/* Description */}
          <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaAlignLeft className="text-rose-400" /> Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm resize-none" required />
          </div>
          {/* Category */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaTags className="text-rose-400" /> Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm"
              required
            >
              <option value="">Select Category</option>
              <option value="Saree">Saree</option>
              <option value="Lehnga">Lehnga</option>
              <option value="Chunni">Chunni</option>
              <option value="Sute">Sute</option>
              <option value="Others">Others</option>
              {categories.filter(c => !['Lehnga', 'Saree', 'Chunni', 'Sute', 'Others'].includes(c)).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {/* Color */}
          <div className="col-span-1 flex flex-col gap-2 color-dropdown-container">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaPalette className="text-rose-400" /> Color</label>
            <div className="flex gap-2">
              <input 
                name="color" 
                value={form.color.name} 
                onChange={(e) => setForm(prev => ({ ...prev, color: { ...prev.color, name: e.target.value } }))}
                placeholder="e.g., Red, Blue, Pink, etc." 
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowColorDropdown(!showColorDropdown)}
                className="px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 transition flex items-center gap-1"
                title="Choose from predefined colors"
              >
                <FaPalette className="w-4 h-4" />
                <FaChevronDown className="w-3 h-3" />
              </button>
            </div>
            {showColorDropdown && (
              <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto w-full mt-1 max-w-md">
                <div className="p-3">
                  {Object.entries(colorCategories).map(([category, colors]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 px-1">{category}</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => handleSelectColor(color.name, color.hex)}
                            className="px-3 py-2 text-sm hover:bg-rose-100 rounded text-left transition-colors flex items-center gap-2"
                            style={{ backgroundColor: color.hex, color: ['White', 'Cream', 'Beige', 'Lavender', 'Peach', 'Khaki', 'Moss', 'Taupe', 'Terracotta', 'Ivory', 'Pearl', 'Canary', 'Lemon', 'Mint', 'Blush', 'Apricot', 'Honey', 'Sand', 'Camel', 'Fawn', 'Aluminum', 'Platinum', 'Ash', 'Neon Yellow', 'Fluorescent Yellow'].includes(color.name) ? '#000' : '#fff' }}
                          >
                            <div 
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            ></div>
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Rate */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaRupeeSign className="text-rose-400" /> Rate (cost price)</label>
            <input type="number" name="rate" value={form.rate} onChange={handleChange} placeholder="Rate" className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required min="1" />
          </div>
          {/* MRP */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaRupeeSign className="text-rose-400" /> MRP (selling price)</label>
            <input type="number" name="mrp" value={form.mrp} onChange={handleChange} placeholder="MRP" className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required min="1" />
          </div>
          {/* Quantity */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaSortNumericUp className="text-rose-400" /> Quantity</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required min="1" />
          </div>

          {/* Images */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaImage className="text-rose-400" /> Images</label>
            <input 
              type="file" 
              name="images" 
              accept="image/*" 
              multiple
              onChange={handleChange} 
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm bg-white" 
              required 
            />
            {form.images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Selected images ({form.images.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`} 
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="mt-4 w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-lg text-lg transition">Add Product</button>
      </form>
      {/* Seller Popup */}
      {showSellerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button onClick={() => setShowSellerPopup(false)} className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-rose-500">&times;</button>
            <h3 className="text-xl font-bold text-rose-500 mb-4 text-center">Add Seller</h3>
            <form onSubmit={handleAddSeller} className="flex flex-col gap-4">
              <input name="name" value={sellerForm.name} onChange={handleSellerInput} placeholder="Seller Name" className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
              <input name="mobile" value={sellerForm.mobile} onChange={handleSellerInput} placeholder="Mobile Number (optional)" className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" />
              <input name="address" value={sellerForm.address} onChange={handleSellerInput} placeholder="Address (optional)" className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" />
              <button type="submit" className="bg-rose-500 text-white rounded-lg px-6 py-3 font-semibold hover:bg-rose-600 transition mt-2" disabled={addingSeller}>{addingSeller ? 'Adding...' : 'Add Seller'}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddProduct;

// Tailwind input style
// .input { @apply px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow; }