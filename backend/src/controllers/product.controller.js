import * as productService from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getVendorProducts = asyncHandler(async (req, res) => {
  const result = await productService.getVendorProducts(req.user._id);
  res.json({ success: true, ...result });
});

export const createVendorProduct = asyncHandler(async (req, res) => {
  const product = await productService.createVendorProduct(req.user._id, req.body || {});
  res.status(201).json({ success: true, message: 'Product created successfully', product });
});

export const updateVendorProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateVendorProduct(req.user._id, req.params.id, req.body || {});
  res.json({ success: true, message: 'Product updated successfully', product });
});

export const deleteVendorProduct = asyncHandler(async (req, res) => {
  await productService.deleteVendorProduct(req.user._id, req.params.id);
  res.json({ success: true, message: 'Product deleted successfully' });
});

