import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Ingredient from '../models/Ingredient.js';

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Helper: validate stock for selected ingredients
const validateStock = async (selectedIngredients) => {
  const { base, sauce, cheese, vegetables = [] } = selectedIngredients;
  const ids = [base, sauce, cheese, ...vegetables].filter(Boolean);

  const ingredients = await Ingredient.find({ _id: { $in: ids } });
  const insufficientItems = [];

  for (const ing of ingredients) {
    if (ing.stock < 1) {
      insufficientItems.push(ing.name);
    }
  }
  return insufficientItems;
};

// Helper: deduct stock
const deductStock = async (selectedIngredients) => {
  const { base, sauce, cheese, vegetables = [] } = selectedIngredients;
  const ids = [base, sauce, cheese, ...vegetables].filter(Boolean);
  await Ingredient.updateMany(
    { _id: { $in: ids }, stock: { $gte: 1 } },
    { $inc: { stock: -1 } }
  );
};

// POST /api/orders — create order & razorpay order
export const createOrder = async (req, res) => {
  try {
    const { selectedIngredients, quantity, totalAmount } = req.body;

    if (!selectedIngredients?.base || !selectedIngredients?.sauce || !selectedIngredients?.cheese)
      return res.status(400).json({ message: 'Base, sauce and cheese are required' });

    // Validate stock
    const insufficient = await validateStock(selectedIngredients);
    if (insufficient.length > 0)
      return res.status(400).json({ message: `Insufficient stock for: ${insufficient.join(', ')}` });

    const razorpay = getRazorpay();
    let razorpayOrderId = null;

    if (razorpay) {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });
      razorpayOrderId = rzpOrder.id;
    }

    const order = await Order.create({
      user: req.user._id,
      selectedIngredients,
      quantity: quantity || 1,
      totalAmount,
      razorpayOrderId,
    });

    res.status(201).json({
      order,
      razorpayOrderId,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/orders/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature)
      return res.status(400).json({ message: 'Payment verification failed' });

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Prevent double stock deduction
    if (!order.stockDeducted) {
      // Re-validate stock before deducting (race condition protection)
      const insufficient = await validateStock(order.selectedIngredients);
      if (insufficient.length > 0) {
        order.paymentStatus = 'failed';
        await order.save();
        return res.status(400).json({ message: `Stock became insufficient: ${insufficient.join(', ')}` });
      }

      await deductStock(order.selectedIngredients);
      order.stockDeducted = true;
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpayPaymentId;
    order.orderStatus = 'Order Received';
    await order.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatusUpdate', { orderId: order._id, status: order.orderStatus });
    }

    res.json({ message: 'Payment verified and order confirmed', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/orders/mock-payment — for testing without Razorpay keys
export const mockPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (!order.stockDeducted) {
      const insufficient = await validateStock(order.selectedIngredients);
      if (insufficient.length > 0) {
        order.paymentStatus = 'failed';
        await order.save();
        return res.status(400).json({ message: `Stock insufficient: ${insufficient.join(', ')}` });
      }
      await deductStock(order.selectedIngredients);
      order.stockDeducted = true;
    }

    order.paymentStatus = 'paid';
    order.paymentId = `mock_${Date.now()}`;
    order.orderStatus = 'Order Received';
    await order.save();

    const io = req.app.get('io');
    if (io) io.emit('orderStatusUpdate', { orderId: order._id, status: order.orderStatus });

    res.json({ message: 'Mock payment successful', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('selectedIngredients.base selectedIngredients.sauce selectedIngredients.cheese selectedIngredients.vegetables')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('selectedIngredients.base selectedIngredients.sauce selectedIngredients.cheese selectedIngredients.vegetables');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('selectedIngredients.base selectedIngredients.sauce selectedIngredients.cheese selectedIngredients.vegetables')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery'];
    if (!allowedStatuses.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Real-time update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatusUpdate', { orderId: order._id, status: order.orderStatus });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const lowStockCount = await Ingredient.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    });
    const recentOrders = await Order.find({ paymentStatus: 'paid' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      paidOrders,
      totalRevenue: revenue[0]?.total || 0,
      lowStockCount,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
