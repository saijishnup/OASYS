-- ============================================================
-- OASYS STORED PROCEDURES
-- DB: oasys_db
-- ============================================================

USE oasys_db;

DELIMITER $$

-- ============================================================
-- 1. FUND TRANSFER (Fintech)
--    Transfers amount between two bank accounts
-- ============================================================

CREATE PROCEDURE transfer_funds(
    IN p_from_account INT,
    IN p_to_account   INT,
    IN p_amount       DECIMAL(15,2)
)
BEGIN
    DECLARE v_balance DECIMAL(15,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transfer failed. Transaction rolled back.';
    END;

    START TRANSACTION;

    -- Check balance
    SELECT balance INTO v_balance
    FROM bank_accounts
    WHERE account_id = p_from_account
    FOR UPDATE;

    IF v_balance < p_amount THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance.';
    END IF;

    -- Deduct from sender
    UPDATE bank_accounts
    SET balance = balance - p_amount
    WHERE account_id = p_from_account;

    -- Credit to receiver
    UPDATE bank_accounts
    SET balance = balance + p_amount
    WHERE account_id = p_to_account;

    -- Log debit transaction
    INSERT INTO transactions (account_id, txn_type, amount, status, description)
    VALUES (p_from_account, 'transfer', p_amount, 'success',
            CONCAT('Transfer to account ', p_to_account));

    -- Log credit transaction
    INSERT INTO transactions (account_id, txn_type, amount, status, description)
    VALUES (p_to_account, 'credit', p_amount, 'success',
            CONCAT('Transfer from account ', p_from_account));

    COMMIT;
END$$

-- ============================================================
-- 2. PLACE VEHICLE ORDER (Automobiles)
--    Creates order and decrements stock
-- ============================================================

CREATE PROCEDURE place_vehicle_order(
    IN p_user_id    INT,
    IN p_vehicle_id INT
)
BEGIN
    DECLARE v_stock  INT;
    DECLARE v_price  DECIMAL(15,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Order placement failed.';
    END;

    START TRANSACTION;

    SELECT stock_quantity, price INTO v_stock, v_price
    FROM vehicles
    WHERE vehicle_id = p_vehicle_id
    FOR UPDATE;

    IF v_stock <= 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehicle out of stock.';
    END IF;

    -- Decrement stock
    UPDATE vehicles
    SET stock_quantity = stock_quantity - 1
    WHERE vehicle_id = p_vehicle_id;

    -- Create order
    INSERT INTO vehicle_orders (user_id, vehicle_id, status, amount_paid)
    VALUES (p_user_id, p_vehicle_id, 'confirmed', v_price);

    COMMIT;
END$$

-- ============================================================
-- 3. RENEW SUBSCRIPTION (Telecom)
--    Extends subscription end_date based on plan validity
-- ============================================================

CREATE PROCEDURE renew_subscription(
    IN p_sub_id INT
)
BEGIN
    DECLARE v_validity INT;
    DECLARE v_end_date TIMESTAMP;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Subscription renewal failed.';
    END;

    START TRANSACTION;

    -- Get validity from linked plan
    SELECT tp.validity_days, s.end_date
    INTO v_validity, v_end_date
    FROM subscriptions s
    JOIN telecom_plans tp ON s.plan_id = tp.plan_id
    WHERE s.sub_id = p_sub_id
    FOR UPDATE;

    -- Extend from current end_date or now (whichever is later)
    UPDATE subscriptions
    SET end_date = DATE_ADD(GREATEST(v_end_date, NOW()), INTERVAL v_validity DAY),
        status   = 'active'
    WHERE sub_id = p_sub_id;

    COMMIT;
END$$

-- ============================================================
-- 4. PAY ENERGY BILL (Energy)
-- ============================================================

CREATE PROCEDURE pay_energy_bill(
    IN p_bill_id INT
)
BEGIN
    DECLARE v_status VARCHAR(20);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bill payment failed.';
    END;

    START TRANSACTION;

    SELECT status INTO v_status
    FROM energy_bills
    WHERE bill_id = p_bill_id
    FOR UPDATE;

    IF v_status = 'paid' THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bill already paid.';
    END IF;

    UPDATE energy_bills
    SET status = 'paid'
    WHERE bill_id = p_bill_id;

    COMMIT;
END$$

-- ============================================================
-- 5. UPDATE SHIPMENT STATUS (Logistics)
-- ============================================================

CREATE PROCEDURE update_shipment_status(
    IN p_shipment_id INT,
    IN p_status      VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Shipment update failed.';
    END;

    START TRANSACTION;

    UPDATE shipments
    SET status       = p_status,
        delivered_at = CASE WHEN p_status = 'delivered' THEN NOW() ELSE delivered_at END
    WHERE shipment_id = p_shipment_id;

    COMMIT;
END$$

DELIMITER ;