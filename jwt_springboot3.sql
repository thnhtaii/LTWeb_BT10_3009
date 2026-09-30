IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'jwt_springboot3')
BEGIN
    CREATE DATABASE jwt_springboot3;
END
GO

USE jwt_springboot3;
GO

-- Tạo bảng users
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        images NVARCHAR(500) NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Thêm tài khoản mẫu thanhtai (Password: 123456 đã mã hóa BCrypt)
IF NOT EXISTS (SELECT * FROM users WHERE email = 'thanhtai@gmail.com')
BEGIN
    INSERT INTO users (full_name, email, password, images, created_at, updated_at)
    VALUES (
        N'Thanh Tài',
        'thanhtai@gmail.com',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', -- Password là: 123456
        'https://ui-avatars.com/api/?name=Thanh+Tai&background=0d6efd&color=fff',
        GETDATE(),
        GETDATE()
    );
END
GO

-- Kiểm tra dữ liệu
SELECT * FROM users;
GO


-- =========================================================
-- 2. DÀNH CHO MYSQL (XAMPP / MySQL Workbench)
-- =========================================================
/*
CREATE DATABASE IF NOT EXISTS `jwt_springboot3` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `jwt_springboot3`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `images` VARCHAR(500) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Thêm tài khoản mẫu thanhtai (Password: 123456)
INSERT INTO `users` (`full_name`, `email`, `password`, `images`, `created_at`, `updated_at`)
VALUES (
    'Thanh Tài',
    'thanhtai@gmail.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
    'https://ui-avatars.com/api/?name=Thanh+Tai&background=0d6efd&color=fff',
    NOW(),
    NOW()
) ON DUPLICATE KEY UPDATE `full_name`='Thanh Tài';

SELECT * FROM `users`;
*/
