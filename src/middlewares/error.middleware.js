import { AppError } from '../utils/appError.js';

const handleDuplicateField = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  return new AppError(err, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError(`Invalid token, please login again`, 401);
};

const handleTokenExpiredError = () => {
  return new AppError(`Token expired, please login again`, 401);
};

const sendErrorToDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.statusMsg,
    message: err.message || 'Internal Server Error',
    error: err,
    stack: err.stack,
  });
};

const sendErrorToProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusMsg,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    console.error('Error', err);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error!',
    });
  }
};

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.statusMsg = err.statusMsg || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorToDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // 1) Handle duplicated value
    if (err.code === 11000) {
      err = handleDuplicateField(err);
    }

    // 2) Handle Validation Error
    if (err.name === 'ValidationError') {
      err = handleValidationError(err);
    }

    // 3) Handle Json Web Token Error
    if (err.name === 'JsonWebTokenError')
      err = handleJsonWebTokenError();

    // 4) Handle Token Expired Error
    if (err.name === 'TokenExpiredError')
      err = handleTokenExpiredError();

    sendErrorToProd(err, res);
  }
};
