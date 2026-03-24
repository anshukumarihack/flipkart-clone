import pool from './config/database.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // ======================
    // 1. ADMIN USER
    // ======================

    const [adminCheck] = await pool.query(
      "SELECT id FROM users WHERE username='admin'"
    );

    let adminId;

    if (adminCheck.length > 0) {
      console.log("⚠️ Admin already exists");
      adminId = adminCheck[0].id;
    } else {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('admin123', salt);

      const [result] = await pool.query(
        "INSERT INTO users (username,email,password,isAdmin) VALUES (?,?,?,?)",
        ['admin','admin@ecommerce.com',password,true]
      );

      adminId = result.insertId;
      console.log("✅ Admin created");
    }

    // ======================
    // 2. USERS
    // ======================

    const salt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash('user123', salt);

    async function getOrCreateUser(username,email){
      const [rows] = await pool.query(
        "SELECT id FROM users WHERE username=?",
        [username]
      );

      if(rows.length>0) return rows[0].id;

      const [result] = await pool.query(
        "INSERT INTO users (username,email,password) VALUES (?,?,?)",
        [username,email,userPassword]
      );

      return result.insertId;
    }

    const johnId = await getOrCreateUser('john_doe','john@example.com');
    const janeId = await getOrCreateUser('jane_smith','jane@example.com');

    console.log("✅ Users ready");

    // ======================
    // 3. CATEGORIES
    // ======================

    const categories = [
      { name:'Electronics', description:'Electronic gadgets and devices' },
      { name:'Clothing', description:'Men, women, and kids clothing' },
      { name:'Books', description:'Physical and digital books' },
      { name:'Home & Kitchen', description:'Home appliances and kitchen items' },
      { name:'Sports & Outdoors', description:'Sports equipment and outdoor gear' }
    ];

    const categoryIds = {};

    for(const cat of categories){

      const [rows] = await pool.query(
        "SELECT id FROM categories WHERE name=?",
        [cat.name]
      );

      if(rows.length>0){
        categoryIds[cat.name] = rows[0].id;
      } else {
        const [result] = await pool.query(
          "INSERT INTO categories (name,description) VALUES (?,?)",
          [cat.name,cat.description]
        );

        categoryIds[cat.name] = result.insertId;
      }
    }

    console.log("✅ Categories ready");

    // ======================
    // 4. PRODUCTS
    // ======================

    const products = [
      {
        name:'Wireless Bluetooth Headphones',
        description:'High-quality wireless headphones with noise cancellation',
        price:89.99,
        image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        stock:50,
        categoryId:categoryIds['Electronics'],
        brand:'SoundMax',
        discount:30,
        rating:4.5,
        reviewCount:128
      },
      {
        name:'Smart Watch Pro',
        description:'Advanced fitness tracking and notifications',
        price:199.99,
        image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        stock:35,
        categoryId:categoryIds['Electronics'],
        brand:'TechWear',
        discount:33,
        rating:4.7,
        reviewCount:256
      }
    ];

    const productIds=[];

    for(const p of products){

      const [rows] = await pool.query(
        "SELECT id FROM products WHERE name=?",
        [p.name]
      );

      if(rows.length>0){
        productIds.push(rows[0].id);
      } else {
        const [result] = await pool.query(
          `INSERT INTO products
          (name,description,price,image,stock,categoryId,brand,discount,rating,reviewCount)
          VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            p.name,p.description,p.price,p.image,
            p.stock,p.categoryId,p.brand,p.discount,
            p.rating,p.reviewCount
          ]
        );

        productIds.push(result.insertId);
      }
    }

    console.log("✅ Products ready");

    // ======================
    // 5. REVIEWS
    // ======================

    await pool.query(
      "INSERT INTO reviews (userId,productId,rating,comment) VALUES (?,?,?,?)",
      [johnId,productIds[0],5,'Excellent sound quality! Worth every penny.']
    );

    await pool.query(
      "INSERT INTO reviews (userId,productId,rating,comment) VALUES (?,?,?,?)",
      [janeId,productIds[1],4,'Good features, battery life is decent.']
    );

    console.log("✅ Reviews added");

    console.log("\n✨ Database seeding completed successfully!");
    console.log("Admin: admin@ecommerce.com / admin123");
    console.log("User: john@example.com / user123");

    process.exit(0);

  } catch(err){
    console.error("❌ Seeding failed:",err.message);
    process.exit(1);
  }
}

seedDatabase();