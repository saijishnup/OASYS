const express        = require('express');
const router         = express.Router();
const db             = require('../db/connection');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/automobiles/vehicles
router.get('/vehicles', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                vehicle_id,
                model_name,
                vehicle_type,
                fuel_type,
                price,
                stock_quantity
            FROM vehicles
            ORDER BY price ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/automobiles/orders
router.get('/orders', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                vo.vo_id,
                u.name,
                u.email,
                v.model_name,
                v.vehicle_type,
                v.fuel_type,
                vo.order_date,
                vo.status,
                vo.amount_paid
            FROM vehicle_orders vo
            JOIN users u    ON vo.user_id    = u.user_id
            JOIN vehicles v ON vo.vehicle_id = v.vehicle_id
            ORDER BY vo.order_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/automobiles/service-requests
router.get('/service-requests', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                sr.sr_id,
                u.name,
                v.model_name,
                v.vehicle_type,
                sr.service_type,
                sr.scheduled_at,
                sr.status
            FROM service_requests sr
            JOIN users u    ON sr.user_id    = u.user_id
            JOIN vehicles v ON sr.vehicle_id = v.vehicle_id
            ORDER BY sr.scheduled_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/automobiles/summary
router.get('/summary', async (req, res) => {
    try {
        const [[{ total_vehicles }]]    = await db.query(`SELECT COUNT(*) AS total_vehicles FROM vehicles`);
        const [[{ total_stock }]]       = await db.query(`SELECT COALESCE(SUM(stock_quantity),0) AS total_stock FROM vehicles`);
        const [[{ total_orders }]]      = await db.query(`SELECT COUNT(*) AS total_orders FROM vehicle_orders`);
        const [[{ confirmed_orders }]]  = await db.query(`SELECT COUNT(*) AS confirmed_orders FROM vehicle_orders WHERE status IN ('confirmed','delivered')`);
        const [[{ total_revenue }]]     = await db.query(`SELECT COALESCE(SUM(amount_paid),0) AS total_revenue FROM vehicle_orders WHERE status IN ('confirmed','delivered')`);
        const [[{ pending_service }]]   = await db.query(`SELECT COUNT(*) AS pending_service FROM service_requests WHERE status IN ('pending','in_progress')`);

        res.json({ total_vehicles, total_stock, total_orders, confirmed_orders, total_revenue, pending_service });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/automobiles/place-order
router.post('/place-order', async (req, res) => {
    const { user_id, vehicle_id } = req.body;
    const userId = Number(user_id);
    const vehicleId = Number(vehicle_id);

    if (!userId || !vehicleId) {
        return res.status(400).json({ error: 'user_id and vehicle_id required' });
    }

    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [[user]] = await connection.query(`
            SELECT user_id, name
            FROM users
            WHERE user_id = ?
            FOR UPDATE
        `, [userId]);

        const [[vehicle]] = await connection.query(`
            SELECT vehicle_id, model_name, stock_quantity, price
            FROM vehicles
            WHERE vehicle_id = ?
            FOR UPDATE
        `, [vehicleId]);

        if (!user) {
            await connection.rollback();
            return res.status(404).json({ error: 'User not found' });
        }

        if (!vehicle) {
            await connection.rollback();
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        if (Number(vehicle.stock_quantity) <= 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Vehicle out of stock' });
        }

        await connection.query(`
            UPDATE vehicles
            SET stock_quantity = stock_quantity - 1
            WHERE vehicle_id = ?
        `, [vehicleId]);

        const [orderResult] = await connection.query(`
            INSERT INTO vehicle_orders (user_id, vehicle_id, status, amount_paid)
            VALUES (?, ?, 'confirmed', ?)
        `, [userId, vehicleId, vehicle.price]);

        const [[vehicleOrderTrigger]] = await connection.query(`
            SELECT TRIGGER_NAME
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = DATABASE()
              AND TRIGGER_NAME = 'trg_after_vehicle_order_insert'
            LIMIT 1
        `);

        if (!vehicleOrderTrigger) {
            await connection.query(`
                INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
                VALUES (6, 'INSERT', 'vehicle_orders', ?, ?)
            `, [
                orderResult.insertId,
                `New order by user_id: ${userId} | vehicle_id: ${vehicleId} | Amount: ${Number(vehicle.price).toFixed(2)}`,
            ]);
        }

        await connection.commit();

        res.json({
            success: true,
            message: 'Order placed successfully',
            order_id: orderResult.insertId,
        });
    } catch (err) {
        if (connection) {
            await connection.rollback();
        }
        res.status(400).json({ error: err.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// GET /api/automobiles/orders-by-status
router.get('/orders-by-status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT status, COUNT(*) AS count
            FROM vehicle_orders
            GROUP BY status
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/automobiles/vehicles-by-type
router.get('/vehicles-by-type', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT vehicle_type, COUNT(*) AS count, COALESCE(SUM(stock_quantity),0) AS stock
            FROM vehicles
            GROUP BY vehicle_type
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/automobiles/service-by-status
router.get('/service-by-status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT status, COUNT(*) AS count
            FROM service_requests
            GROUP BY status
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/automobiles/sales-by-type
router.get('/sales-by-type', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                v.vehicle_type,
                COUNT(*) AS order_count,
                COALESCE(SUM(vo.amount_paid), 0) AS revenue
            FROM vehicle_orders vo
            JOIN vehicles v ON vo.vehicle_id = v.vehicle_id
            WHERE vo.status IN ('confirmed', 'delivered')
            GROUP BY v.vehicle_type
            ORDER BY revenue DESC, order_count DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
