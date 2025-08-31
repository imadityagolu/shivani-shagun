const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  mobile: { type: String, required: false },
  address: { type: String, required: false },
  products: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      product: String,
      category: String,
      mrp: Number,
      rate: Number,
      image: String,
      images: [String],
      quantity: { type: Number, default: 1 }
    }
  ],
  quantity: { type: Number, default: 1 }, // total quantity of all products
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  mode: { type: String, enum: ['website', 'shop'], default: 'website' },
  status: { type: String, default: 'order placed' },
  paid: { type: Number, default: 0 },
  due: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);