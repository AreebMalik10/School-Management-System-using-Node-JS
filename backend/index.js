// Import necessary modules
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Set up MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database.');
    }
});

// Middleware for verifying JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid token.' });
        }
        req.user = decoded;
        next();
    });
};

// 1. Super Admin route: Create Admin Account
app.post('/superadmin/create-admin', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if super admin is authenticated
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.isSuperAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Prevent Super Admin from creating their own account
        if (decoded.email === email) {
            return res.status(400).json({ message: 'You cannot create your own account.' });
        }

        // Check if the admin already exists
        const [existingAdmin] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);

        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new admin into the database
        const [result] = await db.promise().query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        res.status(201).json({ message: 'Admin account created successfully!' });
    } catch (error) {
        console.error('Error:', error);  // Log the full error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



// 6. Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on {port}`);
});
