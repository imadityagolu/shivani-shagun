import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaBoxOpen, FaAlignLeft, FaTags, FaSortNumericUp, FaRupeeSign, FaCalendarAlt, FaImage } from 'react-icons/fa';

function AddProduct() {
  const [form, setForm] = useState({
    seller: '',
    product: '',
    description: '',
    category: '',
    quantity: '',
    rate: '',
    mrp: '',
    date: '',
    image: null
  });
  const [showSellerPopup, setShowSellerPopup] = useState(false);
  const [sellerForm, setSellerForm] = useState({ name: '', mobile: '', address: '' });
  const [addingSeller, setAddingSeller] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [sellerSearch, setSellerSearch] = useState('');
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const sellerInputRef = useRef();

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
  }, [showSellerPopup]); // refetch after adding seller

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
    if (name === 'seller') {
      setSellerSearch(value);
      setShowSellerDropdown(true);
    }
  };

  // Helper to format yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [yyyy, mm, dd] = isoDate.split('-');
    return `${dd}-${mm}-${yyyy}`;
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

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sellerInputRef.current && !sellerInputRef.current.contains(e.target)) {
        setShowSellerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields
    for (const key in form) {
      if (!form[key]) {
        toast.error('All fields are required');
        return;
      }
    }
    if (!form.image || !form.image.name) {
      toast.error('Image is required');
      return;
    }
    try {
      // 1. Upload image to backend
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token');
      const formattedDate = formatDate(form.date);
      const imageForm = new FormData();
      imageForm.append('image', form.image);
      imageForm.append('seller', form.seller);
      imageForm.append('product', form.product);
      imageForm.append('date', formattedDate);
      const uploadRes = await fetch(`${BACKEND_URL}/api/products/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: imageForm
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        toast.error(uploadData.message || 'Image upload failed');
        return;
      }
      const imagePath = uploadData.imagePath;
      // 2. Create product with image path
      const payload = {
        ...form,
        date: formattedDate,
        image: imagePath
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
          quantity: '',
          rate: '',
          mrp: '',
          date: '',
          image: null
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
                <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow max-h-48 overflow-y-auto w-full mt-1">
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
                </ul>
              )}
            </div>
          </div>
          {/* Product Name */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaBoxOpen className="text-rose-400" /> Product</label>
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
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* Quantity */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaSortNumericUp className="text-rose-400" /> Quantity</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required min="1" />
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
          {/* Date */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaCalendarAlt className="text-rose-400" /> Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
          </div>
          {/* Image */}
          <div className="col-span-1 flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1"><FaImage className="text-rose-400" /> Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm bg-white" required />
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