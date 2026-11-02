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
