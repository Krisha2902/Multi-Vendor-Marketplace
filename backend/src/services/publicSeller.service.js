
import mongoose from 'mongoose';

import * as vendorRepo from '../repositories/vendor.repository.js';
import * as productRepo from '../repositories/product.repository.js';

import { ApiError } from '../utils/ApiError.js';

// GET /api/sellers
export const listPublicSellers = async () => {
  const vendors = await vendorRepo.findPublicAll();

  const sellers = await Promise.all(
    vendors.map(async (vendor) => {
      const products = await productRepo.findByVendor(
        vendor._id,
        { isActive: true }
      );

      return {
        ...vendor.toObject(),
        productCount: products.length,
        products: products.slice(0, 3),
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

  const seller = await vendorRepo.findPublicById(id);

  if (!seller) {
    throw new ApiError(404, 'Seller not found');
  }

  const products = await productRepo.findByVendor(
    seller._id,
    { isActive: true }
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
