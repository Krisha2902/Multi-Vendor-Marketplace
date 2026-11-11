import crypto from 'crypto';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import * as orderRepo from '../repositories/order.repository.js';
import * as vendorRepo from '../repositories/vendor.repository.js';
import * as productRepo from '../repositories/product.repository.js';
import { ApiError } from '../utils/ApiError.js';

const VALID_PAYMENT_METHODS = ['card', 'upi', 'cod'];
const VALID_ITEM_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const generateOrderNumber = () => {
  const token = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SN-${new Date().getFullYear()}-${token}`;
};

const computeVendorOrderStatus = (vendorItems = [], fallbackStatus = 'confirmed') => {
  if (vendorItems.length === 0) return fallbackStatus;
  if (vendorItems.every((it) => it.itemStatus === 'cancelled')) return 'cancelled';

  const activeItems = vendorItems.filter((it) => it.itemStatus !== 'cancelled');
  if (activeItems.every((it) => it.itemStatus === 'delivered')) return 'delivered';
  if (activeItems.every((it) => it.itemStatus === 'shipped' || it.itemStatus === 'delivered')) return 'shipped';
  if (activeItems.some((it) => it.itemStatus === 'processing' || it.itemStatus === 'shipped' || it.itemStatus === 'delivered')) {
    return 'processing';
  }
  return 'pending';
};

export const placeOrder = async ({ customerId, items, shippingAddress, paymentMethod = 'card' }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  const hasValidAddress =
    shippingAddress &&
    typeof shippingAddress.fullName === 'string' && shippingAddress.fullName.trim() &&
    typeof shippingAddress.street === 'string' && shippingAddress.street.trim() &&
    typeof shippingAddress.city === 'string' && shippingAddress.city.trim() &&
    typeof shippingAddress.postalCode === 'string' && shippingAddress.postalCode.trim();

  if (!hasValidAddress) {
    throw new ApiError(400, 'Complete shipping address is required');
  }

  const chosenMethod = paymentMethod ?? 'card';
  if (!VALID_PAYMENT_METHODS.includes(chosenMethod)) {
    throw new ApiError(400, `Invalid payment method. Allowed: ${VALID_PAYMENT_METHODS.join(', ')}`);
  }

  // Aggregate duplicate product rows so stock checks consider total quantity
  const quantityMap = new Map();
  for (const item of items) {
    const rawProductId = item?.product || item?.productId || item?.id;
    if (!rawProductId || !mongoose.Types.ObjectId.isValid(rawProductId)) {
      throw new ApiError(400, 'Invalid product ID in order items');
    }

    const numericQty = Number(item?.quantity);
    if (!Number.isInteger(numericQty) || numericQty < 1) {
      throw new ApiError(400, 'Item quantity must be a positive integer');
    }

    const key = String(rawProductId);
    quantityMap.set(key, (quantityMap.get(key) || 0) + numericQty);
  }

  const processedItems = [];

  // Step 1: Validate catalog product, category, approved vendor & server price
  for (const [productId, quantity] of quantityMap.entries()) {
    const product = await Product.findById(productId).populate('category', 'isActive');
    if (!product) {
      throw new ApiError(404, 'One or more products in your cart could not be found');
    }

    if (!product.isActive || !product.category || product.category.isActive === false) {
      throw new ApiError(400, `Product "${product.title}" is currently not available.`);
    }

    const approvedVendor = await vendorRepo.findPublicById(product.vendor);
    if (!approvedVendor) {
      throw new ApiError(400, `Seller for "${product.title}" is currently unavailable.`);
    }

    if (product.stock < quantity) {
      throw new ApiError(400, `Insufficient stock for "${product.title}". Only ${product.stock} available.`);
    }

    const realPrice = (product.discount && product.discount > 0)
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

    processedItems.push({
      product: product._id,
      title: product.title,
      price: realPrice,
      quantity,
      image: product.images?.[0] || '',
      vendor: product.vendor,
      itemStatus: 'pending',
    });
  }

  // Step 2: Compute server-verified totals & payment state
  const subtotal = processedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;
  const paymentStatus = chosenMethod === 'cod' ? 'pending' : 'paid';
  const status = 'confirmed';

  const orderData = {
    orderNumber: generateOrderNumber(),
    customer: customerId,
    items: processedItems,
    shippingAddress: {
      fullName: shippingAddress.fullName.trim(),
      street: shippingAddress.street.trim(),
      city: shippingAddress.city.trim(),
      postalCode: shippingAddress.postalCode.trim(),
      phone: typeof shippingAddress.phone === 'string' ? shippingAddress.phone.trim() : '',
    },
    paymentMethod: chosenMethod,
    paymentStatus,
    subtotal,
    shippingFee,
    totalAmount,
    status,
  };

  // Step 3: Atomically decrement stock and create order, rolling back stock on failure
  const decremented = [];
  try {
    for (const item of processedItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, isActive: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updated) {
        throw new ApiError(400, `Insufficient stock for "${item.title}". Please refresh your cart.`);
      }
      decremented.push({ product: item.product, quantity: item.quantity });
    }

    const createdOrder = await orderRepo.create(orderData);
    return orderRepo.findById(createdOrder._id);
  } catch (err) {
    await Promise.all(
      decremented.map((entry) =>
        Product.findByIdAndUpdate(entry.product, { $inc: { stock: entry.quantity } })
      )
    );
    throw err;
  }
};

export const getCustomerOrders = async (customerId) => {
  return orderRepo.findByCustomer(customerId);
};

export const getOrderById = async (orderId, userId, userRole) => {
  let order;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await orderRepo.findById(orderId);
  } else {
    order = await orderRepo.findByOrderNumber(orderId);
  }

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (userRole === 'admin') {
    return order;
  }

  const isCustomer = order.customer && order.customer._id.toString() === userId.toString();
  if (isCustomer) {
    return order;
  }

  const vendor = await vendorRepo.findByUserId(userId);
  const vendorItems = vendor
    ? order.items.filter((it) => {
        const itemVendorId = it.vendor?._id || it.vendor;
        return itemVendorId && itemVendorId.toString() === vendor._id.toString();
      })
    : [];

  if (vendorItems.length === 0) {
    throw new ApiError(403, 'You are not authorized to view this order');
  }

  // Scope multi-vendor orders so a seller only inspects their own items
  const activeVendorItems = vendorItems.filter((it) => it.itemStatus !== 'cancelled');
  const vendorTotal = activeVendorItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  const plainOrder = order.toObject();

  return {
    ...plainOrder,
    items: vendorItems,
    vendorTotal,
    vendorStatus: computeVendorOrderStatus(vendorItems, plainOrder.status),
  };
};

// Day 6: Vendor Order Management & Fulfillment
export const getVendorOrders = async (userId) => {
  const vendor = await vendorRepo.findByUserId(userId);
  if (!vendor || vendor.status !== 'approved') {
    throw new ApiError(403, 'Approved vendor profile required to view orders');
  }

  const allOrders = await orderRepo.findByVendor(vendor._id);

  // Filter orders to only expose vendor's items & relevant customer shipping info
  return allOrders.map((ord) => {
    const vendorItems = ord.items.filter((item) => {
      const itemVendorId = item.vendor?._id || item.vendor;
      return itemVendorId && itemVendorId.toString() === vendor._id.toString();
    });
    const activeVendorItems = vendorItems.filter((it) => it.itemStatus !== 'cancelled');
    const vendorTotal = activeVendorItems.reduce(
      (sum, it) => sum + (it.price * it.quantity),
      0
    );

    return {
      _id: ord._id,
      orderNumber: ord.orderNumber,
      createdAt: ord.createdAt,
      customer: ord.customer ? { name: ord.customer.name, email: ord.customer.email } : null,
      shippingAddress: ord.shippingAddress,
      paymentMethod: ord.paymentMethod,
      paymentStatus: ord.paymentStatus,
      status: ord.status,
      vendorStatus: computeVendorOrderStatus(vendorItems, ord.status),
      items: vendorItems,
      vendorTotal,
    };
  });
};

export const updateVendorOrderStatus = async ({ userId, orderId, status, itemId }) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, 'Invalid order ID');
  }

  if (itemId !== undefined && itemId !== null && itemId !== '' && !mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, 'Invalid item ID');
  }

  if (!VALID_ITEM_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid order status. Allowed: ${VALID_ITEM_STATUSES.join(', ')}`);
  }

  const vendor = await vendorRepo.findByUserId(userId);
  if (!vendor || vendor.status !== 'approved') {
    throw new ApiError(403, 'Approved vendor profile required');
  }

  const order = await orderRepo.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const vendorItems = order.items.filter((item) => {
    const itemVendorId = item.vendor?._id || item.vendor;
    return itemVendorId && itemVendorId.toString() === vendor._id.toString();
  });

  if (vendorItems.length === 0) {
    throw new ApiError(403, 'You do not have any items in this order to fulfill');
  }

  const targetItems = itemId
    ? vendorItems.filter((item) => item._id.toString() === String(itemId))
    : vendorItems;

  if (targetItems.length === 0) {
    throw new ApiError(404, 'Order item not found for this vendor');
  }

  const newlyCancelled = [];
  for (const item of targetItems) {
    if (item.itemStatus === status) continue;
    if (item.itemStatus === 'delivered' || item.itemStatus === 'cancelled') {
      throw new ApiError(400, `Cannot change item status from ${item.itemStatus} to ${status}`);
    }
    if (status === 'cancelled') {
      const prodId = item.product?._id || item.product;
      if (prodId) {
        newlyCancelled.push({ product: prodId, quantity: item.quantity });
      }
    }
    item.itemStatus = status;
  }

  // Recalculate overall order status based on non-cancelled items
  const allCancelled = order.items.every((it) => it.itemStatus === 'cancelled');
  const activeItems = order.items.filter((it) => it.itemStatus !== 'cancelled');

  if (allCancelled) {
    order.status = 'cancelled';
  } else if (activeItems.every((it) => it.itemStatus === 'delivered')) {
    order.status = 'delivered';
    if (order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }
  } else if (activeItems.every((it) => it.itemStatus === 'shipped' || it.itemStatus === 'delivered')) {
    order.status = 'shipped';
  } else if (activeItems.some((it) => it.itemStatus === 'processing' || it.itemStatus === 'shipped' || it.itemStatus === 'delivered')) {
    order.status = 'processing';
  } else {
    order.status = 'confirmed';
  }

  await order.save();

  if (newlyCancelled.length > 0) {
    await Promise.all(
      newlyCancelled.map((entry) =>
        Product.findByIdAndUpdate(entry.product, { $inc: { stock: entry.quantity } })
      )
    );
  }

  return order;
};

// Day 6: Vendor Statistics (Revenue, Total Orders, Products, Pending)
export const getVendorStats = async (userId) => {
  const vendor = await vendorRepo.findByUserId(userId);
  if (!vendor || vendor.status !== 'approved') {
    throw new ApiError(403, 'Approved vendor profile required');
  }

  const [totalProducts, vendorOrders] = await Promise.all([
    productRepo.countByVendor(vendor._id),
    orderRepo.findByVendor(vendor._id),
  ]);

  let totalRevenue = 0;
  let pendingOrders = 0;

  for (const ord of vendorOrders) {
    const vendorItems = ord.items.filter((item) => {
      const itemVendorId = item.vendor?._id || item.vendor;
      return itemVendorId && itemVendorId.toString() === vendor._id.toString();
    });

    const activeVendorItems = vendorItems.filter((it) => it.itemStatus !== 'cancelled');
    const orderSubtotal = activeVendorItems.reduce(
      (sum, it) => sum + (it.price * it.quantity),
      0
    );
    const allVendorDelivered =
      activeVendorItems.length > 0 &&
      activeVendorItems.every((it) => it.itemStatus === 'delivered');

    if (
      ord.status !== 'cancelled' &&
      activeVendorItems.length > 0 &&
      (ord.paymentStatus === 'paid' || allVendorDelivered)
    ) {
      totalRevenue += orderSubtotal;
    }

    const hasPending = activeVendorItems.some(
      (it) => it.itemStatus === 'pending' || it.itemStatus === 'processing'
    );
    if (ord.status !== 'cancelled' && hasPending) {
      pendingOrders += 1;
    }
  }

  return {
    vendor: {
      id: vendor._id,
      shopName: vendor.shopName,
      category: vendor.category,
      status: vendor.status,
    },
    stats: {
      totalProducts,
      totalOrders: vendorOrders.length,
      totalRevenue,
      pendingOrders,
    },
  };
};
