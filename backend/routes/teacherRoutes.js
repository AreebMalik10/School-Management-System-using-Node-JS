const express = require('express');
const { login } = require('../controllers/authControllerstp');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/login', login);
router.get('/protected', verifyToken('teacher'), (req, res) => {
    res.json({ message: 'Teacher route accessed', user: req.user });
});

module.exports = router;
