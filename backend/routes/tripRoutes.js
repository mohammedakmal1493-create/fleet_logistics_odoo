const express = require('express');
const { getAllTrips, createTrip, dispatchTrip, completeTrip, updateTrip, deleteTrip } = require('../controllers/tripController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/', authorizeRoles('Dispatcher', 'Driver', 'Manager'), getAllTrips);
router.post('/', authorizeRoles('Dispatcher', 'Manager'), createTrip);
router.put('/:id', authorizeRoles('Dispatcher', 'Manager'), updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/dispatch', dispatchTrip);
router.post('/:id/complete', completeTrip);

module.exports = router;
