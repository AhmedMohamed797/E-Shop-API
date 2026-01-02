import { Router } from 'express';
const router = Router();

import {
  allowedTo,
  protect,
} from './../controllers/auth.controller.js';
import {
  addProductToCart,
  applyCoupon,
  clearCart,
  deleteCartItem,
  getLoggedUserCart,
  updateCartItemQuantity,
} from '../controllers/cart.controller.js';

router.use(protect, allowedTo('user'));

router
  .route('/')
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router
  .route('/:cartItemId')
  .delete(deleteCartItem)
  .patch(updateCartItemQuantity);

router.route('/apply-coupon').post(applyCoupon);

export default router;
