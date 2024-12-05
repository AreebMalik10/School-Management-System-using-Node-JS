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
    const { username, feeAmount, fineAmount, dueDate, challanMonth, challanDescription, othersExpense } = req.body;
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

        // Calculate total amount: Fee + Fine + Other Expenses
        const totalAmount = parseFloat(feeAmount) + parseFloat(fineAmount || 0) + parseFloat(othersExpense || 0);

        // Insert the challan with the fetched regNo and admin's email
        const insertChallanQuery = `
            INSERT INTO challans (regNo, username, fee_amount, fine_amount, total_amount, due_date, status, adminEmail, challan_month, challan_description, others_expense)
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)
        `;
        const values = [
            regNo, 
            username, 
            feeAmount, 
            fineAmount || 0, 
            totalAmount, 
            dueDate, 
            adminEmail, 
            challanMonth, 
            challanDescription, 
            othersExpense || 0
        ];

        db.query(insertChallanQuery, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error while creating challan');
            }
            res.status(200).send('Challan created successfully');
        });
    });
});



router.get('/getChallansByAdmin', (req, res) => {
    const adminEmail = req.query.adminEmail;  // Admin's email passed in query

    if (!adminEmail) {
        return res.status(400).send('Admin email is required');
    }

    // Query to get all challans created by the admin
    const getChallansQuery = 'SELECT * FROM challans WHERE adminEmail = ?';

    db.query(getChallansQuery, [adminEmail], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error while fetching challans');
        }

        if (result.length === 0) {
            return res.status(404).send('No challans found for this admin');
        }

        res.status(200).json(result); // Send the challans back as a response
    });
});

// Update Challan (Status Update)
router.put('/updateChallan', (req, res) => {
    const { challanId, status } = req.body;  // Challan ID and new status

    if (!challanId || !status) {
        return res.status(400).send('Challan ID and status are required');
    }

    // Log values for debugging
    console.log('Challan ID:', challanId);
    console.log('New Status:', status);

    // Query to update the status of a specific challan
    const updateChallanQuery = 'UPDATE challans SET status = ? WHERE id = ?';

    db.query(updateChallanQuery, [status, challanId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error while updating challan');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Challan not found');
        }

        res.status(200).send('Challan status updated successfully');
    });
});


// Delete Challan
router.delete('/deleteChallan', (req, res) => {
    const { challanId } = req.body;

    if (!challanId) {
        return res.status(400).send('Challan ID is required');
    }

    // Query to delete the challan
    const deleteChallanQuery = 'DELETE FROM challans WHERE id = ?';

    db.query(deleteChallanQuery, [challanId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error while deleting challan');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Challan not found');
        }

        res.status(200).send('Challan deleted successfully');
    });
});


module.exports = router;  

