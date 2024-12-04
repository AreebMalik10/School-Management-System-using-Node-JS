const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import your DB connection

const router = express.Router();

// Superadmin Login Route
router.post('/salogin', (req, res) => {
    const { email, password } = req.body;

    // Check if superadmin exists in the database
    const query = 'SELECT * FROM super_admins WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Superadmin not found.' });
        }

        const superadmin = results[0];

        // Verify password (plain-text check since bcrypt is not used)
        if (password !== superadmin.password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: superadmin.id, role: 'superadmin' },
            process.env.JWT_SUPERADMIN_SECRET, // Use Superadmin secret
            { expiresIn: '1h' }
        );
        

        res.status(200).json({ message: 'Login successful.', token });
    });
});

router.get('/schools', async (req, res) => {
    try {
      // Query to fetch all admins and their associated schools
      const query = `
        SELECT a.id as admin_id, a.name as admin_name, a.email as admin_email,
               s.school_id, s.school_name, s.school_address, s.school_phone, s.principal_name, s.grades_offered, s.school_registration_no
        FROM admins a
        LEFT JOIN school s ON a.school_id = s.school_id
      `;
      
      // Execute the query
      const [rows] = await db.promise().query(query);
      
      // Prepare the data
      const admins = rows.map(row => ({
        id: row.admin_id,
        name: row.admin_name,
        email: row.admin_email,
        school: {
          school_id: row.school_id,
          school_name: row.school_name,
          school_address: row.school_address,
          school_phone: row.school_phone,
          principal_name: row.principal_name,
          grades_offered: row.grades_offered,
          school_registration_no: row.school_registration_no,
        }
      }));
  
      // Return the data as JSON
      res.status(200).json({ admins });
  
    } catch (err) {
      console.error('Error fetching admins and schools:', err);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });
  




  


  

module.exports = router;
