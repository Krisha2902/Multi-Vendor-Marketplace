import { Router } from 'express';
import { apply, getMe } from '../controllers/vendor.controller.js';
import {
  getVendorOrders,
  updateVendorOrderStatus,
  getVendorStats,
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validateBody, validateObjectIdParam } from '../middlewares/validate.js';
import { vendorApplySchema, vendorOrderStatusSchema } from '../validations/schemas.js';

const router = Router();

// Seller application & profile
router.post('/apply', protect, validateBody(vendorApplySchema), apply);
router.get('/me', protect, getMe);

// Day 6: Vendor Order fulfillment & Live Dashboard Stats
router.get('/orders', protect, authorize('vendor'), getVendorOrders);
router.patch(
  '/orders/:id/status',
  protect,
  authorize('vendor'),
  validateObjectIdParam('id'),
  validateBody(vendorOrderStatusSchema),
  updateVendorOrderStatus
);
router.get('/stats', protect, authorize('vendor'), getVendorStats);

export default router;
