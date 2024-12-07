import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FetchClasses = () => {
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [editingClass, setEditingClass] = useState(null);
    const [className, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [teacherUsername, setTeacherUsername] = useState('');


    // Get admin ID from local storage
    const adminId = localStorage.getItem('adminId');

    useEffect(() => {
        const fetchClasses = async () => {
            if (!adminId) {
                setMessage("Admin ID not found in session. Please log in again.");
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/admin1/getclasses', {
                    params: { admin_id: adminId },
                });

                setClasses(response.data.data);
                setMessage(response.data.message);
            } catch (error) {
                console.error("Error fetching classes:", error);
                if (error.response && error.response.data && error.response.data.message) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage("There was an error fetching the classes. Please try again.");
                }
            }
        };

        fetchClasses();
    }, [adminId]);

    const handleUpdate = async (id) => {
        try {
            const payload = { class_name: className, section, teacher_username: teacherUsername };
            const response = await axios.put(`http://localhost:5000/admin1/updateclass/${id}`, payload);
            setMessage(response.data.message);
            setEditingClass(null); // Exit edit mode
            setClasses((prev) =>
                prev.map((cls) =>
                    cls.id === id
                        ? { ...cls, class_name: className, section, teacher_username: teacherUsername }
                        : cls
                )
            );
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error("Error updating class:", error);
            }
        }
    };
    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/admin1/deleteclass/${id}`);
            setMessage('Class deleted successfully.');
            setClasses((prev) => prev.filter((cls) => cls.id !== id));
        } catch (error) {
            console.error("Error deleting class:", error);
        }
    };


    return (
        <div>
        <h3>Your Classes</h3>
        {message && <p>{message}</p>}
        {classes.length > 0 ? (
            <table>
                <thead>
                    <tr>
                        <th>Class Name</th>
                        <th>Section</th>
                        <th>Class Teachers</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((cls) => (
                        <tr key={cls.id}>
                            <td>
                                {editingClass === cls.id ? (
                                    <input
                                        type="text"
                                        value={className}
                                        onChange={(e) => setClassName(e.target.value)}
                                        placeholder="Class Name"
                                    />
                                ) : (
                                    cls.class_name
                                )}
                            </td>
                            <td>
                                {editingClass === cls.id ? (
                                    <input
                                        type="number"
                                        value={section}
                                        onChange={(e) => setSection(e.target.value)}
                                        placeholder="Section"
                                    />
                                ) : (
                                    cls.section
                                )}
                            </td>
                            <td>
                                {editingClass === cls.id ? (
                                    <input
                                        type="text"
                                        value={teacherUsername}
                                        onChange={(e) => setTeacherUsername(e.target.value)}
                                        placeholder="Teacher Username"
                                    />
                                ) : (
                                    cls.teacher_username || 'Not Assigned'
                                )}
                            </td>
                            <td>
                                {editingClass === cls.id ? (
                                    <>
                                        <button onClick={() => handleUpdate(cls.id)}>
                                            Save
                                        </button>
                                        <button onClick={() => setEditingClass(null)}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingClass(cls.id);
                                                setClassName(cls.class_name);
                                                setSection(cls.section);
                                                setTeacherUsername(cls.teacher_username || '');
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(cls.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No classes found.</p>
        )}
    </div>

    );
};

export default FetchClasses;
