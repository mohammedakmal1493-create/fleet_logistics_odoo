const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const run = async () => {
    try {
        const client1 = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: '1234',
            database: 'postgres'
        });
        await client1.connect();

        const res = await client1.query("SELECT 1 FROM pg_database WHERE datname='fleetflow'");
        if (res.rowCount === 0) {
            await client1.query('CREATE DATABASE fleetflow');
            console.log('Created database fleetflow');
        } else {
            console.log('Database fleetflow already exists');
        }
        await client1.end();

        const client2 = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: '1234',
            database: 'fleetflow'
        });
        await client2.connect();

        let schema = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf-8');

        // Remove CREATE DATABASE and \c commands which are not valid in a normal query
        schema = schema.replace(/CREATE DATABASE fleetflow;/i, '');
        schema = schema.replace(/\\c fleetflow;/i, '');

        await client2.query(schema);
        console.log('Tables created successfully');
        await client2.end();
    } catch (e) {
        console.error('Error:', e);
    }
};

run();
