import express from 'express';
import pool from './config/database.js';
import dotenv from 'dotenv';
import cors from 'cors';

// route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import reviewRoutes from './routes/review.js';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// register routes with prefix /api
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

// Test MySQL connection
async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL Database');
    connection.release();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MySQL connection error:', err.message);
    process.exit(1);
  }
}

startServer();
