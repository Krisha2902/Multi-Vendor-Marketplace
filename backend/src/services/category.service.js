import * as categoryRepo from '../repositories/category.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const listCategories = async (includeInactive = false) => {
  const filter = includeInactive ? {} : { isActive: true };
  return categoryRepo.findAll(filter);
};

export const getCategoryById = async (id) => {
  const category = await categoryRepo.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
};

export const createCategory = async (data) => {
  const { name, icon, image, description } = data;
  if (!name || !name.trim()) throw new ApiError(400, 'Category name is required');

  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const existing = await categoryRepo.findBySlug(slug);
  if (existing) throw new ApiError(400, 'A category with this name or slug already exists');

  return categoryRepo.create({
    name: name.trim(),
    slug,
    icon: icon || 'Shirt',
    image: image || '',
    description: description || ''
  });
};

export const updateCategory = async (id, data) => {
  const category = await categoryRepo.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  if (data.name && data.name.trim() !== category.name) {
    const slug = data.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const existing = await categoryRepo.findBySlug(slug);
    if (existing && existing._id.toString() !== id) {
      throw new ApiError(400, 'Category name already taken');
    }
    data.slug = slug;
    data.name = data.name.trim();
  }

  return categoryRepo.update(id, data);
};

export const deleteCategory = async (id) => {
  const category = await categoryRepo.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');
  return categoryRepo.deleteById(id);
};

