import mongoose from 'mongoose';

const validateProductImages = (val) => {
  const list = Array.isArray(val) ? val : typeof val === 'string' ? [val] : null;
  if (!list) {
    return 'Product images must be a list of image URLs';
  }
  const clean = list
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length <= 2000 && !/^javascript:/i.test(item));
  if (clean.length === 0) {
    return 'Please provide at least one valid product image URL';
  }
  if (clean.length > 10) {
    return 'You can upload at most 10 product images';
  }
  return null;
};

export const registerSchema = {
  fields: {
    name: { type: 'string', required: true, label: 'Name', minLength: 2, maxLength: 80 },
    email: { type: 'email', required: true, label: 'Email' },
    password: { type: 'rawString', required: true, label: 'Password', minLength: 6, maxLength: 128 },
  },
};

export const loginSchema = {
  fields: {
    email: { type: 'email', required: true, label: 'Email' },
    password: { type: 'rawString', required: true, label: 'Password', minLength: 1, maxLength: 128 },
  },
};

export const vendorApplySchema = {
  fields: {
    shopName: { type: 'string', required: true, label: 'Shop name', minLength: 2, maxLength: 80 },
    category: { type: 'string', required: true, label: 'Category', minLength: 2, maxLength: 60 },
    description: { type: 'string', required: false, label: 'Description', maxLength: 600 },
  },
};

export const reasonOptionalSchema = {
  allowEmptyBody: true,
  fields: {
    reason: { type: 'string', required: false, label: 'Reason', maxLength: 300 },
  },
};

export const userStatusSchema = {
  fields: {
    isActive: { type: 'boolean', required: true, label: 'Account active status' },
  },
};

export const createCategorySchema = {
  fields: {
    name: { type: 'string', required: true, label: 'Category name', minLength: 2, maxLength: 60 },
    icon: { type: 'string', required: false, label: 'Icon name', maxLength: 40 },
    image: { type: 'string', required: false, label: 'Image URL', maxLength: 2000 },
    description: { type: 'string', required: false, label: 'Description', maxLength: 500 },
    isActive: { type: 'boolean', required: false, label: 'Active flag' },
  },
};

export const updateCategorySchema = {
  fields: {
    name: { type: 'string', required: false, label: 'Category name', minLength: 2, maxLength: 60 },
    icon: { type: 'string', required: false, label: 'Icon name', maxLength: 40 },
    image: { type: 'string', required: false, label: 'Image URL', maxLength: 2000 },
    description: { type: 'string', required: false, label: 'Description', maxLength: 500 },
    isActive: { type: 'boolean', required: false, label: 'Active flag' },
  },
};

export const createProductSchema = {
  fields: {
    title: { type: 'string', required: true, label: 'Product title', minLength: 2, maxLength: 160 },
    description: { type: 'string', required: true, label: 'Product description', minLength: 2, maxLength: 4000 },
    price: { type: 'number', required: true, label: 'Price', min: 0, max: 10000000 },
    discount: { type: 'number', required: false, allowEmpty: true, label: 'Discount', min: 0, max: 100 },
    stock: { type: 'number', required: false, allowEmpty: true, label: 'Stock', integer: true, min: 0, max: 1000000 },
    category: { type: 'objectId', required: true, label: 'Category ID' },
    images: { required: true, label: 'Product images', custom: validateProductImages },
  },
};

export const updateProductSchema = {
  fields: {
    title: { type: 'string', required: false, label: 'Product title', minLength: 2, maxLength: 160 },
    description: { type: 'string', required: false, label: 'Product description', minLength: 2, maxLength: 4000 },
    price: { type: 'number', required: false, label: 'Price', min: 0, max: 10000000 },
    discount: { type: 'number', required: false, allowEmpty: true, label: 'Discount', min: 0, max: 100 },
    stock: { type: 'number', required: false, allowEmpty: true, label: 'Stock', integer: true, min: 0, max: 1000000 },
    isActive: { type: 'boolean', required: false, coerceBoolean: true, label: 'Active flag' },
    category: { type: 'objectId', required: false, label: 'Category ID' },
    images: { required: false, label: 'Product images', custom: validateProductImages },
  },
};

export const createOrderSchema = {
  fields: {
    items: {
      type: 'array',
      required: true,
      label: 'Order items',
      minItems: 1,
      maxItems: 50,
      of: {
        type: 'object',
        label: 'Order item',
        fields: {
          quantity: { type: 'number', required: true, integer: true, min: 1, max: 99, label: 'Item quantity' },
        },
        custom: (item) => {
          const rawId = item.product || item.productId || item.id;
          if (!rawId || typeof rawId !== 'string' || !mongoose.isValidObjectId(rawId)) {
            return 'Invalid product ID in order items';
          }
          return null;
        },
      },
    },
    shippingAddress: {
      type: 'object',
      required: true,
      label: 'Shipping address',
      fields: {
        fullName: { type: 'string', required: true, label: 'Full name', minLength: 2, maxLength: 100 },
        street: { type: 'string', required: true, label: 'Street address', minLength: 3, maxLength: 200 },
        city: { type: 'string', required: true, label: 'City', minLength: 2, maxLength: 80 },
        postalCode: { type: 'string', required: true, label: 'Postal code', minLength: 3, maxLength: 20 },
        phone: { type: 'string', required: false, allowEmpty: true, label: 'Phone number', maxLength: 25 },
      },
    },
    paymentMethod: {
      type: 'string',
      required: false,
      label: 'Payment method',
      enum: ['card', 'upi', 'cod'],
    },
  },
};

export const vendorOrderStatusSchema = {
  fields: {
    status: {
      type: 'string',
      required: true,
      label: 'Order status',
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    },
    itemId: {
      type: 'objectId',
      required: false,
      allowEmpty: true,
      label: 'Order item ID',
    },
  },
};
