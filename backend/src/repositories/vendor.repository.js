import Vendor from '../models/Vendor.js';

export const createVendor = (data) => Vendor.create(data);

export const findByUserId = (userId) =>
  Vendor.findOne({ user: userId }).populate('user', 'name email role');

export const findById = (id) =>
  Vendor.findById(id).populate('user', 'name email role');

export const findAll = (filter = {}) =>
  Vendor.find(filter).populate('user', 'name email role').sort({ createdAt: -1 });

export const updateStatus = (id, status, rejectionReason = '') =>
  Vendor.findByIdAndUpdate(
    id,
    { status, rejectionReason },
    { new: true }
  ).populate('user', 'name email role');
// Return approved vendors for public marketplace
export const findPublicAll = () => {
  return Vendor.find({ status: 'approved' })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
};

// Return one approved vendor by ID
export const findPublicById = (id) => {
  return Vendor.findOne({
    _id: id,
    status: 'approved'
  }).populate('user', 'name');
};

// Return IDs of approved vendors
export const findApprovedIds = () => {
  return Vendor.distinct('_id', {
    status: 'approved'
  });
};