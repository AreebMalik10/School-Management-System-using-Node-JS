import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after logout

const AdminDashboard = () => {
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [students, setStudents] = useState([]); // State for fetched students
    const [loading, setLoading] = useState(false);
    const [studentIdToUpdate, setStudentIdToUpdate] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate(); // For redirecting to login page after logout

    // State for forms
    const [studentData, setStudentData] = useState({
        name: '',
        fatherName: '',
        regNo: '',
        contact: '',
        age: '',
        username: '',
        password: ''
    });

    const [teacherData, setTeacherData] = useState({
        name: '',
        contact: '',
        education: '',
        experience: '',
        pay: '',
        username: '',
        password: ''
    });

    const [parentData, setParentData] = useState({
        name: '',
        childrenName: '',
        occupation: '',
        contact: '',
        username: '',
        password: ''
    });

    // Retrieve admin's details from localStorage
    useEffect(() => {
        const name = localStorage.getItem('adminName');
        const email = localStorage.getItem('adminEmail');

        if (name && email) {
            setAdminName(name);
            setAdminEmail(email);
        } else {
            navigate('/adminlogin'); // Redirect to login if not found
        }
    }, [navigate]);

    // Logout function
    const handleLogout = async () => {
        try {
            await axios.post('/api/logout'); // Backend route to invalidate token (optional)
        } catch (error) {
            console.log('Error during logout:', error);
        }

        // Clear the localStorage
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminToken'); // Assuming you're storing the token in localStorage

        // Redirect to login page
        navigate('/adminlogin');
    };

    // Handle form input change
    const handleInputChange = (e, entity) => {
        const { name, value } = e.target;
        if (entity === 'student') {
            setStudentData(prevState => ({ ...prevState, [name]: value }));
        } else if (entity === 'teacher') {
            setTeacherData(prevState => ({ ...prevState, [name]: value }));
        } else if (entity === 'parent') {
            setParentData(prevState => ({ ...prevState, [name]: value }));
        }
    };

// Handle student submission
const handleStudentSubmit = async (e) => {
    e.preventDefault();
    
    const adminId = localStorage.getItem('adminId'); // Admin ID from localStorage
    
    if (!adminId) {
        alert('Admin ID not found. Please log in again.');
        navigate('/adminlogin');
        return;
    }

    // Include adminId in student data
    const studentDataWithAdminId = { ...studentData, adminId }; 

    try {
        const response = await axios.post('http://localhost:5000/manageroute/createStudent', studentDataWithAdminId);
        alert('Student created successfully');
        setStudentData({
            name: '',
            fatherName: '',
            regNo: '',
            contact: '',
            age: '',
            username: '',
            password: ''
        });
    } catch (error) {
        console.error('Error creating student:', error);
        alert('Error creating student');
    }
};


    // Handle teacher submission
    const handleTeacherSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/manageroute/createTeacher', teacherData); // Your backend endpoint
            alert('Teacher created successfully');
            setTeacherData({
                name: '',
                contact: '',
                education: '',
                experience: '',
                pay: '',
                username: '',
                password: ''
            });
        } catch (error) {
            console.error('Error creating teacher:', error);
            alert('Error creating teacher');
        }
    };

    // Handle parent submission
    const handleParentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/manageroute/createParent', parentData); // Your backend endpoint
            alert('Parent created successfully');
            setParentData({
                name: '',
                childrenName: '',
                occupation: '',
                contact: '',
                username: '',
                password: ''
            });
        } catch (error) {
            console.error('Error creating parent:', error);
            alert('Error creating parent');
        }
    };

     // Fetch students
     useEffect(() => {
        const adminId = localStorage.getItem('adminId'); // Admin ID from localStorage
    
        if (!adminId) {
            alert('Admin ID not found. Please log in again.');
            navigate('/adminlogin');
            return;
        }
    
        // Fetch students for specific admin
        axios.get(`http://localhost:5000/manageroute/getStudents?adminId=${adminId}`)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }, []);

    const handleUpdate = (student) => {
        // Populate the update form with the current student data
        setStudentData({
            name: student.name,
            fatherName: student.fatherName,
            regNo: student.regNo,
            contact: student.contact,
            age: student.age,
            username: student.username,
            password: '' // Password field will be updated by the admin
        });
    
        setIsUpdating(true); // Show the update form
        setStudentIdToUpdate(student.id); // Save the student ID for updating
    };
    
    // Handle Update form submit
    const handleStudentUpdate = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.put(
                `http://localhost:5000/manageroute/updateStudent/${studentIdToUpdate}`,
                studentData
            );
            alert(response.data.message);
            setIsUpdating(false);
            setStudents(
                students.map((student) =>
                    student.id === studentIdToUpdate ? { ...student, ...studentData } : student
                )
            );
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Error updating student');
        }
    };
    


    
    const handleDelete = async (studentId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/manageroute/deleteStudent/${studentId}`);
            alert(response.data.message);
            // Student list ko refresh karen
            setStudents(students.filter((student) => student.id !== studentId));
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Error deleting student');
        }
    };
    
    
    
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Welcome, {adminName}</h2>
            <p>Email: {adminEmail}</p>
            <button onClick={handleLogout}>Logout</button>

            {/* Student Form */}
            <h3>Create Student</h3>
            <form onSubmit={handleStudentSubmit}>
                <input type="text" name="name" value={studentData.name} onChange={(e) => handleInputChange(e, 'student')} placeholder="Student Name" required />
                <input type="text" name="fatherName" value={studentData.fatherName} onChange={(e) => handleInputChange(e, 'student')} placeholder="Father's Name" required />
                <input type="text" name="regNo" value={studentData.regNo} onChange={(e) => handleInputChange(e, 'student')} placeholder="Registration No" required />
                <input type="text" name="contact" value={studentData.contact} onChange={(e) => handleInputChange(e, 'student')} placeholder="Contact" required />
                <input type="number" name="age" value={studentData.age} onChange={(e) => handleInputChange(e, 'student')} placeholder="Age" required />
                <input type="text" name="username" value={studentData.username} onChange={(e) => handleInputChange(e, 'student')} placeholder="Username" required />
                <input type="password" name="password" value={studentData.password} onChange={(e) => handleInputChange(e, 'student')} placeholder="Password" required />
                <button type="submit">Create Student</button>
            </form>

            {/* Teacher Form */}
            <h3>Create Teacher</h3>
            <form onSubmit={handleTeacherSubmit}>
                <input type="text" name="name" value={teacherData.name} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Teacher Name" required />
                <input type="text" name="contact" value={teacherData.contact} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Contact" required />
                <input type="text" name="education" value={teacherData.education} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Education" required />
                <input type="text" name="experience" value={teacherData.experience} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Experience" required />
                <input type="number" name="pay" value={teacherData.pay} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Pay" required />
                <input type="text" name="username" value={teacherData.username} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Username" required />
                <input type="password" name="password" value={teacherData.password} onChange={(e) => handleInputChange(e, 'teacher')} placeholder="Password" required />
                <button type="submit">Create Teacher</button>
            </form>

            {/* Parent Form */}
            <h3>Create Parent</h3>
            <form onSubmit={handleParentSubmit}>
                <input type="text" name="name" value={parentData.name} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Parent Name" required />
                <input type="text" name="childrenName" value={parentData.childrenName} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Children Name" required />
                <input type="text" name="occupation" value={parentData.occupation} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Occupation" required />
                <input type="text" name="contact" value={parentData.contact} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Contact" required />
                <input type="text" name="username" value={parentData.username} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Username" required />
                <input type="password" name="password" value={parentData.password} onChange={(e) => handleInputChange(e, 'parent')} placeholder="Password" required />
                <button type="submit">Create Parent</button>
            </form>

            <h3>Admin Dashboard</h3>
            <h4>List of Students</h4>
            {loading ? (
                <p>Loading students...</p>
            ) : (
                <ul>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <li key={student.id}>
                                <p>Name: {student.name}</p>
                                <p>Father's Name: {student.fatherName}</p>
                                <p>Registration No: {student.regNo}</p>
                                <p>Contact: {student.contact}</p>
                                <p>Age: {student.age}</p>
                                <p>Username: {student.username}</p>
                                <p>Password: {student.password}</p>

                                {/* Update Button */}
                                <button onClick={() => handleUpdate(student)}>Update</button>

                                {/* Delete Button */}
                                <button onClick={() => handleDelete(student.id)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <li>No students found</li>
                    )}
                </ul>
            )}

            {/* Update Student Form */}
            {isUpdating && (
                <div>
                    <h4>Update Student</h4>
                    <form onSubmit={handleStudentUpdate}>
                        <input
                            type="text"
                            value={studentData.name}
                            onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                            placeholder="Name"
                            required
                        />
                        <input
                            type="text"
                            value={studentData.fatherName}
                            onChange={(e) => setStudentData({ ...studentData, fatherName: e.target.value })}
                            placeholder="Father's Name"
                            required
                        />
                        <input
                            type="text"
                            value={studentData.regNo}
                            onChange={(e) => setStudentData({ ...studentData, regNo: e.target.value })}
                            placeholder="Registration No"
                            required
                        />
                        <input
                            type="text"
                            value={studentData.contact}
                            onChange={(e) => setStudentData({ ...studentData, contact: e.target.value })}
                            placeholder="Contact"
                            required
                        />
                        <input
                            type="number"
                            value={studentData.age}
                            onChange={(e) => setStudentData({ ...studentData, age: e.target.value })}
                            placeholder="Age"
                            required
                        />
                        <input
                            type="text"
                            value={studentData.username}
                            onChange={(e) => setStudentData({ ...studentData, username: e.target.value })}
                            placeholder="Username"
                            required
                        />
                         <input
                            type="text"
                            value={studentData.password}
                            onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                            placeholder="Password"
                            required
                        />
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setIsUpdating(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
