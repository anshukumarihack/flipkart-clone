import express from 'express';
import { createReview, getReviewsByProduct, deleteReview } from '../controllers/reviewController.js';
import { verifyToken, verifyTokenAndAdmin } from './verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createReview); // user posts review
router.get('/product/:productId', getReviewsByProduct);
router.delete('/:id', verifyTokenAndAdmin, deleteReview);

export default router;