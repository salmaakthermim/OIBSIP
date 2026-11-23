import express from 'express';
import {
  register,
  login,
  googleLogin,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  resendVerification,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
