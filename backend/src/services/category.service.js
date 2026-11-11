import mongoose from 'mongoose';
import Product from '../models/Product.js';
import * as categoryRepo from '../repositories/category.repository.js';
import { ApiError } from '../utils/ApiError.js';

const toSlug = (name) =>
  name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const listCategories = async (includeInactive = false) => {
  const filter = includeInactive ? {} : { isActive: true };
  return categoryRepo.findAll(filter);
};

export const getCategoryById = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid category ID');
  const category = await categoryRepo.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
};

export const createCategory = async (data = {}) => {
  const { name, icon, image, description } = data || {};
  if (typeof name !== 'string' || !name.trim()) {
    throw new ApiError(400, 'Category name is required');
  }

  const slug = toSlug(name);
  if (!slug) throw new ApiError(400, 'Invalid category name');

  const existing = await categoryRepo.findBySlug(slug);
  if (existing) throw new ApiError(400, 'A category with this name or slug already exists');

  return categoryRepo.create({
    name: name.trim(),
    slug,
    icon: typeof icon === 'string' && icon.trim() ? icon.trim() : 'Shirt',
    image: typeof image === 'string' ? image.trim() : '',
    description: typeof description === 'string' ? description.trim() : '',
  });
};

export const updateCategory = async (id, data = {}) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid category ID');
  const category = await categoryRepo.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  const updateFields = {};

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || !data.name.trim()) {
      throw new ApiError(400, 'Category name cannot be empty');
    }
    const cleanName = data.name.trim();
    if (cleanName !== category.name) {
      const slug = toSlug(cleanName);
      if (!slug) throw new ApiError(400, 'Invalid category name');
      const existing = await categoryRepo.findBySlug(slug);
      if (existing && existing._id.toString() !== id) {
        throw new ApiError(400, 'Category name already taken');
      }
      updateFields.name = cleanName;
      updateFields.slug = slug;
    }
  }

  if (data.icon !== undefined && typeof data.icon === 'string') {
    updateFields.icon = data.icon.trim() || 'Shirt';
  }
  if (data.image !== undefined && typeof data.image === 'string') {
    updateFields.image = data.image.trim();
  }
  if (data.description !== undefined && typeof data.description === 'string') {
    updateFields.description = data.description.trim();
  }
  if (data.isActive !== undefined) {
    if (typeof data.isActive === 'boolean') {
      updateFields.isActive = data.isActive;
    } else if (data.isActive === 'true' || data.isActive === 'false') {
      updateFields.isActive = data.isActive === 'true';
    }
  }

  return categoryRepo.update(id, updateFields);
};

export const deleteCategory = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid category ID');
  const category = await categoryRepo.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  const inUse = await Product.exists({ category: id });
  if (inUse) {
    throw new ApiError(400, 'Cannot delete category while products are assigned to it');
  }

  return categoryRepo.deleteById(id);
};

