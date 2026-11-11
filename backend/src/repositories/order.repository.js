import Order from '../models/Order.js';

export const create = async (orderData) => {
  return Order.create(orderData);
};

export const findById = async (id) => {
  return Order.findById(id)
    .populate('customer', 'name email')
    .populate('items.product', 'title price discount images')
    .populate('items.vendor', 'shopName category');
};

export const findByOrderNumber = async (orderNumber) => {
  return Order.findOne({ orderNumber })
    .populate('customer', 'name email')
    .populate('items.product', 'title price discount images')
    .populate('items.vendor', 'shopName category');
};

export const findByCustomer = async (customerId) => {
  return Order.find({ customer: customerId })
    .populate('items.product', 'title price discount images')
    .populate('items.vendor', 'shopName category')
    .sort({ createdAt: -1 });
};

export const findByVendor = async (vendorId) => {
  return Order.find({ 'items.vendor': vendorId })
    .populate('customer', 'name email')
    .populate('items.product', 'title price discount images')
    .sort({ createdAt: -1 });
};

export const findAll = async (filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 50) => {
  return Order.find(filter)
    .populate('customer', 'name email')
    .populate('items.vendor', 'shopName category status')
    .populate('items.product', 'title price images')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

export const countAll = async (filter = {}) => Order.countDocuments(filter);

export const updateStatus = async (id, status) => {
  return Order.findByIdAndUpdate(id, { status }, { new: true });
};

