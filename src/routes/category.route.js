import { Router } from 'express';
const router = Router();

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  resizeImage,
  updateCategory,
  uploadImage,
} from '../controllers/category.controller.js';
import {
  checkCategoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from '../validators/categoryValidator.js';

import subCategoryRouter from './subCategory.route.js';
import {
  allowedTo,
  protect,
} from '../controllers/auth.controller.js';

//* Nested route
router.use('/:categoryId/sub-categories', subCategoryRouter);

router
  .route('/')
  .get(getAllCategories)
  .post(
    protect,
    allowedTo('admin', 'manager'),
    uploadImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route('/:id')
  .get(checkCategoryIdValidator, getCategory)
  .patch(
    protect,
    allowedTo('admin', 'manager'),
    uploadImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protect,
    allowedTo('admin', 'manager'),
    checkCategoryIdValidator,
    deleteCategory
  );

export default router;
