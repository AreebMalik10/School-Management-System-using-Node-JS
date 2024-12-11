import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";


export default function TeacherFetchStudent() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    
    // Location state se teacher ka username fetch kar rahe hain
    const location = useLocation();
    const { username } = location.state || {};  // Agar location.state nahi hai toh undefined nahi aayega

    useEffect(() => {
        // Agar teacher ka username available hai, toh students ko fetch karein
        if (username) {
            fetchStudents(username);
        } else {
            setError('Teacher username not available');
        }
    }, [username]);

    // Function to fetch students based on teacher's username
    const fetchStudents = (teacherUsername) => {
        axios.post('http://localhost:5000/teacher/getStudentsByTeacher', { username: teacherUsername })
            .then(response => {
                setStudents(response.data.students);
                setError('');
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Something went wrong');
                setStudents([]);
            });
    };

    return (
        <div className="container mx-auto p-4">
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Students for Teacher: <span className="text-blue-500">{username}</span></h2>

        {/* Display error message if any */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Display students */}
        {students.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Registration No.</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Student Username</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Class</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Section</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-4 py-2 text-sm text-gray-700">{student.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{student.regNo}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{student.username}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{student.class}</td>
                                <td className="px-4 py-2 text-sm text-gray-700">{student.section}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="mt-4 text-gray-600">No students found for this teacher.</p>
        )}
    </div>
    );
};
