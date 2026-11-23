import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/sendEmail.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // If email is not configured, skip verification (dev mode)
    const emailConfigured =
      process.env.EMAIL_USER &&
      process.env.EMAIL_USER !== 'your_email@gmail.com' &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_PASS !== 'your_email_app_password';

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: !emailConfigured, // auto-verify if no email config
      emailVerificationToken: emailConfigured ? verificationToken : undefined,
      emailVerificationExpires: emailConfigured ? verificationExpires : undefined,
    });

    if (emailConfigured) {
      sendVerificationEmail(email, verificationToken).catch(err =>
        console.error('Verification email failed:', err.message)
      );
    }

    const token = generateToken(user._id);

    res.status(201).json({
      message: emailConfigured
        ? 'Registration successful. Please check your email to verify your account.'
        : 'Registration successful! You can now login.',
      autoVerified: !emailConfigured,
      token: !emailConfigured ? token : undefined,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/verify-email?token=...
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired verification link' });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isEmailVerified)
      return res.status(403).json({ message: 'Please verify your email before logging in', notVerified: true });

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/login — Dedicated Admin Portal Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid admin credentials' });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: This account does not have administrator privileges.' });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    sendPasswordResetEmail(email, resetToken).catch(err =>
      console.error('Reset email failed:', err.message)
    );

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset link' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    isEmailVerified: req.user.isEmailVerified,
  });
};

// POST /api/auth/resend-verification
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found' });
    if (user.isEmailVerified) return res.status(400).json({ message: 'Email already verified' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    sendVerificationEmail(email, verificationToken).catch(console.error);
    res.json({ message: 'Verification email resent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
