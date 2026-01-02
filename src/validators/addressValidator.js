import { check } from 'express-validator';
import { validationResultMiddleware } from './../middlewares/validation.middleware.js';

export const createAddressValidator = [
  check('city').notEmpty().withMessage('City is required'),

  check('details')
    .notEmpty()
    .withMessage('Details is required')
    .isLength({ min: 8 })
    .withMessage('Details should be at least 8 chars'),

  check('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .isMobilePhone('ar-EG')
    .withMessage('Accept only egyptian numbers'),

  validationResultMiddleware,
];

export const deleteAddressValidator = [
  check('id').isMongoId().withMessage('Invalid address id format'),

  validationResultMiddleware,
];
