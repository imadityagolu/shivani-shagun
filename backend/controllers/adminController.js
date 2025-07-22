const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingAdmin = await Admin.findOne({ $or: [ { email }, { mobile } ] });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword, mobile });
    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully.' });
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
    const admin = await Admin.findOne({
      $or: [
        { email: emailOrMobile },
        { mobile: emailOrMobile }
      ]
    });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Update lastLogin
    admin.lastLogin = new Date();
    await admin.save();
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, mobile: admin.mobile } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json({
      message: 'Welcome to the admin dashboard!',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        lastLogin: admin.lastLogin
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findByIdAndDelete(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendNotificationToCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { title, message } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const newNotification = {
      title,
      message,
      timestamp: new Date(),
      read: false
    };
    
    customer.notifications.unshift(newNotification);
    await customer.save();
    
    res.json({ 
      message: 'Notification sent successfully', 
      notification: newNotification 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('customer', 'name email mobile').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    let update = { status };
    // If marking as complete for a shop order with due, add due to paid and set due to 0
    if (status === 'complete') {
      const order = await Order.findById(orderId);
      if (order && order.mode === 'shop' && order.due > 0) {
        update.paid = Number(order.paid) + Number(order.due);
        update.due = 0;
      }
    }
    const order = await Order.findByIdAndUpdate(orderId, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Send notification to customer (only for website orders)
    if (order.mode === 'website' && order.mobile) {
      const customer = await Customer.findOne({ mobile: order.mobile });
      if (customer) {
        const newNotification = {
          title: 'Order Status Updated',
          message: `Your order (${order._id}) status has been updated to: ${status}.`,
          timestamp: new Date(),
          read: false
        };
        customer.notifications.unshift(newNotification);
        await customer.save();
      }
    }
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.getNotifications = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const notifications = (admin.notifications || []).sort((a, b) => b.timestamp - a.timestamp);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    admin.notifications.forEach(n => { n.read = true; });
    await admin.save();
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.createOrder = async (req, res) => {
  try {
    const { products, total, paymentMethod, paid, due, customer, mobile, address, cost } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }
    if (!customer || !mobile || !address) {
      return res.status(400).json({ message: 'Customer name, mobile, and address are required' });
    }
    // Ensure quantity is set for each product
    const productsWithQty = products.map(p => ({ ...p, quantity: p.quantity ? Number(p.quantity) : 1 }));
    // Calculate total quantity
    const totalQuantity = productsWithQty.reduce((sum, p) => sum + (Number(p.quantity) || 1), 0);
    // Check stock for each product
    const Product = require('../models/Product');
    for (const p of productsWithQty) {
      if (p._id && p.quantity > 0) {
        const dbProduct = await Product.findById(p._id);
        if (!dbProduct) {
          return res.status(400).json({ message: `Product not found: ${p.product}` });
        }
        if (dbProduct.quantity < p.quantity) {
          return res.status(400).json({ message: `Only ${dbProduct.quantity} units available for product '${dbProduct.product}'.` });
        }
      }
    }
    // Determine status for shop orders
    let status = 'due';
    if (Number(total) === Number(paid)) {
      status = 'complete';
    }
    // Calculate cost if not provided
    let finalCost = cost;
    if (typeof finalCost !== 'number' || isNaN(finalCost)) {
      finalCost = productsWithQty.reduce((sum, p) => sum + (Number(p.rate || 0) * Number(p.quantity || 1)), 0);
    }
    const order = await Order.create({
      customer,
      mobile,
      address,
      products: productsWithQty,
      total,
      paymentMethod,
      mode: 'shop',
      paid,
      due,
      status,
      cost: finalCost,
      quantity: totalQuantity,
    });
    // Decrease quantity of each product by the ordered quantity
    for (const p of productsWithQty) {
      if (p._id && p.quantity > 0) {
        await Product.findByIdAndUpdate(p._id, { $inc: { quantity: -Number(p.quantity) } });
      }
    }
    res.json({ message: 'Order created successfully', order });
    // Add notification to admin for shop order
    try {
      const admin = await Admin.findOne();
      if (admin) {
        admin.notifications.unshift({
          title: 'Order Completed by Shop',
          message: `Order (${order._id}) completed by shop for customer ${customer}.`,
          timestamp: new Date(),
          read: false
        });
        await admin.save();
      }
    } catch (notifyErr) {
      // Log but do not block order creation
      console.error('Failed to add admin notification for shop order:', notifyErr);
    }
  } catch (err) {
    console.error('Order creation error:', err);
    console.error('Request body:', req.body);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 