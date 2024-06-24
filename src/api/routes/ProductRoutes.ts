import { Router } from 'express';
import { container } from 'tsyringe';
import { ProductController } from '../../application/controllers/ProductController';

const router = Router();
const productController = container.resolve(ProductController);

router.post('/products', (req, res) => productController.createProduct(req, res));
router.get('/products', (req, res) => productController.getAllProducts(req, res));
router.get('/products/:id', (req, res) => productController.getProductById(req, res));
router.delete('/products/:id', (req, res) => productController.deleteProduct(req, res));

export default router;
