const express        = require('express');
const router         = express.Router();
const db             = require('../db/connection');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

// GET /api/fintech/accounts
router.get('/accounts', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                ba.account_id,
                u.name,
                u.email,
                ba.account_type,
                ba.balance,
                ba.created_at
            FROM bank_accounts ba
            JOIN users u ON ba.user_id = u.user_id
            ORDER BY ba.account_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/fintech/transactions
router.get('/transactions', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                t.txn_id,
                t.account_id,
                u.name,
                t.txn_type,
                t.amount,
                t.txn_date,
                t.status,
                t.description
            FROM transactions t
            JOIN bank_accounts ba ON t.account_id = ba.account_id
            JOIN users u ON ba.user_id = u.user_id
            ORDER BY t.txn_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/fintech/loans
router.get('/loans', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                l.loan_id,
                u.name,
                u.email,
                l.principal,
                l.interest_rate,
                l.status,
                l.disbursed_at
            FROM loans l
            JOIN users u ON l.user_id = u.user_id
            ORDER BY l.disbursed_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/fintech/summary
router.get('/summary', async (req, res) => {
    try {
        const [[{ total_balance }]]   = await db.query(`SELECT COALESCE(SUM(balance),0) AS total_balance FROM bank_accounts`);
        const [[{ total_credit }]]    = await db.query(`SELECT COALESCE(SUM(amount),0) AS total_credit FROM transactions WHERE txn_type='credit'`);
        const [[{ total_debit }]]     = await db.query(`SELECT COALESCE(SUM(amount),0) AS total_debit FROM transactions WHERE txn_type IN ('debit','transfer')`);
        const [[{ active_loans }]]    = await db.query(`SELECT COUNT(*) AS active_loans FROM loans WHERE status='active'`);
        const [[{ total_loan_amt }]]  = await db.query(`SELECT COALESCE(SUM(principal),0) AS total_loan_amt FROM loans WHERE status='active'`);

        res.json({ total_balance, total_credit, total_debit, active_loans, total_loan_amt });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/fintech/transfer
router.post('/transfer', async (req, res) => {
    const { from_account, to_account, amount } = req.body;
    if (!from_account || !to_account || !amount) {
        return res.status(400).json({ error: 'from_account, to_account, amount required' });
    }
    try {
        await db.query(`CALL transfer_funds(?, ?, ?)`, [from_account, to_account, amount]);
        res.json({ success: true, message: 'Transfer successful' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/fintech/txn-by-type
router.get('/txn-by-type', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT txn_type, COUNT(*) AS count, COALESCE(SUM(amount),0) AS total
            FROM transactions
            GROUP BY txn_type
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;