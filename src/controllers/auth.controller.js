import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import User from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { sendEmail } from '../utils/sendEmail.js';
import { signToken } from '../utils/signToken.js';
import { sanitizeUser } from '../utils/sanitizeUser.js';

// @desc         Signup new user
// @route        POST     /api/v1/auth/signup
// @access       Public
export const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: sanitizeUser(user),
  });
});

// @desc         Login user
// @route        POST     /api/v1/auth/login
// @access       Public
export const login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (
    !user ||
    !(await bcrypt.compare(req.body.password, user.password))
  ) {
    return next(new AppError(`Invalid email or password`, 401));
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
  });
});

// @desc         Protect middleware for routes to make sure user is logged in
export const protect = catchAsync(async (req, res, next) => {
  // 1) Check If Token Exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in, please login`, 401)
    );
  }

  // 2) Verify token(no changes happened)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if token for user exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'This user that belong to this token does not longer exist',
        404
      )
    );
  }

  // 4) Check if user change password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    // password changed after token created
    if (passChangedTimeStamp > decoded.iat) {
      return next(
        new AppError(
          `User recently changed his password, please login again`,
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc         Middleware to gives permissions
export const allowedTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You are not allowed to access this route`, 403)
      );
    }
    next();
  });

// @desc         Forget password
// @route        POST     /api/v1/auth/forget-password
// @access       Public
export const forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(`There is no user with that email`, 400)
    );
  }

  // 2) If user exist generate resetCode
  const resetCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // 3) Save hashedResetCode into DB
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 4) Send reset code via email
  const message = `Hello ${user.name},\n\nYou have requested to reset your password.\n\nYour password reset code is: ${resetCode}\n\nThis code is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      to: req.body.email,
      subject: 'Your Password Reset Code valid for [10 minutes]',
      text: message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    return next(
      new AppError(
        'There was an error sending the email. Try again later.',
        500
      )
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Reset code send successfully',
  });
});

// @desc         Verify reset password code
// @route        POST     /api/v1/auth/verify-reset-code
// @access       Public
export const verifyResetPasswordCode = catchAsync(
  async (req, res, next) => {
    // 1) get code and hash it
    const hashedCode = crypto
      .createHash('sha256')
      .update(req.body.resetCode)
      .digest('hex');

    // 2) get user based on hashed code
    const user = await User.findOne({
      passwordResetCode: hashedCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppError('Reset code is invalid or expired', 400)
      );
    }

    // 3) if reset code is verified
    user.passwordResetVerified = true;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Reset code verified successfully',
    });
  }
);

// @desc         Rest password
// @route        PATCH     /api/v1/auth/reset-password
// @access       Public
export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({
    email,
    passwordResetVerified: true,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError('Invalid or expired reset request', 400)
    );
  }

  // Set new password
  user.password = newPassword;

  // Clear reset fields
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});
