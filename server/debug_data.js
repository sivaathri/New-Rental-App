const db = require('./db');

async function check() {
    try {
        const [enq] = await db.query('SELECT * FROM service_enquiries');
        console.log('service_enquiries rows:', enq);
        
        const [services] = await db.query('SELECT id, name, call_clicks, map_clicks FROM services');
        console.log('services counters:', services);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

check();
