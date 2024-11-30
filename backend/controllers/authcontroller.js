const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch admin from database
        const [admin] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
        if (admin.length === 0) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin[0].id, email: admin[0].email, name: admin[0].name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Include admin ID in the response
        res.status(200).json({
            token,
            adminId: admin[0].id, // Include admin ID
            name: admin[0].name,
            email: admin[0].email,
            message: 'Login successful.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};
