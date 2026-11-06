

import Product from '../models/Product.js';

// Find products belonging to a vendor
export const findByVendor = async (vendorId, filter = {}) => {
  return Product.find({
    ...filter,
    vendor: vendorId,
  })
    .populate('category', 'name slug icon')
    .populate('vendor', 'shopName category')
    .sort({ createdAt: -1 });
};

// Find product by ID
export const findById = async (id) => {
  return Product.findById(id)
    .populate('category', 'name slug icon')
    .populate('vendor', 'shopName category');
};

// Create product
export const create = async (data) => {
  const product = await Product.create(data);

  return Product.findById(product._id)
    .populate('category', 'name slug icon')
    .populate('vendor', 'shopName category');
};

// Update product
export const update = async (id, data) => {
  return Product.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('category', 'name slug icon')
    .populate('vendor', 'shopName category');
};

// Delete product
export const deleteById = async (id) => {
  return Product.findByIdAndDelete(id);
};

// Count products belonging to a vendor
export const countByVendor = async (vendorId) => {
  return Product.countDocuments({
    vendor: vendorId,
  });
};

// Find all products with filters, sorting and pagination
export const findAll = async (
  filter = {},
  sort = { createdAt: -1 },
  skip = 0,
  limit = 50
) => {
  return Product.find(filter)
    .populate('category', 'name slug icon')
    .populate('vendor', 'shopName category')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

// Count matching products
export const countAll = async (filter = {}) => {
  return Product.countDocuments(filter);
};
