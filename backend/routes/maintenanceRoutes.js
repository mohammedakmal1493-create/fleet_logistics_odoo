const express = require('express');
const { getAllMaintenanceLogs, addMaintenanceLog, updateMaintenanceLog, deleteMaintenanceLog } = require('../controllers/maintenanceController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/', authorizeRoles('Financial Analyst', 'Manager'), getAllMaintenanceLogs);
router.post('/', authorizeRoles('Manager', 'Financial Analyst'), addMaintenanceLog);
router.put('/:id', authorizeRoles('Manager', 'Financial Analyst'), updateMaintenanceLog);
router.delete('/:id', deleteMaintenanceLog);

module.exports = router;
