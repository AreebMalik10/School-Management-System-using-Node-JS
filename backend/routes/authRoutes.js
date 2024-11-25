// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authcontroller');

const router = express.Router();

router.post('/login', authcontroller.login);

module.exports = router;
