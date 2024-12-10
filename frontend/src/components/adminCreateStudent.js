import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminCreateStudent = () => {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [students, setStudents] = useState([]); // State for fetched students
    const [isUpdating, setIsUpdating] = useState(false);
    const [studentIdToUpdate, setStudentIdToUpdate] = useState(null);
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

    // Validate admin login and set admin details
    useEffect(() => {
        const name = localStorage.getItem('adminName');
        const email = localStorage.getItem('adminEmail');
        if (name && email) {
            setAdminName(name);
            setAdminEmail(email);
        } else {
            navigate('/adminlogin');
        }
    }, [navigate]);

    // Fetch student list for the admin
    useEffect(() => {
        const adminId = localStorage.getItem('adminId');
        if (!adminId) {
            alert('Admin ID not found. Please log in again.');
            navigate('/adminlogin');
            return;
        }

        axios.get(`http://localhost:5000/manageroute/getStudents?adminId=${adminId}`)
            .then(response => setStudents(response.data))
            .catch(error => console.error('Error fetching students:', error));
    }, [navigate]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudentData({ ...studentData, [name]: value });
    };

    // Submit new student data
    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        const adminId = localStorage.getItem('adminId');
        if (!adminId) {
            alert('Admin ID not found. Please log in again.');
            navigate('/adminlogin');
            return;
        }

        const payload = { ...studentData, adminId };

        try {
            const response = await axios.post('http://localhost:5000/manageroute/createStudent', payload);
            alert(response.data.message);
            setStudents([...students, response.data.student]); // Add new student to list
            resetForm();
        } catch (error) {
            console.error('Error creating student:', error.response?.data || error);
            alert(error.response?.data?.message || 'Error creating student');
        }
    };

    // Reset the student form
    const resetForm = () => {
        setStudentData({
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
        setIsUpdating(false);
        setStudentIdToUpdate(null);
    };

    // Update existing student data
    const handleStudentUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/manageroute/updateStudent/${studentIdToUpdate}`, studentData);
            alert(response.data.message);
            setStudents(students.map((student) =>
                student.studentId === studentIdToUpdate ? { ...student, ...studentData } : student
            ));
            resetForm();
        } catch (error) {
            console.error('Error updating student:', error.response?.data || error);
            alert(error.response?.data?.message || 'Error updating student');
        }
    };

    // Handle student delete
    const handleDelete = async (studentId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/manageroute/deleteStudent/${studentId}`);
            alert(response.data.message);
            setStudents(students.filter((student) => student.studentId !== studentId));
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Error deleting student');
        }
    };

    // Populate the form for updating
    const handleUpdateClick = (student) => {
        setStudentData(student);
        setStudentIdToUpdate(student.studentId);
        setIsUpdating(true);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <h3 className="text-2xl font-bold text-gray-700 mb-6">
            {isUpdating ? 'Update Student' : 'Create Student'}
        </h3>
        <form
            onSubmit={isUpdating ? handleStudentUpdate : handleStudentSubmit}
            className="space-y-4"
        >
            {['name', 'fatherName', 'regNo', 'contact', 'age', 'username', 'password', 'class', 'section'].map((field) => (
                <div key={field}>
                    <label
                        className="block text-sm font-medium text-gray-600 mb-1 capitalize"
                        htmlFor={field}
                    >
                        {field.replace(/^\w/, (c) => c.toUpperCase())}
                    </label>
                    <input
                        type={field === 'age' ? 'number' : field === 'password' ? 'password' : 'text'}
                        name={field}
                        id={field}
                        value={studentData[field]}
                        onChange={handleInputChange}
                        placeholder={`Enter ${field}`}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            ))}
            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    {isUpdating ? 'Update' : 'Create'}
                </button>
                {isUpdating && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    
        <h4 className="text-xl font-semibold text-gray-700 mt-8 mb-4">List of Students</h4>
        {students.length > 0 ? (
            <div className="space-y-4">
                {students.map((student) => (
                    <div
                        key={student.studentId}
                        className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                    >
                        <p>
                            <span className="font-semibold">Name:</span> {student.name}
                        </p>
                        <p>
                            <span className="font-semibold">Father's Name:</span> {student.fatherName}
                        </p>
                        <p>
                            <span className="font-semibold">Registration No:</span> {student.regNo}
                        </p>
                        <p>
                            <span className="font-semibold">Contact:</span> {student.contact}
                        </p>
                        <p>
                            <span className="font-semibold">Age:</span> {student.age}
                        </p>
                        <p>
                            <span className="font-semibold">Username:</span> {student.username}
                        </p>
                        <p>
                            <span className="font-semibold">Class:</span> {student.class}
                        </p>
                        <p>
                            <span className="font-semibold">Section:</span> {student.section}
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={() => handleUpdateClick(student)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(student.studentId)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-600">No students found</p>
        )}
    </div>
    
    );
};

export default AdminCreateStudent;
