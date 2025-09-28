const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const { ProductReport } = require('../models/Product');
const Feedback = require('../models/Feedback');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

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
    
    // Create welcome notification
    const welcomeNotification = {
      title: 'Welcome to Shivani Shagun!',
      message: `Thank you for joining our platform, ${name}! Explore our latest collection of beautiful bridal wear and traditional outfits.`,
      timestamp: new Date(),
      read: false
    };
    
    const customer = new Customer({ 
      name, 
      email, 
      password: hashedPassword, 
      mobile,
      notifications: [welcomeNotification]
    });
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
    
    // Update last login time
    customer.lastLogin = new Date();
    await customer.save();
    
    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      token, 
      customer: { 
        id: customer._id, 
        name: customer.name, 
        email: customer.email, 
        mobile: customer.mobile,
        lastLogin: customer.lastLogin
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.profile = (req, res) => {
  res.json({ message: 'Welcome to the customer profile!', customerId: req.user.id });
};

exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).select('-password');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
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

exports.removeFromCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: 'Product ID required' });
    customer.cart = customer.cart.filter(
      (item) => item.toString() !== productId
    );
    await customer.save();
    res.json({ message: 'Product removed from cart' });
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

exports.getNotifications = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer.notifications || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const { notificationId } = req.params;
    const notification = customer.notifications.id(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    
    notification.read = true;
    await customer.save();
    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    customer.notifications.forEach(notification => {
      notification.read = true;
    });
    await customer.save();
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    
    const newNotification = {
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    
    customer.notifications.unshift(newNotification);
    await customer.save();
    res.json({ message: 'Notification added successfully', notification: newNotification });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const { street, city, state, pincode, country } = req.body;
    
    // Update address fields
    customer.address = {
      street: street || customer.address.street,
      city: city || customer.address.city,
      state: state || customer.address.state,
      pincode: pincode || customer.address.pincode,
      country: country || customer.address.country
    };
    
    await customer.save();
    res.json({ 
      message: 'Address updated successfully', 
      address: customer.address 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateName = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    customer.name = name.trim();
    await customer.save();
    
    res.json({ 
      message: 'Name updated successfully', 
      name: customer.name 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Hash the new password
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    customer.password = hashedPassword;
    
    // Add notification about password change
    const passwordChangeNotification = {
      title: 'Password Changed Successfully',
      message: 'Your account password has been updated successfully. If you did not make this change, please contact support immediately.',
      timestamp: new Date(),
      read: false
    };
    
    customer.notifications.unshift(passwordChangeNotification);
    
    await customer.save();
    
    res.json({ 
      message: 'Password changed successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.removeFromWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ message: 'Product ID required' });
    customer.wishlist = customer.wishlist.filter(
      (item) => item.toString() !== productId
    );
    await customer.save();
    res.json({ message: 'Product removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.placeOrder = async (req, res) => {
  try {
    const user = await Customer.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Customer not found' });
    const { products, total, paymentMethod, customer, mobile, address } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }
    if (!customer || !mobile || !address) {
      return res.status(400).json({ message: 'Customer name, mobile, and address are required' });
    }
    // Always set quantity to 1 for website orders and include images
    const productsWithQty = products.map(p => ({
      ...p,
      quantity: 1,
      images: p.images || [],
      image: p.image || (p.images && p.images[0]) || ''
    }));
    // Calculate total quantity
    const totalQuantity = productsWithQty.reduce((sum, p) => sum + (Number(p.quantity) || 1), 0);
    // Calculate cost: sum of rate * quantity for all products
    const cost = productsWithQty.reduce((sum, p) => sum + (Number(p.rate || 0) * Number(p.quantity || 1)), 0);
    const order = await Order.create({
      customer,
      mobile,
      address,
      products: productsWithQty,
      total,
      paymentMethod,
      mode: 'website',
      paid: total,
      due: 0,
      cost,
      quantity: totalQuantity,
    });
    // Add notification to customer
    const productList = products.map(p => `${p.product} (₹${p.mrp})`).join(', ');
    const notification = {
      title: 'Order Placed Successfully',
      message: `Your order has been placed. Products: ${productList}. Total: ₹${total}. Payment: ${paymentMethod}.`,
      timestamp: new Date(),
      read: false
    };
    user.notifications.unshift(notification);
    // Send notification to admin
    const admin = await Admin.findOne();
    if (admin) {
      admin.notifications.unshift({
        title: 'Order Placed by Online Website',
        message: `Order (${order._id}) placed by online website by customer ${customer} (${mobile}).`,
        timestamp: new Date(),
        read: false
      });
      await admin.save();
    }
    // Clear the user's cart
    user.cart = [];
    await user.save();
    // Decrease quantity of each product by 1
    for (const p of products) {
      if (p._id) {
        await Product.findByIdAndUpdate(p._id, { $inc: { quantity: -1 } });
      }
    }
    res.json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.getMyOrders = async (req, res) => {
  try {
    const user = await Customer.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Customer not found' });
    const orders = await Order.find({ mobile: user.mobile, mode: 'website' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user.id;
    const user = await Customer.findById(customerId);
    if (!user) return res.status(404).json({ message: 'Customer not found' });
    // Find order by _id and mobile
    const order = await Order.findOne({ _id: orderId, mobile: user.mobile });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'out for delivery' || order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }
    order.status = 'cancelled';
    await order.save();
    // Increment product quantity for each product in the order
    for (const p of order.products) {
      if (p._id) {
        await Product.findByIdAndUpdate(p._id, { $inc: { quantity: 1 } });
      }
    }
    // Send notification to customer
    if (user) {
      user.notifications.unshift({
        title: 'Order Cancelled',
        message: `Your order (${order._id}) has been cancelled.`,
        timestamp: new Date(),
        read: false
      });
      await user.save();
    }
    // Send notification to admin
    const admin = await Admin.findOne();
    if (admin) {
      admin.notifications.unshift({
        title: 'Order Cancelled',
        message: `Order (${order._id}) by customer ${user?.name || ''} has been cancelled.`,
        timestamp: new Date(),
        read: false
      });
      await admin.save();
    }
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.returnOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user.id;
    const user = await Customer.findById(customerId);
    if (!user) return res.status(404).json({ message: 'Customer not found' });
    
    // Find order by _id and mobile
    const order = await Order.findOne({ _id: orderId, mobile: user.mobile });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Only delivered orders can be returned' });
    }
    
    // Check if order is within 24 hours of delivery
    const deliveryTime = new Date(order.updatedAt);
    const currentTime = new Date();
    const timeDifference = currentTime - deliveryTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    
    if (hoursDifference > 24) {
      return res.status(400).json({ message: 'Return period has expired. Products can only be returned within 24 hours of delivery.' });
    }
    
    order.status = 'return';
    await order.save();
    
    // Send notification to customer
    if (user) {
      user.notifications.unshift({
        title: 'Return Request Submitted',
        message: `Your return request for order (${order._id}) has been submitted and is being processed.`,
        timestamp: new Date(),
        read: false
      });
      await user.save();
    }
    
    // Send notification to admin
    const admin = await Admin.findOne();
    if (admin) {
      admin.notifications.unshift({
        title: 'Return Request',
        message: `Customer ${user?.name || ''} has requested a return for order (${order._id}).`,
        timestamp: new Date(),
        read: false
      });
      await admin.save();
    }
    
    res.json({ message: 'Return request submitted successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Configure multer for feedback image uploads
const feedbackStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/feedback');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const feedbackUpload = multer({ 
  storage: feedbackStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

exports.submitFeedback = async (req, res) => {
  console.log('submitFeedback function called');
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  try {
    const { orderId, productId, productName, rating, feedbackText } = req.body;
    const customerId = req.user.id;
    console.log('Customer ID:', customerId);

    // Validate required fields
    console.log('Validating required fields...');
    if (!orderId || !productId || !productName || !rating || !feedbackText) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    console.log('Required fields validation passed');

    // Validate rating
    console.log('Validating rating...');
    if (rating < 1 || rating > 5) {
      console.log('Validation failed: Invalid rating');
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    console.log('Rating validation passed');

    // Get customer details first to get the customer name
    console.log('Getting customer details...');
    const customer = await Customer.findById(customerId);
    console.log('Customer found:', customer);
    if (!customer) {
      console.log('Customer not found');
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if order exists and belongs to customer (using customer name)
    console.log('Checking order existence...');
    console.log('Looking for order with ID:', orderId);
    console.log('Looking for customer with name:', customer.name);
    
    const order = await Order.findOne({ _id: orderId, customer: customer.name });
    console.log('Order found:', order);
    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order is delivered
    console.log('Checking order status...');
    console.log('Order status:', order.status);
    if (order.status !== 'delivered') {
      console.log('Order not delivered');
      return res.status(400).json({ message: 'Can only provide feedback for delivered orders' });
    }

    // Check if feedback period is active (after 24 hours) - TEMPORARILY DISABLED FOR TESTING
    console.log('Checking feedback period...');
    const deliveryTime = new Date(order.createdAt); // Using createdAt as deliveredAt
    const currentTime = new Date();
    const timeDifference = currentTime - deliveryTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    console.log('Hours since delivery:', hoursDifference);

    // TEMPORARILY DISABLED: Allow feedback submission regardless of time for testing
    // if (hoursDifference <= 1) {
    //   console.log('Feedback period not active yet');
    //   return res.status(400).json({ message: 'Feedback can only be submitted after 1 hour of delivery' });
    // }

    // Check if feedback already exists for this customer and product
    console.log('Checking for existing feedback...');
    const existingFeedback = await Feedback.findOne({ 
      customer: customerId, 
      product: productId 
    });
    console.log('Existing feedback:', existingFeedback);
    
    if (existingFeedback) {
      console.log('Feedback already exists');
      return res.status(400).json({ message: 'Feedback already submitted for this product' });
    }

    // Customer details already retrieved above

    // Process uploaded images
    console.log('Processing uploaded images...');
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        imageUrls.push(`/uploads/feedback/${file.filename}`);
      });
    }
    console.log('Image URLs:', imageUrls);

    // Validate ObjectIds
    console.log('Validating ObjectIds...');
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      console.log('Invalid customer ID');
      return res.status(400).json({ message: 'Invalid customer ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log('Invalid order ID');
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log('Invalid product ID');
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Create feedback
    console.log('Creating feedback...');
    const feedbackData = {
      customer: customerId,
      customerName: customer.name,
      order: orderId,
      product: productId,
      productName: productName,
      rating: parseInt(rating),
      feedbackText: feedbackText,
      images: imageUrls
    };
    console.log('Feedback data to save:', feedbackData);
    
    const feedback = new Feedback(feedbackData);

    console.log('Saving feedback...');
    await feedback.save();
    console.log('Feedback saved successfully');

    console.log('Sending success response...');
    res.status(201).json({ 
      message: 'Feedback submitted successfully', 
      feedback: feedback 
    });

  } catch (err) {
    console.log('Error in submitFeedback:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get feedback for a specific product
exports.getProductFeedback = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbackData = await Feedback.find({ product: productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('customer', 'name')
      .select('-__v');

    // Map feedbackText to comment for frontend compatibility
    const feedback = feedbackData.map(item => ({
      ...item.toObject(),
      comment: item.feedbackText
    }));

    const totalFeedback = await Feedback.countDocuments({ product: productId });
    const totalPages = Math.ceil(totalFeedback / limit);

    // Calculate average rating
    const ratingStats = await Feedback.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const stats = ratingStats.length > 0 ? {
      averageRating: Math.round(ratingStats[0].averageRating * 10) / 10,
      totalReviews: ratingStats[0].totalReviews,
      ratingDistribution: ratingStats[0].ratingDistribution.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {})
    } : {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {}
    };

    res.json({
      feedback,
      averageRating: stats.averageRating,
      totalFeedback: totalFeedback,
      ratingDistribution: stats.ratingDistribution,
      pagination: {
        currentPage: page,
        totalPages,
        totalFeedback,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Check if customer has already submitted feedback for a product
exports.checkFeedbackExists = async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user.id;

    console.log('Checking feedback existence for customer:', customerId, 'product:', productId);

    // Check if feedback already exists for this customer and product
    const existingFeedback = await Feedback.findOne({ 
      customer: customerId, 
      product: productId 
    });

    console.log('Existing feedback found:', !!existingFeedback);

    res.json({ 
      feedbackExists: !!existingFeedback,
      feedback: existingFeedback ? {
        rating: existingFeedback.rating,
        feedbackText: existingFeedback.feedbackText,
        createdAt: existingFeedback.createdAt
      } : null
    });

  } catch (err) {
    console.log('Error in checkFeedbackExists:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.feedbackUpload = feedbackUpload;