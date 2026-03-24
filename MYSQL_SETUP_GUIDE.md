# 🚀 E-commerce Project - MySQL Setup & Testing Guide

## ✅ What's Been Done

### 1. **Database Setup**
- ✅ MySQL Server 9.6 running on localhost
- ✅ Database created: `ecommerce`
- ✅ 8 tables created with relationships:
  - `users` - User accounts
  - `categories` - Product categories
  - `products` - Product inventory
  - `reviews` - Product reviews
  - `carts` - Shopping carts
  - `cartItems` - Cart items
  - `orders` - Customer orders
  - `orderItems` - Order items

### 2. **Backend Migration (MongoDB → MySQL)**
- ✅ Models converted to raw SQL queries
- ✅ Controllers updated for MySQL
- ✅ Database connection configured with connection pooling
- ✅ Authentication with JWT tokens
- ✅ All CRUD operations working

### 3. **Seed Data Created**
- ✅ 1 Admin user
- ✅ 2 Regular users
- ✅ 5 Product categories
- ✅ 10 Sample products with images
- ✅ 5 Sample reviews

### 4. **Frontend Updates**
- ✅ Auth page redesigned with test credentials
- ✅ API helpers updated for MySQL responses
- ✅ Redux store updated for MySQL user fields
- ✅ Login/Signup with error handling

---

## 🔑 Test Credentials

### Admin Account
```
Email: admin@ecommerce.com
Password: admin123
```

### Regular User Account
```
Email: john@example.com
Password: user123
```

### Alternative User
```
Email: jane@example.com
Password: user123
```

---

## 🚀 How to Run the Project

### Step 1: Start MySQL Server
```powershell
# MySQL should already be running
Get-Service MySQL96 | Start-Service
```

### Step 2: Start the Backend Server
```powershell
cd "c:\Users\V\Downloads\e-commerce-blueprint\backend"
node server.js
# Or with auto-reload:
npm run dev
```
Backend runs on: **http://localhost:5000**

### Step 3: Start the Frontend
```powershell
cd "c:\Users\V\Downloads\e-commerce-blueprint"
npm run dev
```
Frontend runs on: **http://localhost:8080** (or as shown in terminal)

---

## 🔗 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Products
```
GET  /api/products              # List all products
GET  /api/products/:id          # Get single product
POST /api/products              # Create product (admin)
PUT  /api/products/:id          # Update product
DELETE /api/products/:id        # Delete product
```

### Categories
```
GET  /api/categories            # List categories
POST /api/categories            # Create category (admin)
PUT  /api/categories/:id        # Update category
DELETE /api/categories/:id      # Delete category
```

### Cart
```
GET  /api/cart/:userId          # Get user cart
POST /api/cart                  # Add to cart
PUT  /api/cart/:userId          # Update cart
DELETE /api/cart/:userId        # Clear cart
```

### Orders
```
GET  /api/orders                # Get all orders (admin)
GET  /api/orders/:userId        # Get user orders
POST /api/orders                # Create order
PUT  /api/orders/:id            # Update order status
DELETE /api/orders/:id          # Delete order
```

### Reviews
```
GET  /api/reviews/product/:productId   # Get product reviews
POST /api/reviews                       # Create review
DELETE /api/reviews/:id                 # Delete review
```

---

## 📋 Database Credentials

```
Host: localhost
Port: 3306
User: root
Password: 1982
Database: ecommerce
```

---

## 🧪 Testing the Login Page

1. **Navigate to Auth Page**: Open frontend and go to Auth page
2. **Use Test Credentials**: Click "Test User" or "Test Admin" buttons to auto-fill credentials
3. **Login**: Click LOGIN button
4. **Verify**: You should be redirected to the home page as authenticated user

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Kill existing Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Try starting again
cd backend
node server.js
```

### Port 5000 already in use
```powershell
Get-NetTCPConnection -LocalPort 5000
# Note the process ID (PID) and kill it
Stop-Process -Id <PID> -Force
```

### MySQL connection fails
```powershell
# Check MySQL service
Get-Service MySQL96

# Start if not running
Start-Service MySQL96

# Test connection
mysql -u root -p1982 -e "SELECT VERSION();"
```

### "Duplicate entry" when seeding (means data already exists)
The database is already seeded. No action needed.

---

## 📝 Files Modified/Created

### Backend
- `backend/config/database.js` - MySQL connection pool
- `backend/seed.js` - Sample data creation
- `backend/models/User.js` - User operations
- `backend/models/Product.js` - Product operations
- `backend/models/Category.js` - Category operations
- `backend/models/Cart.js` - Cart operations
- `backend/models/Order.js` - Order operations
- `backend/models/Review.js` - Review operations
- `backend/controllers/authController.js` - Auth endpoints
- `backend/controllers/productController.js` - Product endpoints
- `backend/controllers/cartController.js` - Cart endpoints
- `backend/controllers/categoryController.js` - Category endpoints
- `backend/controllers/orderController.js` - Order endpoints
- `backend/controllers/reviewController.js` - Review endpoints
- `backend/controllers/userController.js` - User endpoints

### Frontend
- `src/pages/Auth.tsx` - Updated auth page with test credentials
- `src/lib/api.ts` - Updated API helpers for MySQL
- `src/store/authSlice.ts` - Updated Redux store for MySQL user format

---

## 🎉 You're All Set!

Your e-commerce application is now fully integrated with MySQL!

**Next Steps:**
1. Test the login functionality with provided credentials
2. Explore the product catalog
3. Add items to cart
4. Create orders
5. Leave reviews on products

---

## 💡 Pro Tips

- Use the quick test buttons on the auth page to auto-fill credentials
- Check browser console for API errors
- Check backend terminal for server logs
- Database is persistent across restarts
- All sample data is already seeded

---

**Happy Shopping! 🛍️**
