import { validationResult } from 'express-validator';

export const validationResultMiddleware = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: result.array()[0].msg,
    });
  }
  next();
};
