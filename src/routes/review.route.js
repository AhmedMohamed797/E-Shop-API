import { Router } from 'express';
const router = Router({ mergeParams: true });

import {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  setParamsIdsToBody,
  filterReviewsObj,
} from '../controllers/review.controller.js';
import {
  allowedTo,
  protect,
} from './../controllers/auth.controller.js';

import {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} from '../validators/reviewValidator.js';

router
  .route('/')
  .post(
    protect,
    allowedTo('user'),
    setParamsIdsToBody,
    createReviewValidator,
    createReview
  )
  .get(filterReviewsObj, getAllReviews);

router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .patch(
    protect,
    allowedTo('user'),
    updateReviewValidator,
    updateReview
  )
  .delete(
    protect,
    allowedTo('admin', 'manager', 'user'),
    deleteReviewValidator,
    deleteReview
  );

export default router;
