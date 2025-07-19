const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const { ProductReport } = require('../models/Product');

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
    if (productId) {
      await ProductReport.findOneAndUpdate(
        { product: productId },
        { $inc: { wishlistCount: 1 } },
        { upsert: true }
      );
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
    if (productId) {
      await ProductReport.findOneAndUpdate(
        { product: productId },
        { $inc: { cartCount: 1 } },
        { upsert: true }
      );
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
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const { products, total, address, paymentMethod } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }
    // Save order
    const order = await Order.create({
      customer: customer._id,
      products,
      total,
      address,
      paymentMethod
    });
    // Add notification to customer
    const productList = products.map(p => `${p.product} (₹${p.mrp})`).join(', ');
    const notification = {
      title: 'Order Placed Successfully',
      message: `Your order has been placed. Products: ${productList}. Total: ₹${total}. Payment: ${paymentMethod}.`,
      timestamp: new Date(),
      read: false
    };
    customer.notifications.unshift(notification);
    // Send notification to admin
    const admin = await Admin.findOne();
    if (admin) {
      admin.notifications.unshift({
        title: 'New Order Placed',
        message: `Order (${order._id}) placed by customer ${customer.name}.`,
        timestamp: new Date(),
        read: false
      });
      await admin.save();
    }
    // Clear the user's cart
    customer.cart = [];
    await customer.save();
    // Decrease quantity of each product by 1
    for (const p of products) {
      if (p._id) {
        await Product.findByIdAndUpdate(p._id, { $inc: { quantity: -1 } });
        await ProductReport.findOneAndUpdate(
          { product: p._id },
          { $inc: { orderedCount: 1 } },
          { upsert: true }
        );
      }
    }
    res.json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.getMyOrders = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user.id;
    const order = await Order.findOne({ _id: orderId, customer: customerId });
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
    const customer = await Customer.findById(customerId);
    if (customer) {
      customer.notifications.unshift({
        title: 'Order Cancelled',
        message: `Your order (${order._id}) has been cancelled.`,
        timestamp: new Date(),
        read: false
      });
      await customer.save();
    }
    // Send notification to admin
    const admin = await Admin.findOne();
    if (admin) {
      admin.notifications.unshift({
        title: 'Order Cancelled',
        message: `Order (${order._id}) by customer ${customer?.name || ''} has been cancelled.`,
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