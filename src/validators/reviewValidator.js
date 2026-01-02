import { check } from 'express-validator';
import { validationResultMiddleware } from '../middlewares/validation.middleware.js';
import Product from './../models/product.model.js';
import { AppError } from '../utils/appError.js';
import Review from '../models/review.model.js';

export const getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid review id format'),
  validationResultMiddleware,
];

export const createReviewValidator = [
  check('rating')
    .notEmpty()
    .withMessage('Review rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Review rating must be between 1.0 : 5.0'),

  check('product')
    .notEmpty()
    .withMessage('Review must belong to a product')
    .isMongoId()
    .withMessage('invalid product id format')
    .custom(async (productId, { req }) => {
      const product = await Product.findById(productId);

      if (!product) {
        throw new AppError(`There is no product with that id`, 404);
      }

      const review = await Review.findOne({
        user: req.user.id,
        product: req.body.product,
      });

      if (review) {
        throw new AppError(
          `Current user added a review on this product before`,
          400
        );
      }

      return true;
    }),

  validationResultMiddleware,
];

export const updateReviewValidator = [
  check('rating')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Review rating must be between 1.0 : 5.0'),

  check('id')
    .notEmpty()
    .withMessage('Review id is required')
    .isMongoId()
    .withMessage('Invalid review id format')
    .custom(async (id, { req }) => {
      // Check if review exists or not
      const review = await Review.findById(id);
      if (!review) {
        throw new AppError('There is no review with that id', 404);
      }

      // Check ownership of review
      if (review.user._id.toString() !== req.user.id.toString()) {
        throw new AppError(
          'You are not allowed to update other reviews',
          401
        );
      }
    }),

  check('product')
    .optional()
    .isMongoId()
    .withMessage('invalid product id format')
    .custom(async (productId) => {
      const product = await Product.findById(productId);

      if (!product) {
        throw new AppError(`There is no product with that id`, 404);
      }

      return true;
    }),

  validationResultMiddleware,
];

export const deleteReviewValidator = [
  check('id')
    .notEmpty()
    .withMessage('Review id is required')
    .isMongoId()
    .withMessage('Invalid review id format')
    .custom(async (id, { req }) => {
      // Check if review exists or not
      const review = await Review.findById(id);
      if (!review) {
        throw new AppError('There is no review with that id', 404);
      }

      // Check ownership of review
      if (review.user._id.toString() !== req.user.id.toString()) {
        throw new AppError(
          'You are not allowed to delete other reviews',
          401
        );
      }
    }),

  validationResultMiddleware,
];
