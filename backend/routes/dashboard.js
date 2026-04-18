const express        = require('express');
const router         = express.Router();
const db             = require('../db/connection');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/dashboard/kpis
router.get('/kpis', async (req, res) => {
    try {
        const [[{ total_users }]]          = await db.query(`SELECT COUNT(*) AS total_users FROM users`);
        const [[{ total_transactions }]]   = await db.query(`SELECT COUNT(*) AS total_transactions FROM transactions`);
        const [[{ total_revenue }]]        = await db.query(`SELECT COALESCE(SUM(amount),0) AS total_revenue FROM transactions WHERE txn_type = 'credit'`);
        const [[{ active_loans }]]         = await db.query(`SELECT COUNT(*) AS active_loans FROM loans WHERE status = 'active'`);
        const [[{ active_subscriptions }]] = await db.query(`SELECT COUNT(*) AS active_subscriptions FROM subscriptions WHERE status = 'active'`);
        const [[{ pending_shipments }]]    = await db.query(`SELECT COUNT(*) AS pending_shipments FROM shipments WHERE status IN ('pending','in_transit')`);
        const [[{ unpaid_bills }]]         = await db.query(`SELECT COUNT(*) AS unpaid_bills FROM energy_bills WHERE status IN ('unpaid','overdue')`);
        const [[{ vehicles_sold }]]        = await db.query(`SELECT COUNT(*) AS vehicles_sold FROM vehicle_orders WHERE status IN ('confirmed','delivered')`);

        res.json({
            total_users,
            total_transactions,
            total_revenue,
            active_loans,
            active_subscriptions,
            pending_shipments,
            unpaid_bills,
            vehicles_sold
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/dashboard/vertical-summary
router.get('/vertical-summary', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                v.vertical_name,
                COUNT(DISTINCT u.user_id) AS user_count
            FROM verticals v
            LEFT JOIN users u ON u.vertical_id = v.vertical_id
            GROUP BY v.vertical_id, v.vertical_name
            ORDER BY v.vertical_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/dashboard/recent-activity
router.get('/recent-activity', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                al.log_id,
                v.vertical_name,
                al.action,
                al.table_name,
                al.record_id,
                al.description,
                al.changed_at
            FROM audit_logs al
            LEFT JOIN verticals v ON al.vertical_id = v.vertical_id
            ORDER BY al.changed_at DESC
            LIMIT 20
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/dashboard/txn-trend
router.get('/txn-trend', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                DATE(txn_date) AS date,
                SUM(amount)    AS total,
                COUNT(*)       AS count
            FROM transactions
            WHERE txn_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(txn_date)
            ORDER BY date ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/dashboard/shipment-status
router.get('/shipment-status', async (req, res) => {
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

// GET /api/dashboard/energy-bill-status
// Donut chart — paid vs unpaid vs overdue
router.get('/energy-bill-status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT status, COUNT(*) AS count, COALESCE(SUM(amount_due),0) AS total
            FROM energy_bills
            GROUP BY status
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/dashboard/domain-revenue
// Bar chart — revenue/activity value per vertical
router.get('/domain-revenue', async (req, res) => {
    try {
        const results = {};

        const [[{ fintech }]]     = await db.query(`SELECT COALESCE(SUM(amount),0) AS fintech FROM transactions WHERE txn_type='credit'`);
        const [[{ realestate }]]  = await db.query(`SELECT COALESCE(SUM(deal_value),0) AS realestate FROM re_deals WHERE status='completed'`);
        const [[{ telecom }]]     = await db.query(`SELECT COALESCE(SUM(tp.price),0) AS telecom FROM subscriptions s JOIN telecom_plans tp ON s.plan_id=tp.plan_id`);
        const [[{ logistics }]]   = await db.query(`SELECT COALESCE(SUM(shipping_cost),0) AS logistics FROM shipments WHERE status='delivered'`);
        const [[{ energy }]]      = await db.query(`SELECT COALESCE(SUM(amount_due),0) AS energy FROM energy_bills WHERE status='paid'`);
        const [[{ automobiles }]] = await db.query(`SELECT COALESCE(SUM(amount_paid),0) AS automobiles FROM vehicle_orders WHERE status IN ('confirmed','delivered')`);

        res.json([
            { vertical: 'Fintech',      value: fintech },
            { vertical: 'Real Estate',  value: realestate },
            { vertical: 'Telecom',      value: telecom },
            { vertical: 'Logistics',    value: logistics },
            { vertical: 'Energy',       value: energy },
            { vertical: 'Automobiles',  value: automobiles }
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;