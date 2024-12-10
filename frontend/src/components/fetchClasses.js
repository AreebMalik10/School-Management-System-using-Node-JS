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
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
            {/* Heading */}
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Classes</h3>

            {/* Message Display */}
            {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

            {/* Table */}
            {classes.length > 0 ? (
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-gray-700">
                            <th className="py-3 px-4 text-left">Class Name</th>
                            <th className="py-3 px-4 text-left">Section</th>
                            <th className="py-3 px-4 text-left">Class Teacher</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((cls) => (
                            <tr key={cls.id} className="border-b">
                                <td className="py-4 px-4">
                                    {editingClass === cls.id ? (
                                        <input
                                            type="text"
                                            value={className}
                                            onChange={(e) => setClassName(e.target.value)}
                                            placeholder="Class Name"
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    ) : (
                                        cls.class_name
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    {editingClass === cls.id ? (
                                        <input
                                            type="number"
                                            value={section}
                                            onChange={(e) => setSection(e.target.value)}
                                            placeholder="Section"
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    ) : (
                                        cls.section
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    {editingClass === cls.id ? (
                                        <input
                                            type="text"
                                            value={teacherUsername}
                                            onChange={(e) => setTeacherUsername(e.target.value)}
                                            placeholder="Teacher Username"
                                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    ) : (
                                        cls.teacher_username || 'Not Assigned'
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    {editingClass === cls.id ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(cls.id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 mr-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(cls)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cls.id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                            >
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
                <p className="text-gray-500">No classes found.</p>
            )}
        </div>

    );
};

export default FetchClasses;
