import * as productService from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.listProducts(req.query);
  res.json({ success: true, products, pagination });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.params.id);
  res.json({ success: true, product });
});
