import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const StudentSubjects = () => {
    
  const [classId, setClassId] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const { name, username } = useLocation().state || {}; // Get the name and username from location state


  // Fetch class_id based on username
  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:5000/student/getStudentClassId/${username}`)
        .then((response) => {
          setClassId(response.data.class_id);
        })
        .catch((err) => {
          setError('Error fetching class_id: ' + err.message);
        });
    }
  }, [username]);

  // Fetch subjects based on class_id
  useEffect(() => {
    if (classId) {
      axios
        .get(`http://localhost:5000/student/getSubjectByClassId/${username}`)
        .then((response) => {
          setSubjects(response.data);
        })
        .catch((err) => {
          setError('Error fetching subjects: ' + err.message);
        });
    }
  }, [classId]);

  return (
    <div className="container mx-auto p-4 bg-gray-100 ">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Subjects</h1>
  
    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
  
    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Subjects for Class ID: <span className="text-blue-500">{classId}</span></h2>
  
    {subjects.length === 0 ? (
      <p className="text-center text-gray-600">No subjects found for this class.</p>
    ) : (
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white table-auto rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="px-6 py-3">Subject Name</th>
              <th className="px-6 py-3">Class Name</th>
              <th className="px-6 py-3">Section</th>
              <th className="px-6 py-3">Teacher</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{subject.subject_name}</td>
                <td className="px-6 py-4">{subject.class_name}</td>
                <td className="px-6 py-4">{subject.section}</td>
                <td className="px-6 py-4">{subject.teacher_username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  
  );
};

export default StudentSubjects;
