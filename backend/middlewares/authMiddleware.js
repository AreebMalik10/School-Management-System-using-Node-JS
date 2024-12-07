const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid token.' });
        }
        // decoded mein admin ki ID hogi, isse req.user mein set karna
        req.user = decoded;  // Assuming decoded contains the admin's info, like adminId
        next();
    });
};

module.exports = verifyToken;
