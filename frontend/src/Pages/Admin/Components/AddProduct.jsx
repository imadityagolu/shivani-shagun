import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

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
      <form onSubmit={handleSubmit} className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-rose-500 mb-2 text-center">Add Product</h2>
        <div className="flex items-center gap-2" ref={sellerInputRef}>
          <div className="w-full relative">
            <input
              name="seller"
              value={form.seller}
              onChange={handleChange}
              onFocus={() => setShowSellerDropdown(true)}
              placeholder="Seller"
              autoComplete="off"
              className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm"
              required
            />
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
          <button type="button" onClick={() => setShowSellerPopup(true)} className="bg-rose-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold hover:bg-rose-600 transition" title="Add Seller">+</button>
        </div>
        <input name="product" value={form.product} onChange={handleChange} placeholder="Product" className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm resize-none" required />
        {/* Category select */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" min="1" className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
        <input name="rate" value={form.rate} onChange={handleChange} placeholder="Rate" type="number" min="0" step="0.01" className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
        <input name="mrp" value={form.mrp} onChange={handleChange} placeholder="MRP" type="number" min="0" step="0.01" className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
        <input name="date" value={form.date} onChange={handleChange} placeholder="Date" type="date" className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
        <input name="image" onChange={handleChange} type="file" accept="image/*" className="w-full px-5 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow-sm" required />
        <button type="submit" className="bg-rose-500 text-white rounded-lg px-6 py-3 font-semibold hover:bg-rose-600 transition mt-2">Add Product</button>
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