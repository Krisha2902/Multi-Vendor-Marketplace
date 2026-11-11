import mongoose from 'mongoose';
import * as vendorRepo from '../repositories/vendor.repository.js';
import * as userRepo from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const applyVendor = async ({ userId, shopName, category, description }) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (user.role === 'admin') {
    throw new ApiError(400, 'Admin accounts cannot apply as a seller');
  }

  const cleanShopName = typeof shopName === 'string' ? shopName.trim() : '';
  const cleanCategory = typeof category === 'string' ? category.trim() : '';
  const cleanDescription = typeof description === 'string' ? description.trim() : '';

  if (!cleanShopName || !cleanCategory) {
    throw new ApiError(400, 'Shop name and category are required');
  }

  const existing = await vendorRepo.findByUserId(userId);
  if (existing) {
    if (existing.status === 'approved') {
      throw new ApiError(400, 'You are already an approved seller');
    }
    if (existing.status === 'pending') {
      throw new ApiError(400, 'Your seller application is already pending approval');
    }
    if (existing.status === 'suspended') {
      throw new ApiError(
        403,
        existing.rejectionReason
          ? `Your seller store is suspended: ${existing.rejectionReason}`
          : 'Your seller store is currently suspended by admin'
      );
    }
    // If previously rejected, allow re-application
    existing.shopName = cleanShopName;
    existing.category = cleanCategory;
    existing.description = cleanDescription;
    existing.status = 'pending';
    existing.rejectionReason = '';
    await existing.save();
    return vendorRepo.findById(existing._id);
  }

  const vendor = await vendorRepo.createVendor({
    user: userId,
    shopName: cleanShopName,
    category: cleanCategory,
    description: cleanDescription,
    status: 'pending',
  });

  return vendorRepo.findById(vendor._id);
};

export const getMyVendorProfile = async (userId) => {
  const vendor = await vendorRepo.findByUserId(userId);
  return vendor;
};

export const listVendorApplications = async (query = {}) => {
  const filter = {};
  if (query.status && ['pending', 'approved', 'rejected', 'suspended'].includes(query.status)) {
    filter.status = query.status;
  }
  return vendorRepo.findAll(filter);
};

export const approveVendor = async (vendorId) => {
  if (!mongoose.isValidObjectId(vendorId)) {
    throw new ApiError(400, 'Invalid vendor ID');
  }

  const vendor = await vendorRepo.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor application not found');
  }
  if (!vendor.user) {
    throw new ApiError(404, 'Associated user account no longer exists');
  }

  if (vendor.rejectionReason) {
    vendor.rejectionReason = '';
    await vendor.save();
  }

  const updatedVendor = await vendorRepo.updateStatus(vendorId, 'approved');
  // Promote the applicant user to 'vendor' role unless already admin
  if (vendor.user.role !== 'admin') {
    await userRepo.updateRole(vendor.user._id, 'vendor');
  }

  return updatedVendor;
};

export const rejectVendor = async (vendorId, reason = '') => {
  if (!mongoose.isValidObjectId(vendorId)) {
    throw new ApiError(400, 'Invalid vendor ID');
  }

  const vendor = await vendorRepo.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor application not found');
  }

  const cleanReason = typeof reason === 'string' ? reason.trim() : '';
  const updatedVendor = await vendorRepo.updateStatus(
    vendorId,
    'rejected',
    cleanReason || 'Application did not meet marketplace requirements'
  );

  // Demote non-admin user back to customer if previously approved as vendor
  if (vendor.user && vendor.user.role === 'vendor') {
    await userRepo.updateRole(vendor.user._id, 'customer');
  }

  return updatedVendor;
};

export const suspendVendor = async (vendorId, reason = '') => {
  if (!mongoose.isValidObjectId(vendorId)) {
    throw new ApiError(400, 'Invalid vendor ID');
  }

  const vendor = await vendorRepo.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor store not found');
  }
  if (vendor.status === 'suspended') {
    throw new ApiError(400, 'Vendor store is already suspended');
  }
  if (vendor.status !== 'approved') {
    throw new ApiError(400, 'Only approved vendors can be suspended');
  }

  const cleanReason = typeof reason === 'string' ? reason.trim() : '';
  return vendorRepo.updateStatus(
    vendorId,
    'suspended',
    cleanReason || 'Store temporarily suspended by marketplace admin'
  );
};

export const activateVendor = async (vendorId) => {
  if (!mongoose.isValidObjectId(vendorId)) {
    throw new ApiError(400, 'Invalid vendor ID');
  }

  const vendor = await vendorRepo.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor store not found');
  }
  if (!vendor.user) {
    throw new ApiError(404, 'Associated user account no longer exists');
  }
  if (vendor.status !== 'suspended') {
    throw new ApiError(400, 'Only suspended vendors can be reactivated');
  }

  if (vendor.rejectionReason) {
    vendor.rejectionReason = '';
    await vendor.save();
  }

  const updatedVendor = await vendorRepo.updateStatus(vendorId, 'approved');
  if (vendor.user.role !== 'admin' && vendor.user.role !== 'vendor') {
    await userRepo.updateRole(vendor.user._id, 'vendor');
  }

  return updatedVendor;
};
