const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access Denied: No Token Provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Access Denied: Invalid Token' });
        req.user = user;
        next();
    });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // If the user's role is not included in the required roles, forbid access
        if (!roles.includes(req.user.role) && req.user.role !== 'Manager') {
            return res.status(403).json({ error: 'Access Denied: Unauthorized Role' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };
