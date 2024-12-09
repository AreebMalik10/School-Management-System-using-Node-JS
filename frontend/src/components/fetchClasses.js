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
                setMessage(
                    error.response?.data?.message ||
                    "There was an error fetching the classes. Please try again."
                );
            }
        };

        fetchClasses();
    }, [adminId]);

    // Handle edit button click
    const handleEdit = (cls) => {
        setEditingClass(cls.id);
        setClassName(cls.class_name);
        setSection(cls.section);
        setTeacherUsername(cls.teacher_username || '');
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingClass(null);
        setClassName('');
        setSection('');
        setTeacherUsername('');
    };

    // Handle save updated class
    const handleSave = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5000/admin1/updateclass/${id}`, {
                class_name: className,
                section,
                teacher_username: teacherUsername,
                admin_id: adminId, // Pass admin ID
            });
    
            setMessage(response.data.message);
    
            // Update the class list locally
            setClasses((prevClasses) =>
                prevClasses.map((cls) =>
                    cls.id === id
                        ? { ...cls, class_name: className, section, teacher_username: teacherUsername }
                        : cls
                )
            );
    
            handleCancelEdit();
        } catch (error) {
            console.error("Error updating class:", error);
            setMessage(
                error.response?.data?.message || "There was an error updating the class. Please try again."
            );
        }
    };
    

    // Handle delete class
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class?")) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5000/admin1/deleteclass/${id}`, {
                data: { admin_id: adminId },
            });

            setMessage(response.data.message);

            // Remove the deleted class from the list locally
            setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== id));
        } catch (error) {
            console.error("Error deleting class:", error);
            setMessage(
                error.response?.data?.message || "There was an error deleting the class. Please try again."
            );
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
                            <th>Class Teacher</th>
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
                                            <button onClick={() => handleSave(cls.id)}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(cls)}>Edit</button>
                                            <button onClick={() => handleDelete(cls.id)}>Delete</button>
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
