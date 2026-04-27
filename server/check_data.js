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
        const [master] = await pool.query('SELECT name FROM vehicle_master');
        const [vehicles] = await pool.query('SELECT DISTINCT type FROM vehicles');
        
        console.log('--- Master Categories ---');
        console.log(master.map(m => m.name));
        
        console.log('--- Vehicle Types ---');
        console.log(vehicles.map(v => v.type));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkData();
