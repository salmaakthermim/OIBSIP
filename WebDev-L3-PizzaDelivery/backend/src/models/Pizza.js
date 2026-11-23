import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['veg', 'non-veg'], required: true },
  sizes: [{
    size: { type: String, enum: ['small', 'medium', 'large'] },
    price: { type: Number, required: true },
  }],
  image: { type: String },
  ingredients: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  stock: { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('Pizza', pizzaSchema);
