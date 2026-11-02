import { Router } from 'express';
import { apply, getMe } from '../controllers/vendor.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/apply', protect, apply);
router.get('/me', protect, getMe);

export default router;
