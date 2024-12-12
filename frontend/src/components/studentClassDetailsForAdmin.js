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
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Student Class Details </h2>

      {/* Displaying error messages */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Displaying class data */}
      {classData && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Class Details:</h3>
          <p><strong>Class Name:</strong> {classData.class_name}</p>
          <p><strong>Class Teacher Username:</strong> {classData.teacher_username}</p>
          <p><strong>Admin Email:</strong> {classData.admin_email}</p>
          <p><strong>Section:</strong> {classData.section}</p>
        </div>
      )}
    </div>
  );
};

export default StudentClassDetails;
