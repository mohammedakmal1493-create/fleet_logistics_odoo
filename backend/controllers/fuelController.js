const pool = require('../config/db');

exports.getAllFuelLogs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM fuel_logs ORDER BY date DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addFuelLog = async (req, res) => {
    const { vehicle_id, liters, cost, date, driver_name, receipt_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO fuel_logs (vehicle_id, liters, cost, date, driver_name, receipt_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [vehicle_id, liters, cost, date, driver_name, receipt_url || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFuelLog = async (req, res) => {
    const { id } = req.params;
    const { vehicle_id, liters, cost, date, receipt_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE fuel_logs SET vehicle_id = $1, liters = $2, cost = $3, date = $4, receipt_url = $5 WHERE id = $6 RETURNING *',
            [vehicle_id, liters, cost, date, receipt_url || null, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFuelLog = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM fuel_logs WHERE id = $1', [id]);
        res.json({ message: 'Log deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
