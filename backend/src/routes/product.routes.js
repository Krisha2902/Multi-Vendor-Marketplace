import { Router } from 'express';

import {
  getPublicProducts,
  getPublicProductById,
  getFeaturedProducts,
  getNewArrivals
} from '../controllers/publicProduct.controller.js';
const router = Router();

// Specific routes first
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);

// General routes
router.get('/', getPublicProducts);
router.get('/:id', getPublicProductById);

export default router;