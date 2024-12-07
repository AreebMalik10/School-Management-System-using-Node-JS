import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminAssignTeacherToClass = () => {
    const [teacherUsername, setTeacherUsername] = useState('');
    const [className, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [message, setMessage] = useState('');

    const handleAssignClass = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!teacherUsername || !className || !section) {
            setMessage('All fields are required.');
            return;
        }

        try {
            // API call to assign class
            const response = await axios.post('http://localhost:5000/admin1/assignclass', {
                teacher_username: teacherUsername,
                class_name: className,
                section,
            });

            // Handle response
            setMessage(response.data.message); // Show success message
        } catch (error) {
            // Handle error
            if (error.response) {
                setMessage(error.response.data.message); // Show error message from API
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="assign-class-container">
            <h2>Assign Class to Teacher</h2>
            <form onSubmit={handleAssignClass}>
                <div className="form-group">
                    <label htmlFor="teacherUsername">Teacher Username</label>
                    <input
                        type="text"
                        id="teacherUsername"
                        value={teacherUsername}
                        onChange={(e) => setTeacherUsername(e.target.value)}
                        placeholder="Enter teacher's username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="className">Class Name</label>
                    <input
                        type="text"
                        id="className"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="Enter class name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="section">Section</label>
                    <input
                        type="text"
                        id="section"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="Enter class section"
                    />
                </div>
                <button type="submit">Assign Class</button>
            </form>

            {message && <p>{message}</p>} {/* Display success or error message */}
        </div>
    );
};
export default AdminAssignTeacherToClass;
