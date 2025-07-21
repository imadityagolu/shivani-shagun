import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { PDFViewer, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
// import BillPDF from './BillPDF';
import { toast } from 'react-toastify';
// Remove: import logo from '../../Images/logo.png';

function GenerateBill() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customer, setCustomer] = useState({ name: '', address: '', mobile: '' });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paid, setPaid] = useState('');
  const [showPDF, setShowPDF] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ product: '', category: '', mrp: '', quantity: 1 });
  const [pendingNewProduct, setPendingNewProduct] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {}
  };

  const handleAddProduct = (p) => {
    if (selectedProducts.find(sp => sp._id === p._id)) return;
    setSelectedProducts([...selectedProducts, { ...p, quantity: 1, mrp: p.mrp }]);
    setShowProductDropdown(false);
    setSearch('');
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p._id !== id));
  };

  const handleProductChange = (id, field, value) => {
    setSelectedProducts(selectedProducts.map(p =>
      p._id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewProduct = () => {
    if (!newProduct.product || !newProduct.category || !newProduct.mrp || !newProduct.quantity) {
      alert('Please fill all fields for new product');
      return;
    }
    setSelectedProducts([
      ...selectedProducts,
      {
        _id: 'new_' + Date.now(),
        product: newProduct.product,
        category: newProduct.category,
        mrp: newProduct.mrp,
        quantity: newProduct.quantity,
        images: []
      }
    ]);
    setShowNewProductForm(false);
    setNewProduct({ product: '', category: '', mrp: '', quantity: 1 });
    setShowProductDropdown(false);
  };

  const total = selectedProducts.reduce((sum, p) => sum + (Number(p.mrp) * Number(p.quantity)), 0);

  // Calculate due
  const due = Math.max(0, total - Number(paid || 0));

  const handlePlaceOrder = async () => {
    if (!customer.name || !customer.mobile) {
      toast.error('Please fill customer name and mobile');
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }
    const orderPayload = {
      customer: null,
      products: selectedProducts.map(p => ({
        _id: p._id,
        product: p.product,
        category: p.category,
        mrp: p.mrp,
        image: p.images && p.images[0]
      })),
      total,
      address: {
        ...customer,
        address: customer.address ? customer.address : 'Patna,Bihar'
      },
      paymentMethod,
      paid,
      due
    };
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (res.ok) {
        setOrderData({ ...orderPayload, _id: data.order?._id || Date.now() });
        setShowPDF(true);
        setSelectedProducts([]);
        setCustomer({ name: '', address: '', mobile: '' });
        setPaid('');
        setDue('');
      } else {
        alert(data.message || 'Order failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  const handlePreview = () => {
    if (!customer.name || !customer.mobile) {
      toast.error('Please fill customer name and mobile');
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }
    // Always use the latest selectedProducts, total, paid, due
    const previewData = {
      customer: null,
      products: selectedProducts.map(p => ({
        _id: p._id,
        product: p.product,
        category: p.category,
        mrp: p.mrp,
        quantity: p.quantity,
        image: p.images && p.images[0]
      })),
      total,
      address: {
        ...customer,
        address: customer.address ? customer.address : 'Patna,Bihar'
      },
      paymentMethod,
      paid,
      due: Math.max(0, total - Number(paid || 0))
    };
    setOrderData({ ...previewData, _id: Date.now() });
    setShowPDF(true);
  };

  // Add new product directly from search
  const handleQuickAddNewProduct = () => {
    setPendingNewProduct({ product: search, category: '', mrp: '', quantity: 1 });
    setShowProductDropdown(false);
  };
  const handlePendingNewProductChange = (e) => {
    const { name, value } = e.target;
    setPendingNewProduct(prev => ({ ...prev, [name]: value }));
  };
  const handlePendingNewProductSubmit = () => {
    if (!pendingNewProduct.product || !pendingNewProduct.category || !pendingNewProduct.mrp || !pendingNewProduct.quantity) {
      toast.error('Please fill all fields for new product');
      return;
    }
    setSelectedProducts([
      ...selectedProducts,
      {
        _id: 'new_' + Date.now(),
        product: pendingNewProduct.product,
        category: pendingNewProduct.category,
        mrp: pendingNewProduct.mrp,
        quantity: pendingNewProduct.quantity,
        images: []
      }
    ]);
    setPendingNewProduct(null);
    setSearch('');
  };
  const handlePendingNewProductCancel = () => {
    setPendingNewProduct(null);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.product-dropdown-container') && !e.target.closest('.product-search-input')) {
        setShowProductDropdown(false);
      }
    };
    if (showProductDropdown) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showProductDropdown]);

  // Get unique categories from products, sort alphabetically, but always put 'Chunni', 'Sute', and 'Others' as the last three options
  let uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  uniqueCategories = uniqueCategories.filter(c => !['chunni', 'sute', 'others'].includes((c || '').toLowerCase())).sort((a, b) => a.localeCompare(b));
  uniqueCategories.push('Chunni', 'Sute', 'Others');

  // BillPDF component for PDF preview
  const BillPDF = ({ order }) => {
    if (!order) return null;
    const styles = StyleSheet.create({
      page: { padding: 32, fontSize: 12, fontFamily: 'Helvetica', backgroundColor: '#fff' },
      headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
      logo: { width: 48, height: 48, marginRight: 16 },
      heading: { fontSize: 26, color: '#e11d48', fontWeight: 'bold', marginBottom: 2, letterSpacing: 1 },
      date: { fontSize: 11, color: '#888', marginLeft: 'auto', marginTop: 8 },
      divider: { height: 2, backgroundColor: '#e11d48', marginVertical: 10, marginBottom: 18 },
      infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
      infoCol: { flex: 1, padding: 10, backgroundColor: '#f9fafb', borderRadius: 6, marginRight: 8 },
      infoColRight: { flex: 1, padding: 10, backgroundColor: '#f9fafb', borderRadius: 6, marginLeft: 8 },
      infoLabel: { color: '#e11d48', fontWeight: 'bold', marginBottom: 2 },
      infoValue: { color: '#222', marginBottom: 6 },
      table: { display: 'table', width: 'auto', marginBottom: 18, border: '1px solid #eee', borderRadius: 4, overflow: 'hidden' },
      tableRow: { flexDirection: 'row' },
      tableCell: { flex: 1, padding: 7, borderRight: '1px solid #eee', borderBottom: '1px solid #eee', fontSize: 12 },
      tableCellProduct: { flex: 2, padding: 7, borderRight: '1px solid #eee', borderBottom: '1px solid #eee', fontSize: 12 },
      tableHeader: { backgroundColor: '#f3f4f6', fontWeight: 'bold', fontSize: 13 },
      tableAlt: { backgroundColor: '#f9f9f9' },
      totalSection: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 20 },
      totalBox: { width: '35%', textAlign: 'right' },
      totalLabel: { fontSize: 14, fontWeight: 'bold', color: '#e11d48' },
      totalValue: { fontSize: 16, fontWeight: 'bold', color: '#222' },
      paySummaryCol: { width: '60%' },
      payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
      payLabel: { color: '#888', fontWeight: 'bold', fontSize: 12 },
      payValue: { color: '#222', fontWeight: 'bold', fontSize: 13 },
      small: { fontSize: 10, color: '#888', marginTop: 24, textAlign: 'center' },
      compGenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 2 },
      compGenBill: { fontSize: 11, color: '#888', textAlign: 'left', fontStyle: 'italic', letterSpacing: 0.5 },
      date: { fontSize: 11, color: '#888', textAlign: 'right' },
      infoGrid: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18, gap: 0 },
      infoItem: { width: '50%', marginBottom: 6, paddingRight: 8, flexDirection: 'row', alignItems: 'center' },
      infoLabel: { color: '#e11d48', fontWeight: 'bold', fontSize: 12, marginRight: 4 },
      infoValue: { color: '#222', fontSize: 12 }
    });
    // Calculate due for PDF
    const due = Math.max(0, order.total - Number(order.paid || 0));
    // Get current date and time in AM/PM format
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    let hours = now.getHours();
    const minutes = pad(now.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const dateStr = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(hours)}:${minutes} ${ampm}`;
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headerRow}>
            <Text style={styles.heading}>shivani shagun</Text>
          </View>
          <View style={styles.compGenRow}>
            <Text style={styles.compGenBill}>computer generated bill</Text>
            <Text style={styles.date}>{dateStr}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Customer: </Text><Text style={styles.infoValue}>{order.address?.name || ''}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Address: </Text><Text style={styles.infoValue}>{order.address?.address || ''}</Text></View>
            <View style={styles.infoItem}><Text style={styles.infoLabel}>Mobile: </Text><Text style={styles.infoValue}>{order.address?.mobile || ''}</Text></View>
          </View>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellProduct}>Product</Text>
              <Text style={styles.tableCell}>Category</Text>
              <Text style={styles.tableCell}>MRP (₹)</Text>
              <Text style={styles.tableCell}>Qty</Text>
              <Text style={styles.tableCell}>Total (₹)</Text>
            </View>
            {order.products.map((p, i) => (
              <View style={[styles.tableRow, i % 2 === 1 ? styles.tableAlt : null]} key={i}>
                <Text style={styles.tableCellProduct}>{p.product}</Text>
                <Text style={styles.tableCell}>{p.category}</Text>
                <Text style={styles.tableCell}>{'₹'}{p.mrp}</Text>
                <Text style={styles.tableCell}>{p.quantity || 1}</Text>
                <Text style={styles.tableCell}>{'₹'}{Number(p.mrp) * Number(p.quantity || 1)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.compGenRow}>
            <View style={styles.totalSection}>
              <View style={styles.paySummaryCol}>
                <View style={styles.infoItem}><Text style={styles.infoLabel}>Payment: </Text><Text style={styles.infoValue}>{order.paymentMethod}</Text></View>
                <View style={styles.infoItem}><Text style={styles.infoLabel}>Paid: </Text><Text style={styles.infoValue}>{'₹'}{order.paid || 0}</Text></View>
                <View style={styles.infoItem}><Text style={styles.infoLabel}>Due: </Text><Text style={styles.infoValue}>{'₹'}{due}</Text></View>
              </View>
              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total Amount: </Text><Text style={styles.totalValue}>{'₹'}{order.total} /-</Text>
              </View>
            </View>
          </View>
          <Text style={styles.small}>Thank you for shopping with us!</Text>
        </Page>
      </Document>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
      <h1 className="text-3xl font-bold text-center text-rose-500 mb-2">shivani shagun</h1>
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">bill of the products</h2>
      {/* Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input name="name" value={customer.name} onChange={handleCustomerChange} placeholder="Customer Name" className="px-4 py-2 border rounded w-full" required />
        <input name="address" value={customer.address} onChange={handleCustomerChange} placeholder="Address (optional)" className="px-4 py-2 border rounded w-full" />
        <input name="mobile" value={customer.mobile} onChange={handleCustomerChange} placeholder="Mobile Number" className="px-4 py-2 border rounded w-full" required />
      </div>
      {/* Product Search and Select */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setShowProductDropdown(true)}
          placeholder="Search product..."
          className="product-search-input px-4 py-2 border rounded w-full mb-2"
        />
        <div className="relative">
          {showProductDropdown && (
            <div className="product-dropdown-container absolute z-10 bg-white border rounded shadow w-full max-h-60 overflow-y-auto mt-1">
              {products
                .filter(p =>
                  search === '' ||
                  (p.product && p.product.toLowerCase().includes(search.toLowerCase())) ||
                  (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
                )
                .sort((a, b) => a.product.localeCompare(b.product))
                .map(p => (
                  <div key={p._id} className="flex items-center justify-between px-2 py-1 border-b last:border-b-0 cursor-pointer hover:bg-rose-50" onClick={() => handleAddProduct(p)}>
                    <div>
                      <span className="font-semibold">{p.product}</span>
                      <span className="text-xs text-gray-400 ml-2">({p.category})</span>
                    </div>
                    <div className="text-xs text-gray-600 flex flex-col items-end">
                      <span>Qty: {p.quantity}</span>
                      <span>MRP: ₹{p.mrp}</span>
                    </div>
                  </div>
                ))}
              {/* If no products match and search is not empty, allow quick add */}
              {products.filter(p =>
                search === '' ||
                (p.product && p.product.toLowerCase().includes(search.toLowerCase())) ||
                (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
              ).length === 0 && search.trim() !== '' && (
                <div className="px-4 py-2 cursor-pointer hover:bg-rose-50 text-rose-600 font-semibold" onClick={handleQuickAddNewProduct}>
                  + Add "{search}" as new product
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Inline new product form if needed */}
      {pendingNewProduct && (
        <div className="bg-gray-50 p-3 rounded shadow-inner flex flex-col gap-2 mb-4">
          <div className="font-bold text-rose-500 mb-1">Add New Product: {pendingNewProduct.product}</div>
          <select
            name="category"
            value={pendingNewProduct.category}
            onChange={handlePendingNewProductChange}
            className="px-2 py-1 border rounded"
            required
          >
            <option value="">Select Category</option>
            {uniqueCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            value={pendingNewProduct.mrp}
            onChange={handlePendingNewProductChange}
            className="px-2 py-1 border rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            min={1}
            value={pendingNewProduct.quantity}
            onChange={handlePendingNewProductChange}
            className="px-2 py-1 border rounded"
            required
          />
          <div className="flex gap-2 mt-1">
            <button className="bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600 font-bold" onClick={handlePendingNewProductSubmit} type="button">Add</button>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 font-bold" onClick={handlePendingNewProductCancel} type="button">Cancel</button>
          </div>
        </div>
      )}
      {/* Bill Table */}
      <table className="w-full mb-4 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">MRP</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Remove</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map(p => (
            <tr key={p._id}>
              <td className="p-2 border">{p.product}</td>
              <td className="p-2 border">{p.category}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={p.mrp}
                  min={0}
                  onChange={e => handleProductChange(p._id, 'mrp', e.target.value)}
                  className="w-20 px-2 py-1 border rounded"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={p.quantity}
                  min={1}
                  onChange={e => handleProductChange(p._id, 'quantity', e.target.value)}
                  className="w-16 px-2 py-1 border rounded"
                />
              </td>
              <td className="p-2 border">₹{Number(p.mrp) * Number(p.quantity)}</td>
              <td className="p-2 border">
                <button className="text-red-500" onClick={() => handleRemoveProduct(p._id)}>Remove</button>
              </td>
            </tr>
          ))}
          {selectedProducts.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">No products selected.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Payment and Bill Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Payment Method</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="px-2 py-1 border rounded">
            <option value="cash">Cash</option>
            <option value="online">Online</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Paid</label>
          <input type="number" value={paid} onChange={e => setPaid(e.target.value)} className="px-2 py-1 border rounded" />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Due</label>
          <input type="number" value={due} readOnly className="px-2 py-1 border rounded bg-gray-100 text-gray-700" />
        </div>
        <div className="flex flex-col justify-end">
          <div className="font-bold text-lg">Total: ₹{total}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="bg-rose-500 text-white px-6 py-2 rounded font-bold hover:bg-rose-600 w-full flex items-center justify-center gap-2" onClick={handlePlaceOrder}>
          Place Order
        </button>
        <button className="bg-gray-200 text-rose-500 px-4 py-2 rounded font-bold hover:bg-gray-300 flex items-center justify-center gap-2" onClick={handlePreview} title="Preview Bill">
          <FaEye /> Preview
        </button>
      </div>
      {/* PDF Preview Popup */}
      {showPDF && orderData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-rose-500" onClick={() => setShowPDF(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">Bill Preview (PDF)</h2>
            <div className="h-[600px] border mb-4 bg-white">
              <PDFViewer width="100%" height="100%">
                <BillPDF order={orderData} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateBill;
