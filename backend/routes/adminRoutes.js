const express = require('express');
const { createAdminAndSchoolHandler, viewAdminsHandler, updateAdminHandler, deleteAdminHandler } = require('../controllers/superAdminController');
const verifySuperAdminToken = require('../middlewares/superAdminMiddlware'); // Import token verification middleware

const router = express.Router();

// Protected routes with token verification
router.get('/view-admins', verifySuperAdminToken, viewAdminsHandler);
router.post('/create-admin', verifySuperAdminToken, createAdminAndSchoolHandler);
router.put('/update-admin/:id', verifySuperAdminToken, updateAdminHandler);
router.delete('/delete-admin/:id', verifySuperAdminToken, deleteAdminHandler);

module.exports = router;
