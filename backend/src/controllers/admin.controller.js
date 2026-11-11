import * as vendorService from '../services/vendor.service.js';
import * as adminService from '../services/admin.service.js';
import * as categoryService from '../services/category.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getAdminStats();
  res.json({
    success: true,
    stats,
  });
});

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
  const { reason } = req.body || {};
  const vendor = await vendorService.rejectVendor(req.params.id, reason);
  res.json({
    success: true,
    message: 'Vendor application rejected',
    vendor,
  });
});

export const suspendVendor = asyncHandler(async (req, res) => {
  const { reason } = req.body || {};
  const vendor = await vendorService.suspendVendor(req.params.id, reason);
  res.json({
    success: true,
    message: 'Vendor store suspended',
    vendor,
  });
});

export const activateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.activateVendor(req.params.id);
  res.json({
    success: true,
    message: 'Vendor store reactivated successfully',
    vendor,
  });
});

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories(true);
  res.json({
    success: true,
    categories,
  });
});

export const listOrders = asyncHandler(async (req, res) => {
  const data = await adminService.listAllOrders(req.query);
  res.json({
    success: true,
    ...data,
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const data = await adminService.listAllUsers(req.query);
  res.json({
    success: true,
    ...data,
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body || {};
  const user = await adminService.updateUserActiveStatus({
    userId: req.params.id,
    isActive,
    adminUserId: req.user._id,
  });
  res.json({
    success: true,
    message: user.isActive ? 'User account unblocked' : 'User account blocked',
    user,
  });
});
