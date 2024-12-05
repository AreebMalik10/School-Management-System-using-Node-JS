import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after logout
import ChallanForm from './challanForm';
import ViewChallanAdmin from './viewChallanAdmin';

const AdminDashboard = () => {
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [students, setStudents] = useState([]); // State for fetched students
    const [loading, setLoading] = useState(false);
    const [studentIdToUpdate, setStudentIdToUpdate] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate(); // For redirecting to login page after logout
    const [teachers, setTeachers] = useState([]);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [parents, setParents] = useState([]);
    const [updatedName, setUpdatedName] = useState('');
    const [updatedChildrenName, setUpdatedChildrenName] = useState('');
    const [updatedOccupation, setUpdatedOccupation] = useState('');
    const [updatedContact, setUpdatedContact] = useState('');
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedPassword, setUpdatedPassword] = useState('');
    const [editingParent, setEditingParent] = useState(null);

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

        const studentDataWithAdminId = {
            ...studentData,
            adminId,
            class: studentData.class, // Add class
            section: studentData.section // Add section
        };

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
                password: '',
                class: '',  // Reset class
                section: '' // Reset section
            });
        } catch (error) {
            console.error('Error creating student:', error);
            alert('Error creating student');
        }
    };



    // Handle teacher submission
    const handleTeacherSubmit = async (e) => {
        e.preventDefault();

        const adminId = localStorage.getItem('adminId');

        if (!adminId) {
            alert('Admin ID not found. Please log in again.');
            navigate('/adminlogin');
            return;
        }

        const teacherDataWithAdminId = { ...teacherData, adminId };

        try {
            const response = await axios.post('http://localhost:5000/manageroute/createTeacher', teacherDataWithAdminId);
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

        // Get adminId from localStorage
        const adminId = localStorage.getItem('adminId');
        if (!adminId) {
            alert('Admin ID not found. Please log in again.');
            return;
        }

        const dataToSend = {
            ...parentData,
            adminId: adminId // Adding adminId to the data
        };

        try {
            const response = await axios.post('http://localhost:5000/manageroute/createParent', dataToSend);
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
            password: '', // Password field will be updated by the admin
            class: student.class,
            section: student.section
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

    //teachers ko fetch karwa rahay
    useEffect(() => {
        const adminId = localStorage.getItem('adminId');

        if (!adminId) {
            alert('Admin ID not found. Please log in again.');
            navigate('/adminlogin');
            return;
        }

        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/manageroute/getTeachersByAdmin/${adminId}`);
                setTeachers(response.data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, []);

    // Handle teacher update
    const handleUpdateTeacher = async (id) => {
        try {
            await axios.put(`http://localhost:5000/manageroute/updateTeacher/${id}`, editingTeacher);
            alert('Teacher updated successfully');
            setEditingTeacher(null);
            setTeachers((prev) =>
                prev.map((teacher) =>
                    teacher.id === id ? { ...teacher, ...editingTeacher } : teacher
                )
            );
        } catch (error) {
            console.error('Error updating teacher:', error);
        }
    };

    // Handle teacher delete
    const handleDeleteTeacher = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/manageroute/deleteTeacher/${id}`);
            alert('Teacher deleted successfully');
            setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };


    // Fetch parents for the logged-in admin
    useEffect(() => {
        const adminId = localStorage.getItem('adminId');

        if (!adminId) {
            alert('Admin ID not found. Please log in again.');
            navigate('/adminlogin');
            return;
        }

        const fetchParents = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/manageroute/getParentsByAdmin/${adminId}`);
                setParents(response.data);
            } catch (error) {
                console.error('Error fetching parents:', error);
            }
        };

        fetchParents();
    }, []);

    const handleParentUpdate = async (parentId) => {
        const updatedParentData = {
            name: updatedName,
            childrenName: updatedChildrenName,
            occupation: updatedOccupation,
            contact: updatedContact,
            username: updatedUsername,
            password: updatedPassword, // Optionally update password
        };

        try {
            await axios.put(`http://localhost:5000/manageroute/updateParent/${parentId}`, updatedParentData);
            alert('Parent updated successfully');
            // Optionally reload or update the UI with the new data after the update
            setParents(parents.map((parent) =>
                parent.id === parentId ? { ...parent, ...updatedParentData } : parent
            ));
            setEditingParent(null); // Close the form after updating
        } catch (error) {
            console.error('Error updating parent:', error);
            alert('Error updating parent');
        }
    };

    // Set the editing parent data into the form fields
    const handleEditParent = (parent) => {
        setEditingParent(parent);
        setUpdatedName(parent.name);
        setUpdatedChildrenName(parent.childrenName);
        setUpdatedOccupation(parent.occupation);
        setUpdatedContact(parent.contact);
        setUpdatedUsername(parent.username);
        setUpdatedPassword(''); // Reset password field (optional)
    };



    // Handle parent delete
    const handleParentDelete = async (parentId) => {
        try {
            await axios.delete(`http://localhost:5000/manageroute/deleteParent/${parentId}`);
            alert('Parent deleted successfully');
            // Optionally update the UI to reflect the deletion (e.g., by filtering out the deleted parent)
        } catch (error) {
            console.error('Error deleting parent:', error);
            alert('Error deleting parent');
        }
    };


    const [leaveRequests, setLeaveRequests] = useState([]);
    const [adminId, setAdminId] = useState(''); // Admin ID from login or session
    const [message, setMessage] = useState('');


    useEffect(() => {
        // Get the adminId from session or login
        setAdminId(localStorage.getItem('adminId')); // Assuming adminId is stored in localStorage

        if (adminId) {
            // Fetch the leave requests for the specific admin
            axios
                .get('http://localhost:5000/manageroute/viewLeaveRequests', {
                    params: { adminId: adminId }
                })
                .then(response => {
                    setLeaveRequests(response.data.leaveRequests);
                })
                .catch(error => {
                    console.error('There was an error fetching the leave requests!', error);
                });
        }
    }, [adminId]);

    const handleUpdateStatus = (leaveRequestId, newStatus) => {
        // Update the status of the leave request (Approve/Reject)
        axios
            .put(`http://localhost:5000/manageroute/updateLeaveRequest/${leaveRequestId}`, {
                status: newStatus
            })
            .then((response) => {
                // Update the UI to reflect the new status
                setLeaveRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.id === leaveRequestId
                            ? { ...request, status: newStatus }
                            : request
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating leave request status:', error);
            });
    };








    return (
        <div>

            <h1>Admin Dashboard</h1>
            <h2>Welcome, {adminName}</h2>
            <p>Email: {adminEmail}</p>
            <button onClick={handleLogout}>Logout</button>

            <div>
                {/* Student Form */}
                <h3>Create Student</h3>
                <h3>Create Student</h3>
                <form onSubmit={handleStudentSubmit}>
                    <input type="text" name="name" value={studentData.name} onChange={(e) => handleInputChange(e, 'student')} placeholder="Student Name" required />
                    <input type="text" name="fatherName" value={studentData.fatherName} onChange={(e) => handleInputChange(e, 'student')} placeholder="Father's Name" required />
                    <input type="text" name="regNo" value={studentData.regNo} onChange={(e) => handleInputChange(e, 'student')} placeholder="Registration No" required />
                    <input type="text" name="contact" value={studentData.contact} onChange={(e) => handleInputChange(e, 'student')} placeholder="Contact" required />
                    <input type="number" name="age" value={studentData.age} onChange={(e) => handleInputChange(e, 'student')} placeholder="Age" required />
                    <input type="text" name="username" value={studentData.username} onChange={(e) => handleInputChange(e, 'student')} placeholder="Username" required />
                    <input type="password" name="password" value={studentData.password} onChange={(e) => handleInputChange(e, 'student')} placeholder="Password" required />
                    <input type="text" name="class" value={studentData.class} onChange={(e) => handleInputChange(e, 'student')} placeholder="Class" required />
                    <input type="text" name="section" value={studentData.section} onChange={(e) => handleInputChange(e, 'student')} placeholder="Section" required />
                    <button type="submit">Create Student</button>
                </form>
            </div>


            {/* Teacher Form */}
            <div>
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
            </div>

            {/* Parent Form */}
            <div>
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
            </div>

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
                                <p>Class: {student.class}</p>  {/* Display Class */}
                                <p>Section: {student.section}</p>  {/* Display Section */}
                                <button onClick={() => handleUpdate(student)}>Update</button>
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
                        <input
                            type="text"
                            value={studentData.class}
                            onChange={(e) => setStudentData({ ...studentData, class: e.target.value })}
                            placeholder="Class"
                            required
                        />
                        <input
                            type="text"
                            value={studentData.section}
                            onChange={(e) => setStudentData({ ...studentData, section: e.target.value })}
                            placeholder="Section"
                            required
                        />

                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setIsUpdating(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <h4>List of Teachers</h4>
            {loading ? (
                <p>Loading teachers...</p>
            ) : (
                <ul>
                    {teachers.length > 0 ? (
                        teachers.map((teacher) => (
                            <li key={teacher.id}>
                                <p>Name: {teacher.name}</p>
                                <p>Contact: {teacher.contact}</p>
                                <p>Education: {teacher.education}</p>
                                <p>Experience: {teacher.experience}</p>
                                <p>Pay: {teacher.pay}</p>
                                <p>Username: {teacher.username}</p>
                                <button onClick={() => setEditingTeacher(teacher)}>Update</button>
                                <button onClick={() => handleDeleteTeacher(teacher.id)}>Delete</button>


                            </li>
                        ))
                    ) : (
                        <li>No teachers found</li>
                    )}
                    {/* Edit Teacher Form */}
                    {editingTeacher && (
                        <div>
                            <h3>Update Teacher</h3>
                            <form onSubmit={() => handleUpdateTeacher(editingTeacher.id)}>
                                <input
                                    type="text"
                                    name="name"
                                    value={editingTeacher.name}
                                    onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                                    placeholder="Name"
                                    required
                                />
                                <input
                                    type="text"
                                    name="contact"
                                    value={editingTeacher.contact}
                                    onChange={(e) => setEditingTeacher({ ...editingTeacher, contact: e.target.value })}
                                    placeholder="Contact"
                                    required
                                />
                                <input
                                    type="text"
                                    name="education"
                                    value={editingTeacher.education}
                                    onChange={(e) => setEditingTeacher({ ...editingTeacher, education: e.target.value })}
                                    placeholder="Education"
                                    required
                                />
                                <input
                                    type="text"
                                    name="experience"
                                    value={editingTeacher.experience}
                                    onChange={(e) => setEditingTeacher({ ...editingTeacher, experience: e.target.value })}
                                    placeholder="Experience"
                                    required
                                />
                                <input
                                    type="number"
                                    name="pay"
                                    value={editingTeacher.pay}
                                    onChange={(e) => setEditingTeacher({ ...editingTeacher, pay: e.target.value })}
                                    placeholder="Pay"
                                    required
                                />
                                <input
                                    type="text"
                                    name="username"
                                    value={editingTeacher.username}
                                    onChange={(e) => setEditingTeacher({ ...editingTeacher, username: e.target.value })}
                                    placeholder="Username"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={editingTeacher.password}
                                    onChange={(e) => setEditingTeacher({ ...editingTeacher, password: e.target.value })}
                                />
                                <button type="submit">Update</button>
                                <button type="button" onClick={() => setEditingTeacher(null)}>Cancel</button>
                            </form>
                        </div>
                    )}

                </ul>

            )}

            <div>
                <h2>Leave Requests</h2>
                {leaveRequests.length === 0 ? (
                    <p>No leave requests available.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Teacher Username</th>
                                <th>Reason</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.teacherUsername}</td>
                                    <td>{request.reason}</td>
                                    <td>{request.startDate}</td>
                                    <td>{request.endDate}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <button
                                            onClick={() => handleUpdateStatus(request.id, 'Approved')}
                                            disabled={request.status === 'Approved'}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                                            disabled={request.status === 'Rejected'}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>




            {/* List of Parents */}
            <h4>List of Parents</h4>
            {loading ? (
                <p>Loading parents...</p>
            ) : (
                <ul>
                    {parents.length > 0 ? (
                        parents.map((parent) => (
                            <li key={parent.id}>
                                <p>Name: {parent.name}</p>
                                <p>Children: {parent.childrenName}</p>
                                <p>Occupation: {parent.occupation}</p>
                                <p>Contact: {parent.contact}</p>
                                <p>Username: {parent.username}</p>
                                <button onClick={() => handleEditParent(parent)}>Update</button>
                                <button onClick={() => handleParentDelete(parent.id)}>Delete</button>
                            </li>
                        ))
                    ) : (
                        <li>No parents found</li>
                    )}

                    {/* Edit Parent Form */}
                    {editingParent && (
                        <div>
                            <h3>Update Parent</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleParentUpdate(editingParent.id); }}>
                                <input
                                    type="text"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                    placeholder="Name"
                                    required
                                />
                                <input
                                    type="text"
                                    value={updatedChildrenName}
                                    onChange={(e) => setUpdatedChildrenName(e.target.value)}
                                    placeholder="Children's Name"
                                    required
                                />
                                <input
                                    type="text"
                                    value={updatedOccupation}
                                    onChange={(e) => setUpdatedOccupation(e.target.value)}
                                    placeholder="Occupation"
                                    required
                                />
                                <input
                                    type="text"
                                    value={updatedContact}
                                    onChange={(e) => setUpdatedContact(e.target.value)}
                                    placeholder="Contact"
                                    required
                                />
                                <input
                                    type="text"
                                    value={updatedUsername}
                                    onChange={(e) => setUpdatedUsername(e.target.value)}
                                    placeholder="Username"
                                    required
                                />
                                <input
                                    type="password"
                                    value={updatedPassword}
                                    onChange={(e) => setUpdatedPassword(e.target.value)}
                                    placeholder="Password (optional)"
                                />
                                <button type="submit">Update</button>
                                <button type="button" onClick={() => setEditingParent(null)}>Cancel</button>
                            </form>
                        </div>
                    )}
                </ul>
            )}

            <div>
                <ChallanForm />
            </div>

            <div>
                <ViewChallanAdmin />
            </div>



        </div>
    );
};

export default AdminDashboard;
