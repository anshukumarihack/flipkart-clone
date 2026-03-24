import * as User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await User.createUser(name, email, hashedPassword);
    
    res.status(201).json({ id: userId, email, message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ ...userWithoutPassword, accessToken: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
