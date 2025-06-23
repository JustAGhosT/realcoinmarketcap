-- Create coins table
CREATE TABLE IF NOT EXISTS coins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    year INTEGER,
    denomination VARCHAR(50),
    composition VARCHAR(255),
    weight DECIMAL(10,4),
    diameter DECIMAL(8,2),
    thickness DECIMAL(6,2),
    edge VARCHAR(100),
    mintage BIGINT,
    mint_mark VARCHAR(10),
    designer VARCHAR(255),
    series VARCHAR(255),
    rarity VARCHAR(50) DEFAULT 'Common',
    obverse_image TEXT,
    reverse_image TEXT,
    estimated_value DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_coin_collection table
CREATE TABLE IF NOT EXISTS user_coin_collection (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    coin_id INTEGER NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
    condition VARCHAR(50) DEFAULT 'Good',
    grade VARCHAR(20),
    quantity INTEGER DEFAULT 1,
    purchase_price DECIMAL(12,2),
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, coin_id)
);

-- Create coin_marketplace_listings table
CREATE TABLE IF NOT EXISTS coin_marketplace_listings (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL,
    coin_id INTEGER NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    condition VARCHAR(50) NOT NULL,
    grade VARCHAR(20),
    price DECIMAL(12,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    images TEXT[],
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coins_country ON coins(country);
CREATE INDEX IF NOT EXISTS idx_coins_category ON coins(category);
CREATE INDEX IF NOT EXISTS idx_coins_year ON coins(year);
CREATE INDEX IF NOT EXISTS idx_coins_rarity ON coins(rarity);
CREATE INDEX IF NOT EXISTS idx_coins_name ON coins(name);
CREATE INDEX IF NOT EXISTS idx_user_coin_collection_user_id ON user_coin_collection(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_marketplace_seller_id ON coin_marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_coin_marketplace_status ON coin_marketplace_listings(status);
