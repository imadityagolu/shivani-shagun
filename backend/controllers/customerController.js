const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({ message: 'Customer already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = new Customer({ name, email, password: hashedPassword, mobile });
    await customer.save();
    res.status(201).json({ message: 'Customer registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;
    if (!emailOrMobile || !password) {
      return res.status(400).json({ message: 'Email or mobile and password are required.' });
    }
    const customer = await Customer.findOne({
      $or: [
        { email: emailOrMobile },
        { mobile: emailOrMobile }
      ]
    });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, customer: { id: customer._id, name: customer.name, email: customer.email, mobile: customer.mobile } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.profile = (req, res) => {
  res.json({ message: 'Welcome to the customer profile!', customerId: req.user.id });
};

exports.addToWishlist = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID required' });
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (!customer.wishlist.includes(productId)) {
      customer.wishlist.push(productId);
      await customer.save();
    }
    res.json({ message: 'Added to wishlist', wishlist: customer.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID required' });
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    if (!customer.cart.includes(productId)) {
      customer.cart.push(productId);
      await customer.save();
    }
    res.json({ message: 'Added to cart', cart: customer.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate('wishlist');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate('cart');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 