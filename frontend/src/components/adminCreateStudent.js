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
        <div>
            <h3>{isUpdating ? 'Update Student' : 'Create Student'}</h3>
            <form onSubmit={isUpdating ? handleStudentUpdate : handleStudentSubmit}>
                {['name', 'fatherName', 'regNo', 'contact', 'age', 'username', 'password', 'class', 'section'].map((field) => (
                    <input
                        key={field}
                        type={field === 'age' ? 'number' : field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={studentData[field]}
                        onChange={handleInputChange}
                        placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                        required
                    />
                ))}
                <button type="submit">{isUpdating ? 'Update' : 'Create'}</button>
                {isUpdating && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>

            <h4>List of Students</h4>
            {students.length > 0 ? (
                students.map((student) => (
                    <div key={student.studentId}>
                        <p>Name: {student.name}</p>
                        <p>Father's Name: {student.fatherName}</p>
                        <p>Registration No: {student.regNo}</p>
                        <p>Contact: {student.contact}</p>
                        <p>Age: {student.age}</p>
                        <p>Student Username: {student.username}</p>
                        <p>Class: {student.class}</p>
                        <p>Section: {student.section}</p>
                        <button onClick={() => handleUpdateClick(student)}>Update</button>
                        <button onClick={() => handleDelete(student.studentId)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No students found</p>
            )}
        </div>
    );
};

export default AdminCreateStudent;
