import pool from '../config/database.js';

export const getOrCreateCart = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM carts WHERE userId = ?', [userId]);
  
  if (rows.length > 0) {
    return rows[0];
  }
  
  const [result] = await pool.query('INSERT INTO carts (userId) VALUES (?)', [userId]);
  return { id: result.insertId, userId };
};

export const getCartById = async (cartId) => {
  const [rows] = await pool.query('SELECT * FROM carts WHERE id = ?', [cartId]);
  return rows[0] || null;
};

export const getCartItems = async (cartId) => {
  const [rows] = await pool.query(
    `SELECT ci.*, p.name, p.price FROM cartItems ci 
     JOIN products p ON ci.productId = p.id 
     WHERE ci.cartId = ?`,
    [cartId]
  );
  return rows;
};

export const addItemToCart = async (cartId, productId, quantity = 1) => {
  // Check if item already exists
  const [rows] = await pool.query(
    'SELECT * FROM cartItems WHERE cartId = ? AND productId = ?',
    [cartId, productId]
  );
  
  if (rows.length > 0) {
    // Update quantity
    const [result] = await pool.query(
      'UPDATE cartItems SET quantity = quantity + ? WHERE cartId = ? AND productId = ?',
      [quantity, cartId, productId]
    );
    return result.affectedRows > 0;
  } else {
    // Add new item
    const [product] = await pool.query('SELECT price FROM products WHERE id = ?', [productId]);
    const [result] = await pool.query(
      'INSERT INTO cartItems (cartId, productId, quantity, price) VALUES (?, ?, ?, ?)',
      [cartId, productId, quantity, product[0].price]
    );
    return result.insertId;
  }
};

export const removeItemFromCart = async (cartId, productId) => {
  const [result] = await pool.query(
    'DELETE FROM cartItems WHERE cartId = ? AND productId = ?',
    [cartId, productId]
  );
  return result.affectedRows > 0;
};

export const updateCartItemQuantity = async (cartId, productId, quantity) => {
  const [result] = await pool.query(
    'UPDATE cartItems SET quantity = ? WHERE cartId = ? AND productId = ?',
    [quantity, cartId, productId]
  );
  return result.affectedRows > 0;
};

export const clearCart = async (cartId) => {
  const [result] = await pool.query('DELETE FROM cartItems WHERE cartId = ?', [cartId]);
  return result.affectedRows > 0;
};
