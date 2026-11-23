import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getInventory,
  updateStock,
  addIngredient,
} from '../controllers/ingredientController.js';
import {
  getAllOrders,
  updateOrderStatus,
  getAdminDashboard,
} from '../controllers/orderController.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/inventory', getInventory);
router.patch('/inventory/:id', updateStock);
router.post('/inventory', addIngredient);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
