import { check } from 'express-validator';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

import { validationResultMiddleware } from '../middlewares/validation.middleware.js';
import { AppError } from '../utils/appError.js';
import User from '../models/user.model.js';

export const createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name is required')
    .isString()
    .withMessage('User name must be string')
    .isLength({ min: 3 })
    .withMessage('User name should be at least 3 characters'),
  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid user email address'),

  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    })
    .withMessage(
      'Password must be at least 8 characters and include lowercase, number'
    ),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new AppError(
          `Confirm password does not match the password`,
          400
        );
      }

      return true;
    }),
  validationResultMiddleware,
];

export const updateUserValidator = [
  check('id')
    .optional()
    .isMongoId()
    .withMessage('Invalid user id format'),

  check('name')
    .optional()
    .isString()
    .withMessage('User name must be string')
    .isLength({ min: 3 })
    .withMessage('User name should be at least 3 characters')
    .custom((val, { req }) => {
      if (req.body.name) {
        req.body.slug = slugify(val, { lower: true, trim: true });
      }

      return true;
    }),

  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid user email address'),
  validationResultMiddleware,
];

export const checkUserIdValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),
  validationResultMiddleware,
];

export const updatePasswordValidator = [
  check('id').isMongoId().withMessage('Invalid user id format'),

  check('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .custom(async (val, { req }) => {
      // 1) Get current user password
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new AppError(`There is no user with that id`, 404);
      }

      // 2) Check if current password is valid
      const compare = await bcrypt.compare(val, user.password);

      if (!compare) {
        throw new AppError('Current password is invalid', 400);
      }

      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    })
    .withMessage(
      'Password must be at least 8 characters and include lowercase, number'
    ),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new AppError(
          `Confirm password does not match the password`,
          400
        );
      }

      return true;
    }),

  validationResultMiddleware,
];

export const changePasswordValidator = [
  check('currentPassword')
    .notEmpty()
    .withMessage('Current password is required')
    .custom(async (val, { req }) => {
      // 1) Get current user password
      const user = await User.findById(req.user.id);

      if (!user) {
        throw new AppError(`There is no user with that id`, 404);
      }

      // 2) Check if current password is valid
      const compare = await bcrypt.compare(val, user.password);

      if (!compare) {
        throw new AppError('Current password is invalid', 400);
      }

      return true;
    }),

  check('password')
    .notEmpty()
    .withMessage('User password is required')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    })
    .withMessage(
      'Password must be at least 8 characters and include lowercase, number'
    ),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new AppError(
          `Confirm password does not match the password`,
          400
        );
      }

      return true;
    }),

  validationResultMiddleware,
];
