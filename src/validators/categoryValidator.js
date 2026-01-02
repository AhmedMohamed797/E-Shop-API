import { check } from 'express-validator';
import { validationResultMiddleware } from '../middlewares/validation.middleware.js';
import slugify from 'slugify';

export const createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isString()
    .withMessage('Category name must be string')
    .isLength({ min: 2 })
    .withMessage('Category name should be at least 2 characters'),
  validationResultMiddleware,
];

export const updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),

  check('name')
    .optional()
    .isString()
    .withMessage('Category name must be string')
    .isLength({ min: 2 })
    .withMessage('Category name should be at least 2 characters')
    .custom((val, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(val, { lower: true, trim: true });
      }

      return true;
    }),
  validationResultMiddleware,
];

export const checkCategoryIdValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validationResultMiddleware,
];
