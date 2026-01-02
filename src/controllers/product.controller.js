import path from 'path';

import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import Product from '../models/product.model.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './factoryHandler.js';
import { catchAsync } from '../utils/catchAsync.js';
import { uploadListOfImages } from '../middlewares/uploadImage.middleware.js';

// @desc         Middleware to upload image
export const uploadProductImage = uploadListOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

// @desc         Middleware to resize image
export const resizeProductImage = catchAsync(
  async (req, res, next) => {
    if (req.files.imageCover) {
      // 1) image processing for image cover
      const coverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(
          path.resolve(`src/uploads/products/${coverFileName}`)
        );

      // Store imageCover name into db
      req.body.imageCover = coverFileName;
    }

    // 2) image processing for images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (image, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;
          await sharp(image.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(
              path.resolve(`src/uploads/products/${imageName}`)
            );

          // Store image name into db
          req.body.images.push(imageName);
        })
      );
    }

    next();
  }
);

// @desc         Create new product
// @route        POST     /api/v1/products
// @access       Protected/admin-manager
export const createProduct = createOne(Product);

// @desc         Get all products
// @route        GET     /api/v1/products
// @access       Public
export const getAllProducts = getAll(Product);

// @desc         Get specific product
// @route        GET     /api/v1/products/:id
// @access       Public
export const getProduct = getOne(Product);

// @desc         Update specific product
// @route        PATCH     /api/v1/products/:id
// @access       Protected/admin-manager
export const updateProduct = updateOne(Product);

// @desc         Delete specific product
// @route        DELETE     /api/v1/products/:id
// @access       Protected/admin-manager
export const deleteProduct = deleteOne(Product);
