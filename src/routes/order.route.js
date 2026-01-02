import { Router } from 'express';
const router = Router();

import {
  createCashOrder,
  filterResultsForLoggedUser,
  getAllOrders,
  getSpecificOrder,
  updateOrderStatusToPaid,
  updateOrderStatusToDelivered,
  checkoutSession,
} from '../controllers/order.controller.js';

import {
  allowedTo,
  protect,
} from './../controllers/auth.controller.js';

router.use(protect);

router
  .route('/')
  .get(
    allowedTo('user', 'admin', 'manager'),
    filterResultsForLoggedUser,
    getAllOrders
  );

router.route('/:cartId').post(allowedTo('user'), createCashOrder);

router
  .route('/checkout-session/:cartId')
  .get(allowedTo('user'), checkoutSession);

router
  .route('/:id')
  .get(allowedTo('user', 'admin', 'manager'), getSpecificOrder);

router
  .route('/:id/pay')
  .patch(allowedTo('admin', 'manager'), updateOrderStatusToPaid);

router
  .route('/:id/deliver')
  .patch(allowedTo('admin', 'manager'), updateOrderStatusToDelivered);

export default router;
