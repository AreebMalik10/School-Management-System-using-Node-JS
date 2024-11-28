const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import your DB connection

const router = express.Router();

// Superadmin Login Route
router.post('/salogin', (req, res) => {
    const { email, password } = req.body;

    // Check if superadmin exists in the database
    const query = 'SELECT * FROM super_admins WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Superadmin not found.' });
        }

        const superadmin = results[0];

        // Verify password (plain-text check since bcrypt is not used)
        if (password !== superadmin.password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: superadmin.id, role: 'superadmin' },
            process.env.JWT_SUPERADMIN_SECRET, // Use Superadmin secret
            { expiresIn: '1h' }
        );
        

        res.status(200).json({ message: 'Login successful.', token });
    });
});

module.exports = router;
