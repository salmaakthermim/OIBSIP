import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' },
    name: String,
    size: String,
    price: Number,
    quantity: { type: Number, default: 1 },
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    zip: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentId: { type: String },
  razorpayOrderId: { type: String },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
