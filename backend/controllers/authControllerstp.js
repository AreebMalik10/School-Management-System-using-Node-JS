const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

function generateToken(user, role) {
    let secretKey;

    if (role === 'student') {
        secretKey = process.env.JWT_SECRET_STUDENT;
    } else if (role === 'teacher') {
        secretKey = process.env.JWT_SECRET_TEACHER;
    } else if (role === 'parent') {
        secretKey = process.env.JWT_SECRET_PARENT;
    } else {
        throw new Error('Invalid role');
    }

    return jwt.sign({ id: user.id, username: user.username, name: user.name, role }, secretKey, { expiresIn: '1h' });
}

module.exports = {
    login: (req, res) => {
        const { username, password, role } = req.body;

        let table;
        if (role === 'student') table = 'students';
        else if (role === 'teacher') table = 'teachers';
        else if (role === 'parent') table = 'parents';
        else return res.status(400).json({ message: 'Invalid role' });

        const query = `SELECT * FROM ${table} WHERE username = ?`;

        db.query(query, [username], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error querying database' });
            if (result.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) return res.status(500).json({ message: 'Server Error' });
                if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

                // Include name and username in the token
                const token = generateToken(result[0], role);
                res.json({ token });
            });
        });
    }
};

