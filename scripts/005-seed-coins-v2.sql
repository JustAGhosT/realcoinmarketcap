-- Insert sample coins
INSERT INTO coins (
    name, description, country, category, year, denomination, composition, 
    weight, diameter, thickness, edge, mintage, mint_mark, designer, 
    series, rarity, obverse_image, reverse_image, estimated_value
) VALUES 
(
    'Morgan Silver Dollar', 
    'Classic American silver dollar featuring Lady Liberty', 
    'United States', 'Silver Dollar', 1921, '$1', 
    '90% Silver, 10% Copper', 26.73, 38.1, 2.4, 'Reeded', 
    44690000, '', 'George T. Morgan', 'Morgan Dollar', 
    'Common', '/placeholder.svg?height=200&width=200', 
    '/placeholder.svg?height=200&width=200', 35.00
),
(
    'Peace Silver Dollar', 
    'Commemorative dollar celebrating peace after WWI', 
    'United States', 'Silver Dollar', 1922, '$1', 
    '90% Silver, 10% Copper', 26.73, 38.1, 2.4, 'Reeded', 
    51737000, '', 'Anthony de Francisci', 'Peace Dollar', 
    'Common', '/placeholder.svg?height=200&width=200', 
    '/placeholder.svg?height=200&width=200', 38.00
),
(
    'Walking Liberty Half Dollar', 
    'Beautiful half dollar with Walking Liberty design', 
    'United States', 'Half Dollar', 1943, '50¢', 
    '90% Silver, 10% Copper', 12.5, 30.6, 2.15, 'Reeded', 
    53190000, '', 'Adolph A. Weinman', 'Walking Liberty', 
    'Common', '/placeholder.svg?height=200&width=200', 
    '/placeholder.svg?height=200&width=200', 18.00
),
(
    'Mercury Dime', 
    'Popular dime featuring Winged Liberty Head', 
    'United States', 'Dime', 1942, '10¢', 
    '90% Silver, 10% Copper', 2.5, 17.9, 1.35, 'Reeded', 
    205432329, '', 'Adolph A. Weinman', 'Mercury Dime', 
    'Common', '/placeholder.svg?height=200&width=200', 
    '/placeholder.svg?height=200&width=200', 2.50
),
(
    'American Silver Eagle', 
    'Modern silver bullion coin', 
    'United States', 'Bullion', 2023, '$1', 
    '99.9% Silver', 31.101, 40.6, 2.98, 'Reeded', 
    0, 'W', 'Adolph A. Weinman / John Mercanti', 'Silver Eagle', 
    'Common', '/placeholder.svg?height=200&width=200', 
    '/placeholder.svg?height=200&width=200', 32.00
);

-- Verify the data was inserted
SELECT COUNT(*) as total_coins FROM coins;
SELECT name, country, year, estimated_value FROM coins ORDER BY estimated_value DESC;
