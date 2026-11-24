import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
  notificationType: { type: String, default: 'low_stock_email' },
  message: { type: String },
  state: { type: String, enum: ['sent', 'failed'], default: 'sent' },
  sentAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
