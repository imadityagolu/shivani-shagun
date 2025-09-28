const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  feedbackText: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  images: [{ 
    type: String 
  }],
  isVerified: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
feedbackSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
feedbackSchema.index({ product: 1, createdAt: -1 });
feedbackSchema.index({ customer: 1, order: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);