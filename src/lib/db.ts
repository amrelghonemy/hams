import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "hamsstyle.db");

if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

let db: Database.Database;

declare global {
  var _db: Database.Database | undefined;
}

if (process.env.NODE_ENV === "production") {
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
} else {
  if (!global._db) {
    global._db = new Database(DB_PATH);
    global._db.pragma("journal_mode = WAL");
    global._db.pragma("foreign_keys = ON");
  }
  db = global._db;
}

// Auto-initialize and seed on import
initializeDatabase();
seedDatabase();

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT,
      description_en TEXT,
      description_ar TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description_en TEXT,
      description_ar TEXT,
      price REAL NOT NULL,
      sale_price REAL,
      category_id INTEGER,
      sku TEXT,
      stock INTEGER DEFAULT 0,
      images TEXT DEFAULT '[]',
      sizes TEXT DEFAULT '[]',
      colors TEXT DEFAULT '[]',
      is_new INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      tags TEXT DEFAULT '[]',
      meta_title_en TEXT,
      meta_title_ar TEXT,
      meta_description_en TEXT,
      meta_description_ar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'customer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      governorate TEXT,
      city TEXT,
      area TEXT,
      street TEXT,
      building TEXT,
      apartment TEXT,
      notes TEXT,
      is_default INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT NOT NULL,
      governorate TEXT,
      city TEXT,
      area TEXT,
      street TEXT,
      building TEXT,
      apartment TEXT,
      address_notes TEXT,
      subtotal REAL NOT NULL,
      shipping_cost REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT DEFAULT 'cod',
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name_en TEXT,
      product_name_ar TEXT,
      product_image TEXT,
      size TEXT,
      color TEXT,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      is_approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS discount_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      min_order REAL DEFAULT 0,
      max_uses INTEGER,
      used_count INTEGER DEFAULT 0,
      expires_at DATETIME,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
  `);
}

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

export function seedDatabase() {
  const count = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
  if (count && count.count > 0) return;

  const bcrypt = require("bcryptjs");

  // Seed Categories
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (name_en, name_ar, slug, image, description_en, description_ar, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const categories = [
    ["Dresses", "فساتين", "dresses", "/images/cat-dresses.jpg", "Elegant dresses for every occasion", "فساتين أنيقة لكل المناسبات", 1],
    ["Tops", "بلوزات", "tops", "/images/cat-tops.jpg", "Stylish tops and blouses", "بلوزات وتيشيرتات أنيقة", 2],
    ["Pants", "بناطيل", "pants", "/images/cat-pants.jpg", "Comfortable and trendy pants", "بناطيل مريحة وعصرية", 3],
    ["Sets", "طقم كامل", "sets", "/images/cat-sets.jpg", "Complete coordinated outfits", "أطقم ملابس متناسقة", 4],
    ["Outerwear", "عبايات", "outerwear", "/images/cat-outerwear.jpg", "Jackets, abayas and more", "جاكيتات وعبايات والمزيد", 5],
    ["Accessories", "إكسسوارات", "accessories", "/images/cat-accessories.jpg", "Complete your look", "أكملي إطلالتك", 6],
    ["New Arrivals", "وصل حديثاً", "new-arrivals", "/images/cat-new.jpg", "Fresh picks just for you", "أحدث الإصدارات", 7],
    ["Sale", "تخفيضات", "sale", "/images/cat-sale.jpg", "Great deals you don't want to miss", "عروض لا تفوتيها", 8],
  ];
  for (const cat of categories) {
    insertCategory.run(...cat);
  }

  // Seed Products
  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (
      name_en, name_ar, slug, description_en, description_ar,
      price, sale_price, category_id, sku, stock, images,
      sizes, colors, is_new, is_bestseller, is_active,
      rating, review_count, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const productImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&q=80",
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80",
    "https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80",
    "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    "https://images.unsplash.com/photo-1502716119720-b23a1e3b8b11?w=800&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    "https://images.unsplash.com/photo-1581044777550-4cfa60707998?w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    "https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=800&q=80",
    "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=800&q=80",
    "https://images.unsplash.com/photo-1585487000160-e5f8e53a7fbe?w=800&q=80",
    "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80",
  ];
  const products = [
    ["Elegant Maxi Dress", "فستان ماكسي أنيق", "elegant-maxi-dress", "A beautiful flowy maxi dress perfect for special occasions", "فستان ماكسي جميل ومنسدل مثالي للمناسبات الخاصة", 1299, 999, 1, "HS-DR-001", 25, [productImages[0], productImages[1]], '["S","M","L","XL"]', '["أسود","أبيض","بيج"]', 1, 1, 1, 4.8, 24, '["new","bestseller"]'],
    ["Silk Blend Blouse", "بلوزة قطن مدمج بالحرير", "silk-blend-blouse", "Luxurious silk blend blouse with elegant draping", "بلوزة فاخرة من القطن المدمج بالحرير مع ثنيات أنيقة", 899, null, 2, "HS-TOP-001", 30, [productImages[2], productImages[3]], '["XS","S","M","L","XL"]', '["أبيض","وردي","كحلي"]', 1, 0, 1, 4.5, 18, '["new"]'],
    ["Tailored Wide Leg Pants", "بناطيل واسعة مفصلة", "tailored-wide-leg-pants", "High-waisted wide leg pants for a chic look", "بناطيل واسعة عالية الخصر لإطلالة أنيقة", 799, 649, 3, "HS-PT-001", 20, [productImages[4], productImages[5]], '["S","M","L","XL"]', '["أسود","بيج","كحلي"]', 0, 1, 1, 4.7, 32, '["bestseller"]'],
    ["Two-Piece Co-ord Set", "طقم قطن كامل متناسق", "two-piece-coord-set", "Matching top and pants set for effortless style", "طقم متناسق من البلوزة والبناطيل لإطلالة سهلة", 1599, 1299, 4, "HS-SET-001", 15, [productImages[6], productImages[7]], '["S","M","L","XL"]', '["بيج","وردي","أخضر"]', 1, 1, 1, 4.9, 41, '["new","bestseller"]'],
    ["Oversized Linen Shirt", "قميص كتان واسع", "oversized-linen-shirt", "Breathable oversized linen shirt for casual elegance", "قميص كتان واسع قابل للتنفس للأناقة العصرية", 699, null, 2, "HS-TOP-002", 35, [productImages[8], productImages[9]], '["S","M","L","XL","XXL"]', '["أبيض","بيج","رمادي"]', 0, 0, 1, 4.3, 12, '[]'],
    ["Flowy Midi Dress", "فستان ميدي منسدل", "flowy-midi-dress", "Beautiful midi dress with a flattering silhouette", "فستان ميدي جميل مع ملمس مميز", 1099, 899, 1, "HS-DR-002", 18, [productImages[10], productImages[11]], '["S","M","L","XL"]', '["أزرق","أبيض","وردي"]', 1, 0, 1, 4.6, 15, '["new"]'],
    ["Premium Abaya", "عباية فاخرة", "premium-abaya", "Elegant premium abaya with modern design", "عباية فاخرة أنيقة بتصميم عصري", 1899, null, 5, "HS-OUT-001", 12, [productImages[12], productImages[13]], '["S","M","L","XL"]', '["أسود","كحلي","بيج"]', 0, 1, 1, 4.9, 28, '["bestseller"]'],
    ["Casual Denim Jacket", "جاكيت دينام كاجوال", "casual-denim-jacket", "Classic denim jacket for a relaxed look", "جاكيت دينام كلاسيكي لإطلالة مريحة", 999, 799, 5, "HS-OUT-002", 22, [productImages[14], productImages[15]], '["S","M","L","XL"]', '["أزرق","أزرق غامق"]', 0, 0, 1, 4.4, 9, '["sale"]'],
    ["High Waist Skinny Jeans", "جينز سكيني عالي الخصر", "high-waist-skinny-jeans", "Stretch skinny jeans with perfect fit", "جينز سكيني قابل للتمدد بمقاس مثالي", 599, 499, 3, "HS-PT-002", 40, [productImages[16], productImages[17]], '["XS","S","M","L","XL"]', '["أزرق","أسود","أزرق فاتح"]', 0, 1, 1, 4.5, 35, '["bestseller","sale"]'],
    ["Pearl Drop Earrings", "أقراط لؤلؤ متدلية", "pearl-drop-earrings", "Elegant pearl drop earrings for a sophisticated look", "أقراط لؤلؤ أنيقة لإطلالة راقية", 349, null, 6, "HS-ACC-001", 50, [productImages[18], productImages[19]], '["One Size"]', '["ذهبي","فضي"]', 1, 0, 1, 4.7, 20, '["new"]'],
    ["Pleated Maxi Skirt", "تنورة ماكسي مجعدة", "pleated-maxi-skirt", "Flowy pleated maxi skirt for elegant occasions", "تنورة ماكسي مجعدة منسدلة للمناسبات الأنيقة", 749, 599, 3, "HS-PT-003", 16, [productImages[0], productImages[2]], '["S","M","L"]', '["بيج","أسود","كحلي"]', 1, 0, 1, 4.4, 11, '["new","sale"]'],
    ["Structured Blazer", "بليزر مفصل", "structured-blazer", "Professional structured blazer for a polished look", "بليزر مهني مفصل لإطلالة أنيقة", 1399, null, 5, "HS-OUT-003", 10, [productImages[3], productImages[5]], '["S","M","L","XL"]', '["أسود","كحلي","بيج"]', 0, 1, 1, 4.8, 19, '["bestseller"]'],
  ];
  for (const prod of products) {
    insertProduct.run(
      prod[0], prod[1], prod[2], prod[3], prod[4],
      prod[5], prod[6], prod[7], prod[8], prod[9],
      JSON.stringify(prod[10]), prod[11], prod[12],
      prod[13], prod[14], prod[15], prod[16], prod[17], prod[18]
    );
  }

  // Seed Admin User
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin", "admin@hamsstyle.com", hashedPassword, "admin"
  );

  // Seed Discount Code
  db.prepare("INSERT OR IGNORE INTO discount_codes (code, type, value, min_order, max_uses, is_active) VALUES (?, ?, ?, ?, ?, ?)").run(
    "WELCOME10", "percentage", 10, 300, 100, 1
  );
}

export default db;
