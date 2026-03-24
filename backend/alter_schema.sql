-- Add brand column
ALTER TABLE products 
ADD brand VARCHAR(100);

-- Add subcategory column
ALTER TABLE products 
ADD subcategory VARCHAR(100);

-- Add original price column
ALTER TABLE products 
ADD originalPrice DECIMAL(10,2);

-- Add discount column
ALTER TABLE products 
ADD discount INT;

-- Add rating column
ALTER TABLE products 
ADD rating DECIMAL(3,2);

-- Add review count column
ALTER TABLE products 
ADD reviewCount INT;

-- Add seller column
ALTER TABLE products 
ADD seller VARCHAR(100);

-- Add featured flag
ALTER TABLE products 
ADD isFeatured BOOLEAN DEFAULT FALSE;

-- Add badge column
ALTER TABLE products 
ADD badge VARCHAR(50);