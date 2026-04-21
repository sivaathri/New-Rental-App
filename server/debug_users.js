const db = require('./db');

async function check() {
    try {
        const [desc] = await db.query('DESCRIBE users');
        console.log('users schema:', desc);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

check();
