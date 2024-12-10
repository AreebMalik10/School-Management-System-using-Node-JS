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
// Student route: Fetch student data along with class and subject information
router.get('/getstudentdata1/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Fetch student data
        const student = await Student.findOne({ username }).exec();
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Fetch class data using class_id
        const classData = await Class.findById(student.class_id).exec();

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Fetch subjects data using class_id
        const subjects = await Subject.find({ class_id: student.class_id }).exec();

        // Send all the data together
        res.json({
            student,
            classData,
            subjects
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching student data' });
    }
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
