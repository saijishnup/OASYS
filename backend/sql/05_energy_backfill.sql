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
