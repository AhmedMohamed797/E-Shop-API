import path from 'path';

import express from 'express';
const app = express();
import cors from 'cors';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';

// Enable other routes to access our application
app.use(cors());

// compress all responses
app.use(compression());

import { connectDB } from './config/database.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { server } from '../server.js';
import { AppError } from './utils/appError.js';
import { mountRoutes } from './routes/mountRoutes.js';
import { webHookCheckout } from './controllers/order.controller.js';

//^ Connect Database
connectDB();

//? Webhook
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webHookCheckout
);

//& Middlewares
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(process.cwd(), 'src/uploads')));

// * Apply express rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  message: {
    status: 'fail',
    message: 'Too many requests please try again after 15 minutes',
  },
});

// limit request to route forget-password
app.use('/api/v1/auth/forget-password', limiter);

//* Mounting Routes
mountRoutes(app);

//^ Handle not exist routes
app.use((req, res, next) => {
  next(
    new AppError(
      `Can't find this route ${req.originalUrl} in the server`,
      400
    )
  );
});

//! Global error middleware
app.use(errorMiddleware);

//? Unhandled Rejection
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    console.error('Shutting Down Server...');
    process.exit(1);
  });
});

export default app;
