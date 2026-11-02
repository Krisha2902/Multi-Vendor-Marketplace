import mongoose from 'mongoose';

// One cart per customer. Items can come from many vendors (each item remembers its vendor).
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // vendor = User _id of the seller (same as Product.vendor). Stored so the cart can be
    // grouped per vendor without extra lookups.
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [99, 'Quantity cannot exceed 99'],
      validate: { validator: Number.isInteger, message: 'Quantity must be a whole number' },
      default: 1,
    },
    // Price when the item was added. The server must still re-read the real price at checkout.
    priceAtAdd: { type: Number, required: true, min: 0 },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // enforces "one cart per user"
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

// Reference check: every item's product must exist and its vendor must match the product's vendor.
cartSchema.pre('validate', async function () {
  if (!this.isModified('items') || this.items.length === 0) return;

  const Product = mongoose.model('Product');
  const ids = this.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: ids } }).select('vendor');
  const vendorByProduct = new Map(products.map((p) => [String(p._id), String(p.vendor)]));

  for (const item of this.items) {
    const realVendor = vendorByProduct.get(String(item.product));
    if (!realVendor) {
      this.invalidate('items', `Product ${item.product} does not exist`);
    } else if (realVendor !== String(item.vendor)) {
      this.invalidate('items', `Vendor does not match product ${item.product}`);
    }
  }
});

// Total of all items (quantity x priceAtAdd). Virtuals are not stored in MongoDB.
cartSchema.virtual('totalAmount').get(function () {
  return this.items.reduce((sum, i) => sum + i.quantity * i.priceAtAdd, 0);
});
cartSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Cart', cartSchema);
