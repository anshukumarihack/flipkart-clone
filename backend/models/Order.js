import pool from '../config/database.js';

export const createOrder = async (userId, totalPrice, shippingAddress, items = []) => {
  const [result] = await pool.query(
    'INSERT INTO orders (userId, totalPrice, shippingAddress, status) VALUES (?, ?, ?, ?)',
    [userId, totalPrice, JSON.stringify(shippingAddress), 'pending']
  );
  
  const orderId = result.insertId;
  
  // Add items to order
  for (const item of items) {
    await pool.query(
      'INSERT INTO orderItems (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.productId, item.quantity, item.price]
    );
  }
  
  return orderId;
};

export const getOrderById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
  return rows[0] || null;
};

export const getOrdersByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
  return rows;
};

export const getOrderItems = async (orderId) => {
  const [rows] = await pool.query(
    `SELECT oi.*, p.name FROM orderItems oi 
     JOIN products p ON oi.productId = p.id 
     WHERE oi.orderId = ?`,
    [orderId]
  );
  return rows;
};

export const updateOrderStatus = async (id, status) => {
  const [result] = await pool.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

export const deleteOrder = async (id) => {
  // Delete order items first
  await pool.query('DELETE FROM orderItems WHERE orderId = ?', [id]);
  
  // Delete order
  const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getAllOrders = async () => {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY createdAt DESC');
  return rows;
};
