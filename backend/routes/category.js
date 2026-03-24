import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { verifyTokenAndAdmin } from './verifyToken.js';

const router = express.Router();

router.post('/', verifyTokenAndAdmin, createCategory);
router.get('/', getCategories);
router.put('/:id', verifyTokenAndAdmin, updateCategory);
router.delete('/:id', verifyTokenAndAdmin, deleteCategory);

export default router;