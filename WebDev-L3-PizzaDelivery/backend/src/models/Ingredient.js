import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['base', 'sauce', 'cheese', 'vegetable'],
    required: true,
  },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 100 },
  lowStockThreshold: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true },
  image: { type: String, default: '' },
  lowStockAlertSent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Ingredient', ingredientSchema);
