const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:     process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0
});

const db = pool.promise();

db.getConnection()
    .then((connection) => {
        console.log('MySQL connected to oasys_db');
        connection.release();
    })
    .catch(err => {
        console.error('DB connection failed:', err.message);
        console.error('Server will continue running so auth and non-DB checks can still work.');
    });

module.exports = db;
