
import mongoose from 'mongoose';

import * as productRepo from '../repositories/product.repository.js';
import * as vendorRepo from '../repositories/vendor.repository.js';
import * as categoryRepo from '../repositories/category.repository.js';

import { ApiError } from '../utils/ApiError.js';

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating_desc: { rating: -1, createdAt: -1 },
  popular: { rating: -1, reviewsCount: -1 },
};

// Build a safe public product filter
const buildPublicFilter = async (query, extraFilter = {}) => {
  const [approvedVendorIds, activeCategories] = await Promise.all([
    vendorRepo.findApprovedIds(),
    categoryRepo.findAll({ isActive: true }),
  ]);

  const activeCategoryIds = activeCategories.map((cat) => cat._id);

  const filter = {
    isActive: true,
    vendor: { $in: approvedVendorIds },
    category: { $in: activeCategoryIds },
    ...extraFilter,
  };

  // Search by product title or description
  const search = String(query.search || '')
    .trim()
    .slice(0, 100);

  if (search) {
    const escaped = search.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    filter.$or = [
      { title: { $regex: escaped, $options: 'i' } },
      { description: { $regex: escaped, $options: 'i' } },
    ];
  }

  // Category may be either MongoDB ObjectId or category slug
  if (query.category) {
    const categoryValue = String(query.category).trim();
    const category = mongoose.isValidObjectId(categoryValue)
      ? await categoryRepo.findById(categoryValue)
      : await categoryRepo.findBySlug(categoryValue.toLowerCase());

    if (!category || !category.isActive) {
      throw new ApiError(404, 'Category not found');
    }

    filter.category = category._id;
  }

  return filter;
};

// Shared listing function
const getProductList = async (
  query = {},
  extraFilter = {},
  defaultLimit = 12,
  forcedSort = null
) => {
  const filter = await buildPublicFilter(
    query,
    extraFilter
  );

  const requestedPage = Number(query.page || 1);
  const requestedLimit = Number(query.limit || defaultLimit);

  const page = Number.isInteger(requestedPage)
    ? Math.max(1, requestedPage)
    : 1;

  const limit = Number.isInteger(requestedLimit)
    ? Math.min(50, Math.max(1, requestedLimit))
    : defaultLimit;

  const skip = (page - 1) * limit;

  const sort =
    forcedSort ||
    SORT_OPTIONS[query.sort] ||
    SORT_OPTIONS.newest;

  const [products, totalProducts] = await Promise.all([
    productRepo.findAll(filter, sort, skip, limit),
    productRepo.countAll(filter),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    success: true,
    products,
    pagination: {
      currentPage: page,
      limit,
      totalProducts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: totalPages > 0 && page > 1,
    },
  };
};

// GET /api/products
export const listPublicProducts = async (query) => {
  return getProductList(query);
};

// GET /api/products/:id
export const getPublicProductById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const product = await productRepo.findById(id);

  if (!product || !product.isActive || !product.category || product.category.isActive === false) {
    throw new ApiError(404, 'Product not found');
  }

  // Check whether the associated vendor is approved
  const vendor = product.vendor
    ? await vendorRepo.findPublicById(product.vendor._id)
    : null;

  if (!vendor) {
    throw new ApiError(404, 'Product not found');
  }

  return {
    success: true,
    product,
  };
};

// GET /api/products/featured
export const listFeaturedProducts = async (query) => {
  return getProductList(
    query,
    { isFeatured: true },
    8,
    SORT_OPTIONS.rating_desc
  );
};

// GET /api/products/new-arrivals
export const listNewArrivals = async (query) => {
  return getProductList(
    query,
    {},
    8,
    SORT_OPTIONS.newest
  );
};
