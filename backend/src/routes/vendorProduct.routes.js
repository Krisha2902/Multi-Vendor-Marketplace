import { Router } from 'express';
import {
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct
} from '../controllers/product.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// All vendor product routes require authentication and approved vendor profile
router.use(protect);

router.get('/', getVendorProducts);
router.post('/', createVendorProduct);
router.put('/:id', updateVendorProduct);
router.delete('/:id', deleteVendorProduct);

export default router;

