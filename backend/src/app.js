import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import adminRoutes from './routes/admin.routes.js';
import publicProductRoutes from './routes/product.routes.js';
import publicSellerRoutes from './routes/seller.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import vendorProductRoutes from './routes/vendorProduct.routes.js';
import orderRoutes from './routes/order.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', publicProductRoutes);
app.use('/api/sellers', publicSellerRoutes);
app.use('/api/products', productRoutes);
app.get("/", (req, res) => {
    res.send("Multi-Vendor E-commerce Backend is running!");
});
app.use('/api/categories', categoryRoutes);
app.use('/api/vendor/products', vendorProductRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

export default app;
