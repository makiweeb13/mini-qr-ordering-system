-- ============================================================
-- RestaurantMenu — Database Schema & Seed Data
-- ============================================================
-- Usage:
--   mysql -u root < database.sql
--
-- Then start the dev server (pnpm dev) to create the admin user
-- via the seed script.
-- ============================================================

CREATE DATABASE IF NOT EXISTS qr_ordering
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE qr_ordering;

-- ------------------------------------------------------------
-- Better Auth tables
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user (
  id            VARCHAR(255) NOT NULL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  emailVerified TINYINT(1) NOT NULL DEFAULT 0,
  image         VARCHAR(255) DEFAULT NULL,
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS session (
  id        VARCHAR(255) NOT NULL PRIMARY KEY,
  userId    VARCHAR(255) NOT NULL,
  token     VARCHAR(255) NOT NULL UNIQUE,
  expiresAt DATETIME NOT NULL,
  ipAddress VARCHAR(255) DEFAULT NULL,
  userAgent VARCHAR(255) DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS account (
  id                    VARCHAR(255) NOT NULL PRIMARY KEY,
  userId                VARCHAR(255) NOT NULL,
  accountId             VARCHAR(255) NOT NULL,
  providerId            VARCHAR(255) NOT NULL,
  accessToken           VARCHAR(255) DEFAULT NULL,
  refreshToken          VARCHAR(255) DEFAULT NULL,
  accessTokenExpiresAt  DATETIME DEFAULT NULL,
  refreshTokenExpiresAt DATETIME DEFAULT NULL,
  scope                 VARCHAR(255) DEFAULT NULL,
  idToken               TEXT DEFAULT NULL,
  password              VARCHAR(255) DEFAULT NULL,
  createdAt             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS verification (
  id         VARCHAR(255) NOT NULL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  value      VARCHAR(255) NOT NULL,
  expiresAt  DATETIME NOT NULL,
  createdAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Application tables
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS products (
  id        INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  price     DECIMAL(10,2) NOT NULL,
  category  VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer      VARCHAR(255) NOT NULL DEFAULT 'Walk-in',
  paymentStatus VARCHAR(255) NOT NULL DEFAULT 'unpaid',
  total         DECIMAL(10,2) NOT NULL,
  createdAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id        INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  orderId   INT NOT NULL,
  productId INT NOT NULL,
  name      VARCHAR(255) NOT NULL,
  price     DECIMAL(10,2) NOT NULL,
  quantity  INT NOT NULL DEFAULT 1,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Seed menu items
-- ------------------------------------------------------------

INSERT INTO products (name, price, category) VALUES
  ('Chicken Adobo Rice',      159.00, 'Rice Meals'),
  ('Pork Sinigang Rice',      169.00, 'Rice Meals'),
  ('Beef Tapa Rice',          179.00, 'Rice Meals'),
  ('Crispy Pata Rice',        199.00, 'Rice Meals'),
  ('Lumpiang Shanghai (4 pcs)', 89.00, 'Sides'),
  ('Turon (2 pcs)',            49.00, 'Sides'),
  ('Garlic Rice',              39.00, 'Sides'),
  ('Buko Pandan',              59.00, 'Sides'),
  ('Iced Tea',                 39.00, 'Drinks'),
  ('Calamansi Juice',          49.00, 'Drinks'),
  ('Buko Juice',               59.00, 'Drinks'),
  ('Sago''t Gulaman',           55.00, 'Drinks');
