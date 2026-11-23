import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Custom pizza builder selections
  selectedIngredients: {
    base: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
    sauce: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
    cheese: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
    vegetables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
  },

  quantity: { type: Number, default: 1, min: 1 },
  totalAmount: { type: Number, required: true },

  orderStatus: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'],
    default: 'Order Received',
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentId: { type: String },
  razorpayOrderId: { type: String },

  // Prevent double stock deduction
  stockDeducted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
