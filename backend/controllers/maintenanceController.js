const pool = require('../config/db');

exports.getAllMaintenanceLogs = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM maintenance_logs ORDER BY date DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addMaintenanceLog = async (req, res) => {
    const { vehicle_id, description, cost, date } = req.body;
    try {
        await pool.query('BEGIN');

        const result = await pool.query(
            'INSERT INTO maintenance_logs (vehicle_id, description, cost, date) VALUES ($1, $2, $3, $4) RETURNING *',
            [vehicle_id, description, cost, date]
        );

        // Update vehicle status to "In Shop"
        await pool.query(
            "UPDATE vehicles SET status = 'In Shop' WHERE id = $1",
            [vehicle_id]
        );

        await pool.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
};

exports.updateMaintenanceLog = async (req, res) => {
    const { id } = req.params;
    const { vehicle_id, description, cost, date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE maintenance_logs SET vehicle_id = $1, description = $2, cost = $3, date = $4 WHERE id = $5 RETURNING *',
            [vehicle_id, description, cost, date, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMaintenanceLog = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM maintenance_logs WHERE id = $1', [id]);
        res.json({ message: 'Log deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
