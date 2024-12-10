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
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Assign Teacher to Subject</h2>

            {/* Success/Error Messages */}
            {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Subject Name */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Subject Name</label>
                    <input
                        type="text"
                        value={subject_name}
                        onChange={(e) => setSubjectName(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Subject Name"
                    />
                </div>

                {/* Class Name */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Class Name</label>
                    <input
                        type="text"
                        value={class_name}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Class Name"
                    />
                </div>

                {/* Section */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Section</label>
                    <input
                        type="number"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Section"
                    />
                </div>

                {/* Teacher Username */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Teacher Username</label>
                    <input
                        type="text"
                        value={teacher_username}
                        onChange={(e) => setTeacherUsername(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Teacher Username"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                >
                    Assign Teacher
                </button>
            </form>
        </div>

    );
};
export default AssignSubjectToTeacher;
