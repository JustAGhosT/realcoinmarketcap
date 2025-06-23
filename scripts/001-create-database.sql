-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'South Africa',
    is_verified BOOLEAN DEFAULT FALSE,
    is_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stamp categories
CREATE TABLE IF NOT EXISTS stamp_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stamps catalog
CREATE TABLE IF NOT EXISTS stamps (
    id SERIAL PRIMARY KEY,
    sacc_number VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issue_date DATE,
    face_value DECIMAL(10,2),
    category_id INTEGER REFERENCES stamp_categories(id),
    series_name VARCHAR(255),
    designer VARCHAR(255),
    printer VARCHAR(255),
    perforation VARCHAR(50),
    watermark VARCHAR(100),
    image_url TEXT,
    rarity_level VARCHAR(20) DEFAULT 'common', -- common, uncommon, rare, very_rare
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User collections
CREATE TABLE IF NOT EXISTS user_collections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stamp_id INTEGER REFERENCES stamps(id) ON DELETE CASCADE,
    condition VARCHAR(20) NOT NULL, -- mint, very_fine, fine, good, poor
    quantity INTEGER DEFAULT 1,
    purchase_price DECIMAL(10,2),
    current_value DECIMAL(10,2),
    notes TEXT,
    acquired_date DATE DEFAULT CURRENT_DATE,
    is_for_sale BOOLEAN DEFAULT FALSE,
    asking_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stamp_id, condition)
);

-- Marketplace listings
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    collection_item_id INTEGER REFERENCES user_collections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    condition VARCHAR(20) NOT NULL,
    quantity_available INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
    payment_intent_id VARCHAR(255),
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES marketplace_listings(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

-- Watchlist
CREATE TABLE IF NOT EXISTS watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stamp_id INTEGER REFERENCES stamps(id) ON DELETE CASCADE,
    max_price DECIMAL(10,2),
    condition_preference VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stamp_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stamps_issue_date ON stamps(issue_date);
CREATE INDEX IF NOT EXISTS idx_stamps_category ON stamps(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_active ON marketplace_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_collections_user ON user_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
