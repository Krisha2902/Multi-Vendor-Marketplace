
import Category from '../models/Category.js';

export const findAll = async (filter = { isActive: true }) => {
  return Category.find(filter).sort({ name: 1 });
};

export const findById = async (id) => {
  return Category.findById(id);
};

export const findBySlug = async (slug) => {
  return Category.findOne({ slug });
};

export const create = async (data) => {
  return Category.create(data);
};

export const update = async (id, data) => {
  return Category.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
};

export const deleteById = async (id) => {
  return Category.findByIdAndDelete(id);
};
