-- Database Schema for Daily Reminder Manager
-- Created: 2026-02-15

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Reminders Table (with foreign key to users)
CREATE TABLE IF NOT EXISTS reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    notification_type ENUM('SMS', 'WhatsApp', 'Email') NOT NULL,
    scheduled_time TIME NOT NULL,
    last_sent_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Note: If you already have a 'reminders' table, you must DROP it first before running this,
-- because the new structure requires 'user_id' which cannot be null.
