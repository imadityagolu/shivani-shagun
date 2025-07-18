const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: String, required: true },
  product: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  mrp: { type: Number, required: true },
  date: { type: String, required: true }, // Store as dd-mm-yyyy string
  image: { type: String, required: true } // Store image URL or base64 string
});

module.exports = mongoose.model('Product', productSchema); 