
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },

    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      default: 1,
      min: [0, 'Stock cannot be negative'],
    },

    images: {
      type: [String],
      validate: {
        validator: (images) =>
          Array.isArray(images) && images.length > 0,
        message: 'A product must have at least one image',
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor reference is required'],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 4.8,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate discounted price
productSchema.virtual('discountedPrice').get(function () {
  if (this.discount > 0) {
    return Math.round(
      this.price * (1 - this.discount / 100)
    );
  }

  return this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);