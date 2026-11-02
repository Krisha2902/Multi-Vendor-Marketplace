import mongoose from 'mongoose';

// DRAFT MODEL (placeholder): the product-CRUD teammate (Day 3 in the plan) may replace this.
// `vendor` stores the _id of the vendor's USER account (role: 'vendor').
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 }, // price before discount (optional)
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isActive: { type: Boolean, default: true }, // inactive products are hidden from public APIs
  },
  { timestamps: true }
);

// Speeds up the public listing: active products of a category, newest first.
productSchema.index({ isActive: 1, category: 1, createdAt: -1 });

export default mongoose.model('Product', productSchema);
