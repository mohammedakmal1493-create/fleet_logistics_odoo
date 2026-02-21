const pool = require('./config/db');

async function run() {
    try {
        await pool.query('ALTER TABLE fuel_logs ADD COLUMN driver_name VARCHAR(255);');
        await pool.query('ALTER TABLE fuel_logs ADD COLUMN receipt_url TEXT;');
        console.log('Migration done');
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

run();
