// routes/admin.routes.js
import { Router } from 'express';
import { getAllClients } from '../controllers/admin.controllers.js';
import { getAllProducts, createProduct, updateProduct } from '../controllers/product.controllers.js';
import userMiddleware from '../middleware/users.js';

const router = Router();

router.use(userMiddleware.isLoggedIn, userMiddleware.isAdmin);

router.get('/clients', getAllClients);
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);

export default router;