const mysql = require('mysql2');
require('dotenv').config();

const baseConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const connectionCandidates = [
    {
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD
    },
    {
        host: process.env.DB_HOST,
        password: ''
    },
    {
        host: '127.0.0.1',
        password: process.env.DB_PASSWORD
    },
    {
        host: '127.0.0.1',
        password: ''
    }
];

function createPool(candidate) {
    return mysql.createPool({
        ...baseConfig,
        host: candidate.host,
        password: candidate.password
    }).promise();
}

async function connectWithFallbacks() {
    const errors = [];

    for (const candidate of connectionCandidates) {
        const pool = createPool(candidate);

        try {
            const connection = await pool.getConnection();
            connection.release();

            console.log(`MySQL connected to ${baseConfig.database} at ${candidate.host}`);
            return pool;
        } catch (error) {
            errors.push(`${candidate.host}: ${error.message}`);
        }
    }

    console.error('DB connection failed:', errors.join(' | '));
    console.error('Server will continue running so auth and non-DB checks can still work.');

    return createPool(connectionCandidates[0]);
}

const poolPromise = connectWithFallbacks();

const db = {
    query: async (...args) => (await poolPromise).query(...args),
    execute: async (...args) => (await poolPromise).execute(...args),
    getConnection: async () => (await poolPromise).getConnection(),
    end: async (...args) => (await poolPromise).end(...args)
};

module.exports = db;
