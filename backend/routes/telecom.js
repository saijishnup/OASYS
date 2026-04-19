const express        = require('express');
const router         = express.Router();
const db             = require('../db/connection');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/telecom/plans
router.get('/plans', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                plan_id,
                plan_name,
                plan_type,
                data_gb,
                price,
                validity_days
            FROM telecom_plans
            ORDER BY price ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/telecom/subscriptions
router.get('/subscriptions', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                s.sub_id,
                u.name,
                u.email,
                tp.plan_name,
                tp.plan_type,
                tp.price,
                s.start_date,
                s.end_date,
                s.status
            FROM subscriptions s
            JOIN users u        ON s.user_id = u.user_id
            JOIN telecom_plans tp ON s.plan_id = tp.plan_id
            ORDER BY s.start_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/telecom/usage
router.get('/usage', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                nu.usage_id,
                u.name,
                nu.usage_date,
                nu.data_used_gb,
                nu.call_minutes,
                tp.plan_name
            FROM network_usage nu
            JOIN subscriptions s  ON nu.sub_id   = s.sub_id
            JOIN users u          ON s.user_id   = u.user_id
            JOIN telecom_plans tp ON s.plan_id   = tp.plan_id
            ORDER BY nu.usage_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/telecom/summary
router.get('/summary', async (req, res) => {
    try {
        const [[{ total_plans }]]        = await db.query(`SELECT COUNT(*) AS total_plans FROM telecom_plans`);
        const [[{ active_subs }]]        = await db.query(`SELECT COUNT(*) AS active_subs FROM subscriptions WHERE status='active'`);
        const [[{ expired_subs }]]       = await db.query(`SELECT COUNT(*) AS expired_subs FROM subscriptions WHERE status='expired'`);
        const [[{ total_data_used }]]    = await db.query(`SELECT COALESCE(SUM(data_used_gb),0) AS total_data_used FROM network_usage`);
        const [[{ total_call_minutes }]] = await db.query(`SELECT COALESCE(SUM(call_minutes),0) AS total_call_minutes FROM network_usage`);
        const [[{ revenue }]]            = await db.query(`SELECT COALESCE(SUM(tp.price),0) AS revenue FROM subscriptions s JOIN telecom_plans tp ON s.plan_id=tp.plan_id`);

        res.json({ total_plans, active_subs, expired_subs, total_data_used, total_call_minutes, revenue });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/telecom/renew
router.post('/renew', async (req, res) => {
    const { sub_id } = req.body;
    if (!sub_id) return res.status(400).json({ error: 'sub_id required' });
    const subId = Number(sub_id);
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [[subscription]] = await connection.query(`
            SELECT s.sub_id, s.end_date, tp.validity_days
            FROM subscriptions s
            JOIN telecom_plans tp ON s.plan_id = tp.plan_id
            WHERE s.sub_id = ?
            FOR UPDATE
        `, [subId]);

        if (!subscription) {
            await connection.rollback();
            return res.status(404).json({ error: 'Subscription not found' });
        }

        await connection.query(`
            UPDATE subscriptions
            SET end_date = DATE_ADD(GREATEST(end_date, NOW()), INTERVAL ? DAY),
                status = 'active'
            WHERE sub_id = ?
        `, [subscription.validity_days, subId]);

        await connection.commit();
        res.json({ success: true, message: 'Subscription renewed successfully' });
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

router.post('/update-subscription', async (req, res) => {
    const { sub_id, status } = req.body;
    const subId = Number(sub_id);
    const allowed = ['active', 'expired', 'cancelled'];

    if (!subId || !status) {
        return res.status(400).json({ error: 'sub_id and status required' });
    }

    if (!allowed.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }

    try {
        const [[subscription]] = await db.query(`
            SELECT sub_id, status
            FROM subscriptions
            WHERE sub_id = ?
        `, [subId]);

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        if (subscription.status === status) {
            return res.json({ success: true, message: `Subscription already ${status}` });
        }

        const [result] = await db.query(`
            UPDATE subscriptions
            SET status = ?
            WHERE sub_id = ?
        `, [status, subId]);

        if (!result.affectedRows) {
            return res.status(400).json({ error: 'Subscription update did not apply' });
        }

        res.json({ success: true, message: 'Subscription updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/telecom/sub-by-status
router.get('/sub-by-status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT status, COUNT(*) AS count
            FROM subscriptions
            GROUP BY status
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/telecom/plan-by-type
router.get('/plan-by-type', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT plan_type, COUNT(*) AS count
            FROM telecom_plans
            GROUP BY plan_type
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
