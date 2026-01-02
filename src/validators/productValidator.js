import { check } from 'express-validator';
import slugify from 'slugify';

import { validationResultMiddleware } from '../middlewares/validation.middleware.js';
import SubCategory from './../models/subCategory.model.js';
import { AppError } from '../utils/appError.js';
import Category from './../models/category.model.js';
import Brand from './../models/brand.model.js';
import Product from '../models/product.model.js';

export const createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('Product title is required')
    .isString()
    .withMessage('Product title must be string')
    .isLength({ min: 3 })
    .withMessage('Product name should be at least 3 characters'),

  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 20 })
    .withMessage(`Product description is too short`),

  check('quantity')
    .notEmpty()
    .withMessage(`Product quantity is required`)
    .isLength({ min: 0 })
    .withMessage(`Quantity cannot be negative`),

  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Product sold should be a numeric value'),

  check('price')
    .notEmpty()
    .withMessage(`Product price is required`)
    .isNumeric()
    .withMessage(`Product price should be a numeric value`),

  check('priceAfterDiscount')
    .optional()
    .custom((val, { req }) => {
      if (req.body.price && val * 1 >= req.body.price) {
        throw new AppError(
          'Price after discount must be lower than price',
          400
        );
      }
      return true;
    }),

  check('colors')
    .optional()
    .isArray()
    .withMessage('Product colors should be array of strings'),

  check('imageCover')
    .notEmpty()
    .withMessage('Product cover image is required')
    .isString()
    .withMessage('Product cover image should be string'),

  check('images')
    .optional()
    .isArray()
    .withMessage('Product images should be array of strings'),

  check('category')
    .notEmpty()
    .withMessage('Product must belong to a category')
    .isMongoId()
    .withMessage('Category id format is invalid')
    .custom(async (id) => {
      const category = await Category.findById(id);
      if (!category) {
        throw new AppError(`There's no category with this id`);
      }
      return true;
    }),

  check('subcategories')
    .optional()
    .isMongoId()
    .withMessage(`Subcategories's ids format is invalid`)
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
    })
    .custom(async (subcategoriesIdsBody, { req }) => {
      // 1) Get all subcategories related to category
      const subCategories = await SubCategory.find({
        category: req.body.category,
      });

      // 2) Get all subcategories ids
      let subcategoriesIdsInDB = [];
      subCategories.forEach((item) =>
        subcategoriesIdsInDB.push(item._id.toString())
      );

      // 3) check if subcategories ids in db include subcategories in req.body (true)
      const checker = subcategoriesIdsBody.every((val) =>
        subcategoriesIdsInDB.includes(val)
      );

      if (!checker) {
        throw new AppError(
          'Subcategories ids not belong to this category'
        );
      }
      return true;
    }),

  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Brand id format is invalid')
    .custom(async (brandId, { req }) => {
      // Only validate if subcategories are provided
      if (
        req.body.subcategories &&
        Array.isArray(req.body.subcategories) &&
        req.body.subcategories.length > 0
      ) {
        // Find the brand by id
        const brand = await Brand.findById(brandId);
        if (!brand) {
          throw new AppError(`There's no brand with this id`);
        }
        // Check if all subcategories in req.body.subcategories are included in brand.subCategories
        const brandSubCategories = (brand.subCategories || []).map(
          (id) => id.toString()
        );
        const allRelated = req.body.subcategories.every((subCatId) =>
          brandSubCategories.includes(subCatId.toString())
        );
        if (!allRelated) {
          throw new AppError(
            'Brand is not related to all provided subcategories',
            400
          );
        }
      }
      return true;
    }),

  validationResultMiddleware,
];

export const updateProductValidator = [
  check('id').isMongoId().withMessage('Invalid product id format'),

  check('title')
    .optional()
    .isString()
    .withMessage('Product title must be string')
    .isLength({ min: 3 })
    .withMessage('Product name should be at least 3 characters')
    .custom((val, { req }) => {
      if (req.body.title) {
        req.body.slug = slugify(val, {
          lower: true,
          trim: true,
          strict: true,
        });
        return true;
      }
    }),

  check('description')
    .optional()
    .isLength({ min: 20 })
    .withMessage(`Product description is too short`),

  check('quantity')
    .optional()
    .isLength({ min: 0 })
    .withMessage(`Quantity cannot be negative`),

  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Product sold should be a numeric value'),

  check('price')
    .optional()
    .isNumeric()
    .withMessage(`Product price should be a numeric value`),

  check('priceAfterDiscount')
    .optional()
    .custom(async (val, { req }) => {
      const product = await Product.findById(req.params.id);

      if (val * 1 >= product.price) {
        throw new AppError(
          'Product price after discount must be lower than price',
          400
        );
      }
      return true;
    }),

  ,
  check('colors')
    .optional()
    .isArray()
    .withMessage('Product colors should be array of strings'),

  check('imageCover')
    .optional()
    .isString()
    .withMessage('Product cover image should be string'),

  check('images')
    .optional()
    .isArray()
    .withMessage('Product images should be array of strings'),

  check('category')
    .optional()
    .isMongoId()
    .withMessage('Category id format is invalid')
    .custom(async (id) => {
      const category = await Category.findById(id);
      if (!category) {
        throw new AppError(`There's no category with this id`);
      }
      return true;
    }),

  check('subcategories')
    .optional()
    .isMongoId()
    .withMessage(`Subcategories's ids format is invalid`)
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
    })
    .custom(async (subcategoriesIdsBody, { req }) => {
      // 1) Get all subcategories related to category
      const subCategories = await SubCategory.find({
        category: req.body.category,
      });

      // 2) Get all subcategories ids
      let subcategoriesIdsInDB = [];
      subCategories.forEach((item) =>
        subcategoriesIdsInDB.push(item._id.toString())
      );

      // 3) check if subcategories ids in db include subcategories in req.body (true)
      const checker = subcategoriesIdsBody.every((val) =>
        subcategoriesIdsInDB.includes(val)
      );

      if (!checker) {
        throw new AppError(
          'Subcategories ids not belong to this category'
        );
      }
      return true;
    }),

  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Brand id format is invalid')
    .custom(async (brandId, { req }) => {
      // Only validate if subcategories are provided
      if (
        req.body.subcategories &&
        Array.isArray(req.body.subcategories) &&
        req.body.subcategories.length > 0
      ) {
        // Find the brand by id
        const brand = await Brand.findById(brandId);
        if (!brand) {
          throw new AppError(`There's no brand with this id`);
        }
        // Check if all subcategories in req.body.subcategories are included in brand.subCategories
        const brandSubCategories = (brand.subCategories || []).map(
          (id) => id.toString()
        );
        const allRelated = req.body.subcategories.every((subCatId) =>
          brandSubCategories.includes(subCatId.toString())
        );
        if (!allRelated) {
          throw new AppError(
            'Brand is not related to all provided subcategories',
            400
          );
        }
      }
      return true;
    }),

  validationResultMiddleware,
];

export const checkProductIdValidator = [
  check('id').isMongoId().withMessage('Invalid product id format'),
  validationResultMiddleware,
];
