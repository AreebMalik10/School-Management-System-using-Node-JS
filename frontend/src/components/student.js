import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import StudentViewHisChallan from './studentViewHisChallan';
import StudentClassDetails from './studentClassDetailsForAdmin';
import StudentSubjects from './studentSubjects';
import StudentLeaveRequest from './studentLeaveRequest';
import StudentViewLeaveRequest from './studentViewLeaveRequest';

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

    const [activeSection, setActiveSection] = useState('');

    const handleSectionChange = (section) => {
      setActiveSection(section);
    };




    return (
        <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white shadow-md py-4 px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <p className="text-lg">
              <span className="font-medium">{name}</span>
            </p>
            <p className="text-lg">
              <span className="font-medium">{username}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>
  
        {/* Main Content */}
        <div className="max-w-5xl mx-auto py-6 px-4">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-800 text-center">
            Welcome, {name}!
          </h1>
  
          {/* Buttons for Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleSectionChange('profile')}
              className={`py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 ${
                activeSection === 'profile' ? 'ring-2 ring-blue-300' : ''
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => handleSectionChange('challan')}
              className={`py-2 px-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 ${
                activeSection === 'challan' ? 'ring-2 ring-green-300' : ''
              }`}
            >
              View Challan
            </button>
            <button
              onClick={() => handleSectionChange('classDetails')}
              className={`py-2 px-4 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 ${
                activeSection === 'classDetails' ? 'ring-2 ring-purple-300' : ''
              }`}
            >
              Class Details
            </button>
            <button
              onClick={() => handleSectionChange('subjects')}
              className={`py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 ${
                activeSection === 'subjects' ? 'ring-2 ring-yellow-300' : ''
              }`}
            >
              Subjects
            </button>
            <button
              onClick={() => handleSectionChange('leaveRequest')}
              className={`py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 ${
                activeSection === 'leaveRequest' ? 'ring-2 ring-red-300' : ''
              }`}
            >
              Leave Request
            </button>
            <button
              onClick={() => handleSectionChange('viewLeaveRequest')}
              className={`py-2 px-4 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 ${
                activeSection === 'viewLeaveRequest' ? 'ring-2 ring-indigo-300' : ''
              }`}
            >
              View Leave Requests
            </button>
          </div>
  
          {/* Section Content */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {activeSection === 'profile' && (
              <div>
                <h1 className="text-3xl font-bold mb-4">My Profile</h1>
                {/* Profile details */}
                {studentData ? (
                  <div>
                    {/* Profile Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <p className="font-medium">Username:</p>
                      <p>{studentData.username}</p>
                      <p className="font-medium">Student ID:</p>
                      <p>{studentData.student_id}</p>
                      <p className="font-medium">Father's Name:</p>
                      <p>{studentData.fatherName}</p>
                      <p className="font-medium">Student Username:</p>
                      <p>{studentData.username}</p>
                      <p className='font-medium'>Student Registration Number:</p>
                      <p>{studentData.regNo}</p>
                      <p className='font-medium'>Student Class:</p>
                      <p>{studentData.class}</p>
                      <p className='font-medium'>Student Section:</p>
                      <p>{studentData.section}</p>

                      {/* More details */}
                    </div>
                  </div>
                ) : (
                  <p>Loading profile data...</p>
                )}
              </div>
            )}
            {activeSection === 'challan' && <StudentViewHisChallan />}
            {activeSection === 'classDetails' && <StudentClassDetails />}
            {activeSection === 'subjects' && <StudentSubjects />}
            {activeSection === 'leaveRequest' && <StudentLeaveRequest />}
            {activeSection === 'viewLeaveRequest' && <StudentViewLeaveRequest />}
          </div>
        </div>
      </div>
    );
}
