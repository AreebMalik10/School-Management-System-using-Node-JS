const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [admin] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
        if (admin.length === 0) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        const isMatch = await bcrypt.compare(password, admin[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: admin[0].id, email: admin[0].email, name: admin[0].name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, name: admin[0].name, email: admin[0].email, message: 'Login successful.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};