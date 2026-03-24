import * as Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const productId = await Product.createProduct(req.body);
    res.status(201).json({ id: productId, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const success = await Product.updateProduct(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const success = await Product.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product has been deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      sort,
      brands,
      minPrice,
      maxPrice,
      minRating,
      discount,
      inStock,
      page = 1,
      limit = 20,
    } = req.query;

    const filters = {
      search,
      category,
      sort,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    };

    const products = await Product.getAllProducts(filters);
    const total = await Product.getProductCount({ search, category });

    res.status(200).json({
      products,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
