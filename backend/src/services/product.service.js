import mongoose from 'mongoose';
import * as productRepo from '../repositories/product.repository.js';
import * as vendorRepo from '../repositories/vendor.repository.js';
import * as categoryRepo from '../repositories/category.repository.js';
import { ApiError } from '../utils/ApiError.js';

const sanitizeImageList = (images) => {
  let rawList = [];
  if (Array.isArray(images)) {
    rawList = images;
  } else if (typeof images === 'string') {
    rawList = [images];
  } else {
    return [];
  }

  return rawList
    .filter((img) => typeof img === 'string')
    .map((img) => img.trim())
    .filter((img) => img.length > 0 && img.length <= 2000 && !/^javascript:/i.test(img));
};

// Helper to get approved vendor profile for user
export const getApprovedVendor = async (userId) => {
  const vendor = await vendorRepo.findByUserId(userId);
  if (!vendor) {
    throw new ApiError(403, 'Vendor profile not found. Please apply to become a seller.');
  }
  if (vendor.status !== 'approved') {
    throw new ApiError(403, `Vendor store is currently ${vendor.status}. Only approved vendors can manage products.`);
  }
  return vendor;
};

export const getVendorProducts = async (userId) => {
  const vendor = await getApprovedVendor(userId);
  const products = await productRepo.findByVendor(vendor._id);
  const totalCount = await productRepo.countByVendor(vendor._id);
  return { products, totalCount, vendor };
};

export const createVendorProduct = async (userId, data = {}) => {
  const vendor = await getApprovedVendor(userId);
  const { title, description, price, discount, stock, images, category } = data;

  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new ApiError(400, 'Product title is required');
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    throw new ApiError(400, 'Product description is required');
  }

  const parsedPrice = Number(price);
  if (price === undefined || price === null || price === '' || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
    throw new ApiError(400, 'A valid non-negative price is required');
  }

  let parsedDiscount = 0;
  if (discount !== undefined && discount !== null && discount !== '') {
    parsedDiscount = Number(discount);
    if (!Number.isFinite(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
      throw new ApiError(400, 'Discount must be between 0 and 100');
    }
  }

  let parsedStock = 1;
  if (stock !== undefined && stock !== null && stock !== '') {
    parsedStock = Number(stock);
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      throw new ApiError(400, 'Stock must be a non-negative integer');
    }
  }

  // Validate category
  if (!category || !mongoose.isValidObjectId(category)) {
    throw new ApiError(400, 'A valid product category is required');
  }
  const catExists = await categoryRepo.findById(category);
  if (!catExists || !catExists.isActive) {
    throw new ApiError(404, 'Selected category does not exist');
  }

  // Validate images
  const imageList = sanitizeImageList(images);
  if (imageList.length === 0) {
    throw new ApiError(400, 'Please provide at least one valid product image URL');
  }

  const productData = {
    title: title.trim(),
    description: description.trim(),
    price: parsedPrice,
    discount: parsedDiscount,
    stock: parsedStock,
    images: imageList,
    category,
    vendor: vendor._id,
    isActive: true,
  };

  return productRepo.create(productData);
};

export const updateVendorProduct = async (userId, productId, data = {}) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const vendor = await getApprovedVendor(userId);
  const product = await productRepo.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  // Verify ownership
  const productVendorId = product.vendor?._id || product.vendor;
  if (!productVendorId || productVendorId.toString() !== vendor._id.toString()) {
    throw new ApiError(403, 'You are not authorized to update this product');
  }

  const updateData = {};

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || !data.title.trim()) {
      throw new ApiError(400, 'Product title cannot be empty');
    }
    updateData.title = data.title.trim();
  }

  if (data.description !== undefined) {
    if (typeof data.description !== 'string' || !data.description.trim()) {
      throw new ApiError(400, 'Product description cannot be empty');
    }
    updateData.description = data.description.trim();
  }

  if (data.price !== undefined) {
    const parsedPrice = Number(data.price);
    if (data.price === null || data.price === '' || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      throw new ApiError(400, 'A valid non-negative price is required');
    }
    updateData.price = parsedPrice;
  }

  if (data.discount !== undefined) {
    const parsedDiscount = Number(data.discount);
    if (data.discount === null || data.discount === '' || !Number.isFinite(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > 100) {
      throw new ApiError(400, 'Discount must be between 0 and 100');
    }
    updateData.discount = parsedDiscount;
  }

  if (data.stock !== undefined) {
    const parsedStock = Number(data.stock);
    if (data.stock === null || data.stock === '' || !Number.isInteger(parsedStock) || parsedStock < 0) {
      throw new ApiError(400, 'Stock must be a non-negative integer');
    }
    updateData.stock = parsedStock;
  }

  if (data.isActive !== undefined) {
    if (typeof data.isActive === 'boolean') {
      updateData.isActive = data.isActive;
    } else if (data.isActive === 'true' || data.isActive === 'false') {
      updateData.isActive = data.isActive === 'true';
    } else {
      throw new ApiError(400, 'isActive must be a boolean');
    }
  }

  if (data.category !== undefined) {
    if (!mongoose.isValidObjectId(data.category)) {
      throw new ApiError(400, 'Invalid category ID');
    }
    const catExists = await categoryRepo.findById(data.category);
    if (!catExists || !catExists.isActive) {
      throw new ApiError(404, 'Selected category does not exist');
    }
    updateData.category = data.category;
  }

  if (data.images !== undefined) {
    const imageList = sanitizeImageList(data.images);
    if (imageList.length === 0) {
      throw new ApiError(400, 'Please provide at least one valid product image URL');
    }
    updateData.images = imageList;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, 'No valid update fields provided');
  }

  return productRepo.update(productId, updateData);
};

export const deleteVendorProduct = async (userId, productId) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const vendor = await getApprovedVendor(userId);
  const product = await productRepo.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  // Verify ownership
  const productVendorId = product.vendor?._id || product.vendor;
  if (!productVendorId || productVendorId.toString() !== vendor._id.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this product');
  }

  return productRepo.deleteById(productId);
};

