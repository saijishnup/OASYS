-- ============================================================
-- OASYS TRIGGERS — Audit Logging
-- DB: oasys_db
-- ============================================================

USE oasys_db;

DELIMITER $$

-- ============================================================
-- FINTECH TRIGGERS
-- ============================================================

CREATE TRIGGER trg_after_transaction_insert
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
    VALUES (1, 'INSERT', 'transactions', NEW.txn_id,
            CONCAT('Txn type: ', NEW.txn_type, ' | Amount: ', NEW.amount, ' | Status: ', NEW.status));
END$$

CREATE TRIGGER trg_after_loan_update
AFTER UPDATE ON loans
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
        VALUES (1, 'UPDATE', 'loans', NEW.loan_id,
                CONCAT('Loan status changed: ', OLD.status, ' → ', NEW.status));
    END IF;
END$$

-- ============================================================
-- REAL ESTATE TRIGGERS
-- ============================================================

CREATE TRIGGER trg_after_deal_insert
AFTER INSERT ON re_deals
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
    VALUES (2, 'INSERT', 're_deals', NEW.deal_id,
            CONCAT('New deal for property_id: ', NEW.property_id, ' | Value: ', NEW.deal_value));
END$$

CREATE TRIGGER trg_after_deal_update
AFTER UPDATE ON re_deals
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        -- If deal completed, mark property as sold
        IF NEW.status = 'completed' THEN
            UPDATE properties SET status = 'sold' WHERE property_id = NEW.property_id;
        END IF;

        INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
        VALUES (2, 'UPDATE', 're_deals', NEW.deal_id,
                CONCAT('Deal status changed: ', OLD.status, ' → ', NEW.status));
    END IF;
END$$

-- ============================================================
-- TELECOM TRIGGERS
-- ============================================================

CREATE TRIGGER trg_after_subscription_update
AFTER UPDATE ON subscriptions
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
        VALUES (3, 'UPDATE', 'subscriptions', NEW.sub_id,
                CONCAT('Subscription status: ', OLD.status, ' → ', NEW.status));
    END IF;
END$$

CREATE TRIGGER trg_after_subscription_insert
AFTER INSERT ON subscriptions
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
    VALUES (3, 'INSERT', 'subscriptions', NEW.sub_id,
            CONCAT('New subscription for user_id: ', NEW.user_id, ' | plan_id: ', NEW.plan_id));
END$$

-- ============================================================
-- LOGISTICS TRIGGERS
-- ============================================================

CREATE TRIGGER trg_after_shipment_insert
AFTER INSERT ON shipments
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
    VALUES (4, 'INSERT', 'shipments', NEW.shipment_id,
            CONCAT('New shipment: ', NEW.tracking_number, ' | ', NEW.origin, ' → ', NEW.destination));
END$$

CREATE TRIGGER trg_after_shipment_update
AFTER UPDATE ON shipments
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
        VALUES (4, 'UPDATE', 'shipments', NEW.shipment_id,
                CONCAT('Shipment ', NEW.tracking_number, ' status: ', OLD.status, ' → ', NEW.status));
    END IF;
END$$

-- ============================================================
-- ENERGY TRIGGERS
-- ============================================================

CREATE TRIGGER trg_after_energy_bill_insert
AFTER INSERT ON energy_bills
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
    VALUES (5, 'INSERT', 'energy_bills', NEW.bill_id,
            CONCAT('Bill for connection_id: ', NEW.connection_id, ' | Amount: ', NEW.amount_due, ' | Due: ', NEW.due_date));
END$$

CREATE TRIGGER trg_after_energy_bill_update
AFTER UPDATE ON energy_bills
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
        VALUES (5, 'UPDATE', 'energy_bills', NEW.bill_id,
                CONCAT('Bill status changed: ', OLD.status, ' → ', NEW.status));
    END IF;
END$$

-- ============================================================
-- AUTOMOBILES TRIGGERS
-- ============================================================

CREATE TRIGGER trg_after_vehicle_order_insert
AFTER INSERT ON vehicle_orders
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
    VALUES (6, 'INSERT', 'vehicle_orders', NEW.vo_id,
            CONCAT('New order by user_id: ', NEW.user_id, ' | vehicle_id: ', NEW.vehicle_id, ' | Amount: ', IFNULL(NEW.amount_paid, 'N/A')));
END$$

CREATE TRIGGER trg_after_vehicle_order_update
AFTER UPDATE ON vehicle_orders
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
        VALUES (6, 'UPDATE', 'vehicle_orders', NEW.vo_id,
                CONCAT('Order status: ', OLD.status, ' → ', NEW.status));
    END IF;
END$$

CREATE TRIGGER trg_after_service_request_insert
AFTER INSERT ON service_requests
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
    VALUES (6, 'INSERT', 'service_requests', NEW.sr_id,
            CONCAT('Service request by user_id: ', NEW.user_id, ' | Type: ', NEW.service_type));
END$$

DELIMITER ;