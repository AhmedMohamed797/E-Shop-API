import { check } from 'express-validator';
import { validationResultMiddleware } from './../middlewares/validation.middleware.js';
import Product from './../models/product.model.js';
import { AppError } from '../utils/appError.js';

export const addToWishlistValidator = [
  check('productId')
    .notEmpty()
    .withMessage('productId is required')
    .isMongoId()
    .withMessage('Invalid productId format')
    .custom(async (id) => {
      const product = await Product.findById(id);

      if (!product) {
        throw new AppError('There is no product with that id', 404);
      }

      return true;
    }),

  validationResultMiddleware,
];

export const deleteProductFromWishlistValidator = [
  check('id')
    .notEmpty()
    .withMessage('Product id is required')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom(async (id) => {
      const product = await Product.findById(id);
      if (!product) {
        throw new AppError('There is no product with that id', 404);
      }
      return true;
    }),

  validationResultMiddleware,
];
