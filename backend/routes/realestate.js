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

module.exports = router;