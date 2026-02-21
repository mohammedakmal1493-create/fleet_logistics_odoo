const pool = require('../config/db');

exports.getSummary = async (req, res) => {
    try {
        // Basic Counts
        const activeVehiclesRes = await pool.query("SELECT COUNT(*) FROM vehicles WHERE status IN ('Available', 'On Trip')");
        const inShopRes = await pool.query("SELECT COUNT(*) FROM vehicles WHERE status = 'In Shop'");

        const totalVehiclesRes = await pool.query("SELECT COUNT(*) FROM vehicles WHERE status != 'Retired'");
        const onTripRes = await pool.query("SELECT COUNT(*) FROM vehicles WHERE status = 'On Trip'");

        let utilizationRate = 0;
        if (Number(totalVehiclesRes.rows[0].count) > 0) {
            utilizationRate = (Number(onTripRes.rows[0].count) / Number(totalVehiclesRes.rows[0].count)) * 100;
        }

        const pendingCargoRes = await pool.query("SELECT SUM(cargo_weight) FROM trips WHERE status IN ('Draft', 'Dispatched')");

        const fuelCostRes = await pool.query("SELECT SUM(cost) FROM fuel_logs");
        const maintenanceCostRes = await pool.query("SELECT SUM(cost) FROM maintenance_logs");

        // Fuel Efficiency (total odometer of all vehicles / total fuel liters)
        const odometerRes = await pool.query("SELECT SUM(odometer) FROM vehicles");
        const totalLitersRes = await pool.query("SELECT SUM(liters) FROM fuel_logs");

        let fuelEfficiency = 0;
        if (Number(totalLitersRes.rows[0].sum) > 0) {
            fuelEfficiency = Number(odometerRes.rows[0].sum) / Number(totalLitersRes.rows[0].sum);
        }

        // Vehicle ROI (mock revenue using total cargo_weight over all completed trips * 5 as an example)
        const completedCargo = await pool.query("SELECT SUM(cargo_weight) FROM trips WHERE status = 'Completed'");
        const mockRevenue = Number(completedCargo.rows[0].sum || 0) * 10; // $10 per unit payload

        const totalAcquisitionRes = await pool.query("SELECT SUM(acquisition_cost) FROM vehicles");
        const totalFuel = Number(fuelCostRes.rows[0].sum || 0);
        const totalMaint = Number(maintenanceCostRes.rows[0].sum || 0);
        const acquisition = Number(totalAcquisitionRes.rows[0].sum || 1); // fallback 1 to avoid div by zero

        const roi = ((mockRevenue - (totalMaint + totalFuel)) / acquisition) * 100;

        res.json({
            activeFleetCount: Number(activeVehiclesRes.rows[0].count),
            vehiclesInShop: Number(inShopRes.rows[0].count),
            utilizationRate: utilizationRate.toFixed(2),
            pendingCargo: Number(pendingCargoRes.rows[0].sum || 0),
            totalFuelCost: totalFuel,
            totalMaintenanceCost: totalMaint,
            fuelEfficiency: fuelEfficiency.toFixed(2),
            vehicleROI: roi.toFixed(2)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
