import { Router } from 'express';
import {
  listVendors,
  approveVendor,
  rejectVendor,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Only admin can access these endpoints
router.use(protect, authorize('admin'));

router.get('/vendors', listVendors);
router.patch('/vendors/:id/approve', approveVendor);
router.patch('/vendors/:id/reject', rejectVendor);

export default router;
