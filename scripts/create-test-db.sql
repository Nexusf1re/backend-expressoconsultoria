-- Script para criar banco de dados de teste
CREATE DATABASE IF NOT EXISTS analytics_test;
USE analytics_test;

-- Criar tabela sales (mesma estrutura do banco principal)
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    occurredAt DATETIME NOT NULL,
    category VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    region VARCHAR(255) NOT NULL,
    channel VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_occurredAt (occurredAt),
    INDEX idx_category (category),
    INDEX idx_region (region),
    INDEX idx_channel (channel)
);
