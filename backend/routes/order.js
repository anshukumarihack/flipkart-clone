import express from 'express';
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getAllOrders,
} from '../controllers/orderController.js';
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from './verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.put('/:id', verifyTokenAndAdmin, updateOrder);
router.delete('/:id', verifyTokenAndAdmin, deleteOrder);
router.get('/find/:userId', verifyTokenAndAuthorization, getUserOrders);
router.get('/', verifyTokenAndAdmin, getAllOrders);

export default router;