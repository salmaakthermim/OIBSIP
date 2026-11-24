import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['razorpay', 'mock'], default: 'razorpay' },
  providerOrderId: { type: String },
  providerPaymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
