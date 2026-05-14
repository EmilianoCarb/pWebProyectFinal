import { Router } from 'express';
import { getMyOrders, createOrder } from '../controllers/order.controllers.js';
import userMiddleware from '../middleware/users.js';

const router = Router();

router.get('/', userMiddleware.isLoggedIn, getMyOrders);
router.post('/', userMiddleware.isLoggedIn, createOrder);

export default router;