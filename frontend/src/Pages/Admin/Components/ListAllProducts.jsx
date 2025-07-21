import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPalette, FaChevronDown } from 'react-icons/fa';
import { FaFileCsv, FaFileExcel } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function ListAllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateSort, setDateSort] = useState('desc');
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({ product: '', mrp: '', description: '', quantity: '', rate: '', color: { name: '', hex: '' } });
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [sellerSearch, setSellerSearch] = useState('');
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  // Add state for image preview popup
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [popupImages, setPopupImages] = useState([]);

  // Predefined colors categorized by spectrum (same as AddProduct)
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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
    fetchSellers();
    // eslint-disable-next-line
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/sellers`);
      const data = await res.json();
      if (Array.isArray(data)) setSellers(data);
    } catch (err) {
      // ignore
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Get unique sellers and categories for filter dropdowns
  const uniqueSellers = Array.from(new Set(products.map(p => p.seller).filter(Boolean)));
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Filter and sort products
  let filtered = products.filter(p => {
    const matchesSearch =
      search === '' ||
      (p.product && p.product.toLowerCase().includes(search.toLowerCase())) ||
      (p.seller && p.seller.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    const matchesSeller = sellerFilter === '' || p.seller === sellerFilter;
    const matchesCategory = categoryFilter === '' || p.category === categoryFilter;
    return matchesSearch && matchesSeller && matchesCategory;
  });

  filtered = filtered.sort((a, b) => {
    // LIFO order by default - most recent first
    // Use MongoDB _id for LIFO (newest documents have higher _id values)
    if (a._id > b._id) return -1;
    if (a._id < b._id) return 1;
    return 0;
  });

  // Edit handlers
  const handleEdit = (p) => {
    setEditingProduct(p);
    setEditFields({
      product: p.product || '',
      mrp: p.mrp || '',
      description: p.description || '',
      quantity: p.quantity || '',
      rate: p.rate || '',
      color: p.color || { name: '', hex: '' },
      seller: p.seller || '',
      category: p.category || ''
    });
    setNewImages([]);
    setRemovedImages([]);
    setShowEditPopup(true);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'colorName') {
      setEditFields(prev => ({ ...prev, color: { ...prev.color, name: value } }));
    } else if (name === 'colorHex') {
      setEditFields(prev => ({ ...prev, color: { ...prev.color, hex: value } }));
    } else {
      setEditFields(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleEditSave = async () => {
    if (!editingProduct) return;
    
    try {
      // Prepare form data for image uploads
      const formData = new FormData();
      
      // Add basic product data
      Object.keys(editFields).forEach(key => {
        if (key === 'color') {
          formData.append(key, JSON.stringify(editFields[key]));
        } else {
          formData.append(key, editFields[key]);
        }
      });
      
      // Add new images
      newImages.forEach((image, index) => {
        formData.append('images', image);
      });
      
      // Add removed images info
      if (removedImages.length > 0) {
        formData.append('removedImages', JSON.stringify(removedImages));
      }
      
      const res = await fetch(`${BACKEND_URL}/api/products/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product updated!');
        setShowEditPopup(false);
        setEditingProduct(null);
        setNewImages([]);
        setRemovedImages([]);
        fetchProducts();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };
  
  const handleEditCancel = () => {
    setShowEditPopup(false);
    setEditingProduct(null);
    setEditId(null);
    setNewImages([]);
    setRemovedImages([]);
    setShowColorDropdown(false);
  };

  // Color selection handler
  const handleSelectColor = (colorName, colorHex) => {
    setEditFields(prev => ({ ...prev, color: { name: colorName, hex: colorHex } }));
    setShowColorDropdown(false);
  };

  // Image management functions
  const handleImageRemove = (imageIndex) => {
    const imageToRemove = editingProduct.images[imageIndex];
    setRemovedImages(prev => [...prev, imageToRemove]);
  };

  const handleImageRestore = (imageIndex) => {
    const imageToRestore = editingProduct.images[imageIndex];
    setRemovedImages(prev => prev.filter(img => img !== imageToRestore));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleNewImageRemove = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Delete handlers
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product deleted!');
        setDeleteId(null);
        fetchProducts();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  // XLSX download handler
  const handleDownloadXLSX = () => {
    if (filtered.length === 0) {
      toast.info('No products to export.');
      return;
    }
    const headers = ['Seller', 'Product', 'Description', 'Category', 'Color Name', 'Color Hex', 'Quantity', 'Rate', 'MRP', 'Date', 'Images'];
    const rows = filtered.map(p => [
      p.seller || '',
      p.product || '',
      p.description || '',
      p.category || '',
      p.color?.name || '',
      p.color?.hex || '',
      p.quantity || '',
      p.rate || '',
      p.mrp || '',
      p.date || '',
      p.images ? p.images.map(img => `${BACKEND_URL}${img}`).join('; ') : ''
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'products.xlsx');
  };

  // CSV download handler
  const handleDownloadCSV = () => {
    if (filtered.length === 0) {
      toast.info('No products to export.');
      return;
    }
    const headers = ['Seller', 'Product', 'Description', 'Category', 'Color Name', 'Color Hex', 'Quantity', 'Rate', 'MRP', 'Date', 'Images'];
    const rows = filtered.map(p => [
      p.seller || '',
      p.product || '',
      p.description || '',
      p.category || '',
      p.color?.name || '',
      p.color?.hex || '',
      p.quantity || '',
      p.rate || '',
      p.mrp || '',
      p.date || '',
      p.images ? p.images.map(img => `${BACKEND_URL}${img}`).join('; ') : ''
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to truncate description to 5 words
  const truncateDescription = (desc) => {
    if (!desc) return '';
    const words = desc.split(' ');
    return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : desc;
  };

  const filteredSellers = sellers.filter(s =>
    s.name.toLowerCase().includes(sellerSearch.toLowerCase())
  );
  const handleSelectSeller = (name) => {
    setEditFields(prev => ({ ...prev, seller: name }));
    setSellerSearch(name);
    setShowSellerDropdown(false);
  };

  // Add a click outside handler to close the dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.seller-dropdown-container')) {
        setShowSellerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="overflow-x-auto w-full">
      <h2 className="text-2xl font-bold text-rose-500 mb-4 text-center flex items-center justify-center gap-4">
        All Products : 
        <span className="text-base font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">{filtered.length}</span>
      </h2>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4 px-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by product, seller, or category"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/3"
        />
        <select
          value={sellerFilter}
          onChange={e => setSellerFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/4"
        >
          <option value="">All Sellers</option>
          {uniqueSellers.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/4"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={dateSort}
          onChange={e => setDateSort(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-700 shadow w-full sm:w-1/6"
        >
          <option value="desc">Newest First (LIFO)</option>
          <option value="asc">Oldest First (FIFO)</option>
        </select>
        {/* CSV Download Icon */}
        <button
          onClick={handleDownloadCSV}
          className="ml-2 p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center"
          title="Download CSV"
        >
          <FaFileCsv className="w-6 h-6" />
        </button>
        {/* XLSX Download Icon */}
        <button
          onClick={handleDownloadXLSX}
          className="ml-2 p-2 rounded-full bg-lime-100 hover:bg-lime-200 text-lime-700 flex items-center justify-center"
          title="Download Excel"
        >
          <FaFileExcel className="w-6 h-6" />
        </button>
      </div>
      {loading ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : (
        <table className="min-w-full bg-white rounded-xl shadow-lg text-xs">
          <thead>
            <tr className="bg-rose-100 text-rose-600">
              <th className="py-2 px-2 text-left text-xs">Seller</th>
              <th className="py-2 px-2 text-left text-xs">Product Name</th>
              <th className="py-2 px-2 text-left text-xs">Category</th>
              <th className="py-2 px-2 text-left text-xs">Color</th>
              <th className="py-2 px-2 text-left text-xs">Qty</th>
              <th className="py-2 px-2 text-left text-xs">Rate</th>
              <th className="py-2 px-2 text-left text-xs">MRP</th>
              <th className="py-2 px-2 text-left text-xs">Date</th>
              <th className="py-2 px-2 text-left text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={12} className="text-center py-8 text-gray-400">No products found.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} className="border-b hover:bg-rose-50">
                  <td className="py-1 px-2 text-xs">{p.seller || ''}</td>
                  <td className="py-1 px-2 text-xs">
                    {p.product || ''}
                  </td>
                  <td className="py-1 px-2 text-xs">{p.category || ''}</td>
                  <td className="py-1 px-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded border border-gray-300"
                        style={{ backgroundColor: p.color?.hex || '#ccc' }}
                      ></div>
                      <span className="text-xs">{p.color?.name || ''}</span>
                    </div>
                  </td>
                  <td className="py-1 px-2 text-xs">
                    {p.quantity || ''}
                  </td>
                  <td className="py-1 px-2 text-xs">
                    {p.rate || ''}
                  </td>
                  <td className="py-1 px-2 text-xs">
                    {p.mrp || ''}
                  </td>
                  <td className="py-1 px-2 text-xs">{p.date || ''}</td>
                  <td className="py-1 px-2 text-xs flex gap-1 items-center">
                    <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700" title="Edit"><FaEdit className="w-3 h-3" /></button>
                    <button onClick={() => setDeleteId(p._id)} className="text-red-500 hover:text-red-700" title="Delete"><FaTrash className="w-3 h-3" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      
      {/* Edit Product Popup */}
      {showEditPopup && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={handleEditCancel}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
            
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Edit Product</h3>
              <p className="text-sm text-gray-600">Update product information</p>
            </div>
            
            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
              {/* Product Images Management */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
                
                {/* Current Images */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">Current Images:</p>
                    <div className="flex gap-2 flex-wrap">
                      {editingProduct.images.map((image, index) => {
                        const isRemoved = removedImages.includes(image);
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={`${BACKEND_URL}${image}`}
                              alt={`Product ${index + 1}`}
                              className={`h-16 w-16 object-cover rounded-lg border-2 shadow-sm transition-all ${
                                isRemoved
                                  ? 'border-red-300 opacity-50'
                                  : 'border-gray-200 hover:border-rose-300'
                              } cursor-pointer`}
                              onClick={() => {
                                setPopupImages(editingProduct.images.filter(img => !removedImages.includes(img)));
                                setShowImagePopup(true);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => isRemoved ? handleImageRestore(index) : handleImageRemove(index)}
                              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold transition-all ${
                                isRemoved
                                  ? 'bg-green-500 text-white hover:bg-green-600'
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              {isRemoved ? '↻' : '×'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* New Images Preview */}
                {newImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">New Images:</p>
                    <div className="flex gap-2 flex-wrap">
                      {newImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt={`New ${index + 1}`} 
                            className="h-16 w-16 object-cover rounded-lg border-2 border-green-200 shadow-sm" 
                          />
                          <button
                            type="button"
                            onClick={() => handleNewImageRemove(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-all"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add New Images */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Add More Images:</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
              
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="product"
                  value={editFields.product}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={editFields.description}
                  onChange={handleEditChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none text-sm"
                  placeholder="Enter product description"
                  required
                />
              </div>
              
              {/* Category and Seller */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editFields.category || editingProduct.category || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Lehnga">Lehnga</option>
                    <option value="Saree">Saree</option>
                    <option value="Chunni">Chunni</option>
                    <option value="Sute">Sute</option>
                    <option value="Others">Others</option>
                    {uniqueCategories.filter(c => !['Lehnga', 'Saree', 'Chunni', 'Sute', 'Others'].includes(c)).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Seller
                  </label>
                  <div className="relative seller-dropdown-container">
                    <input
                      type="text"
                      name="seller"
                      value={editFields.seller}
                      onChange={e => {
                        handleEditChange(e);
                        setSellerSearch(e.target.value);
                        setShowSellerDropdown(true);
                      }}
                      onFocus={() => setShowSellerDropdown(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                      placeholder="Enter or select seller name"
                      autoComplete="off"
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
                </div>
              </div>
              
              {/* Color Information */}
              <div className="color-dropdown-container">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    name="colorName"
                    value={editFields.color.name}
                    onChange={handleEditChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                    placeholder="e.g., Red, Blue, Green"
                  />
                  <button
                    type="button"
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                    className="px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 transition flex items-center gap-1 text-sm"
                    title="Choose from predefined colors"
                  >
                    <FaPalette className="w-4 h-4" />
                    <FaChevronDown className="w-3 h-3" />
                  </button>
                  <div 
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: editFields.color.hex || '#ccc' }}
                  ></div>
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
                                style={{ 
                                  backgroundColor: color.hex, 
                                  color: ['White', 'Cream', 'Beige', 'Lavender', 'Peach', 'Khaki', 'Moss', 'Taupe', 'Terracotta', 'Ivory', 'Pearl', 'Canary', 'Lemon', 'Mint', 'Blush', 'Apricot', 'Honey', 'Sand', 'Camel', 'Fawn', 'Aluminum', 'Platinum', 'Ash', 'Neon Yellow', 'Fluorescent Yellow'].includes(color.name) ? '#000' : '#fff' 
                                }}
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
              
              {/* Pricing Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={editFields.quantity}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Rate (₹) *
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={editFields.rate}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={editFields.mrp}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold shadow-lg hover:shadow-xl text-sm"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete confirmation popup */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
            <h3 className="text-xl font-bold text-rose-500 mb-4 text-center">Delete Product</h3>
            <p className="mb-6 text-center">Are you sure you want to delete this product?</p>
            <div className="flex justify-center gap-6">
              <button onClick={() => handleDelete(deleteId)} className="bg-rose-500 text-white px-6 py-2 rounded hover:bg-rose-600">Yes</button>
              <button onClick={() => setDeleteId(null)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">No</button>
            </div>
          </div>
        </div>
      )}

      {showImagePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-red-500 font-bold"
              onClick={() => setShowImagePopup(false)}
            >
              ×
            </button>
            <div className={`flex ${popupImages.length > 1 ? 'flex-row gap-6' : 'flex-col'} items-center justify-center`}>
              {popupImages.map((img, idx) => (
                <img
                  key={idx}
                  src={`${BACKEND_URL}${img}`}
                  alt={`Large ${idx + 1}`}
                  className="max-h-[70vh] max-w-[40vw] rounded-lg border-2 border-gray-200 shadow-lg object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListAllProducts;