import path from 'path';

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

import User from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';
import { uploadSingleImage } from './../middlewares/uploadImage.middleware.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
} from './factoryHandler.js';
import { signToken } from '../utils/signToken.js';

// @desc         Middleware to upload single image
export const uploadProfileImage = uploadSingleImage('profileImg');

// @desc         Middleware to resize image
export const resizeProfileImage = catchAsync(
  async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(path.resolve(`src/uploads/users/${filename}`));

      // Store image name into db
      req.body.profileImg = filename;
    }

    next();
  }
);

// @desc         Create new user
// @route        POST     /api/v1/users
// @access       Protected/admin-manager
export const createUser = createOne(User);

// @desc         Get list of users
// @route        GET     /api/v1/users
// @access       Protected/admin-manager
export const getAllUsers = getAll(User);

// @desc         Get specific user
// @route        GET     /api/v1/users/:id
// @access       Protected/admin-manager
export const getUser = getOne(User);

// @desc         Update specific user
// @route        PATCH     /api/v1/users/:id
// @access       Protected/admin-manager
export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      slug: req.body.slug,
      role: req.body.role,
      active: req.body.active,
      profileImg: req.body.profileImg,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!user) {
    return next(new AppError(`There's no user with that id`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// @desc         Update specific user password
// @route        PATCH     /api/v1/users/update-password/:id
// @access       Protected/admin-manager
export const updateUserPassword = catchAsync(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!user) {
      return next(new AppError(`There's no user with that id`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
);

// @desc         Delete specific user
// @route        DELETE    /api/v1/users/:id
// @access       Protected/admin-manager
export const deleteUser = deleteOne(User);

// @desc         Get logged user data
// @route        GET    /api/v1/users
// @access       Protected
export const getLoggedUserData = catchAsync(
  async (req, res, next) => {
    req.params.id = req.user.id;
    next();
  }
);

// @desc         change Logged User Password
// @route        PATCH     /api/v1/users/change-password
// @access       Protected
export const changeLoggedUserPassword = catchAsync(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        runValidators: true,
        new: true,
      }
    );

    // 2) generate new token
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  }
);

// @desc         Update Logged User data
// @route        PATCH     /api/v1/users/updateMe
// @access       Protected
export const updateLoggedUserData = catchAsync(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
        slug: req.body.slug,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  }
);

// @desc         Delete Logged User
// @route        DELETE     /api/v1/users/deleteMe
// @access       Protected
export const deleteLoggedUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(204).json({ status: 'success' });
});

// @desc         Update profile img
// @route        PATCH     /api/v1/users/update-profile-img
// @access       Protected
export const updateProfileImg = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
