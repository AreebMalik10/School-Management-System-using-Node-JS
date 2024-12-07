import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminCreateStudent = () => {
    const navigate = useNavigate(); // Move this to the top

    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    
    const [studentData, setStudentData] = useState({
        name: '',
        fatherName: '',
        regNo: '',
        contact: '',
        age: '',
        username: '',
        password: '',
        class: '',
        section: ''
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
    }, [navigate]); // Make sure `navigate` is part of the dependency array

    // Handle input changes for student data
    const handleInputChange = (e, field) => {
        setStudentData({
            ...studentData,
            [field]: e.target.value
        });
    };

    // Handle student submission
    const handleStudentSubmit = async (e) => {
        e.preventDefault();

        const adminId = localStorage.getItem('adminId'); // Admin ID from localStorage

        if (!adminId) {
            alert('Admin ID not found. Please log in again.');
            navigate('/adminlogin');
            return;
        }

        const studentDataWithAdminId = {
            ...studentData,
            adminId,
            class: studentData.class, // Add class
            section: studentData.section // Add section
        };

        try {
            // Make the POST request to create the student
            const response = await axios.post('http://localhost:5000/manageroute/createStudent', studentDataWithAdminId);
            alert('Student created successfully');

            // Reset the form after successful submission
            setStudentData({
                name: '',
                fatherName: '',
                regNo: '',
                contact: '',
                age: '',
                username: '',
                password: '',
                class: '',  // Reset class
                section: '' // Reset section
            });
        } catch (error) {
            console.error('Error creating student:', error);
            alert('Error creating student');
        }
    };

    return (
        <div>
            <h3>Create Student</h3>
            <form onSubmit={handleStudentSubmit}>
                <input 
                    type="text" 
                    name="name" 
                    value={studentData.name} 
                    onChange={(e) => handleInputChange(e, 'name')} 
                    placeholder="Student Name" 
                    required 
                />
                <input 
                    type="text" 
                    name="fatherName" 
                    value={studentData.fatherName} 
                    onChange={(e) => handleInputChange(e, 'fatherName')} 
                    placeholder="Father's Name" 
                    required 
                />
                <input 
                    type="text" 
                    name="regNo" 
                    value={studentData.regNo} 
                    onChange={(e) => handleInputChange(e, 'regNo')} 
                    placeholder="Registration No" 
                    required 
                />
                <input 
                    type="text" 
                    name="contact" 
                    value={studentData.contact} 
                    onChange={(e) => handleInputChange(e, 'contact')} 
                    placeholder="Contact" 
                    required 
                />
                <input 
                    type="number" 
                    name="age" 
                    value={studentData.age} 
                    onChange={(e) => handleInputChange(e, 'age')} 
                    placeholder="Age" 
                    required 
                />
                <input 
                    type="text" 
                    name="username" 
                    value={studentData.username} 
                    onChange={(e) => handleInputChange(e, 'username')} 
                    placeholder="Username" 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    value={studentData.password} 
                    onChange={(e) => handleInputChange(e, 'password')} 
                    placeholder="Password" 
                    required 
                />
                <input 
                    type="text" 
                    name="class" 
                    value={studentData.class} 
                    onChange={(e) => handleInputChange(e, 'class')} 
                    placeholder="Class" 
                    required 
                />
                <input 
                    type="text" 
                    name="section" 
                    value={studentData.section} 
                    onChange={(e) => handleInputChange(e, 'section')} 
                    placeholder="Section" 
                    required 
                />
                <button type="submit">Create Student</button>
            </form>
        </div>
    );
};

export default AdminCreateStudent;
