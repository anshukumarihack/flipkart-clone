import * as Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, address } = req.body;
    const orderId = await Order.createOrder(userId, totalPrice, address, items);
    res.status(201).json({ id: orderId, message: 'Order created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const success = await Order.updateOrderStatus(req.params.id, status);
    if (!success) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const success = await Order.deleteOrder(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order has been deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.getOrdersByUserId(req.params.userId);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
