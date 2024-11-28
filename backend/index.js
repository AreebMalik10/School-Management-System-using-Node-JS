const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes'); // Import Superadmin Routes
const managingRoutes = require('./routes/managingRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const parentRoutes = require('./routes/parentRoutes');

const app = express();
app.use(cors());


// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/superadmin', superAdminRoutes); // Add Superadmin Routes
app.use('/manageroute', managingRoutes );
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/parent', parentRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
