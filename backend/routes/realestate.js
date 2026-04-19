const express        = require('express');
const router         = express.Router();
const db             = require('../db/connection');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/realestate/properties
router.get('/properties', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                property_id,
                title,
                property_type,
                price,
                status,
                listed_at
            FROM properties
            ORDER BY listed_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/realestate/deals
router.get('/deals', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                d.deal_id,
                p.title        AS property,
                p.property_type,
                buyer.name     AS buyer,
                agent.name     AS agent,
                d.deal_value,
                d.status,
                d.opened_at,
                d.closed_at
            FROM re_deals d
            JOIN properties p  ON d.property_id = p.property_id
            JOIN users buyer   ON d.buyer_id     = buyer.user_id
            JOIN users agent   ON d.agent_id     = agent.user_id
            ORDER BY d.opened_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/realestate/summary
router.get('/summary', async (req, res) => {
    try {
        const [[{ total_properties }]]  = await db.query(`SELECT COUNT(*) AS total_properties FROM properties`);
        const [[{ available }]]         = await db.query(`SELECT COUNT(*) AS available FROM properties WHERE status='available'`);
        const [[{ sold }]]              = await db.query(`SELECT COUNT(*) AS sold FROM properties WHERE status='sold'`);
        const [[{ rented }]]            = await db.query(`SELECT COUNT(*) AS rented FROM properties WHERE status='rented'`);
        const [[{ total_deal_value }]]  = await db.query(`SELECT COALESCE(SUM(deal_value),0) AS total_deal_value FROM re_deals WHERE status='completed'`);
        const [[{ pending_deals }]]     = await db.query(`SELECT COUNT(*) AS pending_deals FROM re_deals WHERE status='pending'`);

        res.json({ total_properties, available, sold, rented, total_deal_value, pending_deals });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/realestate/property-by-type
router.get('/property-by-type', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT property_type, COUNT(*) AS count, COALESCE(SUM(price),0) AS total_value
            FROM properties
            GROUP BY property_type
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/realestate/deal-status
router.get('/deal-status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT status, COUNT(*) AS count
            FROM re_deals
            GROUP BY status
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/update-deal-status', async (req, res) => {
    const { deal_id, status } = req.body;
    const dealId = Number(deal_id);
    const allowed = ['pending', 'completed', 'cancelled'];

    if (!dealId || !status) {
        return res.status(400).json({ error: 'deal_id and status required' });
    }

    if (!allowed.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
    }

    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [[deal]] = await connection.query(`
            SELECT deal_id, property_id, status
            FROM re_deals
            WHERE deal_id = ?
            FOR UPDATE
        `, [dealId]);

        if (!deal) {
            await connection.rollback();
            return res.status(404).json({ error: 'Deal not found' });
        }

        await connection.query(`
            UPDATE re_deals
            SET status = ?, closed_at = CASE WHEN ? = 'completed' THEN NOW() ELSE NULL END
            WHERE deal_id = ?
        `, [status, status, dealId]);

        if (status === 'completed') {
            await connection.query(`
                UPDATE properties
                SET status = 'sold'
                WHERE property_id = ?
            `, [deal.property_id]);
        } else if (deal.status === 'completed' && status !== 'completed') {
            await connection.query(`
                UPDATE properties
                SET status = 'available'
                WHERE property_id = ?
            `, [deal.property_id]);
        }

        await connection.commit();
        res.json({ success: true, message: 'Deal status updated' });
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

// POST /api/realestate/update-property
router.post('/update-property', async (req, res) => {
    const { property_id, title, property_type, price, status } = req.body;
    const propId = Number(property_id);
    const propPrice = Number(price);
    const allowedTypes = ['residential', 'commercial', 'industrial'];
    const allowedStatus = ['available', 'sold', 'rented'];

    if (!propId || !title || !property_type || !propPrice || !status) {
        return res.status(400).json({ error: 'property_id, title, property_type, price, and status required' });
    }

    if (!allowedTypes.includes(property_type)) {
        return res.status(400).json({ error: `property_type must be one of: ${allowedTypes.join(', ')}` });
    }

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${allowedStatus.join(', ')}` });
    }

    try {
        const [[property]] = await db.query(`
            SELECT property_id FROM properties WHERE property_id = ?
        `, [propId]);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const [result] = await db.query(`
            UPDATE properties
            SET title = ?, property_type = ?, price = ?, status = ?
            WHERE property_id = ?
        `, [title, property_type, propPrice, status, propId]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Failed to update property' });
        }

        res.json({ success: true, message: 'Property updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
