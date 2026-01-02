import { Router } from 'express';
const router = Router();

import {
  addProductToWishlist,
  deleteProductInWishlist,
  getProductsInWishlist,
  clearWishlist,
} from '../controllers/wishlist.controller.js';

import {
  allowedTo,
  protect,
} from './../controllers/auth.controller.js';

import {
  addToWishlistValidator,
  deleteProductFromWishlistValidator,
} from '../validators/wishlistValidator.js';

router.use(protect, allowedTo('user'));

router
  .route('/')
  .post(addToWishlistValidator, addProductToWishlist)
  .get(getProductsInWishlist)
  .delete(clearWishlist);

router
  .route('/:id')
  .delete(
    deleteProductFromWishlistValidator,
    deleteProductInWishlist
  );

export default router;
