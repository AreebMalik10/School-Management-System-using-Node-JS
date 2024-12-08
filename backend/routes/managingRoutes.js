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
    const { name, fatherName, regNo, contact, age, username, password, adminId, class: studentClass, section } = req.body;

    if (!adminId) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    try {
        // Find the class_id based on class and section
        const findClassQuery = `SELECT id FROM classes WHERE class_name = ? AND section = ?`;
        db.query(findClassQuery, [studentClass, section], async (err, result) => {
            if (err) {
                console.error('Error fetching class_id:', err);
                return res.status(500).json({ message: 'Error fetching class_id' });
            }

            if (result.length === 0) {
                return res.status(400).json({ message: 'Class and section not found' });
            }

            const classId = result[0].id;
            const hashedPassword = await hashPassword(password);

            // Insert the student record with class_id, class, and section
            const insertStudentQuery = `
                INSERT INTO students (name, fatherName, regNo, contact, age, username, password, adminId, class, section, class_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(
                insertStudentQuery,
                [name, fatherName, regNo, contact, age, username, hashedPassword, adminId, studentClass, section, classId],
                (err, result) => {
                    if (err) {
                        console.error('Error creating student:', err);
                        return res.status(500).json({ message: 'Error creating student' });
                    }
                    res.status(201).json({ message: 'Student created successfully' });
                }
            );
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating student' });
    }
});

// Get students route
router.get('/getStudents', (req, res) => {
    const adminId = req.query.adminId;

    if (!adminId) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Updated query with correct column name `student_id`
    const query = `
        SELECT 
            students.student_id AS studentId,
            students.name,
            students.fatherName,
            students.regNo,
            students.contact,
            students.age,
            students.username,
            classes.class_name AS class,
            classes.section,
            students.adminId
        FROM 
            students
        LEFT JOIN 
            classes 
        ON 
            students.class_id = classes.id
        WHERE 
            students.adminId = ?
    `;
    
    db.query(query, [adminId], (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ message: 'Error fetching students' });
        }
        res.status(200).json(results);
    });
});







// Create teacher route
router.post('/createTeacher', async (req, res) => {
    const { name, contact, education, experience, pay, username, password, adminId } = req.body;

    if (!adminId) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    try {
        const hashedPassword = await hashPassword(password);

        const query = `INSERT INTO teachers (name, contact, education, experience, pay, username, password, adminId) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, contact, education, experience, pay, username, hashedPassword, adminId], (err, result) => {
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
    const { name, childrenName, occupation, contact, username, password, adminId, childUsername } = req.body;

    try {
        // Hash password before saving to DB
        const hashedPassword = await hashPassword(password);

        const query = `INSERT INTO parents (name, childrenName, occupation, contact, username, password, adminId, childUsername) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [name, childrenName, occupation, contact, username, hashedPassword, adminId, childUsername], (err, result) => {
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








// Update student route
router.put('/updateStudent/:id', async (req, res) => {
    const studentId = req.params.id;
    const { name, fatherName, regNo, contact, age, username, password, class: studentClass, section } = req.body;

    let hashedPassword = password;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
    }

    const query = `
        UPDATE students
        SET name = ?, fatherName = ?, regNo = ?, contact = ?, age = ?, username = ?, password = ?, class = ?, section = ?
        WHERE student_id = ?
    `;

    db.query(query, [name, fatherName, regNo, contact, age, username, hashedPassword, studentClass, section, studentId], (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            return res.status(500).json({ message: 'Error updating student' });
        }
        res.status(200).json({ message: 'Student updated successfully' });
    });
});



// Delete student route
router.delete('/deleteStudent/:id', (req, res) => {
    const studentId = req.params.id;

    const query = 'DELETE FROM students WHERE id = ?';
    
    db.query(query, [studentId], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ message: 'Error deleting student' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    });
});


router.get('/getTeachersByAdmin/:adminId', (req, res) => {
    const { adminId } = req.params;

    const query = `SELECT * FROM teachers WHERE adminId = ?`;
    db.query(query, [adminId], (err, results) => {
        if (err) {
            console.error('Error fetching teachers:', err);
            return res.status(500).json({ message: 'Error fetching teachers' });
        }
        res.status(200).json(results);
    });
});

// Update teacher route
router.put('/updateTeacher/:id', async (req, res) => {
    const teacherId = req.params.id;
    const { name, contact, education, experience, pay, username, password } = req.body;

    try {
        // Fetch current teacher data to check the password
        const fetchQuery = `SELECT password FROM teachers WHERE id = ?`;
        db.query(fetchQuery, [teacherId], async (err, results) => {
            if (err) {
                console.error('Error fetching teacher:', err);
                return res.status(500).json({ message: 'Error fetching teacher' });
            }

            const currentPassword = results[0].password;

            // Hash the password only if it's different
            const hashedPassword = password !== currentPassword 
                ? await hashPassword(password) 
                : currentPassword;

            // Update the teacher data
            const updateQuery = `
                UPDATE teachers 
                SET name = ?, contact = ?, education = ?, experience = ?, pay = ?, username = ?, password = ? 
                WHERE id = ?`;

            db.query(updateQuery, [name, contact, education, experience, pay, username, hashedPassword, teacherId], (err, result) => {
                if (err) {
                    console.error('Error updating teacher:', err);
                    return res.status(500).json({ message: 'Error updating teacher' });
                }

                res.status(200).json({ message: 'Teacher updated successfully' });
            });
        });
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ message: 'Error updating teacher' });
    }
});


// Delete teacher
router.delete('/deleteTeacher/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM teachers WHERE id = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting teacher:', err);
            return res.status(500).json({ message: 'Error deleting teacher' });
        }
        res.status(200).json({ message: 'Teacher deleted successfully' });
    });
});

// Fetch parents for a specific admin
router.get('/getParentsByAdmin/:adminId', (req, res) => {
    const { adminId } = req.params;

    const query = `SELECT * FROM parents WHERE adminId = ?`;
    db.query(query, [adminId], (err, results) => {
        if (err) {
            console.error('Error fetching parents:', err);
            return res.status(500).json({ message: 'Error fetching parents' });
        }
        res.status(200).json(results);
    });
});


// Update parent details
router.put('/updateParent/:parentId', async (req, res) => {
    const { parentId } = req.params;
    const { name, childrenName, occupation, contact, username, password, childUsername } = req.body;

    try {
        const hashedPassword = password ? await hashPassword(password) : null;

        const query = `UPDATE parents 
                       SET name = ?, childrenName = ?, occupation = ?, contact = ?, username = ?, password = ?, childUsername = ? 
                       WHERE id = ?`;

        db.query(query, [name, childrenName, occupation, contact, username, hashedPassword, childUsername, parentId], (err, result) => {
            if (err) {
                console.error('Error updating parent:', err);
                return res.status(500).json({ message: 'Error updating parent' });
            }
            res.status(200).json({ message: 'Parent updated successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating parent' });
    }
});



// Delete parent
router.delete('/deleteParent/:parentId', (req, res) => {
    const { parentId } = req.params;

    const query = `DELETE FROM parents WHERE id = ?`;
    db.query(query, [parentId], (err, result) => {
        if (err) {
            console.error('Error deleting parent:', err);
            return res.status(500).json({ message: 'Error deleting parent' });
        }
        res.status(200).json({ message: 'Parent deleted successfully' });
    });
});


// Get Leave Requests for a specific admin
router.get('/viewLeaveRequests', (req, res) => {
    const { adminId } = req.query; // Admin ID passed as a query parameter

    // Validate input
    if (!adminId) {
        return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Fetch leave requests where adminId matches the admin of the teacher
    const fetchLeaveRequestsQuery = `
        SELECT l.id, l.teacherId, l.reason, l.startDate, l.endDate, l.status, t.username AS teacherUsername
        FROM leaves l
        JOIN teachers t ON l.teacherId = t.id
        WHERE t.adminId = ?;
    `;
    db.query(fetchLeaveRequestsQuery, [adminId], (err, leaveRequests) => {
        if (err) {
            console.error('Error fetching leave requests:', err);
            return res.status(500).json({ message: 'Error occurred while fetching leave requests' });
        }

        if (leaveRequests.length === 0) {
            return res.status(404).json({ message: 'No leave requests found for this admin' });
        }

        res.json({ leaveRequests });
    });
});

// Update Leave Request Status (Approve/Reject)
router.put('/updateLeaveRequest/:id', (req, res) => {
    const { status } = req.body; // Status passed in the request body
    const leaveRequestId = req.params.id; // Leave request ID from the URL parameter

    // Validate input
    if (!status || !['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Valid status (Approved or Rejected) is required' });
    }

    // Update the leave request status directly using leaveRequestId
    const updateStatusQuery = `
        UPDATE leaves
        SET status = ?
        WHERE id = ?
    `;

    db.query(updateStatusQuery, [status, leaveRequestId], (err, updateResult) => {
        if (err) {
            console.error('Error updating leave request status:', err);
            return res.status(500).json({ message: 'Error occurred while updating leave request status' });
        }

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.json({ message: 'Leave request status updated successfully' });
    });
});



module.exports = router;
