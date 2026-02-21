const express = require('express');
const { getAllDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/', getAllDrivers);
router.post('/', authorizeRoles('Safety Officer', 'Manager'), createDriver);
router.put('/:id', authorizeRoles('Safety Officer', 'Manager'), updateDriver);
router.delete('/:id', deleteDriver);

module.exports = router;
