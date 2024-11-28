const jwt = require('jsonwebtoken');

// Middleware to verify Superadmin Token
const verifySuperAdminToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from headers

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.superadmin = decoded; // Attach decoded token data to request
        next(); // Move to the next middleware/route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = verifySuperAdminToken;
