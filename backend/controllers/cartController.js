import * as Cart from '../models/Cart.js';

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    const cart = await Cart.getOrCreateCart(userId);
    const result = await Cart.addItemToCart(cart.id, productId, quantity);
    
    res.status(201).json({ message: 'Item added to cart', cartId: cart.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.getOrCreateCart(req.params.userId);
    
    const success = await Cart.updateCartItemQuantity(cart.id, productId, quantity);
    if (!success) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.getOrCreateCart(req.params.userId);
    const success = await Cart.clearCart(cart.id);
    
    res.status(200).json({ message: 'Cart has been deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.getOrCreateCart(req.params.userId);
    const items = await Cart.getCartItems(cart.id);
    
    res.status(200).json({ ...cart, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
