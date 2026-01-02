import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import path from 'path';

import Category from './../models/category.model.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './factoryHandler.js';
import { catchAsync } from '../utils/catchAsync.js';
import { uploadSingleImage } from '../middlewares/uploadImage.middleware.js';

// @desc         Middleware to upload single image
export const uploadImage = uploadSingleImage('image');

// @desc         Middleware to resize image
export const resizeImage = catchAsync(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.resolve(`src/uploads/categories/${filename}`));

    // Store image name into db
    req.body.image = filename;
  }

  next();
});

// @desc         Create new category
// @route        POST     /api/v1/categories
// @access       Protected/admin-manager
export const createCategory = createOne(Category);

// @desc          Get all categories
// @route         GET     /api/v1/categories
// @access        Public
export const getAllCategories = getAll(Category);

// @desc          Get specific category
// @route         GET     /api/v1/categories/:id
// @access        Public
export const getCategory = getOne(Category);

// @desc          Update specific category
// @route         PATCH     /api/v1/categories/:id
// @access        Protected/admin-manager
export const updateCategory = updateOne(Category);

// @desc          Delete specific category
// @route         DELETE     /api/v1/categories/:id
// @access        Protected/admin-manager
export const deleteCategory = deleteOne(Category);
