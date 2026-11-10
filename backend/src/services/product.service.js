import * as productRepo from '../repositories/product.repository.js';
import * as vendorRepo from '../repositories/vendor.repository.js';
import * as categoryRepo from '../repositories/category.repository.js';
import { ApiError } from '../utils/ApiError.js';

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

export const createVendorProduct = async (userId, data) => {
  const vendor = await getApprovedVendor(userId);
  const { title, description, price, discount, stock, images, category } = data;

  if (!title || !title.trim()) throw new ApiError(400, 'Product title is required');
  if (!description || !description.trim()) throw new ApiError(400, 'Product description is required');
  if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
    throw new ApiError(400, 'A valid positive price is required');
  }

  // Validate category
  if (!category) throw new ApiError(400, 'Product category is required');
  const catExists = await categoryRepo.findById(category);
  if (!catExists) throw new ApiError(404, 'Selected category does not exist');

  // Validate images
  let imageList = [];
  if (Array.isArray(images)) {
    imageList = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
  } else if (typeof images === 'string' && images.trim()) {
    imageList = [images.trim()];
  }
  if (imageList.length === 0) {
    throw new ApiError(400, 'Please provide at least one product image URL');
  }

  const productData = {
    title: title.trim(),
    description: description.trim(),
    price: Number(price),
    discount: discount !== undefined && discount !== null ? Number(discount) : 0,
    stock: stock !== undefined && stock !== null ? Math.max(0, parseInt(stock, 10)) : 1,
    images: imageList,
    category,
    vendor: vendor._id,
    isActive: true
  };

  return productRepo.create(productData);
};

export const updateVendorProduct = async (userId, productId, data) => {
  const vendor = await getApprovedVendor(userId);
  const product = await productRepo.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  // Verify ownership
  if (product.vendor._id.toString() !== vendor._id.toString()) {
    throw new ApiError(403, 'You are not authorized to update this product');
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.discount !== undefined) updateData.discount = Number(data.discount);
  if (data.stock !== undefined) updateData.stock = Math.max(0, parseInt(data.stock, 10));
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
  
  if (data.category) {
    const catExists = await categoryRepo.findById(data.category);
    if (!catExists) throw new ApiError(404, 'Selected category does not exist');
    updateData.category = data.category;
  }

  if (data.images) {
    let imageList = [];
    if (Array.isArray(data.images)) {
      imageList = data.images.filter((img) => typeof img === 'string' && img.trim().length > 0);
    } else if (typeof data.images === 'string' && data.images.trim()) {
      imageList = [data.images.trim()];
    }
    if (imageList.length > 0) {
      updateData.images = imageList;
    }
  }

  return productRepo.update(productId, updateData);
};

export const deleteVendorProduct = async (userId, productId) => {
  const vendor = await getApprovedVendor(userId);
  const product = await productRepo.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  // Verify ownership
  if (product.vendor._id.toString() !== vendor._id.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this product');
  }

  return productRepo.deleteById(productId);
};

