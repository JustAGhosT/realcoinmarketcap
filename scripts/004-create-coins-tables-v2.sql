-- Drop existing tables if they exist
DROP TABLE IF EXISTS coin_marketplace_listings CASCADE;
DROP TABLE IF EXISTS user_coin_collection CASCADE;
DROP TABLE IF EXISTS coins CASCADE;

-- Create coins table
CREATE TABLE coins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(100),
    category VARCHAR(100),
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
    rarity VARCHAR(50),
    obverse_image TEXT,
    reverse_image TEXT,
    estimated_value DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_coins_country ON coins(country);
CREATE INDEX idx_coins_category ON coins(category);
CREATE INDEX idx_coins_year ON coins(year);
CREATE INDEX idx_coins_rarity ON coins(rarity);
CREATE INDEX idx_coins_name ON coins(name);

-- Create user coin collection table
CREATE TABLE user_coin_collection (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    coin_id INTEGER NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
    condition VARCHAR(50),
    grade VARCHAR(20),
    quantity INTEGER DEFAULT 1,
    purchase_price DECIMAL(12,2),
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, coin_id)
);

-- Create marketplace listings table
CREATE TABLE coin_marketplace_listings (
    id SERIAL PRIMARY KEY,
    coin_id INTEGER NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
    seller_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    condition VARCHAR(50),
    grade VARCHAR(20),
    price DECIMAL(12,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    images TEXT[],
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for marketplace
CREATE INDEX idx_marketplace_coin_id ON coin_marketplace_listings(coin_id);
CREATE INDEX idx_marketplace_seller_id ON coin_marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_status ON coin_marketplace_listings(status);
CREATE INDEX idx_marketplace_price ON coin_marketplace_listings(price);

COMMENT ON TABLE coins IS 'Main coins catalog';
COMMENT ON TABLE user_coin_collection IS 'User personal coin collections';
COMMENT ON TABLE coin_marketplace_listings IS 'Marketplace listings for buying/selling coins';
