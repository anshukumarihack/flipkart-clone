import pool from '../config/database.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, username, email, firstName, lastName, address, city, zipCode, country, phone, isAdmin, createdAt, updatedAt FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

export const createUser = async (username, email, password, isAdmin = false) => {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)',
    [username, email, password, isAdmin]
  );
  return result.insertId;
};

export const updateUser = async (id, data) => {
  const updates = [];
  const values = [];
  
  if (data.firstName !== undefined) {
    updates.push('firstName = ?');
    values.push(data.firstName);
  }
  if (data.lastName !== undefined) {
    updates.push('lastName = ?');
    values.push(data.lastName);
  }
  if (data.address !== undefined) {
    updates.push('address = ?');
    values.push(data.address);
  }
  if (data.city !== undefined) {
    updates.push('city = ?');
    values.push(data.city);
  }
  if (data.zipCode !== undefined) {
    updates.push('zipCode = ?');
    values.push(data.zipCode);
  }
  if (data.country !== undefined) {
    updates.push('country = ?');
    values.push(data.country);
  }
  if (data.phone !== undefined) {
    updates.push('phone = ?');
    values.push(data.phone);
  }
  if (data.password !== undefined) {
    updates.push('password = ?');
    values.push(data.password);
  }
  
  if (updates.length === 0) return null;
  
  values.push(id);
  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, values);
  return result.affectedRows > 0;
};

export const deleteUser = async (id) => {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, username, email, firstName, lastName, isAdmin, createdAt FROM users');
  return rows;
};
