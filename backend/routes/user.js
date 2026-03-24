import express from 'express';
import {
  getUser,
  updateUser,
  getWishlist,
  updateWishlist,
} from '../controllers/userController.js';
import {
  verifyToken,
  verifyTokenAndAuthorization,
} from './verifyToken.js';

const router = express.Router();

// user profile endpoints
router.get('/:id', verifyTokenAndAuthorization, getUser);
router.put('/:id', verifyTokenAndAuthorization, updateUser);

// wishlist
router.get('/:id/wishlist', verifyTokenAndAuthorization, getWishlist);
router.put('/:id/wishlist', verifyTokenAndAuthorization, updateWishlist);


export default router;