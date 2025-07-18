const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Multer setup (save with temp name)
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../uploads/products');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Save with a temp name (timestamp + originalname)
    const tempName = Date.now() + '_' + file.originalname;
    cb(null, tempName);
  }
});
const upload = multer({ storage });

exports.addProduct = async (req, res) => {
  try {
    const { seller, product, description, category, quantity, rate, mrp, date, image } = req.body;
    if (!seller || !product || !description || !category || !quantity || !rate || !mrp || !date || !image) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newProduct = new Product({ seller, product, description, category, quantity, rate, mrp, date, image });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Image upload endpoint
exports.uploadProductImage = [
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }
    // Now req.body fields are available
    const { seller, product, date } = req.body;
    const ext = path.extname(req.file.originalname);
    const safeSeller = (seller || '').replace(/[^a-zA-Z0-9]/g, '');
    const safeProduct = (product || '').replace(/[^a-zA-Z0-9]/g, '');
    const safeDate = (date || '').replace(/[^0-9]/g, '');
    const newFileName = `${safeSeller}_${safeProduct}_${safeDate}${ext}`;
    const uploadDir = path.join(__dirname, '../uploads/products');
    const oldPath = path.join(uploadDir, req.file.filename);
    const newPath = path.join(uploadDir, newFileName);
    // Rename the file
    fs.renameSync(oldPath, newPath);
    const relPath = `/uploads/products/${newFileName}`;
    res.json({ imagePath: relPath });
  }
];

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product, mrp, description, quantity, rate } = req.body;
    const updated = await Product.findByIdAndUpdate(
      id,
      { product, mrp, description, quantity, rate },
      { new: true }
    );
    res.json({ message: 'Product updated successfully.', product: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 