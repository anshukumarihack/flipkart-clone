import pool from '../config/database.js';

export const createReview = async (userId, productId, rating, comment = '') => {
  const [result] = await pool.query(
    'INSERT INTO reviews (userId, productId, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, productId, rating, comment]
  );
  return result.insertId;
};

export const getReviewById = async (id) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.username FROM reviews r 
     JOIN users u ON r.userId = u.id 
     WHERE r.id = ?`,
    [id]
  );
  return rows[0] || null;
};

export const getReviewsByProductId = async (productId) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.username FROM reviews r 
     JOIN users u ON r.userId = u.id 
     WHERE r.productId = ? 
     ORDER BY r.createdAt DESC`,
    [productId]
  );
  return rows;
};

export const getReviewsByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT r.*, p.name as productName FROM reviews r 
     JOIN products p ON r.productId = p.id 
     WHERE r.userId = ? 
     ORDER BY r.createdAt DESC`,
    [userId]
  );
  return rows;
};

export const updateReview = async (id, data) => {
  const updates = [];
  const values = [];
  
  if (data.rating !== undefined) {
    updates.push('rating = ?');
    values.push(data.rating);
  }
  if (data.comment !== undefined) {
    updates.push('comment = ?');
    values.push(data.comment);
  }
  
  if (updates.length === 0) return null;
  
  values.push(id);
  const query = `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
};

export const deleteReview = async (id) => {
  const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getAverageRating = async (productId) => {
  const [rows] = await pool.query(
    'SELECT AVG(rating) as averageRating, COUNT(*) as totalReviews FROM reviews WHERE productId = ?',
    [productId]
  );
  return rows[0];
};