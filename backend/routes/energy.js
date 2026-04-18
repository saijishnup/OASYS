const express        = require('express');
const router         = express.Router();
const db             = require('../db/connection');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/energy/connections
router.get('/connections', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                ec.connection_id,
                u.name,
                u.email,
                ec.connection_type,
                ec.meter_number,
                ec.status,
                ec.connected_at
            FROM energy_connections ec
            JOIN users u ON ec.user_id = u.user_id
            ORDER BY ec.connected_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/energy/bills
router.get('/bills', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                eb.bill_id,
                u.name,
                ec.meter_number,
                ec.connection_type,
                eb.billing_month,
                eb.units_consumed,
                eb.amount_due,
                eb.status,
                eb.due_date
            FROM energy_bills eb
            JOIN energy_connections ec ON eb.connection_id = ec.connection_id
            JOIN users u               ON ec.user_id       = u.user_id
            ORDER BY eb.billing_month DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/energy/summary
router.get('/summary', async (req, res) => {
    try {
        const [[{ total_connections }]] = await db.query(`SELECT COUNT(*) AS total_connections FROM energy_connections`);
        const [[{ active }]]            = await db.query(`SELECT COUNT(*) AS active FROM energy_connections WHERE status='active'`);
        const [[{ total_units }]]       = await db.query(`SELECT COALESCE(SUM(units_consumed),0) AS total_units FROM energy_bills`);
        const [[{ total_billed }]]      = await db.query(`SELECT COALESCE(SUM(amount_due),0) AS total_billed FROM energy_bills`);
        const [[{ total_collected }]]   = await db.query(`SELECT COALESCE(SUM(amount_due),0) AS total_collected FROM energy_bills WHERE status='paid'`);
        const [[{ unpaid_count }]]      = await db.query(`SELECT COUNT(*) AS unpaid_count FROM energy_bills WHERE status IN ('unpaid','overdue')`);

        res.json({ total_connections, active, total_units, total_billed, total_collected, unpaid_count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/energy/pay-bill
router.post('/pay-bill', async (req, res) => {
    const { bill_id } = req.body;
    if (!bill_id) return res.status(400).json({ error: 'bill_id required' });
    try {
        await db.query(`CALL pay_energy_bill(?)`, [bill_id]);
        res.json({ success: true, message: 'Bill paid successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/energy/bill-by-status
router.get('/bill-by-status', async (req, res) => {
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

// GET /api/energy/connection-by-type
router.get('/connection-by-type', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT connection_type, COUNT(*) AS count
            FROM energy_connections
            GROUP BY connection_type
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/energy/monthly-consumption
router.get('/monthly-consumption', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                DATE_FORMAT(billing_month, '%b %Y') AS month,
                COALESCE(SUM(units_consumed),0)     AS total_units,
                COALESCE(SUM(amount_due),0)         AS total_amount
            FROM energy_bills
            GROUP BY billing_month
            ORDER BY billing_month ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;