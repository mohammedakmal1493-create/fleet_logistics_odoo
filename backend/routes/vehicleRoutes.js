const express = require('express');
const { getAllVehicles, createVehicle, updateVehicle, retireVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.use(authenticateToken); // apply token middleware

// Protect based on roles
router.get('/', getAllVehicles); // Any authenticated user can view (especially Dispatcher)
router.post('/', authorizeRoles('Manager'), createVehicle);
router.put('/:id', authorizeRoles('Manager', 'Dispatcher'), updateVehicle);
router.patch('/:id/retire', authorizeRoles('Manager'), retireVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
