import mongoose from 'mongoose';

// DRAFT: one purchased line of an order.
//
// Recommended approach (see docs/BACKEND_WEEK1_WEEK2.md):
//  - The team plan (Day 5) embeds items inside Order: `items: [orderItemSchema]`.
//    That works: import { orderItemSchema } and use it in the Order model.
//  - Vendors must list/update only THEIR items (GET /vendor/orders, PATCH status), which is
//    easier and faster with a separate collection indexed by `vendor`.
// So this file exports BOTH the sub-schema (named export) and a model (default export).
// Whoever builds Order should pick one and tell the team.
export const orderItemSchema = new mongoose.Schema(
  {
    // `order` is required only when OrderItem is used as its own collection.
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Snapshots: copied at purchase time so old orders never change if the product is edited.
    productName: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      validate: { validator: Number.isInteger, message: 'Quantity must be a whole number' },
    },
    unitPrice: { type: Number, required: true, min: 0 },
    itemStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

orderItemSchema.virtual('lineTotal').get(function () {
  return this.quantity * this.unitPrice;
});
orderItemSchema.set('toJSON', { virtuals: true });

export default mongoose.model('OrderItem', orderItemSchema);
