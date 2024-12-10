import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after logout
import ChallanForm from './challanForm';
import ViewChallanAdmin from './viewChallanAdmin';
import AdminCreateClass from './adminCreateClass';
import AdminAssignTeacherToClass from './adminAssignTeacherToClass';
import FetchClasses from './fetchClasses';
import AssignSubjectToTeacher from './assignSubjectToTeacher';
import DisplayAssignedSubjectsToTeacher from './displayAssignedSubjectsToTeacher';
import AdminCreateStudent from './adminCreateStudent';
import StudentList from './studentList';

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
    const [updatedChildUsername, setUpdatedChildUserName] = useState('');

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
        password: '',
        childUsername: ''

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
                password: '',
                childUsername: ''
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
            childUsername: updatedChildUsername ,
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
        setUpdatedChildUserName(parent.childUsername);
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

            {/* <div>
                {/* Student Form }
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
            </div> */}

            <div className='mb-10 mt-10'>
                <AdminCreateStudent/>
            </div>

            


            {/* Teacher Form */}
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-10">
    {/* Teacher Form */}
    <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-700 mb-6">Create Teacher</h3>
        <form onSubmit={handleTeacherSubmit} className="space-y-4">
            {['name', 'contact', 'education', 'experience', 'pay', 'username', 'password'].map((field) => (
                <div key={field}>
                    <label
                        htmlFor={field}
                        className="block text-sm font-medium text-gray-600 mb-1 capitalize"
                    >
                        {field.replace(/^\w/, (c) => c.toUpperCase())}
                    </label>
                    <input
                        type={field === 'pay' ? 'number' : field === 'password' ? 'password' : 'text'}
                        name={field}
                        id={field}
                        value={teacherData[field]}
                        onChange={(e) => handleInputChange(e, 'teacher')}
                        placeholder={`Enter ${field}`}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            ))}
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Create Teacher
            </button>
        </form>
    </div>

    {/* List of Teachers */}
    <h4 className="text-xl font-semibold text-gray-700 mb-4">List of Teachers</h4>
    {loading ? (
        <p className="text-gray-500">Loading teachers...</p>
    ) : (
        <div className="space-y-4">
            {teachers.length > 0 ? (
                teachers.map((teacher) => (
                    <div key={teacher.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <p>
                            <span className="font-semibold">Name:</span> {teacher.name}
                        </p>
                        <p>
                            <span className="font-semibold">Contact:</span> {teacher.contact}
                        </p>
                        <p>
                            <span className="font-semibold">Education:</span> {teacher.education}
                        </p>
                        <p>
                            <span className="font-semibold">Experience:</span> {teacher.experience}
                        </p>
                        <p>
                            <span className="font-semibold">Pay:</span> {teacher.pay}
                        </p>
                        <p>
                            <span className="font-semibold">Username:</span> {teacher.username}
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={() => setEditingTeacher(teacher)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDeleteTeacher(teacher.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No teachers found</p>
            )}

            {/* Edit Teacher Form */}
            {editingTeacher && (
                <div className="mt-8 p-6 bg-gray-100 border rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Update Teacher</h3>
                    <form onSubmit={() => handleUpdateTeacher(editingTeacher.id)} className="space-y-4">
                        {['name', 'contact', 'education', 'experience', 'pay', 'username', 'password'].map((field) => (
                            <div key={field}>
                                <label
                                    htmlFor={field}
                                    className="block text-sm font-medium text-gray-600 mb-1 capitalize"
                                >
                                    {field.replace(/^\w/, (c) => c.toUpperCase())}
                                </label>
                                <input
                                    type={field === 'pay' ? 'number' : field === 'password' ? 'password' : 'text'}
                                    name={field}
                                    id={field}
                                    value={editingTeacher[field]}
                                    onChange={(e) =>
                                        setEditingTeacher({
                                            ...editingTeacher,
                                            [field]: e.target.value,
                                        })
                                    }
                                    placeholder={`Update ${field}`}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingTeacher(null)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )}
</div>


            {/* Parent Form */}
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-10">
    {/* Parent Form */}
    <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-700 mb-6">Create Parent</h3>
        <form onSubmit={handleParentSubmit} className="space-y-4">
            {['name', 'childrenName', 'childUsername', 'occupation', 'contact', 'username', 'password'].map((field) => (
                <div key={field}>
                    <label
                        htmlFor={field}
                        className="block text-sm font-medium text-gray-600 mb-1 capitalize"
                    >
                        {field.replace(/^\w/, (c) => c.toUpperCase())}
                    </label>
                    <input
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        id={field}
                        value={parentData[field]}
                        onChange={(e) => handleInputChange(e, 'parent')}
                        placeholder={`Enter ${field}`}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            ))}
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Create Parent
            </button>
        </form>
    </div>

    {/* List of Parents */}
    <h4 className="text-xl font-semibold text-gray-700 mb-4">List of Parents</h4>
    {loading ? (
        <p className="text-gray-500">Loading parents...</p>
    ) : (
        <div className="space-y-4">
            {parents.length > 0 ? (
                parents.map((parent) => (
                    <div key={parent.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <p>
                            <span className="font-semibold">Name:</span> {parent.name}
                        </p>
                        <p>
                            <span className="font-semibold">Children:</span> {parent.childrenName}
                        </p>
                        <p>
                            <span className="font-semibold">Child Username:</span> {parent.childUsername}
                        </p>
                        <p>
                            <span className="font-semibold">Occupation:</span> {parent.occupation}
                        </p>
                        <p>
                            <span className="font-semibold">Contact:</span> {parent.contact}
                        </p>
                        <p>
                            <span className="font-semibold">Username:</span> {parent.username}
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={() => handleEditParent(parent)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleParentDelete(parent.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No parents found</p>
            )}

            {/* Edit Parent Form */}
            {editingParent && (
                <div className="mt-8 p-6 bg-gray-100 border rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Update Parent</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleParentUpdate(editingParent.id);
                        }}
                        className="space-y-4"
                    >
                        {['name', 'childrenName', 'childUsername', 'occupation', 'contact', 'username', 'password'].map((field) => (
                            <div key={field}>
                                <label
                                    htmlFor={field}
                                    className="block text-sm font-medium text-gray-600 mb-1 capitalize"
                                >
                                    {field.replace(/^\w/, (c) => c.toUpperCase())}
                                </label>
                                <input
                                    type={field === 'password' ? 'password' : 'text'}
                                    name={field}
                                    id={field}
                                    value={editingParent[field]}
                                    onChange={(e) =>
                                        setEditingParent({
                                            ...editingParent,
                                            [field]: e.target.value,
                                        })
                                    }
                                    placeholder={`Update ${field}`}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        ))}
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingParent(null)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )}
</div>


          



<div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
    {/* Heading */}
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave Requests</h2>

    {/* Leave Request Table */}
    {leaveRequests.length === 0 ? (
        <p className="text-lg text-gray-500">No leave requests available.</p>
    ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-left table-auto">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="px-4 py-2 border">Teacher Username</th>
                        <th className="px-4 py-2 border">Reason</th>
                        <th className="px-4 py-2 border">Start Date</th>
                        <th className="px-4 py-2 border">End Date</th>
                        <th className="px-4 py-2 border">Status</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveRequests.map((request) => (
                        <tr key={request.id} className="bg-gray-50 hover:bg-gray-100 transition duration-200">
                            <td className="px-4 py-2 border">{request.teacherUsername}</td>
                            <td className="px-4 py-2 border">{request.reason}</td>
                            <td className="px-4 py-2 border">{request.startDate}</td>
                            <td className="px-4 py-2 border">{request.endDate}</td>
                            <td className="px-4 py-2 border">
                                <span
                                    className={`inline-block px-2 py-1 rounded-full text-white ${
                                        request.status === 'Approved'
                                            ? 'bg-green-500'
                                            : request.status === 'Rejected'
                                            ? 'bg-red-500'
                                            : 'bg-yellow-500'
                                    }`}
                                >
                                    {request.status}
                                </span>
                            </td>
                            <td className="px-4 py-2 border flex gap-2">
                                {/* Button to approve leave */}
                                <button
                                    onClick={() => handleUpdateStatus(request.id, 'Approved')}
                                    disabled={request.status === 'Approved'}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                                >
                                    Approve
                                </button>

                                {/* Button to reject leave */}
                                <button
                                    onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                                    disabled={request.status === 'Rejected'}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}
</div>



            <div>
                <ChallanForm />
            </div>

            <div>
                <ViewChallanAdmin />
            </div>

            <div>
                <AdminCreateClass/>
            </div>

          

            <div>
                <FetchClasses />
            </div>

            <div>
                <AssignSubjectToTeacher/>
            </div>

            <div>
                <DisplayAssignedSubjectsToTeacher/>
            </div>



        </div>
    );
};

export default AdminDashboard;
