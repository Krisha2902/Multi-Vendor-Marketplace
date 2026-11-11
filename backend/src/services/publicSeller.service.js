
import mongoose from 'mongoose';

import * as vendorRepo from '../repositories/vendor.repository.js';
import * as productRepo from '../repositories/product.repository.js';
import * as categoryRepo from '../repositories/category.repository.js';

import { ApiError } from '../utils/ApiError.js';

// GET /api/sellers
export const listPublicSellers = async () => {
  const [vendors, activeCategories] = await Promise.all([
    vendorRepo.findPublicAll(),
    categoryRepo.findAll({ isActive: true }),
  ]);

  const activeCategoryIds = activeCategories.map((cat) => cat._id);
  const publicProductFilter = {
    isActive: true,
    category: { $in: activeCategoryIds },
  };

  const sellers = await Promise.all(
    vendors.map(async (vendor) => {
      const [productCount, products] = await Promise.all([
        productRepo.countByVendor(vendor._id, publicProductFilter),
        productRepo.findByVendor(vendor._id, publicProductFilter, 3),
      ]);

      return {
        ...vendor.toObject(),
        productCount,
        products,
      };
    })
  );

  return {
    success: true,
    totalSellers: sellers.length,
    sellers,
  };
};

// GET /api/sellers/:id
export const getPublicSellerById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid seller ID');
  }

  const [seller, activeCategories] = await Promise.all([
    vendorRepo.findPublicById(id),
    categoryRepo.findAll({ isActive: true }),
  ]);

  if (!seller) {
    throw new ApiError(404, 'Seller not found');
  }

  const activeCategoryIds = activeCategories.map((cat) => cat._id);
  const products = await productRepo.findByVendor(
    seller._id,
    {
      isActive: true,
      category: { $in: activeCategoryIds },
    }
  );

  return {
    success: true,
    seller: {
      ...seller.toObject(),
      productCount: products.length,
      products,
    },
  };
};
