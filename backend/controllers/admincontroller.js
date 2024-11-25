// controllers/adminController.js
const bcrypt = require('bcryptjs');
const db = require('./db');

module.exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const [existingAdmin] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }

        await db.promise().query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        res.status(201).json({ message: 'Admin created successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports.viewAdmins = async (req, res) => {
    try {
        const [admins] = await db.promise().query('SELECT * FROM admins');
        res.status(200).json({ admins });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports.updateAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        let query = 'UPDATE admins SET ';
        let queryParams = [];

        if (name) {
            query += 'name = ?, ';
            queryParams.push(name);
        }

        if (email) {
            query += 'email = ?, ';
            queryParams.push(email);
        }

        if (password) {
            query += 'password = ?, ';
            queryParams.push(hashedPassword);
        }

        query = query.slice(0, -2);
        query += ' WHERE id = ?';
        queryParams.push(id);

        await db.promise().query(query, queryParams);

        res.status(200).json({ message: 'Admin updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports.deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        await db.promise().query('DELETE FROM admins WHERE id = ?', [id]);
        res.status(200).json({ message: 'Admin deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
};
