import express from 'express';
import {
  addToCart,
  updateCart,
  deleteCart,
  getCart,
} from '../controllers/cartController.js';
import {
  verifyToken,
  verifyTokenAndAuthorization,
} from './verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, addToCart);
router.put('/:userId', verifyTokenAndAuthorization, updateCart);
router.delete('/:userId', verifyTokenAndAuthorization, deleteCart);
router.get('/find/:userId', verifyTokenAndAuthorization, getCart);

export default router;
