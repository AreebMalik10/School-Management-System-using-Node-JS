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

//student ki class or subjects ki details la rahay
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


module.exports = router;
