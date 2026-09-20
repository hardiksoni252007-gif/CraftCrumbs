import express from 'express';
import { getMyOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

export default router;
