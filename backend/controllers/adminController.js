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
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Send notification to customer
    const customer = await Customer.findById(order.customer);
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