import { Router } from 'express';
import { getAllProducts, searchProducts, createProduct, updateProduct } from '../controllers/product.controllers.js';
import userMiddleware from '../middleware/users.js';

const router = Router();


router.get('/', userMiddleware.isLoggedIn, getAllProducts);
router.get('/search', userMiddleware.isLoggedIn, searchProducts);

router.post('/', userMiddleware.isLoggedIn, userMiddleware.isAdmin, createProduct);
router.put('/:id', userMiddleware.isLoggedIn, userMiddleware.isAdmin, updateProduct);

export default router;