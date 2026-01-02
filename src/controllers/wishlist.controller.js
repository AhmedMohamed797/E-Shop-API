import User from '../models/user.model.js';
import { catchAsync } from './../utils/catchAsync.js';

// @desc         Add product to wishlist
// @route        POST     /api/v1/wishlist
// @access       Protected/User
export const addProductToWishlist = catchAsync(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { wishlist: req.body.productId },
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      status: 'success',
      message: 'Product added successfully to wishlist',
      data: {
        wishlist: user.wishlist,
      },
    });
  }
);

// @desc         Get products from wishlist
// @route        GET     /api/v1/wishlist
// @access       Protected/User
export const getProductsInWishlist = catchAsync(
  async (req, res, next) => {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
    });

    res.status(200).json({
      status: 'success',
      data: {
        wishlist: user.wishlist,
      },
    });
  }
);

// @desc         Delete product from wishlist
// @route        DELETE     /api/v1/wishlist
// @access       Protected/User
export const deleteProductInWishlist = catchAsync(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { wishlist: req.params.id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully from wishlist',
      data: {
        wishlist: user.wishlist,
      },
    });
  }
);

// @desc         Clear wishlist
// @route        DELETE     /api/v1/wishlist
// @access       Protected/User
export const clearWishlist = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { wishlist: [] },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Wishlist cleared successfully',
  });
});
