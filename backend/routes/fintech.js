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
    const fromAccountId = Number(from_account);
    const toAccountId = Number(to_account);
    const transferAmount = Number(amount);

    if (!fromAccountId || !toAccountId || !transferAmount) {
        return res.status(400).json({ error: 'from_account, to_account, amount required' });
    }

    if (fromAccountId === toAccountId) {
        return res.status(400).json({ error: 'Choose two different accounts' });
    }

    if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [[fromAccount]] = await connection.query(`
            SELECT ba.account_id, ba.balance, u.name
            FROM bank_accounts ba
            JOIN users u ON ba.user_id = u.user_id
            WHERE ba.account_id = ?
            FOR UPDATE
        `, [fromAccountId]);

        const [[toAccount]] = await connection.query(`
            SELECT ba.account_id, ba.balance, u.name
            FROM bank_accounts ba
            JOIN users u ON ba.user_id = u.user_id
            WHERE ba.account_id = ?
            FOR UPDATE
        `, [toAccountId]);

        if (!fromAccount) {
            await connection.rollback();
            return res.status(404).json({ error: 'From account not found' });
        }

        if (!toAccount) {
            await connection.rollback();
            return res.status(404).json({ error: 'To account not found' });
        }

        if (Number(fromAccount.balance) < transferAmount) {
            await connection.rollback();
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        await connection.query(`
            UPDATE bank_accounts
            SET balance = balance - ?
            WHERE account_id = ?
        `, [transferAmount, fromAccountId]);

        await connection.query(`
            UPDATE bank_accounts
            SET balance = balance + ?
            WHERE account_id = ?
        `, [transferAmount, toAccountId]);

        const [debitResult] = await connection.query(`
            INSERT INTO transactions (account_id, txn_type, amount, status, description)
            VALUES (?, 'transfer', ?, 'success', ?)
        `, [fromAccountId, transferAmount, `Transfer to account ${toAccountId}`]);

        const [creditResult] = await connection.query(`
            INSERT INTO transactions (account_id, txn_type, amount, status, description)
            VALUES (?, 'credit', ?, 'success', ?)
        `, [toAccountId, transferAmount, `Transfer from account ${fromAccountId}`]);

        const [[transactionTrigger]] = await connection.query(`
            SELECT TRIGGER_NAME
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = DATABASE()
              AND TRIGGER_NAME = 'trg_after_transaction_insert'
            LIMIT 1
        `);

        if (!transactionTrigger) {
            await connection.query(`
                INSERT INTO audit_logs (vertical_id, action, table_name, record_id, description)
                VALUES
                (1, 'INSERT', 'transactions', ?, ?),
                (1, 'INSERT', 'transactions', ?, ?)
            `, [
                debitResult.insertId,
                `Txn type: transfer | Amount: ${transferAmount.toFixed(2)} | Status: success`,
                creditResult.insertId,
                `Txn type: credit | Amount: ${transferAmount.toFixed(2)} | Status: success`,
            ]);
        }

        await connection.commit();

        res.json({
            success: true,
            message: 'Transfer successful',
            transactions: [debitResult.insertId, creditResult.insertId],
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
