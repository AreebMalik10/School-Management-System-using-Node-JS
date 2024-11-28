const jwt = require('jsonwebtoken');

function verifyToken(role) {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: 'Token not provided' });
        }

        let secretKey;
        if (role === 'student') {
            secretKey = process.env.JWT_SECRET_STUDENT;
        } else if (role === 'teacher') {
            secretKey = process.env.JWT_SECRET_TEACHER;
        } else if (role === 'parent') {
            secretKey = process.env.JWT_SECRET_PARENT;
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    };
}

module.exports = verifyToken;
