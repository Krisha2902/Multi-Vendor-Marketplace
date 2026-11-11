import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.js';
import { validateBody, validateObjectIdParam } from '../middlewares/validate.js';
import { createOrderSchema } from '../validations/schemas.js';

const router = Router();

// All order endpoints require user to be logged in
router.use(protect);

router.post('/', validateBody(createOrderSchema), createOrder);
router.get('/my', getMyOrders);
router.get('/:id', validateObjectIdParam('id'), getOrderById);

export default router;

