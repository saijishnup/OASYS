const express = require('express');
const router  = express.Router();
require('dotenv').config();

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        // Generate simple base64 token
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        return res.json({ success: true, token, username });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ valid: false });

    try {
        const token    = authHeader.split(' ')[1];
        const decoded  = Buffer.from(token, 'base64').toString('utf8');
        const [u, p]   = decoded.split(':');

        if (u === process.env.ADMIN_USERNAME && p === process.env.ADMIN_PASSWORD) {
            return res.json({ valid: true, username: u });
        }
        return res.status(401).json({ valid: false });
    } catch {
        return res.status(401).json({ valid: false });
    }
});

module.exports = router;