import * as vendorService from '../services/vendor.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listVendors = asyncHandler(async (req, res) => {
  const vendors = await vendorService.listVendorApplications(req.query);
  res.json({
    success: true,
    vendors,
  });
});

export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.approveVendor(req.params.id);
  res.json({
    success: true,
    message: 'Vendor application approved successfully',
    vendor,
  });
});

export const rejectVendor = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const vendor = await vendorService.rejectVendor(req.params.id, reason);
  res.json({
    success: true,
    message: 'Vendor application rejected',
    vendor,
  });
});
