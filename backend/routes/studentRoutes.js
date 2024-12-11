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
router.get('/getstudentdata1/:username', (req, res) => {
    const username = req.params.username;
    Student.findOne({ username: username })
        .then(student => {
            if (!student) {
                return res.status(404).json({ error: 'Student data not found' });
            }
            res.json(student);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
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
