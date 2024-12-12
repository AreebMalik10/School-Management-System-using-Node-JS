import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const StudentClassDetails = () => {
  const location = useLocation();
  const { username } = location.state || {}; // Get the username from location.state
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username) {
      fetchClassDetails(username); // Automatically fetch data using the username from state
    } else {
      setError('Username not found in session.');
    }
  }, [username]);

  const fetchClassDetails = async (sessionUsername) => {
    setError('');
    setClassData(null);

    try {
      const response = await axios.post('http://localhost:5000/student/getStudentClassData', {
        username: sessionUsername,
      });
      setClassData(response.data);
    } catch (err) {
      if (err.response) {
        // If backend sends an error response
        setError(err.response.data.message || 'Error fetching data');
      } else {
        // If there is a network or other issue
        setError('Unable to fetch data. Please try again.');
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg mt-20 mb-20">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Student Class Details</h2>

      {/* Displaying error messages */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Displaying class data */}
      {classData && (
        <div className="mt-6 p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Class Details:</h3>
          <p className="text-lg text-gray-600"><strong>Class Name:</strong> {classData.class_name}</p>
          <p className="text-lg text-gray-600"><strong>Class Teacher Username:</strong> {classData.teacher_username}</p>
          <p className="text-lg text-gray-600"><strong>Admin Email:</strong> {classData.admin_email}</p>
          <p className="text-lg text-gray-600"><strong>Section:</strong> {classData.section}</p>
        </div>
      )}
    </div>

  );
};

export default StudentClassDetails;
