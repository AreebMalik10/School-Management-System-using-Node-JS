const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Create student route
router.post('/createStudent', async (req, res) => {
    const { name, fatherName, regNo, contact, age, username, password } = req.body;

    try {
        const query = `INSERT INTO students (name, fatherName, regNo, contact, age, username, password) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, fatherName, regNo, contact, age, username, password], (err, result) => {
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
        const query = `INSERT INTO teachers (name, contact, education, experience, pay, username, password) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, contact, education, experience, pay, username, password], (err, result) => {
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
        const query = `INSERT INTO parents (name, childrenName, occupation, contact, username, password) 
                       VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, childrenName, occupation, contact, username, password], (err, result) => {
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

module.exports = router;
