import { Router } from 'express';
const router = Router({ mergeParams: true });

import {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  filterObj,
} from '../controllers/subCategory.controller.js';
import {
  checkSubCategoryIdValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
} from '../validators/subCategoryValidator.js';

import brandRouter from './brand.route.js';
import {
  allowedTo,
  protect,
} from '../controllers/auth.controller.js';

//* Nested route
router.use('/:subCategoryId/brands', brandRouter);

router
  .route('/')
  .post(
    protect,
    allowedTo('admin', 'manager'),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(filterObj, getAllSubCategories);

router
  .route('/:id')
  .get(checkSubCategoryIdValidator, getSubCategory)
  .patch(
    protect,
    allowedTo('admin', 'manager'),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    allowedTo('admin', 'manager'),
    checkSubCategoryIdValidator,
    deleteSubCategory
  );

export default router;
