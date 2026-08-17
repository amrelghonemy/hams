-- Hams Style - Supabase Schema
-- Run this in the Supabase SQL Editor

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  description_en TEXT,
  description_ar TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_en TEXT,
  description_ar TEXT,
  price REAL NOT NULL,
  sale_price REAL,
  category_id BIGINT REFERENCES categories(id),
  sku TEXT,
  stock INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]',
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]',
  meta_title_en TEXT,
  meta_title_ar TEXT,
  meta_description_en TEXT,
  meta_description_ar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  governorate TEXT,
  city TEXT,
  area TEXT,
  street TEXT,
  building TEXT,
  apartment TEXT,
  notes TEXT,
  is_default BOOLEAN DEFAULT FALSE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id BIGINT REFERENCES users(id),
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  product_name_en TEXT,
  product_name_ar TEXT,
  product_image TEXT,
  size TEXT,
  color TEXT,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id),
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount Codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  value REAL NOT NULL,
  min_order REAL DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for storefront tables
DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read active products" ON products;
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can read approved reviews" ON reviews;
CREATE POLICY "Public can read approved reviews" ON reviews FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public can read active discounts" ON discount_codes;
CREATE POLICY "Public can read active discounts" ON discount_codes FOR SELECT USING (is_active = true);

-- Authenticated user policies
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can read own orders" ON orders;
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can read own order_items" ON order_items;
CREATE POLICY "Users can read own order_items" ON order_items FOR SELECT USING (
  order_id IN (SELECT id FROM orders WHERE auth.uid()::text = user_id::text)
);

DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist;
CREATE POLICY "Users can manage own wishlist" ON wishlist FOR ALL USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert reviews" ON reviews;
CREATE POLICY "Users can insert reviews" ON reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own reviews" ON reviews;
CREATE POLICY "Users can read own reviews" ON reviews FOR SELECT USING (auth.uid()::text = user_id::text);

-- Seed data (skip if already exists)
INSERT INTO categories (name_en, name_ar, slug, image, description_en, description_ar, sort_order) VALUES
('Dresses', 'فساتين', 'dresses', '/images/cat-dresses.jpg', 'Elegant dresses for every occasion', 'فساتين أنيقة لكل المناسبات', 1),
('Tops', 'بلوزات', 'tops', '/images/cat-tops.jpg', 'Stylish tops and blouses', 'بلوزات وتيشيرتات أنيقة', 2),
('Pants', 'بناطيل', 'pants', '/images/cat-pants.jpg', 'Comfortable and trendy pants', 'بناطيل مريحة وعصرية', 3),
('Sets', 'طقم كامل', 'sets', '/images/cat-sets.jpg', 'Complete coordinated outfits', 'أطقم ملابس متناسقة', 4),
('Outerwear', 'عبايات', 'outerwear', '/images/cat-outerwear.jpg', 'Jackets, abayas and more', 'جاكيتات وعبايات والمزيد', 5),
('Accessories', 'إكسسوارات', 'accessories', '/images/cat-accessories.jpg', 'Complete your look', 'أكملي إطلالتك', 6),
('New Arrivals', 'وصل حديثاً', 'new-arrivals', '/images/cat-new.jpg', 'Fresh picks just for you', 'أحدث الإصدارات', 7),
('Sale', 'تخفيضات', 'sale', '/images/cat-sale.jpg', 'Great deals you don''t want to miss', 'عروض لا تفوتيها', 8)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name_en, name_ar, slug, description_en, description_ar, price, sale_price, category_id, sku, stock, images, sizes, colors, is_new, is_bestseller, rating, review_count, tags) VALUES
('Elegant Maxi Dress', 'فستان ماكسي أنيق', 'elegant-maxi-dress', 'A beautiful flowy maxi dress perfect for special occasions', 'فستان ماكسي جميل ومنسدل مثالي للمناسبات الخاصة', 1299, 999, 1, 'HS-DR-001', 25, '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80","https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80"]', '["S","M","L","XL"]', '["أسود","أبيض","بيج"]', true, true, 4.8, 24, '["new","bestseller"]'),
('Silk Blend Blouse', 'بلوزة قطن مدمج بالحرير', 'silk-blend-blouse', 'Luxurious silk blend blouse with elegant draping', 'بلوزة فاخرة من القطن المدمج بالحرير مع ثنيات أنيقة', 899, NULL, 2, 'HS-TOP-001', 30, '["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80","https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"]', '["XS","S","M","L","XL"]', '["أبيض","وردي","كحلي"]', true, false, 4.5, 18, '["new"]'),
('Tailored Wide Leg Pants', 'بناطيل واسعة مفصلة', 'tailored-wide-leg-pants', 'High-waisted wide leg pants for a chic look', 'بناطيل واسعة عالية الخصر لإطلالة أنيقة', 799, 649, 3, 'HS-PT-001', 20, '["https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&q=80","https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80"]', '["S","M","L","XL"]', '["أسود","بيج","كحلي"]', false, true, 4.7, 32, '["bestseller"]'),
('Two-Piece Co-ord Set', 'طقم قطن كامل متناسق', 'two-piece-coord-set', 'Matching top and pants set for effortless style', 'طقم متناسق من البلوزة والبناطيل لإطلالة سهلة', 1599, 1299, 4, 'HS-SET-001', 15, '["https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&q=80","https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80"]', '["S","M","L","XL"]', '["بيج","وردي","أخضر"]', true, true, 4.9, 41, '["new","bestseller"]'),
('Oversized Linen Shirt', 'قميص كتان واسع', 'oversized-linen-shirt', 'Breathable oversized linen shirt for casual elegance', 'قميص كتان واسع قابل للتنفس للأناقة العصرية', 699, NULL, 2, 'HS-TOP-002', 35, '["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80","https://images.unsplash.com/photo-1502716119720-b23a1e3b8b11?w=800&q=80"]', '["S","M","L","XL","XXL"]', '["أبيض","بيج","رمادي"]', false, false, 4.3, 12, '[]'),
('Flowy Midi Dress', 'فستان ميدي منسدل', 'flowy-midi-dress', 'Beautiful midi dress with a flattering silhouette', 'فستان ميدي جميل مع ملمس مميز', 1099, 899, 1, 'HS-DR-002', 18, '["https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80","https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80"]', '["S","M","L","XL"]', '["أزرق","أبيض","وردي"]', true, false, 4.6, 15, '["new"]'),
('Premium Abaya', 'عباية فاخرة', 'premium-abaya', 'Elegant premium abaya with modern design', 'عباية فاخرة أنيقة بتصميم عصري', 1899, NULL, 5, 'HS-OUT-001', 12, '["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80","https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80"]', '["S","M","L","XL"]', '["أسود","كحلي","بيج"]', false, true, 4.9, 28, '["bestseller"]'),
('Casual Denim Jacket', 'جاكيت دينام كاجوال', 'casual-denim-jacket', 'Classic denim jacket for a relaxed look', 'جاكيت دينام كلاسيكي لإطلالة مريحة', 999, 799, 5, 'HS-OUT-002', 22, '["https://images.unsplash.com/photo-1581044777550-4cfa60707998?w=800&q=80","https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"]', '["S","M","L","XL"]', '["أزرق","أزرق غامق"]', false, false, 4.4, 9, '["sale"]'),
('High Waist Skinny Jeans', 'جينز سكيني عالي الخصر', 'high-waist-skinny-jeans', 'Stretch skinny jeans with perfect fit', 'جينز سكيني قابل للتمدد بمقاس مثالي', 599, 499, 3, 'HS-PT-002', 40, '["https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=800&q=80","https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=800&q=80"]', '["XS","S","M","L","XL"]', '["أزرق","أسود","أزرق فاتح"]', false, true, 4.5, 35, '["bestseller","sale"]'),
('Pearl Drop Earrings', 'أقراط لؤلؤ متدلية', 'pearl-drop-earrings', 'Elegant pearl drop earrings for a sophisticated look', 'أقراط لؤلؤ أنيقة لإطلالة راقية', 349, NULL, 6, 'HS-ACC-001', 50, '["https://images.unsplash.com/photo-1585487000160-e5f8e53a7fbe?w=800&q=80","https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80"]', '["One Size"]', '["ذهبي","فضي"]', true, false, 4.7, 20, '["new"]'),
('Pleated Maxi Skirt', 'تنورة ماكسي مجعدة', 'pleated-maxi-skirt', 'Flowy pleated maxi skirt for elegant occasions', 'تنورة ماكسي مجعدة منسدلة للمناسبات الأنيقة', 749, 599, 3, 'HS-PT-003', 16, '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80","https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80"]', '["S","M","L"]', '["بيج","أسود","كحلي"]', true, false, 4.4, 11, '["new","sale"]'),
('Structured Blazer', 'بليزر مفصل', 'structured-blazer', 'Professional structured blazer for a polished look', 'بليزر مهني مفصل لإطلالة أنيقة', 1399, NULL, 5, 'HS-OUT-003', 10, '["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80","https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80"]', '["S","M","L","XL"]', '["أسود","كحلي","بيج"]', false, true, 4.8, 19, '["bestseller"]')
ON CONFLICT (slug) DO NOTHING;

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@hamsstyle.com', '$2a$10$Qza/nx2ABv6L5y6m6hQgF.ChTsjG7Hfz2VG3DDwqIhXv808.Zi8dG', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Discount code
INSERT INTO discount_codes (code, type, value, min_order, max_uses, is_active) VALUES ('WELCOME10', 'percentage', 10, 300, 100, true)
ON CONFLICT (code) DO NOTHING;
