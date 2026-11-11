import * as orderService from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  const order = await orderService.placeOrder({
    customerId: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getCustomerOrders(req.user._id);
  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(
    req.params.id,
    req.user._id,
    req.user.role
  );

  res.json({
    success: true,
    order,
  });
});

// Day 6: Vendor Order Management & Stats
export const getVendorOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getVendorOrders(req.user._id);
  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

export const updateVendorOrderStatus = asyncHandler(async (req, res) => {
  const { status, itemId } = req.body;
  const order = await orderService.updateVendorOrderStatus({
    userId: req.user._id,
    orderId: req.params.id,
    status,
    itemId,
  });

  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    order,
  });
});

export const getVendorStats = asyncHandler(async (req, res) => {
  const data = await orderService.getVendorStats(req.user._id);
  res.json({
    success: true,
    ...data,
  });
});
