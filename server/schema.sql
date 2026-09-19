-- Portfolio Database Schema for MySQL
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- 1. Users Table (Admin Authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(191) NOT NULL DEFAULT 'Admin',
    role VARCHAR(50) NOT NULL DEFAULT 'administrator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Travel Memories Table
CREATE TABLE IF NOT EXISTS memories (
    id VARCHAR(100) PRIMARY KEY,
    state_id VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    month VARCHAR(50) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    image TEXT NOT NULL,
    caption TEXT NOT NULL,
    moments JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_state_id (state_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Insert Initial Default Admin (admin@portfolio.com / admin123)
-- Hash generated using bcrypt 10 rounds
INSERT IGNORE INTO users (id, email, password_hash, name, role)
VALUES (
    1,
    'admin@portfolio.com',
    '$2a$10$cLdFWni9k6KtxfCrLDzqTOmRB.wygfSKfDMRa2XZQY683GX7yPlDO',
    'Ankit Sagar',
    'administrator'
);

-- 4. Initial Core Expedition Memories (including Ladakh, Rajasthan, Gujarat, Himachal, Kerala)
INSERT IGNORE INTO memories (id, state_id, state_name, title, month, tag, image, caption, moments)
VALUES 
(
    'la-1',
    'la',
    'Ladakh',
    'Pangong Lake at Sunrise',
    'Aug 2023',
    'High Altitude',
    'https://framerusercontent.com/images/LDD2FKTUCCQMbUbBbhwBC04rnuI.jpg?width=1600',
    'The surreal blue-green waters of Pangong Tso mirroring the high-altitude sky.',
    JSON_ARRAY('🏔️ Khardung La', '🌊 Pangong Tso', '🛺 Leh City', '⭐ Milky Way')
),
(
    'rj-1',
    'rj',
    'Rajasthan',
    'Desert Dunes of Jaisalmer',
    'Jan 2024',
    'Desert Safari',
    'https://framerusercontent.com/images/2LJkBFtZIoI5F4qcuQfOsUrTWkc.jpg?width=1600',
    'Golden sand dunes stretching endlessly under the amber Rajasthani sky.',
    JSON_ARRAY('🐪 Camel Ride', '🌅 Sunrise Dunes', '🏰 Jaisalmer Fort', '🎵 Folk Music')
),
(
    'gj-1',
    'gj',
    'Gujarat',
    'Rann of Kutch — Salt Flats',
    'Feb 2024',
    'White Desert',
    'https://framerusercontent.com/images/NxsYJYfP8F45xJEur7Fh8564Ufw.jpg?width=1600',
    'The infinite white expanse of the Rann under full moon light.',
    JSON_ARRAY('🌕 Full Moon Night', '🎪 Rann Utsav', '🎨 Handicrafts', '🦩 Flamingos')
),
(
    'hp-1',
    'hp',
    'Himachal Pradesh',
    'Snow Peaks of Spiti',
    'Jul 2023',
    'Mountain Trek',
    'https://framerusercontent.com/images/kaNtc5VMI2U9SzYecDO3bcPqsY.jpg?width=1600',
    'Ancient monasteries clinging to dramatic Himalayan cliffs in cold desert.',
    JSON_ARRAY('🏔️ Himalayan Trek', '🕌 Key Monastery', '🌌 Stargazing', '❄️ Snow Peaks')
),
(
    'kl-1',
    'kl',
    'Kerala',
    'Backwaters of Alleppey',
    'Dec 2023',
    'Backwaters',
    'https://framerusercontent.com/images/ZB6AZU2rWR5MSGd3AJLPCn2x7g.jpg?width=1600',
    'Drifting through calm backwaters on a traditional houseboat.',
    JSON_ARRAY('🚢 Houseboat', '🌴 Palm Shores', '🐟 Fishing Nets', '🍛 Kerala Cuisine')
);
