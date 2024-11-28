import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after logout

const AdminDashboard = () => {
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const navigate = useNavigate(); // For redirecting to login page after logout

    // State for forms
    const [studentData, setStudentData] = useState({
        name: '',
        fatherName: '',
        regNo: '',
        contact: '',
        age: '',
        username: '',
        password: ''
    });

    const [teacherData, setTeacherData] = useState({
        name: '',
        contact: '',
        education: '',
        experience: '',
        pay: '',
        username: '',
        password: ''
    });

    const [parentData, setParentData] = useState({
        name: '',
        childrenName: '',
        occupation: '',
        contact: '',
        username: '',
        password: ''
    });

    // Retrieve admin's details from localStorage
    useEffect(() => {
        const name = localStorage.getItem('adminName');
        const email = localStorage.getItem('adminEmail');

        if (name && email) {
            setAdminName(name);
            setAdminEmail(email);
        } else {
            navigate('/adminlogin'); // Redirect to login if not found
        }
    }, [navigate]);

    // Logout function
    const handleLogout = async () => {
        try {
            await axios.post('/api/logout'); // Backend route to invalidate token (optional)
        } catch (error) {
            console.log('Error during logout:', error);
        }

        // Clear the localStorage
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminToken'); // Assuming you're storing the token in localStorage

        // Redirect to login page
        navigate('/adminlogin');
    };

    // Handle form input change
    const handleInputChange = (e, entity) => {
        const { name, value } = e.target;
        if (entity === 'student') {
            setStudentData(prevState => ({ ...prevState, [name]: value }));
        } else if (entity === 'teacher') {
            setTeacherData(prevState => ({ ...prevState, [name]: value }));
        } else if (entity === 'parent') {
            setParentData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    // Handle student submission
    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/manageroute/createStudent', studentData); // Your backend endpoint
            alert('Student created successfully');
            setStudentData({
                name: '',
                fatherName: '',
                regNo: '',
                contact: '',
                age: '',
                username: '',
                password: ''
            });
        } catch (error) {
            console.error('Error creating student:', error);
            alert('Error creating student');
        }
    };

    // Handle teacher submission
    const handleTeacherSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/manageroute/createTeacher', teacherData); // Your backend endpoint
            alert('Teacher created successfully');
            setTeacherData({
                name: '',
                contact: '',
                education: '',
                experience: '',
                pay: '',
                username: '',
                password: ''
            });
        } catch (error) {
            console.error('Error creating teacher:', error);
            alert('Error creating teacher');
        }
    };

    // Handle parent submission
    const handleParentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/manageroute/createParent', parentData); // Your backend endpoint
            alert('Parent created successfully');
            setParentData({
                name: '',
                childrenName: '',
                occupation: '',
                contact: '',
                username: '',
                password: ''
            });
        } catch (error) {
            console.error('Error creating parent:', error);
            alert('Error creating parent');
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Welcome, {adminName}</h2>
            <p>Email: {adminEmail}</p>
            <button onClick={handleLogout}>Logout</button>

            {/* Student Form */}
            <h3>Create Student</h3>
            <form onSubmit={handleStudentSubmit}>
                <input type="text" name="name" value={studentData.name} onChange={(e) => handleInputChange(e, 'student')} placeholder="Student Name" required />
                <input type="text" name="fatherName" value={studentData.fatherName} onChange={(e) => handleInputChange(e, 'student')} placeholder="Father's Name" required />
                <input type="text" name="regNo" value={studentData.regNo} onChange={(e) => handleInputChange(e, 'student')} placeholder="Registration No" required />
                <input type="text" name="contact" value={studentData.contact} onChange={(e) => handleInputChange(e, 'student')} placeholder="Contact" required />
                <input type="number" name="age" value={studentData.age} onChange={(e) => handleInputChange(e, 'student')} placeholder="Age" required />
                <input type="text" name="username" value={studentData.username} onChange={(e) => handleInputChange(e, 'student')} placeholder="Username" required />
                <input type="password" name="password" value={studentData.password} onChange={(e) => handleInputChange(e, 'student')} placeholder="Password" required />
                <button type="submit">Create Student</button>
            </form>

            {/* Teacher Form */}
            <h3>Create Teacher</h3>
            <form onSubmit={handleTeacherSubmit}>
                <input type="text" name="name" value={teacherData.name} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Teacher Name" required />
                <input type="text" name="contact" value={teacherData.contact} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Contact" required />
                <input type="text" name="education" value={teacherData.education} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Education" required />
                <input type="text" name="experience" value={teacherData.experience} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Experience" required />
                <input type="number" name="pay" value={teacherData.pay} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Pay" required />
                <input type="text" name="username" value={teacherData.username} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Username" required />
                <input type="password" name="password" value={teacherData.password} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Password" required />
                <button type="submit">Create Teacher</button>
            </form>

            {/* Parent Form */}
            <h3>Create Parent</h3>
            <form onSubmit={handleParentSubmit}>
                <input type="text" name="name" value={parentData.name} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Parent Name" required />
                <input type="text" name="childrenName" value={parentData.childrenName} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Children Name" required />
                <input type="text" name="occupation" value={parentData.occupation} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Occupation" required />
                <input type="text" name="contact" value={parentData.contact} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Contact" required />
                <input type="text" name="username" value={parentData.username} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Username" required />
                <input type="password" name="password" value={parentData.password} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Password" required />
                <button type="submit">Create Parent</button>
            </form>
        </div>
    );
};

export default AdminDashboard;
