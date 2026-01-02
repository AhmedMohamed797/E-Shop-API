import path from 'path';

import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import Brand from './../models/brand.model.js';
import { catchAsync } from './../utils/catchAsync.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './factoryHandler.js';
import { uploadSingleImage } from '../middlewares/uploadImage.middleware.js';

// @desc         Middleware to upload single image
export const uploadImage = uploadSingleImage('image');

// @desc         Middleware to resize image
export const resizeImage = catchAsync(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.resolve(`src/uploads/brands/${filename}`));

    // Store image name into db
    req.body.image = filename;
  }

  next();
});

// @desc         Create new brand
// @route        POST     /api/v1/brands
// @access       Protected/admin-manager
export const createBrand = createOne(Brand);

// @desc        Middleware to filter results to get brands based on subcategory
export const filterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.subCategoryId) {
    filterObj = { subCategories: req.params.subCategoryId };
  }
  req.filterObj = filterObj;
  next();
};

// @desc          Get all brands
// @route         GET     /api/v1/brands
// @access        Public
export const getAllBrands = getAll(Brand);

// @desc          Get specific brand
// @route         GET     /api/v1/brands/:id
// @access        Public
export const getBrand = getOne(Brand);

// @desc          Update specific brand
// @route         PATCH     /api/v1/brands/:id
// @access        Protected/admin-manager
export const updateBrand = updateOne(Brand);

// @desc          Delete specific brand
// @route         DELETE     /api/v1/brands/:id
// @access        Protected/admin-manager
export const deleteBrand = deleteOne(Brand);
