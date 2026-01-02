import Coupon from '../models/coupon.model.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './factoryHandler.js';

// @desc         Create new coupon
// @route        POST     /api/v1/coupons
// @access       Protected/admin-manager
export const createCoupon = createOne(Coupon);

// @desc         Get all coupons
// @route        GET     /api/v1/coupons
// @access       Protected/admin-manager
export const getAllCoupons = getAll(Coupon);

// @desc         Get one coupon
// @route        GET     /api/v1/coupons/:id
// @access       Protected/admin-manager
export const getCoupon = getOne(Coupon);

// @desc         Update one coupon
// @route        PATCH     /api/v1/coupons/:id
// @access       Protected/admin-manager
export const updateCoupon = updateOne(Coupon);

// @desc         Delete one coupon
// @route        DELETE     /api/v1/coupons/:id
// @access       Protected/admin-manager
export const deleteCoupon = deleteOne(Coupon);
