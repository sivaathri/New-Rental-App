const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkData() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'rental_db'
    });

    try {
        const [counts] = await pool.query('SELECT type, status, is_active, COUNT(*) as count FROM vehicles GROUP BY type, status, is_active');
        console.log('--- Vehicle Counts ---');
        console.table(counts);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkData();
