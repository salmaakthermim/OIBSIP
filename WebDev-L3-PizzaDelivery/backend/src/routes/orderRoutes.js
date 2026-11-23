import express from 'express';
import {
  createOrder,
  verifyPayment,
  mockPayment,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.post('/verify-payment', protect, verifyPayment);
router.post('/mock-payment', protect, mockPayment);

export default router;
