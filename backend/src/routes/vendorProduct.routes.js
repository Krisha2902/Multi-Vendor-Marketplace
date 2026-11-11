import { Router } from 'express';
import {
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validateBody, validateObjectIdParam } from '../middlewares/validate.js';
import { createProductSchema, updateProductSchema } from '../validations/schemas.js';

const router = Router();

// All vendor product routes require authentication and approved vendor profile
router.use(protect, authorize('vendor'));

router.get('/', getVendorProducts);
router.post('/', validateBody(createProductSchema), createVendorProduct);
router.put('/:id', validateObjectIdParam('id'), validateBody(updateProductSchema), updateVendorProduct);
router.delete('/:id', validateObjectIdParam('id'), deleteVendorProduct);

export default router;

