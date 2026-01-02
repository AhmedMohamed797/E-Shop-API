import SubCategory from '../models/subCategory.model.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './factoryHandler.js';

// @desc     Middleware to set categoryId param to category property in body
export const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// @desc          Create sub category
// @route         POST     /api/v1/sub-categories
// @access        Protected/admin-manager
export const createSubCategory = createOne(SubCategory);

// @desc    filterObj to filter results for nested route
export const filterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
  }
  req.filterObj = filterObj;
  next();
};

// @desc          Get all sub categories
// @route         GET     /api/v1/sub-categories
// @access        Public
export const getAllSubCategories = getAll(SubCategory);

// @desc          Get specific sub category
// @route         GET     /api/v1/sub-categories/:id
// @access        Public
export const getSubCategory = getOne(SubCategory);

// @desc          Update specific sub category
// @route         PATCH     /api/v1/sub-categories/:id
// @access        Protected/admin-manager
export const updateSubCategory = updateOne(SubCategory);

// @desc          Delete specific sub category
// @route         DELETE     /api/v1/sub-categories/:id
// @access        Protected/admin-manager
export const deleteSubCategory = deleteOne(SubCategory);
