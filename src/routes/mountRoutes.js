import categoryRouter from './category.route.js';
import subCategoryRouter from './subCategory.route.js';
import brandRouter from './brand.route.js';
import productRouter from './product.route.js';
import userRouter from './user.route.js';
import authRouter from './auth.route.js';
import reviewRouter from './review.route.js';
import wishlistRouter from './wishlist.route.js';
import addressRouter from './address.route.js';
import couponRouter from './coupon.route.js';
import cartRouter from './cart.route.js';
import orderRouter from './order.route.js';

export const mountRoutes = (app) => {
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/sub-categories', subCategoryRouter);
  app.use('/api/v1/brands', brandRouter);
  app.use('/api/v1/products', productRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/reviews', reviewRouter);
  app.use('/api/v1/wishlist', wishlistRouter);
  app.use('/api/v1/addresses', addressRouter);
  app.use('/api/v1/coupons', couponRouter);
  app.use('/api/v1/cart', cartRouter);
  app.use('/api/v1/orders', orderRouter);
};
