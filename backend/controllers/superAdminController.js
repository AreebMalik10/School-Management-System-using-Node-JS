const db = require('../config/db');

// Create Admin Handler
exports.createAdminHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const query = `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`;
        await db.promise().query(query, [name, email, password]); // Query with parameters
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ message: 'Error creating admin' });
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
