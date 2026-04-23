const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB connection check
require('./db/connection');

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/dashboard',   require('./routes/dashboard'));
app.use('/api/fintech',     require('./routes/fintech'));
app.use('/api/realestate',  require('./routes/realestate'));
app.use('/api/telecom',     require('./routes/telecom'));
app.use('/api/logistics',   require('./routes/logistics'));
app.use('/api/energy',      require('./routes/energy'));
app.use('/api/automobiles', require('./routes/automobiles'));

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'OASYS API running', version: '1.0.0' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));