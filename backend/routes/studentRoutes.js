const express = require('express');
const { login } = require('../controllers/authControllerstp');
const verifyToken = require('../middlewares/verifyToken');
const db = require('../config/db');
const router = express.Router();

router.post('/login', login);
router.get('/protected', verifyToken('student'), (req, res) => {
    res.json({ message: 'Student route accessed', user: req.user });
});

//student ka my profile wala data la rha 
router.get('/getstudentdata/:username', (req, res)=>{
    const {username} = req.params;

    const query = 'SELECT * FROM students WHERE username = ?';

    db.query(query, [username], (err, results) =>{
        if(err) {
            console.error('Error Executing query:', err);
            return res.status(500).json({ message: 'Server Error', error: err});
        }

        if(results.length === 0){
            return res.status(404).json({message: 'Student not found'})
        }

        res.json(results[0]);
    })

})


//student ki class ki details la rahay
router.post('/getStudentClassData', (req, res) => {
    const { username } = req.body; // Frontend se username receive ho raha hai

    // Agar username nahi hai toh error send karo
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Step 1: Students table se class_id fetch karna
    const getClassIdQuery = 'SELECT class_id FROM students WHERE username = ?';

    db.query(getClassIdQuery, [username], (err, classIdResults) => {
        if (err) {
            console.error('Error fetching class_id:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Agar class_id nahi mila
        if (classIdResults.length === 0 || !classIdResults[0].class_id) {
            return res.status(404).json({ message: 'No class data found for this username' });
        }

        const classId = classIdResults[0].class_id;

        // Step 2: Classes table se class data fetch karna using class_id
        const getClassDataQuery = 'SELECT * FROM classes WHERE id = ?';

        db.query(getClassDataQuery, [classId], (err, classDataResults) => {
            if (err) {
                console.error('Error fetching class data:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Agar class data nahi mila
            if (classDataResults.length === 0) {
                return res.status(404).json({ message: 'No class data found for this class_id' });
            }

            // Response me class data send karo
            res.json(classDataResults[0]);
        });
    });
});

//student ki subject details ko la rahay hen
router.get('/getStudentClassId/:username', (req, res) =>{
    const { username } = req.params;

    if(!username) {
        return res.status(400).json({ error: 'username is required '});
    }

    //Query to get student details including class_id
    const query = 'SELECT class_id FROM students WHERE username = ? ';
    db.query(query, [username], (err, results) =>{
        if(err) {
            console.error("Error fetching student data:", err.message);
            return res.status(500).json({ error: 'Internal Server Error'});
        }

        if (results.length === 0){
            return res.status(404).json({ message:'No student found with that username '});
        }

        res.json(results[0]);
    })

})

router.get ('/getSubjectByClassId/:class_id', (req, res) =>{
    const {class_id} = req.params;

    if(!class_id) {
        return res.status(400).json({ error: "class_id is required" });
    }

    const query = ` 
    SELECT subjects.*, students.name as student_name
    FROM subjects
    JOIN students ON students.class_id = subjects.class_id
    WHERE students.username = ?;
    `;

    db.query(query, [class_id], (err, results) =>{
        if (err) {
            console.error('Error fetching Subjects:', err.message);
            return res.status(500).json({ error: 'Internal Server Error'});
        }

        if (results.length === 0) {
            return res.status(404).json({message: 'No subjects found for thi class_id'});
        }

        res.json(results);
    })
})


// Get Challan by Student Username
router.get('/getChallanByUsername', (req, res) => {
    const { username } = req.query;  // Get username from query parameters

    if (!username) {
        return res.status(400).send('Username is required');
    }

    const getChallanQuery = 'SELECT * FROM challans WHERE username = ?';

    db.query(getChallanQuery, [username], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error while fetching challan');
        }

        if (result.length === 0) {
            return res.status(404).send('No challan found for this username');
        }

        res.status(200).json(result);  // Send the fetched challan data as JSON
    });
});


//Student create leave request 
router.post('/create-leave-request', (req, res) => {
    const { reason, startDate, endDate, classTeacherUsername, class_name, section, username: studentUsername } = req.body; // Get username from request body

    // Step 1: Fetch studentId from students table using student_username
    db.query("SELECT student_id FROM students WHERE username = ?", [studentUsername], (err, student) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database Error" });
        }

        if (student.length === 0) {
            return res.status(400).json({ message: "Student not found" });
        }

        const studentId = student[0].student_id;

        // Step 2: Fetch the classTeacherId using classTeacherUsername from the teachers table
        db.query("SELECT id FROM teachers WHERE username = ?", [classTeacherUsername], (err, teacher) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database Error" });
            }

            if (teacher.length === 0) {
                return res.status(400).json({ message: "Class Teacher not found" });
            }

            const classTeacherId = teacher[0].id;

            // Step 3: Insert the leave request into student_leaves table
            db.query(
                "INSERT INTO student_leaves (studentId, student_username, classTeacherUsername, classTeacherId, reason, startDate, endDate, class_name, section) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [studentId, studentUsername, classTeacherUsername, classTeacherId, reason, startDate, endDate, class_name, section],
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Database Error" });
                    }

                    res.status(200).json({ message: "Leave request created successfully" });
                }
            );
        });
    });
});

router.get('/get-leave-request-by-student', (req, res) =>{
    const {username} =req.query;

    db.query("SELECT * FROM student_leaves WHERE student_username = ?", [username], (err, results)=>{
        if(err){
            console.error(err);
            return res.status(500).json({message: "No leave request found" });
        }

        res.status(200).json({ leaveRequests: results });
    })

})




module.exports = router;
