import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import StudentViewHisChallan from './studentViewHisChallan';
import StudentClassDetails from './studentClassDetailsForAdmin';

export default function Student() {
    const location = useLocation();
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(null);


    const { name, username } = useLocation().state || {}; // Get the name and username from location state

    useEffect(() => {
        // Check if token is available in localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            // If no token, redirect to login page
            navigate('/');
        }

    }, [navigate]);

    useEffect(() => {
        if (username) {
            axios.get(`http://localhost:5000/student/getstudentdata/${username}`)
                .then(response => {
                    setStudentData(response.data);
                    setError(null);
                })
                .catch(err => {
                    setError('Student Data not Found or error fetching data');
                    console.error(err);
                });
        } else {
            setError('No Username Found');
        }
    }, [username]);

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/');
    };




    return (
        <div className="flex flex-col items-left justify-center min-h-screen bg-gray-100">
            <div className="text-left">
                <h1>Welcome to the Student Dashboard</h1>
                <h1 className="text-3xl font-bold mb-4">Welcome, {name}!</h1>
                <p className="text-xl">Username: {username}</p>
                <button
                    onClick={handleLogout}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-3xl mx-auto p-6 items-left bg-white rounded-lg shadow-md">
                <h1 className='text-5xl font-semibold text-gray-800 mb-4 mt-4'>My Profile</h1>
                {/* Show student name and username */}
                {studentData ? (
                    <div>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, {studentData.name}!</h2>

                        {/* Student Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <p className="text-lg font-medium text-gray-700">Username:</p>
                            <p className="text-lg text-gray-600">{studentData.username}</p>

                            <p className="text-lg font-medium text-gray-700">Student ID:</p>
                            <p className="text-lg text-gray-600">{studentData.student_id}</p>

                            <p className="text-lg font-medium text-gray-700">Father's Name:</p>
                            <p className="text-lg text-gray-600">{studentData.fatherName}</p>

                            <p className="text-lg font-medium text-gray-700">Reg. No:</p>
                            <p className="text-lg text-gray-600">{studentData.regNo}</p>

                            <p className="text-lg font-medium text-gray-700">Contact:</p>
                            <p className="text-lg text-gray-600">{studentData.contact}</p>

                            <p className="text-lg font-medium text-gray-700">Age:</p>
                            <p className="text-lg text-gray-600">{studentData.age}</p>

                            <p className="text-lg font-medium text-gray-700">Class:</p>
                            <p className="text-lg text-gray-600">{studentData.class}</p>

                            <p className="text-lg font-medium text-gray-700">Section:</p>
                            <p className="text-lg text-gray-600">{studentData.section}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-xl text-red-500">{error || 'Loading student data...'}</p>
                )}
            </div>



            <div>

                <StudentViewHisChallan />
            </div>

            <div>
                <StudentClassDetails/>

            </div>

         
        </div>
    );
}
