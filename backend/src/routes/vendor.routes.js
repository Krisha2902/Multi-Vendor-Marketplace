import { Router } from 'express';
import { apply, getMe } from '../controllers/vendor.controller.js';
import {
  getVendorOrders,
  updateVendorOrderStatus,
  getVendorStats,
} from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Seller application & profile
router.post('/apply', protect, apply);
router.get('/me', protect, getMe);

// Day 6: Vendor Order fulfillment & Live Dashboard Stats
router.get('/orders', protect, getVendorOrders);
router.patch('/orders/:id/status', protect, updateVendorOrderStatus);
router.get('/stats', protect, getVendorStats);

export default router;
