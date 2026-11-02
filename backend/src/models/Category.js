import mongoose from 'mongoose';

// DRAFT MODEL (placeholder): the teammate who owns "Categories" may replace this file.
// Field names follow docs/IMPLEMENTATION_PLAN.md (Day 3) so the swap is painless.
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    // slug is the URL-friendly id, e.g. "home-living". Used by the ?category= filter.
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, default: '' },
    icon: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
