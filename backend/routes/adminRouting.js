const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const router = express.Router();

router.get('/students/classwise/:adminId', (req, res) => {
    const adminId = req.params.adminId;
    
    const query = 'SELECT * FROM students WHERE adminId = ? ORDER BY class ASC, name ASC';
    
    db.query(query, [adminId], (err, result) => {
        if (err) {
            return res.status(500).send('Database error');
        }
        res.json(result); // Return the class-wise sorted students to the admin
    });
});


router.post('/createChallan', (req, res) => {
    const { username, feeAmount, fineAmount, dueDate } = req.body;
    const adminEmail = req.body.adminEmail;  // Admin's email passed from frontend

    // Query to get the regNo associated with the given username
    const getRegNoQuery = 'SELECT regNo FROM students WHERE username = ?';

    db.query(getRegNoQuery, [username], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error while fetching student data');
        }

        if (result.length === 0) {
            return res.status(404).send('Student with the provided username not found');
        }

        const regNo = result[0].regNo;
        const totalAmount = parseFloat(feeAmount) + parseFloat(fineAmount || 0);

        // Insert the challan with the fetched regNo and admin's email
        const insertChallanQuery = `
            INSERT INTO challans (regNo, username, fee_amount, fine_amount, total_amount, due_date, status, adminEmail)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
        `;
        const values = [regNo, username, feeAmount, fineAmount || 0, totalAmount, dueDate, adminEmail];

        db.query(insertChallanQuery, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error while creating challan');
            }
            res.status(200).send('Challan created successfully');
        });
    });
});




router.get('/getChallans/:regNo', (req, res) => {
    const { regNo } = req.params;

    const query = `
        SELECT * FROM challans WHERE regNo = ?
    `;

    db.query(query, [regNo], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error while fetching challans');
        }
        res.status(200).json(results);
    });
});







module.exports = router;  

