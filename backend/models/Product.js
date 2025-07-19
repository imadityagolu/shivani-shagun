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

const productReportSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  orderedCount: { type: Number, default: 0 },
  viewedCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  cartCount: { type: Number, default: 0 },
  feedbacks: [{
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    feedback: String,
    createdAt: { type: Date, default: Date.now }
  }],
  ratings: [{
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
  }]
});

const ProductReport = mongoose.model('ProductReport', productReportSchema);

module.exports = mongoose.model('Product', productSchema);
module.exports.ProductReport = ProductReport; 