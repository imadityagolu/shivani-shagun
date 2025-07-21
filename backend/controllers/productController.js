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

// Helper to generate 8-digit unique ID
function generate8DigitId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

exports.addProduct = async (req, res) => {
  try {
    const { seller, product, description, category, color, quantity, rate, mrp, date, images } = req.body;
    if (!seller || !product || !description || !category || !color || !quantity || !rate || !mrp || !date || !images) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    // Validate color structure
    if (!color.name || !color.hex) {
      return res.status(400).json({ message: 'Color must have both name and hex value.' });
    }
    
    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }
    
    const newProduct = new Product({ seller, product, description, category, color, quantity, rate, mrp, date, images });
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
    const { seller, product, date, index } = req.body;
    const ext = path.extname(req.file.originalname);
    const safeSeller = (seller || '').replace(/[^a-zA-Z0-9]/g, '');
    const safeProduct = (product || '').replace(/[^a-zA-Z0-9]/g, '');
    const safeDate = (date || '').replace(/[^0-9]/g, '');
    const imageIndex = index ? `_${index}` : '';
    const uniqueId = generate8DigitId();
    const newFileName = `${uniqueId}${ext}`;
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
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    // Delete associated images by unique 8-digit ID
    const uploadDir = path.join(__dirname, '../uploads/products');
    if (product.images && product.images.length > 0) {
      const uniqueIds = product.images.map(imgPath => {
        const match = imgPath.match(/\/uploads\/products\/(\d{8})_/);
        return match ? match[1] : null;
      }).filter(Boolean);
      const files = fs.readdirSync(uploadDir);
      uniqueIds.forEach(uid => {
        files.forEach(file => {
          if (file.startsWith(uid + '_')) {
            try {
              fs.unlinkSync(path.join(uploadDir, file));
            } catch (e) {
              // ignore
            }
          }
        });
      });
    }
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProduct = [
  upload.array('images', 10), // Allow up to 10 images
  async (req, res) => {
    try {
      const { id } = req.params;
      const { product, mrp, description, quantity, rate, color, removedImages } = req.body;
      
      // Parse color if it's a JSON string
      let parsedColor = color;
      if (color && typeof color === 'string') {
        try {
          parsedColor = JSON.parse(color);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid color format.' });
        }
      }
      
      // Parse removedImages if it's a JSON string
      let parsedRemovedImages = [];
      if (removedImages && typeof removedImages === 'string') {
        try {
          parsedRemovedImages = JSON.parse(removedImages);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid removedImages format.' });
        }
      }
      
      // Validate color structure if color is being updated
      if (parsedColor && (!parsedColor.name || !parsedColor.hex)) {
        return res.status(400).json({ message: 'Color must have both name and hex value.' });
      }
      
      // Get existing product to handle images
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      
      // Handle new uploaded images
      let newImagePaths = [];
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const ext = path.extname(file.originalname);
          const uniqueId = generate8DigitId();
          const newFileName = `${uniqueId}${ext}`;
          const uploadDir = path.join(__dirname, '../uploads/products');
          const oldPath = path.join(uploadDir, file.filename);
          const newPath = path.join(uploadDir, newFileName);
          
          // Rename the file
          fs.renameSync(oldPath, newPath);
          newImagePaths.push(`/uploads/products/${newFileName}`);
        }
      }
      
      // Handle image management
      let finalImages = [...existingProduct.images];
      
      // Remove images that were marked for deletion
      if (parsedRemovedImages.length > 0) {
        finalImages = finalImages.filter(img => !parsedRemovedImages.includes(img));
      }
      
      // Add new images
      finalImages = [...finalImages, ...newImagePaths];
      
      // Ensure at least one image remains
      if (finalImages.length === 0) {
        return res.status(400).json({ message: 'At least one image is required.' });
      }
      
      // Prepare update data
      const updateData = {
        product: product || existingProduct.product,
        mrp: mrp || existingProduct.mrp,
        description: description || existingProduct.description,
        quantity: quantity || existingProduct.quantity,
        rate: rate || existingProduct.rate,
        images: finalImages,
        seller: req.body.seller || existingProduct.seller,
        category: req.body.category || existingProduct.category
      };
      
      // Add color if provided
      if (parsedColor) {
        updateData.color = parsedColor;
      }
      
      const updated = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      // After updating the product, delete removed images from disk
      if (parsedRemovedImages.length > 0) {
        const uploadDir = path.join(__dirname, '../uploads/products');
        for (const imgPath of parsedRemovedImages) {
          const fileName = imgPath.split('/').pop();
          const filePath = path.join(uploadDir, fileName);
          // Check if any other product uses this image
          const usedElsewhere = await Product.findOne({ images: imgPath, _id: { $ne: id } });
          if (!usedElsewhere && fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (e) {
              // ignore
            }
          }
        }
      }
      
      res.json({ message: 'Product updated successfully.', product: updated });
    } catch (err) {
      console.error('Update product error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
];

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Increment viewedCount in ProductReport
    const { ProductReport } = require('../models/Product');
    await ProductReport.findOneAndUpdate(
      { product: req.params.id },
      { $inc: { viewedCount: 1 } },
      { upsert: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 