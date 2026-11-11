import mongoose from 'mongoose';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import * as userRepo from '../repositories/user.repository.js';
import * as orderRepo from '../repositories/order.repository.js';
import { ApiError } from '../utils/ApiError.js';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed'];
const USER_ROLES = ['admin', 'vendor', 'customer'];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const parsePagination = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const rawLimit = Number.parseInt(query.limit, 10) || 20;
  const limit = Math.min(50, Math.max(1, rawLimit));
  return { page, limit, skip: (page - 1) * limit };
};

export const getAdminStats = async () => {
  const [
    totalUsers,
    customers,
    vendorUsers,
    admins,
    blockedUsers,
    vendorGroups,
    totalProducts,
    activeProducts,
    outOfStockProducts,
    totalCategories,
    activeCategories,
    orderGroups,
    revenueGroups,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'vendor' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ isActive: false }),
    Vendor.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Product.countDocuments({}),
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true, stock: { $lte: 0 } }),
    Category.countDocuments({}),
    Category.countDocuments({ isActive: true }),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          paidRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0] },
          },
          pendingCodRevenue: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$totalAmount', 0] },
          },
        },
      },
    ]),
  ]);

  const vendorCounts = { pending: 0, approved: 0, suspended: 0, rejected: 0 };
  for (const group of vendorGroups) {
    if (group._id && Object.prototype.hasOwnProperty.call(vendorCounts, group._id)) {
      vendorCounts[group._id] = group.count;
    }
  }

  const orderCounts = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  let totalOrders = 0;
  for (const group of orderGroups) {
    totalOrders += group.count;
    if (group._id && Object.prototype.hasOwnProperty.call(orderCounts, group._id)) {
      orderCounts[group._id] = group.count;
    }
  }

  const rev = revenueGroups[0] || {};

  return {
    users: {
      total: totalUsers,
      customers,
      vendors: vendorUsers,
      admins,
      blocked: blockedUsers,
    },
    vendors: {
      total:
        vendorCounts.pending +
        vendorCounts.approved +
        vendorCounts.suspended +
        vendorCounts.rejected,
      ...vendorCounts,
    },
    products: {
      total: totalProducts,
      active: activeProducts,
      outOfStock: outOfStockProducts,
    },
    categories: {
      total: totalCategories,
      active: activeCategories,
    },
    orders: {
      total: totalOrders,
      ...orderCounts,
    },
    revenue: {
      totalRevenue: rev.totalRevenue || 0,
      paidRevenue: rev.paidRevenue || 0,
      pendingCodRevenue: rev.pendingCodRevenue || 0,
    },
  };
};

export const listAllOrders = async (query = {}) => {
  const filter = {};
  if (query.status && ORDER_STATUSES.includes(query.status)) {
    filter.status = query.status;
  }
  if (query.paymentStatus && PAYMENT_STATUSES.includes(query.paymentStatus)) {
    filter.paymentStatus = query.paymentStatus;
  }

  const search = typeof query.search === 'string' ? query.search.trim() : '';
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { orderNumber: regex },
      { 'shippingAddress.fullName': regex },
      { 'shippingAddress.city': regex },
    ];
  }

  const { page, limit, skip } = parsePagination(query);
  const [orders, total] = await Promise.all([
    orderRepo.findAll(filter, { createdAt: -1 }, skip, limit),
    orderRepo.countAll(filter),
  ]);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const listAllUsers = async (query = {}) => {
  const filter = {};
  if (query.role && USER_ROLES.includes(query.role)) {
    filter.role = query.role;
  }
  if (query.isActive === 'true' || query.isActive === 'false') {
    filter.isActive = query.isActive === 'true';
  }

  const search = typeof query.search === 'string' ? query.search.trim() : '';
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const { page, limit, skip } = parsePagination(query);
  const [users, total] = await Promise.all([
    userRepo.findAll(filter, skip, limit),
    userRepo.countAll(filter),
  ]);

  return {
    users: users.map(sanitizeUser),
    pagination: {
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const updateUserActiveStatus = async ({ userId, isActive, adminUserId }) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, 'Invalid user ID');
  }
  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be a boolean');
  }
  if (String(userId) === String(adminUserId) && !isActive) {
    throw new ApiError(400, 'You cannot block your own admin account');
  }

  const existing = await userRepo.findById(userId);
  if (!existing) {
    throw new ApiError(404, 'User not found');
  }
  if (existing.role === 'admin' && !isActive) {
    throw new ApiError(403, 'Admin accounts cannot be blocked');
  }

  const updated = await userRepo.updateActiveStatus(userId, isActive);
  return sanitizeUser(updated);
};

