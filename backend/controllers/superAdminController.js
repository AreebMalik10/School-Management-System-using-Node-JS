const db = require('../config/db');
const bcrypt = require('bcryptjs');


// Create Admin Handler 
exports.createAdminAndSchoolHandler = async (req, res) => {
    try {
        const { name, email, password, school_name, school_address, school_phone, principal_name, grades_offered, school_registration_no } = req.body;

        // Start a transaction to ensure data integrity
        await db.promise().beginTransaction();

        // Insert school into the database
        const schoolQuery = `
            INSERT INTO school (school_name, school_address, school_phone, principal_name, grades_offered, school_registration_no)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [schoolResult] = await db.promise().query(schoolQuery, [
            school_name,
            school_address,
            school_phone,
            principal_name,
            grades_offered,
            school_registration_no,
        ]);
        const school_id = schoolResult.insertId;

        // Hash the admin's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin into the database, linked to the school
        const adminQuery = `
            INSERT INTO admins (name, email, password, school_id)
            VALUES (?, ?, ?, ?)
        `;
        await db.promise().query(adminQuery, [name, email, hashedPassword, school_id]);

        // Commit the transaction
        await db.promise().commit();

        res.status(201).json({ message: 'Admin and School created successfully', school_id });
    } catch (err) {
        console.error('Error creating admin and school:', err);

        // Rollback the transaction in case of an error
        await db.promise().rollback();
        res.status(500).json({ message: 'Error creating admin and school' });
    }
};



// View Admins Handler
exports.viewAdminsHandler = async (req, res) => {
    try {
        const [admins] = await db.promise().query(`SELECT id, name, email FROM admins`);
        res.status(200).json({ admins });
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json({ message: 'Error fetching admins' });
    }
};

// Update Admin Handler
exports.updateAdminHandler = (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const findAdminQuery = 'SELECT * FROM admins WHERE id = ?';
    db.query(findAdminQuery, [id], (err, results) => {
        if (err) {
            console.error('Error finding admin:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const updateAdminQuery = 'UPDATE admins SET name = ?, email = ?, password = ? WHERE id = ?';
        db.query(updateAdminQuery, [name, email, password, id], (err, results) => {
            if (err) {
                console.error('Error updating admin:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            return res.status(200).json({ message: 'Admin updated successfully' });
        });
    });
};

// Delete Admin Handler
exports.deleteAdminHandler = (req, res) => {
    const { id } = req.params;

    const findAdminQuery = 'SELECT * FROM admins WHERE id = ?';
    db.query(findAdminQuery, [id], (err, results) => {
        if (err) {
            console.error('Error finding admin:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const deleteAdminQuery = 'DELETE FROM admins WHERE id = ?';
        db.query(deleteAdminQuery, [id], (err, results) => {
            if (err) {
                console.error('Error deleting admin:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            return res.status(200).json({ message: 'Admin deleted successfully' });
        });
    });
};
