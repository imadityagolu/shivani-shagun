import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function Order() {
  const [cart, setCart] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/Login');
      return;
    }
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      let cartData = [];
      if (location.state && location.state.products) {
        cartData = location.state.products;
      } else {
        const cartRes = await fetch(`${BACKEND_URL}/api/customer/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cartRaw = await cartRes.json();
        cartData = Array.isArray(cartRaw) ? cartRaw.filter(p => p.quantity && p.quantity > 0) : [];
      }
      setCart(cartData);
      // Fetch profile
      const profileRes = await fetch(`${BACKEND_URL}/api/customer/profile-details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      setProfile(profileData);
    } catch (err) {
      toast.error('Failed to load order data');
    }
    setLoading(false);
  };

  const total = cart.reduce((sum, p) => sum + (Number(p.mrp) || 0), 0);

  const handlePlaceOrder = async () => {
    if (paymentMethod !== 'cod') return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${BACKEND_URL}/api/customer/order`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: cart.map(p => ({
            _id: p._id,
            product: p.product,
            category: p.category,
            mrp: p.mrp,
            image: p.image
          })),
          total,
          address: profile?.address,
          paymentMethod: 'Cash on Delivery'
        })
      });
      if (res.ok) {
        toast.success('Order placed!');
        // Optionally, navigate to a success page or clear cart
        setTimeout(() => {
          navigate('/Profile');
        }, 1200);
      } else {
        toast.error('Failed to place order');
      }
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-1 sm:px-0 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-2 sm:p-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-rose-600 mb-4 text-center">Order Confirmation</h1>
        {/* User Info */}
        {profile && (
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Customer Details :-</h2>
            <div className="bg-gray-50 rounded-lg p-2 flex flex-col gap-1 text-sm sm:text-base">
              <div><span className="font-semibold">Name:</span> {profile.name}</div>
              <div><span className="font-semibold">Mobile:</span> +91 {profile.mobile}</div>
              <div><span className="font-semibold">Address:</span> {profile.address?.street}, {profile.address?.city}, {profile.address?.state} {profile.address?.pincode}, {profile.address?.country}</div>
            </div>
          </div>
        )}
        {/* Cart Products */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Products in Cart :-</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-rose-100">
                <tr>
                  <th className="px-2 py-2 text-xs sm:text-sm font-semibold text-gray-700 text-left">Image</th>
                  <th className="px-2 py-2 text-xs sm:text-sm font-semibold text-gray-700 text-left">Product</th>
                  <th className="px-2 py-2 text-xs sm:text-sm font-semibold text-gray-700 text-left">Category</th>
                  <th className="px-2 py-2 text-xs sm:text-sm font-semibold text-gray-700 text-left">Quantity</th>
                  <th className="px-2 py-2 text-xs sm:text-sm font-semibold text-gray-700 text-left">MRP</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((p) => (
                  <tr key={p._id} className="border-b">
                    <td className="px-2 py-2">
                      {p.image ? (
                        <img src={`${import.meta.env.VITE_BACKEND_URL}${p.image}`} alt={p.product} className="w-12 h-12 object-contain rounded bg-gray-50 border" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </td>
                    <td className="px-2 py-2 font-bold text-rose-600 text-xs sm:text-sm">{p.product || 'No Name'}</td>
                    <td className="px-2 py-2 text-gray-500 text-xs sm:text-sm">{p.category || ''}</td>
                    <td className="px-2 py-2 text-gray-500 text-xs sm:text-sm">X 1</td>
                    <td className="px-2 py-2 text-gray-700 font-semibold text-xs sm:text-sm">₹{p.mrp || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right font-bold text-base sm:text-lg text-gray-800">
            Total Amount to be Payed: <span className="text-rose-600">₹ {total} /-</span>
          </div>
        </div>
        {/* Payment Method */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Select Payment Method</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
                className="accent-rose-500"
                disabled
              />
              <span className="text-sm sm:text-base text-gray-400">Online Payment (currently not available)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="accent-rose-500"
              />
              <span className="text-sm sm:text-base">Cash on Delivery</span>
            </label>
          </div>
        </div>
        {/* Place Order Button */}
        <div className="flex justify-center">
          <button
            onClick={handlePlaceOrder}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow transition text-base"
            disabled={paymentMethod !== 'cod'}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order; 