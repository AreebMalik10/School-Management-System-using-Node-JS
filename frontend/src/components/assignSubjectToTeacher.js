import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after logout


const AssignSubjectToTeacher = () => {
    const [subject_name, setSubjectName] = useState('');
    const [class_name, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [teacher_username, setTeacherUsername] = useState('');
    const [admin_email, setAdminEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // For redirecting to login page after logout


    // Fetch admin details from localStorage
    useEffect(() => {
        const name = localStorage.getItem('adminName');
        const email = localStorage.getItem('adminEmail');

        if (name && email) {
            setAdminEmail(email); // Admin email will be fetched from localStorage
        } else {
            // If admin details not found, redirect to login
            navigate('/adminlogin');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            subject_name,
            class_name,
            section,
            teacher_username,
            admin_email
        };

        try {
            // Sending the form data to backend
            const response = await axios.post('http://localhost:5000/admin1/assign-subject', formData);
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response.data.error || 'Something went wrong!');
            setMessage('');
        }
    };

    return (
        <div className="assign-subject-form">
            <h2>Assign Teacher to Subject</h2>

            {/* Display success or error message */}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Subject Name</label>
                    <input 
                        type="text" 
                        value={subject_name} 
                        onChange={(e) => setSubjectName(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Class Name</label>
                    <input 
                        type="text" 
                        value={class_name} 
                        onChange={(e) => setClassName(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Section</label>
                    <input 
                        type="number" 
                        value={section} 
                        onChange={(e) => setSection(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Teacher Username</label>
                    <input 
                        type="text" 
                        value={teacher_username} 
                        onChange={(e) => setTeacherUsername(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit">Assign Teacher</button>
            </form>
        </div>
    );
};
export default AssignSubjectToTeacher;
