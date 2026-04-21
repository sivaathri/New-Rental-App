const db = require('./db');

async function check() {
    try {
        const [tables] = await db.query('SHOW TABLES');
        console.log('Tables:', tables);
        
        try {
            const [desc] = await db.query('DESCRIBE service_enquiries');
            console.log('service_enquiries schema:', desc);
        } catch (e) {
            console.log('service_enquiries does not exist or error:', e.message);
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

check();
