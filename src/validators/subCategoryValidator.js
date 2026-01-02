import { check } from 'express-validator';
import { validationResultMiddleware } from '../middlewares/validation.middleware.js';
import slugify from 'slugify';
import Category from './../models/category.model.js';
import { AppError } from '../utils/appError.js';

export const createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isString()
    .withMessage('Category name must be string')
    .isLength({ min: 2 })
    .withMessage('Category name should be at least 2 characters'),

  check('category')
    .notEmpty()
    .withMessage(
      'Subcategory must belong to category using category id'
    )
    .isMongoId()
    .withMessage('category property should be valid id')
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new AppError(`There is no category with that id`, 400);
      }
      return true;
    }),

  validationResultMiddleware,
];

export const updateSubCategoryValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid sub category id format'),

  check('name')
    .optional()
    .isString()
    .withMessage('Sub Category name must be string')
    .isLength({ min: 2 })
    .withMessage('Sub Category name should be at least 2 characters')
    .custom((val, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(val, { lower: true, trim: true });
      }
      return true;
    }),

  check('category')
    .optional()
    .isMongoId()
    .withMessage('category property should be valid id')
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new AppError(`There is no category with that id`, 400);
      }
      return true;
    }),
  validationResultMiddleware,
];

export const checkSubCategoryIdValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid sub category id format'),
  validationResultMiddleware,
];
