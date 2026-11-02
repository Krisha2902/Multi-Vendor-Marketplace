import * as vendorRepo from '../repositories/vendor.repository.js';
import * as userRepo from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const applyVendor = async ({ userId, shopName, category, description }) => {
  if (!shopName || !category) {
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
    // If previously rejected, allow re-application
    existing.shopName = shopName.trim();
    existing.category = category.trim();
    existing.description = description ? description.trim() : '';
    existing.status = 'pending';
    existing.rejectionReason = '';
    await existing.save();
    return existing;
  }

  const vendor = await vendorRepo.createVendor({
    user: userId,
    shopName: shopName.trim(),
    category: category.trim(),
    description: description ? description.trim() : '',
    status: 'pending',
  });

  return vendor;
};

export const getMyVendorProfile = async (userId) => {
  const vendor = await vendorRepo.findByUserId(userId);
  return vendor;
};

export const listVendorApplications = async (query = {}) => {
  const filter = {};
  if (query.status && ['pending', 'approved', 'rejected'].includes(query.status)) {
    filter.status = query.status;
  }
  return vendorRepo.findAll(filter);
};

export const approveVendor = async (vendorId) => {
  const vendor = await vendorRepo.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor application not found');
  }

  const updatedVendor = await vendorRepo.updateStatus(vendorId, 'approved');
  // Promote the applicant user to 'vendor' role
  await userRepo.updateRole(vendor.user._id, 'vendor');

  return updatedVendor;
};

export const rejectVendor = async (vendorId, reason = '') => {
  const vendor = await vendorRepo.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, 'Vendor application not found');
  }

  const updatedVendor = await vendorRepo.updateStatus(
    vendorId,
    'rejected',
    reason || 'Application did not meet marketplace requirements'
  );

  return updatedVendor;
};
