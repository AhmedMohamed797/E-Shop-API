import { Router } from 'express';
const router = Router({ mergeParams: true });

import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from '../controllers/brand.controller.js';
import {
  checkBrandIdValidator,
  createBrandValidator,
  updateBrandValidator,
} from '../validators/brandValidator.js';
import { filterObj } from '../controllers/brand.controller.js';
import {
  allowedTo,
  protect,
} from './../controllers/auth.controller.js';
import {
  uploadImage,
  resizeImage,
} from '../controllers/brand.controller.js';

router
  .route('/')
  .get(filterObj, getAllBrands)
  .post(
    protect,
    allowedTo('admin', 'manager'),
    uploadImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );

router
  .route('/:id')
  .get(checkBrandIdValidator, getBrand)
  .patch(
    protect,
    allowedTo('admin', 'manager'),
    uploadImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    protect,
    allowedTo('admin', 'manager'),
    checkBrandIdValidator,
    deleteBrand
  );

export default router;
