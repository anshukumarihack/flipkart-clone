import * as User from '../models/User.js';
import bcrypt from 'bcryptjs';

// fetch basic profile
export const getUser = async (req, res) => {
  try {
    const user = await User.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update profile (name/email/password)
export const updateUser = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // if password is being updated, hash it first
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    
    const success = await User.updateUser(req.params.id, data);
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = await User.findUserById(req.params.id);
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Wishlist feature requires additional table setup' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateWishlist = async (req, res) => {
  try {
    const user = await User.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Wishlist feature requires additional table setup' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};