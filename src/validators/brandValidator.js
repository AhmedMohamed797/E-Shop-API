import { check } from 'express-validator';
import { validationResultMiddleware } from '../middlewares/validation.middleware.js';
import slugify from 'slugify';
import SubCategory from './../models/subCategory.model.js';
import { AppError } from '../utils/appError.js';

export const createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .isString()
    .withMessage('Brand name must be string')
    .isLength({ min: 2 })
    .withMessage('Brand name should be at least 2 characters'),

  check('subCategories')
    .notEmpty()
    .withMessage('brand must belong to one or more subcategories')
    .isMongoId()
    .withMessage('Invalid subcategories ids format')
    .custom(async (val) => {
      const seenIds = [];
      for (const id of val) {
        if (seenIds.includes(id)) {
          throw new AppError(
            `Subcategories ids shouldn't be duplicated`,
            400
          );
        }
        seenIds.push(id);

        const subcategory = await SubCategory.findById(id);
        if (!subcategory) {
          throw new AppError(
            `There's no subcategories with those ids`,
            400
          );
        }
      }
      return true;
    }),
  validationResultMiddleware,
];

export const updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id format'),

  check('name')
    .optional()
    .isString()
    .withMessage('Brand name must be string')
    .isLength({ min: 2 })
    .withMessage('Brand name should be at least 2 characters')
    .custom((val, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(val, { lower: true, trim: true });
      }

      return true;
    }),

  check('subCategories')
    .optional()
    .isMongoId()
    .withMessage('Invalid subcategories ids format')
    .custom(async (val) => {
      const seenIds = [];
      for (const id of val) {
        if (seenIds.includes(id)) {
          throw new AppError(
            `Subcategories ids shouldn't be duplicated`,
            400
          );
        }
        seenIds.push(id);

        const subcategory = await SubCategory.findById(id);
        if (!subcategory) {
          throw new AppError(
            `There's no subcategories with those ids`,
            400
          );
        }
      }
      return true;
    }),
  validationResultMiddleware,
];

export const checkBrandIdValidator = [
  check('id').isMongoId().withMessage('Invalid brand id format'),
  validationResultMiddleware,
];
