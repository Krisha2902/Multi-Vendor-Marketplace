import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import publicProductRoutes from './routes/product.routes.js';
import publicSellerRoutes from './routes/seller.routes.js';
import categoryRoutes from './routes/category.routes.js';
import vendorProductRoutes from './routes/vendorProduct.routes.js';
import orderRoutes from './routes/order.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins.length <= 1 ? (allowedOrigins[0] || true) : allowedOrigins,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiLimiter);
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', publicProductRoutes);
app.use('/api/sellers', publicSellerRoutes);
app.get('/', (req, res) => {
  res.send('Multi-Vendor E-commerce Backend is running!');
});
app.use('/api/categories', categoryRoutes);
app.use('/api/vendor/products', vendorProductRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export default app;
