import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    minlength: 6,
  },
  phone: { type: String },
  avatar: { type: String, default: '' },
  googleId: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },

  // Email verification
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },

  // Forgot password
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
