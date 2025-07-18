const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

app.use(cors({
    origin: process.env.FRONTEND_URL, // or use your deployed frontend URL
    credentials: true
  }));
  
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URL)
.then(() => {console.log('Connected to MongoDB');} )
.catch((err) => {console.log(err);} );

app.listen(PORT, () => {console.log(`server is runnig - http://localhost:${PORT}`)});


// Models (to be created)
const Admin = require('./models/Admin');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Seller = require('./models/Seller');

// Auth routes (to be implemented)
const adminController = require('./controllers/adminController');
const customerController = require('./controllers/customerController');
const productController = require('./controllers/productController');
const sellerController = require('./controllers/sellerController');
app.post('/api/admin/signup', adminController.signup);
app.post('/api/admin/login', adminController.login);
app.get('/api/admin/dashboard', auth('admin'), adminController.dashboard);
app.post('/api/customer/signup', customerController.signup);
app.post('/api/customer/login', customerController.login);
app.get('/api/customer/profile', auth('customer'), customerController.profile);

// Product routes
app.post('/api/products/upload', auth('admin'), productController.uploadProductImage);
app.post('/api/products', auth('admin'), productController.addProduct);
app.get('/api/products', productController.getAllProducts);
app.delete('/api/products/:id', auth('admin'), productController.deleteProduct);
app.patch('/api/products/:id', auth('admin'), productController.updateProduct);

// Seller routes
app.post('/api/sellers', sellerController.addSeller);
app.get('/api/sellers', sellerController.getAllSellers);

// JWT auth middleware
function auth(role) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: 'Forbidden.' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  };
}

// Protected routes
app.get('/api/admin/dashboard', auth('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!', adminId: req.user.id });
});

app.get('/api/customer/profile', auth('customer'), (req, res) => {
  res.json({ message: 'Welcome to the customer profile!', customerId: req.user.id });
});
