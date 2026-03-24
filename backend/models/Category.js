import pool from '../config/database.js';

export const createCategory = async (name, description = null) => {
  const [result] = await pool.query(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description]
  );
  return result.insertId;
};

export const getCategoryById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
};

export const getCategoryByName = async (name) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE name = ?', [name]);
  return rows[0] || null;
};

export const updateCategory = async (id, data) => {
  const updates = [];
  const values = [];
  
  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }
  
  if (updates.length === 0) return null;
  
  values.push(id);
  const query = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
};

export const deleteCategory = async (id) => {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getAllCategories = async () => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  return rows;
};