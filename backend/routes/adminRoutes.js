// routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/admincontroller');
const { verifyToken } = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/create-admin', adminController.createAdmin);
router.get('/view-admins', verifyToken, admincontroller.viewAdmins);
router.put('/update-admin/:id', verifyToken, admincontroller.updateAdmin);
router.delete('/delete-admin/:id', verifyToken, admincontroller.deleteAdmin);

module.exports = router;
