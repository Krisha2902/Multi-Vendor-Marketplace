
import * as publicSellerService from '../services/publicSeller.service.js';

import { asyncHandler } from '../utils/asyncHandler.js';

export const getPublicSellers = asyncHandler(async (req, res) => {
  const result = await publicSellerService.listPublicSellers();

  res.status(200).json(result);
});

export const getPublicSeller = asyncHandler(async (req, res) => {
  const result = await publicSellerService.getPublicSellerById(
    req.params.id
  );

  res.status(200).json(result);
});
