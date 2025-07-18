const Seller = require('../models/Seller');

exports.addSeller = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Seller name is required.' });
    }
    // Check for duplicate mobile only if provided
    if (mobile) {
      const existing = await Seller.findOne({ mobile });
      if (existing) {
        return res.status(409).json({ message: 'Seller with this mobile already exists.' });
      }
    }
    const seller = new Seller({ name, mobile, address });
    await seller.save();
    res.status(201).json({ message: 'Seller added successfully.', seller });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ name: 1 });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 