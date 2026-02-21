const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const passwords = ['', 'root', 'postgres', 'password', '1234', 'admin'];

const tryConnect = async () => {
    let connectedPassword = null;
    for (const p of passwords) {
        try {
            const client = new Client({
                host: 'localhost',
                port: 5432,
                user: 'postgres',
                password: p,
                database: 'postgres'
            });
            await client.connect();
            connectedPassword = p;
            await client.end();
            break;
        } catch (e) {
            // ignore
        }
    }

    if (connectedPassword !== null) {
        console.log('SUCCESS_PASSWORD:', connectedPassword);
    } else {
        console.log('FAIL_ALL');
    }
}

tryConnect();
