import Review from '../models/review.model.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './factoryHandler.js';

// @desc          Middleware for nested route
export const filterReviewsObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) {
    filterObj = { product: req.params.productId };
  }

  req.filterObj = filterObj;
  next();
};

// @desc          Set params ids to body
export const setParamsIdsToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// @desc          Create new review
// @route         POST     /api/v1/reviews
// @access        Protected/User
export const createReview = createOne(Review);

// @desc          Get list of reviews
// @route         GET     /api/v1/reviews
// @access        Public
export const getAllReviews = getAll(Review);

// @desc          Get specific review
// @route         GET     /api/v1/reviews/:id
// @access        Public
export const getReview = getOne(Review);

// @desc          Update specific review
// @route         PATCH     /api/v1/reviews/:id
// @access        Protected/User
export const updateReview = updateOne(Review);

// @desc          Delete specific review
// @route         DElETE     /api/v1/reviews/:id
// @access        Protected/[Admin, Manager, User]
export const deleteReview = deleteOne(Review);
