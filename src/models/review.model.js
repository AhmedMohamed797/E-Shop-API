import mongoose from 'mongoose';
import Product from './product.model.js';

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, 'Min rating is 1.0'],
      max: [5, 'Max rating is 5.0'],
      required: [true, 'Review ratings is required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
  },
  { timestamps: true }
);

//? Populate user on review
reviewSchema.pre(/^find/, function () {
  this.populate({ path: 'user', select: '_id name profileImg' });
});

//~ Apply aggregation pipeline on reviews using statics methods
reviewSchema.statics.calcRatingsAvgAndRatingsQuantity =
  async function (productId) {
    try {
      const result = await this.aggregate([
        // 1) Stage 1 get all reviews for specific product
        {
          $match: { product: productId },
        },
        // 2) Stage 2 grouping all reviews together
        {
          $group: {
            _id: '$product',
            avgRatings: { $avg: '$rating' },
            ratingsQuantity: { $sum: 1 },
          },
        },
      ]);

      if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
          ratingsAverage: result[0].avgRatings,
          ratingsQuantity: result[0].ratingsQuantity,
        });
      } else {
        await Product.findByIdAndUpdate(productId, {
          ratingsAverage: 0,
          ratingsQuantity: 0,
        });
      }
    } catch (error) {
      console.error('Error calculating ratings:', error);
    }
  };

//^ Call aggregate method when create review
reviewSchema.post('save', async function (doc) {
  await Review.calcRatingsAvgAndRatingsQuantity(doc.product);
});

//? Call aggregate method when remove review
reviewSchema.post('findOneAndDelete', async function (doc) {
  await Review.calcRatingsAvgAndRatingsQuantity(doc.product);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
