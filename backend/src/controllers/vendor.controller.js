import * as vendorService from '../services/vendor.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const apply = asyncHandler(async (req, res) => {
  const { shopName, category, description } = req.body;
  const vendor = await vendorService.applyVendor({
    userId: req.user._id,
    shopName,
    category,
    description,
  });
  res.status(201).json({
    success: true,
    message: 'Seller application submitted successfully and is pending review',
    vendor,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getMyVendorProfile(req.user._id);
  res.json({
    success: true,
    vendor,
  });
});
