-- Tạo database
CREATE DATABASE chatapp;

-- Chọn database để sử dụng
USE chatapp;

-- Tạo bảng users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY, -- UUID dạng string
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    profile_picture VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_status ENUM('ACTIVE', 'BANNED', 'DEACTIVATED') NOT NULL,
	refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng chat
CREATE TABLE chat (
    id VARCHAR(36) PRIMARY KEY, -- UUID dạng string
    chat_name VARCHAR(255),
    chat_image VARCHAR(255),
    is_group BOOLEAN NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng trung gian chat_admins (quan hệ ManyToMany giữa chat và user)
CREATE TABLE chat_admins (
    chat_id VARCHAR(36),
    user_id VARCHAR(36),
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng trung gian chat_users (quan hệ ManyToMany giữa chat và user)
CREATE TABLE chat_users (
    chat_id VARCHAR(36),
    user_id VARCHAR(36),
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng message
CREATE TABLE message (
    id VARCHAR(36) PRIMARY KEY, -- UUID dạng string
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    chat_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
);
