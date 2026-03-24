import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
} from '../controllers/productController.js';
import {
  verifyToken,
  verifyTokenAndAdmin,
} from './verifyToken.js';

const router = express.Router();

// create product (admin only)
router.post('/', verifyTokenAndAdmin, createProduct);
// update
router.put('/:id', verifyTokenAndAdmin, updateProduct);
// delete
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);
// get
router.get('/find/:id', getProduct);
// get all
router.get('/', getAllProducts);

export default router;
