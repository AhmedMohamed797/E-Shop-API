import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: [true, 'Coupon name should be uppercase'],
      trim: true,
      required: [true, 'Coupon name is required'],
      unique: [true, 'Coupon name should be unique'],
    },
    expires: {
      type: Date,
      required: [true, 'Coupon expires time is required'],
    },
    discount: {
      type: Number,
      required: [true, 'Coupon discount value is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
