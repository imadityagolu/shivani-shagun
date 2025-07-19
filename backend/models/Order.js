const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      product: String,
      category: String,
      mrp: Number,
      image: String
    }
  ],
  total: { type: Number, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'order placed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema); 