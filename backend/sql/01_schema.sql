-- ============================================================
-- OASYS DATABASE SCHEMA
-- DB: oasys_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS oasys_db;
USE oasys_db;

-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE verticals (
    vertical_id   INT PRIMARY KEY AUTO_INCREMENT,
    vertical_name VARCHAR(25) NOT NULL UNIQUE,
    description   TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id     INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    phone       VARCHAR(20),
    vertical_id INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vertical_id) REFERENCES verticals(vertical_id)
);

CREATE TABLE audit_logs (
    log_id      INT PRIMARY KEY AUTO_INCREMENT,
    vertical_id INT,
    action      VARCHAR(100) NOT NULL,
    table_name  VARCHAR(50),
    record_id   INT,
    description TEXT,
    changed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vertical_id) REFERENCES verticals(vertical_id)
);

-- ============================================================
-- FINTECH
-- ============================================================

CREATE TABLE bank_accounts (
    account_id   INT PRIMARY KEY AUTO_INCREMENT,
    user_id      INT NOT NULL,
    account_type ENUM('savings', 'current', 'loan') NOT NULL,
    balance      DECIMAL(15,2) DEFAULT 0.00,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE transactions (
    txn_id      INT PRIMARY KEY AUTO_INCREMENT,
    account_id  INT NOT NULL,
    txn_type    ENUM('credit', 'debit', 'transfer') NOT NULL,
    amount      DECIMAL(15,2) NOT NULL,
    txn_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status      ENUM('success', 'failed', 'pending') DEFAULT 'success',
    description VARCHAR(255),
    FOREIGN KEY (account_id) REFERENCES bank_accounts(account_id)
);

CREATE TABLE loans (
    loan_id       INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT NOT NULL,
    principal     DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    status        ENUM('active', 'closed', 'defaulted') DEFAULT 'active',
    disbursed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================================================
-- REAL ESTATE
-- ============================================================

CREATE TABLE properties (
    property_id   INT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(255) NOT NULL,
    property_type ENUM('residential', 'commercial', 'industrial') NOT NULL,
    price         DECIMAL(15,2) NOT NULL,
    status        ENUM('available', 'sold', 'rented') DEFAULT 'available',
    listed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE re_deals (
    deal_id    INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT NOT NULL,
    buyer_id   INT NOT NULL,
    agent_id   INT NOT NULL,
    deal_value DECIMAL(15,2) NOT NULL,
    status     ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    opened_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at  TIMESTAMP NULL,
    FOREIGN KEY (property_id) REFERENCES properties(property_id),
    FOREIGN KEY (buyer_id) REFERENCES users(user_id),
    FOREIGN KEY (agent_id) REFERENCES users(user_id)
);

-- ============================================================
-- TELECOM
-- ============================================================

CREATE TABLE telecom_plans (
    plan_id      INT PRIMARY KEY AUTO_INCREMENT,
    plan_name    VARCHAR(100) NOT NULL,
    plan_type    ENUM('prepaid', 'postpaid') NOT NULL,
    data_gb      DECIMAL(5,2),
    price        DECIMAL(10,2) NOT NULL,
    validity_days INT NOT NULL,
    vertical_id  INT NOT NULL,
    FOREIGN KEY (vertical_id) REFERENCES verticals(vertical_id)
);

CREATE TABLE subscriptions (
    sub_id      INT PRIMARY KEY AUTO_INCREMENT,
    user_id     INT NOT NULL,
    plan_id     INT NOT NULL,
    start_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date    TIMESTAMP NOT NULL,
    status      ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plan_id) REFERENCES telecom_plans(plan_id)
);

CREATE TABLE network_usage (
    usage_id       INT PRIMARY KEY AUTO_INCREMENT,
    sub_id         INT NOT NULL,
    usage_date     DATE NOT NULL,
    data_used_gb   DECIMAL(10,4) DEFAULT 0,
    call_minutes   INT DEFAULT 0,
    FOREIGN KEY (sub_id) REFERENCES subscriptions(sub_id)
);

-- ============================================================
-- LOGISTICS
-- ============================================================

CREATE TABLE logistics_routes (
    route_id    INT PRIMARY KEY AUTO_INCREMENT,
    origin      VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance_km DECIMAL(10,2),
    avg_days    INT
);

CREATE TABLE shipments (
    shipment_id      INT PRIMARY KEY AUTO_INCREMENT,
    sender_id        INT NOT NULL,
    receiver_id      INT NOT NULL,
    origin           VARCHAR(255) NOT NULL,
    destination      VARCHAR(255) NOT NULL,
    weight_kg        DECIMAL(10,2),
    status           ENUM('pending', 'in_transit', 'delivered', 'cancelled') DEFAULT 'pending',
    shipped_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at     TIMESTAMP NULL,
    tracking_number  VARCHAR(50) UNIQUE,
    shipping_cost    DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

-- ============================================================
-- ENERGY
-- ============================================================

CREATE TABLE energy_connections (
    connection_id   INT PRIMARY KEY AUTO_INCREMENT,
    user_id         INT NOT NULL,
    connection_type ENUM('residential', 'commercial', 'industrial') NOT NULL,
    meter_number    VARCHAR(50) UNIQUE NOT NULL,
    status          ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    connected_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE energy_bills (
    bill_id        INT PRIMARY KEY AUTO_INCREMENT,
    connection_id  INT NOT NULL,
    billing_month  DATE NOT NULL,
    units_consumed DECIMAL(10,2) NOT NULL,
    amount_due     DECIMAL(10,2) NOT NULL,
    status         ENUM('paid', 'unpaid', 'overdue') DEFAULT 'unpaid',
    due_date       DATE NOT NULL,
    FOREIGN KEY (connection_id) REFERENCES energy_connections(connection_id)
);

-- ============================================================
-- AUTOMOBILES
-- ============================================================

CREATE TABLE vehicles (
    vehicle_id     INT PRIMARY KEY AUTO_INCREMENT,
    model_name     VARCHAR(100) NOT NULL,
    vehicle_type   ENUM('sedan', 'suv', 'truck', 'electric', 'bike') NOT NULL,
    fuel_type      ENUM('petrol', 'diesel', 'electric', 'hybrid') NOT NULL,
    price          DECIMAL(15,2) NOT NULL,
    stock_quantity INT DEFAULT 0
);

CREATE TABLE vehicle_orders (
    vo_id          INT PRIMARY KEY AUTO_INCREMENT,
    user_id        INT NOT NULL,
    vehicle_id     INT NOT NULL,
    order_date     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status         ENUM('pending', 'confirmed', 'delivered', 'cancelled') DEFAULT 'pending',
    amount_paid    DECIMAL(15,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE TABLE service_requests (
    sr_id         INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT NOT NULL,
    vehicle_id    INT NOT NULL,
    service_type  VARCHAR(100) NOT NULL,
    scheduled_at  TIMESTAMP NOT NULL,
    status        ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_users_vertical    ON users(vertical_id);
CREATE INDEX idx_txn_account       ON transactions(account_id);
CREATE INDEX idx_txn_date          ON transactions(txn_date);
CREATE INDEX idx_sub_user          ON subscriptions(user_id);
CREATE INDEX idx_sub_status        ON subscriptions(status);
CREATE INDEX idx_shipment_status   ON shipments(status);
CREATE INDEX idx_energy_bill_month ON energy_bills(billing_month);
CREATE INDEX idx_audit_vertical    ON audit_logs(vertical_id);
CREATE INDEX idx_audit_table       ON audit_logs(table_name);