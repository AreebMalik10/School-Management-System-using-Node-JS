// Import necessary modules
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_management',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
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

// 1. Super Admin: Create Admin
app.post('/superadmin/create-admin', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const [existingAdmin] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }

        // Insert admin into database
        await db.promise().query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        res.status(201).json({ message: 'Admin created successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// 3. Super Admin: View All Admins
app.get('/superadmin/view-admins', verifyToken, async (req, res) => {
    try {
        // Fetch all admins from the database
        const [admins] = await db.promise().query('SELECT * FROM admins');
        res.status(200).json({ admins });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// 5. Super Admin: Delete Admin
app.delete('/superadmin/delete-admin/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the admin from the database
        await db.promise().query('DELETE FROM admins WHERE id = ?', [id]);

        res.status(200).json({ message: 'Admin deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// 2. Admin Login
app.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const [admin] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
        if (admin.length === 0) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, admin[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin[0].id, email: admin[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Login successful.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});