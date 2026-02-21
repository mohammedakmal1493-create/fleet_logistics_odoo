const express = require('express');
const { getSummary } = require('../controllers/analyticsController');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/summary', authorizeRoles('Financial Analyst', 'Manager'), getSummary);

module.exports = router;
