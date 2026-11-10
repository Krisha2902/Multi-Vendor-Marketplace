import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// All order endpoints require user to be logged in
router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

export default router;

