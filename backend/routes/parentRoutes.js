const express = require('express');
const { login } = require('../controllers/authControllerstp');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const db = require('../config/db');


router.post('/login', login);
router.get('/protected', verifyToken('parent'), (req, res) => {
    res.json({ message: 'Parent route accessed', user: req.user });
});

router.get('/getParentByUsername', (req, res) => {
    const { username } = req.query; // Query params se username lein

    const query = 'SELECT * FROM parents WHERE username = ?'; // Sirf specific username ke liye data fetch karein

    db.query(query, [username], (err, result) => {
        if (err) {
            console.error('Error fetching parent:', err);
            return res.status(500).json({ message: 'Error fetching parent data' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Parent not found' });
        }
        res.status(200).json(result[0]); // Sirf ek parent ka record bhejenge
    });
});


// parent apne child ka challan dekh sakty
// Get Challan details based on matching childUsername from the parents table
router.get('/getParentChallanDetails', (req, res) => {
    const { childUsername } = req.query; // childUsername ko request query se receive karenge

    const query = `
        SELECT 
            c.id, 
            c.student_id, 
            c.fee_amount, 
            c.fine_amount, 
            c.total_amount, 
            c.due_date, 
            c.status, 
            c.regNo, 
            c.username, 
            c.adminEmail 
        FROM 
            challans c
        WHERE 
            c.username = ?
    `;

    db.query(query, [childUsername], (err, result) => {
        if (err) {
            console.error('Error fetching challan data:', err);
            return res.status(500).json({ message: 'Error fetching challan data' });
        }
        res.status(200).json(result); // Challan data ko response mein return karein
    });
});



module.exports = router;
