import * as productRepo from '../repositories/product.repository.js';
import { ApiError } from '../utils/ApiError.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;
const MAX_SEARCH_LENGTH = 100;

// Query values arrive as strings. Accept only whole numbers >= 1.
const parsePositiveInt = (value, fieldName, fallback) => {
  if (value === undefined || value === '') return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value) || Number(value) < 1) {
    throw new ApiError(400, `${fieldName} must be a positive whole number`);
  }
  return Number(value);
};

// Optional text filter: missing/blank -> undefined (filter ignored); repeated keys -> 400.
const parseOptionalText = (value, fieldName, maxLength) => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string') throw new ApiError(400, `${fieldName} must be a single text value`);
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > maxLength) throw new ApiError(400, `${fieldName} is too long`);
  return trimmed;
};

// Converts a database product into the public shape sent to clients.
const toPublicProduct = (p) => ({
  id: p._id,
  name: p.name,
  description: p.description,
  price: p.price,
  originalPrice: p.originalPrice ?? null,
  discountPercent:
    p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0,
  stock: p.stock,
  inStock: p.stock > 0,
  images: p.images,
  tags: p.tags,
  category: p.category ? { id: p.category._id, name: p.category.name, slug: p.category.slug } : null,
  vendor: p.vendor
    ? { id: p.vendor._id, name: p.vendor.name, shopName: p.vendor.shopName ?? null }
    : null,
  createdAt: p.createdAt,
});

export const listProducts = async (query) => {
  const page = parsePositiveInt(query.page, 'page', DEFAULT_PAGE);
  const limit = parsePositiveInt(query.limit, 'limit', DEFAULT_LIMIT);
  if (limit > MAX_LIMIT) throw new ApiError(400, `limit cannot be greater than ${MAX_LIMIT}`);

  const search = parseOptionalText(query.search, 'search', MAX_SEARCH_LENGTH);
  const category = parseOptionalText(query.category, 'category', 60);

  const { products, total } = await productRepo.findPublicProducts({ page, limit, search, category });

  return {
    products: products.map(toPublicProduct),
    pagination: {
      totalProducts: total,
      currentPage: page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProduct = async (id) => {
  if (!/^[a-f\d]{24}$/i.test(id)) throw new ApiError(400, 'Invalid product id');

  const product = await productRepo.findPublicProductById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return toPublicProduct(product);
};
