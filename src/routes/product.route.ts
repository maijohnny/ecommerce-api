import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/product.controller';
import { isAuthenticated, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

// လမ်းကြောင်း /products
router.route('/')
    .get(getProducts)
    .post(isAuthenticated, authorizeRoles([1, 2]), createProduct);

// လမ်းကြောင်း /products/:id
router.route('/:id')
    .patch(isAuthenticated, authorizeRoles([1, 2]), updateProduct)
    .delete(isAuthenticated, authorizeRoles([2]), deleteProduct);

export default router;