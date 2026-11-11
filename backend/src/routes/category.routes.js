import { Router } from 'express';
import { 
  getAllCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/category.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validateBody, validateObjectIdParam } from '../middlewares/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validations/schemas.js';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Admin-only CRUD routes
router.post('/', protect, authorize('admin'), validateBody(createCategorySchema), createCategory);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  validateObjectIdParam('id'),
  validateBody(updateCategorySchema),
  updateCategory
);
router.delete('/:id', protect, authorize('admin'), validateObjectIdParam('id'), deleteCategory);

export default router;

