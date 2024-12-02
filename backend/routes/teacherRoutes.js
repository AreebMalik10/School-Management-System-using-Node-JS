const express = require('express');
const { login } = require('../controllers/authControllerstp');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();
const db = require('../config/db'); // Import your DB connection


router.post('/login', login);
router.get('/protected', verifyToken('teacher'), (req, res) => {
    res.json({ message: 'Teacher route accessed', user: req.user });
});


// Create Leave Request (teacher)
router.post('/createLeaveRequest', (req, res) => {
    const { teacherUsername, reason, startDate, endDate } = req.body;

    // Validate input
    if (!teacherUsername || !reason || !startDate || !endDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Fetch teacher details from the database
    const fetchTeacherQuery = 'SELECT id, adminId FROM teachers WHERE username = ?';
    db.query(fetchTeacherQuery, [teacherUsername], (err, teacherResult) => {
        if (err) {
            console.error('Error fetching teacher details:', err);
            return res.status(500).json({ message: 'Error occurred while fetching teacher details' });
        }

        if (teacherResult.length === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const teacherId = teacherResult[0].id;
        const adminId = teacherResult[0].adminId; // Store the adminId here

        // Insert leave request into the 'leaves' table
        const insertLeaveRequestQuery = `
            INSERT INTO leaves (teacherId, adminId, reason, startDate, endDate, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
            insertLeaveRequestQuery,
            [teacherId, adminId, reason, startDate, endDate, 'Pending'],
            (err, result) => {
                if (err) {
                    console.error('Error creating leave request:', err);
                    return res.status(500).json({ message: 'Error occurred while creating leave request' });
                }

                res.json({ message: 'Leave request created successfully' });
            }
        );
    });
});



// Get Leave Requests for a specific teacher
router.get('/viewTeacherLeaveRequests', (req, res) => {
    const { teacherId } = req.query; // Teacher ID passed as a query parameter

    // Validate input
    if (!teacherId) {
        return res.status(400).json({ message: 'Teacher ID is required' });
    }

    // Fetch leave requests where teacherId matches the teacher's ID
    const fetchLeaveRequestsQuery = `
        SELECT id, reason, startDate, endDate, status
        FROM leaves
        WHERE teacherId = ?
        ORDER BY startDate DESC;
    `;

    db.query(fetchLeaveRequestsQuery, [teacherId], (err, leaveRequests) => {
        if (err) {
            console.error('Error fetching leave requests:', err);
            return res.status(500).json({ message: 'Error occurred while fetching leave requests' });
        }

        if (leaveRequests.length === 0) {
            return res.status(404).json({ message: 'No leave requests found for this teacher' });
        }

        res.json({ leaveRequests });
    });
});






module.exports = router;
