import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import { catchAsync } from './../utils/catchAsync.js';
import Cart from './../models/cart.model.js';
import Order from './../models/order.model.js';
import { AppError } from '../utils/appError.js';
import Product from './../models/product.model.js';
import { getAll, getOne } from './factoryHandler.js';
import User from '../models/user.model.js';

// @desc         Create cash order
// @route        POST     /api/v1/orders/cartId
// @access       Protected/User
export const createCashOrder = catchAsync(async (req, res, next) => {
  // App settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart based on cart id
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new AppError('There is no cart with that id', 404));
  }

  // 2) Get total order price based on cart price "Check if coupon applied"
  const { totalCartPrice, totalCartPriceAfterDiscount, cartItems } =
    cart;

  const cartPrice = totalCartPriceAfterDiscount
    ? totalCartPriceAfterDiscount
    : totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create cash order
  const order = await Order.create({
    user: req.user.id,
    cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order increase product sold and decrease product quantity
  if (order) {
    const bulkOption = order.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { quantity: -item.quantity, sold: +item.quantity },
        },
      },
    }));

    await Product.bulkWrite(bulkOption);

    // 5) Clear cart of user
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// @desc         Middleware to filter result if role is user
export const filterResultsForLoggedUser = (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user.id };
  next();
};

// @desc         Get all orders
// @route        GET     /api/v1/orders
// @access       Protected/User-Admin-Manager
export const getAllOrders = getAll(Order);

// @desc         Get specific order
// @route        GET     /api/v1/orders/:id
// @access       Protected/User-Admin-Manager
export const getSpecificOrder = getOne(Order);

// @desc     Update Order Status To Paid
// @route    PATCH  /api/v1/orders/:id/pay
// @access   Protected/Admin-Manager
export const updateOrderStatusToPaid = catchAsync(
  async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(
        new AppError(`There is no order with that id`, 404)
      );
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
      status: 'success',
      data: updatedOrder,
    });
  }
);

// @desc     Update Order Status To delivered
// @route    PATCH  /api/v1/orders/:id/deliver
// @access   Protected/Admin-Manager
export const updateOrderStatusToDelivered = catchAsync(
  async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(
        new AppError(`There is no order with that id`, 404)
      );
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
      status: 'success',
      data: updatedOrder,
    });
  }
);

// @desc     Create checkout session from stripe and send it as a response
// @route    GET  /api/v1/orders/checkout-session/:cartId
// @access   Protected/User
export const checkoutSession = catchAsync(async (req, res, next) => {
  // App settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart based on cart id
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new AppError('There is no cart with that id', 404));
  }

  // 2) Get total order price based on cart price "Check if coupon applied"
  const { totalCartPrice, totalCartPriceAfterDiscount, cartItems } =
    cart;

  const cartPrice = totalCartPriceAfterDiscount
    ? totalCartPriceAfterDiscount
    : totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Get stripe checkout session
  // Stripe requires a price ID for line_items.create a Price using the Stripe API based on your cart's totalOrderPrice.

  const product = await stripe.products.create({
    name: req.user.name,
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: totalOrderPrice * 100,
    currency: 'egp',
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    // metadata: req.body.shippingAddress,
  });

  res.status(200).json({
    status: 'success',
    data: session,
  });
});

// @desc     Create Card Order
const createCardOrder = catchAsync(async (session) => {
  const cartId = session.client_reference_id;
  const amount = session.amount_total / 100;
  const customer_email = session.customer_email;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: customer_email });

  // Create card order
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: amount,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: 'card',
  });

  //  After creating order, decrement product quantity, and increase product sold
  if (order) {
    await Product.bulkWrite(
      cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: {
            $inc: { quantity: -item.quantity, sold: +item.quantity },
          },
        },
      })),
      {}
    );
    // Clear cart after cash order is ended
    await Cart.findByIdAndDelete(cartId);
  }
});

// @desc     This webhook will run when stripe payment success paid
// @route    POST/webhook
// @access   Protected/User
export const webHookCheckout = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send('Webhook Error');
  }
  if (event.type === 'checkout.session.completed') {
    createCardOrder(event.data.object);
  }

  res.sendStatus(200);
});
