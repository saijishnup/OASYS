require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Simple token: base64 of "username:password"
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        const [username, password] = decoded.split(':');

        if (
            username === process.env.ADMIN_USERNAME &&
            password  === process.env.ADMIN_PASSWORD
        ) {
            req.user = { username };
            return next();
        }

        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (err) {
        return res.status(401).json({ error: 'Token validation failed' });
    }
};

module.exports = authMiddleware;