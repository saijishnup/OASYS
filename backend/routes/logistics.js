const express        = require('express');
const router         = express.Router();
const db             = require('../db/connection');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/logistics/shipments
router.get('/shipments', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                s.shipment_id,
                sender.name      AS sender,
                receiver.name    AS receiver,
                s.origin,
                s.destination,
                s.weight_kg,
                s.shipping_cost,
                s.status,
                s.tracking_number,
                s.shipped_at,
                s.delivered_at
            FROM shipments s
            JOIN users sender   ON s.sender_id   = sender.user_id
            JOIN users receiver ON s.receiver_id = receiver.user_id
            ORDER BY s.shipped_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/logistics/routes
router.get('/routes', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                route_id,
                origin,
                destination,
                distance_km,
                avg_days
            FROM logistics_routes
            ORDER BY distance_km ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/logistics/summary
router.get('/summary', async (req, res) => {
    try {
        const [[{ total_shipments }]]  = await db.query(`SELECT COUNT(*) AS total_shipments FROM shipments`);
        const [[{ delivered }]]        = await db.query(`SELECT COUNT(*) AS delivered FROM shipments WHERE status='delivered'`);
        const [[{ in_transit }]]       = await db.query(`SELECT COUNT(*) AS in_transit FROM shipments WHERE status='in_transit'`);
        const [[{ pending }]]          = await db.query(`SELECT COUNT(*) AS pending FROM shipments WHERE status='pending'`);
        const [[{ cancelled }]]        = await db.query(`SELECT COUNT(*) AS cancelled FROM shipments WHERE status='cancelled'`);
        const [[{ total_revenue }]]    = await db.query(`SELECT COALESCE(SUM(shipping_cost),0) AS total_revenue FROM shipments WHERE status='delivered'`);
        const [[{ total_routes }]]     = await db.query(`SELECT COUNT(*) AS total_routes FROM logistics_routes`);

        res.json({ total_shipments, delivered, in_transit, pending, cancelled, total_revenue, total_routes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/logistics/update-status
router.post('/update-status', async (req, res) => {
    const { shipment_id, status } = req.body;
    if (!shipment_id || !status) {
        return res.status(400).json({ error: 'shipment_id and status required' });
    }
    const allowed = ['pending', 'in_transit', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }
    try {
        await db.query(`CALL update_shipment_status(?, ?)`, [shipment_id, status]);
        res.json({ success: true, message: 'Shipment status updated' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/logistics/shipment-by-status
router.get('/shipment-by-status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT status, COUNT(*) AS count
            FROM shipments
            GROUP BY status
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/logistics/top-routes
router.get('/top-routes', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                CONCAT(origin, ' → ', destination) AS route,
                COUNT(*) AS shipment_count,
                COALESCE(SUM(shipping_cost),0) AS revenue
            FROM shipments
            GROUP BY origin, destination
            ORDER BY shipment_count DESC
            LIMIT 5
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;