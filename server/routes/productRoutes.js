import express from 'express';
import {
  getProducts,
  getProductById,
  getProductCategories,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/meta/categories', getProductCategories);
router.get('/:id', getProductById);

export default router;
