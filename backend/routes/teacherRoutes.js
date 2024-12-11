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
            INSERT INTO leaves (teacherId, adminId, username, reason, startDate, endDate, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
            insertLeaveRequestQuery,
            [teacherId, adminId, teacherUsername, reason, startDate, endDate, 'Pending'],
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

// Fetch Leave Requests for a Teacher by Username
router.get('/viewLeaveRequests1', (req, res) => {
    const teacherUsername = req.query.username; // Get the username from the query parameters

    if (!teacherUsername) {
        return res.status(400).json({ message: 'Teacher username is required' });
    }

    const fetchLeaveRequestsQuery = `
        SELECT id, reason, startDate, endDate, status
        FROM leaves
        WHERE username = ?;
    `;

    db.query(fetchLeaveRequestsQuery, [teacherUsername], (err, leaveRequests) => {
        if (err) {
            console.error('Error fetching leave requests:', err);
            return res.status(500).json({ message: 'Error occurred while fetching leave requests' });
        }

        if (leaveRequests.length === 0) {
            return res.status(404).json({ message: 'No leave requests found for this username' });
        }

        res.json({ leaveRequests });
    });
});


// Express route for fetching students by teacher's username
// Express route for fetching students by teacher's username
router.post('/getStudentsByTeacher', (req, res) => {
    const { username } = req.body;  // Teacher's username from the request body

    // Pehle teacher ka class_id dhoondhna
    db.query(`
        SELECT id FROM classes WHERE teacher_username = ?`, [username], (err, classResults) => {
        if (err) {
            return res.status(500).json({ message: 'Class ke liye error aayi' });
        }

        if (classResults.length === 0) {
            return res.status(404).json({ message: 'Is teacher ke liye koi class nahi mili' });
        }

        const classId = classResults[0].id;  // Class id le li

        // Ab usi class_id ke students dhoondhna
        db.query(`
            SELECT name, regNo, class, username, section FROM students WHERE class_id = ?`, [classId], (err, studentResults) => {
            if (err) {
                return res.status(500).json({ message: 'Students ke liye error aayi' });
            }

            if (studentResults.length === 0) {
                return res.status(404).json({ message: 'Is class ke liye koi students nahi mile' });
            }

            res.json({ students: studentResults });  // Students ki details bhej rahe hain
        });
    });
});



router.post('/attendance', (req, res) => {
    const { student_id, status, date, teacher_username, admin_id } = req.body;

    if (!student_id || !status || !date || !teacher_username || !admin_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate student belongs to teacher's class
    db.query(
        `SELECT s.* 
         FROM students s 
         JOIN classes c ON s.class_id = c.id 
         WHERE s.student_id = ? AND c.teacher_username = ? AND c.admin_id = ?`,
        [student_id, teacher_username, admin_id],
        (error, results) => {
            if (error) {
                console.error('Error validating student:', error);
                return res.status(500).json({ error: 'Database error' });
            }

            if (!results.length) {
                return res.status(403).json({ error: 'Unauthorized action or invalid student' });
            }

            // Save attendance
            db.query(
                `INSERT INTO attendance (student_id, teacher_username, admin_id, date, status)
                 VALUES (?, ?, ?, ?, ?)`,
                [student_id, teacher_username, admin_id, date, status],
                (insertError, insertResults) => {
                    if (insertError) {
                        console.error('Error saving attendance:', insertError);
                        return res.status(500).json({ error: 'Database error' });
                    }

                    res.json({ message: 'Attendance marked successfully' });
                }
            );
        }
    );
});


module.exports = router;
