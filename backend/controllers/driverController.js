const pool = require('../config/db');

exports.getAllDrivers = async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM drivers';
        let values = [];
        if (status) {
            query += ' WHERE status = $1';
            values.push(status);
        }
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createDriver = async (req, res) => {
    const { name, license_number, license_expiry, status, safety_score } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO drivers (name, license_number, license_expiry, status, safety_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, license_number, license_expiry, status || 'On Duty', safety_score || 100]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDriver = async (req, res) => {
    const { id } = req.params;
    const { name, license_expiry, status, safety_score } = req.body;
    try {
        const result = await pool.query(
            'UPDATE drivers SET name = $1, license_expiry = $2, status = $3, safety_score = $4 WHERE id = $5 RETURNING *',
            [name, license_expiry, status, safety_score, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDriver = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('BEGIN');
        await pool.query('DELETE FROM trips WHERE driver_id = $1', [id]);
        await pool.query('DELETE FROM drivers WHERE id = $1', [id]);
        await pool.query('COMMIT');
        res.json({ message: 'Driver deleted successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
};
