const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String }, // not required, not unique
  address: { type: String } // not required
});

module.exports = mongoose.model('Seller', sellerSchema); 