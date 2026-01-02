import { catchAsync } from './../utils/catchAsync.js';
import Product from './../models/product.model.js';
import Cart from '../models/cart.model.js';
import { AppError } from '../utils/appError.js';
import Coupon from './../models/coupon.model.js';

// Calc total cart price
const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    if (item.priceAfterDiscount) {
      totalPrice += item.priceAfterDiscount * item.quantity;
    } else {
      totalPrice += item.price * item.quantity;
    }
  });

  cart.totalCartPrice = totalPrice;
  cart.totalCartPriceAfterDiscount = undefined;
};

// @desc         Add product to cart
// @route        POST     /api/v1/cart
// @access       Protected/user
export const addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, color } = req.body;

  // 1) Get product to get it's price;
  const product = await Product.findById(productId);

  // 2) Get user cart if exist
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    // If no cart create new one
    cart = await Cart.create({
      user: req.user.id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    // If product exist in cart update quantity
    const productIndex = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === productId && item.color === color
    );

    if (productIndex !== -1) {
      cart.cartItems[productIndex].quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }

  // Calc totalCartPrice
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(201).json({
    status: 'success',
    message: 'Product added successfully to cart',
    numOfCartItems: cart.cartItems.length,
    data: {
      cart,
    },
  });
});

// @desc         Get Logged user cart
// @route        GET     /api/v1/cart
// @access       Protected/user
export const getLoggedUserCart = catchAsync(
  async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return next(new AppError('Cart is empty', 404));
    }

    res.status(200).json({
      status: 'success',
      numOfCartItems: cart.cartItems.length,
      data: {
        cart,
      },
    });
  }
);

// @desc     Delete specific cart item
// @route    DELETE  /api/v1/cart/:cartItemId
// @access   Protected/User
export const deleteCartItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      $pull: { cartItems: { _id: req.params.cartItemId } },
    },
    {
      new: true,
    }
  );

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully from cart',
    numOfCartItems: cart.cartItems.length,
    data: {
      cart,
    },
  });
});

// @desc     Clear logged user cart
// @route    DELETE  /api/v1/cart
// @access   Protected/User
export const clearCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(204).json({
    status: 'success',
  });
});

// @desc     Update cart item quantity
// @route    PATCH  /api/v1/cart/:cartItemId
// @access   Private/User
export const updateCartItemQuantity = catchAsync(
  async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return next(new AppError('Cart is empty', 404));
    }

    const productIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.cartItemId
    );

    if (productIndex !== -1) {
      cart.cartItems[productIndex].quantity = req.body.quantity;
    } else {
      return next(
        new AppError(`There is not item for cartItemId`, 404)
      );
    }

    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
      status: 'success',
      numOfCartItems: cart.cartItems.length,
      data: {
        cart,
      },
    });
  }
);

// @desc     Apply coupon on logged user cart
// @route    POST  /api/v1/cart/apply-coupon
// @access   Private/User
export const applyCoupon = catchAsync(async (req, res, next) => {
  // 1) Get Coupon
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expires: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new AppError('Invalid or expired coupon', 400));
  }

  // 2) Get logged user cart to Apply coupon to cartItems totalPrice
  const cart = await Cart.findOne({ user: req.user.id });
  const discount = (coupon.discount * cart.totalCartPrice) / 100;
  cart.totalCartPriceAfterDiscount = (
    cart.totalCartPrice - discount
  ).toFixed(2);

  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Coupon has been successfully applied to your cart',
  });
});
