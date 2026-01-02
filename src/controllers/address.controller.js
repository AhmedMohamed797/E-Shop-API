import User from '../models/user.model.js';
import { catchAsync } from './../utils/catchAsync.js';

// @desc         Create new address
// @route        POST     /api/v1/addresses
// @access       Protected
export const createAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $addToSet: { addresses: req.body },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json({
    status: 'success',
    message: 'Address added successfully',
    data: {
      address: user.addresses,
    },
  });
});

// @desc         Get logged user addresses
// @route        Get     /api/v1/addresses
// @access       Protected
export const getAddresses = catchAsync(async (req, res, next) => {
  const addresses = await User.findById(req.user.id).select(
    'addresses -_id'
  );
  res.status(200).json({
    status: 'success',
    data: addresses,
  });
});

// @desc         Delete logged user address
// @route        DELETE     /api/v1/addresses/:id
// @access       Protected
export const deleteAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { addresses: { _id: req.params.id } },
    },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      address: user.addresses,
    },
  });
});
