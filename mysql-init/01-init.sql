-- Create database if not exists
CREATE DATABASE IF NOT EXISTS analytics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE analytics;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'analytics'@'%' IDENTIFIED BY 'analytics';

-- Grant privileges
GRANT ALL PRIVILEGES ON analytics.* TO 'analytics'@'%';

-- Flush privileges
FLUSH PRIVILEGES;
