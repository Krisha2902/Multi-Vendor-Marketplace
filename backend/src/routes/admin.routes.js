import { Router } from 'express';
import {
  getStats,
  listVendors,
  approveVendor,
  rejectVendor,
  suspendVendor,
  activateVendor,
  listCategories,
  listOrders,
  listUsers,
  updateUserStatus,
} from '../controllers/admin.controller.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validateBody, validateObjectIdParam } from '../middlewares/validate.js';
import {
  reasonOptionalSchema,
  createCategorySchema,
  updateCategorySchema,
  userStatusSchema,
} from '../validations/schemas.js';

const router = Router();

// Only admin can access these endpoints
router.use(protect, authorize('admin'));

// Overview stats
router.get('/stats', getStats);

// Vendor management
router.get('/vendors', listVendors);
router.patch('/vendors/:id/approve', validateObjectIdParam('id'), approveVendor);
router.patch(
  '/vendors/:id/reject',
  validateObjectIdParam('id'),
  validateBody(reasonOptionalSchema),
  rejectVendor
);
router.patch(
  '/vendors/:id/suspend',
  validateObjectIdParam('id'),
  validateBody(reasonOptionalSchema),
  suspendVendor
);
router.patch('/vendors/:id/activate', validateObjectIdParam('id'), activateVendor);

// Category management
router.get('/categories', listCategories);
router.post('/categories', validateBody(createCategorySchema), createCategory);
router.put(
  '/categories/:id',
  validateObjectIdParam('id'),
  validateBody(updateCategorySchema),
  updateCategory
);
router.delete('/categories/:id', validateObjectIdParam('id'), deleteCategory);

// Order monitoring
router.get('/orders', listOrders);

// User management
router.get('/users', listUsers);
router.patch(
  '/users/:id/status',
  validateObjectIdParam('id'),
  validateBody(userStatusSchema),
  updateUserStatus
);

export default router;
