import * as Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = await Category.createCategory(name, description);
    res.status(201).json({ id, name, description, message: 'Category created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const success = await Category.updateCategory(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const success = await Category.deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};