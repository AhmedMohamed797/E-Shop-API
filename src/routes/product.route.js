import { Router } from 'express';
const router = Router();

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  resizeProductImage,
  updateProduct,
  uploadProductImage,
} from '../controllers/product.controller.js';
import {
  protect,
  allowedTo,
} from './../controllers/auth.controller.js';
import {
  checkProductIdValidator,
  createProductValidator,
  updateProductValidator,
} from '../validators/productValidator.js';

import reviewRoute from './review.route.js';

//* Nested Route
router.use('/:productId/reviews', reviewRoute);

router
  .route('/')
  .get(getAllProducts)
  .post(
    protect,
    allowedTo('admin', 'manager'),
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    createProduct
  );

router
  .route('/:id')
  .get(checkProductIdValidator, getProduct)
  .patch(
    protect,
    allowedTo('admin', 'manager'),
    uploadProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    protect,
    allowedTo('admin', 'manager'),
    checkProductIdValidator,
    deleteProduct
  );

export default router;
