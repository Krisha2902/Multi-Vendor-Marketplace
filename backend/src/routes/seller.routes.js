
import { Router } from 'express';

import {
  getPublicSellers,
  getPublicSeller,
} from '../controllers/publicSeller.controller.js';

const router = Router();

router.get('/', getPublicSellers);

router.get('/:id', getPublicSeller);

export default router;
