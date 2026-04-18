-- ============================================================
-- OASYS SEED DATA (SAMPLE)
-- DB: oasys_db
-- ============================================================

USE oasys_db;

-- ============================================================
-- VERTICALS (fixed - 6 domains)
-- ============================================================

INSERT INTO verticals (vertical_name, description) VALUES
('Fintech',      'Banking, transactions, and loan management'),
('Real Estate',  'Property listings and deal management'),
('Telecom',      'Plans, subscriptions, and network usage'),
('Logistics',    'Shipments and route management'),
('Energy',       'Power connections and billing'),
('Automobiles',  'Vehicle inventory, orders, and service');

-- ============================================================
-- USERS (~5 per vertical = 30 users)
-- ============================================================

INSERT INTO users (name, email, phone, vertical_id) VALUES
-- Fintech (vertical_id = 1)
('Arjun Mehta',    'arjun.mehta@email.com',    '9876543210', 1),
('Priya Sharma',   'priya.sharma@email.com',   '9876543211', 1),
('Rohit Das',      'rohit.das@email.com',       '9876543212', 1),
('Sneha Iyer',     'sneha.iyer@email.com',      '9876543213', 1),
('Vikram Nair',    'vikram.nair@email.com',     '9876543214', 1),
-- Real Estate (vertical_id = 2)
('Kavya Reddy',    'kavya.reddy@email.com',     '9876543215', 2),
('Suresh Pillai',  'suresh.pillai@email.com',   '9876543216', 2),
('Ananya Bose',    'ananya.bose@email.com',      '9876543217', 2),
('Rahul Gupta',    'rahul.gupta@email.com',      '9876543218', 2),
('Meena Joshi',    'meena.joshi@email.com',      '9876543219', 2),
-- Telecom (vertical_id = 3)
('Kiran Verma',    'kiran.verma@email.com',      '9876543220', 3),
('Pooja Singh',    'pooja.singh@email.com',       '9876543221', 3),
('Aditya Kumar',   'aditya.kumar@email.com',     '9876543222', 3),
('Divya Rao',      'divya.rao@email.com',         '9876543223', 3),
('Nikhil Patil',   'nikhil.patil@email.com',     '9876543224', 3),
-- Logistics (vertical_id = 4)
('Ravi Tiwari',    'ravi.tiwari@email.com',      '9876543225', 4),
('Sunita Yadav',   'sunita.yadav@email.com',     '9876543226', 4),
('Manoj Mishra',   'manoj.mishra@email.com',     '9876543227', 4),
('Geeta Pandey',   'geeta.pandey@email.com',     '9876543228', 4),
('Deepak Shah',    'deepak.shah@email.com',       '9876543229', 4),
-- Energy (vertical_id = 5)
('Lakshmi Nair',   'lakshmi.nair@email.com',     '9876543230', 5),
('Sanjay Patel',   'sanjay.patel@email.com',     '9876543231', 5),
('Rina Chatterjee','rina.chatterjee@email.com',  '9876543232', 5),
('Harish Menon',   'harish.menon@email.com',     '9876543233', 5),
('Taruna Saxena',  'taruna.saxena@email.com',    '9876543234', 5),
-- Automobiles (vertical_id = 6)
('Akash Jain',     'akash.jain@email.com',       '9876543235', 6),
('Rekha Sinha',    'rekha.sinha@email.com',       '9876543236', 6),
('Vivek Malhotra', 'vivek.malhotra@email.com',   '9876543237', 6),
('Neha Kapoor',    'neha.kapoor@email.com',       '9876543238', 6),
('Sunil Bhatt',    'sunil.bhatt@email.com',       '9876543239', 6),
('Farhan Ali',     'farhan.ali@email.com',        '9876543240', 1),
('Ishita Roy',     'ishita.roy@email.com',        '9876543241', 2),
('Sameer Kulkarni','sameer.kulkarni@email.com',   '9876543242', 3),
('Yogesh Rawat',   'yogesh.rawat@email.com',      '9876543243', 4),
('Pranav Sethi',   'pranav.sethi@email.com',      '9876543244', 5),
('Mohit Bansal',   'mohit.bansal@email.com',      '9876543245', 6);

-- ============================================================
-- FINTECH
-- ============================================================

INSERT INTO bank_accounts (user_id, account_type, balance) VALUES
(1, 'savings',  125000.00),
(1, 'loan',      50000.00),
(2, 'savings',   87500.50),
(3, 'current',  230000.00),
(4, 'savings',   45000.00),
(5, 'current',  310000.00),
(31, 'savings', 142500.00),
(32, 'current',  86000.00);

INSERT INTO transactions (account_id, txn_type, amount, status, description) VALUES
(1, 'credit',   25000.00, 'success', 'Salary credit'),
(1, 'debit',     5000.00, 'success', 'Utility bill'),
(1, 'transfer', 10000.00, 'success', 'Transfer to account 3'),
(3, 'credit',   10000.00, 'success', 'Transfer received'),
(2, 'debit',     3000.00, 'success', 'EMI deduction'),
(4, 'credit',   15000.00, 'success', 'Freelance payment'),
(5, 'debit',    20000.00, 'success', 'Vendor payment'),
(7, 'credit',   18000.00, 'success', 'Consulting payment'),
(7, 'debit',     2200.00, 'success', 'Recharge and OTT bundle'),
(8, 'transfer',  5000.00, 'success', 'Transfer to linked account');

INSERT INTO loans (user_id, principal, interest_rate, status) VALUES
(1, 500000.00, 8.50, 'active'),
(2, 200000.00, 9.00, 'active'),
(3, 750000.00, 7.75, 'closed'),
(5, 100000.00, 10.00,'defaulted'),
(31, 350000.00, 8.10, 'active');

-- ============================================================
-- REAL ESTATE
-- ============================================================

INSERT INTO properties (title, property_type, price, status) VALUES
('Sunrise Apartments 3BHK',  'residential',  4500000.00, 'available'),
('MG Road Commercial Space', 'commercial',  12000000.00, 'sold'),
('Industrial Shed Block-A',  'industrial',   8000000.00, 'available'),
('Green Valley Villa',       'residential',  7500000.00, 'rented'),
('Tech Park Office Unit',    'commercial',   9500000.00, 'available'),
('Lakeview Residency Tower B','residential', 6800000.00, 'available'),
('City Center Retail Unit 12','commercial',  8800000.00, 'rented');

INSERT INTO re_deals (property_id, buyer_id, agent_id, deal_value, status) VALUES
(2, 7, 8,  11500000.00, 'completed'),
(1, 6, 9,   4400000.00, 'pending'),
(4, 10, 7,  7000000.00, 'completed'),
(6, 33, 8,  6650000.00, 'pending');

-- ============================================================
-- TELECOM
-- ============================================================

INSERT INTO telecom_plans (plan_name, plan_type, data_gb, price, validity_days, vertical_id) VALUES
('Basic Prepaid 28',   'prepaid',  1.50,  199.00,  28, 3),
('Standard Prepaid 84','prepaid',  2.00,  449.00,  84, 3),
('Premium Postpaid',   'postpaid', 5.00,  999.00,  30, 3),
('Ultra Postpaid',     'postpaid', 10.00, 1499.00, 30, 3);

INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status) VALUES
(11, 1, '2025-03-01', '2025-03-29', 'expired'),
(12, 3, '2025-04-01', '2025-04-30', 'active'),
(13, 2, '2025-03-15', '2025-06-15', 'active'),
(14, 4, '2025-04-01', '2025-04-30', 'active'),
(15, 1, '2025-03-20', '2025-04-17', 'expired'),
(33, 2, '2025-04-05', '2025-07-04', 'active'),
(34, 1, '2025-03-10', '2025-04-07', 'expired');

INSERT INTO network_usage (sub_id, usage_date, data_used_gb, call_minutes) VALUES
(2, '2025-04-01', 0.85, 45),
(2, '2025-04-02', 1.20, 30),
(3, '2025-04-01', 0.50, 60),
(4, '2025-04-01', 2.30, 120),
(4, '2025-04-02', 3.10, 90),
(6, '2025-04-06', 1.85, 48),
(7, '2025-03-20', 0.75, 24);

-- ============================================================
-- LOGISTICS
-- ============================================================

INSERT INTO logistics_routes (origin, destination, distance_km, avg_days) VALUES
('Mumbai',    'Delhi',     1400.00, 2),
('Bangalore', 'Chennai',    350.00, 1),
('Hyderabad', 'Kolkata',   1500.00, 3),
('Pune',      'Ahmedabad',  665.00, 1),
('Delhi',     'Jaipur',     280.00, 1),
('Surat',     'Nagpur',     920.00, 2),
('Lucknow',   'Patna',      560.00, 1);

INSERT INTO shipments (sender_id, receiver_id, origin, destination, weight_kg, status, tracking_number) VALUES
(16, 17, 'Mumbai',    'Delhi',     12.50, 'delivered',  'TRK100001', 1500.00),
(18, 19, 'Bangalore', 'Chennai',    5.00, 'in_transit', 'TRK100002',  800.00),
(20, 16, 'Hyderabad', 'Kolkata',   30.00, 'pending',    'TRK100003', 2200.00),
(17, 20, 'Pune',      'Ahmedabad',  8.00, 'delivered',  'TRK100004', 1100.00),
(19, 18, 'Delhi',     'Jaipur',     2.50, 'cancelled',  'TRK100005',  500.00),
(35, 36, 'Surat',     'Nagpur',    18.20, 'in_transit', 'TRK100006', 1000.00),
(34, 33, 'Lucknow',   'Patna',      7.40, 'delivered',  'TRK100007', 1200.00);
-- ============================================================
-- ENERGY
-- ============================================================

INSERT INTO energy_connections (user_id, connection_type, meter_number, status) VALUES
(21, 'residential', 'MTR-001-RES', 'active'),
(22, 'commercial',  'MTR-002-COM', 'active'),
(23, 'residential', 'MTR-003-RES', 'active'),
(24, 'industrial',  'MTR-004-IND', 'suspended'),
(25, 'residential', 'MTR-005-RES', 'active'),
(37, 'residential', 'MTR-006-RES', 'active'),
(38, 'commercial',  'MTR-007-COM', 'active');

INSERT INTO energy_bills (connection_id, billing_month, units_consumed, amount_due, status, due_date) VALUES
(1, '2025-03-01', 210.00, 1470.00, 'paid',   '2025-03-20'),
(1, '2025-04-01', 245.00, 1715.00, 'unpaid', '2025-04-20'),
(2, '2025-03-01', 800.00, 5600.00, 'paid',   '2025-03-20'),
(3, '2025-04-01', 180.00, 1260.00, 'unpaid', '2025-04-20'),
(5, '2025-03-01', 320.00, 2240.00, 'overdue','2025-03-20'),
(6, '2025-04-01', 195.00, 1365.00, 'unpaid', '2025-04-22'),
(7, '2025-04-01', 640.00, 4480.00, 'paid',   '2025-04-22');

-- ============================================================
-- AUTOMOBILES
-- ============================================================

INSERT INTO vehicles (model_name, vehicle_type, fuel_type, price, stock_quantity) VALUES
('Maruti Swift',      'sedan',    'petrol',   650000.00,  15),
('Hyundai Creta',     'suv',      'diesel',  1200000.00,   8),
('Tata Nexon EV',     'suv',      'electric', 1500000.00,  5),
('Royal Enfield 350', 'bike',     'petrol',   200000.00,  20),
('Ashok Leyland 3718','truck',    'diesel',  2800000.00,   3);

INSERT INTO vehicle_orders (user_id, vehicle_id, status, amount_paid) VALUES
(26, 1, 'delivered',  650000.00),
(27, 3, 'confirmed', 1500000.00),
(28, 2, 'pending',           NULL),
(29, 4, 'delivered',  200000.00),
(30, 5, 'cancelled',         NULL),
(39, 2, 'confirmed', 1200000.00),
(40, 1, 'pending',          NULL);

INSERT INTO service_requests (user_id, vehicle_id, service_type, scheduled_at, status) VALUES
(26, 1, 'Oil Change',        '2025-04-10 10:00:00', 'completed'),
(27, 3, 'Battery Check',     '2025-04-15 11:00:00', 'pending'),
(29, 4, 'General Service',   '2025-04-20 09:00:00', 'pending'),
(28, 2, 'Tyre Replacement',  '2025-04-18 14:00:00', 'in_progress'),
(39, 2, 'Wheel Alignment',   '2025-04-26 15:00:00', 'pending'),
(40, 1, 'AC Service',        '2025-04-27 11:15:00', 'cancelled');