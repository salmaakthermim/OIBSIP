import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { adminLogin } from '../controllers/authController.js';
import { runStockCheck } from '../jobs/stockCheck.js';
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

// Dedicated Admin Login (public route)
router.post('/login', adminLogin);

// All subsequent admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/inventory', getInventory);
router.patch('/inventory/:id', updateStock);
router.post('/inventory', addIngredient);

// Manual trigger for low-stock email alert & check
router.post('/inventory/check-stock', async (req, res) => {
  try {
    const result = await runStockCheck();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
