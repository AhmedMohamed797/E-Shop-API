import { check } from 'express-validator';

import User from '../models/user.model.js';
import { AppError } from '../utils/appError.js';
import { validationResultMiddleware } from './../middlewares/validation.middleware.js';

export const signupValidator = [
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
    .withMessage('Invalid user email address')
    .custom(async (val) => {
      const email = await User.findOne({ email: val });
      if (email) {
        throw new AppError(`Email already in use`);
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

export const loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
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
  validationResultMiddleware,
];

export const resetPasswordValidator = [
  check('email')
    .notEmpty()
    .withMessage('User email is required')
    .isEmail()
    .withMessage('Invalid user email address'),

  check('newPassword')
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
      if (val !== req.body.newPassword) {
        throw new AppError(
          `Confirm password does not match the password`,
          400
        );
      }

      return true;
    }),
  validationResultMiddleware,
];
