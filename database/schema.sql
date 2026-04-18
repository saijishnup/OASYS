CREATE DATABASE IF NOT EXISTS oasys_db;
USE oas_db;

CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL
);

CREATE TABLE Products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category_id INT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Order_Items (
  item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES Orders(order_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE Payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('credit_card','debit_card','upi','cash') NOT NULL,
  status ENUM('pending','completed','failed') DEFAULT 'pending',
  FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

CREATE TABLE Shipments (
  shipment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  shipped_date TIMESTAMP,
  delivery_date TIMESTAMP,
  status ENUM('pending','in_transit','delivered') DEFAULT 'pending',
  tracking_number VARCHAR(100),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

CREATE TABLE Audit_Logs (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT
);

-- Indexes
CREATE INDEX idx_orders_date ON Orders(order_date);
CREATE INDEX idx_orders_user ON Orders(user_id);
CREATE INDEX idx_payments_status ON Payments(status);
CREATE INDEX idx_products_category ON Products(category_id);
