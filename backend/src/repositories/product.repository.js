import Product from '../models/Product.js';

export const findByVendor = async (vendorId, filter = {}) => {
  return Product.find({ vendor: vendorId, ...filter })
    .populate('category', 'name slug icon')
    .sort({ createdAt: -1 });
};

export const findById = async (id) => {
  return Product.findById(id)
    .populate('category', 'name slug icon')
    .populate('vendor', 'shopName category');
};

export const create = async (data) => {
  const product = await Product.create(data);
  return Product.findById(product._id).populate('category', 'name slug icon');
};

export const update = async (id, data) => {
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('category', 'name slug icon')
    .populate('vendor', 'shopName category');
};

export const deleteById = async (id) => {
  return Product.findByIdAndDelete(id);
};

export const countByVendor = async (vendorId) => {
  return Product.countDocuments({ vendor: vendorId });
};

export const findAll = async (filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 50) => {
  return Product.find(filter)
    .populate('category', 'name slug icon')
    .populate('vendor', 'shopName category')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

