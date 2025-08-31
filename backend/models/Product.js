const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: String, required: false, default: "UNKNOWN" },
  product: { type: String, required: true },
  description: { type: String, required: false },
  category: { type: String, required: true },
  color: { 
    name: { type: String, required: false },
    hex: { type: String, required: false }
  },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  mrp: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  images: [{ type: String, required: false }] // Store array of image URLs
});

module.exports = mongoose.model('Product', productSchema);