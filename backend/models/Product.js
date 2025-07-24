const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: String, required: true },
  product: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  color: { 
    name: { type: String, required: true },
    hex: { type: String, required: true }
  },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  mrp: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  images: [{ type: String, required: true }] // Store array of image URLs
});

module.exports = mongoose.model('Product', productSchema); 