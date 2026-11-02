import { Router } from 'express';
import { listProducts, getProduct } from '../controllers/product.controller.js';

// Public routes: no login needed.
const router = Router();

router.get('/', listProducts); // GET /api/products?page=1&limit=12&search=&category=
router.get('/:id', getProduct); // GET /api/products/:id

export default router;
