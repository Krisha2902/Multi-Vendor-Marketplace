import mongoose from 'mongoose';

// DRAFT MODEL (placeholder): the vendor-flow teammate (Day 2 in the plan) may replace this.
// A Vendor is the "shop profile" of a User whose role is 'vendor'.
const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one shop per vendor user
    },
    shopName: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Vendor', vendorSchema);
