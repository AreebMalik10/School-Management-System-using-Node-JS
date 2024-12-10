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


//Admin class or section ko create kr raha 
{/* router.post('/createclass', (req, res) => {
    const { class_name, section } = req.body;

    // Get admin details from session
    const admin_email = req.body.admin_email; // Assuming it's sent from the frontend (like from session)
    const admin_id = req.body.admin_id; // Assuming it's sent from the frontend (like from session)

    if (!class_name || !section || !admin_email || !admin_id) {
        return res.status(400).send({ message: 'Missing required fields.' });
    }

    // Step 1: Check if the class already exists
    const checkClassQuery = `
        SELECT id FROM classes WHERE class_name = ? AND section = ?
    `;

    db.query(checkClassQuery, [class_name, section], (err, result) => {
        if (err) {
            console.error('Error checking class:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        // If class exists, return an error
        if (result.length > 0) {
            return res.status(400).send({ message: 'Class with this name and section already exists.' });
        }

        // Step 2: Insert new class into the classes table
        const createClassQuery = `
            INSERT INTO classes (class_name, section, admin_email, admin_id) 
            VALUES (?, ?, ?, ?)
        `;

        db.query(createClassQuery, [class_name, section, admin_email, admin_id], (err, result) => {
            if (err) {
                console.error('Error creating class:', err);
                return res.status(500).send({ message: 'Internal Server Error' });
            }

            res.status(200).send({ message: 'Class created successfully.', class_id: result.insertId });
        });
    });
}); */}

router.post('/createclass', (req, res) => {
    const { class_name, section, admin_email, admin_id, teacher_username } = req.body;

    if (!class_name || !section || !admin_email || !admin_id || !teacher_username) {
        return res.status(400).send({ message: 'Missing required fields.' });
    }

    // Step 1: Find teacher_id by teacher_username in the teachers table
    const getTeacherIdQuery = `SELECT id FROM teachers WHERE username = ?`;

    db.query(getTeacherIdQuery, [teacher_username], (err, teacherResult) => {
        if (err) {
            console.log('Error fetching teacher ID:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        // If no teacher found with the given username
        if (teacherResult.length === 0) {
            return res.status(400).send({ message: 'Teacher with this username does not exist.' });
        }

        const teacherId = teacherResult[0].id; // Get teacher_id

        // Step 2: Check if the class already exists for this admin
        const checkClassQuery = `SELECT id FROM classes WHERE class_name = ? AND section = ? AND admin_id = ?`;

        db.query(checkClassQuery, [class_name, section, admin_id], (err, result) => {
            if (err) {
                console.log('Error checking class:', err);
                return res.status(500).send({ message: 'Internal Server Error' });
            }

            // If class exists for the same admin, return an error
            if (result.length > 0) {
                return res.status(400).send({ message: 'Class with this name and section already exists for this admin.' });
            }

            // Step 3: Create class and store teacher_id
            const createClassQuery = `
                INSERT INTO classes (class_name, section, admin_email, admin_id, teacher_username, teacher_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(createClassQuery, [class_name, section, admin_email, admin_id, teacher_username, teacherId], (err, result) => {
                if (err) {
                    console.error('Error Creating Class:', err);
                    return res.status(500).send({ message: 'Internal Server Error' });
                }

                res.status(200).send({ message: 'Class Created Successfully.', class_id: result.insertId });
            });
        });
    });
});

// Fetch classes for a specific admin
router.get('/getclasses', (req, res) => {
    const { admin_id } = req.query; // Admin ID from query params

    if (!admin_id) {
        return res.status(400).send({ message: 'Admin ID is required.' });
    }

    const fetchClassesQuery = `
        SELECT * FROM classes WHERE admin_id = ?
    `;

    db.query(fetchClassesQuery, [admin_id], (err, results) => {
        if (err) {
            console.error('Error fetching classes:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        res.status(200).send({ message: 'Classes fetched successfully.', data: results });
    });
});

//Update classes for a specific admin
router.put('/updateclass/:id', (req, res) => {
    const { class_name, section, teacher_username, admin_id } = req.body;
  
    if (!class_name || !section || !teacher_username || !admin_id) {
      return res.status(400).send('All fields are required');
    }
  
    // Sanitize teacher_username to remove extra spaces
    const trimmedUsername = teacher_username.trim();
  
    // Update query with teacher_id fetched from teachers table
    const query = `
      UPDATE classes 
      SET 
        class_name = ?, 
        section = ?, 
        teacher_username = ?, 
        teacher_id = (SELECT id FROM teachers WHERE username = ?)
      WHERE id = ? AND admin_id = ?;
    `;
  
    db.query(
      query,
      [class_name, section, trimmedUsername, trimmedUsername, req.params.id, admin_id],
      (err, result) => {
        if (err) {
          console.error('Error updating class:', err);
          return res.status(500).send('Failed to update class');
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).send('Class not found or not authorized');
        }
  
        res.send('Class updated successfully');
      }
    );
  });

// Delete a class by admin
router.delete('/deleteclass/:id', (req, res) => {
    const classId = req.params.id; // Class ID from route params
    const { admin_id } = req.body; // Admin ID from request body

    if (!admin_id) {
        return res.status(400).send({ message: 'Admin ID is required.' });
    }

    const deleteClassQuery = `
        DELETE FROM classes 
        WHERE id = ? AND admin_id = ?
    `;

    db.query(deleteClassQuery, [classId, admin_id], (err, results) => {
        if (err) {
            console.error('Error deleting class:', err);
            return res.status(500).send({ message: 'Internal Server Error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).send({ message: 'Class not found or you do not have permission to delete it.' });
        }

        res.status(200).send({ message: 'Class deleted successfully.' });
    });
});


// Admin subject wise teachers assign kr rha ha 
router.post('/assign-subject', (req, res) => {
    const { subject_name, class_name, section, teacher_username, admin_email } = req.body;

    // Step 1: Check if the combination of class_name, section, and teacher already exists
    const checkExistingAssignmentQuery = `
        SELECT * FROM subjects 
        WHERE class_name = ? AND section = ? AND teacher_username = ?
    `;

    db.query(checkExistingAssignmentQuery, [class_name, section, teacher_username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // If the combination already exists, return an error message
        if (result.length > 0) {
            return res.status(400).json({ error: 'This teacher is already assigned to this class and section.' });
        }

        // Step 2: Check if the admin's email matches the class and section they manage
        const checkAdminClassQuery = `
            SELECT id FROM classes 
            WHERE class_name = ? AND section = ? AND admin_email = ?
        `;
        
        db.query(checkAdminClassQuery, [class_name, section, admin_email], (err, classResult) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (classResult.length === 0) {
                return res.status(400).json({ error: 'Class or section does not exist for this admin.' });
            }

            const class_id = classResult[0].id; // Get class_id from the result

            // Step 3: Fetch the teacher_id using teacher_username
            const teacherQuery = `
                SELECT id FROM teachers WHERE username = ?
            `;
            
            db.query(teacherQuery, [teacher_username], (err, teacherResult) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (teacherResult.length === 0) {
                    return res.status(400).json({ error: 'Teacher not found.' });
                }

                const teacher_id = teacherResult[0].id; // Get teacher_id from the result

                // Step 4: Insert the subject assignment into the subjects table
                const insertQuery = `
                    INSERT INTO subjects (subject_name, class_name, section, class_id, teacher_username, teacher_id, admin_email) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(insertQuery, [subject_name, class_name, section, class_id, teacher_username, teacher_id, admin_email], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.status(200).json({ message: 'Teacher assigned to subject successfully!' });
                });
            });
        });
    });
});


router.get('/get-assigned-subjects', (req, res) => {
    const admin_email = req.body.admin_email || req.query.admin_email; // Get the admin's email from the session or query parameter

    if (!admin_email) {
        return res.status(400).json({ error: 'Admin email is required.' });
    }

    // Query to fetch assigned subjects based on the admin's email
    const fetchSubjectsQuery = `
        SELECT * FROM subjects WHERE admin_email = ?
    `;

    db.query(fetchSubjectsQuery, [admin_email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No subjects assigned for this admin.' });
        }

        res.status(200).json({ subjects: result });
    });
});

// Assuming an endpoint exists for updating subjects
router.put('/update-assigned-subject/:id', (req, res) => {
    const { id } = req.params;
    const { subject_name, class_name, section, teacher_username, admin_email } = req.body;

    const updateQuery = `
        UPDATE subjects 
        SET subject_name = ?, class_name = ?, section = ?, teacher_username = ?, admin_email = ?
        WHERE id = ?
    `;
    db.query(updateQuery, [subject_name, class_name, section, teacher_username, admin_email, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ success: true });
    });
});


// Assuming an endpoint exists for deleting subjects
router.delete('/delete-assigned-subject/:id', (req, res) => {
    const { id } = req.params;

    const deleteQuery = `
        DELETE FROM subjects WHERE id = ?
    `;
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ success: true });
    });
});







module.exports = router;  

