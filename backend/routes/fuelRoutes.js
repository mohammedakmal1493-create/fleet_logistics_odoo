const express = require('express');
const { getAllFuelLogs, addFuelLog, updateFuelLog, deleteFuelLog } = require('../controllers/fuelController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/', authorizeRoles('Financial Analyst', 'Manager', 'Driver'), getAllFuelLogs);
router.post('/', authorizeRoles('Driver', 'Manager'), addFuelLog);
router.put('/:id', authorizeRoles('Manager', 'Financial Analyst', 'Driver'), updateFuelLog);
router.delete('/:id', deleteFuelLog);

module.exports = router;
