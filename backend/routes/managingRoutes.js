const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const router = express.Router();

// Function to hash password
const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

// Create student route
router.post('/createStudent', async (req, res) => {
    const { name, fatherName, regNo, contact, age, username, password } = req.body;

    try {
        // Hash password before saving to DB
        const hashedPassword = await hashPassword(password);

        const query = `INSERT INTO students (name, fatherName, regNo, contact, age, username, password) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, fatherName, regNo, contact, age, username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error creating student:', err);
                return res.status(500).json({ message: 'Error creating student' });
            }
            res.status(201).json({ message: 'Student created successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating student' });
    }
});

// Create teacher route
router.post('/createTeacher', async (req, res) => {
    const { name, contact, education, experience, pay, username, password } = req.body;

    try {
        // Hash password before saving to DB
        const hashedPassword = await hashPassword(password);

        const query = `INSERT INTO teachers (name, contact, education, experience, pay, username, password) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, contact, education, experience, pay, username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error creating teacher:', err);
                return res.status(500).json({ message: 'Error creating teacher' });
            }
            res.status(201).json({ message: 'Teacher created successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating teacher' });
    }
});

// Create parent route
router.post('/createParent', async (req, res) => {
    const { name, childrenName, occupation, contact, username, password } = req.body;

    try {
        // Hash password before saving to DB
        const hashedPassword = await hashPassword(password);

        const query = `INSERT INTO parents (name, childrenName, occupation, contact, username, password) 
                       VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, childrenName, occupation, contact, username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error creating parent:', err);
                return res.status(500).json({ message: 'Error creating parent' });
            }
            res.status(201).json({ message: 'Parent created successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating parent' });
    }
});

// Get students route
router.get('/getStudents', (req, res) => {
    const query = 'SELECT * FROM students';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ message: 'Error fetching students' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
