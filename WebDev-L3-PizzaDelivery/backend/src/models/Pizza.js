import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
  basePrice: { type: Number, required: true, default: 299 },
  image: { type: String },
  ingredients: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  stock: { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('Pizza', pizzaSchema);
