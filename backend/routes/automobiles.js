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
    if (!user_id || !vehicle_id) {
        return res.status(400).json({ error: 'user_id and vehicle_id required' });
    }
    try {
        await db.query(`CALL place_vehicle_order(?, ?)`, [user_id, vehicle_id]);
        res.json({ success: true, message: 'Order placed successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
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

module.exports = router;