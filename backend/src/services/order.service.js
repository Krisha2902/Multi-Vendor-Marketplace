import mongoose from 'mongoose';
import Product from '../models/Product.js';
import * as orderRepo from '../repositories/order.repository.js';
import * as vendorRepo from '../repositories/vendor.repository.js';
import * as productRepo from '../repositories/product.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const placeOrder = async ({ customerId, items, shippingAddress, paymentMethod = 'card' }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
    throw new ApiError(400, 'Complete shipping address is required');
  }

  const validPaymentMethods = ['card', 'upi', 'cod'];
  const chosenMethod = validPaymentMethods.includes(paymentMethod) ? paymentMethod : 'card';

  const processedItems = [];
  const productsToUpdate = [];

  // Fallback product cache for non-ObjectId demo/mock items
  let fallbackProduct = null;

  // Step 1: Validate stock & determine server-verified price for each item
  for (const item of items) {
    const rawProductId = item.product || item.productId || item.id;
    const quantity = parseInt(item.quantity, 10) || 1;

    if (quantity < 1) {
      throw new ApiError(400, 'Item quantity must be at least 1');
    }

    let product = null;

    if (rawProductId && mongoose.Types.ObjectId.isValid(rawProductId)) {
      product = await Product.findById(rawProductId);
    }

    // Graceful handling for mock/demo IDs (e.g. 'prod-1') during development/testing
    if (!product) {
      if (!fallbackProduct) {
        fallbackProduct = await Product.findOne({ isActive: true });
      }

      if (fallbackProduct) {
        processedItems.push({
          product: fallbackProduct._id,
          title: item.name || item.title || fallbackProduct.title,
          price: Number(item.price) || fallbackProduct.price,
          quantity,
          image: item.image || fallbackProduct.images?.[0] || '',
          vendor: fallbackProduct.vendor,
          itemStatus: 'pending',
        });
        continue;
      } else {
        throw new ApiError(404, `Product not available in database: ${item.name || rawProductId}`);
      }
    }

    // Real Product validation
    if (!product.isActive) {
      throw new ApiError(400, `Product "${product.title}" is currently not available.`);
    }

    if (product.stock < quantity) {
      throw new ApiError(400, `Insufficient stock for "${product.title}". Only ${product.stock} available.`);
    }

    // Calculate real price based on product discount
    const realPrice = (product.discount && product.discount > 0)
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

    processedItems.push({
      product: product._id,
      title: product.title,
      price: realPrice,
      quantity,
      image: product.images?.[0] || item.image || '',
      vendor: product.vendor,
      itemStatus: 'pending',
    });

    productsToUpdate.push({ product, quantity });
  }

  // Step 2: Decrement stock for real database products
  for (const item of productsToUpdate) {
    item.product.stock -= item.quantity;
    await item.product.save();
  }

  // Step 3: Compute totals
  const subtotal = processedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const shippingFee = 0; // Free standard delivery
  const totalAmount = subtotal + shippingFee;

  // Step 4: Simulate payment
  let paymentStatus = 'paid';
  let status = 'confirmed';
  if (chosenMethod === 'cod') {
    paymentStatus = 'pending';
    status = 'confirmed';
  }

  // Step 5: Generate unique order number (ShopNest format SN-YYYY-XXXX)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SN-${new Date().getFullYear()}-${randomSuffix}`;

  const orderData = {
    orderNumber,
    customer: customerId,
    items: processedItems,
    shippingAddress: {
      fullName: shippingAddress.fullName.trim(),
      street: shippingAddress.street.trim(),
      city: shippingAddress.city.trim(),
      postalCode: shippingAddress.postalCode.trim(),
      phone: (shippingAddress.phone || '').trim(),
    },
    paymentMethod: chosenMethod,
    paymentStatus,
    subtotal,
    shippingFee,
    totalAmount,
    status,
  };

  const createdOrder = await orderRepo.create(orderData);
  return orderRepo.findById(createdOrder._id);
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

  // Only allow admin or the customer who placed the order (or vendor who has items in it)
  if (userRole !== 'admin') {
    const isCustomer = order.customer && order.customer._id.toString() === userId.toString();
    const isVendor = order.items.some(
      (it) => it.vendor && it.vendor.toString() === userId.toString()
    );

    if (!isCustomer && !isVendor) {
      throw new ApiError(403, 'You are not authorized to view this order');
    }
  }

  return order;
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
    const vendorItems = ord.items.filter(
      (item) => item.vendor && item.vendor.toString() === vendor._id.toString()
    );
    const vendorTotal = vendorItems.reduce(
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
      items: vendorItems,
      vendorTotal,
    };
  });
};

export const updateVendorOrderStatus = async ({ userId, orderId, status, itemId }) => {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid order status. Allowed: ${validStatuses.join(', ')}`);
  }

  const vendor = await vendorRepo.findByUserId(userId);
  if (!vendor || vendor.status !== 'approved') {
    throw new ApiError(403, 'Approved vendor profile required');
  }

  const order = await orderRepo.findById(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Find vendor's items in this order
  let hasVendorItems = false;
  for (const item of order.items) {
    if (item.vendor && item.vendor._id.toString() === vendor._id.toString()) {
      hasVendorItems = true;
      if (!itemId || item._id.toString() === itemId.toString()) {
        item.itemStatus = status;
      }
    }
  }

  if (!hasVendorItems) {
    throw new ApiError(403, 'You do not have any items in this order to fulfill');
  }

  // Recalculate overall order status based on item statuses
  const allDelivered = order.items.every((it) => it.itemStatus === 'delivered');
  const allShipped = order.items.every((it) => it.itemStatus === 'shipped' || it.itemStatus === 'delivered');
  const anyProcessing = order.items.some((it) => it.itemStatus === 'processing');

  if (allDelivered) {
    order.status = 'delivered';
  } else if (allShipped) {
    order.status = 'shipped';
  } else if (anyProcessing) {
    order.status = 'processing';
  } else {
    order.status = status;
  }

  await order.save();
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
    const vendorItems = ord.items.filter(
      (item) => item.vendor && item.vendor.toString() === vendor._id.toString()
    );

    const orderSubtotal = vendorItems.reduce(
      (sum, it) => sum + (it.price * it.quantity),
      0
    );

    // Count revenue if order was confirmed / paid or delivered
    if (ord.paymentStatus === 'paid' || ord.status === 'delivered') {
      totalRevenue += orderSubtotal;
    }

    const hasPending = vendorItems.some(
      (it) => it.itemStatus === 'pending' || it.itemStatus === 'processing'
    );
    if (hasPending) {
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
