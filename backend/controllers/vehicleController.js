const pool = require('../config/db');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM vehicles';
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

// Create a vehicle
exports.createVehicle = async (req, res) => {
    const { model, license_plate, capacity, status, acquisition_cost } = req.body;
    try {
        const newVehicle = await pool.query(
            'INSERT INTO vehicles (model, license_plate, capacity, status, acquisition_cost) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [model, license_plate, capacity, status || 'Available', acquisition_cost || 0]
        );
        res.status(201).json(newVehicle.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { model, capacity, status, odometer } = req.body;
    try {
        const result = await pool.query(
            'UPDATE vehicles SET model = $1, capacity = $2, status = $3, odometer = $4 WHERE id = $5 RETURNING *',
            [model, capacity, status, odometer, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retire a vehicle
exports.retireVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "UPDATE vehicles SET status = 'Retired' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('BEGIN');
        // Delete dependent logs to satisfy foreign key constraints
        await pool.query('DELETE FROM maintenance_logs WHERE vehicle_id = $1', [id]);
        await pool.query('DELETE FROM fuel_logs WHERE vehicle_id = $1', [id]);
        await pool.query('DELETE FROM trips WHERE vehicle_id = $1', [id]);
        await pool.query('DELETE FROM expenses WHERE vehicle_id = $1', [id]);

        await pool.query('DELETE FROM vehicles WHERE id = $1', [id]);
        await pool.query('COMMIT');

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
};
