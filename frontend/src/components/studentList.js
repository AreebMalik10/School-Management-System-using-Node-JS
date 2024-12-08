import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [studentData, setStudentData] = useState({
        name: '',
        fatherName: '',
        regNo: '',
        contact: '',
        age: '',
        username: '',
        class: '',
        section: ''
    });

    // Fetching students on component load
    useEffect(() => {
        fetchStudents();
    }, []);

    // Fetch the list of students
    const fetchStudents = () => {
        axios.get('http://localhost:5000/manageroute/getStudents?adminId=YOUR_ADMIN_ID')
            .then(response => setStudents(response.data))
            .catch(error => console.error('Error fetching students:', error));
    };

    // Handle the changes in the input fields for update
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prev => ({ ...prev, [name]: value }));
    };

    // Handle the form submission for updating student
    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/manageroute/updateStudent/${selectedStudentId}`, studentData)
            .then(response => {
                alert(response.data.message);
                fetchStudents();
                setSelectedStudentId(null);  // Reset after update
            })
            .catch(error => console.error('Error updating student:', error));
    };

    // Handle the deletion of a student
    const handleDelete = (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            axios.delete(`http://localhost:5000/manageroute/deleteStudent/${studentId}`)
                .then(response => {
                    alert(response.data.message);
                    fetchStudents();
                })
                .catch(error => console.error('Error deleting student:', error));
        }
    };

    // Fetch and set the data for the student being updated
    useEffect(() => {
        if (selectedStudentId) {
            axios.get(`http://localhost:5000/manageroute/getStudent/${selectedStudentId}`)
                .then(response => setStudentData(response.data))
                .catch(error => console.error('Error fetching student data:', error));
        }
    }, [selectedStudentId]);

    return (
        <div>
            <h1>Student List</h1>
            <ul>
                {students.map(student => (
                    <li key={student.student_id}>
                        <span>{student.name}</span>
                        <button onClick={() => setSelectedStudentId(student.student_id)}>Edit</button>
                        <button onClick={() => handleDelete(student.student_id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {selectedStudentId && (
                <form onSubmit={handleUpdate}>
                    <h2>Edit Student</h2>
                    <input
                        type="text"
                        name="name"
                        value={studentData.name}
                        onChange={handleChange}
                        placeholder="Student Name"
                        required
                    />
                    <input
                        type="text"
                        name="fatherName"
                        value={studentData.fatherName}
                        onChange={handleChange}
                        placeholder="Father's Name"
                        required
                    />
                    <input
                        type="text"
                        name="regNo"
                        value={studentData.regNo}
                        onChange={handleChange}
                        placeholder="Registration Number"
                        required
                    />
                    <input
                        type="text"
                        name="contact"
                        value={studentData.contact}
                        onChange={handleChange}
                        placeholder="Contact Number"
                        required
                    />
                    <input
                        type="number"
                        name="age"
                        value={studentData.age}
                        onChange={handleChange}
                        placeholder="Age"
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        value={studentData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="text"
                        name="class"
                        value={studentData.class}
                        onChange={handleChange}
                        placeholder="Class"
                        required
                    />
                    <input
                        type="text"
                        name="section"
                        value={studentData.section}
                        onChange={handleChange}
                        placeholder="Section"
                        required
                    />
                    <button type="submit">Update Student</button>
                </form>
            )}
        </div>
    );
};

export default StudentList;
