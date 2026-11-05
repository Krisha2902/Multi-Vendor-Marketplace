import * as categoryService from '../services/category.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories(req.query.all === 'true');
  res.json({ categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  res.json({ category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ message: 'Category created successfully', category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json({ message: 'Category updated successfully', category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.json({ message: 'Category deleted successfully' });
});

