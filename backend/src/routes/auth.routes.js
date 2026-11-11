import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validateBody } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validations/schemas.js';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.get('/me', protect, me);

export default router;