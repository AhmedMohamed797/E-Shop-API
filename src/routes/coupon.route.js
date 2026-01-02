import { Router } from 'express';
const router = Router();

import {
  allowedTo,
  protect,
} from '../controllers/auth.controller.js';
import {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/coupon.controller.js';
import {
  checkCouponIdValidator,
  createCouponValidator,
  updateCouponValidator,
} from '../validators/couponValidator.js';

router.use(protect, allowedTo('admin', 'manager'));

router
  .route('/')
  .post(createCouponValidator, createCoupon)
  .get(getAllCoupons);

router
  .route('/:id')
  .get(checkCouponIdValidator, getCoupon)
  .patch(updateCouponValidator, updateCoupon)
  .delete(checkCouponIdValidator, deleteCoupon);

export default router;
