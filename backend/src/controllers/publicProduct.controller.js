
import * as publicProductService from '../services/publicProduct.service.js';

import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/products
export const getPublicProducts = asyncHandler(async (req, res) => {
  const result = await publicProductService.listPublicProducts(
    req.query
  );

  res.status(200).json(result);
});

// GET /api/products/:id
export const getPublicProductById = asyncHandler(async (req, res) => {
  const result = await publicProductService.getPublicProductById(
    req.params.id
  );

  res.status(200).json(result);
});

// GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const result = await publicProductService.listFeaturedProducts(
    req.query
  );

  res.status(200).json(result);
});

// GET /api/products/new-arrivals
export const getNewArrivals = asyncHandler(async (req, res) => {
  const result = await publicProductService.listNewArrivals(
    req.query
  );

  res.status(200).json(result);
});
