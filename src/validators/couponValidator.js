import { check } from 'express-validator';
import { validationResultMiddleware } from './../middlewares/validation.middleware.js';

export const createCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('Coupon name is required')
    .isUppercase()
    .withMessage('Coupon name must be uppercase'),

  check('expires')
    .notEmpty()
    .withMessage('Coupon expires date is required')
    .isDate()
    .withMessage('Coupon must be a date'),

  check('discount')
    .notEmpty()
    .withMessage('Coupon discount number is required')
    .isNumeric()
    .withMessage('Coupon discount number must be numeric value'),

  validationResultMiddleware,
];

export const updateCouponValidator = [
  check('id').isMongoId().withMessage('Invalid coupon id format'),

  check('name')
    .optional()
    .isUppercase()
    .withMessage('Coupon name must be uppercase'),

  check('expires')
    .optional()
    .isDate()
    .withMessage('Coupon must be a date'),

  check('discount')
    .optional()
    .isNumeric()
    .withMessage('Coupon discount number must be numeric value'),

  validationResultMiddleware,
];

export const checkCouponIdValidator = [
  check('id').isMongoId().withMessage('Invalid coupon id format'),
  validationResultMiddleware,
];
