import pool from '../config/database.js';

export const createProduct = async (data) => {
  const { title, brand, category, subcategory, description, images, price, originalPrice, discount, stock, seller, isFeatured, badge, tags } = data;
  
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, image, stock, categoryId) 
     VALUES (?, ?, ?, ?, ?, (SELECT id FROM categories WHERE name = ? LIMIT 1))`,
    [title, description, price, images?.[0] || null, stock, category]
  );
  return result.insertId;
};

export const getProductById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0] || null;
};

export const updateProduct = async (id, data) => {
  const updates = [];
  const values = [];
  
  if (data.title !== undefined) {
    updates.push('name = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }
  if (data.price !== undefined) {
    updates.push('price = ?');
    values.push(data.price);
  }
  if (data.stock !== undefined) {
    updates.push('stock = ?');
    values.push(data.stock);
  }
  if (data.images?.[0] !== undefined) {
    updates.push('image = ?');
    values.push(data.images[0]);
  }
  
  if (updates.length === 0) return null;
  
  values.push(id);
  const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
};

export const deleteProduct = async (id) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getAllProducts = async (filters = {}) => {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (filters.search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.category) {
    query += ' AND categoryId = (SELECT id FROM categories WHERE name = ? LIMIT 1)';
    params.push(filters.category);
  }
  if (filters.minPrice !== undefined) {
    query += ' AND price >= ?';
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query += ' AND price <= ?';
    params.push(filters.maxPrice);
  }
  if (filters.inStock === 'true') {
    query += ' AND stock > 0';
  }

  if (filters.sort === 'price_asc') query += ' ORDER BY price ASC';
  else if (filters.sort === 'price_desc') query += ' ORDER BY price DESC';
  else query += ' ORDER BY id DESC';

  if (filters.limit && filters.offset !== undefined) {
    query += ' LIMIT ? OFFSET ?';
    params.push(filters.limit, filters.offset);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

export const getProductCount = async (filters = {}) => {
  let query = 'SELECT COUNT(*) as count FROM products WHERE 1=1';
  const params = [];

  if (filters.search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.category) {
    query += ' AND categoryId = (SELECT id FROM categories WHERE name = ? LIMIT 1)';
    params.push(filters.category);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].count;
};
