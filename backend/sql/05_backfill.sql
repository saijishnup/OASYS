USE oasys_db;

-- Backfill energy data for dashboard charts in an existing database.
-- Safe to run once after the core schema/users are already present.

INSERT INTO energy_connections (user_id, connection_type, meter_number, status)
SELECT 21, 'residential', 'MTR-001-RES', 'active'
WHERE NOT EXISTS (SELECT 1 FROM energy_connections WHERE meter_number = 'MTR-001-RES');

INSERT INTO energy_connections (user_id, connection_type, meter_number, status)
SELECT 22, 'commercial', 'MTR-002-COM', 'active'
WHERE NOT EXISTS (SELECT 1 FROM energy_connections WHERE meter_number = 'MTR-002-COM');

INSERT INTO energy_connections (user_id, connection_type, meter_number, status)
SELECT 23, 'residential', 'MTR-003-RES', 'active'
WHERE NOT EXISTS (SELECT 1 FROM energy_connections WHERE meter_number = 'MTR-003-RES');

INSERT INTO energy_connections (user_id, connection_type, meter_number, status)
SELECT 24, 'industrial', 'MTR-004-IND', 'suspended'
WHERE NOT EXISTS (SELECT 1 FROM energy_connections WHERE meter_number = 'MTR-004-IND');

INSERT INTO energy_connections (user_id, connection_type, meter_number, status)
SELECT 25, 'residential', 'MTR-005-RES', 'active'
WHERE NOT EXISTS (SELECT 1 FROM energy_connections WHERE meter_number = 'MTR-005-RES');

INSERT INTO energy_connections (user_id, connection_type, meter_number, status)
SELECT 35, 'residential', 'MTR-006-RES', 'active'
WHERE NOT EXISTS (SELECT 1 FROM energy_connections WHERE meter_number = 'MTR-006-RES');

INSERT INTO energy_connections (user_id, connection_type, meter_number, status)
SELECT 22, 'commercial', 'MTR-007-COM', 'active'
WHERE NOT EXISTS (SELECT 1 FROM energy_connections WHERE meter_number = 'MTR-007-COM');

INSERT INTO energy_bills (connection_id, billing_month, units_consumed, amount_due, status, due_date)
SELECT ec.connection_id, '2025-03-01', 210.00, 1470.00, 'paid', '2025-03-20'
FROM energy_connections ec
WHERE ec.meter_number = 'MTR-001-RES'
  AND NOT EXISTS (
    SELECT 1
    FROM energy_bills eb
    WHERE eb.connection_id = ec.connection_id AND eb.billing_month = '2025-03-01'
  );

INSERT INTO energy_bills (connection_id, billing_month, units_consumed, amount_due, status, due_date)
SELECT ec.connection_id, '2025-04-01', 245.00, 1715.00, 'unpaid', '2025-04-20'
FROM energy_connections ec
WHERE ec.meter_number = 'MTR-001-RES'
  AND NOT EXISTS (
    SELECT 1
    FROM energy_bills eb
    WHERE eb.connection_id = ec.connection_id AND eb.billing_month = '2025-04-01'
  );

INSERT INTO energy_bills (connection_id, billing_month, units_consumed, amount_due, status, due_date)
SELECT ec.connection_id, '2025-03-01', 800.00, 5600.00, 'paid', '2025-03-20'
FROM energy_connections ec
WHERE ec.meter_number = 'MTR-002-COM'
  AND NOT EXISTS (
    SELECT 1
    FROM energy_bills eb
    WHERE eb.connection_id = ec.connection_id AND eb.billing_month = '2025-03-01'
  );

INSERT INTO energy_bills (connection_id, billing_month, units_consumed, amount_due, status, due_date)
SELECT ec.connection_id, '2025-04-01', 180.00, 1260.00, 'unpaid', '2025-04-20'
FROM energy_connections ec
WHERE ec.meter_number = 'MTR-003-RES'
  AND NOT EXISTS (
    SELECT 1
    FROM energy_bills eb
    WHERE eb.connection_id = ec.connection_id AND eb.billing_month = '2025-04-01'
  );

INSERT INTO energy_bills (connection_id, billing_month, units_consumed, amount_due, status, due_date)
SELECT ec.connection_id, '2025-03-01', 320.00, 2240.00, 'overdue', '2025-03-20'
FROM energy_connections ec
WHERE ec.meter_number = 'MTR-005-RES'
  AND NOT EXISTS (
    SELECT 1
    FROM energy_bills eb
    WHERE eb.connection_id = ec.connection_id AND eb.billing_month = '2025-03-01'
  );

INSERT INTO energy_bills (connection_id, billing_month, units_consumed, amount_due, status, due_date)
SELECT ec.connection_id, '2025-04-01', 195.00, 1365.00, 'unpaid', '2025-04-22'
FROM energy_connections ec
WHERE ec.meter_number = 'MTR-006-RES'
  AND NOT EXISTS (
    SELECT 1
    FROM energy_bills eb
    WHERE eb.connection_id = ec.connection_id AND eb.billing_month = '2025-04-01'
  );

INSERT INTO energy_bills (connection_id, billing_month, units_consumed, amount_due, status, due_date)
SELECT ec.connection_id, '2025-04-01', 640.00, 4480.00, 'paid', '2025-04-22'
FROM energy_connections ec
WHERE ec.meter_number = 'MTR-007-COM'
  AND NOT EXISTS (
    SELECT 1
    FROM energy_bills eb
    WHERE eb.connection_id = ec.connection_id AND eb.billing_month = '2025-04-01'
  );

-- ============================================================
-- AUTOMOBILES BACKFILL
-- ============================================================

INSERT INTO vehicles (model_name, vehicle_type, fuel_type, price, stock_quantity)
SELECT seed.model_name, seed.vehicle_type, seed.fuel_type, seed.price, seed.stock_quantity
FROM (
  SELECT 'Maruti Swift' AS model_name, 'sedan' AS vehicle_type, 'petrol' AS fuel_type, 650000.00 AS price, 15 AS stock_quantity
  UNION ALL SELECT 'Hyundai Creta', 'suv', 'diesel', 1200000.00, 8
  UNION ALL SELECT 'Tata Nexon EV', 'suv', 'electric', 1500000.00, 5
  UNION ALL SELECT 'Royal Enfield 350', 'bike', 'petrol', 200000.00, 20
  UNION ALL SELECT 'Ashok Leyland 3718', 'truck', 'diesel', 2800000.00, 3
  UNION ALL SELECT 'Mahindra XUV700', 'suv', 'petrol', 2100000.00, 6
  UNION ALL SELECT 'Honda City e:HEV', 'sedan', 'hybrid', 1950000.00, 7
  UNION ALL SELECT 'Ather 450X', 'bike', 'electric', 165000.00, 18
  UNION ALL SELECT 'Tata Ace EV', 'truck', 'electric', 980000.00, 9
  UNION ALL SELECT 'Kia Sonet', 'suv', 'diesel', 1450000.00, 11
  UNION ALL SELECT 'Toyota Hilux', 'truck', 'diesel', 3750000.00, 4
  UNION ALL SELECT 'TVS iQube', 'bike', 'electric', 155000.00, 22
) AS seed
LEFT JOIN vehicles v ON v.model_name = seed.model_name
WHERE v.vehicle_id IS NULL;

INSERT INTO vehicle_orders (user_id, vehicle_id, status, amount_paid)
SELECT seed.user_id, v.vehicle_id, seed.status, seed.amount_paid
FROM (
  SELECT 26 AS user_id, 'Maruti Swift' AS model_name, 'delivered' AS status, 650000.00 AS amount_paid
  UNION ALL SELECT 27, 'Tata Nexon EV', 'confirmed', 1500000.00
  UNION ALL SELECT 28, 'Hyundai Creta', 'pending', NULL
  UNION ALL SELECT 29, 'Royal Enfield 350', 'delivered', 200000.00
  UNION ALL SELECT 30, 'Ashok Leyland 3718', 'cancelled', NULL
  UNION ALL SELECT 26, 'Hyundai Creta', 'confirmed', 1200000.00
  UNION ALL SELECT 27, 'Maruti Swift', 'pending', NULL
  UNION ALL SELECT 31, 'Mahindra XUV700', 'confirmed', 2100000.00
  UNION ALL SELECT 32, 'Honda City e:HEV', 'delivered', 1950000.00
  UNION ALL SELECT 33, 'Ather 450X', 'delivered', 165000.00
  UNION ALL SELECT 34, 'Tata Ace EV', 'confirmed', 980000.00
  UNION ALL SELECT 35, 'Kia Sonet', 'confirmed', 1450000.00
  UNION ALL SELECT 26, 'Toyota Hilux', 'delivered', 3750000.00
  UNION ALL SELECT 27, 'TVS iQube', 'confirmed', 155000.00
  UNION ALL SELECT 28, 'Mahindra XUV700', 'pending', NULL
  UNION ALL SELECT 29, 'Kia Sonet', 'delivered', 1450000.00
  UNION ALL SELECT 30, 'Ather 450X', 'cancelled', NULL
  UNION ALL SELECT 31, 'Tata Nexon EV', 'delivered', 1500000.00
  UNION ALL SELECT 32, 'Tata Ace EV', 'confirmed', 980000.00
  UNION ALL SELECT 33, 'Honda City e:HEV', 'pending', NULL
  UNION ALL SELECT 34, 'Toyota Hilux', 'confirmed', 3750000.00
  UNION ALL SELECT 35, 'TVS iQube', 'delivered', 155000.00
) AS seed
JOIN vehicles v ON v.model_name = seed.model_name
WHERE NOT EXISTS (
  SELECT 1
  FROM vehicle_orders vo
  WHERE vo.user_id = seed.user_id
    AND vo.vehicle_id = v.vehicle_id
    AND vo.status = seed.status
    AND ((vo.amount_paid IS NULL AND seed.amount_paid IS NULL) OR vo.amount_paid = seed.amount_paid)
);

INSERT INTO service_requests (user_id, vehicle_id, service_type, scheduled_at, status)
SELECT seed.user_id, v.vehicle_id, seed.service_type, seed.scheduled_at, seed.status
FROM (
  SELECT 26 AS user_id, 'Maruti Swift' AS model_name, 'Oil Change' AS service_type, '2025-04-10 10:00:00' AS scheduled_at, 'completed' AS status
  UNION ALL SELECT 27, 'Tata Nexon EV', 'Battery Check', '2025-04-15 11:00:00', 'pending'
  UNION ALL SELECT 29, 'Royal Enfield 350', 'General Service', '2025-04-20 09:00:00', 'pending'
  UNION ALL SELECT 28, 'Hyundai Creta', 'Tyre Replacement', '2025-04-18 14:00:00', 'in_progress'
  UNION ALL SELECT 30, 'Hyundai Creta', 'Wheel Alignment', '2025-04-26 15:00:00', 'pending'
  UNION ALL SELECT 26, 'Maruti Swift', 'AC Service', '2025-04-27 11:15:00', 'cancelled'
  UNION ALL SELECT 31, 'Mahindra XUV700', 'Engine Diagnostics', '2025-05-02 10:30:00', 'completed'
  UNION ALL SELECT 32, 'Honda City e:HEV', 'Hybrid System Check', '2025-05-03 12:00:00', 'pending'
  UNION ALL SELECT 33, 'Ather 450X', 'Software Update', '2025-05-04 09:45:00', 'completed'
  UNION ALL SELECT 34, 'Tata Ace EV', 'Battery Inspection', '2025-05-05 14:15:00', 'in_progress'
  UNION ALL SELECT 35, 'Kia Sonet', 'Brake Service', '2025-05-06 11:00:00', 'pending'
  UNION ALL SELECT 26, 'Toyota Hilux', 'Fleet Inspection', '2025-05-07 16:00:00', 'pending'
  UNION ALL SELECT 27, 'TVS iQube', 'Charging Port Check', '2025-05-08 13:20:00', 'completed'
  UNION ALL SELECT 28, 'Tata Nexon EV', 'Annual Service', '2025-05-09 10:10:00', 'cancelled'
  UNION ALL SELECT 29, 'Mahindra XUV700', 'Suspension Check', '2025-05-10 15:30:00', 'pending'
  UNION ALL SELECT 30, 'Kia Sonet', 'Diesel Filter Swap', '2025-05-11 09:00:00', 'completed'
  UNION ALL SELECT 31, 'Tata Ace EV', 'Tyre Rotation', '2025-05-12 17:00:00', 'in_progress'
) AS seed
JOIN vehicles v ON v.model_name = seed.model_name
WHERE NOT EXISTS (
  SELECT 1
  FROM service_requests sr
  WHERE sr.user_id = seed.user_id
    AND sr.vehicle_id = v.vehicle_id
    AND sr.service_type = seed.service_type
    AND sr.scheduled_at = seed.scheduled_at
);
